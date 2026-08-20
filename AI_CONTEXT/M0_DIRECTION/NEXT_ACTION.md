---
card_version: 1
handoff_id: M0-H002
routing_epoch: 3
routing_state: handoff_pending
source_host: windows
source_lane: M0-DIR-B
source_session: M0-S002
target_host: mac
target_lane: M0-DIR-A
target_work_lane: M0-L1-DIRECTION
target_layer: 1
target_task: M0-L1-101
assigned_session: null
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
- 待创建 session：`M0-S003`；在 Mac 真正接管并推送前不得登记为 active。
- 当前任务：`M0-L1-101 · 试玩起点、终点与非目标`，状态为 `review`。
- 待审输出：`SPEC-M0-PLAY-001`，路径 `specs/spec-m0-play-001.md`，review 提交 `cc0969e`。
- 当前动作：Mac 复核汇编中的已确认项、工作假设和待冻结项；接受或修订后再决定是否解锁 `M0-L1-102`。

Windows 已关闭 `M0-S002` 并发起 `M0-H002`。聊天对象名称不影响逻辑工作线；以 Git 分支、handoff ID、任务 ID 和新建 session 为准。

## Mac 接管步骤

1. 在真实 Always Game 仓库切换并拉取 `context/m0-direction`，只接受正常快速同步。
2. 从仓库根目录新建 Codex 任务；不要复用拉取前已经打开的旧任务。
3. 使用建议标题并只输入 `你是第一层`。
4. AI 确认 `M0-S002` 已关闭、`routing_epoch` 为 `3`、`M0-H002` 指向 Mac，然后创建并推送 `M0-S003`。
5. AI 返回 `REVIEW` 回执并概括 `specs/spec-m0-play-001.md` 的三处重点复核项；不得提前把任务标成 accepted。
6. 用户接受或修订汇编。接受后由 Mac 方向 lane 把 `M0-L1-101` 标成 accepted，并把 `M0-L1-102` 切到 ready。
7. `M0-L1-102` 不自动开始；仍须用户另说 `开始 M0-L1-102`。

## 当前正确状态至少包含

```text
状态：REVIEW
层级：第一层｜方向与系统设计
接管目标：M0-DIR-A｜Mac
当前任务：M0-L1-101｜试玩起点、终点与非目标
任务状态：review
待审输出：SPEC-M0-PLAY-001｜specs/spec-m0-play-001.md｜cc0969e
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
下一步：等待用户接受或修订汇编
```

## 完成条件

Mac 新 session 已创建并推送；`SESSION_ROUTING.md` 转为 active；本卡的 `assigned_session` 指向该 session。`M0-L1-101` 保持 review，直到用户接受汇编；随后才能把 `M0-L1-102` 切到 ready，并等待单独开始授权。
