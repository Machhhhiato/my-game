---
card_version: 1
handoff_id: M0-H001
routing_epoch: 2
routing_state: active
source_host: mac
source_lane: M0-DIR-A
source_session: M0-S001
target_host: windows
target_lane: M0-DIR-B
target_work_lane: M0-L1-DIRECTION
target_layer: 1
target_task: M0-L1-101
assigned_session: M0-S002
action_status: active
required_branch: context/m0-direction
startup_phrase: 你是第一层
---

# 唯一下一会话卡

## 下一步去哪里

- 设备：Windows。
- 逻辑方向 lane：`M0-DIR-B`。
- 稳定工作 lane：`M0-L1-DIRECTION`。
- 建议会话标题：`AG-M0｜L1-DIRECTION｜101-105｜WIN`。
- 当前 session：`M0-S002`。
- 当前任务：`M0-L1-101 · 试玩起点、终点与非目标`，状态为 `active`。
- 当前动作：继续在本 session 逐项确认开局、90 日终点和非目标，不新建会话。

Windows 已完成接管。聊天对象名称不影响逻辑工作线；以 `M0-S002`、Git 分支和任务 ID 为准。

## 当前任务步骤

1. 本 session 提交 `M0-L1-101` 草案。
2. 用户逐项确认或修订开局、路径、终点和非目标。
3. 只有全部必要内容确认后，才把输出 `SPEC-M0-PLAY-001` 标记为可接受。
4. `M0-L1-101` 被接受后，本稳定工作 lane 继续 `M0-L1-102`，但仍需用户单独开始。

## 当前正确状态至少包含

```text
状态：ACTIVE
层级：第一层｜方向与系统设计
活动 lane：M0-DIR-B｜Windows｜M0-S002
当前任务：M0-L1-101｜试玩起点、终点与非目标
任务状态：active
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：继续确认本任务草案
```

## 完成条件

`M0-L1-101` 的开局、路径、终点与非目标全部由用户确认；输出进入 review 或 accepted。任务完成前不切换到 `M0-L1-102`。
