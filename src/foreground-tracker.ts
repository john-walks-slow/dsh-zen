/**
 * Foreground time tracker — a global (non-tab-bound) service that records how
 * long each session stays in the foreground ("窗口在前台 + 会话在前台"),
 * regardless of which view tab the user is on.
 *
 * Two independent counters:
 * - runningMs: accumulates whenever session.running=true (regardless of visibility),
 *   excluding periods when the agent is waiting on the user (pendingInteraction)
 * - foregroundMs: accumulates only when running=true AND window visible AND not on Zen tab;
 *   visibility does not require window focus (a visible but unfocused window still counts)
 *
 * @module dsh-zen-tracker/foreground-tracker
 */

import type { Context } from "@deepseek-ai/cordis";
import type { SessionId } from "@deepseek-ai/dsh-api-remotes/client";

// ── types ──────────────────────────────────────────────────────────────────

export interface SessionStats {
	foregroundMs: number;
	runningMs: number;
	sessionStartMs: number;
	sessionEndMs: number | null;
	title: string;
}

export interface ForegroundStoreState {
	sessions: Record<string, SessionStats>;
}

interface SnapshotStore<T> {
	getSnapshot(): T;
	subscribe(fn: () => void): () => void;
	update(updater: (prev: T) => T): void;
	set(state: T): void;
}

interface SessionListSnapshot {
	current?: SessionId;
	byId: Record<string, {
		id: SessionId;
		title?: string;
		displayTitle: string;
		running: boolean;
		/** Set while the agent is waiting on the user (approval/choice/question). */
		pendingInteraction?: string;
	}>;
}

// ── helpers ────────────────────────────────────────────────────────────────

const FLUSH_INTERVAL_MS = 5_000;
const MAX_SESSIONS = 200;
const PRUNE_AFTER_MS = 30 * 24 * 60 * 60 * 1_000;

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

interface TrackerHandle {
	store: SnapshotStore<ForegroundStoreState> & {
		getLiveMs: () => { fgDelta: number; runDelta: number };
	};
	/** Mark this tracker dead (called on ctx dispose). */
	dispose(): void;
	alive: boolean;
}

/** Window-level singleton — survives HMR/module re-evaluation & duplicate injection. */
const g = globalThis as any;
const WINDOW_KEY = "__dshZenTrackerStore";

export function initForegroundTracker(ctx: Context): TrackerHandle["store"] {
	if (g[WINDOW_KEY] && g[WINDOW_KEY].alive) return g[WINDOW_KEY].store;
	if (g[WINDOW_KEY]) g[WINDOW_KEY].dispose();
	g[WINDOW_KEY] = createTracker(ctx);
	return g[WINDOW_KEY].store;
}

