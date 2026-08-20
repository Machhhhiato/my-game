# M0 方向对话接力入口

> 协议版本：1
>
> 固定分支：`context/m0-direction`
>
> 讨论模式：`direction_discussion`
>
> 产品实现状态：未授权、未开始

本目录是 M0 方向讨论在 Mac、Windows、不同聊天、不同项目外壳与不同终端之间的 Git 接力层。GitHub 是唯一传输完成标志；聊天窗口、未提交文件、stash 和本地笔记都不构成已交接事实。

## 四层会话启动

当用户输入“你是第一层”“你是第二层”“你是第三层”或“你是第四层”时，不使用下面的普通方向恢复流程，先读取：

1. `AI_CONTEXT/M0_DIRECTION/WORKFLOW_BOOTSTRAP.md`
2. 对应的 `roles/` 角色卡
3. `AI_CONTEXT/M0_DIRECTION/PLAIN_LANGUAGE_RULES.md`
4. `AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md`
5. `AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md` 中当前任务

一句话启动的项目入口与本机全局路由仍需 `M0-L4-000` 安装。安装前不得声称跨项目自动识别已经生效。

## 新聊天恢复顺序

1. 确认真正的 Always Game Git 仓库，并切换到 `context/m0-direction`。
2. 只允许从远端快速同步；工作区不干净或远端存在分叉时停止，不得强制覆盖。
3. 依次阅读：
   - `AI_CONTEXT/M0_DIRECTION/PROTOCOL.md`
   - `AI_CONTEXT/M0_DIRECTION/ACTIVE.md`
   - `AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md`
   - `AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md`
   - `AI_CONTEXT/M0_DIRECTION/DECISIONS.md`
   - `AI_CONTEXT/M0_DIRECTION/OPEN_QUESTIONS.md`
   - `AI_CONTEXT/M0_DIRECTION/SESSION_INDEX.md` 指向的最新 session
4. 先输出恢复回执，再继续讨论。
5. 若接管另一台设备，创建新的 session；不得继续修改另一台设备已经关闭的 session。

## 恢复回执

```text
恢复基线：<branch>@<commit>
当前逻辑会话：<lane>
当前目标：
已确认方向：
仍属提案：
已否决或暂缓：
当前唯一问题：
禁止操作：
准备继续：
```

如果恢复内容与用户理解不一致，标记 `CONTEXT_CONFLICT` 并列出冲突，不得自行选择“最后一条聊天”为准。

## 通用启动提示

```text
请进入 Always Game 仓库的 context/m0-direction 分支，从
AI_CONTEXT/M0_DIRECTION/START_HERE.md 恢复 M0 方向讨论。
先输出恢复回执；本聊天只讨论方向，不修改游戏代码、产品规格或 main。
```

## 权威关系

- `DECISIONS.md`：本方向分支上已经由用户确认的讨论决定。
- `sessions/`：用户与助手可见原文，以及可审计的理由记录。
- `ACTIVE.md`：当前热状态和下一问题，只是接续卡，不替代来源。
- `ACTIVE_TASKS.md`：四层当前任务和阻塞关系的唯一动态路由。
- `TASK_PACKAGES.md`：任务边界、输入输出、完成条件和禁区。
- 根目录冻结规格、根决策日志、代码与验证：仍是 `main` 上的项目事实来源。

方向分支中的决定只有在规格冻结并由独立同步或执行聊天正式写入项目权威文件后，才能成为实施输入。
