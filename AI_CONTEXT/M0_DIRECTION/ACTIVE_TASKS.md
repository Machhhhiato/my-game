---
workflow_version: 2
milestone: M0-personal-playable
route_owner: M0-DIR-A:M0-S003
overall_current_task: M0-L1-103
handoff_id: M0-H002
updated_at: 2026-08-21T22:40:52+08:00
---

# M0 当前任务路由

本文件是四层“现在应该处理什么”的唯一权威入口。任务定义见 `TASK_PACKAGES.md`。

## 当前路由

| 层级 | 当前任务 | 状态 | 阻塞项 | 正确回执 |
|---|---|---|---|---|
| 第一层 | `M0-L1-103` 小地图、地形、选址与运输 | `review` | 等待用户整体接受 `SPEC-M0-MAP-001` | `REVIEW` |
| 第二层 | `M0-L2-201` 结构化内容包 | `blocked_upstream` | `M0-L1-105`、`M0-L4-010` | `BLOCKED_UPSTREAM` |
| 第三层 | `M0-L3-301` 玩家文字包 | `blocked_upstream` | `M0-L2-201` | `BLOCKED_UPSTREAM` |
| 第四层 | `M0-L4-010` 现有代码只读审计 | `blocked_upstream` | `M0-L1-105` | `BLOCKED_UPSTREAM` |

当前唯一审阅任务是 `M0-L1-103`，继续由 Mac `M0-S003` 处理。输出 `SPEC-M0-MAP-001` 的四项组成内容均已接受，当前等待整体复核；整体接受前不得把任务标为 accepted，也不得解锁 `M0-L1-104`。第二、三、四层继续按上游依赖阻塞。

## 当前审阅证据

- 任务：`M0-L1-103`。
- 输出：`SPEC-M0-MAP-001`。
- 路径：`specs/spec-m0-map-001.md`。
- 启动来源：`M0-S003-U016`。
- 第一项：accepted；地点、情报、废墟差异、真球体、37 格 M0 窗口、极地封口、占用、资源批次、连接资料和模糊距离均已确认，见 `D-M0-PROD-024` 至 `D-M0-PROD-026`。
- 第二项：accepted；候选工程按占用格、连续工作区与总部连接的已确认事实得出结论，不做综合评分，见 `D-M0-PROD-027`。
- 第三项：accepted；勘测按四级情报自动推进，暂停、换目标和重载均保留全部已知事实、阶段与剩余工作，见 `D-M0-PROD-028`。
- 第四项：accepted；货物使用实体批次和位置库存，车队、道路与两端装卸设施分别结算，中断、绕行、跨夜、离线与连续供水管线沿用真实状态，见 `D-M0-PROD-029`。
- review 来源：`M0-S003-U025`；用户接受修订后的第四项。
- 下一步：用户整体接受 `M0-L1-103`，或指出需要重新打开的具体小节。

## 最近接受证据

- 任务：`M0-L1-102`。
- 输出：`SPEC-M0-OPS-001`。
- 路径：`specs/spec-m0-ops-001.md`。
- review 提交：`0323418`。
- acceptance 提交：`f8ae1e9`。
- 接受来源：`M0-S003-U015`；决定 `D-M0-PROD-016` 至 `D-M0-PROD-023`。
- 验证：四项组成内容和整份汇编均已接受；整套 M0 仍不是 `spec_frozen`。

## 上一接受证据

- 任务：`M0-L1-101`。
- 输出：`SPEC-M0-PLAY-001`。
- 路径：`specs/spec-m0-play-001.md`。
- review 提交：`cc0969e`。
- acceptance 提交：`0e2637f`。
- 接受来源：`M0-S003-U006`；决定 `D-M0-PROD-013` 至 `D-M0-PROD-015`。
- 验证：三项 Mac 整体复核全部通过，`SPEC-M0-PLAY-001` 与 `M0-L1-101` 已 accepted；整套 M0 仍不是 `spec_frozen`。

## 串行顺序

```text
M0-L1-101
→ M0-L1-102
→ M0-L1-103
→ M0-L1-104
→ M0-L1-105
→ M0-L4-010
→ M0-L2-201
→ M0-L3-301
→ M0-L4-401
→ M0-L4-402
→ M0-L4-403
→ M0-L4-404
→ 返回第一层，由用户判断 M0 是否通过
```

不同时开启两个生产任务。某项完成后，任务会话只回传证据；第一层方向 lane 更新本文件，才算正式切换。

## 状态含义

| 状态 | 含义 |
|---|---|
| `blocked_workflow` | 当前仓库缺少项目内四层入口 |
| `blocked_upstream` | 依赖的上游任务尚未接受 |
| `ready` | 依赖满足，可以等待用户开始 |
| `active` | 用户已在对应任务会话明确授权开始 |
| `review` | 已交付，等待责任层或用户验收 |
| `accepted` | 交付已被接受，可以推进路由 |
| `returned` | 因上游缺失或交付不合格退回 |
| `verified` | 实现和相称验证均已完成 |
| `deferred` | 当前不需要，记录重启条件后暂缓 |

## 路由更新门禁

- 正常活动时只能由 `route_owner` 所在方向 session 修改；`handoff_pending` 时仅允许源 session 完成交接或目标 session 完成认领。
- 下游聊天不得自行把自己的任务或下一任务改成 `ready`。
- 任务进入 `accepted` 或 `verified` 必须附输出 ID、提交和验证证据。
- 上游规格被重新打开时，依赖任务自动退回 `blocked_upstream`。
- 同一层出现两个 `ready` 或 `active` 任务属于 `TASK_CONFLICT`。
