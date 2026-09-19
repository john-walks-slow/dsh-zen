# 发布指南（Publishing Guide）

本文档记录 dsh-zen 的发布准备与上架流程。**本仓库尚未实际发布**——先按此文档准备，
确认无误后再执行发布步骤。

## 1. 发布前检查清单

以下事项在当前仓库中已经完成：

- [x] 仓库文件整理（删除调试残留、死代码、pet 遗留资源）
- [x] `package.json` 具备完整发布元数据：`name` / `version` / `description` / `license` /
      `keywords`（含 `dsh-plugin`、`deepseek-harness`）/ `files` / `dsh.bundle.patch`
- [x] `cordis.patch.yml` 声明 bundle，行 ID `zen` 稳定且不冲突
- [x] `lib/` 构建产物已提交（dsh.pub Git 分发路径要求提交运行时产物）
- [x] `README.md` + `README.zh-CN.md`（含能力、安装、使用、卸载、License 说明）
- [x] `LICENSE`（MIT）文件存在（`package.json` 的 `license` 字段不能替代仓库内许可证文件）
- [x] 仓库内无机器特定绝对路径（build.mjs 部署路径改为 `$DSH_HOME` 解析）
- [x] 无 `workspace:` 依赖范围、无未发布的内部依赖
- [x] 截图位于 `docs/screenshots/`

发布前仍需手动确认：

- [ ] `version` 字段按发布语义递增（当前 `1.0.0`）
- [ ] 在真实 `web` profile 中从**精确 commit** 安装验证一次
  （`dsh plugin --profile web add github:<owner>/dsh-zen#<commit>`）
- [ ] 仓库设置为 public（dsh.pub 与各商店均要求公开仓库）
- [ ] 仓库与包名是你控制的名称，不暗示 DeepSeek 官方拥有
- [x] npm 包名定为 scoped 包 `@johnnren/dsh-zen`（裸名 `dsh-zen` 已被他人占用），`publishConfig.access: "public"` 已配置（scoped 包默认私有，须显式公开）
- [ ] 发布 npm 前配置好 npm 账号与 token

## 2. 生态概览：DSH 插件如何被发现

DSH 官方对第三方插件的发现渠道是 GitHub `dsh-plugin` topic；除此之外社区演化出了多个
独立注册表/商店。它们共同的上架元数据契约是 `package.json` 中的：

```jsonc
{
  "name": "@johnnren/dsh-zen",
  "version": "1.0.0",
  "description": "Zen Mode view tab + foreground time tracker for DeepSeek Harness",
  "keywords": ["dsh", "dsh-plugin", "deepseek-harness", "zen", "focus", "productivity", "time-tracking", "禅模式", "专注", "时间追踪"],
  "license": "MIT",
  "dsh": {
    "bundle": { "patch": "./cordis.patch.yml" },   // 硬门槛：可安装的 bundle
    "market": {                                     // 可选富元数据
      "displayName": "Zen Tracker",
      "icon": "assets/icon.svg",
      "categories": ["interface", "productivity"],
      "screenshots": ["docs/screenshots/zen-running.png", "docs/screenshots/zen-view.png", "docs/screenshots/settings.png"]
    }
  }
}
```

要点：

- **`dsh.bundle.patch` 是硬门槛**：没有它，`dsh plugin add` 只能把它当作普通依赖安装，
  不会加入 profile 组合栈。当前 `cordis.patch.yml` 已就绪。
- `dsh.market` 为可选元数据；缺省时商店会从顶层 `name`/`description`/`keywords` 推导。
- `keywords` 中的 `dsh-plugin` 与 `deepseek-harness` 同时服务 GitHub topic 检索与 npm 收割。

## 3. 渠道一：dsh.pub（官方社区注册表，推荐主渠道）

