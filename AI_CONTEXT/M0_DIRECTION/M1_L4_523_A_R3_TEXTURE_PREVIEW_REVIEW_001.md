---
review_id: REVIEW-M1-L4-523-A-R3-TEXTURE-001
task_id: M1-L4-523-A-R3
status: returned_by_user_map_architecture_mismatch
implementation_thread_id: 01a052f7-01b1-7bf2-bd78-2cb63d202c0f
implementation_worktree: /Users/xujiangyue/.codex/worktrees/c8b8/always game
reviewed_at: 2026-08-31
commit_created: false
push_completed: false
publish_completed: false
main_checkout_integration: false
---

# M1-L4-523-A-R3 地图贴图联合试玩审查

## 结论

用户于2026-08-31明确退回本候选。问题不是贴图精度不足，而是地图母版和空间口径错误：R3继续使用深色球面并把高精度透明建筑放大覆盖地图，违背已经接受的连续区域战略沙盘、普通设施地点锚定、六角格默认隐藏和高精度插图进入详情层的规则。

本候选只保留为反例与R2玩法接线证据。球面构图、普通地点多格贴图、建筑比例和贴图融合方式均不得继续下传；后续由`M1-L4-523-A-R4`重建千人阶段连续区域地图母版。

## 贴图

- 避难所总部：强化混凝土入口、通信塔和发电机棚；约两个大型建筑格。
- 千人聚居点：模块住房、温室、水塔、公共设施和内部道路；约三点五格。
- 工业废墟：倒塌厂房、烟囱、管廊、储罐和货运残骸；两处目标共用源图，以镜像、旋转、色阶和偏移区分。
- 基础生产场址：三座作业厅、机修区、吊装架和材料堆场；约两个格，仅在对应工程实际完成后出现。

生成采用内置图像生成工具。共同提示方向为：透明底、正交三分之四俯视、低饱和拟真工业材质、冷阴天光、适配战略六角地图、无文字、无界面、无六角底座、无人物和水印。聚居点图额外执行一次只删除红十字符号的定点修订，其余构图保持不变。

项目资产位于：

`/Users/xujiangyue/.codex/worktrees/c8b8/always game/src/m0/assets/r3-texture-preview-001/`

聚居点生成图的棋盘背景被烘入RGB像素，第四层保留原图并建立`settlement-display.png`显示派生图，只删除从图像边缘连通的棋盘背景，没有重绘主体。

## 接线与验证

- 地图桌面上限由560px提升至740px；1366宽度为553px，390宽度为304px。
- 贴图位于地形上、交互格网下，全部`pointer-events: none`。
- 选中、雾区、球面旋转投影、响应式缩放和基础工业出现条件均由稳定地图ID与真实状态驱动。
- 第一层实看后退回地图过小、总部不清、双废墟重叠三项，最终修订已重新构建。
- `npm run typecheck`、`npm run test:m0`、`npm run build`、`git diff --check`通过。
- 第一层再次独立执行核心模拟与差异检查：通过。
- 1920×1080、1366×768、390×844无页面横纵溢出和控制台错误；窄屏悬浮面板后地图保持可见。

截图目录：

`/Users/xujiangyue/.codex/worktrees/c8b8/always game/output/m1-l4-523-a-r3/`

试玩地址：`http://127.0.0.1:4179/`

## 未冻结边界

- 当前球面仍是程序化低细节底图，贴图与地表材质之间还没有最终融合；
- 建筑群的精细剪影、色温、损坏层级、昼夜版本和建设阶段图仍未制作；
- 完成前后变化目前只验证“状态驱动出现”，不代表最终阶段动画；
- 用户验收前不提交、不推送、不发布、不合入主目录，也不进入下一视觉批次。
