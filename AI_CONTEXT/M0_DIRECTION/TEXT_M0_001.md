---
output_id: TEXT-M0-001
task_id: M0-L3-301
status: accepted_with_blocked_fields
source_thread: 01a03845-90a7-7c73-95e6-f48796358313
source_model: gpt-5.6-sol
reasoning_effort: medium
source_commit: c90d0920e26c3345630188dc697f78c3a2f4f278
source_read_receipt: FULL_READ
reviewed_by: M0-L1-DIRECTION
reviewed_at: 2026-08-25T18:00:39+08:00
user_acceptance: m0_scope
accepted_sections:
  - M0TXT-MAIN-001-WATER-START
  - M0TXT-MAIN-001-WATER-DONE
  - M0TXT-MAIN-002-PRECISION-RESEARCH
  - M0TXT-MAIN-003-WORKSHOP-START
  - M0TXT-MAIN-003-WORKSHOP-DONE
  - M0TXT-MAIN-004-DRONE-DEPLOYED
  - TEXT-M0-STORY-001
  - M0E-MAIN-006-NO-PLAYER-TEXT
  - M0TXT-MAIN-007-SECOND-START
  - M0TXT-MAIN-007-SECOND-DONE
  - M0E-INCIDENT-001-PIPE
  - M0TXT-COMMON-ACTIONS-AND-STATES
superseded_sections:
  - M0E-MAIN-005-FIRST-OUTPOST
  - M0E-MAIN-006-FIRST-STABLE
  - M0TXT-MAIN-008-DAY90-CONTINUE
static_reconcile: accepted
implementation_authorized: false
---

# TEXT-M0-001 · 玩家可见文字包

这是 `M0-L3-301` 的静态文字底稿。首座工厂正文由 `TEXT_M0_STORY_001.md` 取代；其余静态文字经 `M0-L3-301-R5` 收口。所有 `BLOCKED_FIELD` 继续等待真实字段，本文件不构成第四层接入授权。

## source_read_receipt

```yaml
result: FULL_READ
fixed_commit: c90d0920e26c3345630188dc697f78c3a2f4f278
source_bundle_revision: 6
summary_not_authoritative: true

full_file_to_eof:
  - path: AGENTS.md
    lines: 82
    sha256: 84005c7dad57897254cb446a9283ac661c2a284b7311fc84e459c4c3418a6b4c
  - path: AI_CONTEXT/M0_DIRECTION/WORKFLOW_BOOTSTRAP.md
    lines: 104
    sha256: 40230debd51d78b8fbfd14c8ef7cdc1fd03ab64dabfc8107b8f109ddde3be584
  - path: AI_CONTEXT/M0_DIRECTION/NEXT_ACTION.md
    lines: 170
    sha256: 26838797b3c01d5d687ffe79596ce19e62a185580f9469d3d14af51d60b7728e
  - path: AI_CONTEXT/M0_DIRECTION/SESSION_ROUTING.md
    lines: 108
    sha256: e4acfd3f1b42a5cf35504300c74af0f08774b8f7720d874c906a44d4bbf42c05
  - path: AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md
    lines: 160
    sha256: 1d0734da554432a345cc45e72dd840a8c23cbfc7ec4805bbe1b5236b697eec19
  - path: AI_CONTEXT/M0_DIRECTION/roles/l3-player-text.md
    lines: 37
    sha256: f13390ff96003d94dbf78e931acbd64aff27fa5440b870141a4e019bb5e3150b
  - path: AI_CONTEXT/M0_DIRECTION/PLAIN_LANGUAGE_RULES.md
    lines: 92
    sha256: 6eb279ff5ba1dcaac370caaecd6f97c9acd60fb113b3b73b42bfe71b2f2b6301
  - path: AI_CONTEXT/M0_DIRECTION/CONTENT_M0_001.md
    lines: 101
    sha256: aa312436b70f058e8b270e089baeeed070669b754409ecf8ed972e880d995cfe
  - path: AI_CONTEXT/M0_DIRECTION/specs/spec-m0-description-001.md
    lines: 866
    ranges_read: [1-300, 301-600, 601-866]
    sha256: bdcbc39db0b9024b5b7682d042352d8f28c9089796d52aea8d99d9c3ac41d052
  - path: AI_CONTEXT/M0_DIRECTION/AUDIT_M0_TECH_001.md
    lines: 56
    sha256: 510db99e6c480ffe9f7cfca1b77382dc3be5e0cf43cd3fe05bccb903a9c2c6bf
  - path: AI_CONTEXT/M0_DIRECTION/references/reference-m0-tech-description-corpus-001.md
    lines: 1296
    ranges_read: [1-325, 326-650, 651-975, 976-1296]
    sha256: 8b21fb1448e2ff93b0707da9c9f917653adfa7ba480b58a9355cad28ae2113df
    retained_scope:
      - 15项群星忠实转述
      - 13项环日文明现有语料
      - 用户逐字判断
      - revision 1-5
      - 全部正反例与接受状态
      - A175初案
      - A176参考
      - U073逐字修正
      - A177接受稿

selected_section_read:
  - path: AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md
    full_file_lines: 241
    section: M0-L3-301
    lines: 171-182
    sha256: f00af31ccd301fdf863ccbdde31fed839f6341d9f9b1018ae1560cc013cb8c24
```

