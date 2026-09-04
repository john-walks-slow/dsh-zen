window.__ModuleLoader__.load({
	id: "dsh-zen-tracker",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name2 in all)
    __defProp(target, name2, { get: all[name2], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/client.ts
var client_exports = {};
__export(client_exports, {
  apply: () => apply,
  inject: () => inject,
  name: () => name
});
module.exports = __toCommonJS(client_exports);

// src/locales.ts
var NS = "zen-tracker";
var zh = {
  "view.zen": "Zen",
  "zen.loading": "\u8F7D\u5165\u4E2D\u2026",
  "zen.deepDiving1": "\u5728\u6F5C\u6C34\u5462\uFF0C\u522B\u76EF\u4E86\uFF5E",
  "zen.deepDiving2": "\u6C34\u5E95\u4E16\u754C\u5F88\u7CBE\u5F69\uFF5E",
  "zen.deepDiving3": "\u6B63\u5728\u6DF1\u6F5C\u4E2D\uFF0C\u7A0D\u7B49",
  "zen.deepDiving4": "\u5B89\u5FC3\u7B49\u7740\u5C31\u597D",
  "zen.deepDiving5": "\u9C7C\u8FD8\u5728\u6E38\uFF0C\u522B\u62C9\u6746",
  "zen.ready1": "\u641E\u5B9A\u5566 \u2728",
  "zen.ready2": "\u5927\u529F\u544A\u6210 \u{1F389}",
  "zen.ready3": "\u5B8C\u5DE5\uFF01\u6765\u770B\u770B\u5427 \u{1F440}",
  "zen.ready4": "\u9C7C\u4E0A\u94A9\u4E86 \u{1F41F}",
  "zen.ready5": "\u56DE\u6765\u6536\u7F51\u5566 \u{1F3A3}",
  "zen.subRunning1": "\u53BB\u505A\u70B9\u522B\u7684\u5427\uFF0C\u5B8C\u6210\u4E86\u4F1A\u53EB\u4F60",
  "zen.subRunning2": "\u559D\u676F\u8336\uFF0C\u7B49\u7740\u5C31\u597D",
  "zen.subRunning3": "\u53BB\u6563\u4E2A\u6B65\uFF1F",
  "zen.subRunning4": "\u4E0D\u7528\u4E00\u76F4\u76EF\u7740\uFF0C\u653E\u5FC3",
  "zen.subReady1": "\u56DE\u6765\u770B\u770B\u7ED3\u679C\u5427",
  "zen.subReady2": "\u51C6\u5907\u597D\u9A8C\u6536\u4E86\u5417",
  "zen.subReady3": "\u56DE\u6765\u770B\u6210\u679C\u5566",
  "zen.foreground": "\u76EF\u5C4F",
  "zen.total": "\u5DF2\u8FD0\u884C",
  "zen.ratio": "\u76EF\u5C4F\u6BD4\u4F8B",
  "zen.zen": "\u7985",
  "zen.statsTitle": "\u524D\u53F0\u65F6\u95F4\u7EDF\u8BA1",
  "zen.stats": "\u7EDF\u8BA1",
  "zen.noSession": "\u9009\u4E2A\u4F1A\u8BDD\u5F00\u59CB\u5427 \u{1F319}",
  "zen.youSaid": "\u7528\u6237\u6D88\u606F",
  "zen.prevReply": "\u4E0A\u8F6E\u56DE\u590D",
  "zen.currentReply": "\u52A8\u6001",
  "zen.runningTool": "\u6B63\u5728\u6267\u884C",
  "zen.aiSaid": "AI \u56DE\u590D",
  "zen.turnCount": "\u6B65\u6570",
  "zen.runTime": "\u7528\u65F6",
  "zen.todayZen": "\u4ECA\u65E5\u7985",
  "zen.weekZen": "\u672C\u5468\u7985",
  "chatHide.toggle": "\u9690\u85CF\u4E2D\u95F4\u8FC7\u7A0B",
  "chatHide.desc": "\u9690\u85CF\u5DE5\u5177\u8C03\u7528\u3001\u63A8\u7406\u3001\u4E0A\u4E0B\u6587\u6CE8\u5165\u7B49\u4E2D\u95F4\u6B65\u9AA4",
  "settings.title": "Zen \u8BBE\u7F6E",
  "settings.desc": "\u914D\u7F6E Zen \u89C6\u56FE\u4E0E\u76EF\u5C4F\u7EDF\u8BA1",
  "settings.shortcut": "\u5FEB\u6377\u952E\uFF1AAlt+Z \u5207\u6362\u7985 / \u804A\u5929\u89C6\u56FE",
  "settings.showRunningStatus": "\u663E\u793A\u8FDB\u884C\u4E2D\u6587\u6848",
  "settings.showDoneStatus": "\u663E\u793A\u7ED3\u675F\u6587\u6848",
  "settings.showUserMessage": "\u751F\u6210\u4E2D\u663E\u793A\u7528\u6237\u6D88\u606F",
  "settings.showPrevReply": "\u751F\u6210\u4E2D\u663E\u793A\u4E0A\u8F6E\u56DE\u590D",
  "settings.showCurrentReply": "\u751F\u6210\u4E2D\u663E\u793A\u52A8\u6001",
  "settings.showTurnStats": "\u663E\u793A\u672C\u8F6E\u8F6E\u6B21\u548C\u7528\u65F6",
  "settings.showForegroundTooltip": "\u663E\u793A\u76EF\u5C4F\u65F6\u95F4\u7EDF\u8BA1",
  "settings.autoEnterZen": "\u81EA\u52A8\u8FDB\u5165\u7985\uFF08\u4EFB\u52A1\u5F00\u59CB\u65F6\uFF09",
  "settings.autoExitZen": "\u81EA\u52A8\u89E3\u9664\u7985\uFF08\u4EFB\u52A1\u5B8C\u6210\u65F6\uFF09",
  "settings.animation": "\u52A8\u6548"
};
var en = {
  "view.zen": "Zen",
  "zen.loading": "Loading\u2026",
  "zen.deepDiving1": "Deep diving, stop staring~",
  "zen.deepDiving2": "Underwater world is amazing~",
  "zen.deepDiving3": "Deep diving, hang tight",
  "zen.deepDiving4": "Just relax and wait",
  "zen.deepDiving5": "Fish still swimming, don't reel in",
  "zen.ready1": "Done \u2728",
  "zen.ready2": "All finished \u{1F389}",
  "zen.ready3": "Complete! Come check it out \u{1F440}",
  "zen.ready4": "Fish caught \u{1F41F}",
  "zen.ready5": "Time to reel in \u{1F3A3}",
  "zen.subRunning1": "Go do something else, I'll ping you when ready",
  "zen.subRunning2": "Have some tea, just wait",
  "zen.subRunning3": "Go for a walk?",
  "zen.subRunning4": "No need to stare, relax",
  "zen.subReady1": "Come check the results",
  "zen.subReady2": "Ready to review?",
  "zen.subReady3": "Come see the results",
  "zen.foreground": "Foreground",
  "zen.total": "Total",
  "zen.ratio": "Foreground ratio",
  "zen.zen": "Zen",
  "zen.statsTitle": "Foreground Time Stats",
  "zen.stats": "Stats",
  "zen.noSession": "Pick a session to start \u{1F319}",
  "zen.youSaid": "User message",
  "zen.prevReply": "Last reply",
  "zen.currentReply": "Activity",
  "zen.runningTool": "Running",
  "zen.aiSaid": "AI replied",
  "zen.turnCount": "Steps",
  "zen.runTime": "Time",
  "zen.todayZen": "Today's Zen",
  "zen.weekZen": "This Week's Zen",
  "chatHide.toggle": "Hide intermediate steps",
  "chatHide.desc": "Hide tool calls, reasoning, context injection and other intermediate steps",
  "settings.title": "Zen Settings",
  "settings.desc": "Configure Zen view and screen-time stats",
  "settings.shortcut": "Shortcut: Alt+Z toggles Zen / chat view",
  "settings.showRunningStatus": "Show running message",
  "settings.showDoneStatus": "Show done message",
  "settings.showUserMessage": "Show user message while running",
  "settings.showPrevReply": "Show last reply while running",
  "settings.showCurrentReply": "Show activity while running",
  "settings.showTurnStats": "Show turn count and run time",
  "settings.showForegroundTooltip": "Show foreground time stats",
  "settings.autoEnterZen": "Auto enter Zen (on task start)",
  "settings.autoExitZen": "Auto exit Zen (on task complete)",
  "settings.animation": "Animations"
};

// src/foreground-tracker.ts
var FLUSH_INTERVAL_MS = 5e3;
var MAX_SESSIONS = 200;
var PRUNE_AFTER_MS = 30 * 24 * 60 * 60 * 1e3;
function formatDuration(ms) {
  if (ms < 1e3) return "0s";
  const totalSec = Math.floor(ms / 1e3);
  if (totalSec < 60) return `${totalSec}s`;
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (min < 60) return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
  const hr = Math.floor(min / 60);
  const remMin = min % 60;
  return remMin > 0 ? `${hr}h ${remMin}m` : `${hr}h`;
}
var g = globalThis;
var WINDOW_KEY = "__dshZenTrackerStore";
function initForegroundTracker(ctx) {
  if (g[WINDOW_KEY] && g[WINDOW_KEY].alive) return g[WINDOW_KEY].store;
  if (g[WINDOW_KEY]) g[WINDOW_KEY].dispose();
  g[WINDOW_KEY] = createTracker(ctx);
  return g[WINDOW_KEY].store;
}
function createTracker(ctx) {
  const sessions = ctx.sessions;
  const persistKey = "dsh.zen-tracker.stats";
  const loadInitial = () => {
    try {
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        const out = {};
        for (const [id, s] of Object.entries(parsed.sessions ?? {})) {
          const src = s ?? {};
          out[id] = {
            ...src,
            runningMs: src.runningMs ?? src.foregroundMs ?? 0
          };
        }
        return { sessions: out };
      }
    } catch {
    }
    return { sessions: {} };
  };
  let state = loadInitial();
  const listeners = /* @__PURE__ */ new Set();
  const notify = () => {
    for (const fn of listeners) fn();
  };
  const mergePersist = () => {
    try {
      let stored = {};
      const raw = localStorage.getItem(persistKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        stored = parsed.sessions ?? {};
      }
      const liveIds = new Set(Object.keys(sessions.list.getSnapshot().byId));
      const merged = {};
      for (const [id, s] of Object.entries(state.sessions)) {
        const old = stored[id];
        if (!old) {
          merged[id] = s;
          continue;
        }
        merged[id] = {
          foregroundMs: Math.max(old.foregroundMs ?? 0, s.foregroundMs ?? 0),
          runningMs: Math.max(old.runningMs ?? 0, s.runningMs ?? 0),
          sessionStartMs: Math.min(old.sessionStartMs ?? s.sessionStartMs, s.sessionStartMs),
          sessionEndMs: s.sessionEndMs ?? old.sessionEndMs ?? null,
          title: s.title || old.title || id
        };
      }
      for (const [id, s] of Object.entries(stored)) {
        if (!merged[id] && liveIds.has(id)) merged[id] = s;
      }
      state = { sessions: merged };
      localStorage.setItem(persistKey, JSON.stringify({ sessions: merged }));
    } catch {
    }
  };
  const store = {
    getSnapshot: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update: (updater) => {
      state = updater(state);
      mergePersist();
      notify();
    },
    set: (next) => {
      state = next;
      mergePersist();
      notify();
    }
  };
  let activeSessionId = null;
  let runSegStart = null;
  let fgSegStart = null;
  let wasRunning = false;
  function flush(sessionId, runStart, fgStart) {
    const now = Date.now();
    const runDelta = runStart !== null ? now - runStart : 0;
    const fgDelta = fgStart !== null ? now - fgStart : 0;
    if (runDelta <= 0 && fgDelta <= 0) return;
    store.update((prev) => {
      const existing = prev.sessions[sessionId] ?? {
        foregroundMs: 0,
        runningMs: 0,
        sessionStartMs: now,
        sessionEndMs: null,
        title: sessionId
      };
      return {
        sessions: {
          ...prev.sessions,
          [sessionId]: {
            ...existing,
            foregroundMs: existing.foregroundMs + Math.max(0, fgDelta),
            runningMs: (existing.runningMs ?? 0) + Math.max(0, runDelta)
          }
        }
      };
    });
  }
  function pruneIfNeeded() {
    const now = Date.now();
    const entries = Object.entries(state.sessions);
    if (entries.length <= MAX_SESSIONS) {
      let changed = false;
      const kept2 = {};
      for (const [id, stats] of entries) {
        if (now - stats.sessionStartMs > PRUNE_AFTER_MS) {
          changed = true;
          continue;
        }
        kept2[id] = stats;
      }
      if (changed) store.set({ sessions: kept2 });
      return;
    }
    entries.sort((a, b) => b[1].sessionStartMs - a[1].sessionStartMs);
    const kept = {};
    for (const [id, stats] of entries.slice(0, MAX_SESSIONS)) {
      if (now - stats.sessionStartMs <= PRUNE_AFTER_MS) kept[id] = stats;
    }
    store.set({ sessions: kept });
  }
  function ensureSession(sessionId, title, running) {
    store.update((prev) => {
      if (prev.sessions[sessionId]) {
        const existing = prev.sessions[sessionId];
        if (existing.sessionEndMs === null && !running) {
          return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title, sessionEndMs: Date.now() } } };
        }
        if (existing.sessionEndMs !== null && running) {
          return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title, sessionEndMs: null } } };
        }
        if (existing.title !== title) {
          return { sessions: { ...prev.sessions, [sessionId]: { ...existing, title } } };
        }
        return prev;
      }
      return {
        sessions: {
          ...prev.sessions,
          [sessionId]: { foregroundMs: 0, runningMs: 0, sessionStartMs: Date.now(), sessionEndMs: running ? null : Date.now(), title }
        }
      };
    });
  }
  function reevaluate() {
    const isZenTabActive = typeof document !== "undefined" && document.querySelector(".dsh-zen-root") !== null;
    const isWindowVisible = !isZenTabActive && typeof document !== "undefined" && !document.hidden;
    const listSnap = sessions.list.getSnapshot();
    const currentId = listSnap.current ?? null;
    const currentSession = currentId ? listSnap.byId[currentId] : null;
    const isRunning = (currentSession?.running ?? false) && !currentSession?.pendingInteraction;
    for (const [id, summary] of Object.entries(listSnap.byId)) {
      ensureSession(id, summary.displayTitle, summary.running);
    }
    if (currentId !== activeSessionId) {
      if (activeSessionId !== null) flush(activeSessionId, runSegStart, fgSegStart);
      activeSessionId = currentId;
      runSegStart = null;
      fgSegStart = null;
      wasRunning = isRunning;
    }
    if (isRunning !== wasRunning) {
      if (activeSessionId !== null) flush(activeSessionId, runSegStart, fgSegStart);
      runSegStart = null;
      fgSegStart = null;
      wasRunning = isRunning;
    }
    if (activeSessionId === null) return;
    const shouldRun = isRunning;
    const shouldFg = isRunning && isWindowVisible;
    if (shouldRun && runSegStart === null) {
      runSegStart = Date.now();
    } else if (!shouldRun && runSegStart !== null) {
      flush(activeSessionId, runSegStart, null);
      runSegStart = null;
    }
    if (shouldFg && fgSegStart === null) {
      fgSegStart = Date.now();
    } else if (!shouldFg && fgSegStart !== null) {
      flush(activeSessionId, null, fgSegStart);
      fgSegStart = null;
    }
  }
  const onVisibilityChange = () => reevaluate();
  const onFocus = () => reevaluate();
  const onBlur = () => reevaluate();
  const onPageHide = () => {
    if (activeSessionId !== null) {
      flush(activeSessionId, runSegStart, fgSegStart);
      runSegStart = null;
      fgSegStart = null;
    }
  };
  let alive = true;
  const flushTimer = setInterval(() => {
    if (activeSessionId !== null && (runSegStart !== null || fgSegStart !== null)) {
      flush(activeSessionId, runSegStart, fgSegStart);
      const now = Date.now();
      if (runSegStart !== null) runSegStart = now;
      if (fgSegStart !== null) fgSegStart = now;
    }
    pruneIfNeeded();
  }, FLUSH_INTERVAL_MS);
  const onStorage = (e) => {
    if (e.key !== null && e.key !== persistKey) return;
    mergePersist();
    notify();
  };
  const unsubSessions = sessions.list.subscribe(() => reevaluate());
  document.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("focus", onFocus);
  window.addEventListener("blur", onBlur);
  window.addEventListener("pagehide", onPageHide);
  window.addEventListener("storage", onStorage);
  reevaluate();
  const thisTracker = {
    store: {
      ...store,
      getLiveMs() {
        const now = Date.now();
        return {
          fgDelta: fgSegStart !== null ? Math.max(0, now - fgSegStart) : 0,
          runDelta: runSegStart !== null ? Math.max(0, now - runSegStart) : 0,
          sessionId: activeSessionId
        };
      }
    },
    dispose() {
      alive = false;
      if (activeSessionId !== null) {
        flush(activeSessionId, runSegStart, fgSegStart);
        runSegStart = null;
        fgSegStart = null;
      }
      if (g[WINDOW_KEY] === thisTracker) g[WINDOW_KEY] = null;
    },
    alive
  };
  ctx.effect(() => {
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("storage", onStorage);
      clearInterval(flushTimer);
      unsubSessions();
      if (activeSessionId !== null) {
        flush(activeSessionId, runSegStart, fgSegStart);
        runSegStart = null;
        fgSegStart = null;
      }
      thisTracker.dispose();
    };
  }, "zen-tracker: foreground tracker");
  return thisTracker;
}

