---
workflow_version: 2
milestone: M0-personal-playable
route_owner: M0-DIR-B:M0-S002
overall_current_task: M0-L1-101
handoff_id: M0-H001
updated_at: 2026-08-20T20:34:30+08:00
---

# M0 当前任务路由

本文件是四层“现在应该处理什么”的唯一权威入口。任务定义见 `TASK_PACKAGES.md`。

## 当前路由

| 层级 | 当前任务 | 状态 | 阻塞项 | 正确回执 |
|---|---|---|---|---|
| 第一层 | `M0-L1-101` 试玩起点与终点 | `active` | 无；等待用户逐项确认草案 | `ACTIVE` |
| 第二层 | `M0-L2-201` 结构化内容包 | `blocked_upstream` | `M0-L1-105`、`M0-L4-010` | `BLOCKED_UPSTREAM` |
| 第三层 | `M0-L3-301` 玩家文字包 | `blocked_upstream` | `M0-L2-201` | `BLOCKED_UPSTREAM` |
| 第四层 | `M0-L4-010` 现有代码只读审计 | `blocked_upstream` | `M0-L1-105` | `BLOCKED_UPSTREAM` |

当前唯一活动任务是 `M0-L1-101`。项目内短语入口已安装；`M0-L4-000` 的全局跨项目路由扩展和完整多设备测试已暂缓，不再阻塞产品讨论。用户已经明确开始本任务；其他层仍按上游依赖保持阻塞。

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
