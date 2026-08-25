---
output_id: CONTENT-M0-001
task_id: M0-L2-201
title: M0 主线、任务与临时事件结构
status: accepted
source_thread: 01a0382b-4e62-77e0-904c-a35b9e7be8f5
source_model: gpt-5.6-terra
reasoning_effort: medium
source_commit: ba895f5647b8df4865864e854774e56b8bb5af5c
source_bundle_revision: 6
source_read_receipt: FULL_READ
reviewed_by: M0-L1-DIRECTION
reviewed_at: 2026-08-25T17:16:16+08:00
user_acceptance: accepted
accepted_at: 2026-08-25T17:27:12+08:00
acceptance_decision: D-M0-PROD-050
implementation_authorized: false
---

# CONTENT-M0-001 · M0 主线、任务与临时事件结构

本文件完整保留下层任务在第一层退回一次后的修订交付。它当前只进入用户 review，不代表 accepted，不授权第三层启动，也不授权修改游戏代码。

## source_read_receipt

```yaml
fixed_commit: ba895f5647b8df4865864e854774e56b8bb5af5c
source_bundle_revision: 6
read_scope: full_file_to_eof
summary_not_authoritative: true
result: FULL_READ
sources:
  - AGENTS.md
  - AI_CONTEXT/M0_DIRECTION/WORKFLOW_BOOTSTRAP.md
  - AI_CONTEXT/M0_DIRECTION/NEXT_ACTION.md
  - AI_CONTEXT/M0_DIRECTION/SESSION_ROUTING.md
  - AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md
  - AI_CONTEXT/M0_DIRECTION/roles/l2-story-events.md
  - AI_CONTEXT/M0_DIRECTION/PLAIN_LANGUAGE_RULES.md
  - AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-play-001.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-ops-001.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-map-001.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-progression-001.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-integrated-001.md
  - AI_CONTEXT/M0_DIRECTION/specs/spec-m0-description-001.md
  - AI_CONTEXT/M0_DIRECTION/AUDIT_M0_TECH_001.md
  - AI_CONTEXT/M0_DIRECTION/AUDIT_M0_CODE_BOUNDARY_001.md
  - AI_CONTEXT/M0_DIRECTION/references/reference-m0-tech-description-corpus-001.md
```

所有 `speaker_role` 都是稳定功能身份，不是新增正式机构或人物。第三层只能写其最终措辞，不得命名新机构、人物、地点或补充世界事实。

## 主线结构

