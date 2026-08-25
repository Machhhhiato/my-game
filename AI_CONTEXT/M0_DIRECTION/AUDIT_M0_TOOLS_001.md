---
output_id: AUDIT-M0-TOOLS-001
task_id: M0-L4-005
status: review
created_at: 2026-08-25T12:57:29+08:00
source_thread: 01a03741-b9b7-7302-84d0-5b57447051b9
source_model: gpt-5.6-terra
source_thinking: high
scope: read_only_fixed_candidates
overall_spec_frozen: true
implementation_authorized: false
user_acceptance: pending
---

# AUDIT-M0-TOOLS-001

## 结论

当前不接入任何新工具。只保留一个未来可另行授权的受控试用候选：`tauri-agent-tools`。其余候选继续观察或淘汰。

本次只读审计没有安装、配置或修改项目。`M0-L4-005` 进入 `review`，不自动接受，也不解锁 `M0-L4-010`。

## 推荐受控试用

### 1. `cesarandreslopez/tauri-agent-tools`

- 证据：提交 `e31414e`（2026-08-24），`v0.9.2`（2026-08-25），MIT；TypeScript，声明 `npm test`。[Issue #9](https://github.com/cesarandreslopez/tauri-agent-tools/issues/9) 与 [Issue #10](https://github.com/cesarandreslopez/tauri-agent-tools/issues/10) 均获作者修复。
- 风险与重叠：桥接会读取日志、DOM 和存储；接入桥接必须修改 Tauri 项目。页面操作与现有 Browser、Chrome、Computer Use 重叠，但 Tauri 配置与能力审计不完全重叠。
- 未来受控边界：只能在另获用户授权后，于临时目录安装；先运行无桥接、只读的配置审计；不复制 Skill，不加入 dev bridge，不启用交互命令。
- 回滚：删除临时目录；项目必须保持 `git diff` 为空。

## 继续观察

### 2. `microsoft/playwright-cli` 与其 Skill

- 证据：[PR #454](https://github.com/microsoft/playwright-cli/pull/454) 于 2026-08-24 合并（`60cb176`）；最新正式版仍为 `v0.1.18`（2026-08-06），Apache-2.0。针对该 PR 的独立测试结果未核实。
- 风险与重叠：会联网并写入浏览器会话和截图；与现有三种浏览器能力高度重叠。
- 观察条件：等待包含 #454 的正式版本，再决定是否重新审计。
- 回滚：移除临时安装、浏览器 profile 与配置项。

### 3. `anthropics/skills/frontend-design`

- 证据：[PR #1293](https://github.com/anthropics/skills/pull/1293) 对应提交 `2235be7`，2026-06-09 合并；无正式 Release；单项 Skill 使用 Apache-2.0；纯 Markdown 指令、两位维护者批准，无运行测试。
- 风险与重叠：无运行时权限，但复制会改变项目提示上下文；与现有前端实现指导部分重叠。
- 观察条件：M0 整体视觉方向冻结后，再判断是否值得只读比较。
- 回滚：删除单一 Skill 目录。

### 4. `ChromeDevTools/chrome-devtools-mcp`

- 证据：[PR #1777](https://github.com/ChromeDevTools/chrome-devtools-mcp/pull/1777) 于 2026-08-24 合并；正式版 `v1.7.0` 发布于 2026-08-10，因此该变更尚未随正式版核实；Apache-2.0，TypeScript，包含 `tests/`。PR 曾出现 `pageId` 与测试失败讨论。
- 风险与重叠：MCP、Chrome/CDP、截图和网络读取权限较广；与现有 Browser、Chrome、Computer Use 高度重叠。
- 观察条件：只有出现真实的性能 trace、堆快照或内存泄漏问题，且相关版本稳定后，才重新审计。
- 回滚：删除 MCP 配置与包缓存。

### 5. `upstash/context7`

- 证据：提交 `63a40c6`（2026-08-24），`@upstash/context7-mcp@4.0.3`（2026-08-21），MIT；存在 Test workflow。[Issue #3060](https://github.com/upstash/context7/issues/3060) 仍开放：多行 TOML 或尾逗号时，重设可能丢失固定版本；维护者在 2026-08-23 表示调查。
- 风险与重叠：联网获取文档，可能写代理配置或令牌；与现有官方文档检索部分重叠。
- 观察条件：#3060 关闭前不试用；最终技术证据仍必须回到官方文档。
- 回滚：删除精确配置段与缓存。

### 6. `github/awesome-copilot` 的 `game-engine`

- 证据：相关 Skill 加入提交 `aec440c`（2026-02-24）；仓库最新提交为 2026-08-25，无正式 Release，MIT；面向 HTML5、Canvas、WebGL 的指令与素材，质量报告记录 2/2 校验通过。
- 风险与重叠：无运行权限，但复制会改变提示上下文；与 M0 的 React/Tauri 管理策略游戏并非一一对应。
- 观察条件：渲染方案确定后，最多作为只读参考，不安装整包。
- 回滚：删除单一 Skill 文件夹。

### 7. `shipshitgames/skills`

- 证据：提交 `e4d7d2c`（2026-07-23），无正式 Release，MIT；仅 9 次提交，未核实独立 CI 或运行测试。
- 风险与重叠：Three.js、PartyKit 和固定资产管线会把实现引向另一套技术边界；与 M0 技术收敛风险高。
- 观察结论：不安装整包；只有未来出现非常具体的单项方法缺口时才重新看。
- 回滚：删除复制的 Skill 目录；不使用全局安装。

## 淘汰

### 8. `openai/skills` 中的旧游戏与浏览器 Skills

- 证据：无正式 Release，仓库未声明可识别许可证。[Issue #386](https://github.com/openai/skills/issues/386) 确认 `playwright-interactive` 依赖已移除的 `js_repl`，并在 2026-07-05 以仓库已废弃关闭。`develop-web-game` 与 `frontend-skill` 的当前可用性本次未核实。
- 淘汰理由：失效或废弃的指令会误导浏览器流程，并与当前能力重叠。
- 回滚：不接入，无需回滚。

### 9. `hypothesi/mcp-server-tauri`

- 证据：提交 `157e648`（2026-08-13），`tauri-mcp-cli/v0.12.0`（2026-07-06），MIT；TypeScript + Rust，包含 test app，声明 `npm test`。[Issue #36](https://github.com/hypothesi/mcp-server-tauri/issues/36) 仍开放：未认证控制 WebSocket 可能导致跨站劫持与 Webview 任意 JavaScript。
- 淘汰理由：需要桥接插件和项目改动；能截图、输入和读日志；与现有能力重叠且安全风险不可接受。
- 回滚：不接入。

### 10. `P3GLEG/tauri-plugin-mcp`

- 证据：提交 `c7d271a`（2026-07-17），`v0.3.1`（2026-07-17），许可证未声明；Rust + TypeScript，声称 smoke test。[Issue #33](https://github.com/P3GLEG/tauri-plugin-mcp/issues/33) 的重连大响应挂起仍开放；修复 [PR #34](https://github.com/P3GLEG/tauri-plugin-mcp/pull/34) 仍未合并，最后催促为 2026-08-23。
- 淘汰理由：需要改 Cargo、能力配置和前端初始化；可执行 JavaScript、读取会话数据并模拟原生输入。
- 回滚：不接入。

### 11. `dirvine/tauri-mcp`

- 证据：提交 `979c37e`（2025-07-01），`v0.1.5`（2025-07-01），MIT；包含 `tests/` 并声明 `cargo test`。[Issue #2](https://github.com/dirvine/tauri-mcp/issues/2) 的协议版本不兼容仍开放，最后反馈为 2025-08-18；[Issue #4](https://github.com/dirvine/tauri-mcp/issues/4) 的 Windows 编译问题仍开放。
- 淘汰理由：可启动或停止应用、执行 JavaScript 和模拟输入；权限宽、维护停滞，并与现有能力高度重叠。
- 回滚：不接入。

## 未来验证顺序

仅在用户另行明确授权后：

1. `tauri-agent-tools`：临时隔离安装 → 无桥接只读配置审计 → 删除临时目录。
2. 等 M0 渲染与视觉方向冻结后，只读比较 `frontend-design` 与 `game-engine` 的提示价值。
3. 等 Context7 #3060、Chrome DevTools #1777 的正式发布稳定后，再决定是否重新审计。

其他候选不进入验证队列。

## 验收边界

- 当前状态：`review`。
- 用户接受前，`M0-L4-005` 不得标记 accepted。
- 用户接受前，`M0-L4-010`、第二层和第三层继续 blocked_upstream。
- 接受本审计也不等于授权安装任何工具；任何试用、安装、配置、桥接、权限或服务仍需用户单独明确授权。