// src/zen-settings.ts
var PERSIST_KEY = "dsh.zen-tracker.settings";
var DEFAULTS = {
  showRunningStatus: true,
  showDoneStatus: false,
  showUserMessage: true,
  showPrevReply: true,
  showCurrentReply: true,
  showTurnStats: true,
  showForegroundTooltip: true,
  autoEnterZen: false,
  autoExitZen: false,
  animation: false
};
function createZenSettingsStore() {
  let state = loadInitial();
  const listeners = /* @__PURE__ */ new Set();
  function loadInitial() {
    try {
      const raw = localStorage.getItem(PERSIST_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const { showPet: _p, showEmoji: _e, customRunningMessages: _cr, customDoneMessages: _cd, showAiReply: _ar, ...rest } = parsed;
        if ("showStatus" in rest) {
          const old = rest.showStatus;
          delete rest.showStatus;
          rest.showRunningStatus = old ?? true;
          rest.showDoneStatus = old === true;
        }
        return { ...DEFAULTS, ...rest };
      }
    } catch {
    }
    return { ...DEFAULTS };
  }
  function persist() {
    try {
      localStorage.setItem(PERSIST_KEY, JSON.stringify(state));
    } catch {
    }
  }
  function notify() {
    for (const fn of listeners) fn();
  }
  return {
    getSnapshot: () => state,
    subscribe: (fn) => {
      listeners.add(fn);
      return () => {
        listeners.delete(fn);
      };
    },
    update: (patch) => {
      state = { ...state, ...patch };
      persist();
      notify();
    }
  };
}