## 一、八个主线节点

### M0E-MAIN-001-WATER

#### `M0TXT-MAIN-001-WATER-START`

- 对应内容 ID：`M0E-MAIN-001-WATER`
- 使用位置：水务修复首次开始；建设记录
- 动态变量及来源：无；固定事实来自 `CONTENT-M0-001`
- 长度上限：直接效果 18 字；正式正文 32 字
- 直接效果：`水务修复已经开始。`
- 正式正文：`总部供水设施开始修复。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：只写修复开始；未添加现场人员、设备形态、材料或进度解释。

#### `M0TXT-MAIN-001-WATER-DONE`

- 对应内容 ID：`M0E-MAIN-001-WATER`
- 使用位置：修复完成通知、建设记录
- 动态变量及来源：无
- 长度上限：直接效果 18 字；正式正文 36 字
- 直接效果：`正常供水已经恢复。`
- 正式正文：`总部供水设施修复完成，正常供水恢复。`
- 重复日志：`供水修复完成。`
- 强度：完全严肃
- 风格自检：只写完成事实；没有挑战、奖励、储备或后台账本说明。

### M0E-MAIN-002-PRECISION-RESEARCH

> 验收状态：用户在 `M0-S003-U112` 接受第一项；本科技卡的名称、直接效果和两段正文逐字冻结。决定：`D-M0-PROD-051`。

#### `M0TXT-MAIN-002-PRECISION-RESEARCH`

- 对应内容 ID：`M0E-MAIN-002-PRECISION-RESEARCH`
- 使用位置：科技卡名称、直接效果、悬停正文、完成日志
- 动态变量及来源：无；名称和正文来自 `SPEC-M0-DESCRIPTION-001` 6.5/6.6、`D-M0-PROD-038`、revision 6 源包 0.2
- 长度上限：名称 12 字；直接效果 20 字；正式正文 110 字
- 名称：`恢复精密制造`
- 直接效果：`解锁工程：精密工坊恢复。`
- 正式正文：

  `统一的精度标准让复杂零件能够稳定复制，机器从此不再是少数工匠手中无法复刻的孤品。`

  `“精密制造最伟大的进步，是终于能把工人的经验从工人身上剥离出来。”——生产恢复委员会`

- 重复日志：`not_applicable`
- 强度：中度
- 风格自检：逐字恢复 accepted 原文；署名、语序、引号均未改写；“生产恢复委员会”属于既有 accepted 正式事实，不是本任务新增机构。

### M0E-MAIN-003-PRECISION-WORKSHOP

#### `M0TXT-MAIN-003-WORKSHOP-START`

- 对应内容 ID：`M0E-MAIN-003-PRECISION-WORKSHOP`
- 使用位置：精密工坊修复首次开始；建设记录
- 动态变量及来源：无
- 长度上限：直接效果 20 字；正式正文 32 字
- 直接效果：`精密工坊开始修复。`
- 正式正文：`精密工坊修复已经开始。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：删除未冻结的现场人员与动作；没有工时、材料或预计。

#### `M0TXT-MAIN-003-WORKSHOP-DONE`