| ID | 引用的冻结规格 / 状态 | speaker_role | 玩家实际决定 | 自动推进部分 | 资源和人力后果 / 中断恢复 | 反转机制 / L3 槽位 |
|---|---|---|---|---|---|---|
| `M0E-MAIN-001-WATER` | `SPEC-M0-PLAY-001` §5、§6.3；`SPEC-M0-OPS-001` §人力档位、§事故；`SPEC-M0-INTEGRATED-001` T03-2 | 水务值守职能 | 设置水务修复优先级、人力档位、库存预留。 | 按批准人力持续修复；日常供水、食物、维护与物流正常结算。 | 水务修复的冻结投入为普通零件、工程构件、合金料及工程工作量；缺人缺料或优先级变化时暂停，保留已投入和进度，条件恢复后继续。 | `none`。L3：故障、在建、恢复的事实记录；不重复库存账本。 |
| `M0E-MAIN-002-PRECISION-RESEARCH` | `SPEC-M0-PROGRESSION-001` §2、§科研控制；`SPEC-M0-DESCRIPTION-001` §科技两段、§强度；`D-M0-PROD-038` | 科研复原职能 | 指定“恢复精密制造”为重点目标；调整科研人力和优先级。 | 普通科研按领域倾向继续；已批准重点科研持续累计。 | 只占既有科研人力；底线或优先级导致停止时保留进度，恢复后续接。 | 中度候选：统一精度标准 → 复杂零件可稳定复刻 → 原本附着于工人经验的能力被流程接管。L3：技术能力＋一个相关制度侧面。 |
| `M0E-MAIN-003-PRECISION-WORKSHOP` | `SPEC-M0-PROGRESSION-001` T03-1；`SPEC-M0-INTEGRATED-001` T03-1；`SPEC-M0-DESCRIPTION-001` §工程二态 | 工坊维修职能 | 批准精密工坊修复与独立试制；设定工程优先级和物资预留。 | 工坊在批准边界内完成修复、试制；同一时间只做一项工作。 | 修复工坊冻结投入为普通零件、工程构件、合金料和工程人力；不足时暂停，保留在建状态、进度和已投入物资。 | `none`。L3：现场恢复出的制造能力；不写工时、内部编号或预计。 |
| `M0E-MAIN-004-DRONE-SURVEY` | `SPEC-M0-PLAY-001` §6.2；`SPEC-M0-MAP-001` 勘测/路线/风险规则；`SPEC-M0-PROGRESSION-001` T03-1 | 勘测执行职能 | 批准无人机制造与部署；选择勘测方向、路线、投入时间与设备。 | 按方向线索→范围确认→路线确认→现场确认逐段推进；无人机降低既有勘测工作但不一次揭示全部情报。 | 使用冻结的无人机制造、补能与勘测投入；触及风险或投入上限时暂停。删除“维护不足或路线条件不满足即暂停”的未证实断言。 | `none`。L3：每次新确认的地理/路线/风险事实；不暴露格点和内部状态。 |
| `M0E-MAIN-005-FIRST-OUTPOST` | `SPEC-M0-PLAY-001` §5、§6.2；`SPEC-M0-PROGRESSION-001` T03-2；`SPEC-M0-INTEGRATED-001` T03-2 | 首建现场协调职能 | 选择第一处地点及投入上限；批准并调度首建人力、优先级、物资与运输。 | 已批准阶段按到场→清理→工艺研究→实体建设→空流程测试→试产→验收生产推进。 | 使用冻结的人力、普通零件、工程构件、合金料、精密部件、运输和白昼；不足则按既有暂停规则保留阶段、在途/现场/总部物资及进度。 | `none`。L3：首建阶段每次仅写新发生的现场事实。 |
| `M0E-MAIN-006-FIRST-STABLE` | `SPEC-M0-PROGRESSION-001` §标准工程包；`SPEC-M0-INTEGRATED-001` T03-3；`SPEC-M0-PLAY-001` §7 | 验收与回运职能 | 验收第一座前哨；决定是否在其稳定后批准第二处前置。 | 稳定前哨按既有生产、运输和总部卸货规则回运；首建经验形成工程包。 | 试产、验收回运、稳定有效批严格区分；稳定供给失效时按正常状态暂停/恢复，不消除工程包或损失。 | `none`。L3：首次稳定与实际回运事实；不写工程包版本或效率数值。 |
| `M0E-MAIN-007-SECOND-COPY` | `SPEC-M0-PLAY-001` §5、§7；`SPEC-M0-PROGRESSION-001` T03-2；`SPEC-M0-INTEGRATED-001` T03-2 | 总部项目调度职能 | 选择第二处地点；批准优先级与投入上限。 | 在批准边界内按复制链自动完成到场、清理、现场核对、建设、测试、试产和验收；不重复通用工艺研究。 | 仍消耗真实人力、物资、白昼、路线和运输；触底自动暂停，原因由实际状态显示，玩家可调整已有优先级、投入和供应。 | `none`。L3：开工/暂停/建成事实；重复建成仅一句结果。 |
| `M0E-MAIN-008-OBSERVATION` | `SPEC-M0-PLAY-001` §7.1、§8；`SPEC-M0-INTEGRATED-001` §8；`D-M0-PROD-022` | 无说话者；系统事实记录 | 无；玩家可正常调整既有优先级、底线与人力。 | 自动科研、物流、库存、维护、前哨生产和存档状态持续结算。 | 第二座两次有效回运、自动科研、生命线安全/恢复、重载一致性共同构成观察完成；第90日未达成继续运行。 | `none`。L3：第1日/当前对比、已形成能力、下一扩张目标。 |

## 临时事件结构

