/**
 * ZenSettingsSection — settings panel for configuring Zen view display.
 * Shows daily/weekly Zen stats and Zen level.
 * @module dsh-zen/components/ZenSettingsSection
 */

import React from "react";
import type { ZenSettingsStore } from "../zen-settings";
import type { ForegroundStoreState } from "../foreground-tracker";
import { dayKeyOf, formatDuration } from "../foreground-tracker";

const CSS = `
.dsh-zen-settings {
	padding: 16px 20px;
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.dsh-zen-settingsTitle {
	font-size: 16px;
	font-weight: 600;
	color: var(--dsw-alias-label-primary);
	margin-bottom: 4px;
}

.dsh-zen-settingsDesc {
	font-size: 13px;
	line-height: 20px;
	color: var(--dsw-alias-label-tertiary);
	margin-bottom: 12px;
}

.dsh-zen-settingsShortcut {
	font-size: 12px;
	line-height: 18px;
	color: var(--dsw-alias-label-caption);
	margin-bottom: 12px;
	font-variant-numeric: tabular-nums;
}

/* ── Zen stats card ─────────────────────────────────────────────────────── */

.dsh-zen-statsCard {
	padding: 16px;
	border-radius: 12px;
	background: var(--dsw-alias-interactive-bg-hover);
	margin-bottom: 12px;
}

.dsh-zen-statsGrid {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 16px;
}

.dsh-zen-statBox {
	display: flex;
	flex-direction: column;
	gap: 4px;
}

.dsh-zen-statLabel {
	font-size: 12px;
	color: var(--dsw-alias-label-caption);
}

.dsh-zen-statValue {
	font-size: 24px;
	font-weight: 700;
	color: var(--dsw-alias-label-primary);
	font-variant-numeric: tabular-nums;
	line-height: 32px;
}

.dsh-zen-statSub {
	font-size: 11px;
	color: var(--dsw-alias-label-tertiary);
}

.dsh-zen-levelRow {
	margin-top: 16px;
	padding-top: 12px;
	border-top: 1px solid var(--dsw-alias-border-l2);
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.dsh-zen-levelLeft {
	display: flex;
	flex-direction: column;
	gap: 2px;
}

.dsh-zen-levelName {
	font-size: 15px;
	font-weight: 600;
	color: var(--dsw-alias-label-primary);
}

.dsh-zen-levelDesc {
	font-size: 12px;
	color: var(--dsw-alias-label-caption);
}

.dsh-zen-levelBadge {
	font-size: 28px;
	line-height: 1;
}

/* ── Toggle items ───────────────────────────────────────────────────────── */

.dsh-zen-settingsItem {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 0;
	border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-zen-settingsItem:last-child {
	border-bottom: none;
}

.dsh-zen-settingsItemLabel {
	font-size: 14px;
	color: var(--dsw-alias-label-secondary);
}

.dsh-zen-settingsSwitch {
	width: 36px;
	height: 20px;
	border-radius: 10px;
	border: none;
	cursor: pointer;
	position: relative;
	transition: background 0.15s;
	flex: none;
}

.dsh-zen-settingsSwitch[data-on="true"] {
	background: var(--dsw-alias-state-business-primary);
}

.dsh-zen-settingsSwitch[data-on="false"] {
	background: var(--dsw-alias-interactive-bg-hover-solid);
}

.dsh-zen-settingsSwitchKnob {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: #fff;
	position: absolute;
	top: 2px;
	left: 2px;
	transition: left 0.15s;
}

.dsh-zen-settingsSwitch[data-on="true"] .dsh-zen-settingsSwitchKnob {
	left: 18px;
}
`;

if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"dsh-zen/settings\"]")) {
	const tag = document.createElement("style");
	tag.setAttribute("data-plugin-css", "dsh-zen/settings");
	tag.textContent = CSS;
	document.head.appendChild(tag);
}

// ── Zen level system ────────────────────────────────────────────────────────

