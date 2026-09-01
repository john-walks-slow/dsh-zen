/**
 * ZenSettingsStore — persisted configuration for what to show in Zen view.
 * @module dsh-zen-tracker/zen-settings
 */

const PERSIST_KEY = "dsh.zen-tracker.settings";

export interface ZenSettings {
	/** Show the status message text */
	showStatus: boolean;
	/** Show the animated desktop pet (spritesheet) */
	showPet: boolean;
	/** Show the emoji icon (🐋/✨) instead of pet when both enabled */
	showEmoji: boolean;
	/** Show the last user message */
	showUserMessage: boolean;
	/** Show the last AI reply (markdown) when done */
	showAiReply: boolean;
	/** Show turn count and run time */
	showTurnStats: boolean;
	/** Show the foreground time tooltip */
	showForegroundTooltip: boolean;
}

const DEFAULTS: ZenSettings = {
	showStatus: true,
	showPet: true,
	showEmoji: false,
	showUserMessage: true,
	showAiReply: true,
	showTurnStats: true,
	showForegroundTooltip: true,
};

type Listener = () => void;

export function createZenSettingsStore() {
	let state: ZenSettings = loadInitial();
	const listeners = new Set<Listener>();

	function loadInitial(): ZenSettings {
		try {
			const raw = localStorage.getItem(PERSIST_KEY);
			if (raw) return { ...DEFAULTS, ...JSON.parse(raw) };
		} catch { /* ignore */ }
		return { ...DEFAULTS };
	}

	function persist() {
		try { localStorage.setItem(PERSIST_KEY, JSON.stringify(state)); } catch { /* ignore */ }
	}

	function notify() {
		for (const fn of listeners) fn();
	}

	return {
		getSnapshot: () => state,
		subscribe: (fn: Listener) => {
			listeners.add(fn);
			return () => { listeners.delete(fn); };
		},
		update: (patch: Partial<ZenSettings>) => {
			state = { ...state, ...patch };
			persist();
			notify();
		},
	};
}

export type ZenSettingsStore = ReturnType<typeof createZenSettingsStore>;