// src/components/ZenView.tsx
var import_react = __toESM(require("react"), 1);
var CSS = `
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
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8px;
}

/* Status center: always mounted; show/hide via data-hidden + transitions.
   Kept separate from .dsh-zen-center so the done-reply block is never
   height-clipped by max-height. */
.dsh-zen-statusCenter {
	max-height: 200px;
	overflow: hidden;
	transition: opacity 0.25s ease, max-height 0.25s ease, visibility 0.25s ease;
}

.dsh-zen-statusCenter[data-hidden="true"] {
	opacity: 0;
	visibility: hidden;
	max-height: 0;
}

.dsh-zen-message {
	font-size: 20px;
	font-weight: 500;
	line-height: 28px;
	color: var(--dsw-alias-label-secondary);
	text-align: center;
}

.dsh-zen-sub {
	font-size: 14px;
	line-height: 20px;
	color: var(--dsw-alias-label-tertiary);
}

@keyframes dsh-zen-fade-in {
	from { opacity: 0; transform: translateY(8px); }
	to { opacity: 1; transform: translateY(0); }
}

/* Animation toggle: when off, disable all entry animations and transitions */
.dsh-zen-root[data-anim="off"],
.dsh-zen-root[data-anim="off"] * {
	animation: none !important;
	transition: none !important;
}

/* \u2500\u2500 Turn stats \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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

.dsh-zen-turnStats + .dsh-zen-turnStats {
	animation-delay: 0.2s;
	margin-top: -4px;
}

.dsh-zen-turnStatsSep {
	color: var(--dsw-alias-label-caption);
	opacity: 0.5;
}

.dsh-zen-statVal {
	color: var(--dsw-alias-label-caption);
}

/* \u2500\u2500 Hint row (dotted underline, hover for tooltip) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.dsh-zen-hint {
	position: relative;
	display: inline-flex;
	align-items: center;
	cursor: help;
}

.dsh-zen-hintText {
	color: var(--dsw-alias-label-caption);
	border-bottom: 1px dotted var(--dsw-alias-label-caption);
	transition: color 0.12s, border-color 0.12s;
}

.dsh-zen-tooltip {
	position: absolute;
	bottom: 100%;
	left: 50%;
	transform: translateX(-50%) translateY(4px);
	min-width: 300px;
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
	transition: opacity 0.15s, transform 0.15s, visibility 0.15s;
	pointer-events: none;
	z-index: 10;
}

.dsh-zen-hint:hover .dsh-zen-tooltip {
	opacity: 1;
	visibility: visible;
	transform: translateX(-50%) translateY(0);
	pointer-events: auto;
}

.dsh-zen-tooltipTitle {
	font-size: 11px;
	font-weight: 600;
	color: var(--dsw-alias-label-caption);
	margin-bottom: 6px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
}

.dsh-zen-tooltipBody {
	max-width: 400px;
	max-height: 300px;
	overflow: auto;
	font-size: 13px;
	line-height: 22px;
	color: var(--dsw-alias-label-secondary);
}

/* Constrain markdown elements inside the tooltip */
.dsh-zen-tooltipBody > :first-child {
	margin-top: 0;
}
.dsh-zen-tooltipBody > :last-child {
	margin-bottom: 0;
}
.dsh-zen-tooltipBody p,
.dsh-zen-tooltipBody ul,
.dsh-zen-tooltipBody ol,
.dsh-zen-tooltipBody pre,
.dsh-zen-tooltipBody blockquote {
	margin: 6px 0;
}
.dsh-zen-tooltipBody h1,
.dsh-zen-tooltipBody h2,
.dsh-zen-tooltipBody h3,
.dsh-zen-tooltipBody h4 {
	margin: 8px 0 4px;
	font-size: 14px;
	line-height: 20px;
}
.dsh-zen-tooltipBody pre {
	max-width: 100%;
	overflow-x: auto;
	padding: 8px 10px;
	border-radius: 6px;
	background: var(--dsw-alias-interactive-bg-hover);
	font-size: 12px;
	line-height: 18px;
}
.dsh-zen-tooltipBody img {
	max-width: 100%;
	border-radius: 6px;
}
.dsh-zen-tooltipBody code {
	word-break: break-word;
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

/* \u2500\u2500 AI reply (markdown, bubble) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.dsh-zen-reply {
	width: 100%;
	max-width: 740px;
	box-sizing: border-box;
	font-size: 15px;
	line-height: 24px;
	color: var(--dsw-alias-label-primary);
	animation: dsh-zen-fade-in 0.3s ease-out 0.1s backwards;
}

/* \u2500\u2500 User message blockquote \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

.dsh-zen-userQuote {
	width: 100%;
	max-width: 740px;
	box-sizing: border-box;
	padding: 8px 16px;
	border-left: 3px solid var(--dsw-alias-border-l2);
	border-radius: 0 8px 8px 0;
	background: var(--dsw-alias-interactive-bg-subtle, transparent);
	font-size: 14px;
	line-height: 22px;
	color: var(--dsw-alias-label-secondary);
	white-space: pre-wrap;
	word-break: break-word;
	max-height: 200px;
	overflow: auto;
	animation: dsh-zen-fade-in 0.3s ease-out 0.08s backwards;
}
`;
if (typeof document !== "undefined" && !document.querySelector('style[data-plugin-css="dsh-zen-tracker/zen-view"]')) {
  const tag = document.createElement("style");
  tag.setAttribute("data-plugin-css", "dsh-zen-tracker/zen-view");
  tag.textContent = CSS;
  document.head.appendChild(tag);
}
function computeRatio(fgMs, totalMs) {
  if (totalMs <= 0) return 0;
  return Math.round(Math.min(fgMs, totalMs) / totalMs * 100);
}
function extractAssistantText(node) {
  const blocks = node?.data?.blocks;
  if (!Array.isArray(blocks)) return null;
  const texts = [];
  for (const block of blocks) {
    if (block?.kind === "text" && typeof block.text === "string" && block.text.trim()) {
      texts.push(block.text.trim());
    }
  }
  return texts.length ? texts.join("\n") : null;
}
function extractLastReply(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  for (let i = order.length - 1; i >= 0; i--) {
    const node = nodes.get(order[i]);
    if (!node || node.kind !== "assistant-step") continue;
    const text = extractAssistantText(node);
    if (text) return text;
  }
  return null;
}
function extractPrevRoundReply(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  const start = findCurrentRoundStart(chatSnapshot);
  if (!start) return null;
  for (let i = start.idx - 1; i >= 0; i--) {
    const node = nodes.get(order[i]);
    if (!node || node.kind !== "assistant-step") continue;
    const text = extractAssistantText(node);
    if (text) return text;
  }
  return null;
}
function extractCurrentRoundReply(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  const start = findCurrentRoundStart(chatSnapshot);
  if (!start) return null;
  for (let i = order.length - 1; i > start.idx; i--) {
    const node = nodes.get(order[i]);
    if (!node || node.kind !== "assistant-step") continue;
    const text = extractAssistantText(node);
    if (text) return text;
  }
  return null;
}
function extractLastUserMessage(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  for (let i = order.length - 1; i >= 0; i--) {
    const node = nodes.get(order[i]);
    if (!node) continue;
    if (node.kind === "user" || node.kind === "steering") {
      const data = node.data;
      if (!data) return null;
      if (Array.isArray(data.content)) {
        const texts = [];
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
function getLastUserKey(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  for (let i = order.length - 1; i >= 0; i--) {
    const node = nodes.get(order[i]);
    if (node && (node.kind === "user" || node.kind === "steering")) return order[i];
  }
  return null;
}
function findCurrentRoundStart(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  for (let i = order.length - 1; i >= 0; i--) {
    const node = nodes.get(order[i]);
    if (node && (node.kind === "user" || node.kind === "steering")) {
      return { idx: i, startTime: node.data?.time ?? 0 };
    }
  }
  return null;
}
function countRoundSteps(chatSnapshot) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
  const start = findCurrentRoundStart(chatSnapshot);
  if (!start) return 0;
  let count = 0;
  for (let i = start.idx + 1; i < order.length; i++) {
    const node = nodes.get(order[i]);
    if (node && node.kind === "assistant-step") count++;
  }
  return count;
}
function computeRoundMs(chatSnapshot, running) {
  const order = chatSnapshot?.order ?? [];
  const nodes = chatSnapshot?.nodes ?? /* @__PURE__ */ new Map();
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
function pickRandom(t, baseKey, count) {
  const idx = 1 + Math.floor(Math.random() * count);
  return t(`${baseKey}${idx}`);
}
function renderMarkdown(MarkdownText, text) {
  if (MarkdownText) {
    return import_react.default.createElement(MarkdownText, { text });
  }
  return import_react.default.createElement("div", { style: { whiteSpace: "pre-wrap", wordBreak: "break-word" } }, text);
}
var ZenView = import_react.default.memo(function ZenView2(props) {
  const { useSession, sessionId, t, foregroundStore, MarkdownText, zenSettingsStore } = props;
  const rawRunning = useSession((s) => s.running);
  const blank = useSession((s) => s.blank);
  const chat = useSession((s) => s.chat);
  const runningCalls = useSession((s) => s?.runningCalls);
  const openState = useSession((s) => s?.openState);
  const isLoading = !blank && (openState === "cold" || openState === "loading");
  const [statusRunning, setStatusRunning] = import_react.default.useState(rawRunning);
  import_react.default.useEffect(() => {
    if (rawRunning) {
      setStatusRunning(true);
      return;
    }
    const id = setTimeout(() => setStatusRunning(false), 800);
    return () => clearTimeout(id);
  }, [rawRunning]);
  const running = rawRunning;
  const settings = zenSettingsStore.getSnapshot();
  const currentUserKey = !blank ? getLastUserKey(chat) : null;
  const lastUserKeyRef = import_react.default.useRef(null);
  import_react.default.useEffect(() => {
    if (!statusRunning) lastUserKeyRef.current = getLastUserKey(chat);
  }, [statusRunning, chat]);
  const userMsg = !blank ? extractLastUserMessage(chat) : null;
  const userMsgVisible = !!userMsg && !blank && !isLoading && (statusRunning ? settings.showUserMessage && currentUserKey !== lastUserKeyRef.current : true);
  const [, forceUpdate] = import_react.default.useReducer((c) => c + 1, 0);
  import_react.default.useEffect(() => foregroundStore.subscribe(forceUpdate), [foregroundStore]);
  import_react.default.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);
  const statsState = foregroundStore.getSnapshot();
  const stats = statsState.sessions[sessionId];
  const { fgDelta, runDelta } = foregroundStore.getLiveMs();
  const totalMs = (stats?.runningMs ?? 0) + runDelta;
  const fgMs = Math.min((stats?.foregroundMs ?? 0) + fgDelta, totalMs);
  const ratio = computeRatio(fgMs, totalMs);
  const zenPct = 100 - ratio;
  const lastReply = !running && !blank ? extractLastReply(chat) : null;
  const prevReply = !blank ? extractPrevRoundReply(chat) : null;
  const currentReply = !blank ? extractCurrentRoundReply(chat) : null;
  const roundSteps = !blank ? countRoundSteps(chat) : 0;
  const roundMs = !blank ? computeRoundMs(chat, running) : 0;
  const runningTools = Array.isArray(runningCalls) ? runningCalls.map((c) => c?.name).filter((n) => typeof n === "string" && !!n) : [];
  const [, clockTick] = import_react.default.useReducer((c) => c + 1, 0);
  import_react.default.useEffect(() => {
    const id = setInterval(clockTick, 1e3);
    return () => clearInterval(id);
  }, []);
  const message = import_react.default.useMemo(
    () => blank ? t("zen.noSession") : isLoading ? t("zen.loading") : statusRunning ? pickRandom(t, "zen.deepDiving", 5) : pickRandom(t, "zen.ready", 5),
    [blank, isLoading, statusRunning]
  );
  const sub = import_react.default.useMemo(
    () => statusRunning ? pickRandom(t, "zen.subRunning", 4) : blank || isLoading ? "" : pickRandom(t, "zen.subReady", 3),
    [blank, isLoading, statusRunning]
  );
  const showStatusCenter = blank ? settings.showRunningStatus : isLoading || statusRunning ? settings.showRunningStatus : settings.showDoneStatus;
  return import_react.default.createElement(
    "div",
    { className: "dsh-zen-root", "data-anim": settings.animation ? "on" : "off" },
    // Status message (loading, running or done) — always mounted, fades via data-hidden
    import_react.default.createElement(
      "div",
      { className: "dsh-zen-center dsh-zen-statusCenter", "data-hidden": String(!showStatusCenter) },
      import_react.default.createElement("div", { className: "dsh-zen-message" }, message)
      // Second-line description temporarily hidden (keep code for re-enable)
      // sub && React.createElement("div", { className: "dsh-zen-sub" }, sub),
    ),
    // User message blockquote (below status, above reply) — while generating only
    !blank && !isLoading && userMsgVisible && import_react.default.createElement("blockquote", { className: "dsh-zen-userQuote" }, userMsg),
    // Done: AI reply with markdown (debounced — no flash on intermediate step gaps; always shown)
    !statusRunning && lastReply && !blank && !isLoading && import_react.default.createElement(
      "div",
      { className: "dsh-zen-center" },
      import_react.default.createElement(
        "div",
        { className: "dsh-zen-reply" },
        MarkdownText ? import_react.default.createElement(MarkdownText, { text: lastReply }) : lastReply
      )
    ),
    // Turn stats + current reply tooltip + prev reply tooltip + foreground tooltip (single line)
    !blank && !isLoading && (settings.showTurnStats || settings.showCurrentReply || settings.showPrevReply || settings.showForegroundTooltip) && import_react.default.createElement(
      "div",
      { className: "dsh-zen-turnStats" },
      settings.showTurnStats && import_react.default.createElement(
        import_react.default.Fragment,
        null,
        import_react.default.createElement("span", { className: "dsh-zen-statVal" }, `${t("zen.turnCount")} ${roundSteps}`),
        import_react.default.createElement("span", { className: "dsh-zen-turnStatsSep" }, "\xB7"),
        import_react.default.createElement("span", { className: "dsh-zen-statVal" }, `${t("zen.runTime")} ${formatDuration(roundMs)}`)
      ),
      statusRunning && settings.showCurrentReply && (currentReply || runningTools.length > 0) && import_react.default.createElement(
        import_react.default.Fragment,
        null,
        import_react.default.createElement("span", { className: "dsh-zen-turnStatsSep" }, "\xB7"),
        import_react.default.createElement(
          "div",
          { className: "dsh-zen-hint" },
          import_react.default.createElement("span", { className: "dsh-zen-hintText" }, t("zen.currentReply")),
          import_react.default.createElement(
            "div",
            { className: "dsh-zen-tooltip" },
            import_react.default.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.currentReply")),
            runningTools.length > 0 && import_react.default.createElement(
              import_react.default.Fragment,
              null,
              import_react.default.createElement(
                "div",
                { className: "dsh-zen-tooltipRow" },
                import_react.default.createElement("span", null, t("zen.runningTool")),
                import_react.default.createElement("span", { className: "dsh-zen-tooltipValue" }, runningTools.join(" \xB7 "))
              ),
              currentReply && import_react.default.createElement("div", { className: "dsh-zen-tooltipDivider" })
            ),
            currentReply && import_react.default.createElement("div", { className: "dsh-zen-tooltipBody" }, renderMarkdown(MarkdownText, currentReply))
          )
        )
      ),
      statusRunning && settings.showPrevReply && prevReply && import_react.default.createElement(
        import_react.default.Fragment,
        null,
        import_react.default.createElement("span", { className: "dsh-zen-turnStatsSep" }, "\xB7"),
        import_react.default.createElement(
          "div",
          { className: "dsh-zen-hint" },
          import_react.default.createElement("span", { className: "dsh-zen-hintText" }, t("zen.prevReply")),
          import_react.default.createElement(
            "div",
            { className: "dsh-zen-tooltip" },
            import_react.default.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.prevReply")),
            import_react.default.createElement("div", { className: "dsh-zen-tooltipBody" }, renderMarkdown(MarkdownText, prevReply))
          )
        )
      ),
      settings.showForegroundTooltip && import_react.default.createElement(
        import_react.default.Fragment,
        null,
        import_react.default.createElement("span", { className: "dsh-zen-turnStatsSep" }, "\xB7"),
        import_react.default.createElement(
          "div",
          { className: "dsh-zen-hint" },
          import_react.default.createElement("span", { className: "dsh-zen-hintText" }, t("zen.stats")),
          import_react.default.createElement(
            "div",
            { className: "dsh-zen-tooltip" },
            import_react.default.createElement("div", { className: "dsh-zen-tooltipTitle" }, t("zen.statsTitle")),
            import_react.default.createElement(
              "div",
              { className: "dsh-zen-tooltipRow" },
              import_react.default.createElement("span", null, t("zen.foreground")),
              import_react.default.createElement("span", { className: "dsh-zen-tooltipValue" }, formatDuration(fgMs))
            ),
            import_react.default.createElement(
              "div",
              { className: "dsh-zen-tooltipRow" },
              import_react.default.createElement("span", null, t("zen.total")),
              import_react.default.createElement("span", { className: "dsh-zen-tooltipValue" }, formatDuration(totalMs))
            ),
            import_react.default.createElement("div", { className: "dsh-zen-tooltipDivider" }),
            import_react.default.createElement(
              "div",
              { className: "dsh-zen-tooltipRow" },
              import_react.default.createElement("span", null, t("zen.ratio")),
              import_react.default.createElement("span", { className: "dsh-zen-tooltipValue" }, ratio + "%")
            ),
            import_react.default.createElement(
              "div",
              { className: "dsh-zen-tooltipRow" },
              import_react.default.createElement("span", null, t("zen.zen")),
              import_react.default.createElement("span", { className: "dsh-zen-tooltipValue" }, zenPct + "%")
            )
          )
        )
      )
    )
  );
});

// src/components/ChatHideToggle.tsx
var import_react2 = __toESM(require("react"), 1);
var CSS2 = `
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

/* \u2500\u2500 Hide rules (activated by body[data-chat-hide="on"]) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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

/* Hide assistant-step that only contains think (no reply) \u2014 prevents extra flex gap */
body[data-chat-hide="on"] [data-chat-flow-kind="assistant-step"]:has(.Sxvs8a_body > [data-variant="think"]:only-child) { display: none !important; }

/* Collapse context/compaction rows inside user messages (they have padding:2px 0) */
body[data-chat-hide="on"] .gdEzaW_contextRow:empty,
body[data-chat-hide="on"] .gdEzaW_compactionRow:empty { display: none !important; }

/* Zero out gap in AssistantMarkdown body when reasoning hidden */
body[data-chat-hide="on"] [data-chat-flow-kind="assistant-step"] .Sxvs8a_body { gap: 0 !important; }
`;
if (typeof document !== "undefined" && !document.querySelector('style[data-plugin-css="dsh-zen-tracker/chat-hide"]')) {
  const tag = document.createElement("style");
  tag.setAttribute("data-plugin-css", "dsh-zen-tracker/chat-hide");
  tag.textContent = CSS2;
  document.head.appendChild(tag);
}
var PERSIST_KEY2 = "dsh.zen-tracker.chat-hide";
function loadToggleState() {
  try {
    return localStorage.getItem(PERSIST_KEY2) === "true";
  } catch {
    return false;
  }
}
function saveToggleState(on) {
  try {
    localStorage.setItem(PERSIST_KEY2, String(on));
  } catch {
  }
}
var _setView = null;
function switchView(view) {
  if (_setView) {
    _setView(view);
    return true;
  }
  return false;
}
var ChatHideToggle = import_react2.default.memo(function ChatHideToggle2(props) {
  const { t } = props;
  const [active, setActive] = import_react2.default.useState(() => loadToggleState());
  import_react2.default.useEffect(() => {
    try {
      const el = document.querySelector(".dsh-zen-chatHideBtn");
      if (!el) return;
      const fk = Object.keys(el).find((k) => k.startsWith("__reactFiber"));
      if (!fk) return;
      let fiber = el[fk];
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
    } catch {
    }
  }, []);
  import_react2.default.useEffect(() => {
    if (active) {
      document.body.setAttribute("data-chat-hide", "on");
    } else {
      document.body.removeAttribute("data-chat-hide");
    }
  }, [active]);
  const toggle = import_react2.default.useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      saveToggleState(next);
      return next;
    });
  }, []);
  return import_react2.default.createElement(
    "button",
    {
      type: "button",
      className: "dsh-zen-chatHideBtn",
      "data-active": active ? "true" : "false",
      title: t("chatHide.desc"),
      onClick: toggle
    },
    import_react2.default.createElement(
      "span",
      { className: "dsh-zen-chatHideIcon" },
      import_react2.default.createElement(
        "svg",
        { viewBox: "0 0 16 16", "aria-hidden": true },
        import_react2.default.createElement("path", {
          d: active ? "M1 8 C3 4, 6 2, 8 2 C10 2, 13 4, 15 8 C13 12, 10 14, 8 14 C6 14, 3 12, 1 8 Z M8 5 A3 3 0 1 1 8 11 A3 3 0 1 1 8 5 Z" : "M1 8 C3 4, 6 2, 8 2 C10 2, 13 4, 15 8 C13 12, 10 14, 8 14 C6 14, 3 12, 1 8 Z M5 5 L11 11 M11 5 L5 11",
          stroke: "currentColor",
          strokeWidth: "1.3",
          strokeLinecap: "round",
          fill: active ? "currentColor" : "none"
        })
      )
    ),
    import_react2.default.createElement("span", null, t("chatHide.toggle"))
  );
});