/** Daily Zen levels based on today's Zen percentage. */
const ZEN_LEVELS = [
	{ min: 95, emoji: "🧘", nameZh: "禅宗大师", nameEn: "Zen Master", descZh: "几乎不盯屏，深得禅意", descEn: "Barely glanced at the screen" },
	{ min: 90, emoji: "🍵", nameZh: "茶道行者", nameEn: "Tea Adept", descZh: "悠闲自在，盯屏极少", descEn: "Relaxed and minimal screen time" },
	{ min: 80, emoji: "🌿", nameZh: "青苔隐士", nameEn: "Moss Hermit", descZh: "淡定从容，偶尔瞄一眼", descEn: "Calm, checking in occasionally" },
	{ min: 60, emoji: "🌀", nameZh: "半醒半梦", nameEn: "Half Dreaming", descZh: "还在适应，会忍不住看看", descEn: "Still adapting, peeking sometimes" },
	{ min: 40, emoji: "🐝", nameZh: "忙碌蜜蜂", nameEn: "Busy Bee", descZh: "盯屏较多，试着放手吧", descEn: "Quite a bit of screen staring" },
	{ min: 20, emoji: "👀", nameZh: "盯屏狂魔", nameEn: "Screen Goblin", descZh: "目不转睛，该歇歇了", descEn: "Eyes glued to the screen" },
	{ min: 0, emoji: "😵", nameZh: "彻底沦陷", nameEn: "Fully Lost", descZh: "全程盯屏，无药可救", descEn: "Glued to screen the entire time" },
];

function getZenLevel(zenPct: number) {
	for (const lvl of ZEN_LEVELS) {
		if (zenPct >= lvl.min) return lvl;
	}
	return ZEN_LEVELS[ZEN_LEVELS.length - 1];
}

// ── helpers ─────────────────────────────────────────────────────────────────

const DAY_MS = 24 * 60 * 60 * 1_000;

function startOfToday(): number {
	const now = new Date();
	now.setHours(0, 0, 0, 0);
	return now.getTime();
}

function startOfWeek(): number {
	// Week starts Monday
	const now = new Date();
	const day = now.getDay(); // 0=Sun..6=Sat
	const diff = day === 0 ? 6 : day - 1;
	now.setDate(now.getDate() - diff);
	now.setHours(0, 0, 0, 0);
	return now.getTime();
}

function computePeriodStats(sessions: ForegroundStoreState["sessions"], sinceMs: number, liveDelta: { fgDelta: number; runDelta: number; sessionId: string | null }) {
	let fgMs = 0;
	let totalMs = 0;
	const sinceKey = dayKeyOf(sinceMs);
	for (const stats of Object.values(sessions)) {
		// Sessions without day buckets (legacy data) contribute nothing to
		// daily/weekly aggregates — they start counting from their next flush.
		const days = stats.days;
		if (!days) continue;
		for (const [dayKey, d] of Object.entries(days)) {
			if (dayKey < sinceKey) continue; // lexicographic == chronological (YYYY-MM-DD)
			const run = d.run ?? 0;
			const fg = Math.min(d.fg ?? 0, run);
			fgMs += fg;
			totalMs += run;
		}
	}
	// Live (un-flushed) increments always belong to "now", which is inside this
	// period (today or this week) by construction.
	fgMs += liveDelta.fgDelta;
	totalMs += liveDelta.runDelta;
	fgMs = Math.min(fgMs, totalMs);
	const ratio = totalMs > 0 ? Math.round((fgMs / totalMs) * 100) : 0;
	const zenPct = 100 - ratio;
	return { fgMs, totalMs, ratio, zenPct };
}

// ── component ────────────────────────────────────────────────────────────────

interface ZenSettingsSectionProps {
	zenSettingsStore: ZenSettingsStore;
	foregroundStore: {
		getSnapshot: () => ForegroundStoreState;
		getLiveMs: () => { fgDelta: number; runDelta: number; sessionId: string | null };
		subscribe: (fn: () => void) => () => void;
	};
	t: (key: string, params?: Record<string, any>) => string;
}

interface ToggleItem {
	key: keyof import("../zen-settings").ZenSettings;
	labelKey: string;
}

