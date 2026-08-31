---
task_id: M1-L4-523-A-R3
status: implemented_verified_waiting_user_review
target_layer: 4
target_lane: M1-L4-VISUAL-SHELL
source_thread_id: 01a052f7-01b1-7bf2-bd78-2cb63d202c0f
source_worktree: /Users/xujiangyue/.codex/worktrees/c8b8/always game
execution_authorized: true
commit_authorized: false
push_authorized: false
publish_authorized: false
main_checkout_integration_authorized: false
created_at: 2026-08-31
---

# M1-L4-523-A-R3 地图贴图联合试玩

## 目标

在R2千人自循环纵向切片上接入四张粗版透明建筑贴图，使用户能够同时验收地图逻辑、建筑尺度、跨格关系和拟真视觉方向。此批是概念贴图验收，不冻结最终资产精度。

## 已生成源图

第四层把选中源图复制到项目工作树内的版本化资产目录，保留原图，不覆盖其他资产：

- 避难所总部：`/Users/xujiangyue/.codex/generated_images/01a03da2-10c0-7772-a465-cbf9237d988c/exec-1b75ce6a-a325-4544-9e68-4aa5b97b64d7.png`
- 千人聚居点：`/Users/xujiangyue/.codex/generated_images/01a03da2-10c0-7772-a465-cbf9237d988c/exec-3a1a1b36-e9e3-4acf-9a2e-2f788e9deb42.png`
- 工业废墟：`/Users/xujiangyue/.codex/generated_images/01a03da2-10c0-7772-a465-cbf9237d988c/exec-d9060c69-98c2-4e23-b0d1-dfe3fe66af36.png`
- 基础生产场址：`/Users/xujiangyue/.codex/generated_images/01a03da2-10c0-7772-a465-cbf9237d988c/exec-0a499def-cb0c-44a6-9c7e-6450fb7ce2f5.png`

四张图均为1536×1024 PNG并带Alpha通道。正式接入后不得继续引用`~/.codex/generated_images`路径。

## 接图规则

1. 地图、六角网格、雾区、道路、河流和既有交互仍是底层；贴图位于地形与交互标记之间，不得挡住点击和悬浮。
2. 避难所总部锚定总部格，视觉占约一个半大型建筑格。
3. 千人聚居点锚定既存聚居点，视觉占约三至四格，明确允许建筑群跨格，但只保留一个逻辑锚点。
4. 工业废墟分别锚定两个废墟目标；可以复用同一源图并以轻微镜像、旋转、色阶差异避免完全重复，但逻辑目标仍独立。
5. 基础生产场址在`opening-basic-industry`完成前不显示；完成后作为聚居点旁的产业扩建层出现，占约两格，不覆盖聚居点主体。
6. 贴图不承担逻辑主键，不把图片名、屏幕坐标或显示文字写进通用规则。
7. 原有地图标记、选中轮廓、工程状态和悬浮信息继续承担交互；贴图本身`pointer-events: none`。
8. 桌面、笔记本和窄屏使用同一资产，通过受控缩放和裁切保持可读，不生成三套逻辑。
9. 不把透明边缘、暗色底晕或高亮灯光误认为地块占领范围；跨格只是一种视觉表现。

## 验收

- 新档可看到总部、聚居点和两处废墟的粗版贴图；
- 基础生产场址完成前后有明确但不过度跳变的地图变化；
- 建筑群能跨格而不会让道路格、河流格或交互热区失效；
- 地图缩放或窗口变化时，贴图不脱离锚点、不压住顶部栏和主要悬浮面板；
- 1920×1080、1366×768、390×844无页面水平溢出；
- `npm run typecheck`、`npm run test:m0`、`npm run build`和`git diff --check`通过；
- 交付一个用户可直接打开的本地试玩地址与至少三张实际页面截图；
- 不提交、不推送、不发布、不并入主目录。
