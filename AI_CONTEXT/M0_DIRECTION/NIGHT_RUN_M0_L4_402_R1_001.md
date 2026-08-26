---
run_id: NIGHT-M0-L4-402-R1-001
formal_task: M0-L4-402-R1
parent_task: M0-L4-402
output_id: BUILD-M0-CAPABILITY-001-R1
run_status: implemented_waiting_user_recheck
authorized_source: M0-S003-U138
input_commit: d00f22c274ac1f582f7af8bbd7f439dcae8a2db3
implementation_commit: 42a47b02e9f4351839ae5aee89adb9fc520ba205
first_layer_reviewed_at: 2026-08-26T16:59:14+08:00
first_layer_review_status: automatic_and_browser_passed_waiting_user_recheck
---

# NIGHT-M0-L4-402-R1-001 现场修订报告

> 2026-08-26：本报告记录 R1 历史结果。后续界面骨架修订已由 `NIGHT_RUN_M0_L4_402_R2_001.md` 接替。

## 结论

402 首次真实试玩提出的三项修订已落地：六边格使用共边球面投影，科研速度改由研究设施岗位与实际入职人数决定，顶部资源栏收紧为单行缩略信息。当前状态为 `implemented_waiting_user_recheck`，不是用户试玩接受，不进入 `M0-L4-403`。

## 实现边界

- 球面：37 个稳定格 ID 与情报数据不变。格子中心和六个顶点同时投影到球面，相邻格共用相同两个顶点；显示层改为一张 SVG 地表，不再使用固定尺寸浮动按钮。
- 科研：`ResearchState.workers` 改为真实 `facilities`。研究设施保存稳定 ID、名称、地点、岗位上限和启停状态。已启用设施的岗位总数是计划上限，通用劳动力实际填充多少岗位就决定当日科研速度。指定队列与领域自动规则不变，M0 仍只有一条真实科研工作线。
- 存档：严格版本升为 v5，不读取旧 M0 存档键。校验器拒绝重复设施 ID、零岗位设施和科研项目与设施容量不一致的状态。
- 界面：科研页显示设施数、启用数、岗位上限、实际入职和启停操作，删除科研人数下拉框。所有页内按钮使用暗色控件，滚动条与页面一致。资源栏缩为单行图标、库存和月度变化；资源名与明细仍保留在悬停层和可访问名称中。

## 验证

- `npm run typecheck`：通过。
- `npm run test:m0`：通过；覆盖旋转前后的相邻格共边、设施启停、人力不足、多设施容量叠加和严格存档。
- `npm run build`：通过；Vite 生产构建 38 个模块。
- `git diff --check`：通过。
- 真实浏览器：在 `127.0.0.1:5173` 实际旋转球面、展开科研页和检查资源栏；控制台无 error 或 warning。

## 保留边界

- 本轮没有新建下层任务，由第一层直接修正已运行的 402 实现。
- 没有创作新科技、地图事实或前哨内容，没有进入 403。
- 本地试玩服务保持运行，等待用户现场复查。
