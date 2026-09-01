# Coding Agent 桌宠调研

## 调研对象

当前 coding agent 桌宠生态的主流方案，重点关注状态映射和动画实现方式。

## 主流项目一览

| 项目 | 平台 | 动画技术 | 状态数 |
|------|------|----------|--------|
| UniPet | Electron | sprite sheet | 5+ (idle/running/waiting/failed/review) |
| Clyde | Tauri + Svelte | SVG + CSS | 12 |
| claude-pet | X11 原生 | Shimeji sprite sheet | 6 (idle/thinking/working/attention/celebrating/error) |
| CC-Pet | Tauri + VS Code | Codex sprite sheet (8×9 或 8×11) | 9-11 |
| agentpet (Win) | WPF | sprite sheet | 4 (working/waiting/done/idle) |
| AgentCat | macOS+Win | 原生 + Codex sprite | 13 事件映射 |
| code-pet | Tauri | SVG + CSS (零图片资源) | 8 |
| CodePal | Electron | SVG + CSS | 12 |
| openpets | Web | — | 通用平台 |

## 状态映射共识

各项目虽实现不同，但状态映射高度趋同。综合后可归纳为以下核心状态：

| 桌宠状态 | 触发条件 | 典型动画 |
|---------|---------|---------|
| **idle** | 无活动 / 60s 无操作 | 呼吸、眨眼、四处张望 |
| **thinking** | 用户发送 prompt | 挠头、`?` `!` 漂浮 |
| **working** | 工具调用开始 | 敲键盘、`</>` `{ }` 漂浮 |
| **reading** | Read/Grep/Glob 类工具 | 捧书、`wow` `aha` 漂浮 |
| **coding** | Edit/Write 类工具 | 打字、代码符号漂浮 |
| **running** | Bash/Command | 原地跑、出汗 |
| **error** | 工具失败 / turn-error | 颤抖、爆炸烟雾 |
| **done** | 任务完成 | 跳跃、星星 + 彩带 |
| **waiting** | 需要用户授权/输入 | 耸肩、沙漏 |
| **compacting** | 上下文压缩 | 扫地、清理 |
| **sleeping** | 长时间无活动 | 打哈欠 → 打盹 → 睡着 |

## 两种技术路线

### 1. Sprite Sheet（Codex 格式）

- 标准：8 列 × 9 行（v1）或 8 列 × 11 行（v2），每帧 192×208px
- 图片格式：PNG 或 WebP
- 优点：社区资源丰富（Petdex 有大量现成宠物包），可换皮
- 缺点：需要外部图片资源，不适合纯 web 插件场景

### 2. SVG + CSS（过程式动画）

- 使用 SVG 绘制角色 + CSS keyframe 动画
- 优点：零图片依赖，体积小，可用代码生成，适合 web 环境
- 缺点：表现力不如 sprite sheet 丰富
- 代表：code-pet、CodePal

## 结论

对于 DSH Zen 插件（web 内嵌 React 组件）：

1. **采用 SVG + CSS 路线** — 无需管理外部图片，符合插件轻量定位
2. **状态映射** — 从已有 chatSnapshot 的 node kind 推断当前 agent 状态
3. **核心状态** — idle / thinking / working / error / done（至少覆盖这 5 个）
4. **可选扩展** — reading / coding / compacting / sleeping 作为后续增强