// src/components/ZenSettingsSection.tsx
var import_react3 = __toESM(require("react"), 1);
var CSS3 = `
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

/* \u2500\u2500 Zen stats card \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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

/* \u2500\u2500 Toggle items \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */

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
if (typeof document !== "undefined" && !document.querySelector('style[data-plugin-css="dsh-zen-tracker/settings"]')) {
  const tag = document.createElement("style");
  tag.setAttribute("data-plugin-css", "dsh-zen-tracker/settings");
  tag.textContent = CSS3;
  document.head.appendChild(tag);
}
var ZEN_LEVELS = [
  { min: 95, emoji: "\u{1F9D8}", nameZh: "\u7985\u5B97\u5927\u5E08", nameEn: "Zen Master", descZh: "\u51E0\u4E4E\u4E0D\u76EF\u5C4F\uFF0C\u6DF1\u5F97\u7985\u610F", descEn: "Barely glanced at the screen" },
  { min: 90, emoji: "\u{1F375}", nameZh: "\u8336\u9053\u884C\u8005", nameEn: "Tea Adept", descZh: "\u60A0\u95F2\u81EA\u5728\uFF0C\u76EF\u5C4F\u6781\u5C11", descEn: "Relaxed and minimal screen time" },
  { min: 80, emoji: "\u{1F33F}", nameZh: "\u9752\u82D4\u9690\u58EB", nameEn: "Moss Hermit", descZh: "\u6DE1\u5B9A\u4ECE\u5BB9\uFF0C\u5076\u5C14\u7784\u4E00\u773C", descEn: "Calm, checking in occasionally" },
  { min: 60, emoji: "\u{1F300}", nameZh: "\u534A\u9192\u534A\u68A6", nameEn: "Half Dreaming", descZh: "\u8FD8\u5728\u9002\u5E94\uFF0C\u4F1A\u5FCD\u4E0D\u4F4F\u770B\u770B", descEn: "Still adapting, peeking sometimes" },
  { min: 40, emoji: "\u{1F41D}", nameZh: "\u5FD9\u788C\u871C\u8702", nameEn: "Busy Bee", descZh: "\u76EF\u5C4F\u8F83\u591A\uFF0C\u8BD5\u7740\u653E\u624B\u5427", descEn: "Quite a bit of screen staring" },
  { min: 20, emoji: "\u{1F440}", nameZh: "\u76EF\u5C4F\u72C2\u9B54", nameEn: "Screen Goblin", descZh: "\u76EE\u4E0D\u8F6C\u775B\uFF0C\u8BE5\u6B47\u6B47\u4E86", descEn: "Eyes glued to the screen" },
  { min: 0, emoji: "\u{1F635}", nameZh: "\u5F7B\u5E95\u6CA6\u9677", nameEn: "Fully Lost", descZh: "\u5168\u7A0B\u76EF\u5C4F\uFF0C\u65E0\u836F\u53EF\u6551", descEn: "Glued to screen the entire time" }
];
function getZenLevel(zenPct) {
  for (const lvl of ZEN_LEVELS) {
    if (zenPct >= lvl.min) return lvl;
  }
  return ZEN_LEVELS[ZEN_LEVELS.length - 1];
}
var DAY_MS = 24 * 60 * 60 * 1e3;
function startOfToday() {
  const now = /* @__PURE__ */ new Date();
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}
function startOfWeek() {
  const now = /* @__PURE__ */ new Date();
  const day = now.getDay();
  const diff = day === 0 ? 6 : day - 1;
  now.setDate(now.getDate() - diff);
  now.setHours(0, 0, 0, 0);
  return now.getTime();
}
function computePeriodStats(sessions, sinceMs, liveDelta) {
  let fgMs = 0;
  let totalMs = 0;
  for (const stats of Object.values(sessions)) {
    const sessionStart = stats.sessionStartMs;
    if (sessionStart < sinceMs) continue;
    const run = stats.runningMs ?? 0;
    const fg = Math.min(stats.foregroundMs ?? 0, run);
    fgMs += fg;
    totalMs += run;
  }
  const liveSession = liveDelta.sessionId ? sessions[liveDelta.sessionId] : null;
  if (liveSession && liveSession.sessionStartMs >= sinceMs) {
    fgMs += liveDelta.fgDelta;
    totalMs += liveDelta.runDelta;
  }
  fgMs = Math.min(fgMs, totalMs);
  const ratio = totalMs > 0 ? Math.round(fgMs / totalMs * 100) : 0;
  const zenPct = 100 - ratio;
  return { fgMs, totalMs, ratio, zenPct };
}
var ITEMS = [
  { key: "showRunningStatus", labelKey: "settings.showRunningStatus" },
  { key: "showDoneStatus", labelKey: "settings.showDoneStatus" },
  { key: "showUserMessage", labelKey: "settings.showUserMessage" },
  { key: "showPrevReply", labelKey: "settings.showPrevReply" },
  { key: "showCurrentReply", labelKey: "settings.showCurrentReply" },
  { key: "showTurnStats", labelKey: "settings.showTurnStats" },
  { key: "showForegroundTooltip", labelKey: "settings.showForegroundTooltip" },
  { key: "autoEnterZen", labelKey: "settings.autoEnterZen" },
  { key: "autoExitZen", labelKey: "settings.autoExitZen" },
  { key: "animation", labelKey: "settings.animation" }
];
var ZenSettingsSection = import_react3.default.memo(function ZenSettingsSection2(props) {
  const { zenSettingsStore, foregroundStore, t } = props;
  const [, forceUpdate] = import_react3.default.useReducer((c) => c + 1, 0);
  import_react3.default.useEffect(() => zenSettingsStore.subscribe(forceUpdate), [zenSettingsStore]);
  import_react3.default.useEffect(() => foregroundStore.subscribe(forceUpdate), [foregroundStore]);
  const settings = zenSettingsStore.getSnapshot();
  const statsState = foregroundStore.getSnapshot();
  const liveDelta = foregroundStore.getLiveMs();
  const todayStats = computePeriodStats(statsState.sessions, startOfToday(), liveDelta);
  const weekStats = computePeriodStats(statsState.sessions, startOfWeek(), liveDelta);
  const todayLevel = getZenLevel(todayStats.zenPct);
  const isZh = t("zen.zen") === "\u7985";
  const [, clockTick] = import_react3.default.useReducer((c) => c + 1, 0);
  import_react3.default.useEffect(() => {
    const id = setInterval(clockTick, 1e3);
    return () => clearInterval(id);
  }, []);
  return import_react3.default.createElement(
    "div",
    { className: "dsh-zen-settings" },
    import_react3.default.createElement("div", { className: "dsh-zen-settingsTitle" }, t("settings.title")),
    import_react3.default.createElement("div", { className: "dsh-zen-settingsDesc" }, t("settings.desc")),
    import_react3.default.createElement("div", { className: "dsh-zen-settingsShortcut" }, t("settings.shortcut")),
    // Zen stats card
    import_react3.default.createElement(
      "div",
      { className: "dsh-zen-statsCard" },
      import_react3.default.createElement(
        "div",
        { className: "dsh-zen-statsGrid" },
        import_react3.default.createElement(
          "div",
          { className: "dsh-zen-statBox" },
          import_react3.default.createElement("div", { className: "dsh-zen-statLabel" }, t("zen.todayZen")),
          import_react3.default.createElement("div", { className: "dsh-zen-statValue" }, todayStats.zenPct + "%"),
          import_react3.default.createElement("div", { className: "dsh-zen-statSub" }, `${t("zen.foreground")} ${formatDuration(todayStats.fgMs)} \xB7 ${t("zen.total")} ${formatDuration(todayStats.totalMs)}`)
        ),
        import_react3.default.createElement(
          "div",
          { className: "dsh-zen-statBox" },
          import_react3.default.createElement("div", { className: "dsh-zen-statLabel" }, t("zen.weekZen")),
          import_react3.default.createElement("div", { className: "dsh-zen-statValue" }, weekStats.zenPct + "%"),
          import_react3.default.createElement("div", { className: "dsh-zen-statSub" }, `${t("zen.foreground")} ${formatDuration(weekStats.fgMs)} \xB7 ${t("zen.total")} ${formatDuration(weekStats.totalMs)}`)
        )
      ),
      import_react3.default.createElement(
        "div",
        { className: "dsh-zen-levelRow" },
        import_react3.default.createElement(
          "div",
          { className: "dsh-zen-levelLeft" },
          import_react3.default.createElement("div", { className: "dsh-zen-levelName" }, isZh ? todayLevel.nameZh : todayLevel.nameEn),
          import_react3.default.createElement("div", { className: "dsh-zen-levelDesc" }, isZh ? todayLevel.descZh : todayLevel.descEn)
        ),
        import_react3.default.createElement("div", { className: "dsh-zen-levelBadge" }, todayLevel.emoji)
      )
    ),
    // Toggle items
    ITEMS.map(
      (item) => import_react3.default.createElement(
        "div",
        { key: item.key, className: "dsh-zen-settingsItem" },
        import_react3.default.createElement("span", { className: "dsh-zen-settingsItemLabel" }, t(item.labelKey)),
        import_react3.default.createElement(
          "button",
          {
            className: "dsh-zen-settingsSwitch",
            "data-on": String(settings[item.key]),
            onClick: () => zenSettingsStore.update({ [item.key]: !settings[item.key] })
          },
          import_react3.default.createElement("span", { className: "dsh-zen-settingsSwitchKnob" })
        )
      )
    )
  );
});

// src/client.ts
var name = "zen-tracker";
var inject = ["slots", "sessions", "locale"];
function initAutoZenSwitcher(ctx, zenSettingsStore) {
  const sessions = ctx.sessions;
  let prevRunning = null;
  let prevSessionId = null;
  function check() {
    const snap = sessions.list.getSnapshot();
    const currentId = snap.current;
    const session = currentId ? snap.byId[currentId] : null;
    const running = session?.running ?? false;
    if (currentId !== prevSessionId) {
      prevSessionId = currentId;
      prevRunning = running;
      return;
    }
    const settings = zenSettingsStore.getSnapshot();
    if (prevRunning === false && running === true) {
      if (settings.autoEnterZen) switchView("zen");
    } else if (prevRunning === true && running === false) {
      if (settings.autoExitZen) switchView("chat");
    }
    prevRunning = running;
  }
  const unsub = sessions.list.subscribe(check);
  check();
  ctx.effect(() => () => unsub(), "zen-tracker: auto zen switcher");
}
function initZenShortcut(ctx) {
  ctx.effect(() => {
    const onKeyDown = (e) => {
      if (!e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      if (e.key !== "z" && e.key !== "Z") return;
      e.preventDefault();
      const inZen = typeof document !== "undefined" && document.querySelector(".dsh-zen-root") !== null;
      switchView(inZen ? "chat" : "zen");
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, "zen-tracker: alt+z toggle");
}
function apply(ctx) {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), "zen-tracker: dictionaries");
  const t = ctx.locale.bind(NS);
  const foregroundStore = initForegroundTracker(ctx);
  const zenSettingsStore = createZenSettingsStore();
  initAutoZenSwitcher(ctx, zenSettingsStore);
  initZenShortcut(ctx);
  let MarkdownText = null;
  try {
    MarkdownText = require("@deepseek-ai/dsh-client-ui-primitives").MarkdownText;
  } catch {
  }
  ctx.slots.inject("conversation.view", () => ctx.slots.register({
    name: "conversation.view",
    id: "zen",
    order: 5,
    label: () => t("view.zen"),
    locale: NS,
    inject: (_sessionId) => ({
      foregroundStore,
      MarkdownText,
      zenSettingsStore
    })
  }, ZenView));
  ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
    name: "conversation.session.header.actions",
    id: "chat-hide-toggle",
    order: 50,
    locale: NS,
    inject: () => ({
      t
    })
  }, ChatHideToggle));
  ctx.slots.inject("settings.section", () => ctx.slots.register({
    name: "settings.section",
    id: "zen",
    order: 50,
    label: () => t("settings.title"),
    locale: NS,
    inject: () => ({
      zenSettingsStore,
      foregroundStore,
      t
    })
  }, ZenSettingsSection));
}

		return module.exports;
	}
});
