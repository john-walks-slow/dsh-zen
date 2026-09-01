/**
 * Locale dictionaries for the `zen-tracker` namespace.
 * @module dsh-zen-tracker/locales
 */

/** Dictionary namespace owned by this plugin. */
export const NS = "zen-tracker";

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
	"view.zen": "Zen",
	"zen.deepDiving": "在潜水呢，别盯了～",
	"zen.ready": "搞定啦 ✨",
	"zen.subRunning": "去做点别的吧，完成了会叫你",
	"zen.subReady": "回来看看结果吧",
	"zen.foreground": "盯屏",
	"zen.total": "已运行",
	"zen.ratio": "盯屏比例",
	"zen.statsTitle": "前台时间统计",
	"zen.tooltipHint": "盯屏越少越好哦",
	"zen.noSession": "选个会话开始吧 🌙",
	"zen.youSaid": "上轮用户消息",
	"zen.aiSaid": "AI 回复",
	"zen.turnCount": "步数",
	"zen.runTime": "用时",
	"chatHide.toggle": "隐藏中间过程",
	"chatHide.desc": "隐藏工具调用、推理、上下文注入等中间步骤",
	"settings.title": "Zen 设置",
	"settings.desc": "配置 Zen 页签显示哪些内容",
	"settings.showStatus": "显示状态文案",
	"settings.showUserMessage": "显示用户消息",
	"settings.showAiReply": "显示 AI 回复",
	"settings.showTurnStats": "显示本轮轮次和用时",
	"settings.showForegroundTooltip": "显示盯屏时间统计",
	"settings.showPet": "显示桌宠",
	"settings.showEmoji": "显示 Emoji 图标（🐋/✨）",
	"pet.import": "导入",
	"pet.reset": "恢复默认",
	"pet.hint": "支持 Codex 格式 spritesheet（WebP/PNG/GIF，8列×9行或11行）",
	"pet.importError": "导入失败，请检查图片格式",
};

/** English dictionary. */
export const en = {
	"view.zen": "Zen",
	"zen.deepDiving": "Deep diving, stop staring~",
	"zen.ready": "Done ✨",
	"zen.subRunning": "Go do something else, I'll ping you when ready",
	"zen.subReady": "Come check the results",
	"zen.foreground": "Foreground",
	"zen.total": "Total",
	"zen.ratio": "Foreground ratio",
	"zen.statsTitle": "Foreground Time Stats",
	"zen.tooltipHint": "Less staring is better",
	"zen.noSession": "Pick a session to start 🌙",
	"zen.youSaid": "Last user message",
	"zen.aiSaid": "AI replied",
	"zen.turnCount": "Steps",
	"zen.runTime": "Time",
	"chatHide.toggle": "Hide intermediate steps",
	"chatHide.desc": "Hide tool calls, reasoning, context injection and other intermediate steps",
	"settings.title": "Zen Settings",
	"settings.desc": "Configure what to show in the Zen tab",
	"settings.showStatus": "Show status message",
	"settings.showUserMessage": "Show user message",
	"settings.showAiReply": "Show AI reply",
	"settings.showTurnStats": "Show turn count and run time",
	"settings.showForegroundTooltip": "Show foreground time stats",
	"settings.showPet": "Show desktop pet",
	"settings.showEmoji": "Show emoji icon (🐋/✨)",
	"pet.import": "Import",
	"pet.reset": "Reset",
	"pet.hint": "Supports Codex spritesheet format (WebP/PNG/GIF, 8 cols × 9 or 11 rows)",
	"pet.importError": "Import failed, check image format",
};