const ITEMS: ToggleItem[] = [
	{ key: "showRunningStatus", labelKey: "settings.showRunningStatus" },
	{ key: "showRunningSub", labelKey: "settings.showRunningSub" },
	{ key: "showDoneStatus", labelKey: "settings.showDoneStatus" },
	{ key: "showUserMessage", labelKey: "settings.showUserMessage" },
	{ key: "showPrevReply", labelKey: "settings.showPrevReply" },
	{ key: "showCurrentReply", labelKey: "settings.showCurrentReply" },
	{ key: "showTurnStats", labelKey: "settings.showTurnStats" },
	{ key: "showForegroundTooltip", labelKey: "settings.showForegroundTooltip" },
	{ key: "autoEnterZen", labelKey: "settings.autoEnterZen" },
	{ key: "autoExitZen", labelKey: "settings.autoExitZen" },
	{ key: "animation", labelKey: "settings.animation" },
];

export const ZenSettingsSection = React.memo(function ZenSettingsSection(props: ZenSettingsSectionProps) {
	const { zenSettingsStore, foregroundStore, t } = props;

	const [, forceUpdate] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);
	React.useEffect(() => foregroundStore.subscribe(forceUpdate), [foregroundStore]);

	const settings = zenSettingsStore.getSnapshot();
	const statsState = foregroundStore.getSnapshot();
	const liveDelta = foregroundStore.getLiveMs();

	const todayStats = computePeriodStats(statsState.sessions, startOfToday(), liveDelta);
	const weekStats = computePeriodStats(statsState.sessions, startOfWeek(), liveDelta);
	const todayLevel = getZenLevel(todayStats.zenPct);
	const isZh = (t("zen.zen") === "禅");

	// Live tick — 1s so stats feel real-time (getLiveMs adds un-flushed delta)
	const [, clockTick] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => {
		const id = setInterval(clockTick, 1_000);
		return () => clearInterval(id);
	}, []);

	return React.createElement("div", { className: "dsh-zen-settings" },
		React.createElement("div", { className: "dsh-zen-settingsTitle" }, t("settings.title")),
		React.createElement("div", { className: "dsh-zen-settingsDesc" }, t("settings.desc")),
		React.createElement("div", { className: "dsh-zen-settingsShortcut" }, t("settings.shortcut")),
		// Zen stats card
		React.createElement("div", { className: "dsh-zen-statsCard" },
			React.createElement("div", { className: "dsh-zen-statsGrid" },
				React.createElement("div", { className: "dsh-zen-statBox" },
					React.createElement("div", { className: "dsh-zen-statLabel" }, t("zen.todayZen")),
					React.createElement("div", { className: "dsh-zen-statValue" }, todayStats.zenPct + "%"),
					React.createElement("div", { className: "dsh-zen-statSub" }, `${t("zen.foreground")} ${formatDuration(todayStats.fgMs)} · ${t("zen.total")} ${formatDuration(todayStats.totalMs)}`),
				),
				React.createElement("div", { className: "dsh-zen-statBox" },
					React.createElement("div", { className: "dsh-zen-statLabel" }, t("zen.weekZen")),
					React.createElement("div", { className: "dsh-zen-statValue" }, weekStats.zenPct + "%"),
					React.createElement("div", { className: "dsh-zen-statSub" }, `${t("zen.foreground")} ${formatDuration(weekStats.fgMs)} · ${t("zen.total")} ${formatDuration(weekStats.totalMs)}`),
				),
			),
			React.createElement("div", { className: "dsh-zen-levelRow" },
				React.createElement("div", { className: "dsh-zen-levelLeft" },
					React.createElement("div", { className: "dsh-zen-levelName" }, isZh ? todayLevel.nameZh : todayLevel.nameEn),
					React.createElement("div", { className: "dsh-zen-levelDesc" }, isZh ? todayLevel.descZh : todayLevel.descEn),
				),
				React.createElement("div", { className: "dsh-zen-levelBadge" }, todayLevel.emoji),
			),
		),
		// Toggle items
		ITEMS.map((item) =>
			React.createElement("div", { key: item.key, className: "dsh-zen-settingsItem" },
				React.createElement("span", { className: "dsh-zen-settingsItemLabel" }, t(item.labelKey)),
				React.createElement("button", {
					className: "dsh-zen-settingsSwitch",
					"data-on": String(settings[item.key]),
					onClick: () => zenSettingsStore.update({ [item.key]: !settings[item.key] } as any),
				},
					React.createElement("span", { className: "dsh-zen-settingsSwitchKnob" }),
				),
			),
		),
	);
});
