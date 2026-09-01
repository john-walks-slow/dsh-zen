/**
 * Foreground time tracker — a global (non-tab-bound) service that records how
 * long each session stays in the foreground ("窗口在前台 + 会话在前台"),
 * regardless of which view tab the user is on.
 *
 * The tracker subscribes to Page Visibility API, window focus/blur, and the
 * sessions list to detect foreground state transitions. Accumulated time is
 * persisted to localStorage via a snapshot store.
 *
 * @module dsh-zen-tracker/foreground-tracker
 */

import type { Context } from "@deepseek-ai/cordis";
import type { SessionId } from "@deepseek-ai/dsh-api-remotes/client";

// ── types ──────────────────────────────────────────────────────────────────

/** Per-session foreground statistics. */
export interface SessionStats {
	/** Accumulated foreground milliseconds. */
	foregroundMs: number;
	/** Timestamp when the session first appeared in the list (ms epoch). */
	sessionStartMs: number;
	/** Timestamp when the session finished (running false→true); null = still running. */
	sessionEndMs: number | null;
	/** Session title snapshot for historical display. */
	title: string;
}

/** Whole-store shape persisted under `dsh.zen-tracker.stats`. */
export interface ForegroundStoreState {
	sessions: Record<string, SessionStats>;
}

/** The observable snapshot store interface (subset of createSnapshotStore output). */
interface SnapshotStore<T> {
	getSnapshot(): T;
	subscribe(fn: () => void): () => void;
	update(updater: (prev: T) => T): void;
	set(state: T): void;
}

/** Minimal sessions list snapshot we need. */
interface SessionListSnapshot {
	current?: SessionId;
	byId: Record<string, {
		id: SessionId;
		title?: string;
		displayTitle: string;
		running: boolean;
	}>;
}

// ── helpers ────────────────────────────────────────────────────────────────

const FLUSH_INTERVAL_MS = 5_000;
const MAX_SESSIONS = 200;
const PRUNE_AFTER_MS = 30 * 24 * 60 * 60 * 1_000; // 30 days

/** Format milliseconds as a compact human-readable duration. */
export function formatDuration(ms: number): string {
	if (ms < 1_000) return "0s";
	const totalSec = Math.floor(ms / 1_000);
	if (totalSec < 60) return `${totalSec}s`;
	const min = Math.floor(totalSec / 60);
	const sec = totalSec % 60;
	if (min < 60) return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
	const hr = Math.floor(min / 60);
	const remMin = min % 60;
	return remMin > 0 ? `${hr}h ${remMin}m` : `${hr}h`;
}

// ── tracker ────────────────────────────────────────────────────────────────

/**
 * Create and mount the foreground tracker. The tracker lives for the plugin's
 * entire lifetime; cleanup rides the caller's ctx.effect.
 *
 * @param ctx - client root context.
 * @returns the snapshot store so view components can read stats.
 */
