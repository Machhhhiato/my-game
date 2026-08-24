---
workflow_version: 2
milestone: M0-personal-playable
route_owner: M0-DIR-A:M0-S003
overall_current_task: M0-L1-105
handoff_id: M0-H002
updated_at: 2026-08-24T12:21:16+08:00
---

# M0 当前任务路由

本文件是四层“现在应该处理什么”的唯一权威入口。任务定义见 `TASK_PACKAGES.md`。

## 当前路由

| 层级 | 当前任务 | 状态 | 阻塞项 | 正确回执 |
|---|---|---|---|---|
| 第一层 | `M0-L1-105` 前 90 日纸面试玩与机制整合验收 | `active` | 无；用户已在 `M0-S003-U036` 明确开始 | `ACTIVE` |
| 第二层 | `M0-L2-201` 结构化内容包 | `blocked_upstream` | `M0-L1-106`、`M0-L4-010` | `BLOCKED_UPSTREAM` |
| 第三层 | `M0-L3-301` 玩家文字包 | `blocked_upstream` | `M0-L2-201` | `BLOCKED_UPSTREAM` |
| 第四层 | `M0-L4-010` 现有代码只读审计 | `blocked_upstream` | `M0-L1-106` accepted 且 `overall_spec_frozen` | `BLOCKED_UPSTREAM` |

`M0-L1-105` 已由用户明确开始，`SPEC-M0-INTEGRATED-001` 已创建并处于 active。第一项时间换算与账本格式已接受，当前讨论第二项第 1 日状态与总部日常流入、消耗。后续第一层任务 `M0-L1-106` 为 `blocked_upstream`，只在 105 accepted 后切到 ready；第二、三、四层继续按新依赖阻塞。

## 当前启动证据

- 任务：`M0-L1-105`。
- 输出：`SPEC-M0-INTEGRATED-001`。
- 路径：`specs/spec-m0-integrated-001.md`。
- 启动来源：`M0-S003-U036`。
- 已接受第一项：`T00` 时间换算与纸面账本格式；决定 `D-M0-PROD-034`，来源 `M0-S003-U037`。
- 当前项：`T01` 第 1 日状态与 `T02` 日常流入、消耗、维护工作。
- 当前提案：水/食物/普通零件第 1 日为 280/560/45；工程构件/合金料/精密部件为 80/40/0；水食零件使用已接受人数档位结算，标准分配可以稳定运行并推进水务恢复，最低档以储备和维护积压换取集中人力；详细主线锁定、设施状态和流量见规格第 5 节。
- 后续新增：`M0-L1-106 · 工程与科技描述结构、风格与总规格冻结`，输出 `SPEC-M0-DESCRIPTION-001`；当前不创建该规格。
- 路由决定：`D-M0-DIR-007`。

## 最近接受证据

- 任务：`M0-L1-105` 第一项。
- 输出：`SPEC-M0-INTEGRATED-001` 第 4 节。
- 接受来源：`M0-S003-U037`；决定 `D-M0-PROD-034`。
- 验证：20 秒/游戏日、35–40 分钟总时长、必要阅读与操作计时边界、速度边界和完整状态账本均已接受；第二项 `T01/T02` active。

## 上一任务接受证据

- 任务：`M0-L1-104`。
- 输出：`SPEC-M0-PROGRESSION-001`。
- 路径：`specs/spec-m0-progression-001.md`。
- review 提交：`5a5ee87`。
- acceptance 提交：`d34d6ab`。
- 启动来源：`M0-S003-U027`。
- 第一项：accepted；`D-M0-PROD-030`，同一条真实科研工作线使用指定队列和领域自动轮次两种选题方式。
- 第二项：accepted；`D-M0-PROD-031`，避难所内部供电、档案复原与新发现、内部精密工坊、无人机返航补能和四段勘测作用已经确认。
- 跨规格修订：`SPEC-M0-OPS-001` 与 `SPEC-M0-MAP-001` 只窄范围修正“避难所完全无电”和“无能源阶段”的原因文字，accepted 状态与原任务验收不变；接口运行细节现由 `D-M0-PROD-031` 确认。
- 第三项：accepted；`D-M0-PROD-032`，七段首建、稳定验收、标准工程包、首次阶段报告、逐段物资设备和实体科技改善规则已经确认。
- 下层交接：第一层只冻结阶段报告字段与系统事实；`M0-L2-201` 以后写事件结构和负责人处境，`M0-L3-301` 再写正式姓名、正文、按钮和提示。两层仍按上游依赖阻塞。
- 第四项：accepted；`D-M0-PROD-033`，工程包适用判断、一次批准、真实复制、暂停恢复、玩家接管、报告降噪和版本存档已经确认。
- 接受来源：`M0-S003-U035`；决定 `D-M0-PROD-030` 至 `D-M0-PROD-033`。
- 规格状态：`SPEC-M0-PROGRESSION-001` 与 `M0-L1-104` 均为 `accepted`；整套 M0 仍不是 `overall_spec_frozen`。
- 验收时路由：四项组成内容和整份汇编均已接受；当时只把 `M0-L1-105` 切到 ready。该状态已由 `M0-S003-U036` 的明确启动和 `D-M0-DIR-007` 后续修订。
- 当前承接：`M0-L1-105` 已 active，下一步确认 `T01/T02` 第 1 日账面和日常流量。

## 上一接受证据

- 任务：`M0-L1-103`。
- 输出：`SPEC-M0-MAP-001`。
- 路径：`specs/spec-m0-map-001.md`。
- review 提交：`c080fd0`。
- acceptance 提交：`0e1723d`。
- 接受来源：`M0-S003-U026`；决定 `D-M0-PROD-024` 至 `D-M0-PROD-029`。
- 验证：四项组成内容和整份汇编均已接受；整套 M0 仍不是 `overall_spec_frozen`。

## 更早接受证据

- 任务：`M0-L1-102`。
- 输出：`SPEC-M0-OPS-001`。
- 路径：`specs/spec-m0-ops-001.md`。
- review 提交：`0323418`。
- acceptance 提交：`f8ae1e9`。
- 接受来源：`M0-S003-U015`；决定 `D-M0-PROD-016` 至 `D-M0-PROD-023`。
- 验证：四项组成内容和整份汇编均已接受；整套 M0 仍不是 `overall_spec_frozen`。

## 最早接受证据

- 任务：`M0-L1-101`。
- 输出：`SPEC-M0-PLAY-001`。
- 路径：`specs/spec-m0-play-001.md`。
- review 提交：`cc0969e`。
- acceptance 提交：`0e2637f`。
- 接受来源：`M0-S003-U006`；决定 `D-M0-PROD-013` 至 `D-M0-PROD-015`。
- 验证：三项 Mac 整体复核全部通过，`SPEC-M0-PLAY-001` 与 `M0-L1-101` 已 accepted；整套 M0 仍不是 `overall_spec_frozen`。

## 串行顺序

```text
M0-L1-101
→ M0-L1-102
→ M0-L1-103
→ M0-L1-104
→ M0-L1-105
→ M0-L1-106
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
