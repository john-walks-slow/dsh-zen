/**
 * ZenView — the minimal "go do something else" view tab.
 *
 * Running: pet/emoji + cute message.
 * Done: pet/emoji + AI reply (markdown).
 * Bottom: user message (collapsible, subtle).
 * Corner: tooltip with foreground stats.
 *
 * @module dsh-zen-tracker/components/ZenView
 */

import React from "react";
import { formatDuration, type SessionStats, type ForegroundStoreState } from "../foreground-tracker";
import type { ZenSettingsStore } from "../zen-settings";
import { ZenPet, detectPetState } from "./ZenPet";
import type { PetStore } from "../pet-store";

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
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
	animation: dsh-zen-fade-in 0.3s ease-out;
}

.dsh-zen-icon {
	font-size: 48px;
	line-height: 1;
	user-select: none;
	animation: dsh-zen-fade-in 0.3s ease-out;
}

.dsh-zen-message {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--dsw-alias-label-secondary);
	text-align: center;
	animation: dsh-zen-fade-in 0.3s ease-out 0.05s backwards;
}

.dsh-zen-sub {
	font-size: 14px;
	line-height: 20px;
	color: var(--dsw-alias-label-tertiary);
	animation: dsh-zen-fade-in 0.3s ease-out 0.1s backwards;
}

@keyframes dsh-zen-fade-in {
	from { opacity: 0; transform: translateY(8px); }
	to { opacity: 1; transform: translateY(0); }
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

.dsh-zen-turnStatsSep {
	color: var(--dsw-alias-label-caption);
	opacity: 0.5;
}

/* ── AI reply (markdown, bubble) ─────────────────────────────────────────── */

.dsh-zen-reply {
	max-width: 640px;
	width: 100%;
	padding: 12px 16px;
	border-radius: 12px;
	background: var(--dsw-alias-interactive-bg-hover);
	font-size: 15px;
	line-height: 24px;
	color: var(--dsw-alias-label-primary);
	animation: dsh-zen-fade-in 0.3s ease-out 0.1s backwards;
}

/* ── User message (bubble) ─────────────────────────────────────────────── */

.dsh-zen-user {
	max-width: 580px;
	width: 100%;
	padding: 10px 16px;
	border-radius: 22px;
	background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);
	color: var(--dsw-alias-label-secondary);
	font-size: 14px;
	line-height: 22px;
	white-space: pre-wrap;
	word-break: break-word;
	box-sizing: border-box;
	animation: dsh-zen-fade-in 0.3s ease-out;
}

/* ── Corner tooltip ─────────────────────────────────────────────────────── */

.dsh-zen-corner {
	position: relative;
	display: inline-flex;
}

.dsh-zen-cornerBtn {
	width: 28px;
	height: 28px;
	border-radius: 50%;
	border: none;
	background: var(--dsw-alias-interactive-bg-hover);
	color: var(--dsw-alias-label-caption);
	cursor: help;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 14px;
	line-height: 1;
	transition: background 0.12s;
}

.dsh-zen-cornerBtn:hover {
	background: var(--dsw-alias-interactive-bg-active);
	color: var(--dsw-alias-label-secondary);
}

.dsh-zen-tooltip {
	position: absolute;
	bottom: 100%;
	right: 0;
	min-width: 200px;
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
	transform: translateY(4px);
	transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
	pointer-events: none;
	z-index: 10;
}

.dsh-zen-corner:hover .dsh-zen-tooltip {
	opacity: 1;
	visibility: visible;
	transform: translateY(0);
}

.dsh-zen-tooltipTitle {
	font-size: 11px;
	font-weight: 600;
	color: var(--dsw-alias-label-caption);
	margin-bottom: 6px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
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
		subscribe: (fn: () => void) => () => void;
	};
	MarkdownText: any;
	zenSettingsStore: ZenSettingsStore;
	petStore: PetStore;
}

// ── helpers ─────────────────────────────────────────────────────────────────

function computeTotalMs(stats: SessionStats | undefined): number {
	if (!stats) return 0;
	const end = stats.sessionEndMs ?? Date.now();
	return Math.max(0, end - stats.sessionStartMs);
}

