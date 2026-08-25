---
routing_version: 5
routing_epoch: 12
routing_state: active
active_lane: M0-DIR-A
active_host: mac
preferred_host: mac
fallback_host: null
coordination_owner: M0-L1-DIRECTION
active_session: M0-S003
previous_lane: M0-DIR-B
previous_host: windows
previous_session: M0-S002
next_lane: null
next_host: null
handoff_id: M0-H002
---

# M0 会话路由

本文件回答“这个任务应该由哪条稳定任务线负责”。`ACTIVE_TASKS.md` 回答“现在轮到哪个任务”。两者必须同时读取。

## 16 个任务对应的 8 条稳定任务线

| 任务 ID | 稳定工作 lane | 建议会话标题 | 使用规则 |
|---|---|---|---|
| `M0-L4-000` | `M0-L4-WORKFLOW` | `AG-M0｜L4-WORKFLOW｜000｜MAC` | 全局路由扩展；当前暂缓，启用时由第一层创建独立任务，完成后封存 |
| `M0-L1-101` | `M0-L1-DIRECTION` | `AG-M0｜L1-DIRECTION｜101-106｜MAC` | 第一层方向会话连续复用，也是用户唯一总控入口 |
| `M0-L1-102` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-103` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-104` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-105` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话 |
| `M0-L1-106` | `M0-L1-DIRECTION` | 同上 | 复用 101 会话；负责描述风格与总规格冻结 |
| `M0-L4-005` | `M0-L4-AUDIT` | `AG-M0｜L4-AUDIT｜005-010｜MAC` | 总规格冻结后由第一层创建；只读审计 GitHub 候选，不安装工具 |
| `M0-L4-010` | `M0-L4-AUDIT` | 同上 | 005 accepted 后复用该任务；只读代码审计完成后封存 |
| `M0-L4-011` | `M0-L4-AUDIT` | `AG-M0｜L4-AUDIT｜011｜MAC` | 010 accepted 后创建；逐文件审计保留、改造与拟删除边界，完成后封存 |
| `M0-L2-201` | `M0-L2-CONTENT` | `AG-M0｜L2-CONTENT｜201｜MAC` | 依赖满足后由第一层创建 |
| `M0-L3-301` | `M0-L3-TEXT` | `AG-M0｜L3-TEXT｜301｜MAC` | 依赖满足后由第一层创建 |
| `M0-L4-401` | `M0-L4-CORE` | `AG-M0｜L4-CORE｜401-402｜MAC` | 用户单独授权实现后由第一层创建核心实现任务 |
| `M0-L4-402` | `M0-L4-CORE` | 同上 | 可复用 401 任务，但用户必须重新授权 402 |
| `M0-L4-403` | `M0-L4-OUTPOST` | `AG-M0｜L4-OUTPOST｜403｜MAC` | 用户单独授权后由第一层创建 |
| `M0-L4-404` | `M0-L4-CANDIDATE` | `AG-M0｜L4-CANDIDATE｜404｜MAC` | 用户单独授权后由第一层创建，保持独立验收视角 |

当前所有新任务固定使用 `MAC`。Windows 只保留 `M0-S002` 等历史接力证据，不是备用 host，也不出现在当前或计划中的任务标题；以后若用户重新提出跨设备需求，另开路由修订。

## 当前模型运行默认

具体模型名不写进游戏产品规则；第一层在每次创建任务时按 Mac 当时可用列表重新核对。当前默认是：

| 层级或用途 | 默认模型 | 推理强度 | 边界 |
|---|---|---|---|
| 第一层方向与总控 | `gpt-5.6-sol` | `medium`；冻结或复杂架构可按理由升 `high` | 负责系统判断与最终验收；不默认使用更高档 |
| 第二层故事与事件 | `gpt-5.6-terra` | `medium` | 批量组织人物和因果；争议项退第一层复核，不先提高整个任务深度 |
| 第三层正式文字 | `gpt-5.6-sol` | `medium` | 风格敏感正文由本模型定案；单个困难批次有明确质量缺口时才升 `high` |
| 第四层审计与执行 | `gpt-5.3-codex-spark` | `medium`；机械阶段用 `low` | 查代码、接字段、实现与测试；复杂根因或架构阶段有证据时才升 `high` |
| 机械核对 | `gpt-5.6-luna` 或 `gpt-5.4-mini` | `low` | 只核编号、遗漏、比例和术语，不负责最终判断 |

模型不可用时，第一层按同一职责选择当时最接近且不更昂贵的可用模型与思考深度并记录替代；模型变动不自动重开游戏规格。`high` 只允许在复杂架构、难复现根因、冲突证据或较低档出现明确质量失败时使用，并只覆盖必要阶段；`xhigh`、`max`、`ultra` 必须先获用户明确确认。此前用户输入的`5.2codexspark`是手误，当前名称更正为`gpt-5.3-codex-spark`。

本表已由 `D-M0-DIR-029` 修订为额度优先的最低合理思考深度。创建任务必须记录实际档位；不能沿用历史任务的 `high` 作为新任务默认。

上表用于需要长期保留、可由用户直接继续的 Codex 任务。当前 Mac 的长期任务创建列表包含表内全部模型，包括`gpt-5.4-mini`与`gpt-5.3-codex-spark`。临时并行审计使用的子代理可能只有更小的模型列表；第一层只能从该次实际列表选择，并把替代记录在审计回执中，不能据此静默改掉长期任务默认。

## 查找规则

1. 先搜索 `AG-M0`。
2. 方向找 `L1`，内容找 `L2`，玩家文字找 `L3`，执行找 `L4`。
3. 第四层再按 `000`、`005-010`、`401-402`、`403` 或 `404` 查找。

第一层优先直接创建和管理对应任务；用户不需要手工查找或复制提示词。找不到旧任务时，第一层可以按相同稳定任务线重新创建；不得因为侧栏对象不同就另造任务路线。

## Codex 线程统筹规则

- 当前 `M0-L1-DIRECTION` 任务是逻辑主线程，也是用户唯一方向入口。Codex 应用内各任务本身是同级对象，`主线程`是项目职责，不是平台父子层级。
- `M0-L4-AUDIT`、`M0-L2-CONTENT`、`M0-L3-TEXT` 及未来实现 lane 分别创建独立 Codex 任务线程；正式任务不得用一次性子代理冒充。
- 主线程使用任务创建、等待、读取和追加消息能力统筹下层。下层线程完成或阻塞后，主线程收回结果并向用户报告；用户不需要手工复制提示词。
- 新线程提示只写角色、任务、仓库路径、分支、必须读取的 Git 文档和验收条件。完整上下文以 Git 为准，不依赖复制当前长聊天。
- 稳定 lane 复用同一职责与权威上下文，但不强制永久复用同一个物理 Codex 任务。可按夜间批次、正式大阶段或上下文压力滚动创建接替任务；同一时刻只能有一个活动实例，旧实例只保留证据，跨职责任务不混用。
- 线程 ID、host ID、模型、推理强度和当前任务在实际创建后回写本文件或 `ACTIVE_TASKS.md`。没有创建时不得编造 ID。
- 所有线程使用本机环境，不创建 ChatGPT 云任务。串行依赖不变；`M0-S003-U086` 已满足最终冻结门，当前只允许创建 `M0-L4-AUDIT` 线程。

## 当前审计任务登记

| 任务标题 | Thread ID | Host | 模型 / 推理 | 状态 | 说明 |
|---|---|---|---|---|---|
| `AG-M0｜L4-AUDIT｜005-010｜MAC` | `01a0373a-75c9-71a3-8cb3-3e0213ca1322` | `local` | `gpt-5.3-codex-spark` / `high` | `systemError` | 完成启动核验后，在外部证据收集阶段因上下文窗口耗尽失败；只读，无文件修改 |
| `AG-M0｜L4-AUDIT｜005-010｜MAC R2` | `01a0373c-b12c-7c70-ba06-9c329180be59` | `local` | `gpt-5.3-codex-spark` / `high` | `systemError` | 精简本地输入后仍在整批外部证据阶段耗尽上下文；只读，无文件修改 |
| `AG-M0｜L4-AUDIT｜005-010｜MAC R3` | `01a03741-b9b7-7302-84d0-5b57447051b9` | `local` | `gpt-5.6-terra` / `high` | `completed / idle` | 已交付 accepted 的 `AUDIT-M0-TOOLS-001`；旧错误项目中的历史证据，不再追加任务 |
| `AG-M0｜L4-AUDIT｜010｜MAC` | `01a037ea-d006-7690-ae23-1a93a824429e` | `local` | 应用默认模型 / `high` | `completed / idle` | 正确本地 `always game` 项目的只读工作树任务；已交付 accepted 的 `AUDIT-M0-TECH-001` |
| `AG-M0｜L4-AUDIT｜011｜MAC` | `01a03800-3d9f-7c70-b1dc-70a30bc8bf01` | `local` | `gpt-5.3-codex-spark` → `gpt-5.6-terra` / `high` | `completed / idle` | Spark 在最终收口前耗尽额度；同一只读任务由 Terra 完成修订版，输出进入 review |
| `AG-M0｜L2-CONTENT｜201｜MAC` | `01a0382b-4e62-77e0-904c-a35b9e7be8f5` | `local` | `gpt-5.6-terra` / `medium` | `completed / idle` | 正确本地项目的只读工作树任务；首次交付被退回，修订版 `CONTENT-M0-001` 已 accepted |

当前没有运行中的下层任务。`M0-L2-201` / `01a0382b-4e62-77e0-904c-a35b9e7be8f5` 已只读完成并 accepted。用户已授权同步记录并开始 `M0-L3-301`；第三层任务必须从包含 `CONTENT-M0-001` accepted 状态的同步提交创建。

从 `M0-S003-U089` 起，昼夜分工正式生效：白天由第一层完成方案、范围、验收与夜间执行单；夜间任务只执行一个已授权的大结果，通常按约六小时估算，但额度、上下文和环境允许时可以运行八小时或更久，并按新的预计结束时间预留收尾验证时间；次日由第一层收回证据并交给用户验收。详细规则见 accepted 的 `day-night-execution-plan.md` 和 `NIGHT_WORK_ORDER_TEMPLATE.md`。研究型审计与代码实现不得塞进同一夜间任务；上下文接近上限时必须先写检查点，再建立新任务继续。

Always Game 新建任务的项目归属固定为侧边栏 `always game` 项目，真实工作目录固定为 `/Users/xujiangyue/AGENT Project/always game`。创建前同时核对项目 ID、local host 与工作目录；任何一项不满足都要停止并报告，不能再退回 `/Users/xujiangyue` 通用项目。既有 R1、R2、R3 不具备重新归属操作，保留为历史证据；后续接替任务从正确项目创建。

OpenAI 官方用例把长期目标与专属项目协作者列为 Codex 工作流：<https://learn.chatgpt.com/use-cases>。该资料支持使用长期独立任务承载不同职责；本项目的具体主线程与 Git 门禁由 `D-M0-DIR-020` 进一步限定。

## 活动与授权规则

- 同一稳定任务线同时只能有一个活动任务；当前只允许 Mac 任务成为活动实例。
- `handoff_pending` 时 `active_lane`、`active_host`、`active_session` 必须为 `null`，不能提前虚构接管完成。
- 第一层可以在依赖满足后创建、驱动、读取、等待、退回和收回第二至第四层任务；下层必须完整读取自己的角色卡和任务卡，并把产物、证据与阻塞交回第一层。
- 第一层统筹不允许越过串行依赖，不替代第二、三层的职责，也不是第四层写入授权。`M0-L4-401` 至 `404` 每个实现任务仍须用户单独授权。
- `M0-L1-106`、`M0-L4-005`、`M0-L4-010`、`M0-L4-011`、`M0-L2-201` 已 accepted 且 `overall_spec_frozen: true`；当前 `M0-L3-301` ready_sync_pending。
- 当前任务和状态只以 `ACTIVE_TASKS.md` 为准；当前唯一下一动作只以 `NEXT_ACTION.md` 为准。
