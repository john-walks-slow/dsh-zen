/**
 * ZenSettingsStore — persisted configuration for what to show in Zen view.
 * @module dsh-zen-tracker/zen-settings
 */

const PERSIST_KEY = "dsh.zen-tracker.settings";

export interface ZenSettings {
	/** Show the status message text */
	showStatus: boolean;
	/** Show the last user message */
	showUserMessage: boolean;
	/** Show the previous round's final reply (hover) */
	showPrevReply: boolean;
	/** Show the current round's latest assistant message (between status and stats) */
	showCurrentReply: boolean;
	/** Show the last AI reply (markdown) when done */
	showAiReply: boolean;
	/** Show turn count and run time */
	showTurnStats: boolean;
	/** Show the foreground time tooltip */
	showForegroundTooltip: boolean;
	/** Auto switch to Zen tab when task starts */
	autoEnterZen: boolean;
	/** Auto switch away from Zen tab when task completes */
	autoExitZen: boolean;
}

const DEFAULTS: ZenSettings = {
	showStatus: true,
	showUserMessage: true,
	showPrevReply: true,
	showCurrentReply: false,
	showAiReply: true,
	showTurnStats: true,
	showForegroundTooltip: true,
	autoEnterZen: false,
	autoExitZen: false,
};

type Listener = () => void;

export function createZenSettingsStore() {
	let state: ZenSettings = loadInitial();
	const listeners = new Set<Listener>();

	function loadInitial(): ZenSettings {
		try {
			const raw = localStorage.getItem(PERSIST_KEY);
			if (raw) {
				const parsed = JSON.parse(raw);
				// Migrate: drop old fields
				const { showPet: _p, showEmoji: _e, customRunningMessages: _cr, customDoneMessages: _cd, ...rest } = parsed;
				return { ...DEFAULTS, ...rest };
			}
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
