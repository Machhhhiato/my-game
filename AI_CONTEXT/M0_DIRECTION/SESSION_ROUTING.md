---
routing_version: 1
routing_epoch: 2
routing_state: handoff_pending
active_lane: null
active_host: null
active_session: null
previous_lane: M0-DIR-A
previous_host: mac
previous_session: M0-S001
next_lane: M0-DIR-B
next_host: windows
handoff_id: M0-H001
---

# M0 会话路由

本文件回答“这个任务应该去哪个会话”。`ACTIVE_TASKS.md` 回答“现在轮到哪个任务”。两者必须同时读取。

## 13 个任务对应的 8 条稳定工作线

| 任务 ID | 稳定工作 lane | 建议会话标题 | 使用规则 |
|---|---|---|---|
| `M0-L4-000` | `M0-L4-WORKFLOW` | `AG-M0｜L4-WORKFLOW｜000｜MAC/WIN` | 全局路由扩展；当前暂缓，启用时必须新建，完成后封存 |
| `M0-L1-101` | `M0-L1-DIRECTION` | `AG-M0｜L1-DIRECTION｜101-105｜MAC/WIN` | 第一层方向会话连续复用 |
| `M0-L1-102` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-103` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-104` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-105` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L4-010` | `M0-L4-AUDIT` | `AG-M0｜L4-AUDIT｜010｜MAC/WIN` | 必须新建；只读审计完成后封存 |
| `M0-L2-201` | `M0-L2-CONTENT` | `AG-M0｜L2-CONTENT｜201｜MAC/WIN` | 必须新建 |
| `M0-L3-301` | `M0-L3-TEXT` | `AG-M0｜L3-TEXT｜301｜MAC/WIN` | 必须新建 |
| `M0-L4-401` | `M0-L4-CORE` | `AG-M0｜L4-CORE｜401-402｜MAC/WIN` | 必须新建核心实现会话 |
| `M0-L4-402` | `M0-L4-CORE` | 同上 | 复用 401 会话，但必须重新授权 402 |
| `M0-L4-403` | `M0-L4-OUTPOST` | `AG-M0｜L4-OUTPOST｜403｜MAC/WIN` | 必须新建 |
| `M0-L4-404` | `M0-L4-CANDIDATE` | `AG-M0｜L4-CANDIDATE｜404｜MAC/WIN` | 必须新建，保持独立验收视角 |

标题中的 `MAC/WIN` 必须替换为实际设备。设备后缀不改变稳定工作 lane。

## 查找规则

1. 先搜索 `AG-M0`。
2. 方向找 `L1`，内容找 `L2`，玩家文字找 `L3`，执行找 `L4`。
3. 第四层再按 `000`、`010`、`401-402`、`403` 或 `404` 查找。

找不到旧聊天时允许新建同名任务；不得因为侧栏对象不同就另造任务路线。

## 活动与授权规则

- 同一稳定工作 lane 同时只能有一个活动会话；MAC 与 WIN 版本不得同时活动。
- `handoff_pending` 时 `active_lane`、`active_host`、`active_session` 必须为 `null`，不能提前虚构接管完成。
- 复用会话不继承任务授权。每个新任务开始前重新读取任务卡，并由用户明确说 `开始 <task_id>`。
- 当前任务和状态只以 `ACTIVE_TASKS.md` 为准；当前唯一下一目的地只以 `NEXT_ACTION.md` 为准。
