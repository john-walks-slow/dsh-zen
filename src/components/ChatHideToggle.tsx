/**
 * ChatHideToggle — a button in conversation.session.header.actions that
 * toggles CSS-based hiding of intermediate process nodes in the chat view.
 *
 * When ON, adds `data-chat-hide="on"` to <body>, which activates CSS rules
 * that hide tool-call, command, compaction, model-retry, turn-error,
 * turn-max-tokens nodes and reasoning rows.
 *
 * @module dsh-zen/components/ChatHideToggle
 */

import React from "react";

// ── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
.dsh-zen-chatHideBtn {
	box-sizing: border-box;
	height: 28px;
	color: var(--dsw-alias-label-secondary);
	cursor: pointer;
	background: 0 0;
	border: none;
	border-radius: 999px;
	align-items: center;
	gap: 4px;
	padding: 0 10px;
	font-family: inherit;
	font-size: 12px;
	font-weight: 500;
	line-height: 18px;
	display: inline-flex;
	transition: background 0.12s;
}

.dsh-zen-chatHideBtn:hover {
	background: var(--dsw-alias-interactive-bg-hover);
}

.dsh-zen-chatHideBtn[data-active="true"] {
	color: var(--dsw-alias-state-business-primary);
	background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 12%, transparent);
}

.dsh-zen-chatHideIcon {
	flex: none;
	display: inline-flex;
	align-items: center;
}

.dsh-zen-chatHideIcon svg {
	width: 14px;
	height: 14px;
}

/* ── Hide rules (activated by body[data-chat-hide="on"]) ──────────────────── */

/* Hide entire flowItems for these kinds */
body[data-chat-hide="on"] [data-chat-flow-kind="tool-call"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="command"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="context"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="compaction"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="model-retry"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="turn-error"] { display: none !important; }
body[data-chat-hide="on"] [data-chat-flow-kind="turn-max-tokens"] { display: none !important; }

/* Hide reasoning rows inside assistant-step */
body[data-chat-hide="on"] [data-chat-flow-kind="assistant-step"] [data-variant="think"] { display: none !important; }

/* Hide assistant-step that only contains think (no reply) — prevents extra flex gap */
body[data-chat-hide="on"] [data-chat-flow-kind="assistant-step"]:has(.Sxvs8a_body > [data-variant="think"]:only-child) { display: none !important; }

/* Collapse context/compaction rows inside user messages (they have padding:2px 0) */
body[data-chat-hide="on"] .gdEzaW_contextRow:empty,
body[data-chat-hide="on"] .gdEzaW_compactionRow:empty { display: none !important; }

/* Zero out gap in AssistantMarkdown body when reasoning hidden */
body[data-chat-hide="on"] [data-chat-flow-kind="assistant-step"] .Sxvs8a_body { gap: 0 !important; }
`;

// Inject CSS once
if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"dsh-zen/chat-hide\"]")) {
	const tag = document.createElement("style");
	tag.setAttribute("data-plugin-css", "dsh-zen/chat-hide");
	tag.textContent = CSS;
	document.head.appendChild(tag);
}

// ── persisted toggle state ──────────────────────────────────────────────────

const PERSIST_KEY = "dsh.zen.chat-hide";

function loadToggleState(): boolean {
	try {
		return localStorage.getItem(PERSIST_KEY) === "true";
	} catch { return false; }
}

function saveToggleState(on: boolean): void {
	try {
		localStorage.setItem(PERSIST_KEY, String(on));
	} catch { /* ignore */ }
}

// ── component ────────────────────────────────────────────────────────────────

export interface ChatHideToggleProps {
	t: (key: string, params?: Record<string, any>) => string;
}

/** Module-level ref to setView function, populated when ChatHideToggle mounts. */
let _setView: ((view: string) => void) | null = null;

/** Switch to a view by id. Returns true if setView is available. */
export function switchView(view: string): boolean {
	if (_setView) { _setView(view); return true; }
	return false;
}

export const ChatHideToggle = React.memo(function ChatHideToggle(props: ChatHideToggleProps) {
	const { t } = props;
	const [active, setActive] = React.useState(() => loadToggleState());

	// Capture setView from parent fiber for auto-switch feature
	React.useEffect(() => {
		try {
			const el = document.querySelector(".dsh-zen-chatHideBtn");
			if (!el) return;
			const fk = Object.keys(el).find((k) => k.startsWith("__reactFiber"));
			if (!fk) return;
			let fiber = (el as any)[fk];
			let depth = 0;
			while (fiber && depth < 30) {
				const mp = fiber.memoizedProps;
				if (mp && mp.actions && typeof mp.actions.setView === "function") {
					_setView = mp.actions.setView;
					break;
				}
				fiber = fiber.return;
				depth++;
			}
		} catch { /* ignore */ }
	}, []);

	// Sync body attribute
	React.useEffect(() => {
		if (active) {
			document.body.setAttribute("data-chat-hide", "on");
		} else {
			document.body.removeAttribute("data-chat-hide");
		}
	}, [active]);

	const toggle = React.useCallback(() => {
		setActive((prev) => {
			const next = !prev;
			saveToggleState(next);
			return next;
		});
	}, []);

	return React.createElement("button", {
		type: "button",
		className: "dsh-zen-chatHideBtn",
		"data-active": active ? "true" : "false",
		title: t("chatHide.desc"),
		onClick: toggle,
	},
		React.createElement("span", { className: "dsh-zen-chatHideIcon" },
			React.createElement("svg", { viewBox: "0 0 16 16", "aria-hidden": true },
				React.createElement("path", {
					d: active
						? "M1 8 C3 4, 6 2, 8 2 C10 2, 13 4, 15 8 C13 12, 10 14, 8 14 C6 14, 3 12, 1 8 Z M8 5 A3 3 0 1 1 8 11 A3 3 0 1 1 8 5 Z"
						: "M1 8 C3 4, 6 2, 8 2 C10 2, 13 4, 15 8 C13 12, 10 14, 8 14 C6 14, 3 12, 1 8 Z M5 5 L11 11 M11 5 L5 11",
					stroke: "currentColor",
					strokeWidth: "1.3",
					strokeLinecap: "round",
					fill: active ? "currentColor" : "none",
				}),
			),
		),
		React.createElement("span", null, t("chatHide.toggle")),
	);
});
