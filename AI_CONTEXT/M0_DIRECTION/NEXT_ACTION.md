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
target_task: M0-L1-101
assigned_session: M0-S003
action_status: review
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
- 当前任务：`M0-L1-101 · 试玩起点、终点与非目标`，状态为 `review`。
- 待审输出：`SPEC-M0-PLAY-001`，路径 `specs/spec-m0-play-001.md`，review 提交 `cc0969e`。
- 当前动作：Mac 复核汇编中的已确认项、工作假设和待冻结项；接受或修订后再决定是否解锁 `M0-L1-102`。

Mac 已在原用户聊天中接管 `M0-H002` 并创建 `M0-S003`。UI 中是否新建聊天不再是前置；Git session、活动 lane 和任务 ID 才是接力身份。

## 当前 review 步骤

1. 复核第 3.2 节的开局设施与食物/维修天数工作假设。
2. 复核第 6 节三条最低内容线的具体展开规则。
3. 复核第 7 节暂定 10 个游戏日观察期。
4. 用户接受或修订汇编。接受后由 Mac 方向 lane 把 `M0-L1-101` 标成 accepted，并把 `M0-L1-102` 切到 ready。
5. `M0-L1-102` 不自动开始；仍须用户另说 `开始 M0-L1-102`。

## 当前正确状态至少包含

```text
状态：REVIEW
层级：第一层｜方向与系统设计
活动 lane：M0-DIR-A｜Mac｜M0-S003
当前任务：M0-L1-101｜试玩起点、终点与非目标
任务状态：review
待审输出：SPEC-M0-PLAY-001｜specs/spec-m0-play-001.md｜cc0969e
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：等待用户接受或修订汇编
```

## 完成条件

`M0-L1-101` 保持 review，直到用户接受汇编；随后才能把 `M0-L1-102` 切到 ready，并等待单独开始授权。
