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
action_status: active
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
- 当前任务：`M0-L1-102 · 人力、资源、库存底线与压力`，状态为 `active`。
- 当前输出：`SPEC-M0-OPS-001`，路径 `specs/spec-m0-ops-001.md`。
- 当前动作：第一项人力方案已由 `D-M0-PROD-016` 接受；当前复核六种库存、首座前哨前启动来源、防软锁规则，以及 M0 是否增加独立能源或燃料库存。

Mac 已在原用户聊天中接管 `M0-H002` 并创建 `M0-S003`。UI 中是否新建聊天不再是前置；Git session、活动 lane 和任务 ID 才是接力身份。

## 当前 active 步骤

1. `M0-L1-101` 已在 `0e2637f` accepted，三项整体复核全部完成。
2. 用户已在 `M0-S003-U007` 明确开始 `M0-L1-102`，任务已切到 `active`。
3. 人力分组与投入档位已接受；当前确认资源种类与流动，随后再确认库存底线、项目优先级与自动暂停恢复，以及压力和两条正常完成方案。
4. 四项均接受后汇编 `SPEC-M0-OPS-001`，进入整体 review；不会自动解锁 `M0-L1-103`。

## 当前正确状态至少包含

```text
状态：ACTIVE
层级：第一层｜方向与系统设计
活动 lane：M0-DIR-A｜Mac｜M0-S003
当前任务：M0-L1-102｜人力、资源、库存底线与压力
任务状态：active
已接受输出：SPEC-M0-PLAY-001｜specs/spec-m0-play-001.md｜0e2637f
当前输出：SPEC-M0-OPS-001｜specs/spec-m0-ops-001.md
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：等待用户接受或修订第二项资源流方案
```

## 完成条件

`SPEC-M0-OPS-001` 完成必需内容并通过用户整体复核后，`M0-L1-102` 才能 accepted；随后只把 `M0-L1-103` 切到 ready，不能自动开始。
