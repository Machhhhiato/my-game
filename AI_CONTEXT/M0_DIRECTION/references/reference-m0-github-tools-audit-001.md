---
reference_id: REF-M0-GITHUB-TOOLS-AUDIT-001
status: reconnaissance
as_of: 2026-08-25
project_stack: React 19 / Vite 7 / TypeScript / Tauri 2 / Zustand 5
install_performed: false
---

# GitHub Skills / MCP 初查与未来审计基线

本文件记录新增 `M0-L4-005` 之前的首次侦察。它不是安装清单，也不能替代 `M0-L4-005` 开始时的重新检查。仓库、版本、问题和回复随时会变化；实际试用前必须按任务卡重新核对固定提交、最新正式版本及当时的人工反馈。

## 1. 为什么要单独审计

外部 Skill 或 MCP 可能帮助第四层检查网页渲染、Tauri 窗口、性能和接口文档，但也可能强制错误技术栈、扩大权限、写入全局配置、启动常驻服务，或用陈旧规则覆盖项目已经确认的工作方式。因此“找到工具”不等于“应该安装”；审计结果允许是一个都不装。

不能只看仓库首页的 `updated_at`。必须分别检查：

1. 仓库是否已经弃用、迁移或归档；
2. 候选 Skill 或 MCP 自身最后一次实质修改；
3. 最新正式版本及发布日期；
4. 版本之后的外部用户问题、维护者回复身份与回复日期；
5. README 声称的能力是否真的存在于代码和测试；
6. 对本项目 React 19、Vite 7、TypeScript、Tauri 2、Rust 与 Zustand 的真实覆盖；
7. 全局配置、项目依赖、端口、网络、密钥、常驻进程和系统权限；
8. 与现有 Browser、Chrome、Computer Use、截图和本地命令能力是否重复；
9. 固定版本、局部试用和完整卸载方法。

没有评论不表示稳定，机器人评论不等于维护者处理，旧版本的好评也不能证明新版本可靠。未解决的安全或兼容问题没有维护者回应时，直接禁止试用。

## 2. 当前结论

截至 2026-08-25，本轮没有安装任何 Skill 或 MCP。当前最合理的结果是保留少量受控试用候选，其余观察或淘汰。

### 2.1 推荐进入受控试用名单，但现在不安装

#### `cesarandreslopez/tauri-agent-tools`

