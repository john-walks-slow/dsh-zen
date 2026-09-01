/**
 * Client plugin body for dsh-zen-tracker.
 *
 * Registers:
 * 1. Foreground time tracker (global, tab-independent)
 * 2. "Zen" view tab in conversation.view (id="zen", order=5)
 * 3. Chat-hide toggle in conversation.session.header.actions
 * 4. Zen settings section in settings.section (id="zen", order=50)
 *
 * @module dsh-zen-tracker/client
 */

import { NS, zh, en } from "./locales";
import { initForegroundTracker, type ForegroundStoreState } from "./foreground-tracker";
import { createZenSettingsStore, type ZenSettingsStore } from "./zen-settings";
import { createPetStore } from "./pet-store";
import { ZenView } from "./components/ZenView";
import { ChatHideToggle } from "./components/ChatHideToggle";
import { ZenSettingsSection } from "./components/ZenSettingsSection";

/** Cordis plugin name. */
const name = "zen-tracker";

/** Required services. */
const inject = ["slots", "sessions", "locale"];

/**
 * Mount the zen-tracker plugin.
 * @param ctx - client root context.
 */
function apply(ctx: any) {
	// ── Locale dictionaries ──────────────────────────────────────────────
	ctx.effect(() => ctx.locale.register(NS, { zh, en }), "zen-tracker: dictionaries");
	const t = ctx.locale.bind(NS);

	// ── Foreground tracker (global, not tab-bound) ───────────────────────
	const foregroundStore = initForegroundTracker(ctx);

	// ── Zen settings store ──────────────────────────────────────────────
	const zenSettingsStore = createZenSettingsStore();

	// ── Pet store (IndexedDB-backed spritesheet manager) ────────────────
	const petStore = createPetStore();
	petStore.init();

	// ── MarkdownText component (from dsh-client-ui-primitives) ───────────
	let MarkdownText: any = null;
	try {
		MarkdownText = (require as any)("@deepseek-ai/dsh-client-ui-primitives").MarkdownText;
	} catch { /* will fallback to plain text */ }

	// ── Zen view tab ─────────────────────────────────────────────────────
	ctx.slots.inject("conversation.view", () => ctx.slots.register({
		name: "conversation.view",
		id: "zen",
		order: 5,
		label: () => t("view.zen"),
		locale: NS,
		inject: (_sessionId: string) => ({
			foregroundStore,
			MarkdownText,
			zenSettingsStore,
			petStore,
		}),
	}, ZenView));

	// ── Chat hide toggle ─────────────────────────────────────────────────
	ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
		name: "conversation.session.header.actions",
		id: "chat-hide-toggle",
		order: 50,
		locale: NS,
		inject: () => ({
			t,
		}),
	}, ChatHideToggle));

	// ── Zen settings section ─────────────────────────────────────────────
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "zen",
		order: 50,
		label: () => t("settings.title"),
		locale: NS,
		inject: () => ({
			zenSettingsStore,
			petStore,
			t,
		}),
	}, ZenSettingsSection));
}

export { apply, inject, name };
