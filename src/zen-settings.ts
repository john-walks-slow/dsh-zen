/**
 * ZenSettingsStore — persisted configuration for what to show in Zen view.
 * @module dsh-zen-tracker/zen-settings
 */

const PERSIST_KEY = "dsh.zen-tracker.settings";

export interface ZenSettings {
	/** Show the running status message text */
	showRunningStatus: boolean;
	/** Show the done status message text */
	showDoneStatus: boolean;
	/** Show the last user message while generating */
	showUserMessage: boolean;
	/** Show the previous round's final reply while generating (hover) */
	showPrevReply: boolean;
	/** Show the current round's latest assistant message while generating (hover) */
	showCurrentReply: boolean;
	/** Show turn count and run time */
	showTurnStats: boolean;
	/** Show the foreground time tooltip */
	showForegroundTooltip: boolean;
	/** Auto switch to Zen tab when task starts */
	autoEnterZen: boolean;
	/** Auto switch away from Zen tab when task completes */
	autoExitZen: boolean;
	/** Enable entry animations / transitions in Zen view */
	animation: boolean;
}

const DEFAULTS: ZenSettings = {
	showRunningStatus: true,
	showDoneStatus: false,
	showUserMessage: true,
	showPrevReply: true,
	showCurrentReply: false,
	showTurnStats: true,
	showForegroundTooltip: true,
	autoEnterZen: false,
	autoExitZen: false,
	animation: true,
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
				const { showPet: _p, showEmoji: _e, customRunningMessages: _cr, customDoneMessages: _cd, showAiReply: _ar, ...rest } = parsed;
				// Migrate: showStatus → showRunningStatus / showDoneStatus
				if ("showStatus" in rest) {
					const old = (rest as any).showStatus;
					delete (rest as any).showStatus;
					(rest as any).showRunningStatus = old ?? true;
					(rest as any).showDoneStatus = old === true;
				}
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
