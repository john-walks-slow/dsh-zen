# 260904-zen-settings-labels — Zen 设置项改名与新增进行中副标题

## 背景

用户要求调整 Zen 设置面板的三个设置项：

1. 「显示进行中文案」→ 改名「显示进行中标题」
2. 新增「显示进行中副标题」开关（恢复此前被注释掉的、标题下方的第二行文字）
3. 「显示结束文案」→ 改名「显示结束标题」

## 实现

- `src/zen-settings.ts`：`ZenSettings` 新增 `showRunningSub: boolean`（默认 `true`）。
- `src/locales.ts`：zh/en 更新两条标签文案（进行中标题 / 结束标题），新增 `settings.showRunningSub`（显示进行中副标题 / Show running subtitle）。
- `src/components/ZenSettingsSection.tsx`：`ITEMS` 在「显示进行中标题」后插入副标题开关。
- `src/components/ZenView.tsx`：恢复副标题渲染，条件 `(isLoading || statusRunning) && settings.showRunningSub && sub`——仅在进行中显示（`sub` 在 done 态为 subReady 文案，但按「进行中副标题」语义仅在 running/loading 渲染）。
- `README.md`：设置项说明行同步更新。

## 验证

- `npm run typecheck` / `npm run build` 通过，已部署 `~/.dsh/profiles/web`。
- 部署产物确认：新文案、`showRunningSub` 默认 true、副标题渲染 gate、设置项条目均存在。

## 验证文档

`docs/features/260904-zen-settings-labels/260904-zen-settings-labels.validation.md`。
