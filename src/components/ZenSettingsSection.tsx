/**
 * ZenSettingsSection — settings panel for configuring Zen view display.
 * @module dsh-zen-tracker/components/ZenSettingsSection
 */

import React from "react";
import type { ZenSettingsStore } from "../zen-settings";
import type { PetStore } from "../pet-store";

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

/* ── Pet import section ──────────────────────────────────────────────────── */

.dsh-zen-petSection {
	padding: 12px 0;
	border-bottom: 1px solid var(--dsw-alias-border-l2);
}

.dsh-zen-petRow {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
}

.dsh-zen-petName {
	font-size: 14px;
	color: var(--dsw-alias-label-secondary);
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.dsh-zen-petActions {
	display: flex;
	gap: 8px;
	flex: none;
}

.dsh-zen-petBtn {
	padding: 4px 12px;
	font-size: 13px;
	line-height: 20px;
	border-radius: 6px;
	border: 1px solid var(--dsw-alias-border-l2);
	background: var(--dsw-alias-interactive-bg-hover);
	color: var(--dsw-alias-label-secondary);
	cursor: pointer;
	transition: background 0.12s;
}

.dsh-zen-petBtn:hover {
	background: var(--dsw-alias-interactive-bg-active);
	color: var(--dsw-alias-label-primary);
}

.dsh-zen-petBtn[data-variant="primary"] {
	background: var(--dsw-alias-state-business-primary);
	color: #fff;
	border-color: transparent;
}

.dsh-zen-petBtn[data-variant="primary"]:hover {
	opacity: 0.88;
}

.dsh-zen-petHint {
	font-size: 12px;
	color: var(--dsw-alias-label-caption);
	margin-top: 6px;
	line-height: 18px;
}

.dsh-zen-petFileInput {
	display: none;
}
`;

if (typeof document !== "undefined" && !document.querySelector("style[data-plugin-css=\"dsh-zen-tracker/settings\"]")) {
	const tag = document.createElement("style");
	tag.setAttribute("data-plugin-css", "dsh-zen-tracker/settings");
	tag.textContent = CSS;
	document.head.appendChild(tag);
}

interface ZenSettingsSectionProps {
	zenSettingsStore: ZenSettingsStore;
	petStore: PetStore;
	t: (key: string, params?: Record<string, any>) => string;
}

interface ToggleItem {
	key: keyof import("../zen-settings").ZenSettings;
	labelKey: string;
}

const ITEMS: ToggleItem[] = [
	{ key: "showPet", labelKey: "settings.showPet" },
	{ key: "showEmoji", labelKey: "settings.showEmoji" },
	{ key: "showStatus", labelKey: "settings.showStatus" },
	{ key: "showUserMessage", labelKey: "settings.showUserMessage" },
	{ key: "showAiReply", labelKey: "settings.showAiReply" },
	{ key: "showTurnStats", labelKey: "settings.showTurnStats" },
	{ key: "showForegroundTooltip", labelKey: "settings.showForegroundTooltip" },
];

export const ZenSettingsSection = React.memo(function ZenSettingsSection(props: ZenSettingsSectionProps) {
	const { zenSettingsStore, petStore, t } = props;

	const [, forceUpdate] = React.useReducer((c: number) => c + 1, 0);
	React.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);
	React.useEffect(() => petStore.subscribe(forceUpdate), [petStore]);

	const settings = zenSettingsStore.getSnapshot();
	const petMeta = petStore.getMeta();
	const isCustom = petStore.isCustom();

	const fileInputRef = React.useRef<HTMLInputElement>(null);

	const handleFile = React.useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			await petStore.importSprite(file);
		} catch (err) {
			console.error("[zen-tracker] Failed to import pet:", err);
			alert(t("pet.importError"));
		}
		// Reset input so the same file can be re-selected
		e.target.value = "";
	}, [petStore, t]);

	return React.createElement("div", { className: "dsh-zen-settings" },
		React.createElement("div", { className: "dsh-zen-settingsTitle" }, t("settings.title")),
		React.createElement("div", { className: "dsh-zen-settingsDesc" }, t("settings.desc")),
		// Pet import section
		React.createElement("div", { className: "dsh-zen-petSection" },
			React.createElement("div", { className: "dsh-zen-petRow" },
				React.createElement("span", { className: "dsh-zen-petName" }, petMeta.name),
				React.createElement("div", { className: "dsh-zen-petActions" },
					isCustom && React.createElement("button", {
						className: "dsh-zen-petBtn",
						onClick: () => petStore.resetSprite(),
					}, t("pet.reset")),
					React.createElement("button", {
						className: "dsh-zen-petBtn",
						"data-variant": "primary",
						onClick: () => fileInputRef.current?.click(),
					}, t("pet.import")),
				),
			),
			React.createElement("div", { className: "dsh-zen-petHint" }, t("pet.hint")),
			React.createElement("input", {
				ref: fileInputRef,
				type: "file",
				accept: "image/webp,image/png,image/gif",
				className: "dsh-zen-petFileInput",
				onChange: handleFile,
			}),
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
