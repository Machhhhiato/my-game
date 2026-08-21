---
card_version: 1
handoff_id: M0-H002
routing_epoch: 3
routing_state: active
source_host: windows
source_lane: M0-DIR-B
source_session: M0-S002
target_host: mac
target_lane: M0-DIR-A
target_work_lane: M0-L1-DIRECTION
target_layer: 1
target_task: M0-L1-102
assigned_session: M0-S003
action_status: ready
required_branch: context/m0-direction
startup_phrase: 你是第一层
---

# 唯一下一会话卡

## 下一步去哪里

- 设备：Mac。
- 逻辑方向 lane：`M0-DIR-A`。
- 稳定工作 lane：`M0-L1-DIRECTION`。
- 建议会话标题：`AG-M0｜L1-DIRECTION｜101-105｜MAC`。
- 当前 session：`M0-S003`。
- 已接受任务：`M0-L1-101 · 试玩起点、终点与非目标`，acceptance 提交 `0e2637f`。
- 当前任务：`M0-L1-102 · 人力、资源、库存底线与压力`，状态为 `ready`。
- 当前动作：等待用户明确说 `开始 M0-L1-102`；在此之前不展开或实施该任务。

Mac 已在原用户聊天中接管 `M0-H002` 并创建 `M0-S003`。UI 中是否新建聊天不再是前置；Git session、活动 lane 和任务 ID 才是接力身份。

## 当前 ready 步骤

1. `M0-L1-101` 已在 `0e2637f` accepted，三项整体复核全部完成。
2. `M0-L1-102` 已切到 `ready`，没有自动开始。
3. 用户说 `开始 M0-L1-102` 后，本会话再把它切到 `active` 并进入讨论。

## 当前正确状态至少包含

```text
状态：READY
层级：第一层｜方向与系统设计
活动 lane：M0-DIR-A｜Mac｜M0-S003
当前任务：M0-L1-102｜人力、资源、库存底线与压力
任务状态：ready
已接受输出：SPEC-M0-PLAY-001｜specs/spec-m0-play-001.md｜0e2637f
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：等待用户明确说“开始 M0-L1-102”
```

## 完成条件

用户明确说 `开始 M0-L1-102` 后，才把该任务从 `ready` 切到 `active`。
