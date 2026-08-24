---
workflow_version: 2
milestone: M0-personal-playable
route_owner: M0-DIR-A:M0-S003
overall_current_task: M0-L1-106
handoff_id: M0-H002
updated_at: 2026-08-24T18:13:51+08:00
---

# M0 当前任务路由

本文件是四层“现在应该处理什么”的唯一权威入口。任务定义见 `TASK_PACKAGES.md`。

## 当前路由

| 层级 | 当前任务 | 状态 | 阻塞项 | 正确回执 |
|---|---|---|---|---|
| 第一层 | `M0-L1-106` 工程与科技描述结构、风格与总规格冻结 | `active` | 无；第一、二项 accepted，第三项等待用户复核 | `ACTIVE_REVIEW` |
| 第二层 | `M0-L2-201` 结构化内容包 | `blocked_upstream` | `M0-L1-106`、`M0-L4-010` | `BLOCKED_UPSTREAM` |
| 第三层 | `M0-L3-301` 玩家文字包 | `blocked_upstream` | `M0-L2-201` | `BLOCKED_UPSTREAM` |
| 第四层 | `M0-L4-010` 现有代码只读审计 | `blocked_upstream` | `M0-L1-106` accepted 且 `overall_spec_frozen` | `BLOCKED_UPSTREAM` |

`SPEC-M0-INTEGRATED-001` 与 `M0-L1-105` 已在 `ab02d36` accepted。`M0-L1-106` 第一项与第二项已 accepted；第三项已提交 active_review，当前提案把固定解锁、带条件预计、真实当前状态和完成结果快照分开。`D-M0-DIR-009` 继续要求下游全文读取权威源包并回传来源回执。`SPEC-M0-DESCRIPTION-001` 继续 active，第二、三、四层继续按既定依赖阻塞。

## 当前生产证据

- 任务：`M0-L1-106`。
- 输入：`SPEC-M0-INTEGRATED-001`；`references/reference-m0-engineering-tech-style-001.md`；`references/reference-m0-tech-description-corpus-001.md`。
- 当前输出：`SPEC-M0-DESCRIPTION-001`；路径 `specs/spec-m0-description-001.md`，状态 active。
- 依赖证据：`SPEC-M0-INTEGRATED-001` 与 `M0-L1-105` 已在 `ab02d36` accepted；决定 `D-M0-PROD-036`，来源 `M0-S003-U039`。
- 启动证据：`M0-S003-U040` 明确说`开始 M0-L1-106`。
- 当前问题：`Q-M0-032` 为 `active_in_M0-L1-106`；第一项“玩家先看到的玩法信息与展开顺序”、第二项“技术内容最低必须写到哪里” accepted；第三项“数字、预计效果和当前状态怎样引用” active_review，其余五项 pending。
- 接受证据：`M0-S003-U044` 接受第一项的信息结构；`D-M0-PROD-037` 明确视觉示意未获接受，后续必须随整体 UI 重做。
- 返工证据：`M0-S003-U045` 指出玩法元语言不是正文；`U046` 指出技术段太长且制度口吻自我揭露；`U047` 判断整体方向仍不对，并要求先收集真实描述样本。
- 接受内容：《恢复精密制造》第一行只说明统一精度标准让复杂零件能够稳定复制；第二行由生产恢复委员会评价，精密制造把工人的经验从工人身上剥离。下游完整源包为 `references/reference-m0-tech-description-corpus-001.md`，摘要不能替代。
- 第三项提案：科研卡只写固定解锁；选中科技后的侧栏显示研究进度与带生效条件的预计；工程和设施页显示真实当前状态；完成报告保存一次实际结果快照。预计值随当前投入重算，正文不插入动态数字。
- 冻结边界：`overall_spec_frozen` 仍为 false；`M0-L4-010`、`M0-L2-201`、`M0-L3-301` 继续 blocked_upstream。
- 路由决定：`D-M0-DIR-007`、`D-M0-DIR-009`、`D-M0-PROD-036` 至 `D-M0-PROD-038`。

## 最近接受证据

- 任务：`M0-L1-105` 整体。
- 输出：`SPEC-M0-INTEGRATED-001`；路径 `specs/spec-m0-integrated-001.md`。
- acceptance 提交：`ab02d36`。
- 接受来源：`M0-S003-U039`；决定 `D-M0-PROD-036`。
- 验证：三条 90 日路线、固定事故、人口变化与三个保存点都有纸面证据；链路门和正式内容门的纸面结果已由用户接受，但不冒充实现测试或真实运行验证。

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
- 当前承接：`M0-L1-105` 已 accepted，`M0-L1-106` 已由 `M0-S003-U040` 明确开始并 active。

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
