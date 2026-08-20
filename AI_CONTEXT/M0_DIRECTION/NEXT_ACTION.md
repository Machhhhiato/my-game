---
card_version: 1
handoff_id: M0-H001
routing_epoch: 2
routing_state: handoff_pending
source_host: mac
source_lane: M0-DIR-A
source_session: M0-S001
target_host: windows
target_lane: M0-DIR-B
target_work_lane: M0-L1-DIRECTION
target_layer: 1
target_task: M0-L1-101
assigned_session: null
action_status: ready
required_branch: context/m0-direction
startup_phrase: 你是第一层
---

# 唯一下一会话卡

## 下一步去哪里

- 设备：Windows。
- 逻辑方向 lane：`M0-DIR-B`。
- 稳定工作 lane：`M0-L1-DIRECTION`。
- 建议会话标题：`AG-M0｜L1-DIRECTION｜101-105｜WIN`。
- 当前任务：`M0-L1-101 · 试玩起点、终点与非目标`。
- 启动语：`你是第一层`。

如果侧栏中没有这个会话，直接新建任务并使用上述标题。聊天对象是否同步不重要；只要逻辑 lane、Git 分支和任务 ID 一致，就属于同一条工作线。

## Windows 接管步骤

1. 在真实 Always Game 仓库切换并拉取 `context/m0-direction`，只接受正常快速同步。
2. 从仓库根目录新建 Codex 任务；不要复用拉取前已经打开的旧任务。
3. 输入 `你是第一层`。
4. AI 读取项目根 `AGENTS.md` 和本卡，确认 `M0-S001` 已关闭、`routing_epoch` 为 `2`、下一目标是 Windows。
5. AI 创建新的 Windows session 后才能把 `M0-DIR-B` 标为活动；在此之前不得声称 Windows 已接管。
6. 启动回执只恢复上下文。用户再说 `开始 M0-L1-101`，产品任务才进入执行中。

## 正确回执至少包含

```text
状态：READY
层级：第一层｜方向与系统设计
接管目标：M0-DIR-B｜Windows
当前任务：M0-L1-101｜试玩起点、终点与非目标
任务状态：ready，尚未开始
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：等待用户说“开始 M0-L1-101”
```

## 完成条件

Windows 新 session 已创建并推送；`SESSION_ROUTING.md` 转为 `active`；本卡的 `assigned_session` 指向该 session；任务仍保持 `ready`，直到用户明确开始。
