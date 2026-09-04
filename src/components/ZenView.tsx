/**
 * ZenView — the minimal "go do something else" view tab.
 *
 * Running: emoji + cute message.
 * Done: emoji + AI reply (markdown).
 * Bottom: stats row + user message row.
 *
 * @module dsh-zen-tracker/components/ZenView
 */

import React from "react";
import { formatDuration, type ForegroundStoreState } from "../foreground-tracker";
import type { ZenSettingsStore } from "../zen-settings";

// ── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
.dsh-zen-root {
	box-sizing: border-box;
	height: 100%;
	min-height: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 48px 32px 16px;
	gap: 24px;
	background: var(--dsw-alias-bg-base);
	color: var(--dsw-alias-label-primary);
	overflow: auto;
	position: relative;
}

.dsh-zen-center {
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

/* Status center: always mounted; show/hide via data-hidden + transitions.
   Kept separate from .dsh-zen-center so the done-reply block is never
   height-clipped by max-height. */
.dsh-zen-statusCenter {
	max-height: 200px;
	overflow: hidden;
	transition: opacity 0.25s ease, max-height 0.25s ease, visibility 0.25s ease;
}

.dsh-zen-statusCenter[data-hidden="true"] {
	opacity: 0;
	visibility: hidden;
	max-height: 0;
}

.dsh-zen-message {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--dsw-alias-label-secondary);
	text-align: center;
}

.dsh-zen-sub {
	font-size: 14px;
	line-height: 20px;
	color: var(--dsw-alias-label-tertiary);
}

@keyframes dsh-zen-fade-in {
	from { opacity: 0; transform: translateY(8px); }
	to { opacity: 1; transform: translateY(0); }
}

/* Animation toggle: when off, disable all entry animations and transitions */
.dsh-zen-root[data-anim="off"],
.dsh-zen-root[data-anim="off"] * {
	animation: none !important;
	transition: none !important;
}

/* ── Turn stats ───────────────────────────────────────────────────────────── */

.dsh-zen-turnStats {
	font-size: 13px;
	line-height: 20px;
	color: var(--dsw-alias-label-caption);
	font-variant-numeric: tabular-nums;
	display: flex;
	gap: 8px;
	align-items: center;
	animation: dsh-zen-fade-in 0.3s ease-out 0.15s backwards;
}

.dsh-zen-turnStats + .dsh-zen-turnStats {
	animation-delay: 0.2s;
	margin-top: -4px;
}

.dsh-zen-turnStatsSep {
	color: var(--dsw-alias-label-caption);
	opacity: 0.5;
}

.dsh-zen-statVal {
	color: var(--dsw-alias-label-caption);
}

/* ── Hint row (dotted underline, hover for tooltip) ─────────────────────── */

.dsh-zen-hint {
	position: relative;
	display: inline-flex;
	align-items: center;
	cursor: help;
}

.dsh-zen-hintText {
	color: var(--dsw-alias-label-caption);
	border-bottom: 1px dotted var(--dsw-alias-label-caption);
	transition: color 0.12s, border-color 0.12s;
}

.dsh-zen-tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(4px);
	min-width: 300px;
	padding: 12px 16px;
	background: var(--dsw-alias-bg-elevated, var(--dsw-alias-bg-base));
	border: 1px solid var(--dsw-alias-border-l1);
	border-radius: 10px;
	box-shadow: 0 4px 16px rgba(0,0,0,0.12);
	font-size: 13px;
	line-height: 22px;
	color: var(--dsw-alias-label-secondary);
	font-variant-numeric: tabular-nums;
	opacity: 0;
	visibility: hidden;
	transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
	pointer-events: none;
	z-index: 10;
}

.dsh-zen-hint:hover .dsh-zen-tooltip {
	opacity: 1;
	visibility: visible;
	transform: translateX(-50%) translateY(0);
	pointer-events: auto;
}

