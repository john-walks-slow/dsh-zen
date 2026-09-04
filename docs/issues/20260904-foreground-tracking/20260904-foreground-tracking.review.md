# 代码审查：今日/本周禅统计按天分桶修复

- 审查日期：2026-09-04
- 审查范围：`src/foreground-tracker.ts`、`src/components/ZenSettingsSection.tsx`（`lib/client.js` 构建产物不在审查范围）
- 审查基线：工作区未提交改动（`git diff`）

## 结论：准入（条件已满足）

核心修复方向正确：用按天分桶 `days: Record<"YYYY-MM-DD", {fg, run}>` 替代原先按 `sessionStartMs` 过滤的方案，解决了跨天会话被整体排除导致今日/本周统计为 0 的问题。写入（flush）、合并（mergePersist/mergeDays）、聚合（computePeriodStats）三条路径在单窗口单调累加模型下自洽。

原阻塞项（跨窗口 max-merge 桶和值偏低）已按方案 B 处理：在 mergePersist 注释中显式记录已知偏差与技术债追踪方式；同时按非阻塞项 #6 补齐 flush 缺省分支的 `days: {}` 一致性。审查结论由「条件准入」升级为「准入」。

## 阻塞问题

### 1. 跨窗口 max-merge 下 `days` 桶和值可能与总量不一致 —— 已按方案 B 处理

- 文件:行号：`src/foreground-tracker.ts:161-192`（mergePersist）、`:138-149`（mergeDays）；聚合消费方 `src/components/ZenSettingsSection.tsx:213-238`
- 问题：
  - `foregroundMs` / `runningMs` 的合并策略是 `max(old, new)`；`days[d]` 的合并策略同样是 `max(old.days[d], new.days[d])`。
  - 在**单窗口**内，每次 flush 同时给 `foregroundMs += delta` 和 `days[dayKey].fg += delta`，恒等式 `Σ days[*].fg == foregroundMs` 成立。
  - 但在**多窗口并发**场景下：窗口 A 与窗口 B 各自从 localStorage 加载同一基线状态后独立累加。设基线 `days[Mon]=100, fg=100`。A 在 Mon 新增 30 → `days[Mon]=130, fg=130`；B 在 Mon 新增 50 → `days[Mon]=150, fg=150`。正确总量应为 `100+30+50=180`。mergePersist 后：`fg = max(130,150)=150`，`days[Mon].fg = max(130,150)=150`。此时 `Σ days.fg (150) ≠ foregroundMs (150)`——二者相等纯属巧合（B 覆盖了 A）；但与真实累计 180 相比，`days` 桶和值偏低 30，`foregroundMs` 也偏低 30。
  - 关键回归点：computePeriodStats 现在改用 `Σ days[*]` 而非 `foregroundMs` 聚合。当 A、B 在**同一日**各自累加了正增量时，`max` 合并丢失了两者重叠部分，导致今日/本周 `fg` 与 `total` 均偏低，呈现给用户的禅比例失真。旧代码用 `foregroundMs` 聚合时同样偏低，但旧代码用 `sessionStartMs` 过滤会直接把跨天会话整段排除（偏低更严重）；新代码改用桶后，单窗口正确性已修复，但多窗口并发这个**既有**缺陷在新路径下以「桶和值与总量不一致」的新形态出现，且 computePeriodStats 里 `fg = Math.min(d.fg, d.run)` 的单桶钳制无法发现该不一致。
  - 一致性破坏的后果：若 UI 未来增加「桶和 vs 总量」一致性校验或切换回总量聚合，会暴露数据漂移。
- 处理（方案 B，务实最小改动）：
  - 在 mergePersist 注释中显式记录「多窗口并发同日累加会导致桶和值 ≤ 真实值」的已知偏差，并注明不要改为加法合并（会造成跨窗口同步时重复计数）。
  - 明确单窗口（正常使用场景）下统计精确；多窗口并发偏差记录为技术债，不引入运行时校验断言（保持最小修改）。

## 建议优化（非阻塞）

### 2. 跨午夜 flush 的当天桶归属偏差

- 文件:行号：`src/foreground-tracker.ts:209-242`（flush）
- 问题：flush 用 `dayKeyOf(now)` 作为桶 key，但 segment 可能始于前一天（如 runSegStart=23:58，flush 在 00:01）。这段 ~3 分钟的 delta 会被归入「今天」的桶，而实际跨越了昨天最后一刻。旧代码按 sessionStartMs 过滤时也有类似归属问题，但新代码引入桶后该偏差从「整段错归属」细化为「跨午夜段归属到后一天」。
- 建议：当前偏差量级小（最多一个 flush 周期 5s 级别的 delta，且仅在恰好跨午夜时发生），可接受。若要精确，可在 flush 时按 segment 起止时间切分到两个桶，但收益低、复杂度高，不建议本次处理。记录为已知近似即可。

