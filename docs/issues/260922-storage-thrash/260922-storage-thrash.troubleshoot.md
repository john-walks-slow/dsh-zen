# 260922 storage-thrash 问题记录

## 现象

agent 活跃时 dsh web 主线程严重卡顿（同批问题中 dsh web 频繁 OOM，本插件为确认的卡顿源之一）。

## 根因

`src/foreground-tracker.ts` 的 `reevaluate()` 在每次 session list 快照变化时，对所有 session 逐个调用 `ensureSession()`。每个 `ensureSession()` 内部执行 `store.update()` → `mergePersist()` → 同步读写整个 localStorage（`getItem` + `JSON.parse` + merge + `JSON.stringify` + `setItem`）。N 个 session = N 次同步 localStorage 读 + N 次写，全部在主线程阻塞。而 `reevaluate()` 同时订阅了 session list 变化、`visibilitychange`、`focus`、`blur`，agent 活跃时 session list 高频变化，导致持续严重卡顿。

## 修复

将 N 次独立 `ensureSession()`（N 次 `store.update`）替换为一次批量计算：对当前 `state` 不可变地构建 `next`（覆盖新建 session、`sessionEndMs` 翻转、title 更新三个分支，语义与原逐个调用完全等价），仅当 `next !== state` 时调用一次 `store.set(next)`——单次 localStorage 读+写，且无变化时零 IO。

原 `ensureSession()` 函数已无任何引用，一并删除。

> 注：最初修复方案（外部指南示例代码）使用 `batchChanged` 闭包标志 + 条件判断，但该标志在 updater 执行前判断恒为 false，会漏掉已有 session 的 title 变化与 running 状态翻转。本实施改用直接对 `state` 不可变计算的方式规避了该缺陷。

## 验证

- `npm run typecheck` 通过（确认无残留引用）。
- `npm run build` 成功，`node --check lib/client.js` 语法通过，产物含批量逻辑、无 `ensureSession` 残留。
- 代码检视：见同目录 `260922-storage-thrash.review.md`。