function createTracker(ctx: Context): TrackerHandle {
	const sessions = (ctx as any).sessions as {
		list: SnapshotStore<SessionListSnapshot>;
	};

	const persistKey = "dsh.zen-tracker.stats";

	const loadInitial = (): ForegroundStoreState => {
		try {
			const raw = localStorage.getItem(persistKey);
			if (raw) {
				const parsed = JSON.parse(raw);
				const out: Record<string, SessionStats> = {};
				for (const [id, s] of Object.entries(parsed.sessions ?? {})) {
					const src = (s ?? {}) as Record<string, unknown>;
					out[id] = {
						...src,
						runningMs: (src.runningMs as number) ?? (src.foregroundMs as number) ?? 0,
					} as SessionStats;
				}
				return { sessions: out };
			}
		} catch { /* ignore */ }
		return { sessions: {} };
	};

	let state: ForegroundStoreState = loadInitial();
	const listeners = new Set<() => void>();

	const notify = () => { for (const fn of listeners) fn(); };

	/**
	 * Merge current state with whatever is in localStorage, taking the MAX of
	 * every counter per session. Counters are monotonic (only ever grow), so
	 * even if a stale duplicate instance writes an older snapshot, this merge
	 * never lets the persisted/displayed totals go backwards (no more "清零").
	 *
	 * Sessions that exist in storage but neither in current state nor in the
	 * live session list are dropped — this is what makes pruneIfNeeded()
	 * effective instead of resurrecting every pruned session on next merge.
	 */
	const mergePersist = () => {
		try {
			let stored: Record<string, SessionStats> = {};
			const raw = localStorage.getItem(persistKey);
			if (raw) {
				const parsed = JSON.parse(raw);
				stored = parsed.sessions ?? {};
			}
			const liveIds = new Set(Object.keys(sessions.list.getSnapshot().byId));
			const merged: Record<string, SessionStats> = {};
			// 1. Sessions present in both storage and current state → max-merge.
			for (const [id, s] of Object.entries(state.sessions)) {
				const old = stored[id];
				if (!old) { merged[id] = s; continue; }
				merged[id] = {
					foregroundMs: Math.max(old.foregroundMs ?? 0, s.foregroundMs ?? 0),
					runningMs: Math.max(old.runningMs ?? 0, s.runningMs ?? 0),
					sessionStartMs: Math.min(old.sessionStartMs ?? s.sessionStartMs, s.sessionStartMs),
					sessionEndMs: s.sessionEndMs ?? old.sessionEndMs ?? null,
					title: s.title || old.title || id,
				};
			}
			// 2. Storage-only sessions: keep only if still in the live session list
			//    (cross-window sync); drop the rest (pruned/abandoned).
			for (const [id, s] of Object.entries(stored)) {
				if (!merged[id] && liveIds.has(id)) merged[id] = s;
			}
			state = { sessions: merged };
			localStorage.setItem(persistKey, JSON.stringify({ sessions: merged }));
		} catch { /* ignore */ }
	};

	const store: SnapshotStore<ForegroundStoreState> = {
		getSnapshot: () => state,
		subscribe: (fn) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
		update: (updater) => { state = updater(state); mergePersist(); notify(); },
		set: (next) => { state = next; mergePersist(); notify(); },
	};

	// ── tracking state: two independent segments ───────────────────────

	let activeSessionId: SessionId | null = null;
	let runSegStart: number | null = null;  // non-null = running segment active
	let fgSegStart: number | null = null;   // non-null = foreground segment active
	let wasRunning: boolean = false;

	/** Flush accumulated deltas into the store. null segment = skip. */
	function flush(sessionId: SessionId, runStart: number | null, fgStart: number | null): void {
		const now = Date.now();
		const runDelta = runStart !== null ? now - runStart : 0;
		const fgDelta = fgStart !== null ? now - fgStart : 0;
		if (runDelta <= 0 && fgDelta <= 0) return;
		store.update((prev) => {
			const existing = prev.sessions[sessionId] ?? {
				foregroundMs: 0,
				runningMs: 0,
				sessionStartMs: now,
				sessionEndMs: null,
				title: sessionId,
			};
			return {
				sessions: {
					...prev.sessions,
					[sessionId]: {
						...existing,
						foregroundMs: existing.foregroundMs + Math.max(0, fgDelta),
						runningMs: (existing.runningMs ?? 0) + Math.max(0, runDelta),
					},
				},
			};
		});
	}

	function pruneIfNeeded(): void {
		const now = Date.now();
		const entries = Object.entries(state.sessions);
		if (entries.length <= MAX_SESSIONS) {
			let changed = false;
			const kept: Record<string, SessionStats> = {};
			for (const [id, stats] of entries) {
				if (now - stats.sessionStartMs > PRUNE_AFTER_MS) { changed = true; continue; }
				kept[id] = stats;
			}
			if (changed) store.set({ sessions: kept });
			return;
		}
		entries.sort((a, b) => b[1].sessionStartMs - a[1].sessionStartMs);
		const kept: Record<string, SessionStats> = {};
		for (const [id, stats] of entries.slice(0, MAX_SESSIONS)) {
			if (now - stats.sessionStartMs <= PRUNE_AFTER_MS) kept[id] = stats;
		}
		store.set({ sessions: kept });
	}

	function ensureSession(sessionId: SessionId, title: string, running: boolean): void {
		store.update((prev) => {
			if (prev.sessions[sessionId]) {
				const existing = prev.sessions[sessionId];
				if (existing.sessionEndMs === null && !running) {
					return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title, sessionEndMs: Date.now() } } };
				}
				if (existing.sessionEndMs !== null && running) {
					return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title, sessionEndMs: null } } };
				}
				if (existing.title !== title) {
					return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title } } };
				}
				return prev;
			}
			return {
				sessions: {
					...prev.sessions,
					[sessionId]: { foregroundMs: 0, runningMs: 0, sessionStartMs: Date.now(), sessionEndMs: running ? null : Date.now(), title },
				},
			};
		});
	}

	function reevaluate(): void {
		const isZenTabActive = typeof document !== "undefined" && document.querySelector(".dsh-zen-root") !== null;
		// Foreground = visible & not on the Zen tab. Focus is NOT required: a window
		// that is visible but unfocused still counts as screen-watching time.
		const isWindowVisible = !isZenTabActive && typeof document !== "undefined" && !document.hidden;

		const listSnap = sessions.list.getSnapshot();
		const currentId = listSnap.current ?? null;
		const currentSession = currentId ? listSnap.byId[currentId] : null;
		// Running excludes periods where the agent is waiting on the user
		// (approval/choice/question) — that waiting is not task-running time.
		const isRunning = (currentSession?.running ?? false) && !currentSession?.pendingInteraction;

		for (const [id, summary] of Object.entries(listSnap.byId)) {
			ensureSession(id, summary.displayTitle, summary.running);
		}

		// Session switch — flush old session, reset
		if (currentId !== activeSessionId) {
			if (activeSessionId !== null) flush(activeSessionId, runSegStart, fgSegStart);
			activeSessionId = currentId;
			runSegStart = null;
			fgSegStart = null;
			wasRunning = isRunning;
		}

		// Running state changed — flush & reset both
		if (isRunning !== wasRunning) {
			if (activeSessionId !== null) flush(activeSessionId, runSegStart, fgSegStart);
			runSegStart = null;
			fgSegStart = null;
			wasRunning = isRunning;
		}

		if (activeSessionId === null) return;

		const shouldRun = isRunning;
		const shouldFg = isRunning && isWindowVisible;

		// Running segment: accumulates whenever session is running
		if (shouldRun && runSegStart === null) {
			runSegStart = Date.now();
		} else if (!shouldRun && runSegStart !== null) {
			flush(activeSessionId, runSegStart, null);
			runSegStart = null;
		}

		// Foreground segment: accumulates only when running + visible + not Zen tab
		if (shouldFg && fgSegStart === null) {
			fgSegStart = Date.now();
		} else if (!shouldFg && fgSegStart !== null) {
			flush(activeSessionId, null, fgSegStart);
			fgSegStart = null;
		}
	}

	// ── event listeners ────────────────────────────────────────────────

	const onVisibilityChange = () => reevaluate();
	const onFocus = () => reevaluate();
	const onBlur = () => reevaluate();
	const onPageHide = () => {
		if (activeSessionId !== null) {
			flush(activeSessionId, runSegStart, fgSegStart);
			runSegStart = null;
			fgSegStart = null;
		}
	};

	// ── periodic flush ──────────────────────────────────────────────────

	let alive = true;

	const flushTimer = setInterval(() => {
		if (activeSessionId !== null && (runSegStart !== null || fgSegStart !== null)) {
			flush(activeSessionId, runSegStart, fgSegStart);
			const now = Date.now();
			if (runSegStart !== null) runSegStart = now;
			if (fgSegStart !== null) fgSegStart = now;
		}
		pruneIfNeeded();
	}, FLUSH_INTERVAL_MS);

	// Cross-window sync: another tab/instance wrote storage — merge its totals in
	const onStorage = (e: StorageEvent) => {
		if (e.key !== null && e.key !== persistKey) return;
		mergePersist();
		notify();
	};

	const unsubSessions = sessions.list.subscribe(() => reevaluate());

	document.addEventListener("visibilitychange", onVisibilityChange);
	window.addEventListener("focus", onFocus);
	window.addEventListener("blur", onBlur);
	window.addEventListener("pagehide", onPageHide);
	window.addEventListener("storage", onStorage);

	reevaluate();

	const thisTracker: TrackerHandle = {
		store: {
			...store,
			getLiveMs(): { fgDelta: number; runDelta: number; sessionId: SessionId | null } {
				const now = Date.now();
				return {
					fgDelta: fgSegStart !== null ? Math.max(0, now - fgSegStart) : 0,
					runDelta: runSegStart !== null ? Math.max(0, now - runSegStart) : 0,
					sessionId: activeSessionId,
				};
			},
		},
		dispose() {
			alive = false;
			if (activeSessionId !== null) {
				flush(activeSessionId, runSegStart, fgSegStart);
				runSegStart = null;
				fgSegStart = null;
			}
			if (g[WINDOW_KEY] === thisTracker) g[WINDOW_KEY] = null;
		},
		alive,
	};

	(ctx as any).effect(() => {
		return () => {
			document.removeEventListener("visibilitychange", onVisibilityChange);
			window.removeEventListener("focus", onFocus);
			window.removeEventListener("blur", onBlur);
			window.removeEventListener("pagehide", onPageHide);
			window.removeEventListener("storage", onStorage);
			clearInterval(flushTimer);
			unsubSessions();
			if (activeSessionId !== null) {
				flush(activeSessionId, runSegStart, fgSegStart);
				runSegStart = null;
				fgSegStart = null;
			}
			thisTracker.dispose();
		};
	}, "zen-tracker: foreground tracker");

	return thisTracker;
}