- 对应内容 ID：`M0E-MAIN-003-PRECISION-WORKSHOP`
- 使用位置：工程完成通知、建设记录
- 动态变量及来源：无
- 长度上限：直接效果 20 字；正式正文 55 字
- 直接效果：`精密工坊恢复运行。`
- 正式正文：`精密工坊修复完成，已经能够进行精密加工和独立试制。`
- 重复日志：`精密工坊修复完成。`
- 强度：完全严肃
- 风格自检：只写 `CONTENT-M0-001` 冻结的恢复能力；不写产能快照或后续预计。

### M0E-MAIN-004-DRONE-SURVEY

#### `M0TXT-MAIN-004-DRONE-DEPLOYED`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：无人机制造与部署完成记录
- 动态变量及来源：无
- 长度上限：直接效果 22 字；正式正文 28 字
- 直接效果：`勘测无人机已经投入使用。`
- 正式正文：`勘测无人机已经投入使用。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：删除后续流程说明；未声称已经取得任何地理、路线或风险结果。

#### `M0TXT-MAIN-004-DIRECTION-FACT`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：方向线索首次确认记录
- 动态变量及来源：`{{direction_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有 M0 勘测方向事实字段
- 责任层：第四层代码审计/实现
- 长度上限：直接效果 24 字；正式正文 70 字
- 直接效果：`新的勘测方向已经确认。`
- 正式正文：`{{direction_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不编造方向、地名或距离；字段存在前不得接入。

#### `M0TXT-MAIN-004-RANGE-FACT`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：勘测范围首次确认记录
- 动态变量及来源：`{{survey_area_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有 M0 勘测范围事实字段
- 责任层：第四层
- 长度上限：直接效果 24 字；正式正文 70 字
- 直接效果：`勘测范围已经确认。`
- 正式正文：`{{survey_area_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：禁止用“一格”、虚构公里数或“某地”补洞。

#### `M0TXT-MAIN-004-ROUTE-FACT`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：路线首次确认记录
- 动态变量及来源：`{{route_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有 M0 真实路线事实字段
- 责任层：第四层
- 长度上限：直接效果 24 字；正式正文 70 字
- 直接效果：`可行路线已经确认。`
- 正式正文：`{{route_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不暴露路径点、路线段、坐标或内部状态。

#### `M0TXT-MAIN-004-RISK-FACT`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：现场风险首次确认记录
- 动态变量及来源：`{{risk_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有 M0 真实风险事实字段
- 责任层：第四层
- 长度上限：直接效果 24 字；正式正文 70 字
- 直接效果：`现场风险已经确认。`
- 正式正文：`{{risk_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不新增危险、伤亡、设施或事故结果。

### M0E-MAIN-005-FIRST-OUTPOST

原七条短提示已经删除，不得实现。首建玩家正文统一使用 `TEXT_M0_STORY_001.md`；底层工程阶段仍可用于进度计算，但不再各自弹出一条重复说明。

### M0E-MAIN-006-FIRST-STABLE

不生成独立通知、正文或历史日志，也不提供玩家验收按钮。真实条件满足后由系统自动完成状态变化；首建故事结尾和资产状态已经承担玩家反馈。

### M0E-MAIN-007-SECOND-COPY

#### `M0TXT-MAIN-007-SECOND-START`

- 对应内容 ID：`M0E-MAIN-007-SECOND-COPY`
- 使用位置：第二处建设开始记录
- 动态变量及来源：无
- 长度上限：直接效果 24 字；正式正文 24 字
- 直接效果：`第二工程构件回收整备厂开始建设。`
- 正式正文：`第二工程构件回收整备厂开始建设。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：删除“按现有批准继续推进”等机制自述；不复述复制链。

#### `M0TXT-MAIN-007-SECOND-DONE`

- 对应内容 ID：`M0E-MAIN-007-SECOND-COPY`
- 使用位置：重复工程完成日志、完成通知
- 动态变量及来源：无
- 长度上限：直接效果 24 字；正式正文 24 字
- 直接效果：`第二工程构件回收整备厂建成。`
- 正式正文：`第二工程构件回收整备厂建成。`
- 重复日志：`第二工程构件回收整备厂建成。`
- 强度：完全严肃；不参与 `5:4:1`
- 风格自检：严格一句建成事实；无版本、差异、耗时或账本解释。

### M0E-MAIN-008-OBSERVATION

第90日本身不生成独立通知。只有下方真实总结字段齐全时才允许显示观察总结；不能用“第90日已经过去”代替内容。

#### `M0TXT-MAIN-008-COMPLETE`

- 对应内容 ID：`M0E-MAIN-008-OBSERVATION`
- 使用位置：观察完成总结
- 动态变量及来源：`{{day1_facts}}`、`{{current_facts}}`、`{{formed_capabilities}}`、`{{next_expansion_target}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：`AUDIT-M0-TECH-001` 确认当前没有 M0 开局/当前对比、能力汇总或下一扩张目标字段
- 责任层：第一层确认下一目标语义；第四层提供真实字段
- 长度上限：直接效果 24 字；正式正文 180 字
- 直接效果：`当前观察记录已经完成。`
- 正式正文：`{{day1_facts}} {{current_facts}} {{formed_capabilities}} {{next_expansion_target}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：字段存在前不得接入；禁止假数值、空名称、自拟能力或自拟扩张目标。

## 二、三个临时事故

### M0E-INCIDENT-001-PIPE

#### `M0TXT-INCIDENT-001-PIPE-START`

- 对应内容 ID：`M0E-INCIDENT-001-PIPE`
- 使用位置：事故发生通知、日志首条
- 动态变量及来源：无
- 长度上限：直接效果 18 字；正式正文 18 字
- 直接效果：`总部主管道发生大泄漏。`
- 正式正文：`总部主管道发生大泄漏。`
- 重复日志：`not_applicable`
- 强度：完全严肃；不参与 `5:4:1`
- 风格自检：保持 accepted 原句；事故发生时只主动通知一次。

#### `M0TXT-INCIDENT-001-PIPE-HANDLING`

- 对应内容 ID：`M0E-INCIDENT-001-PIPE`
- 使用位置：事故开始处理日志
- 动态变量及来源：无
- 长度上限：直接效果 24 字；正式正文 70 字
- 直接效果：`受损管段已经关闭。`
- 正式正文：`主管道接缝突然破裂，供水压力迅速下降。供水部门已经关闭受损管段并开始抢修。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：保持 accepted 原句；没有指定唯一解法或解释库存兜底。

#### `M0TXT-INCIDENT-001-PIPE-CHANGED`

- 对应内容 ID：`M0E-INCIDENT-001-PIPE`
- 使用位置：事故状态变化日志
- 动态变量及来源：无
- 长度上限：直接效果 24 字；正式正文 32 字
- 直接效果：`受损管段已经隔离。`
- 正式正文：`受损管段已经隔离，泄漏仍在继续。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：保持 accepted 原句；只写新增事实，不再次主动通知。

#### `M0TXT-INCIDENT-001-PIPE-END`

- 对应内容 ID：`M0E-INCIDENT-001-PIPE`
- 使用位置：事故结束日志；原通知改为已解决
- 动态变量及来源：无
- 长度上限：直接效果 22 字；正式正文 32 字
- 直接效果：`主管道修复完成。`
- 正式正文：`主管道修复完成，正常供水恢复。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：保持 accepted 原句；无挑战通过、评分、奖励或消耗说明。

### M0E-INCIDENT-002-FOOD-ROUTE

#### `M0TXT-INCIDENT-002-FOOD-START`

- 对应内容 ID：`M0E-INCIDENT-002-FOOD-ROUTE`
- 使用位置：食物路线中断通知、日志
- 动态变量及来源：`{{route_name}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有真实受影响路线名称
- 责任层：第四层
- 长度上限：直接效果 28 字；正式正文 42 字
- 直接效果：`{{route_name}}的食物流入中断。`
- 正式正文：`{{route_name}}发生故障，食物流入已经中断。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不得用“某条路线”、假名称或空值补洞。

#### `M0TXT-INCIDENT-002-FOOD-HANDLING`

- 对应内容 ID：`M0E-INCIDENT-002-FOOD-ROUTE`
- 使用位置：处理开始或状态变化日志
- 动态变量及来源：`{{route_name}}`、`{{handling_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有真实路线名称和实际处理事实
- 责任层：第四层
- 长度上限：直接效果 28 字；正式正文 65 字
- 直接效果：`{{route_name}}的故障正在处理。`
- 正式正文：`{{handling_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不擅自指定维修、替代路线、库存或人力为实际处理结果。

#### `M0TXT-INCIDENT-002-FOOD-END`

- 对应内容 ID：`M0E-INCIDENT-002-FOOD-ROUTE`
- 使用位置：事故结束日志；原通知改为已解决
- 动态变量及来源：`{{route_name}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有真实路线名称
- 责任层：第四层
- 长度上限：直接效果 28 字；正式正文 42 字
- 直接效果：`{{route_name}}恢复通行。`
- 正式正文：`{{route_name}}的故障已经排除，食物流入恢复。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：库存、停工和人口后果继续由真实状态保留；不写挑战通过。

### M0E-INCIDENT-003-MAINTENANCE-BACKLOG

#### `M0TXT-INCIDENT-003-MAINTENANCE-START`

- 对应内容 ID：`M0E-INCIDENT-003-MAINTENANCE-BACKLOG`
- 使用位置：维护积压开始影响具体设施时的通知、日志
- 动态变量及来源：`{{facility_name}}`、`{{impact_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有 M0 设施真实名称及维护影响字段
- 责任层：第四层
- 长度上限：直接效果 30 字；正式正文 70 字
- 直接效果：`维护积压已经影响{{facility_name}}。`
- 正式正文：`{{facility_name}}受到维护积压影响。{{impact_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：必须落实到具体设施；不得凭空生成故障、伤亡或产能变化。

#### `M0TXT-INCIDENT-003-MAINTENANCE-HANDLING`

- 对应内容 ID：`M0E-INCIDENT-003-MAINTENANCE-BACKLOG`
- 使用位置：事故处理状态日志
- 动态变量及来源：`{{facility_name}}`、`{{handling_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有具体设施和实际处理事实
- 责任层：第四层
- 长度上限：直接效果 30 字；正式正文 70 字
- 直接效果：`{{facility_name}}的维护正在处理。`
- 正式正文：`{{handling_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不提前宣告维护恢复；不自行声称调人、补件或暂停扩张已经发生。

#### `M0TXT-INCIDENT-003-MAINTENANCE-END`

- 对应内容 ID：`M0E-INCIDENT-003-MAINTENANCE-BACKLOG`
- 使用位置：影响结束日志；原通知改为已解决
- 动态变量及来源：`{{facility_name}}`、`{{recovery_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前代码没有具体设施恢复事实
- 责任层：第四层
- 长度上限：直接效果 30 字；正式正文 70 字
- 直接效果：`{{facility_name}}恢复正常运行。`
- 正式正文：`{{recovery_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：只有本结束条目允许宣告恢复；积压与既有损失不被文案清零。

## 三、共用动作和状态

| 字符串 ID | 对应内容 ID | 使用位置 | 动态变量及来源 | 长度上限 | 直接效果 | 正式正文 | 重复日志 | 强度与自检 |
|---|---|---|---|---:|---|---|---|---|
| `M0TXT-ACTION-WATER-PRIORITY` | `M0E-MAIN-001-WATER` | 水务操作 | 无 | 10字 | `调整修复优先级` | `not_applicable` | `not_applicable` | 严肃；不承诺结果 |
| `M0TXT-ACTION-RESEARCH-FOCUS` | `M0E-MAIN-002-PRECISION-RESEARCH` | 科研操作 | 无 | 10字 | `设为重点目标` | `not_applicable` | `not_applicable` | 严肃；不新增科研状态 |
| `M0TXT-ACTION-WORKSHOP-APPROVE` | `M0E-MAIN-003-PRECISION-WORKSHOP` | 工程批准 | 无 | 10字 | `批准修复工坊` | `not_applicable` | `not_applicable` | 严肃；不写预计 |
| `M0TXT-ACTION-DRONE-APPROVE` | `M0E-MAIN-004-DRONE-SURVEY` | 无人机项目批准 | 无 | 12字 | `批准制造与部署` | `not_applicable` | `not_applicable` | 严肃；不保证一次勘明 |
| `M0TXT-ACTION-OUTPOST-APPROVE` | `M0E-MAIN-005-FIRST-OUTPOST` | 首建批准 | 无 | 6字 | `批准建设` | `not_applicable` | `not_applicable` | 严肃；资产名称由页面标题提供 |
| `M0TXT-ACTION-SECOND-APPROVE` | `M0E-MAIN-007-SECOND-COPY` | 第二处批准 | 无 | 6字 | `批准建设` | `not_applicable` | `not_applicable` | 严肃；资产名称由页面标题提供 |
| `M0TXT-ACTION-PEOPLE` | 工程与科研共用 | 人力操作 | 无 | 10字 | `调整投入人力` | `not_applicable` | `not_applicable` | 严肃；实际人数由界面字段显示 |
| `M0TXT-ACTION-RESERVE` | 工程共用 | 物资操作 | 无 | 10字 | `调整物资预留` | `not_applicable` | `not_applicable` | 严肃；不写库存账本 |
| `M0TXT-STATE-UNRESEARCHED` | `M0E-MAIN-002-PRECISION-RESEARCH` | 科技状态 | 无 | 4字 | `未研发` | `not_applicable` | `not_applicable` | 冻结二态之一 |
| `M0TXT-STATE-RESEARCHED` | `M0E-MAIN-002-PRECISION-RESEARCH` | 科技状态 | 无 | 4字 | `已研发` | `not_applicable` | `not_applicable` | 冻结二态之一 |
| `M0TXT-STATE-BUILDING` | 工程主线共用 | 工程状态 | 无 | 4字 | `在建` | `not_applicable` | `not_applicable` | 冻结二态之一 |
| `M0TXT-STATE-BUILT` | 工程主线共用 | 工程状态 | 无 | 4字 | `已建成` | `not_applicable` | `not_applicable` | 冻结二态之一 |

## 四、共用停滞原因

这些文本均依赖第四层尚未实现的真实字段，因此属于已完成文案模板，但不是当前可接入成品。

### `M0TXT-BLOCK-PEOPLE`

- 对应内容 ID：所有允许因人力不足暂停的科研/工程主线
- 使用位置：对象原页面的当前停滞原因
- 动态变量及来源：`{{actual_pause_reason}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前没有 M0 真实暂停原因字段
- 责任层：第四层
- 长度上限：直接效果 18 字；正式正文 55 字
- 直接效果：`当前可用人手不足。`
- 正式正文：`当前可用人手不足。增加该项工作的人力后即可继续。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：只能在真实原因确为人力不足时显示；不写假人数。

### `M0TXT-BLOCK-MATERIAL`

- 对应内容 ID：所有允许因缺料暂停的工程主线
- 使用位置：对象原页面的当前停滞原因
- 动态变量及来源：`{{missing_material_name}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前没有 M0 缺料原因及真实材料名称字段
- 责任层：第四层
- 长度上限：直接效果 22 字；正式正文 60 字
- 直接效果：`缺少{{missing_material_name}}。`
- 正式正文：`当前缺少{{missing_material_name}}。恢复供应后即可继续。`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：禁止空名称、零值或猜测材料。

### `M0TXT-BLOCK-PRIORITY`

- 对应内容 ID：允许因优先级或供应顺序停止的主线项目
- 使用位置：对象原页面的当前停滞原因
- 动态变量及来源：`{{priority_pause_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前没有 M0 优先级停滞事实字段
- 责任层：第四层
- 长度上限：直接效果 22 字；正式正文 60 字
- 直接效果：`当前投入已转向其他工作。`
- 正式正文：`{{priority_pause_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不得仅凭队列位置推断原因；只能绑定真实停滞事实。

### `M0TXT-BLOCK-SURVEY-LIMIT`

- 对应内容 ID：`M0E-MAIN-004-DRONE-SURVEY`
- 使用位置：勘测暂停原因
- 动态变量及来源：`{{survey_limit_fact}}`
- 字段状态：`BLOCKED_FIELD`
- 缺失来源：当前没有 M0 真实风险或投入上限字段
- 责任层：第四层
- 长度上限：直接效果 22 字；正式正文 60 字
- 直接效果：`本次勘测已经暂停。`
- 正式正文：`{{survey_limit_fact}}`
- 重复日志：`not_applicable`
- 强度：完全严肃
- 风格自检：不重新加入已删除的“维护不足或路线条件不满足”断言。

## 五、检查结果

| 检查项 | 结果 |
|---|---|
| 主线覆盖 | 通过：8/8 |
| 临时事故覆盖 | 通过：3/3 |
| 首建七个历史节点 | 通过：7/7；每条一至两句，只写冻结事实 |
| accepted 科技原文 | 通过：名称、两段正文、署名、语序和引号逐字恢复 |
| 无依据现场事实 | 通过：已删除旧基础显露、连续运行未中断、后续勘测解释、按批准推进等内容 |
| 玩家机制语言 | 通过：第90日条目改为世界事实；正文未出现观察条件、当前运行继续、进入阶段等系统自述 |
| 维护事故阶段 | 通过：处理条目不宣告恢复；只有结束条目允许写恢复正常 |
| 主管道四段 | 通过：继续使用 accepted 原句 |
| 重复工程 | 通过：第二座正常建成只写一句 |
| 术语 | 通过：未出现格点、坐标、内部 ID、工程包版本、路线段、工作量、预计耗时、存档字段、公式或后台账本 |
| 新增事实 | 通过：未新增人物、地点、机构、科技、资源、伤亡、制度、奖励、失败条件或事故结果 |
| 动态变量 | 有条件通过：全部真实缺口继续标为 `BLOCKED_FIELD`；没有假名称、零值或默认值 |
| 强度 | 通过：当前只有《恢复精密制造》中度；其余严肃；无重度；不为 M0 机械凑 `5:4:1` |
| 长度 | 通过：科技正文两段；首建节点不超过两句；重复建成一句；事故变化一至两句 |
| 接入边界 | 通过：第四层未实现的字段未冒充当前可接入成品 |
| 范围 | 通过：第三层未修改仓库，未推进第四层 |

## 六、缺失与歧义清单

1. `M0E-MAIN-004-DRONE-SURVEY`

   缺少方向、范围、路线、风险和暂停原因的真实字段。责任层：第四层。影响 `M0TXT-MAIN-004-DIRECTION-FACT` 至 `RISK-FACT` 及 `M0TXT-BLOCK-SURVEY-LIMIT`。

2. `M0E-MAIN-008-OBSERVATION`

   缺少第1日事实、当前事实、已形成能力和下一扩张目标字段；下一目标语义还需第一层确认。影响 `M0TXT-MAIN-008-COMPLETE`。

3. `M0E-INCIDENT-002-FOOD-ROUTE`

   缺少真实路线名称及实际处理事实。责任层：第四层。影响三个食物路线事故字符串。

4. `M0E-INCIDENT-003-MAINTENANCE-BACKLOG`

   缺少具体受影响设施名称、影响、处理与恢复事实。责任层：第四层。影响三个维护事故字符串。

5. 共用停滞原因

   当前代码没有 M0 暂停原因、缺失材料名称、优先级停滞和勘测上限字段。责任层：第四层。

6. 文字层歧义

   无。《恢复精密制造》以 `D-M0-PROD-038` accepted 原文为最高优先级；不再把功能身份边界解释为可改写 accepted 署名。

## 七、建议第一层分批给用户验收

1. 第一批逐条验收：《恢复精密制造》完整科技卡文字。
2. 第二批逐条验收：首建七节点、首次稳定供给、第二座开始与一句建成。
3. 第三批逐条验收：主管道四段，以及食物路线、维护积压的字段化模板。
4. 第四批抽查：水务、工坊、无人机固定文字、按钮、二态标签和停滞原因。
5. 字段补齐后另行逐条复核：无人机四类事实、观察完成总结、食物路线名称和具体受影响设施；不得随无变量文本默认为 accepted。

## 八、第三层最终 Git 证据

```text
HEAD:
c90d0920e26c3345630188dc697f78c3a2f4f278

git status --porcelain=v1:
<empty>

git status --short --branch:
## HEAD (no branch)
```

未完成项：仅上述 `BLOCKED_FIELD` 动态字段，均已标出责任层。
整体阻塞：无 `BLOCKED_SOURCE`；无变量文字可进入第一层复核。
下一任务：未推进；等待第一层和用户复核 `TEXT-M0-001`。
