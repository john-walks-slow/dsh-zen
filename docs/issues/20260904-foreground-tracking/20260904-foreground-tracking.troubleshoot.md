# 20260904-foreground-tracking — 盯屏时间没有记录

## 现象

用户报告：把页面放在对话视图停留很久（甚至去上厕所回来），查看盯屏统计，一秒都没有记录上。

## 复现与验证

- playwright 打开 http://127.0.0.1:3080（Edge headed），`window["__dshZenStore"]` alive，
  `getLiveMs()` 返回 `{fgDelta, runDelta, sessionId}` 结构正常。
- 打开会话并发消息后，tracker 正常累计（复现任务 189s 记入对应会话），**tracker 核心无故障**。
- 部署产物（`$DSH_HOME/profiles/web/node_modules/dsh-zen/lib/client.js`，59535B）与
  `lib/client.js` 一致，无过期构建问题。
- 页面状态实测：`document.hidden=false`、`document.hasFocus()` 因窗口/页面状态可能为 `false`。

## 根因

### 根因 1（主因）：foreground 判定依赖 `document.hasFocus()`

`src/foreground-tracker.ts` 中 `isWindowVisible` 原为：

```ts
const isWindowVisible = !isZenTabActive && !document.hidden && document.hasFocus();
```

`document.hasFocus()` 在窗口未聚焦（例如浏览器不在最前、锁屏、页面所在窗口失焦）时立即返回
`false`，导致 `fgSegStart` 不启动，foregroundMs 完全不累计。用户「把页面放着但窗口无焦点」的
场景即命中此分支。

**用户确认的新语义**：窗口没有焦点、但可见，也算盯屏（只算当前会话）。

### 根因 2：等待用户交互被计入运行时长

`isRunning = currentSession?.running`——agent 在问问题/请求权限、等待用户选择/批准时，
`running` 仍为 true，这段「等待」被计入了 runningMs（以及 foregroundMs 的前提）。

**用户确认的新语义**：AI 正在问问题/请求权限、等待用户选择/批准，不算运行时长。

### 附带发现（未在本轮修复）：今日/本周统计的跨天排除

`ZenSettingsSection.tsx` 的 `computePeriodStats` 用 `sessionStartMs >= sinceMs` 过滤会话：
**会话创建于今天/本周之前时，即使今天产生了运行时间，也会被整个排除**，今日/本周统计显示 0。
已静态验证（构造昨天创建的会话+今日 2h 运行，今日统计计 0）。若用户长期复用同一会话，即使
修复根因 1/2，今日禅仍可能显示 0。待用户确认是否纳入后续修复（涉及按天分桶或按活动期判断的设计）。

## 修复

`src/foreground-tracker.ts`（~16 行）：

1. `isWindowVisible` 去掉 `document.hasFocus()`——可见（`!document.hidden`）且非 Zen 标签即算盯屏。
2. `isRunning` 增加 `!currentSession?.pendingInteraction`——等待用户交互期间不累计运行时长
   （foreground 也随之暂停，因为 foreground 依赖 running）。
3. 相应更新文件头注释与 `SessionListSnapshot` 类型（新增 `pendingInteraction?: string`）。

`pendingInteraction` 字段来自 DSH sessions 服务 `flattenLineage`（`pendingInteractions` map），
已在 `byId` 快照中展开，插件可直接读取，无需新依赖。

## 验证

- `npm run typecheck` 通过；`npm run build` 构建并部署成功。
- 部署 bundle 确认无 `hasFocus`、含 `pendingInteraction` 排除逻辑。
- 实机（playwright）：打开会话发消息，模拟 blur 后 foreground 持续累计
  （fgDelta 2404→3412→4423ms），可见但失焦仍算盯屏 ✓。
