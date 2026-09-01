/**
 * ZenPet — animated spritesheet pet for the Zen view.
 *
 * CSS keyframe animation (browser-composited, smooth) with per-frame-count
 * keyframes. Each state maps to a row (Y offset) and a frame count.
 *
 * @module dsh-zen-tracker/components/ZenPet
 */
import React from "react";
import type { PetStore } from "../pet-store";

// ── CSS ─────────────────────────────────────────────────────────────────────

// Generate a keyframes rule for N frames, cycling X from 0 to -(N-1)*192.
function makeKeyframes(n: number): string {
	const steps: string[] = [];
	const stepSize = 100 / n;
	for (let i = 0; i < n; i++) {
		const x = -i * 192;
		const start = (i * stepSize).toFixed(4);
		const end = ((i + 1) * stepSize).toFixed(4);
		steps.push(`${start}%, ${end}% { background-position: ${x}px var(--dsh-zen-pet-y, 0px); }`);
	}
	return `@keyframes dsh-zen-pet-frames-${n} {\n\t${steps.join("\n\t")}\n}`;
}

// We need keyframes for 4, 5, 6, 8 frames (all possible frame counts).
const KEYFRAMES_CSS = [4, 5, 6, 8].map(makeKeyframes).join("\n\n");

const CSS = `
.dsh-zen-pet {
	display: flex;
	justify-content: center;
	align-items: center;
}

.dsh-zen-petSprite {
	width: 192px;
	height: 208px;
	background-repeat: no-repeat;
	background-size: 1536px 2288px;
	background-position: 0 var(--dsh-zen-pet-y, 0px);
	animation: dsh-zen-pet-frames-6 var(--dsh-zen-pet-duration, 1.7s) step-end infinite;
	transform: scale(var(--dsh-zen-pet-scale, 0.6));
	transform-origin: left top;
	filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.12));
	pointer-events: none;
	user-select: none;
}

${KEYFRAMES_CSS}

@media (prefers-reduced-motion: reduce) {
	.dsh-zen-petSprite { animation: none; }
}
`;

if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"dsh-zen-tracker/zen-pet\"]")) {
	const tag = document.createElement("style");
	tag.setAttribute("data-plugin-css", "dsh-zen-tracker/zen-pet");
	tag.textContent = CSS;
	document.head.appendChild(tag);
}

// ── types ───────────────────────────────────────────────────────────────────

export type PetState =
	| "idle"
	| "thinking"
	| "tooling"
	| "commanding"
	| "compacting"
	| "error"
	| "done"
	| "idle-running";

// Codex v2 row mapping (0-indexed):
// 0=idle, 1=move-right, 2=move-left, 3=waving, 4=jumping,
// 5=failed, 6=waiting, 7=running, 8=review, 9-10=look-directions

// Frame counts from actual spritesheet analysis:
//   row 0: 7 active (use 6 for loop)
//   row 3: 4 active
//   row 5: 8 active (use 6 for loop)
//   row 6: 6 active
//   row 7: 6 active
//   row 8: 6 active
const STATE_CONFIG: Record<PetState, { row: number; duration: string; frames: number }> = {
	idle:           { row: 0, duration: "1.7s", frames: 6 },
	thinking:       { row: 8, duration: "1.7s", frames: 6 },
	tooling:        { row: 7, duration: "900ms", frames: 6 },
	commanding:     { row: 7, duration: "900ms", frames: 6 },
	compacting:     { row: 6, duration: "1.35s", frames: 6 },
	error:          { row: 5, duration: "600ms", frames: 6 },
	done:           { row: 3, duration: "1.7s", frames: 4 },
	"idle-running": { row: 7, duration: "900ms", frames: 6 },
};

// ── state detection ─────────────────────────────────────────────────────────

export function detectPetState(running: boolean, blank: boolean, chatSnapshot: any): PetState {
	if (blank) return "idle";
	if (!running) return "done";

	const order: readonly string[] = chatSnapshot?.order ?? [];
	const nodes: Map<string, any> = chatSnapshot?.nodes ?? new Map();
	if (order.length === 0) return "idle";

	const lastNode = nodes.get(order[order.length - 1]);
	if (!lastNode) return "idle-running";

	switch (lastNode.kind) {
		case "assistant-step": {
			const blocks = lastNode.data?.blocks;
			if (Array.isArray(blocks) && blocks.length > 0) {
				const lastBlock = blocks[blocks.length - 1];
				if (lastBlock?.kind === "reasoning") return "thinking";
			}
			return "idle-running";
		}
		case "tool-call":
			return "tooling";
		case "command":
			return "commanding";
		case "compaction":
			return "compacting";
		case "turn-error":
		case "model-retry":
		case "turn-max-tokens":
			return "error";
		default:
			return "idle-running";
	}
}

// ── component ────────────────────────────────────────────────────────────────

interface ZenPetProps {
	state: PetState;
	scale?: number;
	petStore: PetStore;
}

export const ZenPet = React.memo(function ZenPet({ state, scale = 0.6, petStore }: ZenPetProps) {
	const [, forceUpdate] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => petStore.subscribe(forceUpdate), [petStore]);

	const spriteUrl = petStore.getSpriteUrl();
	const meta = petStore.getMeta();
	const config = STATE_CONFIG[state] ?? STATE_CONFIG["idle-running"];
	const row = Math.min(config.row, meta.rows - 1);
	const y = -row * meta.cellH;
	const bgW = meta.cols * meta.cellW;
	const bgH = meta.rows * meta.cellH;

	return React.createElement("div", { className: "dsh-zen-pet", "data-state": state },
		React.createElement("div", {
			className: "dsh-zen-petSprite",
			style: {
				backgroundImage: `url('${spriteUrl}')`,
				backgroundSize: `${bgW}px ${bgH}px`,
				animationName: `dsh-zen-pet-frames-${config.frames}`,
				animationDuration: config.duration,
				"--dsh-zen-pet-y": `${y}px`,
				"--dsh-zen-pet-scale": String(scale),
			} as React.CSSProperties,
		}),
	);
});