function computeRatio(fgMs: number, totalMs: number): number {
	if (totalMs <= 0) return 0;
	return Math.round((fgMs / totalMs) * 100);
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

/** Find the last user/steering node index and its timestamp. */
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

/** Count assistant-steps in the current round (after last user message). */
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

/** Compute current round run time (from last user message to now). */
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

// ── component ────────────────────────────────────────────────────────────────

export const ZenView = React.memo(function ZenView(props: ZenViewProps) {
	const { useSession, sessionId, t, foregroundStore, MarkdownText, zenSettingsStore, petStore } = props;

	const running = useSession((s: any) => s.running);
	const blank = useSession((s: any) => s.blank);
	const chat = useSession((s: any) => s.chat);

	const [, forceUpdate] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => foregroundStore.subscribe(forceUpdate), [foregroundStore]);
	React.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);

	const statsState = foregroundStore.getSnapshot();
	const stats = statsState.sessions[sessionId];
	const settings = zenSettingsStore.getSnapshot();

	const totalMs = computeTotalMs(stats);
	const fgMs = stats?.foregroundMs ?? 0;
	const ratio = computeRatio(fgMs, totalMs);

	const lastReply = !running && !blank ? extractLastReply(chat) : null;
	const userMsg = !blank ? extractLastUserMessage(chat) : null;
	const roundSteps = !blank ? countRoundSteps(chat) : 0;
	const roundMs = !blank ? computeRoundMs(chat, running) : 0;

	// Live tick while running
	const [, clockTick] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => {
		if (!running) return;
		const id = setInterval(clockTick, 1_000);
		return () => clearInterval(id);
	}, [running]);

	const petState = detectPetState(running, blank, chat);
	const icon = blank ? "🌙" : running ? "🐋" : "✨";
	const message = blank ? t("zen.noSession")
		: running ? t("zen.deepDiving")
		: t("zen.ready");
	const sub = running ? t("zen.subRunning") : blank ? "" : t("zen.subReady");

	// Decide what to show: emoji icon, pet, or nothing
	const showEmoji = settings.showEmoji;
	const showPet = settings.showPet && !showEmoji;

	return React.createElement("div", { className: "dsh-zen-root" },
		// User message (bubble, top)
		settings.showUserMessage && userMsg && React.createElement("div", { className: "dsh-zen-user" }, userMsg),
		// Running: pet/emoji + cute message
		running && !blank && (showPet || showEmoji || settings.showStatus) && React.createElement("div", { className: "dsh-zen-center" },
			showEmoji && React.createElement("div", { className: "dsh-zen-icon" }, icon),
			showPet && React.createElement(ZenPet, { state: petState, petStore }),
			settings.showStatus && React.createElement("div", { className: "dsh-zen-message" }, message),
			settings.showStatus && sub && React.createElement("div", { className: "dsh-zen-sub" }, sub),
		),
		// Done: pet/emoji + AI reply with markdown
		!running && lastReply && !blank && (showPet || showEmoji || settings.showAiReply) && React.createElement("div", { className: "dsh-zen-center" },
			showEmoji && React.createElement("div", { className: "dsh-zen-icon" }, icon),
			showPet && React.createElement(ZenPet, { state: "done", scale: 0.45, petStore }),
			settings.showAiReply && lastReply && React.createElement("div", { className: "dsh-zen-reply" },
				MarkdownText
					? React.createElement(MarkdownText, { text: lastReply })
					: lastReply,
			),
		),
		// Empty state
		blank && (showPet || showEmoji || settings.showStatus) && React.createElement("div", { className: "dsh-zen-center" },
			showEmoji && React.createElement("div", { className: "dsh-zen-icon" }, icon),
			showPet && React.createElement(ZenPet, { state: "idle", petStore }),
			settings.showStatus && React.createElement("div", { className: "dsh-zen-message" }, message),
		),
		// Turn stats + foreground tooltip (inline row)
		settings.showTurnStats && !blank && React.createElement("div", { className: "dsh-zen-turnStats" },
			React.createElement("span", null, `${t("zen.turnCount")} ${roundSteps}`),
			React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
			React.createElement("span", null, `${t("zen.runTime")} ${formatDuration(roundMs)}`),
			settings.showForegroundTooltip && React.createElement(React.Fragment, null,
				React.createElement("span", { className: "dsh-zen-turnStatsSep" }, "·"),
				React.createElement("div", { className: "dsh-zen-corner" },
					React.createElement("button", { className: "dsh-zen-cornerBtn", title: t("zen.statsTitle") }, "⏱"),
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
						React.createElement("div", { className: "dsh-zen-tooltipHint" }, t("zen.tooltipHint")),
					),
				),
			),
		),
	);
});