[dsh.pub](https://dsh.pub/en/) 是 DeepSeek Harness 插件注册表（当前 6,725 个可安装插件），
开发与上架指南见 <https://dsh.pub/develop-plugin.md>。

上架步骤：

1. 仓库设为 public，包位于仓库根目录（或文档中写明包子目录）。
2. 发布一个 commit，包含 `package.json`、声明的 patch、所有引用的运行时产物（`lib/`）、
   README 与 LICENSE——**这些当前都已提交**。
3. 打开 dsh.pub 的**双语提交页**，用其预填的 `submissions/*.json` 文件发起 GitHub Pull Request。
4. PR 工作流只读该 fork commit，不执行 fork 代码；它会：
   - 校验 bundle manifest 指向包内安全路径的普通 patch 文件（YAML 数组形态）
   - 校验 `lib/` 运行时产物已提交
   - 校验 README 与 LICENSE 存在
   - 运行 dsh.pub 完整质量门禁；通过后自动合并
5. 合并后由可信 `main` workflow 重新生成目录，Cloudflare Workers 发布到生产。
6. 提交页会即时给出 Markdown/HTML 徽章片段；`not listed` 变为 `listed` 即表示已入目录。

注意：

- 任何人可提名公开仓库；首次版本流程**不能覆盖**已有的 仓库/包路径 坐标。
- 入目录 ≠ 人工审查 / 安全审计 / 兼容性认证 / 官方背书。
- 可选：给 GitHub 仓库打 `dsh-plugin` topic（仅增强可发现性，不自动入目录）。

本地验证（发布前）：

```sh
npx dshpub add <owner>/dsh-zen --ref <40字符commit> --profile web
dsh --profile web --dump-config   # 确认 bundle 作为命名层出现
dsh --profile web                 # 确认行解析、Host 挂载、UI 渲染
```

## 4. 渠道二：GitHub `dsh-plugin` topic

官方产品页把社区插件指向 <https://github.com/topics/dsh-plugin>。做法：

```sh
gh repo edit <owner>/dsh-zen --add-topic dsh-plugin
```

仅打 topic 不会自动上任何商店，但它是官方口径下的基础可发现性，建议必做。

## 5. 渠道三：npm 发布（供商店收割）

npm 上以 `dsh-plugin` 或 `deepseek-harness` 为关键词的包会被多个商店每日收割。

```sh
npm publish
```

发布前：

- npm 名使用 scoped 包 `@johnnren/dsh-zen`（裸名 `dsh-zen` 已被他人占用）；scoped 包默认私有，发布必须 `publishConfig.access: "public"`（已配置）。版本号符合语义化（当前 `1.0.0`）。
- `files` 已限定为 `lib/`、`cordis.patch.yml`、`assets/icon.svg`、README、LICENSE。
- npm 发布后，`dsh plugin --profile web add @johnnren/dsh-zen` 即可安装。

## 6. 第三方商店/注册表清单

| 商店 | 形态 | 上架方式 | 备注 |
| --- | --- | --- | --- |
| [dsh.pub](https://dsh.pub/en/) | 官方社区注册表 | `submissions/*.json` GitHub PR | 主渠道，见上文 |
| [dshplugin.world](https://dshplugin.world/) | 第三方发现层 | 自动抓取 GitHub `dsh-plugin` topic | 无需手动提交；会过滤非真插件 |
| [dsh-index / DSH Plugin Marketplace](https://dshindex.dev)（lijma） | 可安装的商店插件 | 基于 GitHub `dsh-plugin` topic | 在 Harness 内浏览/安装，可提交评分反馈 |
| [dsh-plugin-shop](https://github.com/LivXue/dsh-plugin-shop)（LivXue） | 静态目录 + Harness 商店插件 | npm 关键词 `dsh-plugin` / `deepseek-harness` 自动收割；纯 GitHub 仓库则靠 topic + 根目录 `package.json` | 分层信任：review 与版本绑定 |
| [dsh-plugin-market](https://github.com/6kongbai/dsh-plugin-market) | 侧边栏商店 + CLI | GitHub topic + `dsh.market` 元数据 | 安装前展示 owner/stars/license，固定 commit |
| [dsh-plugin-market](https://github.com/NanmiCoder/dsh-plugin-market) | Settings → 插件市场 | 爬取 topics，按证据分四级信任（verified-npm / verified-git / likely-plugin / related） | `dsh.bundle` + 有效 patch 即可能入 verified-git |
| [dsh-marketplace](https://github.com/ydhrdh/dsh-marketplace)（ydhrdh） | 静态目录 + 商店插件 | 通过 PR 提交 `registry/plugins/<id>/plugin.json` | 评审制，支持 `verified` 徽章 |

对本插件的含义：

- 只要满足「public 仓库 + `dsh-plugin` topic + 根目录 `package.json` 声明 `dsh.bundle.patch`
  + 提交 `lib/` 产物」，即可被上述绝大多数商店收录（dsh.pub 仍需 PR，其余多为自动抓取）。
- `dsh.market` 元数据已按契约填写，商店展示会更完整。

## 7. 质量门禁自查

发布前按 dsh.pub Definition of Done 自查：

- [ ] Host / Web UI 归属明确（本插件：Web UI + Host bundle）
- [ ] 扩展点来自目标版本源码核验，无猜测的 slot 名
- [ ] Git 根包声明安全且存在的 `dsh.bundle.patch`
- [ ] patch 行能解析安装包名，行 ID 稳定
- [ ] `main` / `exports` / `files` / `dsh.bundle.patch` 中每个路径在干净构建后都存在
- [ ] 外部依赖无 `workspace:` 范围
- [ ] 所有注册、订阅、定时器、slot 贡献在卸载时能干净释放
- [ ] `npm run build` 与 `npm run typecheck` 通过
- [ ] 精确 commit 在目标 profile 中可安装、可启动
- [ ] README 含能力、兼容性、安装、配置、卸载说明；LICENSE 文件存在
- [ ] 诚实描述 dsh.pub 收录状态，不声称安全/质量背书

## 8. 发布执行顺序（建议）

1. 在本地从精确 commit 完整验证一次安装 + 运行 + 卸载。
2. `npm publish`（如需 npm 渠道）。
3. 推送 public 仓库并打 `dsh-plugin` topic。
4. 走 dsh.pub 提交页发 PR，等待自动合并与目录生成。
5. 记录各商店收录状态；更新 `README` 中的安装命令（若 npm 可用则加 `dsh plugin add @johnnren/dsh-zen`）。

> 安全提示：第三方商店的收录不等于安全审计。发布前自行复查 `cordis.patch.yml` 作用范围
> 与 `lib/` 产物内容；安装第三方插件等同于执行第三方代码。
