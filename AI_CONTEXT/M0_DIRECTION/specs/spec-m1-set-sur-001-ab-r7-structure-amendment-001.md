---
spec_id: SPEC-M1-SET-SUR-001-AB-R7-STRUCTURE-AMENDMENT-001
title: SET-SUR-001-A/B科技身份与关系修正
status: approved_for_r7_text_generation
date: 2026-08-28
owner: M0-DIR-A
source_task: M1-L1-517
authorized_by: M0-S004-U064
revises_for_r7:
  - TECH_TREE_M1_PLAYER_LEAN_R6_001.json#SET-SUR-001-A
  - TECH_TREE_M1_PLAYER_LEAN_R6_001.json#SET-SUR-001-B
implementation_authorized: false
---

# SET-SUR-001-A/B科技身份与关系修正

## 1. 裁决

`SET-SUR-001-A`与`SET-SUR-001-B`保留为两个独立科技，但由原来的并列重复关系改为先后关系：

1. A回答“地面上存在哪些危险，危险位于哪里”；
2. B回答“在已知危险的前提下，哪些土地可以居住，哪些需要隔离，哪些禁止进入”。

删掉任何一项都会失去独立里程碑：没有A，B缺少经过勘察的危险事实；没有B，危险记录不能转化为可用于聚居点扩建的居住边界。

## 2. SET-SUR-001-A修正对象

- 稳定ID：`SET-SUR-001-A`
- 名称：`地表危险勘察`
- 类型：发现
- 直接前置：无
- 掌握能力：识别并记录地表污染、积水与冲刷、塌陷或不稳定地面、危险遗构及受阻通行等会直接妨碍人员活动和后续建设的地表危险。
- 独占解锁：
  - 行动：`地表危险勘察行动`
  - 记录：`地表危险勘察记录`
- 实体条件：地图、勘察人员、基础防护和现场标记工具。
- 证明：完成危险位置与范围的现场标记，并由勘察人员复核记录与现场相符。
- 不再解锁：`候选居住区`、`隔离区`、`禁入区`。

## 3. SET-SUR-001-B修正对象

- 稳定ID：`SET-SUR-001-B`
- 名称：`可居住区域划定调查方法`
- 类型：方法
- 直接前置：`SET-SUR-001-A 地表危险勘察`
- 掌握能力：把地表危险记录与供水、排水、通行和既有公共设施条件放进同一套判断，划出可以继续调查和建设的居住用地边界。
- 独占解锁：
  - 行动：`可居住区域划定调查`
  - 记录：`可居住区域划定调查记录`
  - 区域：`候选居住区`
  - 区域：`隔离区`
  - 区域：`禁入区`
- 实体条件：地表危险勘察记录、地图、勘察人员，以及现场可核对的供水、排水、通行和既有公共设施条件。
- 证明：使用同一套标准完成一处区域的候选居住、隔离和禁入划分，并复核至少一条安全进出路线。

科研完成只解锁调查与划定资格，不表示任何具体地点已经完成调查或被划为上述区域。

## 4. 后继关系去重

- 只依赖地表危险事实的资源、土壤、水源、道路、废料和一般建设场址勘察，保留A作为前置，不再同时依赖B。
- 需要形成聚居点居住边界的临时营地、住房与住区规划，依赖B；由于B已经直接依赖A，不再重复列A。
- 后继节点若同时需要危险事实与居住边界，只保留B作为直接前置；A由传递关系满足。

## 5. R7文字边界

- A的正文只能写发现与记录危险，不得写居住区域划定。
- B的正文必须写清“把危险、供排水、通行和既有设施条件合成居住适宜性判断”，但不得逐条复述五项解锁。
- B的第二段选择一个由边界划定必然产生的世界内侧面；不得使用“可交接结果”“未完成无法藏在口头交代里”“相关人员承担后果”等通用模板。
- 当前只生成B的`review_candidate`；A的R7正文仍未生成，本轮不得进入`ELC-SAF-001`。

## 6. 来源回执

```text
source_read_receipt:
- file: AI_CONTEXT/M0_DIRECTION/RESEARCH_ENGINEERING_EDICT_TEXT_RULES_001.md
  range: 1-757, EOF
  sha256: c60faefbd0829082617cc94f44249d44cf03ddf71cfc3b212d02a24468f32870
- file: AI_CONTEXT/M0_DIRECTION/references/reference-m0-tech-description-corpus-001.md
  range: 1-1296, EOF
  sha256: 8b21fb1448e2ff93b0707da9c9f917653adfa7ba480b58a9355cad28ae2113df
- file: AI_CONTEXT/M0_DIRECTION/specs/spec-m1-sequential-tech-text-gate-r7-001.md
  range: 1-201, EOF
  sha256: ed6c4c2a16c97831bcf967b88e986e3fcb5c42bf9580e6888b7310cfeed78350
- file: AI_CONTEXT/M0_DIRECTION/specs/spec-m1-settlement-housing-public-works-system-001.md
  range: 1-64, EOF
  sha256: 32f19290c294b1aa721f8133d93cef58493f5ebda0f14ac3c7d0efdf4369fafb
- object_source: AI_CONTEXT/M0_DIRECTION/TECH_TREE_M1_PLAYER_LEAN_R6_001.json
  range: SET-SUR-001-A与SET-SUR-001-B完整对象、直接科技边及解锁边
```
