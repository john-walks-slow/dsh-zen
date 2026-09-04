# 20260904-foreground-tracking — 盯屏时间统计修复总结

## 背景

用户反馈：把页面放在对话视图停留很久（甚至去上厕所），回来看盯屏统计一秒都没有记录。

## 根因（两条独立路径）

1. **focus 条件过严**：`foregroundMs` 依赖 `document.hasFocus()`，窗口失焦即停止累计（用户确认：可见即盯屏，不要求聚焦）。
2. **等待交互计入运行**：agent 问问题/请求权限、等待用户选择/批准期间，`running` 仍为 true，被计入运行时长（用户确认：等待不算运行时长）。
3. **附带发现**：设置面板「今日禅/本周禅」按 `sessionStartMs >= sinceMs` 过滤会话，跨天会话（今天之前创建）今日产生的运行时间被整个排除，今日统计显示 0。

## 修复

### 提交 1（dc029d3）：聚焦与等待语义

`src/foreground-tracker.ts`：

- `isWindowVisible` 去掉 `document.hasFocus()` —— 窗口可见（未最小化、非 Zen 标签页）即算盯屏；
- `isRunning` 排除 `pendingInteraction` —— 等待用户交互期间运行时长与盯屏均暂停；
- `SessionListSnapshot` 类型新增 `pendingInteraction?: string`。

### 提交 2（本次）：按天分桶统计

- `SessionStats` 新增 `days?: Record<"YYYY-MM-DD", { fg: number; run: number }>`；
- `flush()` 同时写累计值与当天桶；`mergePersist()` 通过 `mergeDays()` 跨窗口 max 合并；
- `ensureSession()`/flush 缺省分支初始化 `days: {}`；
- `computePeriodStats()` 改为按日期 key 聚合桶（字典序 == 时间序），liveDelta 无条件累加（"现在"必属当前周期）；
- 老数据（无 `days` 字段）贡献 0 直到下次 flush（历史不补，无回归）。

## 审查

- 结论：准入（原「条件准入」的阻塞项已按方案 B 处理——mergePersist 注释记录多窗口并发已知偏差与技术债，不引入运行时校验）。
- 处理非阻塞项 #6：flush 缺省分支补 `days: {}` 一致性。

## 验证

- `npm run typecheck` / `npm run build` 通过，已部署 `~/.dsh/profiles/web`。
- 功能测试（node 复刻聚合逻辑）：跨天会话今日统计 150min ✓、本周 210min ✓，PASS。
- 实机（playwright）：任务运行中触发 blur 后 foreground 持续累计（2404→3412→4423ms），失焦不再中断 ✓。

## 验证文档

`docs/issues/20260904-foreground-tracking/20260904-foreground-tracking.validation.md`（4 项待用户验证）。