- 用途：Tauri 2 窗口截图、配置检查、日志与进程诊断；完整 DOM、IPC 和交互能力需要开发桥接。
- 时效：最新提交为 2026-08-24；[`v0.9.2`](https://github.com/cesarandreslopez/tauri-agent-tools/releases/tag/v0.9.2) 发布于 2026-08-25。
- 反馈：React 受控输入问题 [#10](https://github.com/cesarandreslopez/tauri-agent-tools/issues/10) 于 2026-08-22 提交，维护者在 2026-08-24 回复并修复；[#9](https://github.com/cesarandreslopez/tauri-agent-tools/issues/9) 约 38 小时后得到维护者回复并随即发布版本。
- 适配：仓库包含 [React 19 受控表单回归测试](https://github.com/cesarandreslopez/tauri-agent-tools/blob/main/tests/integration/react-controlled-forms.test.ts)；Vite 7 仍须在 Always Game 本地验证。
- 风险：macOS 需要屏幕录制权限和 ImageMagick；完整能力需要把 Rust bridge、依赖和 `invoke_handler` 接入项目。桥接虽只在开发构建中启用，并使用 localhost 与随机令牌，仍属于项目改动。
- 当前判定：`trial_candidate`。以后先试不改项目的整窗截图、配置和日志能力；任何桥接接入必须另获用户授权。

#### `microsoft/playwright-cli` 与其 Skill

- 用途：对 Vite 渲染页面做可重复的浏览器流程与截图回归，不覆盖 Tauri/Rust 原生层。
- 时效：仓库在 2026-08-24 仍有实质提交；[`v0.1.18`](https://github.com/microsoft/playwright-cli/releases/tag/v0.1.18) 发布于 2026-08-06。
- 反馈：每条命令都访问 npm 的问题在 [PR #454](https://github.com/microsoft/playwright-cli/pull/454) 于 2026-08-24 获维护者批准并合并，但该修复晚于 `v0.1.18`，尚不能视为正式版已修复。
- 当前判定：`trial_candidate_after_release`。等待包含 #454 的正式版本，再以项目局部、锁定版本、内存会话做冒烟测试；普通页面检查继续优先使用现有 Browser。

#### `anthropics/skills/frontend-design`

- 用途：只在未来整体 UI 方向明确后，帮助做视觉方案；不能参与当前机制冻结，也不能覆盖已经接受的信息层级和用户用词。
- 时效：Skill 在 [2026-06-09 的提交](https://github.com/anthropics/skills/commit/2235be7c60b551f5de82ade908fd3816455afcda) 更新；对应 [PR #1293](https://github.com/anthropics/skills/pull/1293) 当日两次获得人工批准；使用 Apache-2.0 许可。
- 当前判定：`future_ui_trial_candidate`。只允许未来 UI 独立任务显式调用单个 Skill，不安装整套仓库。

### 2.2 只在明确缺口出现时临时考虑

#### `ChromeDevTools/chrome-devtools-mcp`

- 只在第四层确实需要性能 trace、堆快照或内存泄漏分析时考虑。
- [`v1.7.0`](https://github.com/ChromeDevTools/chrome-devtools-mcp/releases/tag/chrome-devtools-mcp-v1.7.0) 发布于 2026-08-10；2026-08-24 合并的 [PR #1777](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/1777) 又改变了 `pageId` 要求，接口仍在快速变化。
- 默认遥测、CrUX 外部数据、浏览器全数据访问和提示注入边界都需要单独审计。
- 当前判定：`observe`。不常驻、不连接日常登录浏览器；只有真实性能问题才用独立空白浏览器配置临时试用。

#### `upstash/context7`

- 只在官方文档难以定位精确版本 API 时作为查找入口；最终证据仍必须回到官方文档。
- 最新正式版 [`4.0.3`](https://github.com/upstash/context7/releases/tag/%40upstash/context7-mcp%404.0.3) 发布于 2026-08-21。
- [Issue #3060](https://github.com/upstash/context7/issues/3060) 于 2026-08-23 报告 `ctx7 setup --codex` 可能静默删除固定版本和自定义参数；维护者当日确认调查，但截至本次检查仍未关闭。
- 自动安装会改写 Codex 配置和 `AGENTS.md`，查询还会发往外部服务。
- 当前判定：`observe`。不运行自动 setup，不提交私有代码、内部命名或游戏设计内容。

### 2.3 当前淘汰或禁止接入

#### 已弃用或已删除的 OpenAI 旧 Skills

- [`openai/skills` 已在 2026-06-22 明确弃用](https://github.com/openai/skills/commit/778b0e6)，不能再把仓库整体更新当成维护证据。
- `develop-web-game` 与 `frontend-skill` 已在 [2026-04-23](https://github.com/openai/skills/commit/11c643813b4645ca9f25d49ca180697732e0141a) 删除。
- `playwright-interactive` 依赖已经移除的 `js_repl`，还要求 `danger-full-access` 并面向 Electron；[Issue #386](https://github.com/openai/skills/issues/386) 在 2026-05 与 2026-07 的反馈没有形成修复。
- 结论：旧仓库中的这些 Skill 全部 `reject`。搜索结果或旧文章仍把它们列为可安装，不构成有效证据。

#### `hypothesi/mcp-server-tauri`

- [Issue #36](https://github.com/hypothesi/mcp-server-tauri/issues/36) 于 2026-07-17 报告未认证控制 WebSocket 可被网页连接并执行任意 JavaScript；截至本次检查没有维护者回复。
- 默认能力又包含执行命令、脚本注入、事件发送和状态读取，并会修改 Cargo、能力文件和 MCP 配置。
- 当前判定：`reject_current_version`。安全问题关闭并发布修复版后才能重新审计。

#### `P3GLEG/tauri-plugin-mcp`

- [Issue #33](https://github.com/P3GLEG/tauri-plugin-mcp/issues/33) 于 2026-07-30 报告重连后大于 8192 字节的截图或页面查询会永久超时。
- 修复 [PR #34](https://github.com/P3GLEG/tauri-plugin-mcp/pull/34) 自 2026-07-30 一直未合并；2026-08-23 贡献者再次提醒，未见维护者处理。
- 当前判定：`reject_current_version`。

#### `dirvine/tauri-mcp`

- 仓库首页活动时间具有误导性；真实最后提交和 `v0.1.5` 都停在 2025-07-01。
- 协议问题 [#2](https://github.com/dirvine/tauri-mcp/issues/2) 和 Windows 问题 [#4](https://github.com/dirvine/tauri-mcp/issues/4) 只有用户追评，没有维护者解决。
- 实现中存在固定成功、`Would execute` 和固定窗口资料等占位结果，README 不能证明能力真实存在。
- 当前判定：`reject`。

#### 泛化游戏 Skill 与整包能力库

- `github/awesome-copilot` 的 `game-engine` 只提供泛化 HTML5 Canvas、WebGL 与 Phaser 路线，具体文件最后修改于 2026-02-23，与 React/Tauri 管理策略游戏不匹配。
- `shipshitgames/skills` 只有极少外部使用证据，并强制 Three.js、Tailwind、PartyKit、Vercel、固定资源和固定战役结构，直接与 Always Game 已冻结方向冲突。
- 大型 Skill 包或完整插件会增加触发重叠与上下文污染。当前判定均为 `reject_bundle`；最多提取短审计方法，不安装整包。

## 3. `M0-L4-005` 的固定试用规则

只有通过只读审计的候选才允许提出试用，且试用仍需用户单独批准：

1. 一次只解决一个已经证明存在的能力缺口，一次最多试一个工具；
2. 使用项目局部安装或临时目录，锁定正式版本和提交，不用 `@latest`，默认禁用；
3. 不先写全局配置，不自动安装整包，不启动不必要的常驻 MCP；
4. 先用无 Skill 的现有能力完成同一个小任务，再用候选完成，比较质量、时间、上下文、权限和失败恢复；
5. 候选不能覆盖项目规格、角色卡、用户措辞、官方文档或当前工具；
6. 试用前记录卸载和回滚方法，试用后证明没有残留进程、端口、配置和依赖；
7. 版本变化、维护状态变化或出现新的安全问题时重新审计；
8. 如果收益不明确，结论就是不安装。

## 4. 本次边界

- 没有安装 Skill、插件、CLI 或 MCP。
- 没有修改游戏代码、配置、依赖、全局 Codex 配置或系统权限。
- 本文件是 2026-08-25 的侦察快照；未来 `M0-L4-005` 必须重新检查，不得照抄当前结论。