.dsh-zen-tooltipTitle {
	font-size: 11px;
	font-weight: 600;
	color: var(--dsw-alias-label-caption);
	margin-bottom: 6px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.dsh-zen-tooltipBody {
	max-width: 400px;
	max-height: 300px;
	overflow: auto;
	font-size: 13px;
	line-height: 22px;
	color: var(--dsw-alias-label-secondary);
}

/* Constrain markdown elements inside the tooltip */
.dsh-zen-tooltipBody > :first-child {
	margin-top: 0;
}
.dsh-zen-tooltipBody > :last-child {
	margin-bottom: 0;
}
.dsh-zen-tooltipBody p,
.dsh-zen-tooltipBody ul,
.dsh-zen-tooltipBody ol,
.dsh-zen-tooltipBody pre,
.dsh-zen-tooltipBody blockquote {
	margin: 6px 0;
}
.dsh-zen-tooltipBody h1,
.dsh-zen-tooltipBody h2,
.dsh-zen-tooltipBody h3,
.dsh-zen-tooltipBody h4 {
	margin: 8px 0 4px;
	font-size: 14px;
	line-height: 20px;
}
.dsh-zen-tooltipBody pre {
	max-width: 100%;
	overflow-x: auto;
	padding: 8px 10px;
	border-radius: 6px;
	background: var(--dsw-alias-interactive-bg-hover);
	font-size: 12px;
	line-height: 18px;
}
.dsh-zen-tooltipBody img {
	max-width: 100%;
	border-radius: 6px;
}
.dsh-zen-tooltipBody code {
	word-break: break-word;
}

.dsh-zen-tooltipRow {
	display: flex;
	justify-content: space-between;
	gap: 16px;
}

.dsh-zen-tooltipValue {
	font-weight: 600;
	color: var(--dsw-alias-label-primary);
}

.dsh-zen-tooltipDivider {
	height: 1px;
	background: var(--dsw-alias-border-l1);
	margin: 6px 0;
}

.dsh-zen-tooltipHint {
	font-size: 11px;
	color: var(--dsw-alias-label-caption);
	margin-top: 6px;
}

/* ── AI reply (markdown, bubble) ─────────────────────────────────────────── */

.dsh-zen-reply {
	width: 100%;
	max-width: 740px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 24px;
	color: var(--dsw-alias-label-primary);
	animation: dsh-zen-fade-in 0.3s ease-out 0.1s backwards;
}

/* ── User message blockquote ─────────────────────────────────────────────── */

.dsh-zen-userQuote {
	width: 100%;
	max-width: 740px;
	box-sizing: border-box;
	padding: 8px 16px;
	border-left: 3px solid var(--dsw-alias-border-l2);
	border-radius: 0 8px 8px 0;
	background: var(--dsw-alias-interactive-bg-subtle, transparent);
	font-size: 14px;
	line-height: 22px;
	color: var(--dsw-alias-label-secondary);
	white-space: pre-wrap;
	word-break: break-word;
	max-height: 200px;
	overflow: auto;
	animation: dsh-zen-fade-in 0.3s ease-out 0.08s backwards;
}
`;

if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"dsh-zen-tracker/zen-view\"]")) {
	const tag = document.createElement("style");
	tag.setAttribute("data-plugin-css", "dsh-zen-tracker/zen-view");
	tag.textContent = CSS;
	document.head.appendChild(tag);
}

// ── types ───────────────────────────────────────────────────────────────────

interface ZenViewProps {
	useSession: <T>(selector: (snapshot: any) => T) => T;
	sessionId: string;
	t: (key: string, params?: Record<string, any>) => string;
	foregroundStore: {
		getSnapshot: () => ForegroundStoreState;
		getLiveMs: () => { fgDelta: number; runDelta: number };
		subscribe: (fn: () => void) => () => void;
	};
	MarkdownText: any;
	zenSettingsStore: ZenSettingsStore;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function computeRatio(fgMs: number, totalMs: number): number {
	if (totalMs <= 0) return 0;
	return Math.round((Math.min(fgMs, totalMs) / totalMs) * 100);
}

function extractAssistantText(node: any): string | null {
	const blocks = node?.data?.blocks;
	if (!Array.isArray(blocks)) return null;
	const texts: string[] = [];
	for (const block of blocks) {
		if (block?.kind === "text" && typeof block.text === "string" && block.text.trim()) {
			texts.push(block.text.trim());
		}
	}
	return texts.length ? texts.join("\n") : null;
}

function extractLastReply(chatSnapshot: any): string | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	for (let i = order.length - 1; i >= 0; i--) {
		const node = nodes.get(order[i]);
		if (!node || node.kind !== "assistant-step") continue;
		const text = extractAssistantText(node);
		if (text) return text;
	}
	return null;
}

/** Extract the final reply from the PREVIOUS round (before current round's user message). */
function extractPrevRoundReply(chatSnapshot: any): string | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	const start = findCurrentRoundStart(chatSnapshot);
	if (!start) return null;
	// Search backwards from the current round's user message
	for (let i = start.idx - 1; i >= 0; i--) {
		const node = nodes.get(order[i]);
		if (!node || node.kind !== "assistant-step") continue;
		const text = extractAssistantText(node);
		if (text) return text;
	}
	return null;
}

/** Extract the latest assistant message in the CURRENT round (after last user message). */
function extractCurrentRoundReply(chatSnapshot: any): string | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	const start = findCurrentRoundStart(chatSnapshot);
	if (!start) return null;
	for (let i = order.length - 1; i > start.idx; i--) {
		const node = nodes.get(order[i]);
		if (!node || node.kind !== "assistant-step") continue;
		const text = extractAssistantText(node);
		if (text) return text;
	}
	return null;
}

function extractLastUserMessage(chatSnapshot: any): string | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	for (let i = order.length - 1; i >= 0; i--) {
		const node = nodes.get(order[i]);
		if (!node) continue;
		if (node.kind === "user" || node.kind === "steering") {
			const data = node.data;
			if (!data) return null;
			if (Array.isArray(data.content)) {
				const texts: string[] = [];
				for (const block of data.content) {
					if (block?.type === "text" && typeof block.text === "string" && block.text.trim()) {
						texts.push(block.text.trim());
					}
				}
				if (texts.length) return texts.join("\n");
			}
			if (typeof data.text === "string" && data.text.trim()) return data.text.trim();
			return null;
		}
	}
	return null;
}

/** Key (order id) of the LAST user/steering node in chat, or null. */
function getLastUserKey(chatSnapshot: any): string | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	for (let i = order.length - 1; i >= 0; i--) {
		const node = nodes.get(order[i]);
		if (node && (node.kind === "user" || node.kind === "steering")) return order[i];
	}
	return null;
}

function findCurrentRoundStart(chatSnapshot: any): { idx: number; startTime: number } | null {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	for (let i = order.length - 1; i >= 0; i--) {
		const node = nodes.get(order[i]);
		if (node && (node.kind === "user" || node.kind === "steering")) {
			return { idx: i, startTime: node.data?.time ?? 0 };
		}
	}
	return null;
}

function countRoundSteps(chatSnapshot: any): number {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	const start = findCurrentRoundStart(chatSnapshot);
	if (!start) return 0;
	let count = 0;
	for (let i = start.idx + 1; i < order.length; i++) {
		const node = nodes.get(order[i]);
		if (node && node.kind === "assistant-step") count++;
	}
	return count;
}

function computeRoundMs(chatSnapshot: any, running: boolean): number {
	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	const start = findCurrentRoundStart(chatSnapshot);
	if (!start || start.startTime === 0) return 0;
	if (running) return Math.max(0, Date.now() - start.startTime);
	let endTime = start.startTime;
	for (let i = order.length - 1; i > start.idx; i--) {
		const node = nodes.get(order[i]);
		if (node?.data?.time) {
			endTime = node.data.time;
			break;
		}
	}
	return Math.max(0, endTime - start.startTime);
}

function pickRandom(t: (k: string) => string, baseKey: string, count: number): string {
	const idx = 1 + Math.floor(Math.random() * count);
	return t(`${baseKey}${idx}`);
}

/**
 * Render markdown when the host's MarkdownText is available (same component the
 * done-reply uses); fall back to plain pre-wrapped text otherwise.
 */
function renderMarkdown(MarkdownText: any, text: string): React.ReactNode {
	if (MarkdownText) {
		return React.createElement(MarkdownText, { text });
	}
	return React.createElement("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word" } }, text);
}

// ── component ────────────────────────────────────────────────────────────────

export const ZenView = React.memo(function ZenView(props: ZenViewProps) {
	const { useSession, sessionId, t, foregroundStore, MarkdownText, zenSettingsStore } = props;

	const rawRunning = useSession((s: any) => s.running);
	const blank = useSession((s: any) => s.blank);
	const chat = useSession((s: any) => s.chat);
	// In-flight tool calls (tool/call seen, tool/result not yet) — shows what the
	// agent is doing right now while generating.
	const runningCalls = useSession((s: any) => s?.runningCalls);
	// History is being loaded into the session window (cold = not opened yet,
	// loading = fetching history) — Zen should show a loading state too.
	const openState = useSession((s: any) => s?.openState);
	const isLoading = !blank && (openState === "cold" || openState === "loading");

	// Debounce only the status message text (avoid deepDiving→ready flicker on intermediate steps)
	// Data extraction (lastReply, userMsg etc.) uses rawRunning directly to avoid stale content
	const [statusRunning, setStatusRunning] = React.useState(rawRunning);
	React.useEffect(() => {
		if (rawRunning) {
			setStatusRunning(true);
			return;
		}
		const id = setTimeout(() => setStatusRunning(false), 800);
		return () => clearTimeout(id);
	}, [rawRunning]);

	const running = rawRunning;

	const settings = zenSettingsStore.getSnapshot();

	// Key of the last user node at the last *confirmed* done state. While a
	// round is running (statusRunning), a fresh user message is only shown once
	// its node has actually landed in chat (key changed) — until then we show
	// nothing rather than the previous round's message.
	const currentUserKey = !blank ? getLastUserKey(chat) : null;
	const lastUserKeyRef = React.useRef<string | null>(null);
	React.useEffect(() => {
		if (!statusRunning) lastUserKeyRef.current = getLastUserKey(chat);
	}, [statusRunning, chat]);
	const userMsg = !blank ? extractLastUserMessage(chat) : null;
	// While generating: user message shows only if the toggle is on and the fresh
	// user node has actually landed in chat (key changed) — never the previous
	// round's message. When done (result state): the user message is always shown,
	// regardless of the toggle.
	const userMsgVisible = !!userMsg && !blank && !isLoading
		&& (statusRunning
			? settings.showUserMessage && currentUserKey !== lastUserKeyRef.current
			: true);

	const [, forceUpdate] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => foregroundStore.subscribe(forceUpdate), [foregroundStore]);
	React.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);

	const statsState = foregroundStore.getSnapshot();
	const stats = statsState.sessions[sessionId];
	const { fgDelta, runDelta } = foregroundStore.getLiveMs();

	const totalMs = (stats?.runningMs ?? 0) + runDelta;
	const fgMs = Math.min((stats?.foregroundMs ?? 0) + fgDelta, totalMs);
	const ratio = computeRatio(fgMs, totalMs);
	const zenPct = 100 - ratio;

	const lastReply = !running && !blank ? extractLastReply(chat) : null;
	const prevReply = !blank ? extractPrevRoundReply(chat) : null;
	const currentReply = !blank ? extractCurrentRoundReply(chat) : null;
	const roundSteps = !blank ? countRoundSteps(chat) : 0;
	const roundMs = !blank ? computeRoundMs(chat, running) : 0;
	const runningTools = Array.isArray(runningCalls)
		? runningCalls.map((c: any) => c?.name).filter((n: unknown): n is string => typeof n === "string" && !!n)
		: [];

	// Live tick — always running so tooltip stats stay fresh
	const [, clockTick] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => {
		const id = setInterval(clockTick, 1_000);
		return () => clearInterval(id);
	}, []);

	const message = React.useMemo(
		() => blank ? t("zen.noSession")
			: isLoading ? t("zen.loading")
			: statusRunning ? pickRandom(t, "zen.deepDiving", 5)
			: pickRandom(t, "zen.ready", 5),
		[blank, isLoading, statusRunning],
	);
	const sub = React.useMemo(
		() => statusRunning ? pickRandom(t, "zen.subRunning", 4)
			: blank || isLoading ? "" : pickRandom(t, "zen.subReady", 3),
		[blank, isLoading, statusRunning],
	);

	// Loading/running share the "running" toggle; done has its own.
	// Always mounted (data-hidden drives the opacity/max-height transition) so
	// status switches never remount the block and replay its fade-in.
	const showStatusCenter = blank
		? settings.showRunningStatus
		: (isLoading || statusRunning) ? settings.showRunningStatus : settings.showDoneStatus;

	return React.createElement("div", { className: "dsh-zen-root", "data-anim": settings.animation ? "on" : "off" },
		// Status message (loading, running or done) — always mounted, fades via data-hidden
		React.createElement("div", { className: "dsh-zen-center dsh-zen-statusCenter", "data-hidden": String(!showStatusCenter) },
			React.createElement("div", { className: "dsh-zen-message" }, message),
			// Second-line description, gated by the running-subtitle toggle
			(isLoading || statusRunning) && settings.showRunningSub && sub && React.createElement("div", { className: "dsh-zen-sub" }, sub),
		),
		// User message blockquote (below status, above reply) — while generating only
		!blank && !isLoading && userMsgVisible && React.createElement("blockquote", { className: "dsh-zen-userQuote" }, userMsg),
		// Done: AI reply with markdown (debounced — no flash on intermediate step gaps; always shown)
		!statusRunning && lastReply && !blank && !isLoading && React.createElement("div", { className: "dsh-zen-center" },
			React.createElement("div", { className: "dsh-zen-reply" },
				MarkdownText
					? React.createElement(MarkdownText, { text: lastReply })
					: lastReply,
			),
		),
		// Turn stats + current reply tooltip + prev reply tooltip + foreground tooltip (single line)
		!blank && !isLoading && (settings.showTurnStats || settings.showCurrentReply || settings.showPrevReply || settings.showForegroundTooltip) && React.createElement("div", { className: "dsh-zen-turnStats" },
			settings.showTurnStats && React.createElement(React.Fragment, null,
				React.createElement("span", { className: "dsh-zen-statVal" }, `${t("zen.turnCount")} ${roundSteps}`),
				React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
				React.createElement("span", { className: "dsh-zen-statVal" }, `${t("zen.runTime")} ${formatDuration(roundMs)}`),
			),
			statusRunning && settings.showCurrentReply && (currentReply || runningTools.length > 0) && React.createElement(React.Fragment, null,
				React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
				React.createElement("div", { className: "dsh-zen-hint" },
					React.createElement("span", { className: "dsh-zen-hintText" }, t("zen.currentReply")),
					React.createElement("div", { className: "dsh-zen-tooltip" },
						React.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.currentReply")),
						runningTools.length > 0 && React.createElement(React.Fragment, null,
							React.createElement("div", { className: "dsh-zen-tooltipRow" },
								React.createElement("span", null, t("zen.runningTool")),
								React.createElement("span", { className: "dsh-zen-tooltipValue" }, runningTools.join(" · ")),
							),
							currentReply && React.createElement("div", { className: "dsh-zen-tooltipDivider" }),
						),
						currentReply && React.createElement("div", { className: "dsh-zen-tooltipBody" }, renderMarkdown(MarkdownText, currentReply)),
					),
				),
			),
			statusRunning && settings.showPrevReply && prevReply && React.createElement(React.Fragment, null,
				React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
				React.createElement("div", { className: "dsh-zen-hint" },
					React.createElement("span", { className: "dsh-zen-hintText" }, t("zen.prevReply")),
					React.createElement("div", { className: "dsh-zen-tooltip" },
						React.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.prevReply")),
						React.createElement("div", { className: "dsh-zen-tooltipBody" }, renderMarkdown(MarkdownText, prevReply)),
					),
				),
			),
			settings.showForegroundTooltip && React.createElement(React.Fragment, null,
				React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
				React.createElement("div", { className: "dsh-zen-hint" },
					React.createElement("span", { className: "dsh-zen-hintText" }, t("zen.stats")),
					React.createElement("div", { className: "dsh-zen-tooltip" },
						React.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.statsTitle")),
						React.createElement("div", { className: "dsh-zen-tooltipRow" },
							React.createElement("span", null, t("zen.foreground")),
							React.createElement("span", { className: "dsh-zen-tooltipValue" }, formatDuration(fgMs)),
						),
						React.createElement("div", { className: "dsh-zen-tooltipRow" },
							React.createElement("span", null, t("zen.total")),
							React.createElement("span", { className: "dsh-zen-tooltipValue" }, formatDuration(totalMs)),
						),
						React.createElement("div", { className: "dsh-zen-tooltipDivider" }),
						React.createElement("div", { className: "dsh-zen-tooltipRow" },
							React.createElement("span", null, t("zen.ratio")),
							React.createElement("span", { className: "dsh-zen-tooltipValue" }, ratio + "%"),
						),
						React.createElement("div", { className: "dsh-zen-tooltipRow" },
							React.createElement("span", null, t("zen.zen")),
							React.createElement("span", { className: "dsh-zen-tooltipValue" }, zenPct + "%"),
						),
					),
				),
			),
		),
	);
});