export function initForegroundTracker(ctx: Context): SnapshotStore<ForegroundStoreState> {
	const sessions = (ctx as any).sessions as {
		list: SnapshotStore<SessionListSnapshot>;
	};

	// ── persisted store ──────────────────────────────────────────────────

	const persistKey = "dsh.zen-tracker.stats";

	const loadInitial = (): ForegroundStoreState => {
		try {
			const raw = localStorage.getItem(persistKey);
			if (raw) return JSON.parse(raw);
		} catch { /* ignore corrupt data */ }
		return { sessions: {} };
	};

	let state: ForegroundStoreState = loadInitial();

	const listeners = new Set<() => void>();

	const notify = () => {
		for (const fn of listeners) fn();
	};

	const persist = () => {
		try {
			localStorage.setItem(persistKey, JSON.stringify(state));
		} catch { /* quota or private mode */ }
	};

	const store: SnapshotStore<ForegroundStoreState> = {
		getSnapshot: () => state,
		subscribe: (fn) => {
			listeners.add(fn);
			return () => { listeners.delete(fn); };
		},
		update: (updater) => {
			state = updater(state);
			persist();
			notify();
		},
		set: (next) => {
			state = next;
			persist();
			notify();
		},
	};

	// ── tracking state ──────────────────────────────────────────────────

	let activeSessionId: SessionId | null = null;
	let lastStartMs: number | null = null;

	/** Flush the current foreground segment into the store. */
	function flushForeground(sessionId: SessionId, startMs: number): void {
		const delta = Date.now() - startMs;
		if (delta <= 0) return;
		store.update((prev) => {
			const existing = prev.sessions[sessionId] ?? {
				foregroundMs: 0,
				sessionStartMs: Date.now(),
				sessionEndMs: null,
				title: sessionId,
			};
			return {
				sessions: {
					...prev.sessions,
					[sessionId]: {
						...existing,
						foregroundMs: existing.foregroundMs + delta,
					},
				},
			};
		});
	}

	/** Prune sessions older than 30 days, keeping at most MAX_SESSIONS. */
	function pruneIfNeeded(): void {
		const now = Date.now();
		const entries = Object.entries(state.sessions);
		if (entries.length <= MAX_SESSIONS) {
			// Only prune by age
			let changed = false;
			const kept: Record<string, SessionStats> = {};
			for (const [id, stats] of entries) {
				const age = now - stats.sessionStartMs;
				if (age > PRUNE_AFTER_MS) { changed = true; continue; }
				kept[id] = stats;
			}
			if (changed) store.set({ sessions: kept });
			return;
		}
		// Sort by sessionStartMs desc, keep top MAX_SESSIONS
		entries.sort((a, b) => b[1].sessionStartMs - a[1].sessionStartMs);
		const kept: Record<string, SessionStats> = {};
		for (const [id, stats] of entries.slice(0, MAX_SESSIONS)) {
			const age = now - stats.sessionStartMs;
			if (age <= PRUNE_AFTER_MS) kept[id] = stats;
		}
		store.set({ sessions: kept });
	}

	/** Ensure a session exists in the store (called when first seen in list). */
	function ensureSession(sessionId: SessionId, title: string, running: boolean): void {
		store.update((prev) => {
			if (prev.sessions[sessionId]) {
				const existing = prev.sessions[sessionId];
				// running→finished transition
				if (existing.sessionEndMs === null && !running) {
					return {
						sessions: {
							...prev.sessions,
							[sessionId]: {
								...existing,
								title,
								sessionEndMs: Date.now(),
							},
						},
					};
				}
				// finished→running restart (clear sessionEndMs)
				if (existing.sessionEndMs !== null && running) {
					return {
						sessions: {
							...prev.sessions,
							[sessionId]: { ...existing, title, sessionEndMs: null },
						},
					};
				}
				// Update title if changed
				if (existing.title !== title) {
					return {
						sessions: {
							...prev.sessions,
							[sessionId]: { ...existing, title },
						},
					};
				}
				return prev;
			}
			return {
				sessions: {
					...prev.sessions,
					[sessionId]: {
						foregroundMs: 0,
						sessionStartMs: Date.now(),
						sessionEndMs: running ? null : Date.now(),
						title,
					},
				},
			};
		});
	}

	/** Core re-evaluation: check visibility + session selection. */
	function reevaluate(): void {
		// Zen tab does not count as "staring at screen"
		const isZenTabActive = typeof document !== "undefined" &&
			document.querySelector(".dsh-zen-root") !== null;

		const isWindowVisible = !isZenTabActive &&
			typeof document !== "undefined" &&
			!document.hidden &&
			document.hasFocus();

		const listSnap = sessions.list.getSnapshot();
		const currentId = listSnap.current ?? null;

		// Detect new sessions and running→finished transitions
		for (const [id, summary] of Object.entries(listSnap.byId)) {
			ensureSession(id, summary.displayTitle, summary.running);
		}

		// Handle session switch
		if (currentId !== activeSessionId) {
			if (activeSessionId !== null && lastStartMs !== null) {
				flushForeground(activeSessionId, lastStartMs);
				lastStartMs = null;
			}
			activeSessionId = currentId;
		}

		// Handle visibility within the same session
		if (activeSessionId !== null) {
			if (isWindowVisible && lastStartMs === null) {
				lastStartMs = Date.now();
			} else if (!isWindowVisible && lastStartMs !== null) {
				flushForeground(activeSessionId, lastStartMs);
				lastStartMs = null;
			}
		}
	}

	// ── event listeners ────────────────────────────────────────────────

	const onVisibilityChange = () => reevaluate();
	const onFocus = () => reevaluate();
	const onBlur = () => reevaluate();
	const onPageHide = () => {
		if (activeSessionId !== null && lastStartMs !== null) {
			flushForeground(activeSessionId, lastStartMs);
			lastStartMs = null;
		}
	};

	// ── periodic flush ──────────────────────────────────────────────────

	const flushTimer = setInterval(() => {
		if (activeSessionId !== null && lastStartMs !== null) {
			flushForeground(activeSessionId, lastStartMs);
			lastStartMs = Date.now(); // restart segment for next interval
		}
		pruneIfNeeded();
	}, FLUSH_INTERVAL_MS);

	// ── subscribe to sessions list ──────────────────────────────────────

	const unsubSessions = sessions.list.subscribe(() => reevaluate());

	// ── mount ───────────────────────────────────────────────────────────

	document.addEventListener("visibilitychange", onVisibilityChange);
	window.addEventListener("focus", onFocus);
	window.addEventListener("blur", onBlur);
	window.addEventListener("pagehide", onPageHide);

	// Initial evaluation
	reevaluate();

	// ── cleanup ──────────────────────────────────────────────────────────

	(ctx as any).effect(() => {
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("pagehide", onPageHide);
			clearInterval(flushTimer);
			unsubSessions();
			// Final flush
			if (activeSessionId !== null && lastStartMs !== null) {
				flushForeground(activeSessionId, lastStartMs);
				lastStartMs = null;
			}
		};
	}, "zen-tracker: foreground tracker");

	return store;
}