| ID | 引用的冻结规格 / 状态 | speaker_role | 玩家实际决定 | 自动推进部分 | 后果 / 恢复 | 反转机制 / L3 槽位 |
|---|---|---|---|---|---|---|
| `M0E-INCIDENT-001-PIPE` | `SPEC-M0-OPS-001` §9.2、§9.3；`SPEC-M0-INTEGRATED-001` §7.2；`SPEC-M0-DESCRIPTION-001` §事故时间线 | 供水处置职能 | 使用已有维修人力、优先级、储备与既有绕行管线的任意组合。 | 老化且在用的主管道只有在真实健康/维护条件满足时进入候选；破裂时间随机。 | 改变既有入水、维修工作、库存和人口结算；修复或隔离后自然结束，损失保留。 | `none`。L3：发生、开始处理、状态变化、结束；不指定解法，不写“通过”。 |
| `M0E-INCIDENT-002-FOOD-ROUTE` | `SPEC-M0-INTEGRATED-001` §7.2“食物路线事故”；`SPEC-M0-OPS-001` §9.2 | 食物物流处置职能 | 以既有维修、人力、替代路线、库存和优先级调配处理。 | 仅在危险食物路线真实连接时进入候选；故障时该路线流入按冻结规则变化。 | 路线修复或其他真实原因消失即结束；食物库存、停工或人口后果连续保留。 | `none`。L3：中断、处理、结束的事实时间线；不绑定任何主线节点或观察期。 |
| `M0E-INCIDENT-003-MAINTENANCE-BACKLOG` | `SPEC-M0-OPS-001` §维护/零件循环、§9.2；`SPEC-M0-DESCRIPTION-001` §8.2“维护积压已经影响设施按事故处理” | 维护值守职能 | 调整维护人力、零件底线、设施优先级，或暂停扩张项目。 | 积压、设施健康与实际维护状态持续结算；仅在真实风险存在时成为事故候选。 | 只能影响既有设施产能、流入或维护状态；恢复维护或消除故障原因后自然结束，积压和损失保留。 | `none`。L3：受影响设施、当前事实、恢复事实；不得新增故障、伤亡或事件专用失败规则。 |

## 自查表

| 检查项 | 结果 |
|---|---|
| 四份此前未完整读取的规格已从第1行至EOF读取 | 通过 |
| 每项列出冻结规格/决定/状态 | 通过 |
| 每项含玩家实际决定、自动推进、稳定 `speaker_role`、反转字段 | 通过 |
| 水务材料投入有冻结依据 | 通过，改引 `SPEC-M0-INTEGRATED-001` T03-2 |
| 精密工坊材料投入有冻结依据 | 通过，改引 `T03-1` |
| 无人机“维护不足/路线条件不满足暂停” | 已删除；无对应冻结依据 |
| 食物路线事故 | 有冻结依据 |
| 维护积压事件 | 作为真实设施/积压风险事故，依据已列；不新增独立事故机制 |
| 事故不绑定主线或观察期、不指定唯一解法 | 通过 |
| 新资源、科技、地点、公式、奖励、失败规则、最终正文或代码 | 未新增 |

## 第一层复核记录

- 首次交付被退回：四份冻结规格只做了关键词或标题扫描，却声明为全文读取；部分资源投入、无人机暂停条件与事故候选缺少明确依据。
- 修订交付已从第 1 行读到 EOF，补齐每项的冻结来源、玩家决定、自动推进、`speaker_role`、反转机制和第三层槽位；无依据的无人机暂停条件已删除。
- 第一层判断：结构与边界达到用户 review 条件；第三层在整体接受和 Git 同步前继续 `blocked_upstream`。
- 用户在 `M0-S003-U107` 认可八节点主线作为 M0 骨架，形成 `D-M0-PROD-047`。这是第一项分项接受，不等于 `M0-L2-201` 整体 accepted。
- 用户同时明确：M0 整体验收后必须继续扩增内容，食物等生活与资源内容不能停留在 M0 的最低运行循环。
- 用户在 `M0-S003-U108` 接受三个临时事故，形成 `D-M0-PROD-048`。维护积压只有落实到具体受影响设施时才成为事故，不能凭空生成一张事件卡。
- 用户在 `M0-S003-U109` 接受第三层交接边界，形成 `D-M0-PROD-049`。三项均已分项接受，但 `M0-L2-201` 仍等待单独的整体接受。
- 用户在 `M0-S003-U110` 整体接受 `M0-L2-201`，允许提交推送记录并开始 `M0-L3-301`，形成 `D-M0-PROD-050`。
- 阻塞：无。
- 未完成项：无；由第一层同步 accepted 记录后创建第三层任务。