### 3. `mergeDays` 返回 `undefined` 的语义

- 文件:行号：`src/foreground-tracker.ts:139-149`
- 问题：当 `a` 与 `b` 均为空/undefined 时返回 `undefined`，导致合并后的 session 无 `days` 字段。computePeriodStats 会 `if (!days) continue` 跳过。这在「两个旧数据 session 合并」时行为正确（仍贡献 0），但与「session 有总量却无桶」的状态共存时，ZenView.tsx 单会话总量（用 `foregroundMs`，不查 days）与设置面板今日/本周（用 days）会出现「单会话有数据、今日/本周却为 0」的观感差异。
- 建议：这是文档化的预期行为（注释已说明老数据贡献 0 直到下次 flush）。建议在 ZenView 单会话 tooltip 或设置面板加一句「历史会话不计入今日/本周」的提示，避免用户困惑。非代码改动。

### 4. computePeriodStats 的 `sinceKey` 字符串比较正确性

- 文件:行号：`src/components/ZenSettingsSection.tsx:216, 223`
- 问题：`dayKey < sinceKey` 用字符串字典序比较。由于 dayKeyOf 固定输出 `YYYY-MM-DD`（年 4 位、月/日 2 位零填充），字典序 == 时间序在**任意时区、跨年、跨月**下均成立。已验证：`2025-12-31 < 2026-01-01` 字典序正确。
- 建议：无需修改。注释 `// lexicographic == chronological (YYYY-MM-DD)` 准确。仅需注意 dayKeyOf 依赖 `new Date(ms)` 的本地时区——`sinceMs`（startOfToday/startOfWeek）同样用本地时区，二者一致。✓

### 5. liveDelta 无条件累加的正确性

- 文件:行号：`src/components/ZenSettingsSection.tsx:230-233`
- 问题：新代码移除了旧代码对 `liveSession.sessionStartMs >= sinceMs` 的守卫，改为无条件累加 liveDelta。审查结论：**正确**。
  - liveDelta 来自 `getLiveMs()`，仅当 `activeSessionId !== null` 且 segment 非空时返回正值，表示当前正在运行的活跃段。
  - 「现在」一定 ≥ startOfToday() 和 ≥ startOfWeek()，因此未 flush 的增量必然属于当前周期。
  - 当 activeSessionId 为 null（无活跃会话）时，fgDelta=runDelta=0，累加 0 无影响。
  - 旧守卫 `liveSession.sessionStartMs >= sinceMs` 是为修复「会话昨天开始、今天仍在运行」的泄漏，但该守卫本身有 bug：它会排除昨天开始但今天仍运行的会话的 liveDelta，导致今日统计漏算。新方案用 days 桶 + 无条件 liveDelta 彻底解决了该问题。✓
- 建议：无需修改。注释清晰。

### 6. flush 首次写入 days 初始化 —— 已处理

- 文件:行号：`src/foreground-tracker.ts:215-237`
- 问题：flush 中 `existing` 缺省分支（session 首次被 flush 但未经过 ensureSession）构造的 existing 对象**不含 days 字段**。随后 `existing.days ?? {}` 和 `existing.days?.[dayKey] ?? {fg:0,run:0}` 均正确兜底，days 桶会被正常初始化写入。✓
- 处理：缺省分支已补 `days: {}`，与 ensureSession 构造的会话保持一致（纯风格）。

## 无需修改项简述

- **dayKeyOf 实现**（`foreground-tracker.ts:77-83`）：使用 `getFullYear()/getMonth()/getDate()` 本地时区 + padStart 零填充，格式严格 `YYYY-MM-DD`，字典序==时间序。与 startOfToday/startOfWeek 的本地时区一致。✓
- **ensureSession 初始化 `days: {}`**（`foreground-tracker.ts:283`）：新会话创建时带空 days 桶，保证后续 flush 有对象可写。✓
- **pruneIfNeeded 不会破坏桶一致性**（`foreground-tracker.ts:244-263`）：prune 按 sessionStartMs 整体丢弃会话，不修改存活会话的 days。被丢弃的会话 sessionStartMs > 30 天，必然落在今日/本周窗口外，不影响聚合。✓
- **ZenView.tsx 单会话统计不受影响**（`ZenView.tsx:501-508`）：单会话 tooltip 仍用 `foregroundMs + fgDelta` 总量，不涉及 days 桶，行为与旧代码一致。✓
- **mergeDays 对空入参的兜底**：`a ?? {}` / `b ?? {}` / `keys.size === 0 → undefined`，逻辑健壮。✓
