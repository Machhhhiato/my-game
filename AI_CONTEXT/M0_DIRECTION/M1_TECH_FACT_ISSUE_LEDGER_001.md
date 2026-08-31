---
document_id: M1-TECH-FACT-ISSUE-LEDGER-001
title: M1科技事实问题账
status: active_waiting_post_tree_review
version: 1
date: 2026-08-29
rule_revision: 24
scope: formal_tree_all_nodes
player_visible: false
implementation_authorized: false
---

# M1科技事实问题账

本账只记录逐项正文审查期间发现的事实与游戏设计问题。玩家不看这些标签；正式科技JSON也不因登记标签自动改变。标签和字段遵守`SPEC-M1-TECH-FACT-ISSUE-LEDGER-AND-POST-REVIEW-001`。

## 已登记项目

### STA-NEG-001

```text
tech_id: STA-NEG-001
current_name: 议程、底线、让步、文本与确认程序
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, OVERDETAILED_GOVERNANCE, WRONG_OUTPUT_TYPE, AUTO_INSTANCE_ERROR
issue_statement: 谈判议题授权文本修订与确认属于常设外交的实际行动，不构成新的玩家科技里程碑；当前并入常设外交联络。
evidence: SPEC-M1-STAGE22-NEGOTIATION-GOVERNANCE-DEMOLITION-LIGHT-TRUCK-TIMBER-BATCH-AMENDMENT-001
related_tech_ids: DIP-STA-001, STA-SOV-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零一项事实审查
resolution_status: waiting_post_tree_review
```

### STA-NET-001

```text
tech_id: STA-NET-001
current_name: 多地方分级治理、跨区协调与中央复核
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, WRONG_OUTPUT_TYPE, REDUNDANT_GOVERNANCE_LAYER, PREREQUISITE_INVALID
issue_statement: 行政分级跨区协调与中央复核已经属于区域行政统合的核心范围；当前并入区域行政统合并删除重复节点。
evidence: SPEC-M1-STAGE22-NEGOTIATION-GOVERNANCE-DEMOLITION-LIGHT-TRUCK-TIMBER-BATCH-AMENDMENT-001
related_tech_ids: GOV-ADM-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零二项事实审查
resolution_status: waiting_post_tree_review
```

### URB-DEM-001

```text
tech_id: URB-DEM-001
current_name: 拆除安全、建筑废物分选与再利用方法
fact_gate: pass_with_tree_review
issue_tags: SCOPE_OVERBROAD, WRONG_OUTPUT_TYPE, AUTO_INSTANCE_ERROR, PREREQUISITE_INVALID
issue_statement: 当前候选改为建筑拆除回收，保留危险建筑受控拆除和源头分流；废钢砖石木料均保持来源与待检状态，不自动成为合格再生构件。
evidence: SPEC-M1-STAGE22-NEGOTIATION-GOVERNANCE-DEMOLITION-LIGHT-TRUCK-TIMBER-BATCH-AMENDMENT-001
related_tech_ids: CNS-STR-001, CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百零三项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-LTR-001

```text
tech_id: VEH-LTR-001
current_name: 轻型卡车底盘、驾驶室与货运平台
fact_gate: pass_with_tree_review
issue_tags: PLACEHOLDER_PRODUCT, PREREQUISITE_OVERCONSTRAINT, MISSING_COMPONENT_CHAIN, LEGACY_TRADE_COMPONENT_LIMIT, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为轻型卡车定型，交付QK-A1型1.5吨轻型载货汽车；变速箱车桥制动轮胎电气附件链未闭合前，只允许合格遗产贸易或已复产总成参与小批量装配。
evidence: SPEC-M1-STAGE22-NEGOTIATION-GOVERNANCE-DEMOLITION-LIGHT-TRUCK-TIMBER-BATCH-AMENDMENT-001
related_tech_ids: VEH-MOT-001, VEH-ENG-001, MCH-FRM-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第四百零四项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-FUR-001-B

```text
tech_id: CIV-FUR-001-B
current_name: 标准木质板材制作
fact_gate: merge_delete
issue_tags: DUPLICATE_PRODUCT_STAGE, PRODUCT_IDENTITY_MISSING, DELETED_PREREQUISITE, MISSING_RESOURCE_CHAIN
issue_statement: 普通定尺实木板已经属于锯材生产，胶合板与层压板又缺PF-W01木胶链；当前节点并入锯材生产与标准家具制作后删除。
evidence: SPEC-M1-STAGE22-NEGOTIATION-GOVERNANCE-DEMOLITION-LIGHT-TRUCK-TIMBER-BATCH-AMENDMENT-001
related_tech_ids: RSC-SAW-001-A, CIV-FUR-001-C, CHM-BND-001-B
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零五项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-BUD-001

```text
tech_id: ECO-BUD-001
current_name: 部门预算、用途、期限与追加修订方法
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, OVERDETAILED_GOVERNANCE, WRONG_OUTPUT_TYPE, AUTO_INSTANCE_ERROR
issue_statement: 部门用途期限追加与修订只是区域预算统筹下的具体行动；当前并入区域预算，外贸报关取消对本项的无关依赖。
evidence: SPEC-M1-STAGE22-BUDGET-MOTOR-FACTORY-EXPANSION-BATCH-AMENDMENT-001
related_tech_ids: GOV-ACC-001, ECO-TRD-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零六项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-MOT-001-B

```text
tech_id: ELC-MOT-001-B
current_name: 电动机装配工艺
fact_gate: pass_with_tree_review
issue_tags: PLACEHOLDER_PRODUCT, MISSING_RESOURCE_CHAIN, CONDITIONAL_PRODUCTION, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为鼠笼电机装配，交付Y90S-4型三相鼠笼异步电动机；漆包铜线电工钢片轴承及绝缘材料链未闭合时，只能使用实际合格库存或贸易批次。
evidence: SPEC-M1-STAGE22-BUDGET-MOTOR-FACTORY-EXPANSION-BATCH-AMENDMENT-001
related_tech_ids: ELC-MOT-001-A, ELC-MOT-001-C, MCH-GAG-001, CHM-INS-001-A
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百零七项事实审查
resolution_status: waiting_post_tree_review
```

### IND-EXP-002

```text
tech_id: IND-EXP-002
current_name: 工厂供电、水热气公用设施扩容设计
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, ENGINEERING_OPTION_AS_TECH, SCOPE_OVERBROAD
issue_statement: 供配电给排水蒸汽燃气与压缩空气扩容是厂房扩建设计下分别立项验收的专业工程模块，不应再占通用科研节点。
evidence: SPEC-M1-STAGE22-BUDGET-MOTOR-FACTORY-EXPANSION-BATCH-AMENDMENT-001
related_tech_ids: IND-EXP-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETAIN_ENGINEERING_MODULES, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零八项事实审查
resolution_status: waiting_post_tree_review
```

### IND-EXP-003

```text
tech_id: IND-EXP-003
current_name: 工厂仓储、装卸与内部物流扩容设计
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, ENGINEERING_OPTION_AS_TECH, AUTO_INSTANCE_ERROR
issue_statement: 仓储装卸内部物流属于厂房扩建设计下分别建设验收的实体模块；当前保留工程对象并删除重复科技。
evidence: SPEC-M1-STAGE22-BUDGET-MOTOR-FACTORY-EXPANSION-BATCH-AMENDMENT-001
related_tech_ids: IND-EXP-001, LOG-WHS-001, LOG-HND-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETAIN_ENGINEERING_MODULES, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百零九项事实审查
resolution_status: waiting_post_tree_review
```

### IND-EXP-004

```text
tech_id: IND-EXP-004
current_name: 工厂消防、危险品与环境控制扩容设计
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, ENGINEERING_OPTION_AS_TECH, CROSS_DOMAIN_BUNDLE, AUTO_INSTANCE_ERROR
issue_statement: 消防危化隔离通风除尘和三废处理必须分别建设验收，但共享厂房扩建设计，不应打包为另一项通用科技。
evidence: SPEC-M1-STAGE22-BUDGET-MOTOR-FACTORY-EXPANSION-BATCH-AMENDMENT-001
related_tech_ids: IND-EXP-001, CHM-NET-001, CNS-FIR-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETAIN_ENGINEERING_MODULES, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百一十项事实审查
resolution_status: waiting_post_tree_review
```

### IND-REF-001

```text
tech_id: IND-REF-001
current_name: 生产单元技术改造与重新定型方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_INVALID, ENGINEERING_RESEARCH_SEPARATION
issue_statement: 当前候选保留既有生产单元的实体改造与重新试生产，区分产品版本改型异地复制日常换产和故障维修。
evidence: SPEC-M1-STAGE22-PRODUCTION-REFIT-FACTORY-DISPATCH-DIGITAL-FEED-BATCH-AMENDMENT-001
related_tech_ids: QLT-CHG-001, IND-SIT-003, IND-CON-001, RPR-DIA-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百一十一项事实审查
resolution_status: waiting_post_tree_review
```

### IND-SIT-004

```text
tech_id: IND-SIT-004
current_name: 标准工厂场址工程设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, REVERSED_DEPENDENCY, AUTO_INSTANCE_ERROR
issue_statement: 当前候选保留首次完整工厂场址设计并删除生产单元复制的倒置前置；场址工程建成且生产单元试产后才形成运行工厂。
evidence: SPEC-M1-STAGE22-PRODUCTION-REFIT-FACTORY-DISPATCH-DIGITAL-FEED-BATCH-AMENDMENT-001
related_tech_ids: IND-SIT-002, IND-EXP-001, IND-SIT-003, IND-SIT-005
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百一十二项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-DSP-001

```text
tech_id: LOG-DSP-001
current_name: 车辆、驾驶员与运输任务连续调度
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, WRONG_OUTPUT_TYPE, FIXED_COUNT_ERROR, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前候选改为运输任务调度，用实际车辆人员路线油料维修状态形成运力池；删除轻型卡车唯一准入门槛。
evidence: SPEC-M1-STAGE22-PRODUCTION-REFIT-FACTORY-DISPATCH-DIGITAL-FEED-BATCH-AMENDMENT-001
related_tech_ids: LOG-HND-001, VEH-LTR-001, LOG-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百一十三项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-CNC-001-A

```text
tech_id: MCH-CNC-001-A
current_name: 数字读数设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, PREREQUISITE_OVERCONSTRAINT, MISSING_ELECTRONICS_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为机床数字读数，交付DS-A1型双轴数显装置；位移传感器和数字显示模块缺本地制造链。
evidence: SPEC-M1-STAGE22-PRODUCTION-REFIT-FACTORY-DISPATCH-DIGITAL-FEED-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, QLT-MET-001, ELC-CMP-001, MCH-CNC-001-B
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百一十四项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-CNC-001-B

```text
tech_id: MCH-CNC-001-B
current_name: 数控进给设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, PREREQUISITE_OVERCONSTRAINT, MISSING_DRIVE_CHAIN, MISSING_PRECISION_SCREW_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为数控进给改造，交付JZ-A1双轴改造包；伺服驱动编码器与精密滚珠丝杠供应未闭合。
evidence: SPEC-M1-STAGE22-PRODUCTION-REFIT-FACTORY-DISPATCH-DIGITAL-FEED-BATCH-AMENDMENT-001
related_tech_ids: MCH-CNC-001-A, ELC-CTL-001-B, MCH-CNC-001-C
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百一十五项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-CNC-001-C

```text
tech_id: MCH-CNC-001-C
current_name: 程序化加工设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, FIXED_COUNT_ERROR, MISSING_CONTROLLER_CHAIN, MISSING_DRIVE_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为程序数控加工，只交付CK-A1控制装置和CA-B1C两轴普通车床改造路线；处理存储控制驱动链未闭合。
evidence: SPEC-M1-STAGE22-PROGRAM-CNC-VALVE-FASTENER-SHAFT-BEARING-BATCH-AMENDMENT-001
related_tech_ids: MCH-CNC-001-A, MCH-CNC-001-B, MCH-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百一十六项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-PMP-001-B

```text
tech_id: MCH-PMP-001-B
current_name: 泵阀制造工艺
fact_gate: pass_with_tree_review
issue_tags: CROSS_PRODUCT_BUNDLE, DUPLICATE_MILESTONE, ABSTRACT_PRODUCT, AUTO_INSTANCE_ERROR
issue_statement: 泵侧与IS-A1离心泵定型重复；当前收窄为工业阀门制造，只保留J41H-16C截止阀和H44H-16C止回阀批量制造。
evidence: SPEC-M1-STAGE22-PROGRAM-CNC-VALVE-FASTENER-SHAFT-BEARING-BATCH-AMENDMENT-001
related_tech_ids: IME-PMP-001, MCH-VLV-001-A, MCH-PMP-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百一十七项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-STD-001-A

```text
tech_id: MCH-STD-001-A
current_name: 紧固件系列制造
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR, DUPLICATE_DOWNSTREAM
issue_statement: 当前候选保留基础紧固件聚合产品，内部按普通螺栓螺母螺钉垫圈三类规格批次生产；后继重复成组生产节点应删除。
evidence: SPEC-M1-STAGE22-PROGRAM-CNC-VALVE-FASTENER-SHAFT-BEARING-BATCH-AMENDMENT-001
related_tech_ids: MCH-GAG-001, Y2-PROD-MCH-002
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_PRODUCT_FAMILY, DELETE_DUPLICATE_DEPENDENT
raised_at: M0正式全树续跑第四百一十八项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-STD-001-B

```text
tech_id: MCH-STD-001-B
current_name: 齿轮与轴类标准制造
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, CROSS_PRODUCT_BUNDLE, PRODUCT_IDENTITY_MISSING
issue_statement: 直齿轮与既有齿轮生产定型重复；当前收窄为轴联件制造，交付CZ-A1传动轴和GY1至GY4刚性联轴器。
evidence: SPEC-M1-STAGE22-PROGRAM-CNC-VALVE-FASTENER-SHAFT-BEARING-BATCH-AMENDMENT-001
related_tech_ids: IME-GER-001, Y2-PROD-MCH-003, MIL-EXT-025
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_MODEL, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百一十九项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-STD-001-C

```text
tech_id: MCH-STD-001-C
current_name: 滚动轴承制造
fact_gate: merge_delete
issue_tags: EXACT_DUPLICATE, DUPLICATE_PRODUCT, DUPLICATE_PROCESS, DUPLICATE_TEST
issue_statement: 6200与30200系列轴承生产检验已经完整落在MCH-BRG-001；当前节点及后继重复规格组均合并删除。
evidence: SPEC-M1-STAGE22-PROGRAM-CNC-VALVE-FASTENER-SHAFT-BEARING-BATCH-AMENDMENT-001
related_tech_ids: MCH-BRG-001, Y2-PROD-MCH-004
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, DELETE_DUPLICATE_DEPENDENT, REBALANCE_COST
raised_at: M0正式全树续跑第四百二十项事实审查
resolution_status: waiting_post_tree_review
```

### MED-DEV-001-A

```text
tech_id: MED-DEV-001-A
current_name: 基础诊疗器械制造
fact_gate: split
issue_tags: OVER_AGGREGATED_PRODUCT, DISTINCT_QUALITY_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 诊疗器械依赖压力校准，手术器械依赖器械钢热处理刃口和灭菌适配；当前拆为ZL-A1与SS-A1两项独立科技和产品。
evidence: SPEC-M1-STAGE23-MEDICAL-AMMUNITION-ARTILLERY-MILITARY-TRUCK-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MED-DEV-001-A1, MED-DEV-001-A2, ICD-PRS-001, MED-IPC-001
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百二十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-002

```text
tech_id: MIL-EQP-002
current_name: “基准”标准枪械弹药（步弹—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_INVALID, MISSING_COMPONENT_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为步枪弹药定型，交付BD-A1型7.62乘39毫米普通步枪弹；枪弹共享接口但不互设科技前置。
evidence: SPEC-M1-STAGE23-MEDICAL-AMMUNITION-ARTILLERY-MILITARY-TRUCK-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-001, CHM-ENE-001-C, CHM-ENE-001-D
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百二十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-005

```text
tech_id: MIL-EQP-005
current_name: “远鸣”野战火炮（野炮—01）
fact_gate: defer
issue_tags: MISSING_MILESTONE, MISSING_RESOURCE_CHAIN, PREMATURE_WEAPON_SYSTEM
issue_statement: 野战火炮是有效里程碑，但当前缺身管钢深孔膛线炮闩反后坐炮弹和试验场链；YH-A1七十六毫米牵引炮路线后移。
evidence: SPEC-M1-STAGE23-MEDICAL-AMMUNITION-ARTILLERY-MILITARY-TRUCK-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-013, MIL-ORG-010
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百二十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-013

```text
tech_id: MIL-EQP-013
current_name: “远行”轻型军用卡车（轻运—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_INVALID, PLACEHOLDER_PRODUCT, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前候选改为轻型军卡定型，交付QK-A1J军用派生轻卡；燃料道路维修驾驶员改为运行条件。
evidence: SPEC-M1-STAGE23-MEDICAL-AMMUNITION-ARTILLERY-MILITARY-TRUCK-POLICE-BATCH-AMENDMENT-001
related_tech_ids: VEH-LTR-001, MIL-EXT-035
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百二十四项事实审查
resolution_status: waiting_post_tree_review
```

### POL-TRF-001

```text
tech_id: POL-TRF-001
current_name: 道路事故处理、危险运输与路线安全方法
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, CROSS_DOMAIN_BUNDLE, LOW_PLAYER_VALUE
issue_statement: 道路事故处置与现场警务重复，危险运输和路线风险分属物流工务；当前拆回各系统并删除混合科技。
evidence: SPEC-M1-STAGE23-MEDICAL-AMMUNITION-ARTILLERY-MILITARY-TRUCK-POLICE-BATCH-AMENDMENT-001
related_tech_ids: POL-PAT-001, TLG-HAZ-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百二十五项事实审查
resolution_status: waiting_post_tree_review
```

### STA-SOV-001

```text
tech_id: STA-SOV-001
current_name: 主权接管、资产债务、人员与档案移交方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, WRONG_OUTPUT_TYPE, GOVERNANCE_BOUNDARY
issue_statement: 当前候选保留兼并或其他合法移交后的中央主权接管，科研不触发吞并；地方仅保留中央授权的执行自治。
evidence: SPEC-M1-STAGE23-SOVEREIGNTY-TRADE-TRACTOR-MEDIUM-TRUCK-OVERHAUL-BATCH-AMENDMENT-001
related_tech_ids: GOV-ADM-001, DIP-STA-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百二十六项事实审查
resolution_status: waiting_post_tree_review
```

### TRD-FRM-001

```text
tech_id: TRD-FRM-001
current_name: 正式贸易与公共结算
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PROCEDURAL_OVERLOAD, DEPENDENCY_INVERSION
issue_statement: 当前候选改为跨期贸易结算，保留交付验收应收应付与争议状态；统一计价和账户核算必须移到本项之前。
evidence: SPEC-M1-STAGE23-SOVEREIGNTY-TRADE-TRACTOR-MEDIUM-TRUCK-OVERHAUL-BATCH-AMENDMENT-001
related_tech_ids: ECO-UNT-001, ECO-ACC-001, ECO-TRD-001, DIP-STA-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百二十七项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-AGR-001

```text
tech_id: VEH-AGR-001
current_name: 农业拖拉机、动力输出与通用农具接口
fact_gate: pass_with_tree_review
issue_tags: PLACEHOLDER_PRODUCT, MISSING_COMPONENT_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为农业拖拉机定型，交付NL-A1及三种独立农具；低速终传动液压提升与农业轮胎链未闭合。
evidence: SPEC-M1-STAGE23-SOVEREIGNTY-TRADE-TRACTOR-MEDIUM-TRUCK-OVERHAUL-BATCH-AMENDMENT-001
related_tech_ids: VEH-LTR-001, MCH-STD-001-B, AGR-MEC-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百二十八项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-MTR-001

```text
tech_id: VEH-MTR-001
current_name: 中型卡车承载车架与重载传动
fact_gate: pass_with_tree_review
issue_tags: PLACEHOLDER_PRODUCT, MISSING_POWERTRAIN_CHAIN, CONDITIONAL_PRODUCTION
issue_statement: 当前候选改为中型卡车定型，交付ZK-A1五吨中卡；中型柴油机重载变速箱气制动和大规格轮胎链未闭合。
evidence: SPEC-M1-STAGE23-SOVEREIGNTY-TRADE-TRACTOR-MEDIUM-TRUCK-OVERHAUL-BATCH-AMENDMENT-001
related_tech_ids: VEH-LTR-001, MIL-EQP-014, VEH-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百二十九项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-VEH-004

```text
tech_id: Y2-PROD-VEH-004
current_name: 轻型卡车维修总成标准化与换装检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, ABSTRACT_PRODUCT, SOURCE_IDENTITY_MISSING
issue_statement: 当前候选改为轻卡总成换修，交付QK-MA1分总成类别和R/H/N来源等级的周转维修产品，只兼容QK平台。
evidence: SPEC-M1-STAGE23-SOVEREIGNTY-TRADE-TRACTOR-MEDIUM-TRUCK-OVERHAUL-BATCH-AMENDMENT-001
related_tech_ids: VEH-LTR-001, RPR-OVH-001, MIL-EQP-013
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_PRODUCT_FAMILY, ADD_SOURCE_STATE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百三十项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-FUR-001-C

```text
tech_id: CIV-FUR-001-C
current_name: 标准家具制作
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, DELETED_PREREQUISITE, MATERIAL_BOUNDARY
issue_statement: 当前候选改为实木家具定型，交付JJ-A1床桌椅柜架型号族；首代不使用胶合板刨花板和后移木胶。
evidence: SPEC-M1-STAGE23-FURNITURE-ACCOUNTING-BORDER-TRADE-MOTOR-RATING-BATCH-AMENDMENT-001
related_tech_ids: RSC-SAW-001-A, MCH-STD-001-A, MCH-JIG-001
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_PRODUCT_FAMILY, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百三十一项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-ACC-001

```text
tech_id: ECO-ACC-001
current_name: 账户分类、复式记录与月末核对
fact_gate: merge_pass_with_tree_review
issue_tags: OVER_DECOMPOSED_ACCOUNTING, PLAYER_INVISIBLE_DETAIL, DEPENDENCY_INVERSION, WRONG_OUTPUT_TYPE
issue_statement: 当前合并ECO-UNT-001后改为统一资源核算，一项承接计价单位实物货币应收应付月结和未落实状态。
evidence: SPEC-M1-STAGE23-FURNITURE-ACCOUNTING-BORDER-TRADE-MOTOR-RATING-BATCH-AMENDMENT-001
related_tech_ids: ECO-UNT-001, GOV-ACC-001, TRD-FRM-001
blocks_prose: false
provisional_post_review_action: MERGE, RENAME, RETYPE_OUTPUTS, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百三十二项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-TRD-001

```text
tech_id: ECO-TRD-001
current_name: 外贸报关、规格、关税与边境交接
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, GOVERNANCE_BOUNDARY, WRONG_OUTPUT_TYPE
issue_statement: 当前候选改为边境贸易交接，只负责跨主权货物检查责任转移税费挂账和放行状态；税率禁限由法律政策决定。
evidence: SPEC-M1-STAGE23-FURNITURE-ACCOUNTING-BORDER-TRADE-MOTOR-RATING-BATCH-AMENDMENT-001
related_tech_ids: TRD-FRM-001, DIP-STA-001, TLG-HAZ-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百三十三项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-UNT-001

```text
tech_id: ECO-UNT-001
current_name: 统一记账单位、计价精度与换算规则
fact_gate: merge_delete
issue_tags: OVER_DECOMPOSED_ACCOUNTING, PLAYER_INVISIBLE_DETAIL, DEPENDENCY_INVERSION, WRONG_OUTPUT_TYPE
issue_statement: 统一计价和换算只是共同资源核算的一部分；当前并入ECO-ACC-001并删除独立会计细节节点。
evidence: SPEC-M1-STAGE23-FURNITURE-ACCOUNTING-BORDER-TRADE-MOTOR-RATING-BATCH-AMENDMENT-001
related_tech_ids: ECO-ACC-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百三十四项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-MOT-001-C

```text
tech_id: ELC-MOT-001-C
current_name: 电动机性能试验
fact_gate: pass_with_tree_review
issue_tags: WRONG_OUTPUT_TYPE, PREREQUISITE_INVALID, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为电机性能定级，对Y90S-4实际测试功率温升振动绝缘和连续工作能力后形成铭牌与放行状态。
evidence: SPEC-M1-STAGE23-FURNITURE-ACCOUNTING-BORDER-TRADE-MOTOR-RATING-BATCH-AMENDMENT-001
related_tech_ids: ELC-MOT-001-B, QLT-MET-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百三十五项事实审查
resolution_status: waiting_post_tree_review
```

### IND-CON-001

```text
tech_id: IND-CON-001
current_name: 生产单元换产、清线与熟练度恢复方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, BOUNDARY_WITH_REFIT, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为生产换产组织，只处理相容设备上的停线清线工装切换首件试产和良率恢复，不再强制依赖生产单元改造。
evidence: SPEC-M1-STAGE23-CHANGEOVER-INDUSTRIAL-SITE-MACHINE-NETWORK-VALVE-TEST-MACHINE-GUN-BATCH-AMENDMENT-001
related_tech_ids: QLT-CHG-001, IND-REF-001, IND-SIT-003
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百三十六项事实审查
resolution_status: waiting_post_tree_review
```

### IND-SIT-005

```text
tech_id: IND-SIT-005
current_name: 工业联合场址公用工程与风险分区设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, AUTO_INSTANCE_ERROR, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前候选改为联合厂区设计，保留多座工厂共享接口和风险分区；所有公辅物流安全环保工程仍分别建设验收。
evidence: SPEC-M1-STAGE23-CHANGEOVER-INDUSTRIAL-SITE-MACHINE-NETWORK-VALVE-TEST-MACHINE-GUN-BATCH-AMENDMENT-001
related_tech_ids: IND-SIT-004, IND-EXP-001, IND-SIT-003
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百三十七项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-NET-001

```text
tech_id: MCH-NET-001
current_name: 区域机械制造协作
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, AUTO_INSTANCE_ERROR, ABSTRACT_NETWORK
issue_statement: 当前候选改为区域机加协作，保留多个工场共享瓶颈设备工装量具校准和异地备援，不要求全部机床数控化。
evidence: SPEC-M1-STAGE23-CHANGEOVER-INDUSTRIAL-SITE-MACHINE-NETWORK-VALVE-TEST-MACHINE-GUN-BATCH-AMENDMENT-001
related_tech_ids: MCH-RPL-001-B, QLT-MET-001, QLT-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百三十八项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-PMP-001-C

```text
tech_id: MCH-PMP-001-C
current_name: 泵阀性能试验
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, WRONG_OUTPUT_TYPE, AUTO_INSTANCE_ERROR
issue_statement: 泵侧已由IS-A1完整承担；当前收窄为阀门性能验收，只对J41H-16C与H44H-16C进行PN16耐压密封放行。
evidence: SPEC-M1-STAGE23-CHANGEOVER-INDUSTRIAL-SITE-MACHINE-NETWORK-VALVE-TEST-MACHINE-GUN-BATCH-AMENDMENT-001
related_tech_ids: MCH-PMP-001-B, IME-PMP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第四百三十九项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-003

```text
tech_id: MIL-EQP-003
current_name: “连声”班组自动火力武器（班火—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_INVALID, PLACEHOLDER_PRODUCT, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为班用机枪定型，交付BJ-A1型7.62×39毫米班用轻机枪，以加重枪管大容量弹匣两脚架和持续射击验收区别BQ-A1。
evidence: SPEC-M1-STAGE23-CHANGEOVER-INDUSTRIAL-SITE-MACHINE-NETWORK-VALVE-TEST-MACHINE-GUN-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-001, MIL-EQP-002
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百四十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-014

```text
tech_id: MIL-EQP-014
current_name: “承载”中型军用卡车（中运—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_INVALID, PLACEHOLDER_PRODUCT, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前候选改为中型军卡定型，交付ZK-A1J五吨级4乘2军用派生车；不得偷渡四驱装甲和武器平台能力。
evidence: SPEC-M1-STAGE24-MEDIUM-MILITARY-TRUCK-SELF-PROPELLED-ROCKET-MORTAR-ARTILLERY-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: VEH-MTR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百四十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-010

```text
tech_id: MIL-EXT-010
current_name: “行雷”自行火炮（自炮—01）总体设计
fact_gate: defer
issue_tags: BLOCKED_UPSTREAM_WEAPON, MISSING_PURPOSE_BUILT_CHASSIS, MISSING_FIRE_CONTROL_CHAIN
issue_statement: YH-A1火炮仍后移且4乘2中卡不能承担自行炮射击载荷；ZP-A1专用6乘6轮式自行炮路线后移。
evidence: SPEC-M1-STAGE24-MEDIUM-MILITARY-TRUCK-SELF-PROPELLED-ROCKET-MORTAR-ARTILLERY-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-005, MIL-EXT-013, MIL-EXT-020
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百四十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-011

```text
tech_id: MIL-EXT-011
current_name: “群啸”多管火箭炮（火箭—01）总体设计
fact_gate: defer
issue_tags: MISSING_ROCKET_PROPULSION_CHAIN, MISSING_ROCKET_MUNITION, PREMATURE_WEAPON_SYSTEM
issue_statement: 当前缺固体火箭推进剂发动机壳体喷管战斗部点火与试验链；HJ-A1型107毫米十二管火箭炮后移。
evidence: SPEC-M1-STAGE24-MEDIUM-MILITARY-TRUCK-SELF-PROPELLED-ROCKET-MORTAR-ARTILLERY-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-020
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百四十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-012

```text
tech_id: MIL-EXT-012
current_name: “短弧”配套迫击炮弹药（迫弹—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: NAME_INVALID, PLACEHOLDER_PRODUCT, MISSING_FUZE_AND_BODY_CHAIN
issue_statement: 当前候选改为迫击炮弹定型，交付PD-60A1型60毫米榴弹；精密引信薄壁弹体和附加药包量产仍有缺口，PD-A1保留给低压配电柜。
evidence: SPEC-M1-STAGE24-MEDIUM-MILITARY-TRUCK-SELF-PROPELLED-ROCKET-MORTAR-ARTILLERY-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-004, CHM-ENE-001-C, CHM-ENE-001-D, CHM-ENE-001-E
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百四十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-013

```text
tech_id: MIL-EXT-013
current_name: “远鸣”配套炮兵弹药（炮弹—01）总体设计
fact_gate: defer
issue_tags: BLOCKED_UPSTREAM_WEAPON, CALIBER_INTERFACE_UNFROZEN, MISSING_ARTILLERY_AMMUNITION_CHAIN
issue_statement: YH-A1膛室身管耐压射表未冻结，不能提前形成量产炮弹；PD-B1型76毫米炮弹与火炮共同后移。
evidence: SPEC-M1-STAGE24-MEDIUM-MILITARY-TRUCK-SELF-PROPELLED-ROCKET-MORTAR-ARTILLERY-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-005, MIL-EXT-010
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第四百四十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-020

```text
tech_id: MIL-EXT-020
current_name: “定标”野战火力指挥与校射设备组（火控—01）总体设计
fact_gate: defer
issue_tags: MISSING_ARTILLERY_CHAIN, MISSING_FIRE_CONTROL_INSTRUMENT_CHAIN, DEPENDENCY_DEFERRED
issue_statement: 完整野战炮火控缺火炮炮弹测地光学气象射表链；DB-A1火控设备组随YH-A1与PD-B1后移。
evidence: SPEC-M1-STAGE24-ARTILLERY-CONTROL-AMBULANCE-SUPPORT-ARMY-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-005, MIL-EXT-013
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第四百四十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-035

```text
tech_id: MIL-EXT-035
current_name: “护生”野战救护车（救护—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为野战救护车定型，交付QK-A1JH四卧位轻卡派生救护车；不开放移动手术室或自动医护物资。
evidence: SPEC-M1-STAGE24-ARTILLERY-CONTROL-AMBULANCE-SUPPORT-ARMY-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-013, MIL-EQP-011, MED-IPC-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百四十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-017

```text
tech_id: MIL-ORG-017
current_name: 军需与维修部队编制
fact_gate: pass_with_tree_review
issue_tags: FORMATION_IDENTITY_MISSING, AUTO_INSTANCE_ERROR, WRONG_OUTPUT_TYPE
issue_statement: 当前候选改为保障部队编制，一项科技明确开放补给运输连和装备维修连两种不同部队编制，不自动生成人员装备。
evidence: SPEC-M1-STAGE24-ARTILLERY-CONTROL-AMBULANCE-SUPPORT-ARMY-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, LOG-DSP-001, RPR-SHP-001
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATIONS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百四十八项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-R6-001

```text
tech_id: MIL-ORG-R6-001
current_name: 军队建制与战备管理
fact_gate: pass_with_tree_review
issue_tags: SCOPE_OVERBROAD, PREREQUISITE_OVERCONSTRAINT, AUTO_INSTANCE_ERROR
issue_statement: 当前候选收窄为军队建制管理，只提供所有部队共用指挥编配命令武器保管和战备状态，不替代具体兵种编制。
evidence: SPEC-M1-STAGE24-ARTILLERY-CONTROL-AMBULANCE-SUPPORT-ARMY-POLICE-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-017
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百四十九项事实审查
resolution_status: waiting_post_tree_review
```

### POL-JUS-001

```text
tech_id: POL-JUS-001
current_name: 正规警务与司法移交体系
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, DELETED_PREREQUISITE, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为警务司法移交，承接现场处置并形成证据用权羁押投诉受法律约束的移交闭环。
evidence: SPEC-M1-STAGE24-ARTILLERY-CONTROL-AMBULANCE-SUPPORT-ARMY-POLICE-BATCH-AMENDMENT-001
related_tech_ids: POL-PAT-001, POL-INV-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, NARROW_SCOPE
raised_at: M0正式全树续跑第四百五十项事实审查
resolution_status: waiting_post_tree_review
```

### TRD-TEC-001

```text
tech_id: TRD-TEC-001
current_name: 技术交换与许可协定
fact_gate: pass_with_tree_review
issue_tags: OUTPUT_TYPE_ERROR, KNOWLEDGE_TRANSFER_BOUNDARY, AUTO_AGREEMENT
issue_statement: 当前候选改为技术交换组织，知识专家工时许可范围必须经实际交付才可成为外来技术适配输入，科研不自动获得技术。
evidence: SPEC-M1-STAGE24-TECHNOLOGY-EXCHANGE-ENGINEERING-VEHICLE-HEAVY-TRUCK-DUPLICATE-COMPONENTS-BATCH-AMENDMENT-001
related_tech_ids: TRD-FRM-001, SCI-EXT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百五十一项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-ENGR-001

```text
tech_id: VEH-ENGR-001
current_name: 工程作业车辆总体定型
fact_gate: split
issue_tags: SPLIT_PRODUCT_MILESTONE, PRODUCT_IDENTITY, MISSING_HYDRAULIC_CHAIN, MISSING_LIFTING_SAFETY_CHAIN
issue_statement: 万能工程车混合牵引吊装与道路养护；当前拆为GQ-A1工程牵引车、后移QC-A1汽车起重机和LY-A1道路养护设备组。
evidence: SPEC-M1-STAGE24-TECHNOLOGY-EXCHANGE-ENGINEERING-VEHICLE-HEAVY-TRUCK-DUPLICATE-COMPONENTS-BATCH-AMENDMENT-001
related_tech_ids: VEH-MTR-001, LOG-RDS-001
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_MODELS, DEFER_MISSING_CHAIN, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百五十二项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-HTR-001

```text
tech_id: VEH-HTR-001
current_name: 重型卡车平台总体定型
fact_gate: pass_with_tree_review
issue_tags: OVERLONG_NAME, PRODUCT_IDENTITY, MISSING_HEAVY_POWERTRAIN_CHAIN, CONDITIONAL_PRODUCTION
issue_statement: 当前候选交付ZK-B1十吨六乘四重卡，但本地量产仍缺重型动力变速箱双后桥气制动和重载轮胎链。
evidence: SPEC-M1-STAGE24-TECHNOLOGY-EXCHANGE-ENGINEERING-VEHICLE-HEAVY-TRUCK-DUPLICATE-COMPONENTS-BATCH-AMENDMENT-001
related_tech_ids: VEH-MTR-001, MIL-EXT-024
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, ADD_RESOURCE_CONDITION, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百五十三项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-MCH-002

```text
tech_id: Y2-PROD-MCH-002
current_name: 通用紧固件规格组与成批生产
fact_gate: merge_delete
issue_tags: DUPLICATE_PRODUCT_MILESTONE, DUPLICATE_PROCESS
issue_statement: 与MCH-STD-001-A基础紧固件的产品规格生产检验库存身份完全重复。
evidence: SPEC-M1-STAGE24-TECHNOLOGY-EXCHANGE-ENGINEERING-VEHICLE-HEAVY-TRUCK-DUPLICATE-COMPONENTS-BATCH-AMENDMENT-001
related_tech_ids: MCH-STD-001-A
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百五十四项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-MCH-003

```text
tech_id: Y2-PROD-MCH-003
current_name: 基础传动件规格组与成批生产
fact_gate: merge_delete
issue_tags: DUPLICATE_PRODUCT_MILESTONE, OVERAGGREGATED_INVENTORY
issue_statement: 抽象基础传动件重复概括既有齿轮、传动轴和联轴器产品，后继应按实际功能分别读取。
evidence: SPEC-M1-STAGE24-TECHNOLOGY-EXCHANGE-ENGINEERING-VEHICLE-HEAVY-TRUCK-DUPLICATE-COMPONENTS-BATCH-AMENDMENT-001
related_tech_ids: IME-GER-001, MCH-STD-001-B
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百五十五项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-MCH-004

```text
tech_id: Y2-PROD-MCH-004
current_name: 通用滚动轴承规格组与成批检验
fact_gate: merge_delete
issue_tags: DUPLICATE_PRODUCT_MILESTONE, DUPLICATE_PROCESS, DUPLICATE_INSPECTION
issue_statement: MCH-BRG-001已经完整承担6200与30200系列轴承的生产检验和批次身份，本项完全重复。
evidence: SPEC-M1-STAGE24-BEARING-ASSISTIVE-PRODUCTS-PUBLIC-PROCUREMENT-BATCH-AMENDMENT-001
related_tech_ids: MCH-BRG-001, MCH-STD-001-C
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百五十六项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-ACC-001-A

```text
tech_id: CIV-ACC-001-A
current_name: 儿童生活适配用品设计
fact_gate: demote_merge
issue_tags: ABSTRACT_PRODUCT, LOW_PLAYER_VALUE, PRODUCT_VARIANT_NOT_TECH
issue_statement: 当前内容仅构成JJ-A1家具与YF-A1衣物的儿童尺寸安全变体，不值得保留独立科技或抽象儿童用品库存。
evidence: SPEC-M1-STAGE24-BEARING-ASSISTIVE-PRODUCTS-PUBLIC-PROCUREMENT-BATCH-AMENDMENT-001
related_tech_ids: CIV-FUR-001-C, CIV-TEX-001
blocks_prose: true
provisional_post_review_action: DEMOTE_TO_PRODUCT_VARIANTS, DELETE_NODE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百五十七项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-ACC-001-B

```text
tech_id: CIV-ACC-001-B
current_name: 老年生活适配用品设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, DUPLICATE_USER_GROUP_SPLIT, MEDICAL_CIVIL_BOUNDARY
issue_statement: 当前候选改为生活辅具设计并吸收C项，交付扶手助行架转移板如厕椅四种SY-A1普通生活辅具，与FZ-A1医疗康复器具分层。
evidence: SPEC-M1-STAGE24-BEARING-ASSISTIVE-PRODUCTS-PUBLIC-PROCUREMENT-BATCH-AMENDMENT-001
related_tech_ids: CIV-ACC-001-C, MED-REH-001, CIV-FUR-001-C
blocks_prose: false
provisional_post_review_action: RENAME, MERGE_NODE, ADD_PRODUCT_MODELS, DEFINE_MEDICAL_BOUNDARY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百五十八项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-ACC-001-C

```text
tech_id: CIV-ACC-001-C
current_name: 伤残人口生活适配用品设计
fact_gate: merge_delete
issue_tags: DUPLICATE_USER_GROUP_SPLIT, ABSTRACT_PRODUCT
issue_statement: 按人口身份拆分无法形成不同产品制造链，本项并入生活辅具设计，具体功能评估决定用品而非身份库存。
evidence: SPEC-M1-STAGE24-BEARING-ASSISTIVE-PRODUCTS-PUBLIC-PROCUREMENT-BATCH-AMENDMENT-001
related_tech_ids: CIV-ACC-001-B
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百五十九项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-PRC-002

```text
tech_id: ECO-PRC-002
current_name: 公共采购需求、竞价、验收与付款方法
fact_gate: pass_with_tree_review
issue_tags: OVERLONG_NAME, OUTPUT_TYPE_ERROR, POLICY_TECH_BOUNDARY, AUTO_RECORD
issue_statement: 当前候选改为公共采购组织，保留公共预算形成具体订单验收与付款状态的桥梁，采购偏好和强制边界归法律政策。
evidence: SPEC-M1-STAGE24-BEARING-ASSISTIVE-PRODUCTS-PUBLIC-PROCUREMENT-BATCH-AMENDMENT-001
related_tech_ids: GOV-ACC-001, ECO-ACC-001, QLT-SMP-001, ECO-AUD-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_POLICY_BOUNDARY
raised_at: M0正式全树续跑第四百六十项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-REV-001

```text
tech_id: ECO-REV-001
current_name: 人口、经营、土地和交易收入义务设计
fact_gate: pass_with_tree_review
issue_tags: LEGAL_TECH_BOUNDARY, ORGANIZATION_NOT_INSTANCE, NO_AUTO_OUTPUT
issue_statement: 当前候选改为收入征收组织，只执行已生效收入法律；税种税率免征范围仍由法律选择，科研不自动产生收入。
evidence: SPEC-M1-STAGE25-REVENUE-RESPIRATORY-AIR-DEFENSE-ARMORED-RECON-ROCKET-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: ECO-ACC-001, GOV-ACC-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_LEGAL_BOUNDARY
raised_at: M0正式全树续跑第四百六十一项事实审查
resolution_status: waiting_post_tree_review
```

### MED-DEV-001-B

```text
tech_id: MED-DEV-001-B
current_name: 基础呼吸支持设备装配
fact_gate: split
issue_tags: SPLIT_REQUIRED, MISSING_COMPONENT_CHAIN, MISSING_RESOURCE_CHAIN, MEDICAL_MATERIAL_GAP
issue_statement: 呼吸机供气组和面罩管路具有不同制造失效与补充链；当前拆为后移HX-A1机械通气、有效HX-B1氧气调节与后移HX-C1呼吸回路。
evidence: SPEC-M1-STAGE25-REVENUE-RESPIRATORY-AIR-DEFENSE-ARMORED-RECON-ROCKET-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MED-IPC-001, CHM-GAS-001-B, ICD-PRS-001, ICD-FLW-001
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_MODELS, DEFER_MISSING_CHAINS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百六十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-007

```text
tech_id: MIL-EQP-007
current_name: “仰角”低空防御武器（低防—01）
fact_gate: defer
issue_tags: MISSING_WEAPON_CHAIN, MISSING_AMMUNITION_CHAIN, FALSE_PREREQUISITE
issue_statement: 当前候选收敛为GJ-A1十二点七毫米高射机枪，但缺重机枪专用弹药高仰角枪架和高射瞄具链，不能由班用机枪替代。
evidence: SPEC-M1-STAGE25-REVENUE-RESPIRATORY-AIR-DEFENSE-ARMORED-RECON-ROCKET-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-003
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第四百六十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-015

```text
tech_id: MIL-EQP-015
current_name: “先见”装甲侦察车（装侦—01）
fact_gate: defer
issue_tags: MISSING_ARMOR_CHAIN, MISSING_DRIVETRAIN_CHAIN, MISSING_VEHICLE_MILESTONE
issue_statement: 当前预留ZQ-A1四驱轻型装甲侦察车，但普通板材轻卡无法证明装甲钢专用底盘车体焊接和整车试验链。
evidence: SPEC-M1-STAGE25-REVENUE-RESPIRATORY-AIR-DEFENSE-ARMORED-RECON-ROCKET-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-019
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REMOVE_CIRCULAR_PREREQUISITE
raised_at: M0正式全树续跑第四百六十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-014

```text
tech_id: MIL-EXT-014
current_name: “群啸”配套火箭炮弹药（箭弹—01）总体设计
fact_gate: defer
issue_tags: BOUND_TO_DEFERRED_PLATFORM, MISSING_PROPELLANT_CHAIN, MISSING_ROCKET_MOTOR_CHAIN
issue_statement: HD-A1一百零七毫米火箭弹缺固体推进剂壳体喷管点火器和完整试验链，随多管火箭炮共同后移。
evidence: SPEC-M1-STAGE25-REVENUE-RESPIRATORY-AIR-DEFENSE-ARMORED-RECON-ROCKET-AMMUNITION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-011
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百六十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-024

```text
tech_id: MIL-EXT-024
current_name: “重程”重型军用卡车（重运—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: DERIVATIVE_PRODUCT, CONDITIONAL_PRODUCTION, COST_OVERESTIMATED
issue_statement: 当前候选交付ZK-B1J十吨六乘四重型军卡，只增加军用运输接口与环境适应，不改变基础驱动并受ZK-B1总成条件限制。
evidence: SPEC-M1-STAGE25-HEAVY-MILITARY-TRUCK-SUPPORT-MODULES-BRIDGE-QUARTERMASTER-HELICOPTER-BATCH-AMENDMENT-001
related_tech_ids: VEH-HTR-001, MIL-EQP-014
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, ADD_RESOURCE_CONDITION, REBALANCE_COST
raised_at: M0正式全树续跑第四百六十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-025

```text
tech_id: MIL-EXT-025
current_name: “载序”军用保障车辆模块组（军保—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT_FIXED, MULTIPLE_UNLOCKS_EXPLICIT, SHARED_INTERFACE_PLATFORM
issue_statement: 当前候选改为保障车辆模块，以共享车辆接口逐项交付油料水弹药货运和维修四种独立模块，油水绝不共用。
evidence: SPEC-M1-STAGE25-HEAVY-MILITARY-TRUCK-SUPPORT-MODULES-BRIDGE-QUARTERMASTER-HELICOPTER-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-013, MIL-EQP-014, MIL-EXT-046
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODELS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百六十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-045

```text
tech_id: MIL-EXT-045
current_name: “架路”野战桥梁与道路保障装备组（路保—01）总体设计
fact_gate: defer
issue_tags: OVERBROAD_PRODUCT, ROAD_SCOPE_DUPLICATE, MISSING_ENGINEERING_CHAIN
issue_statement: 当前候选收窄为QL-A1模块化面板桥，删除与LY-A1重复的道路养护，但桥节材料架设和载荷试验链尚未闭合。
evidence: SPEC-M1-STAGE25-HEAVY-MILITARY-TRUCK-SUPPORT-MODULES-BRIDGE-QUARTERMASTER-HELICOPTER-BATCH-AMENDMENT-001
related_tech_ids: CNS-INF-001-B, CNS-SUR-001-A, VEH-ENGR-001-C
blocks_prose: true
provisional_post_review_action: NARROW_SCOPE, DEFER, ADD_PRODUCT_MODEL, REMOVE_DUPLICATE_SCOPE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百六十八项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-046

```text
tech_id: MIL-EXT-046
current_name: “续链”野战军需保障装备组（军需—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT_FIXED, MULTIPLE_UNLOCKS_EXPLICIT, SCOPE_DEDUPLICATED
issue_statement: 当前候选改为野战军需装备，逐项交付炊事送餐饮水分发和遮蔽货架四种产品，不重复运输罐净水维修或医疗装备。
evidence: SPEC-M1-STAGE25-HEAVY-MILITARY-TRUCK-SUPPORT-MODULES-BRIDGE-QUARTERMASTER-HELICOPTER-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-025, LOG-HND-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODELS, NARROW_SCOPE, REBALANCE_COST
raised_at: M0正式全树续跑第四百六十九项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-050

```text
tech_id: MIL-EXT-050
current_name: “垂行”运输直升机（陆航—01）总体设计
fact_gate: defer
issue_tags: MISSING_AEROSPACE_INDUSTRY, MISSING_ENGINE_CHAIN, MISSING_AIRWORTHINESS_CHAIN
issue_statement: LH-A1轻型运输直升机缺航空材料涡轴旋翼传动飞控航电机场适航和专业维修整链，当前完全后移。
evidence: SPEC-M1-STAGE25-HEAVY-MILITARY-TRUCK-SUPPORT-MODULES-BRIDGE-QUARTERMASTER-HELICOPTER-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-051
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第四百七十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-002

```text
tech_id: MIL-ORG-002
current_name: 基础步兵训练与班组协同
fact_gate: pass_with_tree_review
issue_tags: TRAINING_NOT_FORMATION, NO_AUTO_TRAINING, FALSE_PREREQUISITE
issue_statement: 当前候选改为步兵班组训练，承接通用新兵资格并只形成步兵专业能力，驾驶通信工兵医疗维修人员不必先成为步兵。
evidence: SPEC-M1-STAGE25-INFANTRY-SIGNAL-NIGHT-POLICE-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: UNT-TRN-001, MIL-TACTIC-004, MIL-ORG-006
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第四百七十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-015

```text
tech_id: MIL-ORG-015
current_name: 通信保障部队编制
fact_gate: pass_with_tree_review
issue_tags: FORMATION_NOT_INSTANCE, EXPLICIT_UNIT_IDENTITY, PREREQUISITE_REDUCTION
issue_statement: 当前候选明确为通信保障连编制，包含连部无线电线路和电源维修分组，实际人员装备训练投入后才能形成部队。
evidence: SPEC-M1-STAGE25-INFANTRY-SIGNAL-NIGHT-POLICE-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, MIL-EQP-010
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百七十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-004

```text
tech_id: MIL-TACTIC-004
current_name: 夜间行军、灯火管制与有限夜战
fact_gate: pass_with_tree_review
issue_tags: TACTIC_NOT_EQUIPMENT, NO_AUTO_ADOPTION, SCOPE_BOUNDED
issue_statement: 当前候选改为夜间行动协同，保留无夜视装备时的队形路线识别和灯火纪律，具体部队训练后才获得能力。
evidence: SPEC-M1-STAGE25-INFANTRY-SIGNAL-NIGHT-POLICE-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-002
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_UNIT_TRAINING_STATE
raised_at: M0正式全树续跑第四百七十三项事实审查
resolution_status: waiting_post_tree_review
```

### POL-INV-001

```text
tech_id: POL-INV-001
current_name: 访问调查、交叉核对与跨地协查方法
fact_gate: pass_with_tree_review
issue_tags: METHOD_NOT_PRODUCT, LEGAL_AUTHORITY_BOUNDARY, NO_AUTO_EVIDENCE
issue_statement: 当前候选改为案件调查方法，负责访谈时间线物证交叉核对和可选跨地协查，不制造证据且调查权限由法律授权。
evidence: SPEC-M1-STAGE25-INFANTRY-SIGNAL-NIGHT-POLICE-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: POL-JUS-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_LEGAL_BOUNDARY
raised_at: M0正式全树续跑第四百七十四项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-NET-001

```text
tech_id: QLT-NET-001
current_name: 跨工场标准互认与独立质量审核
fact_gate: pass_with_tree_review
issue_tags: SCALE_MILESTONE, RECORD_NOT_SOLE_OUTPUT, NO_AUTO_RECOGNITION
issue_statement: 当前候选改为区域质量互认，保留跨工场共同标准版本量具溯源独立复核和互认暂停机制，不限于机械工场。
evidence: SPEC-M1-STAGE25-INFANTRY-SIGNAL-NIGHT-POLICE-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: QLT-SMP-001, QLT-MET-001, QLT-CHG-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, EXPAND_APPLICABILITY
raised_at: M0正式全树续跑第四百七十五项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-NET-001

```text
tech_id: VEH-NET-001
current_name: 车辆平台标准化、备件互通与批量总装
fact_gate: pass_with_tree_review
issue_tags: SCALE_MILESTONE, FACILITY_NOT_PRODUCT, PLATFORM_BOUNDARY_REQUIRED
issue_statement: 当前候选改为车辆平台统合，分别统一QK-A1与ZK-A1平台内部接口并开放总装线工程，不宣称跨平台全部互换或自动建线。
evidence: SPEC-M1-STAGE25-VEHICLE-PLATFORM-CIVIL-SERVICE-AUDIT-EXCHANGE-TANK-BATCH-AMENDMENT-001
related_tech_ids: VEH-LTR-001, VEH-MTR-001, QLT-TRC-001, QLT-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_ENGINEERING_UNLOCKS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第四百七十六项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-SVC-001

```text
tech_id: CIV-SVC-001
current_name: 民用品维修、租用与回收服务
fact_gate: demote_merge
issue_tags: DUPLICATE_MILESTONE, GOVERNANCE_DEMOTION, ABSTRACT_NETWORK
issue_statement: 与已下沉的SOC-RNT-001耐用品周转计划属于同一玩家里程碑，服务点和周转行动保留为治理内容，不另设科技。
evidence: SPEC-M1-STAGE25-VEHICLE-PLATFORM-CIVIL-SERVICE-AUDIT-EXCHANGE-TANK-BATCH-AMENDMENT-001
related_tech_ids: SOC-RNT-001, CIV-ACC-001-B
blocks_prose: true
provisional_post_review_action: DEMOTE_MERGE, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百七十七项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-AUD-001

```text
tech_id: ECO-AUD-001
current_name: 财政、采购、市场与地方收入独立审计
fact_gate: pass_with_tree_review
issue_tags: GOVERNANCE_CORE, ACTION_NOT_PRODUCT, LEGAL_AUTHORITY_BOUNDARY
issue_statement: 当前候选改为公共审计组织，只以统一核算为硬前置，采购收入与外贸实际存在时才成为可审对象，权限后果归法律。
evidence: SPEC-M1-STAGE25-VEHICLE-PLATFORM-CIVIL-SERVICE-AUDIT-EXCHANGE-TANK-BATCH-AMENDMENT-001
related_tech_ids: ECO-ACC-001, ECO-PRC-002, ECO-REV-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_LEGAL_BOUNDARY
raised_at: M0正式全树续跑第四百七十八项事实审查
resolution_status: waiting_post_tree_review
```

### ECO-FX-001

```text
tech_id: ECO-FX-001
current_name: 多种货物交换比、外部货币与风险折算
fact_gate: merge_delete
issue_tags: LOW_PLAYER_VALUE, ACCOUNTING_DETAIL, MERGE_DELETE
issue_statement: 外部估值汇兑费用差额与风险保留为统一核算和跨期贸易运行字段，不需要独立科技或产品身份。
evidence: SPEC-M1-STAGE25-VEHICLE-PLATFORM-CIVIL-SERVICE-AUDIT-EXCHANGE-TANK-BATCH-AMENDMENT-001
related_tech_ids: ECO-ACC-001, TRD-FRM-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, DEMOTE_TO_RUNTIME_FIELDS, REWIRE_DEPENDENTS, RETURN_POINTS_TO_POOL
raised_at: M0正式全树续跑第四百七十九项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-016

```text
tech_id: MIL-EQP-016
current_name: “砺石”轻型坦克（轻装—01）
fact_gate: defer
issue_tags: MISSING_ARMOR_CHAIN, MISSING_TRACKED_CHASSIS, MISSING_TANK_GUN_CHAIN
issue_statement: TK-A1二十吨级轻型坦克缺装甲钢履带专用动力炮塔坦克炮弹药和整车试验维修链，当前后移并上调复杂度。
evidence: SPEC-M1-STAGE25-VEHICLE-PLATFORM-CIVIL-SERVICE-AUDIT-EXCHANGE-TANK-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-015, MIL-EQP-005
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第四百八十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-019

```text
tech_id: MIL-EQP-019
current_name: “援臂”装甲抢修与拖救车辆（装救—01）
fact_gate: defer
issue_tags: MISSING_ARMORED_CHASSIS, MISSING_RECOVERY_EQUIPMENT, DEPENDENCY_CYCLE_RISK
issue_statement: QX-A1履带装甲抢修车缺装甲底盘重型绞盘驻锄吊装与试验链，并不得反向成为装甲车辆本体的前置。
evidence: SPEC-M1-STAGE26-ARMORED-RECOVERY-AIR-DEFENSE-APC-ARMED-HELICOPTER-GARRISON-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-016, VEH-ENGR-001-A, VEH-ENGR-001-B
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REMOVE_CIRCULAR_PREREQUISITE
raised_at: M0正式全树续跑第四百八十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-018

```text
tech_id: MIL-EXT-018
current_name: “天幕”机动近程防空系统（近防—01）总体设计
fact_gate: defer
issue_tags: SYSTEM_IDENTITY_FIXED, MISSING_RADAR_CHAIN, MISSING_FIRE_CONTROL, BOUND_TO_DEFERRED_AMMUNITION
issue_statement: 当前候选收敛为FK-A1车载导弹发射与火控平台，缺雷达跟踪识别伺服和制导接口链，与弹药共享接口但不互为前置，JF-A1保留给家用风扇。
evidence: SPEC-M1-STAGE26-ARMORED-RECOVERY-AIR-DEFENSE-APC-ARMED-HELICOPTER-GARRISON-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-019
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, PREVENT_DEPENDENCY_CYCLE
raised_at: M0正式全树续跑第四百八十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-027

```text
tech_id: MIL-EXT-027
current_name: “载步”装甲输送车（装输—01）总体设计
fact_gate: defer
issue_tags: MISSING_ARMOR_CHAIN, MISSING_MULTIAXLE_DRIVETRAIN, FALSE_DERIVATION
issue_statement: ZS-A1六乘六轮式装甲输送车缺装甲钢车体焊接多轴底盘和载人撤离试验链，不能由轻卡直接换壳。
evidence: SPEC-M1-STAGE26-ARMORED-RECOVERY-AIR-DEFENSE-APC-ARMED-HELICOPTER-GARRISON-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-015, MIL-EXT-028
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百八十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-051

```text
tech_id: MIL-EXT-051
current_name: “低袭”武装直升机（武直—01）总体设计
fact_gate: defer
issue_tags: MISSING_AEROSPACE_INDUSTRY, MISSING_WEAPON_INTEGRATION, MISSING_FLIGHT_TEST_CHAIN
issue_statement: ZH-A1轻型武装直升机缺完整航空工业军用航电火控武器集成和试飞维修链，当前完全后移，WZ-A1保留给无线电中继设备组。
evidence: SPEC-M1-STAGE26-ARMORED-RECOVERY-AIR-DEFENSE-APC-ARMED-HELICOPTER-GARRISON-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-050
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百八十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-005

```text
tech_id: MIL-ORG-005
current_name: 聚居点守备部队编制
fact_gate: pass_with_tree_review
issue_tags: FORMATION_NOT_INSTANCE, MILITARY_POLICE_BOUNDARY, NO_AUTO_FORMATION
issue_statement: 当前候选明确为守备连编制，承担固定要点武器库夜间警戒和警报响应，不承担案件调查羁押或日常执法。
evidence: SPEC-M1-STAGE26-ARMORED-RECOVERY-AIR-DEFENSE-APC-ARMED-HELICOPTER-GARRISON-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, MIL-ORG-002, MIL-ORG-006
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, DEFINE_POLICE_BOUNDARY, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百八十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-006

```text
tech_id: MIL-ORG-006
current_name: 常备步兵部队编制
fact_gate: pass_with_tree_review
issue_tags: AUTO_FORMATION, PREREQUISITE_OVERLOAD, UNIT_ROLE_AMBIGUITY
issue_statement: 当前候选明确为常备步兵连编制，承担野外机动部署，运输仓储人口数据改为运行条件，科研不自动组建部队。
evidence: SPEC-M1-STAGE26-INFANTRY-COMPANY-TACTICS-DIFFUSION-RECRUIT-TRAINING-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-002, MIL-ORG-005
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第四百八十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-001

```text
tech_id: MIL-TACTIC-001
current_name: 班组火力掩护与交替前进
fact_gate: pass_with_tree_review
issue_tags: AUTO_ADOPTION, EQUIPMENT_AS_KNOWLEDGE
issue_statement: 当前候选改为班组交替掩护，具体班组训练后获得火力与移动交替状态，枪械弹药作为训练条件。
evidence: SPEC-M1-STAGE26-INFANTRY-COMPANY-TACTICS-DIFFUSION-RECRUIT-TRAINING-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-002
blocks_prose: false
provisional_post_review_action: RENAME, ADD_UNIT_TRAINING_STATE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百八十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-002

```text
tech_id: MIL-TACTIC-002
current_name: 掩体构筑与交替阵位
fact_gate: pass_with_tree_review
issue_tags: AUTO_CONSTRUCTION, PERMANENT_FORTIFICATION_SCOPE
issue_statement: 当前候选改为交替阵位构筑，只承担部队实际施工形成的临时掩体备用阵位与撤出路线，不开放永久工事。
evidence: SPEC-M1-STAGE26-INFANTRY-COMPANY-TACTICS-DIFFUSION-RECRUIT-TRAINING-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-002, MIL-EQP-009
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百八十八项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-DIF-001

```text
tech_id: SCI-DIF-001
current_name: 成熟技术扩散与采用
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_OUTPUT, AUTO_DIFFUSION, PREREQUISITE_OVERLOAD
issue_statement: 当前候选改为技术扩散方法，负责知识人员工艺在第二地点复现，与实体生产单元复制和跨工场质量互认分工。
evidence: SPEC-M1-STAGE26-INFANTRY-COMPANY-TACTICS-DIFFUSION-RECRUIT-TRAINING-BATCH-AMENDMENT-001
related_tech_ids: SCI-ARC-001, SCI-TRN-001, QLT-NET-001, IND-SIT-003
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_REPLICATION_BOUNDARY
raised_at: M0正式全树续跑第四百八十九项事实审查
resolution_status: waiting_post_tree_review
```

### UNT-TRN-001

```text
tech_id: UNT-TRN-001
current_name: 新兵基础训练与武器安全
fact_gate: pass_with_tree_review
issue_tags: GENERAL_TRAINING_BOUNDARY, NO_AUTO_TRAINING
issue_statement: 当前候选保留为全军通用新兵基础训练，先形成军人资格，再分流步兵班组与驾驶通信工兵医疗维修专业训练。
evidence: SPEC-M1-STAGE26-INFANTRY-COMPANY-TACTICS-DIFFUSION-RECRUIT-TRAINING-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, MIL-ORG-002, UNT-SPC-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_PERSONNEL_QUALIFICATION
raised_at: M0正式全树续跑第四百九十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-017

```text
tech_id: MIL-EQP-017
current_name: “中坚”中型坦克（中装—01）
fact_gate: defer
issue_tags: MISSING_MILESTONE, MISSING_POWERTRAIN_CHAIN, MISSING_ARMOR_CHAIN, MISSING_GUN_CHAIN, INVALID_TRUCK_PREREQUISITE
issue_statement: ZT-A1中型坦克缺实际轻坦运行反馈与重型装甲动力履带炮塔火炮试验维修链，重卡不能充当前置。
evidence: SPEC-M1-STAGE26-MEDIUM-TANK-AIR-DEFENSE-MISSILE-IFV-TANK-AMMUNITION-ENGINEERING-VEHICLE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-016, MIL-EXT-032
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REMOVE_INVALID_PREREQUISITE
raised_at: M0正式全树续跑第四百九十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-019

```text
tech_id: MIL-EXT-019
current_name: “天幕”近程防空制导弹药（防导弹—01）总体设计
fact_gate: defer
issue_tags: MISSING_ROCKET_MOTOR_CHAIN, MISSING_GUIDANCE_CHAIN, MISSING_FUZE_CHAIN, INTERFACE_CO_DEVELOPMENT
issue_statement: FK-D1近程防空导弹缺火箭发动机制导舵机弹载电源近炸引信与靶试链，与FK-A1共享接口但不互为前置。
evidence: SPEC-M1-STAGE26-MEDIUM-TANK-AIR-DEFENSE-MISSILE-IFV-TANK-AMMUNITION-ENGINEERING-VEHICLE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-018
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, PREVENT_DEPENDENCY_CYCLE
raised_at: M0正式全树续跑第四百九十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-028

```text
tech_id: MIL-EXT-028
current_name: “伴锋”步兵战车（步战—01）总体设计
fact_gate: defer
issue_tags: MISSING_ARMORED_PLATFORM_CHAIN, MISSING_AUTOCANNON_CHAIN, MISSING_TURRET_CHAIN, FALSE_APC_DERIVATION
issue_statement: BZ-A1六乘六步兵战车缺机关炮炮塔供弹瞄准稳定与射击试验链，装甲输送车加班用机枪不能成立。
evidence: SPEC-M1-STAGE26-MEDIUM-TANK-AIR-DEFENSE-MISSILE-IFV-TANK-AMMUNITION-ENGINEERING-VEHICLE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-027
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百九十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-032

```text
tech_id: MIL-EXT-032
current_name: “坚芯”标准坦克炮弹药（坦弹—01）总体设计
fact_gate: defer
issue_tags: MISSING_GUN_INTERFACE, MISSING_AMMUNITION_CHAIN, CALIBER_UNFROZEN, DEPENDENCY_CYCLE_RISK
issue_statement: 当前候选拆为TD-A1C穿甲弹与TD-A1E榴弹，等待坦克炮膛接口和弹体引信药筒底火试验链，不形成万能库存。
evidence: SPEC-M1-STAGE26-MEDIUM-TANK-AIR-DEFENSE-MISSILE-IFV-TANK-AMMUNITION-ENGINEERING-VEHICLE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-016, MIL-EQP-017
blocks_prose: true
provisional_post_review_action: DEFER, ADD_PRODUCT_MODELS, RESTORE_MISSING_RESOURCE_CHAIN, PREVENT_DEPENDENCY_CYCLE
raised_at: M0正式全树续跑第四百九十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-034

```text
tech_id: MIL-EXT-034
current_name: “破障”装甲工程车（装工—01）总体设计
fact_gate: defer
issue_tags: MISSING_CHASSIS_CHAIN, MISSING_WORKING_GEAR_CHAIN, SCOPE_OVERLOAD, FALSE_ENGINEERING_VEHICLE_PREREQUISITE
issue_statement: GC-A1装甲工程车收窄为履带障碍清理车，缺装甲底盘推土铲绞盘驻锄和载荷试验链，不能吞并其他工程装备，ZG-A1保留给昼间侦察观察组。
evidence: SPEC-M1-STAGE26-MEDIUM-TANK-AIR-DEFENSE-MISSILE-IFV-TANK-AMMUNITION-ENGINEERING-VEHICLE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-016, MIL-EQP-019, MIL-EXT-045
blocks_prose: true
provisional_post_review_action: DEFER, NARROW_SCOPE, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第四百九十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-047

```text
tech_id: MIL-EXT-047
current_name: “续机”野战维修装备组（野修—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_PRODUCT, REVERSED_DEPENDENCY, PRODUCT_SCOPE_OVERLAP, AUTO_EQUIPMENT
issue_statement: 当前候选改为野战维修器材，拆清YX-A1拆装支架、YX-B1检修台和YX-C1检测接口三个产品，并删除装甲抢修车反向前置。
evidence: SPEC-M1-STAGE26-FIELD-REPAIR-RECON-ENGINEER-MORTAR-RESEARCH-REVIEW-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, RPR-SHP-001, MIL-EQP-019
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODELS, REWIRE_PREREQUISITE, DEFINE_PRODUCT_BOUNDARY
raised_at: M0正式全树续跑第四百九十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-007

```text
tech_id: MIL-ORG-007
current_name: 侦察与道路警戒编制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERLOAD, AUTO_FORMATION, ROLE_AMBIGUITY
issue_statement: 当前候选收窄为侦察警戒排编制，承担徒步或轻型机动侦察路线观察和警戒屏护，不承担警察执法或预支装甲侦察。
evidence: SPEC-M1-STAGE26-FIELD-REPAIR-RECON-ENGINEER-MORTAR-RESEARCH-REVIEW-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-006, MIL-EXT-029
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE, NARROW_SCOPE
raised_at: M0正式全树续跑第四百九十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-008

```text
tech_id: MIL-ORG-008
current_name: 工程与战场救援编制
fact_gate: pass_with_tree_review
issue_tags: CROSS_ROLE_AGGREGATION, AUTO_FORMATION, MEDICAL_SCOPE_INTRUSION
issue_statement: 当前候选收窄为工兵连编制，只保留工程排障构筑与受困人员现场撤出，完整医疗救治和后送继续独立。
evidence: SPEC-M1-STAGE26-FIELD-REPAIR-RECON-ENGINEER-MORTAR-RESEARCH-REVIEW-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, UNT-TRN-001, MED-TRI-001, MIL-EXT-034
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, DEFINE_FORMATION, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第四百九十八项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-010

```text
tech_id: MIL-ORG-010
current_name: 火力支援编制
fact_gate: pass_with_tree_review
issue_tags: PREMATURE_SCOPE, AUTO_FORMATION, LOGISTICS_AS_KNOWLEDGE
issue_statement: 当前候选收窄为迫击炮排编制，只围绕QP-A1型六十毫米迫击炮形成近程曲射支援，不预支更重型炮兵。
evidence: SPEC-M1-STAGE26-FIELD-REPAIR-RECON-ENGINEER-MORTAR-RESEARCH-REVIEW-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-006, MIL-EQP-004
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE, NARROW_SCOPE
raised_at: M0正式全树续跑第四百九十九项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-REV-001

```text
tech_id: SCI-REV-001
current_name: 科研复核与失败归档
fact_gate: pass_with_tree_review
issue_tags: ADMIN_DETAIL_RISK, AUTO_RESEARCH_CANDIDATE, UNRELATED_PREREQUISITE
issue_statement: 当前候选改为科研失败复盘，必须形成返工改线验证或封存裁决并影响后续选择，不能退化为单纯档案行政节点。
evidence: SPEC-M1-STAGE26-FIELD-REPAIR-RECON-ENGINEER-MORTAR-RESEARCH-REVIEW-BATCH-AMENDMENT-001
related_tech_ids: SCI-PRJ-001, SCI-ARC-001, SCI-DIF-001, QLT-RCL-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, DEFINE_DECISION_EFFECT
raised_at: M0正式全树续跑第五百项事实审查
resolution_status: waiting_post_tree_review
```

### UNT-SPC-001

```text
tech_id: UNT-SPC-001
current_name: 驾驶、通信、工兵、医疗与维修专业训练
fact_gate: pass_with_tree_review
issue_tags: MULTI_SPECIALTY_AGGREGATION, ABSTRACT_TRAINING_OUTPUT, AUTO_QUALIFICATION_RISK
issue_statement: 当前候选保留军队专业训练共同制度，五项训练行动和资格分别明确，各专业知识与装备作为开课条件。
evidence: SPEC-M1-STAGE27-SPECIALIST-TRAINING-SECURITY-MOTORIZED-RECON-DEFENSE-BATCH-AMENDMENT-001
related_tech_ids: UNT-TRN-001, MIL-ORG-008, MIL-ORG-009
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, SPLIT_UNLOCKS, ADD_PERSONNEL_QUALIFICATIONS
raised_at: M0正式全树续跑第五百零一项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-SEC-001

```text
tech_id: LOG-SEC-001
current_name: 危险货物与护运组织
fact_gate: merge_delete
issue_tags: DUPLICATE_TECH, CROSS_DOMAIN_AGGREGATION, ADMIN_ACTION_AS_RESEARCH
issue_statement: 本项重复第20阶段已删除的通用高风险护运节点，危险品规则军事命令高价值任务和运行中断响应必须回到各自系统。
evidence: SPEC-M1-STAGE27-SPECIALIST-TRAINING-SECURITY-MOTORIZED-RECON-DEFENSE-BATCH-AMENDMENT-001
related_tech_ids: TLG-SEC-001, LOG-NET-001, REV-FIS-001, TRD-LOG-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百零二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-009

```text
tech_id: MIL-ORG-009
current_name: 摩托化步兵部队编制
fact_gate: pass_with_tree_review
issue_tags: AUTO_FORMATION, VEHICLE_AS_AUTO_OUTPUT, PREREQUISITE_OVERLOAD
issue_statement: 当前候选改为连级摩托步兵编制，实际步兵轻型军卡驾驶燃料随队维修和训练齐备后才能组建。
evidence: SPEC-M1-STAGE27-SPECIALIST-TRAINING-SECURITY-MOTORIZED-RECON-DEFENSE-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-006, VEH-LTR-001, UNT-SPC-001
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE, ADD_ENTITY_CONDITIONS
raised_at: M0正式全树续跑第五百零三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-011

```text
tech_id: MIL-ORG-011
current_name: 装甲侦察部队编制
fact_gate: defer
issue_tags: MISSING_EQUIPMENT_CHAIN, PREMATURE_FORMATION, ARMORED_RECOVERY_OVERREQUIREMENT
issue_statement: 装甲侦察连等待装甲侦察车成立；装甲抢修车不作知识硬前置，普通维修与拖带可以支撑初代编制但重损回收受限。
evidence: SPEC-M1-STAGE27-SPECIALIST-TRAINING-SECURITY-MOTORIZED-RECON-DEFENSE-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-007, MIL-EQP-015, MIL-EQP-019
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百零四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-001

```text
tech_id: MIL-STYLE-001
current_name: 聚居点区域防御与快速增援
fact_gate: pass_with_tree_review
issue_tags: DOCTRINE_SCOPE_AMBIGUITY, PREREQUISITE_OVERLOAD, AUTO_ADOPTION
issue_statement: 当前候选改为区域机动防御，固定守备与机动预备队围绕同一威胁方向分工，地图道路通信改为采用条件。
evidence: SPEC-M1-STAGE27-SPECIALIST-TRAINING-SECURITY-MOTORIZED-RECON-DEFENSE-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-005, MIL-ORG-006, MIL-ORG-007, MIL-ORG-009
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_ADOPTION_ACTION
raised_at: M0正式全树续跑第五百零五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-002

```text
tech_id: MIL-STYLE-002
current_name: 阵地构筑、纵深迟滞与轮换防御
fact_gate: pass_with_tree_review
issue_tags: PARALLEL_NAME, PREREQUISITE_OVERLOAD, AUTO_FORTIFICATION
issue_statement: 当前候选改为纵深防御学说，阵地迟滞与轮换构成同一方向的防御纵深，仓储医疗补给与实际阵地改为采用条件。
evidence: SPEC-M1-STAGE27-DEFENSE-FIRE-INFILTRATION-AMBUSH-URBAN-BATCH-AMENDMENT-001
related_tech_ids: MIL-STYLE-001, MIL-ORG-005, MIL-ORG-008, MIL-TACTIC-011
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_ADOPTION_ACTION
raised_at: M0正式全树续跑第五百零六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-003

```text
tech_id: MIL-STYLE-003
current_name: 集中火力、观察校射与预备队反击
fact_gate: pass_with_tree_review
issue_tags: CROSS_DOCTRINE_AGGREGATION, PREMATURE_ARTILLERY_SCOPE, TACTIC_DUPLICATION
issue_statement: 当前候选收窄为集中火力学说，只组织六十毫米迫击炮及同级火力，预备队反击归后续独立战术。
evidence: SPEC-M1-STAGE27-DEFENSE-FIRE-INFILTRATION-AMBUSH-URBAN-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-010, MIL-TACTIC-007, MIL-TACTIC-011
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_DUPLICATE_TACTIC
raised_at: M0正式全树续跑第五百零七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-005

```text
tech_id: MIL-STYLE-005
current_name: 分散渗透、隐蔽接敌与短促突击
fact_gate: pass_with_tree_review
issue_tags: MULTI_ACTION_IDENTITY, UNCONTROLLED_DISPERSION_RISK, PREREQUISITE_OVERLOAD
issue_statement: 当前候选改为渗透突击学说，分散接近局部汇合短促突击和按条件脱离属于同一受控行动方法。
evidence: SPEC-M1-STAGE27-DEFENSE-FIRE-INFILTRATION-AMBUSH-URBAN-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-002, MIL-TACTIC-003
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_DOCTRINE_BOUNDARY, ADD_ADOPTION_ACTION
raised_at: M0正式全树续跑第五百零八项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-003

```text
tech_id: MIL-TACTIC-003
current_name: 路线伏击、观察与安全脱离
fact_gate: pass_with_tree_review
issue_tags: MISSION_INTELLIGENCE_AS_TECH, AUTO_ADOPTION, DOCTRINE_TACTIC_OVERLAP
issue_statement: 当前候选改为路线伏击战术，任务所需地图季节道路资料改为现场情报，与广义渗透学说分工。
evidence: SPEC-M1-STAGE27-DEFENSE-FIRE-INFILTRATION-AMBUSH-URBAN-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-007, MIL-ORG-002, MIL-STYLE-005
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, DEFINE_TACTIC_BOUNDARY
raised_at: M0正式全树续跑第五百零九项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-006

```text
tech_id: MIL-TACTIC-006
current_name: 城镇街区封锁、观察与逐点清理
fact_gate: pass_with_tree_review
issue_tags: CIVILIAN_HARM_AMBIGUITY, PREREQUISITE_OVERLOAD, AUTO_CLEARED_STATE
issue_statement: 当前候选改为街区推进战术，保留通路封控逐节点推进排障伤员交接和联络，不产生面向平民的清剿含义或自动控制状态。
evidence: SPEC-M1-STAGE27-DEFENSE-FIRE-INFILTRATION-AMBUSH-URBAN-BATCH-AMENDMENT-001
related_tech_ids: MIL-TACTIC-001, MIL-ORG-008
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, REMOVE_AUTO_STATE
raised_at: M0正式全树续跑第五百一十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-007

```text
tech_id: MIL-TACTIC-007
current_name: 火力观察、目标确认与弹着修正
fact_gate: pass_with_tree_review
issue_tags: TACTIC_DOCTRINE_OVERLAP, AUTO_TARGET, AUTO_HIT_RESULT
issue_statement: 当前候选改为火力校射战术，处理六十毫米迫击炮单任务观察修正停火，并作为多分队集中火力的前置。
evidence: SPEC-M1-STAGE27-FIRE-CORRECTION-ANTIARMOR-SERVICE-EVALUATION-LOGISTICS-LIGHT-ARMOR-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-010, MIL-STYLE-003
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百一十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-009

```text
tech_id: MIL-TACTIC-009
current_name: 反装甲障碍、侧后接敌与近程阻击
fact_gate: defer
issue_tags: MISSING_WEAPON_CHAIN, PREMATURE_TACTIC, AUTO_OBSTACLE, GUARANTEED_KILL_RISK
issue_statement: 近程反装甲战术身份成立，但实际武器缺战斗部发射推进引信和实弹试验链，战术随装备后移。
evidence: SPEC-M1-STAGE27-FIRE-CORRECTION-ANTIARMOR-SERVICE-EVALUATION-LOGISTICS-LIGHT-ARMOR-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-006, MIL-ORG-002, MIL-ORG-008
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百一十二项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-FDB-001

```text
tech_id: MOD-FDB-001
current_name: 生产、训练与实战使用反馈归档
fact_gate: pass_with_tree_review
issue_tags: CAPABILITY_NAME_MISMATCH, ADMIN_ARCHIVE_RISK, ROOT_CAUSE_SCOPE_OVERLAP, AUTO_UPGRADE_REWARD
issue_statement: 当前候选改为装备服役评估，针对具体型号形成稳定性维护负担用途适应性判断，只提出建议查因而不解释根因或自动奖励。
evidence: SPEC-M1-STAGE27-FIRE-CORRECTION-ANTIARMOR-SERVICE-EVALUATION-LOGISTICS-LIGHT-ARMOR-BATCH-AMENDMENT-001
related_tech_ids: QLT-TRC-001, SCI-REV-001, MOD-ANA-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, NARROW_SCOPE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百一十三项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-NET-001

```text
tech_id: LOG-NET-001
current_name: 区域运输网络组织
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_NETWORK_STATE, AUTO_INFRASTRUCTURE, DELETED_PREREQUISITE
issue_statement: 当前候选改为区域运输统筹，通过真实道路车辆仓库转运通信形成多节点干支线和备用路线，不自动生成网络实例或货流。
evidence: SPEC-M1-STAGE27-FIRE-CORRECTION-ANTIARMOR-SERVICE-EVALUATION-LOGISTICS-LIGHT-ARMOR-BATCH-AMENDMENT-001
related_tech_ids: LOG-DSP-001, LOG-BRG-001, LOG-SEC-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第五百一十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-012

```text
tech_id: MIL-ORG-012
current_name: 轻型装甲部队编制
fact_gate: defer
issue_tags: MISSING_TANK_CHAIN, PREMATURE_FORMATION, ARMORED_RECOVERY_OVERREQUIREMENT
issue_statement: 轻型装甲连等待轻型坦克成立；装甲侦察连与装甲抢修车均不作知识硬前置，真实车组弹药燃料维修拖带是组建条件。
evidence: SPEC-M1-STAGE27-FIRE-CORRECTION-ANTIARMOR-SERVICE-EVALUATION-LOGISTICS-LIGHT-ARMOR-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-016, MIL-ORG-011, MIL-EQP-019
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, DEFINE_FORMATION, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百一十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-004

```text
tech_id: MIL-STYLE-004
current_name: 道路机动、侧翼展开与车队连续补给
fact_gate: pass_with_tree_review
issue_tags: MULTI_ACTION_IDENTITY, PREREQUISITE_OVERLOAD, AUTO_CONVOY
issue_statement: 当前候选改为道路机动学说，成建制转移侧翼展开和随队保障共同维持同一次机动，道路车辆燃料维修改为采用条件。
evidence: SPEC-M1-STAGE27-MOBILITY-DISMOUNT-RESERVE-ROOT-CAUSE-FISCAL-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-009, MIL-TACTIC-008, LOG-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_ADOPTION_ACTION
raised_at: M0正式全树续跑第五百一十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-008

```text
tech_id: MIL-TACTIC-008
current_name: 道路机动、下车展开与车辆隐蔽
fact_gate: pass_with_tree_review
issue_tags: DOCTRINE_TACTIC_OVERLAP, TRUCK_AS_ARMORED_PLATFORM, AUTO_DEPLOYMENT
issue_statement: 当前候选收窄为下车展开战术，保持步兵编组车辆隐蔽待命和重新登车关系，普通卡车不作装甲掩护。
evidence: SPEC-M1-STAGE27-MOBILITY-DISMOUNT-RESERVE-ROOT-CAUSE-FISCAL-BATCH-AMENDMENT-001
related_tech_ids: MIL-STYLE-004, MIL-ORG-009
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_ADOPTION_ACTION
raised_at: M0正式全树续跑第五百一十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-011

```text
tech_id: MIL-TACTIC-011
current_name: 预备队接替、局部反击与有序脱离
fact_gate: pass_with_tree_review
issue_tags: MULTI_ACTION_IDENTITY, AUTO_RESERVE, GUARANTEED_COUNTERATTACK_RISK
issue_statement: 当前候选改为预备队运用战术，接替有限反击和掩护脱离是同一预备力量的条件选择，并成为反击范围唯一归属。
evidence: SPEC-M1-STAGE27-MOBILITY-DISMOUNT-RESERVE-ROOT-CAUSE-FISCAL-BATCH-AMENDMENT-001
related_tech_ids: MIL-STYLE-002, MIL-STYLE-003
blocks_prose: false
provisional_post_review_action: RENAME, DEFINE_TACTIC_BOUNDARY, REMOVE_DUPLICATE_SCOPE
raised_at: M0正式全树续跑第五百一十八项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-ANA-001

```text
tech_id: MOD-ANA-001
current_name: 故障根因、使用错误与设计缺陷区分
fact_gate: pass_with_tree_review
issue_tags: ROOT_CAUSE_SCOPE, DIAGNOSTIC_OVERLAP, AUTO_FIX_RISK
issue_statement: 当前候选改为装备根因分析，解释型号重复问题来自生产训练补给维护环境或设计，但不直接提出改型方案。
evidence: SPEC-M1-STAGE27-MOBILITY-DISMOUNT-RESERVE-ROOT-CAUSE-FISCAL-BATCH-AMENDMENT-001
related_tech_ids: MOD-FDB-001, RPR-DIA-001, MOD-TST-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百一十九项事实审查
resolution_status: waiting_post_tree_review
```

### REV-FIS-001

```text
tech_id: REV-FIS-001
current_name: 地方财政与中央收入体系
fact_gate: merge_delete
issue_tags: DUPLICATE_BUDGET_TECH, DUPLICATE_REVENUE_TECH, POLICY_AS_RESEARCH, LOGISTICS_AS_FISCAL_TECH
issue_statement: 地方预算留用中央平衡已由区域预算覆盖，申报征收退补已由收入征收覆盖，分成最低保留归法律政策，实物运送归物流。
evidence: SPEC-M1-STAGE27-MOBILITY-DISMOUNT-RESERVE-ROOT-CAUSE-FISCAL-BATCH-AMENDMENT-001
related_tech_ids: GOV-ACC-001, ECO-REV-001, LOG-NET-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百二十项事实审查
resolution_status: waiting_post_tree_review
```

### EMR-MGT-R6-001

```text
tech_id: EMR-MGT-R6-001
current_name: 灾害预警、损害评估与恢复管理
fact_gate: pass_with_tree_review
issue_tags: CROSS_PHASE_AGGREGATION, OUTPUT_TYPE_ERROR, AUTO_DISASTER_RESULT, INVALID_PREREQUISITE
issue_statement: 当前候选改为灾害应急管理，统一具体事件的预警确认现场损害应急恢复优先和复盘，但不替代专业抢修或长期重建。
evidence: SPEC-M1-STAGE28-DISASTER-MEDIUM-ARMOR-COMBINED-ARMS-BREAKTHROUGH-VALIDATION-BATCH-AMENDMENT-001
related_tech_ids: SET-SUR-001-A, CNS-RPR-001, EMR-REC-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, NARROW_SCOPE
raised_at: M0正式全树续跑第五百二十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-013

```text
tech_id: MIL-ORG-013
current_name: 中型装甲部队编制
fact_gate: defer
issue_tags: MISSING_MEDIUM_TANK_CHAIN, MISSING_LIGHT_ARMOR_EXPERIENCE, AUTO_LOGISTICS
issue_statement: 中型装甲连等待中型坦克和轻型装甲真实运行经验，实际弹药燃料维修拖救重载运输均为组建条件。
evidence: SPEC-M1-STAGE28-DISASTER-MEDIUM-ARMOR-COMBINED-ARMS-BREAKTHROUGH-VALIDATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-017, MIL-ORG-012, MIL-ORG-014
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, DEFINE_FORMATION
raised_at: M0正式全树续跑第五百二十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-STYLE-006

```text
tech_id: MIL-STYLE-006
current_name: 步兵、工兵、火力与装甲协同
fact_gate: defer
issue_tags: MISSING_ARMORED_FORCE, UNVALIDATED_DOCTRINE, AUTO_COMBINED_ARMS
issue_statement: 合成作战学说身份成立，但没有实际轻型装甲部队便不能联合演习验证，学说整体后移。
evidence: SPEC-M1-STAGE28-DISASTER-MEDIUM-ARMOR-COMBINED-ARMS-BREAKTHROUGH-VALIDATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-006, MIL-ORG-008, MIL-ORG-010, MIL-ORG-012
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, DEFINE_DOCTRINE_BOUNDARY
raised_at: M0正式全树续跑第五百二十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-010

```text
tech_id: MIL-TACTIC-010
current_name: 装甲突破、步兵跟进与工兵开路
fact_gate: defer
issue_tags: MISSING_ARMORED_FORCE, MISSING_PARENT_DOCTRINE, AUTO_BREAKTHROUGH_RESULT
issue_statement: 装甲突破战术等待实际装甲部队和合成作战学说，车辆穿过障碍不等于形成可供后续部队使用的突破口。
evidence: SPEC-M1-STAGE28-DISASTER-MEDIUM-ARMOR-COMBINED-ARMS-BREAKTHROUGH-VALIDATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-STYLE-006, MIL-ORG-012
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, REMOVE_AUTO_RESULT
raised_at: M0正式全树续跑第五百二十四项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-TST-001

```text
tech_id: MOD-TST-001
current_name: 对照样机、极限工况与寿命验证
fact_gate: pass_with_tree_review
issue_tags: ADMIN_TEST_RECORD_RISK, AUTO_VALIDATION, AUTO_RETYPE
issue_statement: 当前候选改为装备验证试验，以真实基准型号和改动样机完成对照极限和耐久试验，不自动证明改型成功或重新定型。
evidence: SPEC-M1-STAGE28-DISASTER-MEDIUM-ARMOR-COMBINED-ARMS-BREAKTHROUGH-VALIDATION-BATCH-AMENDMENT-001
related_tech_ids: MOD-ANA-001, MOD-CHG-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百二十五项事实审查
resolution_status: waiting_post_tree_review
```

### REV-CST-001

```text
tech_id: REV-CST-001
current_name: 行政、驻防、基础设施与救援成本归集
fact_gate: merge_delete
issue_tags: DUPLICATE_BUDGET_TECH, ACCOUNTING_VIEW_AS_RESEARCH, ADMIN_DETAIL
issue_statement: 地方维持成本并入区域预算和统一核算，净贡献为实际收入减维持成本，受控地区成本账只是展示视图。
evidence: SPEC-M1-STAGE28-COST-REPAIR-TRADE-ROUTE-COMBAT-REVIEW-RECONSTRUCTION-BATCH-AMENDMENT-001
related_tech_ids: GOV-ACC-001, REV-FIS-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百二十六项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-NET-001

```text
tech_id: RPR-NET-001
current_name: 区域维修协作网络
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_NETWORK_STATE, REMANUFACTURING_OVERREQUIREMENT, AUTO_REPAIR
issue_statement: 当前候选改为区域维修统筹，按现场节点中心三级分工调度维修能力设备备件，实际再制造只扩展范围。
evidence: SPEC-M1-STAGE28-COST-REPAIR-TRADE-ROUTE-COMBAT-REVIEW-RECONSTRUCTION-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, RPR-SHP-001, LOG-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第五百二十七项事实审查
resolution_status: waiting_post_tree_review
```

### TRD-LOG-001

```text
tech_id: TRD-LOG-001
current_name: 商路仓储、转运与共同护运安排
fact_gate: pass_with_tree_review
issue_tags: CROSS_DOMAIN_AGGREGATION, ESCORT_TECH_REINTRODUCTION, AUTO_TRADE_ROUTE
issue_statement: 当前候选改为常态商路组织，只负责跨势力路线交接转运和中断改线，护运回到任务政策和实际兵力。
evidence: SPEC-M1-STAGE28-COST-REPAIR-TRADE-ROUTE-COMBAT-REVIEW-RECONSTRUCTION-BATCH-AMENDMENT-001
related_tech_ids: TRD-FRM-001, LOG-NET-001, LOG-SEC-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百二十八项事实审查
resolution_status: waiting_post_tree_review
```

### CBT-EXP-001

```text
tech_id: CBT-EXP-001
current_name: 战斗经验评估与军事改进
fact_gate: pass_with_tree_review
issue_tags: TEMPLATE_OUTPUT_POLLUTION, ADMIN_REPORT_RISK, AUTO_EXPERIENCE_REWARD
issue_statement: 当前候选改为战斗复盘方法，评估一场战斗的训练指挥战术装备保障环境关系，不保留模板污染或自动经验奖励。
evidence: SPEC-M1-STAGE28-COST-REPAIR-TRADE-ROUTE-COMBAT-REVIEW-RECONSTRUCTION-BATCH-AMENDMENT-001
related_tech_ids: MIL-ORG-R6-001, MOD-FDB-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, NARROW_SCOPE
raised_at: M0正式全树续跑第五百二十九项事实审查
resolution_status: waiting_post_tree_review
```

### EMR-REC-001

```text
tech_id: EMR-REC-001
current_name: 灾后住房、基础设施与生计重建排序
fact_gate: pass_with_tree_review
issue_tags: EMERGENCY_RECONSTRUCTION_OVERLAP, OUTPUT_TYPE_ERROR, AUTO_REBUILD_RESULT
issue_statement: 当前候选改为灾后重建规划，承接应急稳定后的住房基础设施生计组合与项目次序，不自动建成或让居民返回。
evidence: SPEC-M1-STAGE28-COST-REPAIR-TRADE-ROUTE-COMBAT-REVIEW-RECONSTRUCTION-BATCH-AMENDMENT-001
related_tech_ids: EMR-MGT-R6-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百三十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-018

```text
tech_id: MIL-EQP-018
current_name: “镇垒”重型坦克（重装—01）
fact_gate: defer
issue_tags: PREMATURE_TECH, MISSING_MILESTONE, MISSING_RESOURCE_CHAIN, PRODUCT_IDENTITY_REPAIR
issue_statement: HT-A1重型坦克等待中坦经验厚装甲重型传动炮塔火炮弹药总装试验和重载保障链，炮口径不提前冻结。
evidence: SPEC-M1-STAGE28-HEAVY-TANK-CHANGE-TRADE-INFORMATION-HEAVY-COMPANY-LINE-CHANGE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-017, MIL-EXT-032, MIL-ORG-014
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第五百三十一项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-CHG-001

```text
tech_id: MOD-CHG-001
current_name: 工程变更、受影响范围与重新定型
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, WRONG_OUTPUT_TYPE, ADMIN_FRAGMENT
issue_statement: 工程变更分级图纸修订同代跨代换型重新定型兼容关系已由产品改型管理覆盖，装备验证结论直接成为其输入。
evidence: SPEC-M1-STAGE28-HEAVY-TANK-CHANGE-TRADE-INFORMATION-HEAVY-COMPANY-LINE-CHANGE-BATCH-AMENDMENT-001
related_tech_ids: QLT-CHG-001, MOD-TST-001, MOD-LIN-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百三十二项事实审查
resolution_status: waiting_post_tree_review
```

### TRD-MKT-001

```text
tech_id: TRD-MKT-001
current_name: 多节点报价、库存信息与替代来源发现
fact_gate: pass_with_tree_review
issue_tags: WRONG_PRECONDITION, AUTO_INSTANCE, WRONG_OUTPUT_TYPE, ABSTRACT_NETWORK
issue_statement: 当前候选改为贸易信息核验，比较报价库存承诺时效可信度和替代来源，不自动建立贸易网络或生成货源。
evidence: SPEC-M1-STAGE28-HEAVY-TANK-CHANGE-TRADE-INFORMATION-HEAVY-COMPANY-LINE-CHANGE-BATCH-AMENDMENT-001
related_tech_ids: TRD-LOG-001, TRD-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第五百三十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-014

```text
tech_id: MIL-ORG-014
current_name: 重型装甲支援部队编制
fact_gate: defer
issue_tags: PREMATURE_ORGANIZATION, MISSING_MILESTONE, AUTO_FORMATION
issue_statement: 重型坦克连等待HT-A1和中型装甲真实经验，重载运输专用维修拖救桥涵工场改为实际组建条件。
evidence: SPEC-M1-STAGE28-HEAVY-TANK-CHANGE-TRADE-INFORMATION-HEAVY-COMPANY-LINE-CHANGE-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-018, MIL-ORG-013
blocks_prose: true
provisional_post_review_action: DEFER, RENAME, DEFINE_FORMATION
raised_at: M0正式全树续跑第五百三十四项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-LIN-001

```text
tech_id: MOD-LIN-001
current_name: 生产线改装、工装更换与熟练度迁移
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, WRONG_OUTPUT_TYPE, REDUNDANT_CHANGEOVER_NODE
issue_statement: 相容设备换产已由生产换产组织覆盖，超出设备公辅边界的改造归生产单元改造，型号版本归产品改型管理。
evidence: SPEC-M1-STAGE28-HEAVY-TANK-CHANGE-TRADE-INFORMATION-HEAVY-COMPANY-LINE-CHANGE-BATCH-AMENDMENT-001
related_tech_ids: IND-CON-001, IND-REF-001, QLT-CHG-001, MOD-FLD-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百三十五项事实审查
resolution_status: waiting_post_tree_review
```

### TRD-NET-001

```text
tech_id: TRD-NET-001
current_name: 长期供应合同、共同标准与区域贸易网
fact_gate: merge_delete
issue_tags: ADMIN_FRAGMENT, DUPLICATE_CAPABILITY, AUTO_NETWORK_INSTANCE, WRONG_OUTPUT_TYPE
issue_statement: 长期协议归外交贸易行动，共同标准归质量互认，区域贸易网是多条实际商路协议履约关系形成的状态，不另设科研。
evidence: SPEC-M1-STAGE28-TRADE-NETWORK-FIELDING-RETIREMENT-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: TRD-LOG-001, TRD-MKT-001, QLT-NET-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第五百三十六项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-FLD-001

```text
tech_id: MOD-FLD-001
current_name: 分批换装、训练转换与新旧库存并存
fact_gate: pass_with_tree_review
issue_tags: WRONG_OUTPUT_TYPE, MECHANICAL_PREREQUISITES, AUTO_ACTION_RISK
issue_statement: 当前候选改为分批换装组织，按部队优先级投入实际新装备与训练资源，旧装备交回后进入独立转用判断。
evidence: SPEC-M1-STAGE28-TRADE-NETWORK-FIELDING-RETIREMENT-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: QLT-CHG-001, MIL-ORG-R6-001, MOD-RTR-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第五百三十七项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-RTR-001

```text
tech_id: MOD-RTR-001
current_name: 旧型号改装、降级使用与后备转用
fact_gate: pass_with_tree_review
issue_tags: ABSTRACT_RECORD_OUTPUT, LIFECYCLE_BRANCH_MIX, AUTO_REPAIR_RISK
issue_statement: 当前候选改为旧装备转用，对具体旧装备批次选择守备训练封存拆件或报废，保留原型号磨损历史和能力限制。
evidence: SPEC-M1-STAGE28-TRADE-NETWORK-FIELDING-RETIREMENT-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: MOD-FLD-001, MOD-RCY-001
blocks_prose: false
provisional_post_review_action: RENAME, SPLIT_ACTIONS, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第五百三十八项事实审查
resolution_status: waiting_post_tree_review
```

### MOD-RCY-001

```text
tech_id: MOD-RCY-001
current_name: 退役拆解、材料回收与危险品处置
fact_gate: merge_delete
issue_tags: DUPLICATE_RECOVERY_CHAIN, WRONG_OUTPUT_TYPE, ADMIN_FRAGMENT
issue_statement: 退役入口并入旧装备转用，部件材料和危险物分别进入既有再制造分级回收危废运输隔离体系，不保留独立科研。
evidence: SPEC-M1-STAGE28-TRADE-NETWORK-FIELDING-RETIREMENT-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: MOD-RTR-001, RAW-SCR-001, WSE-REC-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RETURN_POINTS, REWIRE_RECOVERY_ACTIONS
raised_at: M0正式全树续跑第五百三十九项事实审查
resolution_status: waiting_post_tree_review
```

### MED-REH-001

```text
tech_id: MED-REH-001
current_name: 康复与长期照护组织
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, SCOPE_CLARIFICATION
issue_statement: 当前候选保留康复期功能变化随访器具适配和劳动限制，长期稳定照护并行承担；删除工装外科全选前置。
evidence: SPEC-M1-STAGE21-REHABILITATION-LOAD-BEARING-POLICE-MODEL-CHANGE-LOCAL-COST-BATCH-AMENDMENT-001
related_tech_ids: POP-HEA-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百九十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-008

```text
tech_id: MIL-EQP-008
current_name: “行装”单兵防护与负载携行套装（单装—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_OVERCONSTRAINT, MISSING_BALLISTIC_MATERIAL_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选收窄为“行装”单装—01帆布携行套装，明确不防枪弹破片；防弹部件等待高强钢陶瓷或高性能纤维链。
evidence: SPEC-M1-STAGE21-REHABILITATION-LOAD-BEARING-POLICE-MODEL-CHANGE-LOCAL-COST-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RESTORE_BALLISTIC_CHAIN
raised_at: M0正式全树续跑第三百九十七项事实审查
resolution_status: waiting_post_tree_review
```

### POL-PAT-001

```text
tech_id: POL-PAT-001
current_name: 地点巡逻、现场隔离与初步处置方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, LEGAL_AUTHORITY_BOUNDARY, AUTO_INSTANCE_ERROR
issue_statement: 当前候选将巡逻隔离初处移交合为一项基础警务方法，明确法律授权是强制措施前提，训练不自动扩大警权。
evidence: SPEC-M1-STAGE21-REHABILITATION-LOAD-BEARING-POLICE-MODEL-CHANGE-LOCAL-COST-BATCH-AMENDMENT-001
related_tech_ids: GOV-ADM-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百九十八项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-CHG-001

```text
tech_id: QLT-CHG-001
current_name: 设计改型、工艺变更与重新定型
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选保留修订同代改型跨代换型对旧库存工装备件维护资料的兼容关系，删除召回与三类工装全选前置。
evidence: SPEC-M1-STAGE21-REHABILITATION-LOAD-BEARING-POLICE-MODEL-CHANGE-LOCAL-COST-BATCH-AMENDMENT-001
related_tech_ids: QLT-TRC-001, MCH-JIG-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百九十九项事实审查
resolution_status: waiting_post_tree_review
```

### REV-OUT-001

```text
tech_id: REV-OUT-001
current_name: 地方生产、消费与维护成本核算
fact_gate: merge_delete
issue_tags: DUPLICATE_TECH, LOW_PLAYER_VALUE, SYSTEM_CALCULATION_NOT_TECH, AUTO_INSTANCE_ERROR
issue_statement: 该节点只是把既有产出消费维护库存字段送入预算，没有新玩家能力。当前并入区域预算与统一资源结算。
evidence: SPEC-M1-STAGE21-REHABILITATION-LOAD-BEARING-POLICE-MODEL-CHANGE-LOCAL-COST-BATCH-AMENDMENT-001
related_tech_ids: GOV-ACC-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第四百项事实审查
resolution_status: waiting_post_tree_review
```

### GOV-ACC-001

```text
tech_id: GOV-ACC-001
current_name: 地方预算、公共账目与中央转移支付
fact_gate: pass_with_tree_review
issue_tags: SCOPE_CLARIFICATION, AUTO_INSTANCE_ERROR, ECONOMIC_MODEL_MISMATCH
issue_statement: 当前候选保留多地预算与中央平衡，将转移支付拆为货币拨付与实物调拨，虚假纸面支出保持未落实。
evidence: SPEC-M1-STAGE21-BUDGET-PRODUCTION-COPY-SHEET-METAL-MACHINE-TOOL-REPLICATION-BATCH-AMENDMENT-001
related_tech_ids: GOV-ADM-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百九十一项事实审查
resolution_status: waiting_post_tree_review
```

### IND-SIT-003

```text
tech_id: IND-SIT-003
current_name: 标准生产单元复制与工装复用方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, AUTO_INSTANCE_ERROR, MILESTONE_CLARIFICATION
issue_statement: 当前候选保留跨地点复制整套设备工装公辅人员能力，和厂房扩建及单条产品线批产验证分层。
evidence: SPEC-M1-STAGE21-BUDGET-PRODUCTION-COPY-SHEET-METAL-MACHINE-TOOL-REPLICATION-BATCH-AMENDMENT-001
related_tech_ids: IND-SIT-002, MCH-JIG-001-C, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百九十二项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-FRM-001

```text
tech_id: MCH-FRM-001
current_name: 压力机、冲压与板金成形
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, PRODUCT_IDENTITY_MISSING, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选限定1至3毫米Q235B薄板，项目钣金件按BJ01编号；删除棒线管全选与万能板金件身份。
evidence: SPEC-M1-STAGE21-BUDGET-PRODUCTION-COPY-SHEET-METAL-MACHINE-TOOL-REPLICATION-BATCH-AMENDMENT-001
related_tech_ids: MCH-JIG-001, MET-ROL-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PROJECT_PRODUCT_RULE, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百九十三项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-RPL-001-A

```text
tech_id: MCH-RPL-001-A
current_name: 基础机床部件制造制备工艺
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, BOOTSTRAP_DEPENDENCY
issue_statement: 当前候选交付按目标机床编号的床身主轴导轨进给关键部件族，首批由恢复遗产机床制造，高精度件仍待补链。
evidence: SPEC-M1-STAGE21-BUDGET-PRODUCTION-COPY-SHEET-METAL-MACHINE-TOOL-REPLICATION-BATCH-AMENDMENT-001
related_tech_ids: MCH-LAT-001, MCH-GAG-001, MCH-JIG-001, MET-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_RULE, REWIRE_PREREQUISITE, RESTORE_COMPONENT_CHAIN
raised_at: M0正式全树续跑第三百九十四项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-RPL-001-B

```text
tech_id: MCH-RPL-001-B
current_name: 整机复制制备工艺
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, BOOTSTRAP_DEPENDENCY
issue_statement: 当前候选交付CA-B1普通车床与ZX-B1钻铣床，关键部件先由394形成，遗产高精度件保留来源记录。
evidence: SPEC-M1-STAGE21-BUDGET-PRODUCTION-COPY-SHEET-METAL-MACHINE-TOOL-REPLICATION-BATCH-AMENDMENT-001
related_tech_ids: MCH-RPL-001-A, MCH-JIG-001-C, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百九十五项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-COO-001-B

```text
tech_id: CIV-COO-001-B
current_name: 餐具设计
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, PREREQUISITE_OVERCONSTRAINT, AUTO_INSTANCE_ERROR
issue_statement: 当前候选交付CW-A1无涂层硬木碗盘匙组，不假定不锈钢聚合物或安全涂层链，删除有色金属全选前置。
evidence: SPEC-M1-STAGE21-TABLEWARE-FOOD-CONTACT-WOOD-GLASS-BATCH-AMENDMENT-001
related_tech_ids: RSC-SAW-001-A, MCH-HND-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百八十六项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-COO-001-C

```text
tech_id: CIV-COO-001-C
current_name: 食品接触材料安全检验
fact_gate: pass_with_tree_review
issue_tags: AUTO_INSTANCE_ERROR, UNLOCK_MISMATCH, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前候选保留迁移腐蚀残留热循环的跨材料放行能力，删除自动生成炊具餐具产品及材料全选前置。
evidence: SPEC-M1-STAGE21-TABLEWARE-FOOD-CONTACT-WOOD-GLASS-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百八十七项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-FUR-001-A

```text
tech_id: CIV-FUR-001-A
current_name: 木质构件制作
fact_gate: merge_delete
issue_tags: DUPLICATE_TECH, SCOPE_AMBIGUOUS, PRODUCT_IDENTITY_MISSING, PREREQUISITE_OVERCONSTRAINT
issue_statement: 木质构件无法稳定指向锯材板材家具坯件或建筑构件，上游锯材已含用途分级。当前合并删除并由具体产品项目承接。
evidence: SPEC-M1-STAGE21-TABLEWARE-FOOD-CONTACT-WOOD-GLASS-BATCH-AMENDMENT-001
related_tech_ids: RSC-SAW-001-A, CIV-FUR-001-B
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百八十八项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-GLS-001-D

```text
tech_id: CNS-GLS-001-D
current_name: 容器玻璃成形
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, PROCESS_ORDER_REVIEW, AUTO_INSTANCE_ERROR
issue_statement: 当前候选交付RP-A1钠钙玻璃窄口瓶与RG-A1广口罐，固定熔制成形退火检验顺序，包装用途分别放行。
evidence: SPEC-M1-STAGE21-TABLEWARE-FOOD-CONTACT-WOOD-GLASS-BATCH-AMENDMENT-001
related_tech_ids: CNS-GLS-BASE-001-B, CNS-GLS-BASE-001-C, MCH-JIG-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百八十九项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-GLS-001-E

```text
tech_id: CNS-GLS-001-E
current_name: 平板玻璃成形
fact_gate: merge_delete
issue_tags: DUPLICATE_TECH, DUPLICATE_PRODUCT, LOW_PLAYER_VALUE
issue_statement: 与Stage18已通过MAT-GLS-001在原料设备工艺产品上完全重复，仪表防护片不足以构成第二项成形科技。当前合并删除。
evidence: SPEC-M1-STAGE21-TABLEWARE-FOOD-CONTACT-WOOD-GLASS-BATCH-AMENDMENT-001
related_tech_ids: MAT-GLS-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百九十项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-BND-001-B

```text
tech_id: CHM-BND-001-B
current_name: 胶黏剂配制
fact_gate: defer
issue_tags: PRODUCT_IDENTITY_MISSING, MISSING_RESOURCE_CHAIN, PREREQUISITE_INVALID
issue_statement: PF-01模塑树脂不能等同胶黏剂级可溶树脂。候选收窄为PF-W01耐水木材酚醛胶并在载体固化体系补齐前后移。
evidence: SPEC-M1-STAGE21-ADHESIVE-SEALANT-CORROSION-CHEMICAL-STORAGE-COOKWARE-BATCH-AMENDMENT-001
related_tech_ids: MAT-POL-001
blocks_prose: true
provisional_post_review_action: DEFER, NARROW_SCOPE, ADD_PRODUCT_GRADE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百八十一项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-BND-001-C

```text
tech_id: CHM-BND-001-C
current_name: 密封剂配制
fact_gate: defer
issue_tags: PRODUCT_IDENTITY_MISSING, MISSING_RESOURCE_CHAIN, PREREQUISITE_INVALID
issue_statement: 当前没有稳定沥青与相容填料链，再生橡胶不能直接成为密封剂。候选收窄为建筑用沥青嵌缝膏并后移。
evidence: SPEC-M1-STAGE21-ADHESIVE-SEALANT-CORROSION-CHEMICAL-STORAGE-COOKWARE-BATCH-AMENDMENT-001
related_tech_ids: CHM-POL-001-A
blocks_prose: true
provisional_post_review_action: DEFER, NARROW_SCOPE, ADD_PRODUCT_IDENTITY, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百八十二项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-BND-001-D

```text
tech_id: CHM-BND-001-D
current_name: 金属防腐处理
fact_gate: defer_with_demotion
issue_tags: SCOPE_OVERBROAD, MISSING_RESOURCE_CHAIN, PREREQUISITE_INVALID, DUPLICATE_MAINTENANCE
issue_statement: 泛称防腐混合油封发黑磷化涂漆镀层多条路线。临时油封并入维护，耐久候选收窄为热浸镀锌并在锌链补齐前后移。
evidence: SPEC-M1-STAGE21-ADHESIVE-SEALANT-CORROSION-CHEMICAL-STORAGE-COOKWARE-BATCH-AMENDMENT-001
related_tech_ids: RPR-PMV-001, CHM-BND-001-A
blocks_prose: true
provisional_post_review_action: DEFER, DEMOTE_MAINTENANCE, NARROW_SCOPE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百八十三项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-NET-001

```text
tech_id: CHM-NET-001
current_name: 区域化工与危险物管理
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, DUPLICATE_SCOPE, AUTO_INSTANCE_ERROR
issue_statement: 当前候选只保留化学品相容分区与事故隔离，和通用追溯危险品运输及法律责任分开；删除产品全选前置。
evidence: SPEC-M1-STAGE21-ADHESIVE-SEALANT-CORROSION-CHEMICAL-STORAGE-COOKWARE-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, TLG-SLT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百八十四项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-COO-001-A

```text
tech_id: CIV-COO-001-A
current_name: 炊具设计
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, PREREQUISITE_OVERCONSTRAINT, MISSING_RESOURCE_CHAIN, AUTO_INSTANCE_ERROR
issue_statement: 当前候选交付CJ-A1型HT150炒锅与炖锅组，删除聚合物食品处理和有色金属全选前置；HT150稳定炉次仍待补链。
evidence: SPEC-M1-STAGE21-ADHESIVE-SEALANT-CORROSION-CHEMICAL-STORAGE-COOKWARE-BATCH-AMENDMENT-001
related_tech_ids: MET-CAS-001-A, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百八十五项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-JIG-001-C

```text
tech_id: MCH-JIG-001-C
current_name: 批量工装设计
fact_gate: pass_with_tree_review
issue_tags: PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR, MILESTONE_CLARIFICATION
issue_statement: 当前候选作为基础工艺装备的后继，增加成组工位检具防错与节拍验证；具体工装组按项目BT01编号，不保留万能批量工装。
evidence: SPEC-M1-STAGE20-BATCH-TOOLING-MEDICAL-NETWORK-AUTHORITY-ACCESSIBILITY-COATING-BATCH-AMENDMENT-001
related_tech_ids: MCH-JIG-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PROJECT_ASSET_IDENTITY, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百七十六项事实审查
resolution_status: waiting_post_tree_review
```

### MED-NET-001

```text
tech_id: MED-NET-001
current_name: 区域医疗转诊网络
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选保留多地接收确认患者样品记录转移关系，删除传染病外科和药品作为所有转诊的强制前置。
evidence: SPEC-M1-STAGE20-BATCH-TOOLING-MEDICAL-NETWORK-AUTHORITY-ACCESSIBILITY-COATING-BATCH-AMENDMENT-001
related_tech_ids: SET-NET-001, HLT-EMS-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百七十七项事实审查
resolution_status: waiting_post_tree_review
```

### STA-PWR-001

```text
tech_id: STA-PWR-001
current_name: 中央与地方权限、执行责任与禁止事项划分
fact_gate: merge_demote_delete
issue_tags: DUPLICATE_TECH, NOT_RESEARCH_TECH, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 区域行政统合已包含中央地方边界，权限表属于法律标准，机构与越权案件来自实际运行。当前节点合并下沉删除。
evidence: SPEC-M1-STAGE20-BATCH-TOOLING-MEDICAL-NETWORK-AUTHORITY-ACCESSIBILITY-COATING-BATCH-AMENDMENT-001
related_tech_ids: GOV-ADM-001
blocks_prose: true
provisional_post_review_action: MERGE_DEMOTE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百七十八项事实审查
resolution_status: waiting_post_tree_review
```

### URB-ACC-001

```text
tech_id: URB-ACC-001
current_name: 学校、医疗、照护与行政设施无障碍配置
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR, SCOPE_CLARIFICATION
issue_statement: 当前候选统一公共设施入口与内部连续通行，不按设施类型拆分；街区道路只负责公共道路及坡道接口。
evidence: SPEC-M1-STAGE20-BATCH-TOOLING-MEDICAL-NETWORK-AUTHORITY-ACCESSIBILITY-COATING-BATCH-AMENDMENT-001
related_tech_ids: URB-RAD-001, CNS-STR-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百七十九项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-BND-001-A

```text
tech_id: CHM-BND-001-A
current_name: 工业涂料配制
fact_gate: defer
issue_tags: PRODUCT_IDENTITY_MISSING, MISSING_RESOURCE_CHAIN, PREREQUISITE_INVALID, STAGE_MISMATCH
issue_statement: 当前树缺醇酸树脂干性油涂料溶剂与铁红颜料，PF-01不能冒充涂料树脂。候选收窄为铁红醇酸防锈底漆并后移。
evidence: SPEC-M1-STAGE20-BATCH-TOOLING-MEDICAL-NETWORK-AUTHORITY-ACCESSIBILITY-COATING-BATCH-AMENDMENT-001
related_tech_ids: MAT-POL-001
blocks_prose: true
provisional_post_review_action: DEFER, NARROW_SCOPE, ADD_PRODUCT_IDENTITY, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百八十项事实审查
resolution_status: waiting_post_tree_review
```

### GOV-ADM-001

```text
tech_id: GOV-ADM-001
current_name: 多聚居点行政与地方统合
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_OVERCONSTRAINT, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, GOVERNANCE_BOUNDARY
issue_statement: 当前候选保留多聚居点统一行政口径，明确地方只有执行自治，外交军队货币战略资源仍归中央；删除九项过度前置。
evidence: SPEC-M1-STAGE20-ADMINISTRATION-OUTBREAK-REINFORCED-POLYMER-TOOLING-BATCH-AMENDMENT-001
related_tech_ids: POP-STA-001, GOV-SUR-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百七十一项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-OUT-001

```text
tech_id: HLT-OUT-001
current_name: 暴发调查、病例定义、实验室确认与解除
fact_gate: merge_delete
issue_tags: DUPLICATE_TECH, PREREQUISITE_INVALID, POLICY_BOUNDARY, AUTO_INSTANCE_ERROR
issue_statement: 病例定义传播链暴发风险与技术解除已经由传染病监测覆盖，实验室确认和强制措施也各有承接。本项没有独立玩家里程碑，合并删除。
evidence: SPEC-M1-STAGE20-ADMINISTRATION-OUTBREAK-REINFORCED-POLYMER-TOOLING-BATCH-AMENDMENT-001
related_tech_ids: MED-EPI-001, MED-DIA-001-A
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百七十二项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-ENG-001

```text
tech_id: MAT-ENG-001
current_name: 工程聚合物配混、增强与制件性能验证
fact_gate: defer
issue_tags: PRODUCT_IDENTITY_MISSING, MISSING_RESOURCE_CHAIN, PREREQUISITE_ERROR, STAGE_MISMATCH
issue_statement: 当前只有PF-01与普通PF-M01，缺玻璃纤维等明确增强材料。候选收窄为PF-GF30增强酚醛配混并后移。
evidence: SPEC-M1-STAGE20-ADMINISTRATION-OUTBREAK-REINFORCED-POLYMER-TOOLING-BATCH-AMENDMENT-001
related_tech_ids: MAT-POL-001, CHM-POL-001-C
blocks_prose: true
provisional_post_review_action: DEFER, NARROW_SCOPE, ADD_PRODUCT_GRADE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百七十三项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-JIG-001-A

```text
tech_id: MCH-JIG-001-A
current_name: 夹具设计
fact_gate: merge_replace
issue_tags: OVER_SPLIT, PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR, PREREQUISITE_OVERCONSTRAINT
issue_statement: 夹具与模具产品不同但共享基础工艺装备平台，原拆分导致后继普遍双重门槛。当前与MCH-JIG-001-B合为工艺装备设计，具体夹具按项目J01编号制造。
evidence: SPEC-M1-STAGE20-ADMINISTRATION-OUTBREAK-REINFORCED-POLYMER-TOOLING-BATCH-AMENDMENT-001
related_tech_ids: MCH-JIG-001-B, MCH-CUT-001, MCH-GAG-001
blocks_prose: true
provisional_post_review_action: MERGE_REPLACE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百七十四项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-JIG-001-B

```text
tech_id: MCH-JIG-001-B
current_name: 模具设计
fact_gate: merge_replace
issue_tags: OVER_SPLIT, PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR, PREREQUISITE_OVERCONSTRAINT
issue_statement: 当前与夹具设计合为工艺装备设计，具体模具随产品项目按M01编号制造，不保留万能模具产品。
evidence: SPEC-M1-STAGE20-ADMINISTRATION-OUTBREAK-REINFORCED-POLYMER-TOOLING-BATCH-AMENDMENT-001
related_tech_ids: MCH-JIG-001-A, MCH-CUT-001, MCH-GAG-001
blocks_prose: true
provisional_post_review_action: MERGE_REPLACE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百七十五项事实审查
resolution_status: waiting_post_tree_review
```

### URB-FIR-001

```text
tech_id: URB-FIR-001
current_name: 建筑耐火分区、疏散与消防水源设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR, ENGINEERING_BOUNDARY
issue_statement: 当前候选将三项保留为建筑消防闭环，删除屋面防水等错误前置；消防水源及验收状态必须由实际工程形成。
evidence: SPEC-M1-STAGE20-FIRE-STREET-LANDFILL-POLYMER-REPAIR-BATCH-AMENDMENT-001
related_tech_ids: CNS-STR-001, URB-WTR-001-A
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百六十六项事实审查
resolution_status: waiting_post_tree_review
```

### URB-RAD-001

```text
tech_id: URB-RAD-001
current_name: 聚居点道路等级、交叉口与无障碍通行设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, DUPLICATE_SCOPE, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选限定为街区内部道路层级交叉口与步行连续性，公共通道改为地点状态，公共设施内部无障碍留给后继。
evidence: SPEC-M1-STAGE20-FIRE-STREET-LANDFILL-POLYMER-REPAIR-BATCH-AMENDMENT-001
related_tech_ids: SET-BLK-001, LOG-RDS-001, URB-ACC-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百六十七项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-LDF-001

```text
tech_id: WSE-LDF-001
current_name: 卫生填埋、防渗、渗滤液与填埋气控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选保留同一填埋场内防渗渗滤液与填埋气闭环，删除饮水污水提升和回收分选强制前置，封场方案改为记录。
evidence: SPEC-M1-STAGE20-FIRE-STREET-LANDFILL-POLYMER-REPAIR-BATCH-AMENDMENT-001
related_tech_ids: SET-SVC-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百六十八项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-POL-001

```text
tech_id: CHM-POL-001
current_name: 橡胶、树脂与基础工程聚合物
fact_gate: split_replace
issue_tags: MULTIPLE_TECHS, DUPLICATE_TECH, PREREQUISITE_ERROR, PRODUCT_IDENTITY_MISSING, AUTO_INSTANCE_ERROR
issue_statement: 原节点把橡胶树脂软管涂层与结构塑料合成全家桶并重复酚醛聚合。当前拆为再生橡胶制备与酚醛塑件成形，树脂聚合并回MAT-POL-001。
evidence: SPEC-M1-STAGE20-FIRE-STREET-LANDFILL-POLYMER-REPAIR-BATCH-AMENDMENT-001
related_tech_ids: WSE-REC-001, MAT-POL-001
blocks_prose: true
provisional_post_review_action: SPLIT_REPLACE, MERGE_DUPLICATE, ADD_PRODUCT_GRADE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第三百六十九项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-RPR-001

```text
tech_id: CNS-RPR-001
current_name: 工程巡检、损害评估与修复
fact_gate: pass_with_tree_review
issue_tags: SCOPE_OVERBROAD, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选只保留通用损伤分级停用与复验框架，删除万能修复工程与复产能力，具体修复回各专业路线。
evidence: SPEC-M1-STAGE20-FIRE-STREET-LANDFILL-POLYMER-REPAIR-BATCH-AMENDMENT-001
related_tech_ids: CNS-STR-001, CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百七十项事实审查
resolution_status: waiting_post_tree_review
```

### MET-NET-001

```text
tech_id: MET-NET-001
current_name: 炉批追溯、材料牌号与跨工场供应
fact_gate: merge_delete
issue_tags: DUPLICATE_CAPABILITY, PREREQUISITE_OVERCONSTRAINT, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, LOW_PLAYER_VALUE
issue_statement: 金属牌号炉批复验隔离召回和跨工场物流均已有通用系统承接，且不应要求十一类材料同时投产。当前节点合并删除。
evidence: SPEC-M1-STAGE20-TRACEABILITY-MARKSMAN-UAV-EVACUATION-ESCORT-BATCH-AMENDMENT-001
related_tech_ids: QLT-TRC-001, QLT-SMP-001, QLT-NCR-001, QLT-RCL-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百六十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-003

```text
tech_id: MIL-EXT-003
current_name: “静线”精确射手武器（精射—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_OPTICS_CHAIN
issue_statement: 当前候选保留“静线”精射—01，以7.62×39毫米制式平台为基础建立精度与瞄具接口；枪用光学瞄具供应链仍待补齐。
evidence: SPEC-M1-STAGE20-TRACEABILITY-MARKSMAN-UAV-EVACUATION-ESCORT-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, RESTORE_OPTICS_CHAIN, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百六十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-040

```text
tech_id: MIL-EXT-040
current_name: “长隼”战术侦察无人机系统（战无—01）总体设计
fact_gate: defer
issue_tags: PREREQUISITE_GAP, MISSING_MILESTONE, MISSING_RESOURCE_CHAIN, STAGE_MISMATCH, TECHNOLOGY_LEAP
issue_statement: 当前树缺飞控导航航空光电远程数据链机载动力轻质结构地面站和试飞体系，不能以总体设计越过产业链。节点与战无—01后移。
evidence: SPEC-M1-STAGE20-TRACEABILITY-MARKSMAN-UAV-EVACUATION-ESCORT-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-039, ICD-LAN-001, MIL-EXT-050
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_MILESTONES, BLOCK_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百六十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-TACTIC-005

```text
tech_id: MIL-TACTIC-005
current_name: 伤员现场处理与分级后送
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, OVERLAP_REVIEW, AUTO_INSTANCE_ERROR
issue_statement: 民用急救已承担通用处置与交接。当前候选只保留交火环境下的战术转移军事后送关系，实际训练采用后才生效。
evidence: SPEC-M1-STAGE20-TRACEABILITY-MARKSMAN-UAV-EVACUATION-ESCORT-BATCH-AMENDMENT-001
related_tech_ids: HLT-EMS-001, MIL-EQP-011, MIL-ORG-016
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百六十四项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-SEC-001

```text
tech_id: TLG-SEC-001
current_name: 高风险货运护运、通信与交接方法
fact_gate: demote_delete
issue_tags: NOT_RESEARCH_TECH, SCOPE_OVERBROAD, DUPLICATE_CAPABILITY, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 危险品冷链军需和高价值货物风险不同，护运授权属于政策与任务配置，交接点和中断响应是运行状态。当前节点从科研树删除并下沉。
evidence: SPEC-M1-STAGE20-TRACEABILITY-MARKSMAN-UAV-EVACUATION-ESCORT-BATCH-AMENDMENT-001
related_tech_ids: TLG-HAZ-001, TLG-REF-001, LOG-RDS-001
blocks_prose: true
provisional_post_review_action: DEMOTE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百六十五项事实审查
resolution_status: waiting_post_tree_review
```

### IND-EXP-001

```text
tech_id: IND-EXP-001
current_name: 生产厂房承载与扩建工程设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, OVERLAP_RISK
issue_statement: 当前候选收窄为既有工业场地分期扩建设计，负责承重公辅和在产隔离接口；具体厂房仍须实际设计施工验收。
evidence: SPEC-M1-STAGE19-EXPANSION-OXYGEN-RESIN-CUTTING-EPIDEMIOLOGY-BATCH-AMENDMENT-001
related_tech_ids: IND-SIT-002, CNS-STR-001, CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第三百五十六项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-OXY-001

```text
tech_id: MAT-OXY-001
current_name: 工业氧气压缩、充装与气瓶检查方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_EQUIPMENT_CHAIN, RESEARCH_COST_REVIEW
issue_statement: 原节点错误依赖轧钢与玻璃并把气瓶检查当产品。当前候选以O90气源交付O90-I级15兆帕瓶装工业氧气，高压瓶阀和无油压缩机仍待补链。
evidence: SPEC-M1-STAGE19-EXPANSION-OXYGEN-RESIN-CUTTING-EPIDEMIOLOGY-BATCH-AMENDMENT-001
related_tech_ids: CHM-GAS-001-A, ICD-PRS-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, RESTORE_EQUIPMENT_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十七项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-POL-001

```text
tech_id: MAT-POL-001
current_name: 基础树脂聚合、成形与残余单体控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_REVIEW
issue_statement: 原节点以基础树脂概括所有聚合物且混入成形。当前候选只交付PF-01热固性酚醛树脂，苯酚与甲醛稳定来源仍待补链。
evidence: SPEC-M1-STAGE19-EXPANSION-OXYGEN-RESIN-CUTTING-EPIDEMIOLOGY-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, QLT-SMP-001, MAT-ENG-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, RESTORE_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十八项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-CUT-001

```text
tech_id: MCH-CUT-001
current_name: 切削刀具与加工参数
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: 原节点把刀具和磨修线误作记录并强制依赖三类泛钢材。当前候选交付T8A低速切削刀具01组及其适用参数，后续高速刀具另作代际。
evidence: SPEC-M1-STAGE19-EXPANSION-OXYGEN-RESIN-CUTTING-EPIDEMIOLOGY-BATCH-AMENDMENT-001
related_tech_ids: MCH-LAT-001, MET-ALY-001-A, MET-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十九项事实审查
resolution_status: waiting_post_tree_review
```

### MED-EPI-001

```text
tech_id: MED-EPI-001
current_name: 传染病监测与应对
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, GOVERNANCE_BOUNDARY
issue_statement: 原节点把监测技术与强制防控政策混合并自动建立监测网。当前候选只形成病例定义暴露链和传播风险判断，强制措施须由政策与行政行动执行。
evidence: SPEC-M1-STAGE19-EXPANSION-OXYGEN-RESIN-CUTTING-EPIDEMIOLOGY-BATCH-AMENDMENT-001
related_tech_ids: POP-HEA-001, MED-DIA-001-A, MED-IPC-001, WSE-PTH-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, SEPARATE_POLICY
raised_at: M0正式全树续跑第三百六十项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-PRE-001

```text
tech_id: CNS-PRE-001
current_name: 标准构件、预制装配与模块化接口
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 原节点把标准构件和全部模块化建筑混成抽象范围。当前候选限定为C25预制梁01型与C25预制墙板01型及其吊装连接接口。
evidence: SPEC-M1-STAGE19-PREFABRICATION-DIPLOMACY-MATERNAL-VACCINE-RELIABILITY-BATCH-AMENDMENT-001
related_tech_ids: CNS-CEM-001-D, CNS-STR-001, CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百五十一项事实审查
resolution_status: waiting_post_tree_review
```

### DIP-STA-001

```text
tech_id: DIP-STA-001
current_name: 常设外交与多方协调机构
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, DUPLICATE_MILESTONE, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, LOW_GAME_VALUE_FIELDS
issue_statement: 原节点重复生成外部势力档案并把可信度和细碎授权手续误作解锁物。当前候选只保留常设联络窗口、多方协调与承诺有效期。
evidence: SPEC-M1-STAGE19-PREFABRICATION-DIPLOMACY-MATERNAL-VACCINE-RELIABILITY-BATCH-AMENDMENT-001
related_tech_ids: DIP-CON-001, DIP-INT-001
blocks_prose: false
provisional_post_review_action: RENAME, PRUNE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十二项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-MAT-001

```text
tech_id: HLT-MAT-001
current_name: 高危妊娠识别、产程监护与转诊
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 风险评估产程监护和转诊已属于MED-MAT-001孕产连续照护的完整闭环。当前节点合并删除，妇幼中心仍由设施规划与工程承担。
evidence: SPEC-M1-STAGE19-PREFABRICATION-DIPLOMACY-MATERNAL-VACCINE-RELIABILITY-BATCH-AMENDMENT-001
related_tech_ids: MED-MAT-001, SET-PUB-001-B-A
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十三项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-VAC-001

```text
tech_id: HLT-VAC-001
current_name: 疫苗冷链、接种登记与不良事件监测
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_REVIEW
issue_statement: 原节点没有疫苗来源质量放行和实际接种条件，却会直接生成接种及免疫状态。当前候选只开放接种管理闭环，实际接种和批次状态依赖真实疫苗与行动。
evidence: SPEC-M1-STAGE19-PREFABRICATION-DIPLOMACY-MATERNAL-VACCINE-RELIABILITY-BATCH-AMENDMENT-001
related_tech_ids: MCH-REF-001, MED-IPC-001, POP-HEA-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RESTORE_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百五十四项事实审查
resolution_status: waiting_post_tree_review
```

### IME-RBL-001

```text
tech_id: IME-RBL-001
current_name: 可靠性、平均故障间隔与寿命数据分析
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, SAMPLE_SIZE_LIMIT
issue_statement: 原节点把改型需求误作产品并在科研后直接形成可靠性记录。当前候选要求同型号长期样本，只生成分析及后续维护备件改型需求。
evidence: SPEC-M1-STAGE19-PREFABRICATION-DIPLOMACY-MATERNAL-VACCINE-RELIABILITY-BATCH-AMENDMENT-001
related_tech_ids: ELC-REC-001, RPR-DIA-001, QLT-TRC-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, ADD_SAMPLE_GATE
raised_at: M0正式全树续跑第三百五十五项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-BLD-005

```text
tech_id: Y2-PROD-BLD-005
current_name: 建筑骨料破碎、筛分与级配控制
fact_gate: merge_delete
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 节点与RAW-QUA-001砂石骨料生产完全重复。当前合并删除，并在承接节点明确粗骨料细骨料与道路基层级配料。
evidence: SPEC-M1-STAGE19-AGGREGATE-SWITCHBOARD-CANNED-FOOD-BATCH-AMENDMENT-001
related_tech_ids: RAW-QUA-001, CNS-CEM-001-D
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, EXPAND_EXISTING_PRODUCT_GRADES, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第三百四十六项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-ELC-006

```text
tech_id: Y2-PROD-ELC-006
current_name: 低压配电柜结构、母排与保护装配
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR, MISSING_COMPONENT_CHAIN
issue_statement: 当前候选交付PD-A1型400伏级250安低压配电柜，与继电控制和中压开关设备分离；低压保护器件制造仍待补链。
evidence: SPEC-M1-STAGE19-AGGREGATE-SWITCHBOARD-CANNED-FOOD-BATCH-AMENDMENT-001
related_tech_ids: NRG-GRD-001, ELC-CMP-001, ELC-CTL-001-A
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_COMPONENT_CHAIN
raised_at: M0正式全树续跑第三百四十七项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-FOD-007

```text
tech_id: Y2-PROD-FOD-007
current_name: 主食罐藏、热处理与密封检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6只给抽象罐藏主食。当前候选交付340克谷物粥罐头01号，并只对已验证配方和7113空罐形成商业无菌结论。
evidence: SPEC-M1-STAGE19-AGGREGATE-SWITCHBOARD-CANNED-FOOD-BATCH-AMENDMENT-001
related_tech_ids: Y2-PROD-CIV-006, AGR-MIL-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_FORMULA, REWIRE_PREREQUISITE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百四十八项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-FOD-008

```text
tech_id: Y2-PROD-FOD-008
current_name: 蛋白食品罐藏、热处理与污染控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR, MISSING_MILESTONE, MISSING_RESOURCE_CHAIN
issue_statement: R6只给抽象蛋白食品。当前候选交付340克清炖禽肉罐头01号，读取真实禽肉来源检疫与独立热处理放行。
evidence: SPEC-M1-STAGE19-AGGREGATE-SWITCHBOARD-CANNED-FOOD-BATCH-AMENDMENT-001
related_tech_ids: Y2-PROD-CIV-006, AGR-SLA-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_FORMULA, RESTORE_MISSING_MILESTONES, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百四十九项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-FOD-009

```text
tech_id: Y2-PROD-FOD-009
current_name: 蔬菜罐藏、热处理与组织稳定控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6只给抽象罐藏蔬菜。当前候选交付340克盐水混合蔬菜罐头01号，组织质量与商业无菌分别验收。
evidence: SPEC-M1-STAGE19-AGGREGATE-SWITCHBOARD-CANNED-FOOD-BATCH-AMENDMENT-001
related_tech_ids: Y2-PROD-CIV-006, AGR-VEG-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_FORMULA, REWIRE_PREREQUISITE, RESTORE_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百五十项事实审查
resolution_status: waiting_post_tree_review
```

### URB-RRF-001

```text
tech_id: URB-RRF-001
current_name: 屋面、防水、雨棚与雨水导排设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选交付FS-A1屋面防水组并开放修复工程，具体工程完成后才改变屋面渗漏状态。
evidence: SPEC-M1-STAGE19-BUILDING-WATER-WASTEWATER-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: CNS-STR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百四十一项事实审查
resolution_status: waiting_post_tree_review
```

### URB-WTR-001

```text
tech_id: URB-WTR-001
current_name: 建筑给水、排水、卫生间与防回流设计
fact_gate: return_split
issue_tags: SCOPE_ERROR, SPLIT_CANDIDATE, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6混合建筑管路与卫生设备产品。当前拆为GP-A1建筑给排水设计和WS-A1卫生设备定型，后继按需读取。
evidence: SPEC-M1-STAGE19-BUILDING-WATER-WASTEWATER-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: CNS-STR-001, SET-SVC-001-A, SET-SVC-001-B
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_MODELS, REWIRE_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百四十二项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-BIO-001

```text
tech_id: WSE-BIO-001
current_name: 污水生化处理、曝气与污泥龄控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把设备工段和记录作为自动产品且点数过低。当前候选形成实际活性污泥工段，停电负荷超限时出水不得正常放行。
evidence: SPEC-M1-STAGE19-BUILDING-WATER-WASTEWATER-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: WTR-SEW-001-B, WTR-REU-001-A, WTR-REU-001-B
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百四十三项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-REC-001

```text
tech_id: WSE-REC-001
current_name: 可回收物分选、清洗与再入库方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, GENERIC_PRODUCT_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6生成万能再生原料。当前候选按铁金属有色金属玻璃纸纤维和树脂类别分别形成候选库存，不替代下游再生工艺。
evidence: SPEC-M1-STAGE19-BUILDING-WATER-WASTEWATER-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: RAW-SCR-001, SET-SVC-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_GENERIC_PRODUCT, ADD_MATERIAL_CATEGORIES, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百四十四项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-NET-001

```text
tech_id: WTR-NET-001
current_name: 区域水务运行组织
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: R6自动生成固定区域水务网。当前候选只开放跨点水质互认调水和抢修组织，真实资源与行动决定网络状态。
evidence: SPEC-M1-STAGE19-BUILDING-WATER-WASTEWATER-RECYCLING-BATCH-AMENDMENT-001
related_tech_ids: SET-NET-001, WTR-TST-001, WTR-MNT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REMOVE_AUTO_INSTANCE
raised_at: M0正式全树续跑第三百四十五项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-REM-001

```text
tech_id: RPR-REM-001
current_name: 旧件再制造、尺寸恢复与降级利用
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, IDENTITY_OVERBROAD, GENERIC_PRODUCT_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6生成万能再制造零件与设备批次。当前候选只修复材料明确且非断裂关键的部分金属旧件，保留原零件号和风险边界。
evidence: SPEC-M1-STAGE18-REMANUFACTURE-RESEARCH-RENTAL-WAREHOUSE-LIGHTING-BATCH-AMENDMENT-001
related_tech_ids: RPR-OVH-001, MCH-GAG-001, MET-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_GENERIC_PRODUCT, REBALANCE_COST
raised_at: M0正式全树续跑第三百三十六项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-XFN-001

```text
tech_id: SCI-XFN-001
current_name: 跨专业科研协作
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, LOW_GAME_VALUE_REVIEW
issue_statement: 当前候选保留多专业资源争用和联合验证阻塞的独立玩法价值，项目必须由玩家建立并投入实际人员样品设备。
evidence: SPEC-M1-STAGE18-REMANUFACTURE-RESEARCH-RENTAL-WAREHOUSE-LIGHTING-BATCH-AMENDMENT-001
related_tech_ids: SCI-PRJ-001, SCI-DIF-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REMOVE_AUTO_INSTANCE
raised_at: M0正式全树续跑第三百三十七项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-RNT-001

```text
tech_id: SOC-RNT-001
current_name: 民用品租用、维修、回收与再次发放方法
fact_gate: return_demote
issue_tags: NOT_RESEARCH_TECH, LOW_GAME_VALUE, GOVERNANCE_DEMOTION, CONTRACT_DETAIL, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 租用责任发放回收和再次发放属于政策与运行组织，不值得占科研节点。当前下沉为耐用品周转计划并避免逐件合同微操。
evidence: SPEC-M1-STAGE18-REMANUFACTURE-RESEARCH-RENTAL-WAREHOUSE-LIGHTING-BATCH-AMENDMENT-001
related_tech_ids: SOC-TEX-001
blocks_prose: true
provisional_post_review_action: DEMOTE_TO_GOVERNANCE, REMOVE_TECH_EDGES, ADD_POLICY_TAGS
raised_at: M0正式全树续跑第三百三十八项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-SLT-001

```text
tech_id: TLG-SLT-001
current_name: 仓库库位、容量、兼容性与消防分区
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, OVERLAP_RISK, RESEARCH_COST_REVIEW
issue_statement: 当前候选与仓储批次管理分层，负责仓库实体容量、相容与消防分区，实际改造验收后才产生库位状态。
evidence: SPEC-M1-STAGE18-REMANUFACTURE-RESEARCH-RENTAL-WAREHOUSE-LIGHTING-BATCH-AMENDMENT-001
related_tech_ids: LOG-WHS-001, TLG-HUB-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百三十九项事实审查
resolution_status: waiting_post_tree_review
```

### URB-LGT-001

```text
tech_id: URB-LGT-001
current_name: 公共照明布点、配电与维护方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_COMPONENT_CHAIN, RESEARCH_COST_REVIEW
issue_statement: 当前候选交付LD-A1低压LED路灯组和公共照明工程，街区只有工程完成并供电后取得照明状态，LED来源仍需补查。
evidence: SPEC-M1-STAGE18-REMANUFACTURE-RESEARCH-RENTAL-WAREHOUSE-LIGHTING-BATCH-AMENDMENT-001
related_tech_ids: SET-BLK-001, NRG-GRD-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, RESTORE_MISSING_COMPONENT_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百四十项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-001

```text
tech_id: MIL-EQP-001
current_name: “守线”制式单兵枪械（步武—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: 当前候选交付BQ-A1型7.62×39毫米自动步枪，整枪作为聚合产品但材料加工弹药工厂和换装状态均保持独立。
evidence: SPEC-M1-STAGE18-RIFLE-ADVANCED-MILITARY-MEDICAL-FORMATION-BATCH-AMENDMENT-001
related_tech_ids: MCH-LAT-001, MCH-GAG-001, MET-HTR-001, QLT-SMP-001, MIL-EQP-002
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百三十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-016

```text
tech_id: MIL-EXT-016
current_name: “折枪”反装甲制导弹药（反导弹—01）总体设计
fact_gate: return_merge_restage
issue_tags: DUPLICATE_MILESTONE, MISSING_GUIDANCE_CHAIN, MISSING_PROPULSION_CHAIN, MISSING_WARHEAD_CHAIN, MISSING_AMMUNITION_CHAIN, STAGE_ORDER_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 发射装置和制导弹药不应形成两个重复总体定型科技。当前节点并入后移的MIL-EXT-015完整反装甲导弹系统并删除独立边。
evidence: SPEC-M1-STAGE18-RIFLE-ADVANCED-MILITARY-MEDICAL-FORMATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-015
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, RESTAGE_WITH_SYSTEM, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第三百三十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-039

```text
tech_id: MIL-EXT-039
current_name: “轻隼”近程侦察无人机系统（近无—01）总体设计
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, MISSING_AIRFRAME_CHAIN, MISSING_FLIGHT_CONTROL_CHAIN, MISSING_SENSOR_CHAIN, MISSING_DATA_LINK_CHAIN, STAGE_ORDER_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前昼间观察和无线电不能替代飞行平台飞控导航机载成像与遥控图传。节点后移且不生成正文和型号。
evidence: SPEC-M1-STAGE18-RIFLE-ADVANCED-MILITARY-MEDICAL-FORMATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-038, ELC-RAD-001, ICD-CMP-001
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_AIRFRAME_CHAIN, RESTORE_FLIGHT_CONTROL_CHAIN, RESTORE_DATA_LINK_CHAIN
raised_at: M0正式全树续跑第三百三十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-044

```text
tech_id: MIL-EXT-044
current_name: “断障”障碍侦测与开辟装备组（破障—01）总体设计
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, OVERLAP_RISK, MISSING_DETECTION_CHAIN, MISSING_DEMINING_CHAIN, MISSING_ENGINEERING_VEHICLE_CHAIN, MISSING_AMMUNITION_CHAIN, STAGE_ORDER_ERROR, AUTO_INSTANCE_ERROR
issue_statement: GB-A1只覆盖基础排障，而高级探测爆破和机械开辟链尚未成立。节点保留未来身份并后移，不生成装备或部队能力。
evidence: SPEC-M1-STAGE18-RIFLE-ADVANCED-MILITARY-MEDICAL-FORMATION-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-009
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_DETECTION_CHAIN, RESTORE_DEMINING_CHAIN, RESTORE_ENGINEERING_VEHICLE_CHAIN
raised_at: M0正式全树续跑第三百三十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-ORG-016

```text
tech_id: MIL-ORG-016
current_name: 卫生与后送部队编制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选只开放卫勤后送分队编制岗位训练与交接规则，实际人员WQ-A1装备车辆补给和接收能力决定能否组建。
evidence: SPEC-M1-STAGE18-RIFLE-ADVANCED-MILITARY-MEDICAL-FORMATION-BATCH-AMENDMENT-001
related_tech_ids: MED-TRI-001, MIL-EQP-011
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REMOVE_AUTO_INSTANCES
raised_at: M0正式全树续跑第三百三十五项事实审查
resolution_status: waiting_post_tree_review
```

### MED-SUP-001-B

```text
tech_id: MED-SUP-001-B
current_name: 无菌耗材批次生产
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, PRODUCT_IDENTITY_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6缺少非无菌敷料、包装灭菌验证和有效期前置。当前候选交付WY-A1换药包及两类定量包装耗材，无菌状态由实际批次维持。
evidence: SPEC-M1-STAGE18-STERILE-SURGERY-SPECIAL-STEELS-BATCH-AMENDMENT-001
related_tech_ids: MED-SUP-001-A, MED-IPC-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_IDENTITIES, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百二十六项事实审查
resolution_status: waiting_post_tree_review
```

### MED-SUR-001

```text
tech_id: MED-SUR-001
current_name: 无菌手术、麻醉监护与术后照护
fact_gate: pass_with_tree_review
issue_tags: SCALE_ERROR, PREREQUISITE_ERROR, DUPLICATE_MILESTONE, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6用抽象基础手术能力混合麻醉和手术闭环。当前候选删除重复麻醉里程碑，保留无菌手术与即时术后照护。
evidence: SPEC-M1-STAGE18-STERILE-SURGERY-SPECIAL-STEELS-BATCH-AMENDMENT-001
related_tech_ids: MED-DIA-001-A, MED-IPC-001, HLT-ANE-001, MED-SUP-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_DUPLICATE_MILESTONE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百二十七项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ALY-001-A

```text
tech_id: MET-ALY-001-A
current_name: 工具钢小批量制备
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, PRODUCT_IDENTITY_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_REVIEW
issue_statement: R6只给抽象工具钢。当前候选交付T8A退火碳素工具钢棒材，并保留洁净铁料与成分调整缺口。
evidence: SPEC-M1-STAGE18-STERILE-SURGERY-SPECIAL-STEELS-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-D, MET-HTR-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百二十八项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ALY-001-B

```text
tech_id: MET-ALY-001-B
current_name: 弹簧钢小批量制备
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, PRODUCT_IDENTITY_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_REVIEW
issue_statement: R6只给抽象弹簧钢。当前候选交付65Mn热轧盘条，产品仍需后续成形热处理和疲劳检验才成为弹簧。
evidence: SPEC-M1-STAGE18-STERILE-SURGERY-SPECIAL-STEELS-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-E, MET-HTR-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百二十九项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ALY-001-C

```text
tech_id: MET-ALY-001-C
current_name: 耐热合金小批量制备
fact_gate: return_restage
issue_tags: IDENTITY_OVERBROAD, PREREQUISITE_ERROR, MISSING_RESOURCE_CHAIN, MISSING_MILESTONE, RANK_ERROR, RESTAGE_REQUIRED
issue_statement: 当前缺少镍铬资源、保护熔炼、高温锻轧和高温性能试验链，不能稳定生产GH3030。候选后移且不生成正文。
evidence: SPEC-M1-STAGE18-STERILE-SURGERY-SPECIAL-STEELS-BATCH-AMENDMENT-001
related_tech_ids: MET-HTR-001, QLT-SMP-001
blocks_prose: true
provisional_post_review_action: RESTAGE, RESTORE_RESOURCE_CHAIN, RESTORE_SMELTING_MILESTONE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第三百三十项事实审查
resolution_status: waiting_post_tree_review
```

### IND-SIT-002

```text
tech_id: IND-SIT-002
current_name: 共享作坊场院公用设施设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, OVERLAP_RISK, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把共享接口误作产品并混入后期工业园公辅。当前候选只负责多个小型专业作坊共用的动力给排水通风仓储容量。
evidence: SPEC-M1-STAGE18-WORKSHOP-FUEL-GLASS-REAGENT-PHARMACY-BATCH-AMENDMENT-001
related_tech_ids: IND-SIT-001, NRG-GRD-001, LOG-WHS-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第三百二十一项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-FUL-001

```text
tech_id: MAT-FUL-001
current_name: 液体燃料调合、稳定性与低温性能控制
fact_gate: pass_with_restage
issue_tags: IDENTITY_OVERBROAD, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6用合格燃料概括全部液体燃料且没有组分来源。当前候选收窄为0号和负10号柴油调合，稳定原料链恢复前仅处理实际合格组分。
evidence: SPEC-M1-STAGE18-WORKSHOP-FUEL-GLASS-REAGENT-PHARMACY-BATCH-AMENDMENT-001
related_tech_ids: NRG-FUL-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RESTAGE, ADD_PRODUCT_GRADE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百二十二项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-GLS-001

```text
tech_id: MAT-GLS-001
current_name: 平板玻璃熔制、成形、退火与光学检验
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, DUPLICATE_MILESTONE, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE, MISSING_RESOURCE_CHAIN
issue_statement: R6重复配料熔制退火并低估平板成形。当前候选交付3毫米建筑用普通平板玻璃，保留成形装备和材料供应缺口。
evidence: SPEC-M1-STAGE18-WORKSHOP-FUEL-GLASS-REAGENT-PHARMACY-BATCH-AMENDMENT-001
related_tech_ids: CNS-GLS-BASE-001-B, CNS-GLS-BASE-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百二十三项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-REA-001

```text
tech_id: MAT-REA-001
current_name: 通用试剂纯度、包装与实验室放行
fact_gate: pass_with_tree_review
issue_tags: IDENTITY_OVERBROAD, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, LOW_GAME_VALUE_RISK
issue_statement: 通用试剂和试剂线是不可接受的汇总产品。当前候选只让具体化学品经实际检验取得试剂级、受限或拒收状态。
evidence: SPEC-M1-STAGE18-WORKSHOP-FUEL-GLASS-REAGENT-PHARMACY-BATCH-AMENDMENT-001
related_tech_ids: CHM-ACD-001-D, QLT-MET-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_ABSTRACT_PRODUCTS, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百二十四项事实审查
resolution_status: waiting_post_tree_review
```

### MED-PHM-001

```text
tech_id: MED-PHM-001
current_name: 基础药品鉴别、复配与剂量质量控制
fact_gate: pass_with_tree_review
issue_tags: SCALE_ERROR, IDENTITY_OVERBROAD, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6混合药品鉴别药房复配工业制剂与医疗耗材。当前候选只保留基础药房运行，具体制剂生产和耗材继续独立。
evidence: SPEC-M1-STAGE18-WORKSHOP-FUEL-GLASS-REAGENT-PHARMACY-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, QLT-TRC-001, MED-IPC-001, HLT-ABX-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_ABSTRACT_PRODUCTS, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百二十五项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-LAB-001

```text
tech_id: HLT-LAB-001
current_name: 临床检验质量控制、参考范围与复核
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6把检验室和结果当科研产品且成本过低。当前候选作为基础医学检验后续质量里程碑，只由实际质控和复核改变结果状态。
evidence: SPEC-M1-STAGE17-LAB-CARE-INSTRUMENTS-MAINTENANCE-BATCH-AMENDMENT-001
related_tech_ids: MED-DIA-001-A, QLT-MET-001, HLT-IVF-001-B
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百一十六项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-LTC-001

```text
tech_id: HLT-LTC-001
current_name: 长期照护等级、照护者负荷与机构转介
fact_gate: pass_with_tree_review
issue_tags: TYPE_ERROR, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, GOVERNANCE_BOUNDARY, RESEARCH_COST_OVERESTIMATE
issue_statement: R6把照护等级当产品并混合服务设施与权利。当前候选保留服务组织和转介，设施规划与资格财政分别归工程和治理系统。
evidence: SPEC-M1-STAGE17-LAB-CARE-INSTRUMENTS-MAINTENANCE-BATCH-AMENDMENT-001
related_tech_ids: POP-HEA-001, SET-PUB-001-B-B
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百一十七项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-FLW-001

```text
tech_id: ICD-FLW-001
current_name: 流量测量、直管段、介质修正与校准
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, SCALE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: R6用抽象流量仪表覆盖全部介质并把校准当产品。当前候选收窄为LGB-A1孔板流量计组，限定管径介质量程与安装条件。
evidence: SPEC-M1-STAGE17-LAB-CARE-INSTRUMENTS-MAINTENANCE-BATCH-AMENDMENT-001
related_tech_ids: ICD-PRS-001, QLT-MET-001, ICD-AMI-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, NARROW_SCOPE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百一十八项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-TMP-001

```text
tech_id: ICD-TMP-001
current_name: 温度传感、补偿、量程与校准
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, SCALE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6用抽象温度仪表覆盖所有场景并将校准误作产品。当前候选收窄为WRN-A1 K型热电偶组，保留材料供应缺口。
evidence: SPEC-M1-STAGE17-LAB-CARE-INSTRUMENTS-MAINTENANCE-BATCH-AMENDMENT-001
related_tech_ids: ICD-VLT-001, QLT-MET-001, IME-CBM-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, NARROW_SCOPE, RESTORE_MISSING_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百一十九项事实审查
resolution_status: waiting_post_tree_review
```

### IME-CBM-001

```text
tech_id: IME-CBM-001
current_name: 振动、温度、油液与状态维修判定
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_INSTRUMENT_CHAIN, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6把监测、工单和预警均作记录并缺少仪表前置。当前候选以多类趋势共同决定检修和停机时机，实际监测才产生工单和状态。
evidence: SPEC-M1-STAGE17-LAB-CARE-INSTRUMENTS-MAINTENANCE-BATCH-AMENDMENT-001
related_tech_ids: RPR-PMV-001, RPR-DIA-001, ELC-REC-001, ICD-TMP-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, RESTORE_INSTRUMENT_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第三百二十项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-MET-001

```text
tech_id: ELC-MET-001
current_name: 电能、物料与公共服务远程计量
fact_gate: pass_with_tree_review
issue_tags: IDENTITY_OVERBROAD, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, REPLACE_CANDIDATE
issue_statement: R6把不同领域仪表和公共服务统计合成一套固定记录。当前候选迁移为ICD-AMI-001远程计量采集，只采集实际已校准仪表。
evidence: SPEC-M1-STAGE17-METERING-MOTOR-NETWORK-GOVERNANCE-INFUSION-BATCH-AMENDMENT-001
related_tech_ids: ICD-LAN-001, ELC-REC-001, QLT-MET-001
blocks_prose: false
provisional_post_review_action: REPLACE_ID, RENAME, ADD_PRODUCT_MODEL, NARROW_SCOPE, REBALANCE_COST
raised_at: M0正式全树续跑第三百一十一项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-MOT-001-A

```text
tech_id: ELC-MOT-001-A
current_name: 电动机绕组设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6自动产生样件且缺少铜绕组线、电工钢和绝缘链。当前候选只开放RZ-A1绕组设计和试制，实际行动才产生样件。
evidence: SPEC-M1-STAGE17-METERING-MOTOR-NETWORK-GOVERNANCE-INFUSION-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, CHM-INS-001-A, ICD-VLT-001
blocks_prose: false
provisional_post_review_action: ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百一十二项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-NET-001

```text
tech_id: ELC-NET-001
current_name: 区域供电网络运行
fact_gate: return_merge_delete
issue_tags: NAME_CONTENT_MISMATCH, IDENTITY_CONFLICT, DUPLICATE_MILESTONE, AUTO_INSTANCE_ERROR
issue_statement: 名称指向供电，正文和解锁却重复既有通信骨干。当前确认合并删除，通信与供电后继分别改接真实路线。
evidence: SPEC-M1-STAGE17-METERING-MOTOR-NETWORK-GOVERNANCE-INFUSION-BATCH-AMENDMENT-001
related_tech_ids: ICD-LNE-001, ICD-RPT-001, ICD-LAN-001, NRG-DSP-001, ENE-ISL-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_COMMUNICATION_DEPENDENTS, REWIRE_POWER_DEPENDENTS
raised_at: M0正式全树续跑第三百一十三项事实审查
resolution_status: waiting_post_tree_review
```

### GOV-SUR-001

```text
tech_id: GOV-SUR-001
current_name: 地方人口、设施、制度与实际控制调查
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前候选收窄为接管前地方控制调查，分别记录名义归属实际执行者和可用设施，不自动完成兼并或接管。
evidence: SPEC-M1-STAGE17-METERING-MOTOR-NETWORK-GOVERNANCE-INFUSION-BATCH-AMENDMENT-001
related_tech_ids: DIP-INT-001, POP-STA-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REMOVE_AUTO_INSTANCE
raised_at: M0正式全树续跑第三百一十四项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-IVF-001

```text
tech_id: HLT-IVF-001
current_name: 补液、电解质、无菌配制与输注安全
fact_gate: split_pass_with_tree_review
issue_tags: SPLIT_REQUIRED, SCALE_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, POINT_UNDERESTIMATE, MISSING_MILESTONE
issue_statement: R6用35点混合无菌注射液生产和临床输注。当前拆为后移的0.9%氯化钠注射液生产与独立静脉补液安全，并保留注射用水和无菌容器缺口。
evidence: SPEC-M1-STAGE17-METERING-MOTOR-NETWORK-GOVERNANCE-INFUSION-BATCH-AMENDMENT-001
related_tech_ids: CHM-ACD-001-D, MED-IPC-001, MED-SUP-001-B, QLT-SMP-001, HLT-LAB-001
blocks_prose: false
provisional_post_review_action: SPLIT, RESTAGE_PRODUCTION_NODE, ADD_PRODUCT_FORMULA, RESTORE_MISSING_MILESTONES, REBALANCE_COST
raised_at: M0正式全树续跑第三百一十五项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-SWG-001

```text
tech_id: WSE-SWG-001
current_name: 污水泵站、溢流控制与停电旁路设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6缺少污水泵适配、备用提升和受控暂存边界，并自动生成设备工程与行动。当前候选交付WT-A1设备组和提升站设计，实际能力由设备与工程形成。
evidence: SPEC-M1-STAGE17-SEWAGE-DRAINAGE-CAN-CONCRETE-BATCH-AMENDMENT-001
related_tech_ids: WTR-SEW-001-A, IME-PMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百零六项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-BAS-001

```text
tech_id: WTR-BAS-001
current_name: 雨洪、排涝与水源保护区治理
fact_gate: pass_with_split_and_demotion
issue_tags: SCALE_ERROR, GOVERNANCE_BOUNDARY, PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: R6把雨洪工程与水源保护区治理合成科技。当前雨洪排涝保留科研身份，水源保护区下沉为规划法律行动和地点状态。
evidence: SPEC-M1-STAGE17-SEWAGE-DRAINAGE-CAN-CONCRETE-BATCH-AMENDMENT-001
related_tech_ids: WTR-SUR-001-A, URB-DRN-001
blocks_prose: false
provisional_post_review_action: SPLIT, DEMOTE_GOVERNANCE_OBJECT, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百零七项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-MNT-001

```text
tech_id: WTR-MNT-001
current_name: 供排水巡检与抢修
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: R6把维修队、旁路与抢修工程当科研自动实例。当前候选只开放组织工程与恢复规则，实际组建和施工才改变管段状态。
evidence: SPEC-M1-STAGE17-SEWAGE-DRAINAGE-CAN-CONCRETE-BATCH-AMENDMENT-001
related_tech_ids: WTR-LEK-001-B, WTR-SEW-001-A
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REMOVE_AUTO_INSTANCES
raised_at: M0正式全树续跑第三百零八项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-CIV-006

```text
tech_id: Y2-PROD-CIV-006
current_name: 空金属食品罐成形与密封边检验
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6缺少具体罐型、食品级板材和涂层链。当前候选交付7113型镀锡钢板三片空罐，与食品装填卷封杀菌保持独立。
evidence: SPEC-M1-STAGE17-SEWAGE-DRAINAGE-CAN-CONCRETE-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-C, IME-PRS-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第三百零九项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-CEM-001-D

```text
tech_id: CNS-CEM-001-D
current_name: 混凝土配合比控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6生成抽象混凝土产品且无材料前置。当前候选交付C25结构混凝土现场投入流，并按坍落度与龄期强度决定结构用途。
evidence: SPEC-M1-STAGE17-SEWAGE-DRAINAGE-CAN-CONCRETE-BATCH-AMENDMENT-001
related_tech_ids: CNS-CEM-001-B, RAW-QUA-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第三百一十项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-MHE-001

```text
tech_id: TLG-MHE-001
current_name: 托盘、叉装、起重与机械装卸方法
fact_gate: pass_with_split_and_tree_review
issue_tags: SCALE_ERROR, DUPLICATE_MILESTONE, UNLOCK_MISMATCH, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 单项混合货物接口产品、机械设备和已经存在的装卸站工程。当前拆为TP-A1托盘与JX-A1机械装卸设备组，删除重复装卸站解锁。
evidence: SPEC-M1-STAGE17-HANDLING-TRAILER-WATER-BATCH-AMENDMENT-001
related_tech_ids: LOG-HND-001, TLG-HUB-001, MCH-LAT-001
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_MODELS, REMOVE_DUPLICATE_ENGINEERING_UNLOCK, REBALANCE_COST
raised_at: M0正式全树续跑第三百零一项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-TRL-001

```text
tech_id: TLG-TRL-001
current_name: 标准拖车、牵引接口与货物固定方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6缺少车辆产业前置、具体型号及载荷和制动灯光边界。当前候选交付GT-A1型250千克轻型通用拖车。
evidence: SPEC-M1-STAGE17-HANDLING-TRAILER-WATER-BATCH-AMENDMENT-001
related_tech_ids: VEH-MOT-001, LOG-HND-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百零二项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-CAR-001

```text
tech_id: WSE-CAR-001
current_name: 活性炭吸附、异味与有机污染控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6自动生成工段和活性炭，且未限定吸附范围或炭料来源。当前候选只建立目标污染吸附和穿透更换边界，保留活性炭供应缺口。
evidence: SPEC-M1-STAGE17-HANDLING-TRAILER-WATER-BATCH-AMENDMENT-001
related_tech_ids: WTR-POT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第三百零三项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-HYD-001

```text
tech_id: WSE-HYD-001
current_name: 分区管网水力平衡、压力控制与末端保障
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6把配水分区误作产品并自动形成压力设施与记录。当前候选开放管网压力设计工程，具体状态由已建管网调试运行产生。
evidence: SPEC-M1-STAGE17-HANDLING-TRAILER-WATER-BATCH-AMENDMENT-001
related_tech_ids: WTR-STO-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百零四项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-PTH-001

```text
tech_id: WSE-PTH-001
current_name: 水源性病原监测、暴发判定与供水应急
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_TYPE_ERROR, GOVERNANCE_BOUNDARY, AUTO_INSTANCE_ERROR, RESEARCH_COST_UNDERESTIMATE
issue_statement: R6把病原监测、暴发判断和行政停供混成科研自动效果，并把建议误作产品。当前候选只形成风险记录和状态，煮沸停供由行政行动决定。
evidence: SPEC-M1-STAGE17-HANDLING-TRAILER-WATER-BATCH-AMENDMENT-001
related_tech_ids: SCI-LAB-001, WTR-TST-001, MED-EPI-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第三百零五项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-RCL-001

```text
tech_id: QLT-RCL-001
current_name: 产品召回与纠正体系
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6缺少批次追溯、不合格品与现场失效前置，并把科研完成等同实际行动。当前候选形成召回、纠正与复验闭环，只有实际执行才改变批次状态。
evidence: SPEC-M1-STAGE16-QUALITY-REPAIR-CLOTHING-LOGISTICS-BATCH-AMENDMENT-001
related_tech_ids: QLT-NCR-001, RPR-DIA-001, QLT-CHG-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REMOVE_AUTO_INSTANCES
raised_at: M0正式全树续跑第二百九十六项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-OVH-001

```text
tech_id: RPR-OVH-001
current_name: 总成大修、寿命恢复与换件标准
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, GENERIC_PRODUCT_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6把总成大修当产品并把周转总成当记录。当前候选只改变实际型号总成的维修和库存状态，不生成万能产品或保证恢复新件寿命。
evidence: SPEC-M1-STAGE16-QUALITY-REPAIR-CLOTHING-LOGISTICS-BATCH-AMENDMENT-001
related_tech_ids: RPR-SHP-001, RPR-SPR-001, RPR-REM-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REMOVE_GENERIC_PRODUCT
raised_at: M0正式全树续跑第二百九十七项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-HYG-001

```text
tech_id: SOC-HYG-001
current_name: 日用卫生用品通用质量检验标准
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, ABSTRACT_PRODUCT, LOW_GAME_VALUE, TYPE_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 通用卫生用品质检重复生产质量检验和各具体产品标准，三类卫生产品与供应状态也是抽象输出。当前合并删除。
evidence: SPEC-M1-STAGE16-QUALITY-REPAIR-CLOTHING-LOGISTICS-BATCH-AMENDMENT-001
related_tech_ids: QLT-SMP-001, SOC-RNT-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_ABSTRACT_PRODUCT, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百九十八项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-TEX-001

```text
tech_id: SOC-TEX-001
current_name: 标准衣物版型、尺码、耐用与修补设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, DUPLICATE_OUTPUT, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6重复基础衣物和通用修补。当前候选只交付标准工作服01型，专用防护工作服留给后续材料与防护等级路线。
evidence: SPEC-M1-STAGE16-QUALITY-REPAIR-CLOTHING-LOGISTICS-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001-C, SOC-RNT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百九十九项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-HUB-001

```text
tech_id: TLG-HUB-001
current_name: 区域物流枢纽吞吐、排队与分流控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6把设施、计划和状态作为科研自动输出。当前候选开放转运中心设计工程与调度规则，具体吞吐排队和分流由实际设施运行产生。
evidence: SPEC-M1-STAGE16-QUALITY-REPAIR-CLOTHING-LOGISTICS-BATCH-AMENDMENT-001
related_tech_ids: LOG-WHS-001, LOG-HND-001, LOG-NET-001, TLG-HAZ-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REMOVE_AUTO_INSTANCES
raised_at: M0正式全树续跑第三百项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-015

```text
tech_id: MIL-EXT-015
current_name: “折枪”反装甲制导武器（反导—01）总体设计
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, MISSING_GUIDANCE_CHAIN, MISSING_SENSOR_CHAIN, MISSING_PROPULSION_CHAIN, MISSING_AMMUNITION_CHAIN, STAGE_ORDER_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 当前树缺少导引传感、弹载控制、专用推进、聚能战斗部与整弹试验链，不能从普通无线电和武器经验跳到反装甲导弹。当前后移且不生成正文。
evidence: SPEC-M1-STAGE16-ADVANCED-MILITARY-SYSTEMS-BATCH-AMENDMENT-001
related_tech_ids: MIL-EXT-016, MIL-EXT-014, ELC-RAD-001
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_GUIDANCE_CHAIN, RESTORE_PROPULSION_CHAIN, RESTORE_AMMUNITION_CHAIN
raised_at: M0正式全树续跑第二百九十一项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-037

```text
tech_id: MIL-EXT-037
current_name: “中枢”野战指挥所设备组（指设—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6未区分设备组与指挥编成，并缺少模块降级边界。当前候选交付YZ-A1设备组，实际能力读取通信、网络、计算、供电和载体状态。
evidence: SPEC-M1-STAGE16-ADVANCED-MILITARY-SYSTEMS-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-010, ICD-LAN-001, ICD-SWX-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, ADD_DEGRADED_STATE
raised_at: M0正式全树续跑第二百九十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-038

```text
tech_id: MIL-EXT-038
current_name: “远目”军事侦察观察设备组（侦观—01）总体设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, OVERBROAD_PRODUCT, MISSING_OPTICS_CHAIN, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: R6设备组混合昼间光学、夜视热成像和侦察能力。当前候选只交付ZG-A1昼间观察组，夜视热成像及本地光学制造另行补链。
evidence: SPEC-M1-STAGE16-ADVANCED-MILITARY-SYSTEMS-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, QLT-MET-001, MIL-EXT-039
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_MODEL, RESTORE_MISSING_OPTICS_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第二百九十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-042

```text
tech_id: MIL-EXT-042
current_name: “静潮”电子战设备组（电战—01）总体设计
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, MISSING_RF_CHAIN, MISSING_SIGNAL_PROCESSING_CHAIN, MISSING_COMPONENT_CHAIN, STAGE_ORDER_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 普通电台和电磁兼容治理不能提供宽带接收、频谱识别、测向与压制。当前射频功放、信号处理、天线和标定链不足，节点后移且不生成正文。
evidence: SPEC-M1-STAGE16-ADVANCED-MILITARY-SYSTEMS-BATCH-AMENDMENT-001
related_tech_ids: ICD-EMC-001, MIL-EXT-041, ELC-RAD-001
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_RF_CHAIN, RESTORE_SIGNAL_PROCESSING_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百九十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-049

```text
tech_id: MIL-EXT-049
current_name: “火种”野战移动电源系统（野电—01）总体设计
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 节点与ENE-EMG-001及YD-A1移动应急发电机组完全重复。当前合并删除，军事单位直接读取实际YD-A1库存和部署条件。
evidence: SPEC-M1-STAGE16-ADVANCED-MILITARY-SYSTEMS-BATCH-AMENDMENT-001
related_tech_ids: ENE-EMG-001, ENE-GEN-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REUSE_EXISTING_PRODUCT, REWIRE_DEPENDENTS, REMOVE_AUTO_INSTANCES
raised_at: M0正式全树续跑第二百九十五项事实审查
resolution_status: waiting_post_tree_review
```

### MET-HTR-001

```text
tech_id: MET-HTR-001
current_name: 钢材热处理工艺
fact_gate: pass_with_tree_review
issue_tags: TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, PREREQUISITE_ERROR
issue_statement: R6把退火正火淬火回火及热处理钢材误列为库存产品。当前候选保留共享热处理工段与四类行动，材料和零件保持原产品身份并取得热处理状态。
evidence: SPEC-M1-STAGE16-HEAT-TREATMENT-FIELD-KITS-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: MET-IRN-001, NRG-HTR-001-B, MET-FRG-001, MAT-CST-001
blocks_prose: false
provisional_post_review_action: RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REMOVE_ABSTRACT_PRODUCTS
raised_at: M0正式全树续跑第二百八十六项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-009

```text
tech_id: MIL-EQP-009
current_name: “开路”工兵装备套装（工兵—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6未区分装备套装、部队编成与爆破库存。当前候选交付GB-A1基础工兵装备组，爆破器材和机械化工程装备留在独立路线。
evidence: SPEC-M1-STAGE16-HEAT-TREATMENT-FIELD-KITS-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: MCH-HND-001, CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第二百八十七项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-011

```text
tech_id: MIL-EQP-011
current_name: “续行”野战医疗与后送装备套装（卫勤—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6把野战急救器材、耗材补充和部队能力混写。当前候选交付WQ-A1卫勤装备组，耗材车辆人员和远距后送仍按真实条件读取。
evidence: SPEC-M1-STAGE16-HEAT-TREATMENT-FIELD-KITS-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: MED-TRI-001, MED-IPC-001, MED-SUP-001-A, MED-SUP-001-B
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第二百八十八项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-012

```text
tech_id: MIL-EQP-012
current_name: “前路”轻型军用摩托车（军摩—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: R6未接入民用摩托车工业，并把通信和侦察能力藏进车辆。当前候选交付MT-A1M军用派生型，任务能力读取实际载荷、人员、燃料和编成。
evidence: SPEC-M1-STAGE16-HEAT-TREATMENT-FIELD-KITS-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: VEH-MOT-001, ELC-RAD-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_DERIVATIVE_MODEL, REWIRE_PREREQUISITE, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第二百八十九项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-008

```text
tech_id: MIL-EXT-008
current_name: “沉弧”重型迫击武器（重迫—01）总体设计
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, MISSING_MATERIAL_CHAIN, MISSING_AMMUNITION_CHAIN, MISSING_COMPONENT_CHAIN, STAGE_ORDER_ERROR
issue_statement: 当前只有轻迫经验和普通结构钢，不能证明具备120毫米炮管、炮架、弹药、瞄具、牵引和安全试验能力。QP-B1候选后移，当前不生成正文或解锁。
evidence: SPEC-M1-STAGE16-HEAT-TREATMENT-FIELD-KITS-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: MIL-EQP-004, MET-HTR-001, MIL-AMM-003
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_MATERIAL_CHAIN, RESTORE_MISSING_AMMUNITION_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百九十项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-PIP-001

```text
tech_id: MAT-PIP-001
current_name: 管材选型、无缝管与焊接管生产
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, SCALE_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: R6把焊接管与无缝管合成单项并自动形成管材产能。当前候选收窄为Q235B低压流体焊接钢管生产，无缝和高压管不随本项解锁。
evidence: SPEC-M1-STAGE16-PIPE-REFRACTORY-MEDICAL-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百八十一项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-REF-001

```text
tech_id: MAT-REF-001
current_name: 高铝耐火材料配方、烧结与炉衬维护
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, PRODUCT_IDENTITY_ERROR, UNLOCK_MISMATCH, MISSING_RESOURCE_CHAIN, RESEARCH_COST_ERROR
issue_statement: R6缺少耐材等级及高铝原料和结合料链。当前候选交付LZ-55高铝砖与LCC-60低水泥高铝浇注料，并保留两项原料缺口。
evidence: SPEC-M1-STAGE16-PIPE-REFRACTORY-MEDICAL-BATCH-AMENDMENT-001
related_tech_ids: MET-FUR-001-A, RSC-AL-001, NRG-HTR-001-B
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, RESTORE_MISSING_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第二百八十二项事实审查
resolution_status: waiting_post_tree_review
```

### MED-DIA-001

```text
tech_id: MED-DIA-001
current_name: 基础检验、影像设备修复与临床诊断记录标准
fact_gate: return_split_delete
issue_tags: OVERBROAD_TECH_IDENTITY, NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, DUPLICATE_MILESTONE, RESEARCH_COST_ERROR
issue_statement: 单一节点混合医学检验、遗产影像设备维修和通用诊断记录。当前拆为基础医学检验与后移的旧影像设备修复，删除不具独立游戏价值的诊断记录科研。
evidence: SPEC-M1-STAGE16-PIPE-REFRACTORY-MEDICAL-BATCH-AMENDMENT-001
related_tech_ids: SCI-LAB-001, MED-IPC-001, RPR-DIA-001, ELC-CMP-001, HLT-LAB-001, HLT-IMG-001
blocks_prose: true
provisional_post_review_action: SPLIT, DELETE_GENERIC_RECORD_TECH, REWIRE_PREREQUISITES, REBALANCE_COST
raised_at: M0正式全树续跑第二百八十三项事实审查
resolution_status: waiting_post_tree_review
```

### MED-MAT-001

```text
tech_id: MED-MAT-001
current_name: 医疗耗材、卫生材料与基础供应
fact_gate: pass_with_tree_review
issue_tags: IDENTITY_MISMATCH, NAME_MISMATCH, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, SCOPE_ERROR, RESEARCH_COST_ERROR
issue_statement: R6名称指向耗材供应，正文却描述孕产照护。当前候选按真实内容改为孕产连续照护，并把耗材交回具体供应链节点。
evidence: SPEC-M1-STAGE16-PIPE-REFRACTORY-MEDICAL-BATCH-AMENDMENT-001
related_tech_ids: POP-MCH-001, MED-TRI-001, MED-IPC-001, HLT-NEO-001, MED-SUP-001-A, MED-SUP-001-B
blocks_prose: false
provisional_post_review_action: RENAME, RESTORE_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百八十四项事实审查
resolution_status: waiting_post_tree_review
```

### MED-SUP-001-A

```text
tech_id: MED-SUP-001-A
current_name: 医用敷料制造
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, STERILITY_BOUNDARY_ERROR, AUTO_INSTANCE_ERROR
issue_statement: R6未区分清洁加工与灭菌，并自动生成敷料。当前候选交付三类非无菌敷料，灭菌及无菌领用由后续节点承担。
evidence: SPEC-M1-STAGE16-PIPE-REFRACTORY-MEDICAL-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001-B, MED-IPC-001, MED-SUP-001-B
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, ADD_PRODUCT_IDENTITY, FIX_STERILITY_BOUNDARY, RETYPE_OUTPUTS
raised_at: M0正式全树续跑第二百八十五项事实审查
resolution_status: waiting_post_tree_review
```

### POP-STA-001

```text
tech_id: POP-STA-001
current_name: 人口总账标准
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6正式对象同时包含同义登记对象，并把部分行动与记录类型混写；第一阶段事实修正已去重为二十三项行动或记录。
evidence: SPEC-M1-STAGE01-FACT-AMENDMENT-001 第1节
related_tech_ids: POP-STA-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U107前十项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-SUR-001-A

```text
tech_id: FOD-SUR-001-A
current_name: 土壤勘察
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6农业勘察重复要求居住区划定前置，并与另外两项农业勘察重复使用区域类解锁；第一阶段修正为只依赖地表危险勘察，并保留土壤勘察专属的候选农地与禁种地。
evidence: SPEC-M1-STAGE01-FACT-AMENDMENT-001 第2至3节
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, FOD-SUR-001-B, FOD-SUR-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U107前十项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-SUR-001-B

```text
tech_id: FOD-SUR-001-B
current_name: 农用水源评估
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6农业勘察重复要求居住区划定前置，并与另外两项农业勘察重复使用区域类解锁；第一阶段修正为只依赖地表危险勘察，并保留可用农业水源与受限农业水源。
evidence: SPEC-M1-STAGE01-FACT-AMENDMENT-001 第2至3节
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, FOD-SUR-001-A, FOD-SUR-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U107前十项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-SUR-001-C

```text
tech_id: FOD-SUR-001-C
current_name: 食源安全勘察
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6农业勘察重复要求居住区划定前置，并与另外两项农业勘察重复使用区域类解锁；第一阶段修正为只依赖地表危险勘察，并保留安全采集区与禁采区。
evidence: SPEC-M1-STAGE01-FACT-AMENDMENT-001 第2至3节
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, FOD-SUR-001-A, FOD-SUR-001-B
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U107前十项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-RTE-001-A

```text
tech_id: LOG-RTE-001-A
current_name: 路线测绘
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: 路线测绘只能形成路线测绘图与候选运输路线，不能单项直接解锁正式运输路线；第一阶段已经缩回候选资格。
evidence: SPEC-M1-STAGE01-FACT-AMENDMENT-001 第2至3节
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, LOG-RTE-001-B, LOG-RTE-001-C
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U107前十项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-RTE-001-B

```text
tech_id: LOG-RTE-001-B
current_name: 通行风险调查方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6仍把本项与路线测绘并列依赖地表勘察和居住边界，并重复解锁正式运输路线；现行结构修正为直接承接路线测绘，只形成通行风险调查、调查记录与路线通行限制。现名超过七个汉字，也须在本轮文字交付中缩短。
evidence: SPEC-M1-BATCH10-ATOMIC-OUTPUT-AMENDMENT-001 第3节
related_tech_ids: LOG-RTE-001-A, LOG-RTE-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十一项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-RTE-001-C

```text
tech_id: LOG-RTE-001-C
current_name: 季节变化记录标准
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6仍把本项与路线测绘并列依赖地表勘察和居住边界，并重复解锁正式运输路线；现行结构修正为直接承接路线通行评估，只形成路线季节记录与季节性通行时段。现名超过七个汉字，也须在本轮文字交付中缩短。
evidence: SPEC-M1-BATCH10-ATOMIC-OUTPUT-AMENDMENT-001 第3节
related_tech_ids: LOG-RTE-001-A, LOG-RTE-001-B
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十二项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-WHS-001

```text
tech_id: LOG-WHS-001
current_name: 仓储分区、盘点与周转
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把“库存位置账”误标为设施；现行修正已将它恢复为记录。节点本身保留为玩家尺度的统一仓储管理里程碑，不把分区、盘点和周转重新拆成三个低价值科技；现名含标点且超过七个汉字，须在本轮缩短。
evidence: SPEC-M1-BATCH10-ATOMIC-OUTPUT-AMENDMENT-001 第4节；SPEC-M1-ROADS-TRANSPORT-LOGISTICS-001 第2节
related_tech_ids: POP-STA-001, QLT-TRC-001, LOG-HND-001, LOG-DSP-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十三项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-REN-001-A

```text
tech_id: NRG-REN-001-A
current_name: 小型水力发电现场适配
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, UNLOCK_MISMATCH, PREREQUISITE_ERROR, DEMOTE_CANDIDATE
issue_statement: R6把抽象的“小型水力发电”误作产品，并与后续水轮发电机组和水力站工程重复；现行临时身份缩为水能站址评估，只形成调查、评估记录与候选站址。它是否值得独立成科技，仍须与下沉为水力站工程前置条件的方案比较。
evidence: SPEC-M1-STAGE02-RENEWABLE-SITE-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001 第2、3、6.2节
related_tech_ids: NRG-REN-001-B, NRG-REN-001-C, NRG-DSP-001, ENE-HYD-001
blocks_prose: false
provisional_post_review_action: DEMOTE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十五项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-REN-001-B

```text
tech_id: NRG-REN-001-B
current_name: 小型风力发电现场适配
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, UNLOCK_MISMATCH, PREREQUISITE_ERROR, DEMOTE_CANDIDATE
issue_statement: R6把抽象的“小型风力发电”误作产品，并与后续风力发电机组和风力场工程重复；现行临时身份缩为风能站址评估，只形成调查、评估记录与候选站址。它是否值得独立成科技，仍须与下沉为风力场工程前置条件的方案比较。
evidence: SPEC-M1-STAGE02-RENEWABLE-SITE-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001 第2、3、6.2节
related_tech_ids: NRG-REN-001-A, NRG-REN-001-C, NRG-DSP-001, ENE-WND-001
blocks_prose: false
provisional_post_review_action: DEMOTE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十六项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-REN-001-C

```text
tech_id: NRG-REN-001-C
current_name: 小型太阳能发电现场适配
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, UNLOCK_MISMATCH, PREREQUISITE_ERROR, DEMOTE_CANDIDATE
issue_statement: R6把抽象的“小型太阳能发电”误作产品，并与后续太阳能设备组和太阳能场工程重复；现行临时身份缩为太阳能站址评估，只形成调查、评估记录与候选站址。它是否值得独立成科技，仍须与下沉为太阳能场工程前置条件的方案比较。
evidence: SPEC-M1-STAGE02-RENEWABLE-SITE-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001 第2、3、6.2节
related_tech_ids: NRG-REN-001-A, NRG-REN-001-B, NRG-DSP-001, ENE-SOL-001
blocks_prose: false
provisional_post_review_action: DEMOTE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十七项事实审查
resolution_status: waiting_post_tree_review
```

### POP-AGE-001

```text
tech_id: POP-AGE-001
current_name: 年龄队列推进与劳动资格转入
fact_gate: pass_with_tree_review
issue_tags: LOW_GAME_VALUE, DEMOTE_CANDIDATE, UNLOCK_MISMATCH
issue_statement: 年龄按月推进本来就是人口模拟的固定结算，不应让人口在科研完成前停止成长；可研究部分只可能是把年龄、健康、教育和训练记录接入劳动资格判断的行政方法。R6又把“劳动资格转入”误标为记录。当前候选仅按资格衔接方法写作，终局须裁决是否下沉为人口总账的自动功能或法律标准。
evidence: SPEC-M1-POPULATION-GROWTH-REFUGEE-001 第3.3、4、7.1节；SPEC-M1-HUNDRED-THOUSAND-POPULATION-WORKFORCE-CAPACITY-001 第2、3.1节
related_tech_ids: POP-STA-001, SOC-APR-001, POP-HEA-001
blocks_prose: false
provisional_post_review_action: DEMOTE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第十八项事实审查
resolution_status: waiting_post_tree_review
```

### POP-MCH-001

```text
tech_id: POP-MCH-001
current_name: 孕产与婴幼儿照护体系
fact_gate: pass_with_tree_review
issue_tags: SPLIT_CANDIDATE, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, DEMOTE_CANDIDATE
issue_statement: R6把人口登记、孕产医疗、新生儿照护、婴幼儿营养和早期健康服务混成一项科技，并与后续产育医疗、新生儿照护节点重复。当前临时身份只保留妊娠与出生登记四项对象；医疗和营养能力交还后续系统。登记本身是否还值得独立研究，终局继续比较下沉方案。
evidence: SPEC-M1-STAGE02-POPULATION-RECORD-FACT-AMENDMENT-001；SPEC-M1-POPULATION-GROWTH-REFUGEE-001 第4、7.2节；SPEC-M1-MEDICINE-PUBLIC-HEALTH-001 第2节
related_tech_ids: POP-STA-001, MED-MAT-001, HLT-NEO-001
blocks_prose: false
provisional_post_review_action: SPLIT, DEMOTE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十项事实审查
resolution_status: waiting_post_tree_review
```

### POP-MIG-001

```text
tech_id: POP-MIG-001
current_name: 自愿迁居、派驻与迁出登记
fact_gate: pass_with_tree_review
issue_tags: LOW_GAME_VALUE, DEMOTE_CANDIDATE, UNLOCK_MISMATCH
issue_statement: R6把迁居、派驻和迁出各自的总称、行动与记录重复列为九项解锁，并把属于法律边界的“自愿”写进技术名称。当前临时身份统一为人口迁移登记，只保留三组行动与记录；终局须判断是否下沉为人口总账的地点变更功能。
evidence: SPEC-M1-STAGE02-POPULATION-RECORD-FACT-AMENDMENT-001 第5节；SPEC-M1-POPULATION-GROWTH-REFUGEE-001 第3.1、4、7.1节
related_tech_ids: POP-STA-001, SET-NET-001, M1-EDICT-015
blocks_prose: false
provisional_post_review_action: DEMOTE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十一项事实审查
resolution_status: waiting_post_tree_review
```

### POP-REF-A01

```text
tech_id: POP-REF-A01
current_name: 外来人口接触、分诊与检疫
fact_gate: pass_with_tree_review
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, MERGE_CANDIDATE
issue_statement: R6把外部接触评估、批次初评、入境分诊、清洁处理和健康检疫合成一项，并只依赖人口总账。当前临时身份只保留入境分诊、清洁与检疫五项对象，外部接触退回外交/事件系统；终局还须与医疗感染控制节点比较是否合并。
evidence: SPEC-M1-STAGE02-POPULATION-RECORD-FACT-AMENDMENT-001 第6节；SPEC-M1-POPULATION-GROWTH-REFUGEE-001 第4、5节；SPEC-M1-MEDICINE-PUBLIC-HEALTH-001 第2节
related_tech_ids: POP-STA-001, MED-TRI-001, MED-IPC-001, WTR-POT-001, DIP-CON-001
blocks_prose: false
provisional_post_review_action: SPLIT, MERGE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十二项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-UNI-001

```text
tech_id: QLT-UNI-001
current_name: 统一单位、图纸符号与技术文件版本
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把单位、图纸符号和文件版本合理聚合为一项技术文件标准，却只登记“正式技术文件”一个总解锁，掩盖了三项独立标准。当前候选分列统一计量单位、统一图纸符号、技术文件版本规则和正式技术文件。
evidence: SPEC-M1-STAGE03-STANDARDIZATION-FACT-AMENDMENT-001；SPEC-M1-STANDARDIZATION-QUALITY-CONTROL-001 第2节
related_tech_ids: QLT-MET-001, QLT-TRC-001, SCI-LAB-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十三项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-GEO-001-A

```text
tech_id: RAW-GEO-001-A
current_name: 地质踏勘调查方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MERGE_CANDIDATE
issue_statement: R6错误依赖居住边界划定，并让三项地质科技重复解锁矿点候选。当前递进结构将本项缩回地质踏勘，只形成踏勘行动、踏勘记录与地质异常点；终局还须判断是否与露头编录合并。
evidence: SPEC-M1-STAGE03-GEOLOGY-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001 第2节
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, RAW-GEO-001-B, RAW-GEO-001-C
blocks_prose: false
provisional_post_review_action: MERGE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十四项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-GEO-001-B

```text
tech_id: RAW-GEO-001-B
current_name: 露头记录标准
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MERGE_CANDIDATE, LOW_GAME_VALUE
issue_statement: R6错误依赖居住边界划定并重复解锁矿点候选。当前递进结构将本项改为直接承接地质踏勘，只形成露头编录与岩性矿化线索；由于它可能只是踏勘内部记录标准，终局必须比较合并或下沉。
evidence: SPEC-M1-STAGE03-GEOLOGY-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001 第2节
related_tech_ids: RAW-GEO-001-A, RAW-GEO-001-C
blocks_prose: false
provisional_post_review_action: MERGE, DEMOTE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十五项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-GEO-001-C

```text
tech_id: RAW-GEO-001-C
current_name: 资源候选区划定调查方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6错误依赖居住边界划定并与前两项重复解锁矿点候选。当前递进结构将本项改为直接承接露头编录，只形成资源候选区划定行动、记录和资源候选区，不证明储量、品位或可采性。
evidence: SPEC-M1-STAGE03-GEOLOGY-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001 第2节
related_tech_ids: RAW-GEO-001-A, RAW-GEO-001-B, RAW-MIN-001, RAW-QUA-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十六项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-SCR-001

```text
tech_id: RAW-SCR-001
current_name: 废墟材料辨识、危险隔离与分级回收
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6把居住边界划定列为废墟材料分级回收的直接前置，但材料辨识、危险隔离与分流只需要地表危险勘察提供进入和作业边界。当前候选保留分级回收场、废料批次和危险废料隔离工程三个独立解锁，并移除居住边界前置。
evidence: SPEC-M1-STAGE03-GEOLOGY-FACT-AMENDMENT-001 第4节；SPEC-M1-RESOURCE-EXTRACTION-FORESTRY-RECYCLING-SYSTEM-001
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, MOD-RCY-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第二十七项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-INS-001

```text
tech_id: RPR-INS-001
current_name: 设备清点、状态分级与故障档案
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6把人口总账标准列为设备状态清查的直接前置，但人口统计不提供设备清点或状态判断能力。当前候选把清点、状态分级和已知故障档案保留为一个玩家尺度里程碑，维持三项记录类解锁并移除无关前置。
evidence: SPEC-M1-STAGE03-EQUIPMENT-INVENTORY-FACT-AMENDMENT-001；SPEC-M1-MAINTENANCE-SPARES-REMANUFACTURING-001
related_tech_ids: POP-STA-001, RPR-PMV-001, RPR-DIA-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第二十八项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-ARC-001

```text
tech_id: SCI-ARC-001
current_name: 技术档案保存与检索
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6错误依赖人口总账标准，并把遗产档案清点行动登记成记录类型。当前候选保留档案清点、状态标注与检索作为一个玩家尺度里程碑，移除无关前置，并恢复行动、记录、档案库三个独立输出的正确类型。
evidence: SPEC-M1-STAGE03-HERITAGE-ARCHIVE-FACT-AMENDMENT-001；SPEC-M1-RESEARCH-ORGANIZATION-TECHNOLOGY-DIFFUSION-001
related_tech_ids: POP-STA-001, SCI-LAB-001, SCI-EXT-001, SCI-TRN-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第二十九项事实审查
resolution_status: waiting_post_tree_review
```

### SET-CMP-001

```text
tech_id: SET-CMP-001
current_name: 临时营地分区与昼夜运行组织
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6重复登记地表危险勘察与其后继居住边界划定为直接前置，并把临时居住营地误写成记录类型。当前候选只保留居住边界划定前置，把营地恢复为设施；分区与昼夜安排继续作为同一营地组织能力的内部环节。
evidence: SPEC-M1-STAGE03-TEMPORARY-CAMP-FACT-AMENDMENT-001；SPEC-M1-SET-SUR-001-AB-R7-STRUCTURE-AMENDMENT-001；SPEC-M1-SETTLEMENT-URBANIZATION-001
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, SET-HOU-001, SET-SVC-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第三十项事实审查
resolution_status: waiting_post_tree_review
```

### SET-HOU-001

```text
tech_id: SET-HOU-001
current_name: 可修复建筑鉴定与基础住处整备
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6重复登记地表危险勘察与居住边界划定为直接前置，并只登记鉴定行动和最终住处，缺少鉴定记录及实体改造工程。当前候选只保留居住边界划定前置，补齐行动、记录、工程和设施四项输出，同时把鉴定与改造保留为同一住用转化里程碑。
evidence: SPEC-M1-STAGE03-BUILDING-CONVERSION-FACT-AMENDMENT-001；SPEC-M1-SET-SUR-001-AB-R7-STRUCTURE-AMENDMENT-001；SPEC-M1-SETTLEMENT-URBANIZATION-001
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, SET-CMP-001, SET-SVC-001, URB-HYG-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第三十一项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-SUR-001-A

```text
tech_id: WTR-SUR-001-A
current_name: 地表径流测量与季节流量评估
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6错误依赖居住边界划定，并重复登记其前置地表危险勘察。当前候选只保留地表危险勘察前置，维持地表水测量、季节流量记录和候选地表取水点三个独立输出；不越入饮用安全判断或取水建设。
evidence: SPEC-M1-STAGE03-WATER-SURVEY-FACT-AMENDMENT-001 第2节与第6节；SPEC-M1-WATER-SANITATION-ENVIRONMENT-SYSTEM-001
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, WTR-SUR-001-B, WTR-INT-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第三十二项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-SUR-001-B

```text
tech_id: WTR-SUR-001-B
current_name: 地下水水文地质勘探
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6错误依赖居住边界划定并重复登记地表危险勘察，却没有承接提供地层、构造与地下水异常线索的地质踏勘。当前候选改为直接依赖地质踏勘，维持地下水勘探行动、水文地质剖面和候选井位三个输出；候选井位不等于已打井或已出水。
evidence: SPEC-M1-STAGE03-WATER-SURVEY-FACT-AMENDMENT-001 第3节与第6节；SPEC-M1-WATER-SANITATION-ENVIRONMENT-SYSTEM-001
related_tech_ids: RAW-GEO-001-A, SET-SUR-001-B, WTR-WEL-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第三十三项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-SUR-001-C

```text
tech_id: WTR-SUR-001-C
current_name: 埋地管线定位方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6错误依赖居住边界划定并重复登记其前置地表危险勘察。当前候选只保留地表危险勘察前置，维持管线定位行动、位置记录和地面标记三个输出；定位结果只证明疑似位置与走向，不证明用途、内部状态、连接关系或可恢复性。
evidence: SPEC-M1-STAGE03-WATER-SURVEY-FACT-AMENDMENT-001 第4节与第6节；SPEC-M1-WATER-SANITATION-ENVIRONMENT-SYSTEM-001
related_tech_ids: SET-SUR-001-A, SET-SUR-001-B, WTR-SUR-001-D, WTR-LEK-001-A
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第三十四项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-SUR-001-D

```text
tech_id: WTR-SUR-001-D
current_name: 旧管网连接关系测绘标准
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6错误依赖居住边界划定并重复登记地表危险勘察，却没有承接提供管线位置和走向的埋地管线定位。当前候选改为直接依赖埋地管线定位，维持连接关系图、阀门节点记录和分段核验工程三个输出；测绘结果不证明清洁、承压或可直接供水。
evidence: SPEC-M1-STAGE03-WATER-SURVEY-FACT-AMENDMENT-001 第5节与第6节；SPEC-M1-WATER-SANITATION-ENVIRONMENT-SYSTEM-001
related_tech_ids: WTR-SUR-001-C, WTR-LEK-001-A, WTR-TST-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第三十五项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-LAB-001

```text
tech_id: CHM-LAB-001
current_name: 化学品鉴别、标签复核与安全实验操作
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把未知化学品鉴别、标签复核与安全实验操作保留为同一基础实验室能力，却只登记实验室和化学品账，漏掉鉴别行动、鉴别记录与安全规程。当前候选补齐五项独立输出，不越入试剂生产、精确成分分析或工业化学工艺。
evidence: SPEC-M1-STAGE03-CHEMICAL-IDENTIFICATION-FACT-AMENDMENT-001；SPEC-M1-CHEMICAL-REAGENTS-CONSUMABLES-001
related_tech_ids: RAW-SCR-001, CHM-ANA-001, CHM-REA-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第三十六项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-CMP-001

```text
tech_id: ELC-CMP-001
current_name: 基础电气元件检验
fact_gate: pass_with_tree_review
issue_tags: SCALE_ERROR, UNLOCK_MISMATCH
issue_statement: R6虽然把电阻、电容与线圈检验合并成一项科技，却仍向玩家分别解锁三组行动和记录，并把可领用的合格元件池写成记录，尺度过碎且类型错误。当前候选聚合为基础元件检验行动、记录与合格基础元件产品三项输出。
evidence: SPEC-M1-STAGE03-ELECTRICAL-COMPONENT-FACT-AMENDMENT-001；SPEC-M1-COMMUNICATIONS-ELECTRICAL-INSTRUMENTS-001；用户确认的过细零件聚合原则
related_tech_ids: ELC-SAF-001, ELC-INS-001, ELC-REC-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第三十七项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-GAS-001

```text
tech_id: ENE-GAS-001
current_name: 沼气脱硫、脱水、储存与燃烧适配方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: R6让沼气净化直接依赖发电机组修复，却没有依赖生产粗沼气的小型沼气设施，原料与用途关系倒置。当前候选改为直接依赖NRG-BIO-001，保留净化沼气、储存工程和燃烧安全规程三个输出。
evidence: SPEC-M1-STAGE03-BIOGAS-TREATMENT-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001；SPEC-M1-ENERGY-FUEL-POWER-001
related_tech_ids: NRG-GEN-001, NRG-BIO-001, ENE-GEN-002
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE
raised_at: M0-S004-U111正式全树续跑第三十八项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-STM-001

```text
tech_id: ENE-STM-001
current_name: 工业蒸汽、换热、凝结水回收与热网平衡方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖发电机组修复，缺少连续热源、承压管道和工业阀门，并把地点化蒸汽热网误写成产品。当前候选改为依赖NRG-HTR-001、MAT-PIP-001和IME-VLV-001，把热网恢复为工程；另登记太阳能节点对本项的无因果依赖，留待其本项复审移除。
evidence: SPEC-M1-STAGE03-STEAM-NETWORK-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001
related_tech_ids: NRG-GEN-001, NRG-HTR-001, MAT-PIP-001, IME-VLV-001, ENE-SOL-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第三十九项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-SED-001

```text
tech_id: FOD-SED-001
current_name: 种源鉴定、发芽试验与公共种源保存
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把土壤、农业用水和食源安全三项勘察都列作种子发芽与保存的知识前置，但三者只影响部署条件；同时节点没有解锁试验后可进入农业链的合格种源产品。当前候选移除无关前置，补充合格种源批次，并保留种源库、苗圃、试验行动与记录。
evidence: SPEC-M1-STAGE03-SEED-STOCK-FACT-AMENDMENT-001；SPEC-M1-AGRICULTURE-FOOD-RESERVE-001；SPEC-M1-AGRICULTURAL-PRODUCTION-SYSTEM-001
related_tech_ids: FOD-SUR-001-A, FOD-SUR-001-B, FOD-SUR-001-C, FOD-CRP-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-SOI-001

```text
tech_id: FOD-SOI-001
current_name: 表土修复、堆肥与轮作肥力管理
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把农业用水与食源安全勘察误作土壤肥力修复的知识前置，却没有承接可用种源；同时漏掉堆肥产品和轮作标准，并把试验田误写成记录。当前候选改为依赖土壤勘察与种源检验保存，补齐工程、设施、产品和标准五项输出。
evidence: SPEC-M1-STAGE04-SOIL-FERTILITY-FACT-AMENDMENT-001；SPEC-M1-AGRICULTURE-FOOD-RESERVE-001；SPEC-M1-AGRICULTURAL-PRODUCTION-SYSTEM-001
related_tech_ids: FOD-SUR-001-A, FOD-SUR-001-B, FOD-SUR-001-C, FOD-SED-001, FOD-CRP-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十一项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-HND-001

```text
tech_id: MCH-HND-001
current_name: 手工具修复、刃具磨制与安全使用
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把可重复的手工具修复误写为工程，并漏掉实际作坊、修复行动和名称中已有的安全规程。当前候选恢复手工具作坊与修复行动，保留通用手工具、通用刃具两个聚合产品族并补齐安全标准。
evidence: SPEC-M1-STAGE04-HAND-TOOL-FACT-AMENDMENT-001；SPEC-M1-MACHINE-TOOLS-INDUSTRIAL-MOTHER-MACHINES-001
related_tech_ids: RAW-SCR-001, MCH-BAS-001, MCH-CUT-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十二项事实审查
resolution_status: waiting_post_tree_review
```

### MED-TRI-001

```text
tech_id: MED-TRI-001
current_name: 伤病分诊与救治次序
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把急救点误写成记录，并没有把救治次序登记为独立标准。当前候选恢复急救点设施类型，补充伤病救治优先级，保留分诊行动、记录和后送任务，形成一条完整但不承诺治愈或运力的分诊链。
evidence: SPEC-M1-STAGE04-MEDICAL-TRIAGE-FACT-AMENDMENT-001；SPEC-M1-MEDICINE-PUBLIC-HEALTH-001
related_tech_ids: POP-HEA-001, POP-REF-A01, MED-EMR-001, MED-EMS-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十三项事实审查
resolution_status: waiting_post_tree_review
```

### MET-SRT-001

```text
tech_id: MET-SRT-001
current_name: 废金属材质判别、除污与炉料配比
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖废料分级回收并只登记最终炉料产品，缺少未知污染物鉴别能力以及材质、污染和配比的可追溯输出。当前候选增加化学品安全鉴别前置，补齐分选行动、材质记录、污染状态与配比标准。
evidence: SPEC-M1-STAGE04-RECYCLED-CHARGE-FACT-AMENDMENT-001；SPEC-M1-METALLURGY-INDUSTRIAL-MATERIALS-001
related_tech_ids: RAW-SCR-001, CHM-LAB-001, MET-IRN-001, MET-ALY-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十四项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-FUL-001

```text
tech_id: NRG-FUL-001
current_name: 液体燃料鉴别、净化与安全储运
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6让燃料整备依赖发电机组修复，倒置燃料与设备关系，并只登记最终燃料和燃料库，漏掉检验与储运标准。当前候选改为依赖化学品安全鉴别，补齐燃料检验行动、记录和安全规程。
evidence: SPEC-M1-STAGE04-LIQUID-FUEL-FACT-AMENDMENT-001；SPEC-M1-ENERGY-FUEL-POWER-001
related_tech_ids: CHM-LAB-001, NRG-GEN-001, NRG-HTR-001, ENE-LIQ-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十五项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-GRD-001

```text
tech_id: NRG-GRD-001
current_name: 低压配电、保护分区与用电计量
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只有发电机前置，缺少低压电气安全能力，并把地点化配电网误写成组织。当前候选增加低压电气检修前置，把配电网拆清为建设工程、保护分区标准、计量账和网络状态。
evidence: SPEC-M1-STAGE04-LOW-VOLTAGE-GRID-FACT-AMENDMENT-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001
related_tech_ids: NRG-GEN-001, ELC-SAF-001, NRG-STO-001, ENE-TRF-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十六项事实审查
resolution_status: waiting_post_tree_review
```

### POP-REF-A02

```text
tech_id: POP-REF-A02
current_name: 临时安置与岗位核验
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MERGE_CANDIDATE, DEMOTE_CANDIDATE, LOW_GAME_VALUE
issue_statement: R6缺少临时营地前置，并把安置与基本供给误写成记录；更根本地，本项可能只是入境接纳流程的行政运行，没有独立科研价值。当前候选增加营地前置，恢复状态、标准、行动和记录类型，终局比较与A01合并或下沉。
evidence: SPEC-M1-STAGE04-TRANSITIONAL-PLACEMENT-FACT-AMENDMENT-001；SPEC-M1-POPULATION-GROWTH-REFUGEE-001
related_tech_ids: POP-REF-A01, POP-STA-001, SET-CMP-001, POP-MIG-001
blocks_prose: false
provisional_post_review_action: MERGE, DEMOTE, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十七项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-TRC-001

```text
tech_id: QLT-TRC-001
current_name: 产品批次与生产履历追溯
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把产品批次误写成产品、把生产履历标准误写成记录，并缺少批次编号标准。当前候选恢复产品批次为可追溯状态，分列编号标准、生产履历和序列履历，使问题批次可被单独隔离。
evidence: SPEC-M1-STAGE04-BATCH-TRACEABILITY-FACT-AMENDMENT-001；SPEC-M1-STANDARDIZATION-QUALITY-CONTROL-001
related_tech_ids: LOG-WHS-001, QLT-UNI-001, QLT-MET-001, QLT-RCL-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十八项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-MIN-001

```text
tech_id: RAW-MIN-001
current_name: 浅层矿体开拓、支护与安全采掘
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6重复列出地质链三项前置，却跳过岩芯钻探且缺少早期开采工具，并只登记矿场与支护产品。当前候选改为承接浅层岩芯钻探与手工具修磨，补齐开拓工程、原矿批次和基础安全规程。
evidence: SPEC-M1-STAGE04-SHALLOW-MINE-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001
related_tech_ids: RAW-GEO-001-C, RSC-DRL-001, MCH-HND-001, RAW-SAF-001, RAW-BEN-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第四十九项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-QUA-001

```text
tech_id: RAW-QUA-001
current_name: 露天采石、砂石筛分与骨料分级
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6重复列出地质链三项前置并缺少早期开采工具，只登记采石场和骨料产品。当前候选只保留资源区划末端、增加手工具修磨前置，补齐采石场开拓工程与骨料级配标准。
evidence: SPEC-M1-STAGE04-AGGREGATE-PRODUCTION-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001
related_tech_ids: RAW-GEO-001-C, MCH-HND-001, RAW-MIN-001, RAW-BEN-001, CNS-CON-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-CU-001

```text
tech_id: RSC-CU-001
current_name: 铜矿物识别、分级与选矿适配
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖地质踏勘却直接产出铜矿石、采区和选矿流程，缺少实际采矿与鉴别能力，并把采区与流程都误写成产品。当前候选改为依赖浅层矿井开采和化学品安全鉴别，恢复行动、记录、状态、标准和产品五类输出。
evidence: SPEC-M1-STAGE04-COPPER-ORE-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001；SPEC-M1-METALLURGY-INDUSTRIAL-MATERIALS-001
related_tech_ids: RAW-MIN-001, CHM-LAB-001, RSC-DRL-001, MET-ALY-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十一项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-DRL-001

```text
tech_id: RSC-DRL-001
current_name: 浅层钻探、岩芯编录与矿体连续性验证
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖地质踏勘，跳过露头编录与资源区划，并没有把岩芯样品列为独立产物；同时浅层矿井节点未依赖本项，开拓与地下验证次序倒置。当前候选承接资源区划与手工具修磨，补齐岩芯样品，并把本项接入矿井前置。
evidence: SPEC-M1-STAGE04-CORE-DRILLING-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001
related_tech_ids: RAW-GEO-001-C, MCH-HND-001, RAW-MIN-001, RSC-RSV-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十二项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-RSV-001

```text
tech_id: RSC-RSV-001
current_name: 可采储量、贫化、回收率与边界品位核算
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6错误依赖废料回收，并把储量表、采储计划和关闭条件全部写成产品。当前候选改为承接浅层矿井开采，把结果恢复为记录、状态、计划和标准，使储量随品位、损失与技术条件修正。
evidence: SPEC-M1-STAGE04-MINEABLE-RESERVE-FACT-AMENDMENT-001；SPEC-M1-MINING-BASIC-RESOURCES-001
related_tech_ids: RAW-MIN-001, RSC-DRL-001, RAW-NET-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十三项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-LAB-001

```text
tech_id: SCI-LAB-001
current_name: 基础实验室运行
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6只登记正式实验项目，遗漏基础研究实验室、实验记录与样品编号标准以及重复验证行动和记录。当前候选补齐五项输出，使实验结果能够由另一组人员复验，而不承诺第一次结论正确。
evidence: SPEC-M1-STAGE04-LABORATORY-OPERATION-FACT-AMENDMENT-001；SPEC-M1-RESEARCH-ORGANIZATION-TECHNOLOGY-DIFFUSION-001
related_tech_ids: QLT-UNI-001, SCI-ARC-001, CHM-LAB-001, SCI-REV-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十四项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-TRN-001

```text
tech_id: SCI-TRN-001
current_name: 科研人员训练与资格
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, SCALE_ERROR
issue_statement: R6名称指向科研人员，输出却混入基础教育、通用岗位训练与资格，并让基础识字科技反向依赖本项。当前候选收窄为科研专用课程、实验助理课程和科研岗位资格，改为依赖基础识字与基础实验室；通用训练输出移回社会分支。
evidence: SPEC-M1-STAGE04-RESEARCHER-TRAINING-FACT-AMENDMENT-001；SPEC-M1-RESEARCH-ORGANIZATION-TECHNOLOGY-DIFFUSION-001；SPEC-M1-LABOR-EDUCATION-LIVING-STANDARD-SYSTEM-001
related_tech_ids: SOC-LIT-001, SOC-APR-001, SOC-CRT-001, SCI-LAB-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十五项事实审查
resolution_status: waiting_post_tree_review
```

### SET-SVC-001

```text
tech_id: SET-SVC-001
current_name: 住区供水、排污与废弃物接入设计
fact_gate: return_then_resolved_as_three_candidates
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 供水、排污和固废收集具有不同上游系统、接口和后果，原节点只是方向总结；污水系统还反向依赖本节点，且“基础卫生工程”和“废弃物接入”掩盖了独立对象。当前修正拆为SET-SVC-001-A/B/C三项真实科技，并分别补齐前置与解锁。
evidence: SPEC-M1-STAGE04-SETTLEMENT-UTILITY-SPLIT-AMENDMENT-001；SPEC-M1-SETTLEMENT-URBANIZATION-001；SPEC-M1-WATER-SANITATION-ENVIRONMENT-SYSTEM-001
related_tech_ids: SET-HOU-001, SET-CMP-001, WTR-STO-001, WTR-SEW-001, SET-BLK-001
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十六项事实审查
resolution_status: resolved_locally_waiting_post_tree_review
```

### SOC-APR-001

```text
tech_id: SOC-APR-001
current_name: 学徒岗位、导师、工时与技能考核方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖年龄资格，缺少基础识字数理能力；输出也漏掉训练组织、工时技能记录和结业资格，并把结业考核写成产品。当前候选增加基础识字前置，恢复组织、标准、行动与记录六项输出。
evidence: SPEC-M1-STAGE04-APPRENTICESHIP-FACT-AMENDMENT-001；SPEC-M1-LABOR-EDUCATION-LIVING-STANDARD-SYSTEM-001
related_tech_ids: POP-AGE-001, SOC-LIT-001, SOC-CRT-001, SCI-TRN-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十七项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-GRD-001

```text
tech_id: TLG-GRD-001
current_name: 道路纵坡、横坡、弯道与视距设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6错误依赖仓储管理，并让基础道路建设跳过线形设计；同时把道路线形写成产品、通行状态写成记录。当前候选承接季节通行评估，恢复标准、记录、工程和状态，并登记本项应进入基础道路建设前置。
evidence: SPEC-M1-STAGE04-ROAD-ALIGNMENT-FACT-AMENDMENT-001；SPEC-M1-TRANSPORT-LOGISTICS-VEHICLE-SYSTEM-001；SPEC-M1-ROADS-TRANSPORT-LOGISTICS-001
related_tech_ids: LOG-RTE-001-C, LOG-RDS-001, TLG-PAV-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第五十八项事实审查
resolution_status: waiting_post_tree_review
```

### URB-THM-001

```text
tech_id: URB-THM-001
current_name: 建筑保温、供暖、通风与室内热环境设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6只依赖旧建筑改造却直接解锁暖通设备，缺少基础机械制造和热力来源；同时漏掉热环境标准并把室内热环境写成记录。当前候选增加MCH-BAS-001与NRG-HTR-001前置，恢复标准、产品、工程和状态四类输出。
evidence: SPEC-M1-STAGE04-BUILDING-THERMAL-FACT-AMENDMENT-001；SPEC-M1-SETTLEMENT-HOUSING-PUBLIC-WORKS-SYSTEM-001；SPEC-M1-ENERGY-PRODUCTION-GRID-SYSTEM-001
related_tech_ids: SET-HOU-001, MCH-BAS-001, NRG-HTR-001, CIV-APP-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK
raised_at: M0-S004-U111正式全树续跑第六十项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-TST-001

```text
tech_id: WTR-TST-001
current_name: 饮用水污染检测与分级判定
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把四项水源调查全部设为强制前置，把水质批次误作产品、用途等级误作普通记录，并用requiredCount自动生成实例。当前候选改为依赖基础实验室运行，恢复标准、行动、记录与状态四类输出，并限定判定只覆盖已检指标。
evidence: SPEC-M1-STAGE05-DRINKING-WATER-TEST-FACT-AMENDMENT-001
related_tech_ids: SCI-LAB-001, WTR-SUR-001-A, WTR-SUR-001-B, WTR-SUR-001-C, WTR-SUR-001-D
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第六十二项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-WEL-001-A

```text
tech_id: WTR-WEL-001-A
current_name: 浅井钻进工艺
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把试钻工程及其执行后才产生的井孔和岩层记录并列为科研直接输出，并用requiredCount要求科研生成实例。当前候选只由科研开放浅井试钻工程，井孔和记录改为工程实例产出，能力边界停在成孔取证。
evidence: SPEC-M1-STAGE05-SHALLOW-WELL-DRILLING-FACT-AMENDMENT-001
related_tech_ids: WTR-SUR-001-B
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第六十三项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-CER-001

```text
tech_id: AGR-CER-001
current_name: 谷物品种配置、播种密度与田间管理方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, SCALE_ERROR
issue_statement: R6以种源检验为唯一前置，把露地农业称为生产线，重复解锁合格种子，并让科研直接生成收获批次。当前候选改为承接露地耕作，只开放谷物种植行动，收获批次由行动产生。
evidence: SPEC-M1-STAGE05-CEREAL-CULTIVATION-FACT-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-SED-001, FOD-SOI-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_DUPLICATE_OUTPUT, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第六十四项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-OIL-001

```text
tech_id: AGR-OIL-001
current_name: 油料作物栽培、成熟判定与含油率管理方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, SCALE_ERROR
issue_statement: R6把露地农业写成生产线，重复解锁合格种子，并让科研自动生成油料作物批次。当前候选承接露地耕作，只开放种植行动和采收标准，实际批次由生产行动产生。
evidence: SPEC-M1-STAGE05-OIL-CROP-CULTIVATION-FACT-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-SED-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_DUPLICATE_OUTPUT, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第六十五项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-SEP-001

```text
tech_id: CHM-SEP-001
current_name: 蒸馏、过滤、结晶与基础分离纯化
fact_gate: return_then_split
issue_tags: SPLIT_CANDIDATE, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 蒸馏、介质过滤和结晶纯化采用不同物理原理、设备与适用物料，R6仅以通用“分离”概念强行合并；现有输出还把方法写成产品并要求科研生成设备和批次。原节点拆为A/B/C三个科技后分别过门。
evidence: SPEC-M1-STAGE05-BASIC-SEPARATION-SPLIT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, CHM-SEP-001-A, CHM-SEP-001-B, CHM-SEP-001-C
blocks_prose: true_for_original_false_after_split_review
provisional_post_review_action: SPLIT, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第六十六项事实审查
resolution_status: split_candidates_pass_waiting_post_tree_rewire
```

### CIV-LGT-001

```text
tech_id: CIV-LGT-001
current_name: 安全照明、插接电器与家庭用电保护
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把家庭照明和基础电器接口误作记录，并要求科研自动生成三份实例。当前候选保留住宅末端用电这一单一设计，改为解锁标准、接入工程和用电状态，器件作为实体条件。
evidence: SPEC-M1-STAGE05-RESIDENTIAL-ELECTRIC-FACT-AMENDMENT-001
related_tech_ids: ELC-SAF-001, NRG-GRD-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第六十七项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-WIR-001

```text
tech_id: ELC-WIR-001
current_name: 有线电话、信号线路与值班通信
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把通信网误作组织、值班通信误作产品，并用固定数量让科研自动完成终端与网络实例。当前候选改为分别解锁电话终端产品、通信网工程、值班岗位和通信状态。
evidence: SPEC-M1-STAGE05-WIRED-COMMUNICATION-FACT-AMENDMENT-001
related_tech_ids: ELC-CMP-001, ELC-SAF-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第六十八项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-GEN-001

```text
tech_id: ENE-GEN-001
current_name: 标准小型内燃发电机组设计、总装与试验方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6只以前置低压配电便开放标准内燃机组，缺少旧机组修复和燃料整备，并省略生产图纸、用固定数量让科研自动产机组。当前候选限定为回收核心的标准化总装与负载定型。
evidence: SPEC-M1-STAGE05-COMBUSTION-GENERATOR-FACT-AMENDMENT-001
related_tech_ids: NRG-GEN-001, NRG-FUL-001, NRG-GRD-001, MCH-BAS-001, VEH-ENG-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第六十九项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-LIQ-001

```text
tech_id: ENE-LIQ-001
current_name: 本地液体燃料原料评价、转化与成品调合方法
fact_gate: return_delete_from_current_tree
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, SPLIT_CANDIDATE, DEMOTE_CANDIDATE
issue_statement: 节点没有确定原料、转化路线、产品规格或适用设备，把评价、转化和调合三个层级强行合并；rank3与30点也不能支撑具体燃料转化。当前树删除，未来按植物油、乙醇、生物柴油或热解油分别立项。
evidence: SPEC-M1-STAGE05-LOCAL-LIQUID-FUEL-REMOVAL-AMENDMENT-001
related_tech_ids: AGR-OIL-001, NRG-FUL-001, ENE-GEN-001, ENE-HYD-001
blocks_prose: true
provisional_post_review_action: DELETE_FROM_CURRENT_TREE, REMOVE_UNLOCKS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第七十项事实审查
resolution_status: removal_candidate_waiting_post_tree_application
```

### FOD-CTL-001

```text
tech_id: FOD-CTL-001
current_name: 温室、水培与苗圃受控栽培
fact_gate: return_then_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, DEMOTE_CANDIDATE
issue_statement: 苗圃、温室和水培的知识、设施与运行约束均独立，R6仅以“受控栽培”上位概念强行合并；人口配给前置无直接因果，且把设施误作记录并要求科研建三座。原节点拆为C/A/B三个层级不同的科技。
evidence: SPEC-M1-STAGE05-CONTROLLED-CULTIVATION-SPLIT-AMENDMENT-001
related_tech_ids: FOD-SED-001, FOD-FLD-001, WTR-TST-001, CHM-FRT-001-B
blocks_prose: true_for_original_false_after_split_review
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十一项事实审查
resolution_status: split_candidates_pass_waiting_post_tree_rewire
```

### FOD-CTL-001-B

```text
tech_id: FOD-CTL-001-B
current_name: 小型水培
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR
issue_statement: 饮水检验分级只能提供污染与基础水质判断，不能证明水源适合水培。当前暂保留为基础前置，整树复审时应改接通用水质用途判定，或明确另有水培根区水质标准承担专用判断。
evidence: SPEC-M1-STAGE05-CONTROLLED-CULTIVATION-SPLIT-AMENDMENT-001
related_tech_ids: WTR-TST-001, CHM-FRT-001-B, FOD-CTL-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_OR_CLARIFY_PREREQUISITE, DEMOTE_TO_LATER_OPTIONAL_BRANCH
raised_at: M0正式全树续跑第七十一项拆分子节点事实审查
resolution_status: waiting_post_tree_review
```

### FOD-FLD-001

```text
tech_id: FOD-FLD-001
current_name: 露地耕作与农田调度
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6只开放两项高度重复的计划记录并要求各生成三份，没有表达露地耕作能力。当前候选将农田调度下沉，改为开放露地耕作行动、正式农田状态和季节作业计划。
evidence: SPEC-M1-STAGE05-OPEN-FIELD-FARMING-FACT-AMENDMENT-001
related_tech_ids: FOD-SED-001, FOD-SOI-001, AGR-CER-001, AGR-OIL-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, DEMOTE_INTERNAL_FUNCTION
raised_at: M0正式全树续跑第七十二项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-ANE-001

```text
tech_id: HLT-ANE-001
current_name: 麻醉前评估、给药、监护与复苏
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, RANK_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: R6仅由伤病分诊便在rank3开放麻醉，早于药品质量与感染控制；rank9手术节点又重复研发麻醉监护。当前候选后移至药品和感染控制之后，保留基础临床麻醉闭环，并让手术节点承接。
evidence: SPEC-M1-STAGE05-CLINICAL-ANESTHESIA-FACT-AMENDMENT-001
related_tech_ids: MED-PHM-001, MED-IPC-001, MED-DIA-001, MED-SUR-001
blocks_prose: false
provisional_post_review_action: DEMOTE_RANK, REWIRE_PREREQUISITE, REWRITE_UNLOCK, MERGE_DUPLICATE_SCOPE, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十三项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-IMG-001

```text
tech_id: HLT-IMG-001
current_name: 影像设备质量保证、辐射安全与阅片
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, RANK_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: R6仅由伤病分诊便在rank3开放医学影像，并把影像室与设备质控误作产品；rank8诊断节点又重复包含影像修复及诊断范围。当前候选后移到MED-DIA-001之后，并收窄上游节点范围。
evidence: SPEC-M1-STAGE05-MEDICAL-IMAGING-FACT-AMENDMENT-001
related_tech_ids: MED-DIA-001, ELC-INS-001, MED-IPC-001, MED-SUR-001
blocks_prose: false
provisional_post_review_action: DEMOTE_RANK, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_DUPLICATE_SCOPE, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十四项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-RES-001

```text
tech_id: MCH-RES-001
current_name: 恢复精密制造
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: 科研只解锁精密工坊恢复工程，不能用requiredCount让科研自动完成工程。旧工坊、档案、量具、人员和稳定供电均为实体条件。唯一accepted_verbatim名称、效果与两段正文保持不变。
evidence: RESEARCH_ENGINEERING_EDICT_TEXT_RULES_001 accepted_verbatim section；SPEC-M0-PROGRESSION-001
related_tech_ids: MCH-HND-001, NRG-GRD-001
blocks_prose: false
provisional_post_review_action: REMOVE_REQUIRED_COUNT, PRESERVE_ACCEPTED_VERBATIM
raised_at: M0正式全树续跑第七十五项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-BIO-001

```text
tech_id: NRG-BIO-001
current_name: 生物质燃料、沼气与余料能源化
fact_gate: return_then_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 固体生物质燃料整备与厌氧消化制气的原理、设施和产物相互独立；生产余料能源化只是用途分流规则，不是产品。原节点拆为固体生物燃料与沼气制取两项科技。
evidence: SPEC-M1-STAGE05-BIOMASS-ENERGY-SPLIT-AMENDMENT-001
related_tech_ids: FOD-SOI-001, ENE-GAS-001, NRG-AUD-001
blocks_prose: true_for_original_false_after_split_review
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十六项事实审查
resolution_status: split_candidates_pass_waiting_post_tree_rewire
```

### NRG-HTR-001

```text
tech_id: NRG-HTR-001
current_name: 锅炉、窑炉与工业热力连续供给
fact_gate: return_then_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, DUPLICATE_MILESTONE
issue_statement: 压力锅炉、工业窑炉和集中热网具有不同设备原理与安全边界；集中热网又与ENE-STM-001重复。原节点拆为锅炉运行与窑炉运行，热网内容回归ENE-STM-001。
evidence: SPEC-M1-STAGE05-INDUSTRIAL-HEAT-SPLIT-AMENDMENT-001
related_tech_ids: RPR-INS-001, RPR-DIA-001, IME-VLV-001, ENE-STM-001
blocks_prose: true_for_original_false_after_split_review
provisional_post_review_action: SPLIT, DEMOTE_RANK, REWIRE_PREREQUISITE, REMOVE_DUPLICATE_SCOPE, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十七项事实审查
resolution_status: split_candidates_pass_waiting_post_tree_rewire
```

### NRG-STO-001

```text
tech_id: NRG-STO-001
current_name: 节点蓄电储能
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把检验行动、电池组和组配能力混作记录或产品，并用固定数量让科研生成电池组。当前候选恢复行动、记录、标准、产品和接入工程，能力限定为遗产电池组配。
evidence: SPEC-M1-STAGE05-BATTERY-GROUPING-FACT-AMENDMENT-001
related_tech_ids: NRG-GRD-001, ENE-BES-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十八项事实审查
resolution_status: waiting_post_tree_review
```

### POP-REF-A03

```text
tech_id: POP-REF-A03
current_name: 正式居留与社区统合
fact_gate: return_demote_delete
issue_tags: NOT_A_TECH, POLICY_AS_TECH, LOW_GAME_VALUE, DEMOTE_CANDIDATE, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 正式居留资格、服务接入和申诉程序属于法律、政策与行政执行，不是独立科研能力。当前节点删除，内容下沉治理系统，不建立替代科技。
evidence: SPEC-M1-STAGE05-FORMAL-RESIDENCY-DEMOTION-AMENDMENT-001
related_tech_ids: POP-STA-001, POP-REF-A02
blocks_prose: true
provisional_post_review_action: DELETE_FROM_TECH_TREE, DEMOTE_TO_GOVERNANCE, REMOVE_UNLOCKS, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第七十九项事实审查
resolution_status: removal_candidate_waiting_post_tree_application
```

### RAW-BEN-001

```text
tech_id: RAW-BEN-001
current_name: 破碎、洗选、磁选与矿石品位控制
fact_gate: return_replace_narrow
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, DUPLICATE_MILESTONE
issue_statement: R6把通用破碎分级、矿种相关洗选磁选和品位控制强行合并，并以泛化合格矿石作为产品。当前候选收窄为矿石破碎分级，具体选别与品位控制归入各矿种路线。
evidence: SPEC-M1-STAGE05-ORE-CRUSHING-REPLACEMENT-AMENDMENT-001
related_tech_ids: RAW-QUA-001, RAW-MIN-001, RSC-CU-001
blocks_prose: true_until_replacement_text_passes
provisional_post_review_action: REPLACE_NARROW, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第八十项事实审查
resolution_status: replacement_text_pass_waiting_post_tree_application
```

### RAW-SAF-001

```text
tech_id: RAW-SAF-001
current_name: 矿山通风、排水与有害环境控制
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把整套矿山安全系统误作记录并要求科研生成四套实例。当前候选保留连续环境监控闭环，改为设施、标准、撤离行动、复检行动和运行状态。
evidence: SPEC-M1-STAGE06-MINE-ENVIRONMENT-MONITORING-FACT-AMENDMENT-001
related_tech_ids: RAW-MIN-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第八十一项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-AL-001

```text
tech_id: RSC-AL-001
current_name: 铝质矿物识别、分级与加工适配
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6无关依赖废墟材料辨识，并让科研自动生成资源区和铝质矿石批次。当前候选改为承接岩芯钻探与基础实验室，只开放矿物评价、分级和适配记录。
evidence: SPEC-M1-STAGE06-ALUMINUM-MINERAL-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RSC-DRL-001, SCI-LAB-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十二项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-FE-001

```text
tech_id: RSC-FE-001
current_name: 铁矿物识别、分级与冶炼适配
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6以再生金属炉料分选作为自然铁矿评价前置，并让科研自动生成采区和矿石批次。当前候选改接岩芯钻探与基础实验室，只开放矿样评价、分级和加工适配记录。
evidence: SPEC-M1-STAGE06-IRON-MINERAL-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RSC-DRL-001, SCI-LAB-001, RAW-BEN-001, RSC-COL-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十三项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-PB-001

```text
tech_id: RSC-PB-001
current_name: 铅锌矿物识别、伴生风险与分级方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6以再生炉料和可采储量作为铅锌矿物识别前置，并把风险区误作产品。当前候选改接岩芯钻探与实验室，开放矿样评价、风险状态和加工适配记录。
evidence: SPEC-M1-STAGE06-LEAD-ZINC-MINERAL-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RSC-DRL-001, SCI-LAB-001, RSC-RSV-001, RSC-FOR-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十四项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-SIL-001

```text
tech_id: RSC-SIL-001
current_name: 石英砂纯度、粒度与玻璃原料分级
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6无关依赖废墟材料辨识和铜矿选矿，并让科研自动生成砂源区和砂批次。当前候选改接砂石骨料生产与实验室，只开放玻璃砂评价、记录和候选状态。
evidence: SPEC-M1-STAGE06-GLASS-SAND-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RAW-QUA-001, SCI-LAB-001, RSC-RCL-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十五项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-EXT-001

```text
tech_id: SCI-EXT-001
current_name: 外来知识翻译、适配与本地复验
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6把本地适配结果误作产品并要求科研自动生成实例。当前候选保留外来技术本地化能力，改为适配项目、本地复验记录和适配状态。
evidence: SPEC-M1-STAGE06-EXTERNAL-TECH-ADAPTATION-FACT-AMENDMENT-001
related_tech_ids: SCI-ARC-001, SCI-LAB-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十六项事实审查
resolution_status: waiting_post_tree_review
```

### SCI-PRJ-001

```text
tech_id: SCI-PRJ-001
current_name: 科研项目分解、前置核查与资源排程
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH
issue_statement: R6只解锁三份管理记录，未表达多项目并行的实际能力。当前候选收窄为受真实资源约束的多项目科研排程，并恢复资源占用与项目阻塞状态。
evidence: SPEC-M1-STAGE06-MULTI-PROJECT-RESEARCH-FACT-AMENDMENT-001
related_tech_ids: SCI-LAB-001
blocks_prose: false
provisional_post_review_action: REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十七项事实审查
resolution_status: waiting_post_tree_review
```

### SET-BLK-001

```text
tech_id: SET-BLK-001
current_name: 步行街区、消防间隔与公共通道规划
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6依赖已拆分的住区公用设施合并节点，并把正式街区误作三份记录。当前候选只直连固废收集，改为开放布局标准、规划图、整备工程和工程完成后的状态。
evidence: SPEC-M1-STAGE06-BLOCK-LAYOUT-FACT-AMENDMENT-001
related_tech_ids: SET-HOU-001, SET-SVC-001-A, SET-SVC-001-B, SET-SVC-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第八十八项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-CRT-001

```text
tech_id: SOC-CRT-001
current_name: 岗位资格、复训、暂停与恢复制度
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6以科研人员训练作为全岗位资格前置，并使用含糊资格对象和自动建成考核中心。当前候选改接学徒岗位训练，建立资格全生命周期并让资格状态真实约束可上岗人力。
evidence: SPEC-M1-STAGE06-JOB-QUALIFICATION-FACT-AMENDMENT-001
related_tech_ids: SOC-APR-001, SCI-TRN-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第八十九项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-LIT-001

```text
tech_id: SOC-LIT-001
current_name: 基础识字、算术、公共规则与健康课程设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, RANK_ERROR, UNLOCK_MISMATCH
issue_statement: R6让基础课程依赖科研人员训练，而科研训练事实修正后又依赖基础课程，形成循环；学校班级也被误作产品。当前候选取消直接前置，并建立课程、教学、评估和学习状态。
evidence: SPEC-M1-STAGE06-BASIC-CURRICULUM-FACT-AMENDMENT-001
related_tech_ids: SCI-TRN-001, SOC-APR-001, SOC-CRT-001
blocks_prose: false
provisional_post_review_action: REMOVE_PREREQUISITE, REWIRE_DEPENDENTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RANK_AND_COST
raised_at: M0正式全树续跑第九十项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-SHO-001

```text
tech_id: SOC-SHO-001
current_name: 工作鞋靴楦型、防滑与耐磨设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6无关依赖科研人员训练，并只开放泛化鞋靴和一次检验。当前候选改为承接学徒训练，收窄工作鞋靴产品并补齐图样、标准和检验行动。
evidence: SPEC-M1-STAGE06-WORK-FOOTWEAR-FACT-AMENDMENT-001
related_tech_ids: SOC-APR-001, SCI-TRN-001, CHM-POL-001
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第九十一项事实审查
resolution_status: waiting_post_tree_review
```

### URB-ELC-001

```text
tech_id: URB-ELC-001
current_name: 建筑低压配电、接地与用电保护设计
fact_gate: return_merge
issue_tags: DUPLICATE_MILESTONE, MERGE_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 本项与CIV-LGT-001住宅用电设计处于同一工程尺度，接地和验收只是完整住宅用电设计的必要组成，没有独立玩家里程碑。当前候选并入住宅用电设计并删除展示节点。
evidence: SPEC-M1-STAGE06-BUILDING-ELECTRIC-MERGE-AMENDMENT-001
related_tech_ids: CIV-LGT-001, NRG-GRD-001, ELC-SAF-001, URB-DRN-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWRITE_TARGET_UNLOCK, REMOVE_PREREQUISITE, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第九十二项事实审查
resolution_status: merge_candidate_waiting_post_tree_application
```

### VEH-CAR-001

```text
tech_id: VEH-CAR-001
current_name: 标准人力推车与可换轮轴
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6只开放“人力推车首投型号”占位产品并要求科研自动生产一辆。当前候选建立TC-A1型标准货运推车及生产图纸、轮轴接口和定型试验。
evidence: SPEC-M1-STAGE06-HANDCART-MODEL-FACT-AMENDMENT-001
related_tech_ids: MCH-HND-001
blocks_prose: false
provisional_post_review_action: RENAME_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第九十三项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-LEK-001-B

```text
tech_id: WTR-LEK-001-B
current_name: 压降分析与漏损定位
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把科研直接生成的疑似漏点位置与实体抢修工程并列为解锁，并附固定数量。当前候选改为漏损范围判定，只开放分析行动、记录和疑似范围状态；破口确认与维修交给后续现场能力。
evidence: SPEC-M1-STAGE06-LEAK-RANGE-FACT-AMENDMENT-001
related_tech_ids: WTR-LEK-001-A, WTR-MNT-001
blocks_prose: false
provisional_post_review_action: RENAME, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, KEEP_SUCCESSOR_BOUNDARY
raised_at: M0正式全树续跑第九十四项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-SEW-001

```text
tech_id: WTR-SEW-001
current_name: 污水收集与卫生处理
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把污水收集网和污水处理厂合并为总结节点，还倒置依赖住区排污接入并使用饮水检验替代污水检验。当前候选拆成污水收集设计与污水初级处理，分别承接管网和处理厂能力。
evidence: SPEC-M1-STAGE06-SEWAGE-SYSTEM-SPLIT-AMENDMENT-001
related_tech_ids: WTR-SEW-001-A, WTR-SEW-001-B, SET-SVC-001-B, SCI-LAB-001, WTR-REU-001, WTR-BAS-001
blocks_prose: true_until_split_application
provisional_post_review_action: SPLIT, RETIRE_ALIAS, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第九十五项事实审查
resolution_status: split_candidates_text_pass_waiting_post_tree_application
```

### WTR-WEL-001-B

```text
tech_id: WTR-WEL-001-B
current_name: 井壁护壁与井管安装
fact_gate: pass_with_tree_review
issue_tags: UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把一项连续工艺拆成两个工程并让科研直接生成已护壁井孔。当前候选统一为井孔护壁下管工艺与工程；稳定井孔和井管安装记录只由工程产生。
evidence: SPEC-M1-STAGE06-WELL-CASING-FACT-AMENDMENT-001
related_tech_ids: WTR-WEL-001-A, WTR-WEL-001-C
blocks_prose: false
provisional_post_review_action: RENAME, MERGE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第九十六项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-ACD-001-A

```text
tech_id: CHM-ACD-001-A
current_name: 基础酸制备
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: “基础酸”没有统一原料、工艺或产品身份，R6又机械依赖全部分离与热源并让科研生成产品。当前候选复用ID改为硫酸制备，只开放专用工段、试制、标准与记录；工业硫酸批次由实际行动产生。
evidence: SPEC-M1-STAGE06-SULFURIC-ACID-REPLACEMENT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, CHM-ACD-001-B, CHM-ACD-001-C, CHM-ACD-001-D, MAT-ACD-001, CHM-ENE-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_ALL_DEPENDENTS
raised_at: M0正式全树续跑第九十七项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-ACD-001-B

```text
tech_id: CHM-ACD-001-B
current_name: 基础碱制备
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: “基础碱”没有统一工艺和产品身份，R6又机械依赖分离与热力汇总并忽略真实联产物。当前候选复用ID改为氯碱电解，烧碱、氯气和氢气由同一实际行动联产并分别进入资源与安全结算。
evidence: SPEC-M1-STAGE06-CHLORALKALI-REPLACEMENT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, CHM-CLN-001-A, CHM-CLN-001-B, CHM-CLN-001-C, CHM-ENE-001, CHM-POL-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, ADD_COPRODUCTS, REMOVE_REQUIRED_COUNT, AUDIT_ALL_DEPENDENTS
raised_at: M0正式全树续跑第九十八项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-ACD-001-C

```text
tech_id: CHM-ACD-001-C
current_name: 基础盐制备
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: “基础盐”没有单一产品或工艺身份，R6又机械依赖分离和热力汇总。当前候选复用ID改为工业盐精制，以盐矿物、过滤和结晶形成明确的工业氯化钠产品及两项废物流。
evidence: SPEC-M1-STAGE06-INDUSTRIAL-SALT-REPLACEMENT-AMENDMENT-001
related_tech_ids: RAW-IND-001-C, CHM-SEP-001-B, CHM-SEP-001-C, CHM-ACD-001-B, CNS-GLS-BASE-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, ADD_WASTE_OUTPUTS, REMOVE_REQUIRED_COUNT, AUDIT_ALL_DEPENDENTS
raised_at: M0正式全树续跑第九十九项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-ACD-001-D

```text
tech_id: CHM-ACD-001-D
current_name: 通用工业试剂制备
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: “通用工业试剂”既没有单一工艺身份又与MAT-REA-001重复。当前候选改为标准溶液配制，只把已有明确化学品配成可核验工作溶液；后期节点专门承担试剂级纯化包装和批次放行。
evidence: SPEC-M1-STAGE06-STANDARD-SOLUTION-REPLACEMENT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, QLT-UNI-001, MAT-REA-001, QLT-MET-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS, REDEFINE_LATER_NODE
raised_at: M0正式全树续跑第一百项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-LUB-001-A

```text
tech_id: CHM-LUB-001-A
current_name: 燃料净化
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, MERGE_CANDIDATE, OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 本项与已通过的液体燃料整备完全重复，输出又错误混合燃料、润滑油和冷却液。当前候选合并删除，不向液体燃料整备追加解锁，润滑油和冷却液另行审查。
evidence: SPEC-M1-STAGE07-FUEL-PURIFICATION-MERGE-AMENDMENT-001
related_tech_ids: NRG-FUL-001, CHM-LUB-001-B, CHM-LUB-001-C, VEH-ENG-001, RPR-PMV-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_PREREQUISITES, REMOVE_OUTPUTS, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零一项事实审查
resolution_status: merge_delete_confirmed_waiting_post_tree_application
```

### CHM-LUB-001-B

```text
tech_id: CHM-LUB-001-B
current_name: 润滑油调制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把液体燃料整备作为润滑油知识前置，只解锁泛化产品并忽略等级、适配和批次检验。当前候选改为机械润滑油调制，以ISO VG黏度等级和适用设备标识形成通用机械润滑油批次。
evidence: SPEC-M1-STAGE07-MECHANICAL-LUBRICANT-FACT-AMENDMENT-001
related_tech_ids: CHM-SEP-001-B, NRG-FUL-001, RPR-PMV-001, VEH-ENG-001, CHM-LUB-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零二项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-LUB-001-C

```text
tech_id: CHM-LUB-001-C
current_name: 机械冷却液配制
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6用“机械冷却液”同时覆盖闭式动力冷却液与机床切削液，错误依赖燃料和分离汇总，实体条件也复制基础油。当前候选收窄为闭式动力冷却液，以EC系列、冻结点和材料适配形成明确批次。
evidence: SPEC-M1-STAGE07-CLOSED-LOOP-COOLANT-FACT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, VEH-ENG-001, RPR-PMV-001, MCH-CUT-001
blocks_prose: false
provisional_post_review_action: RENAME_NARROW, REWIRE_PREREQUISITE, RETYPE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零三项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-CHP-001

```text
tech_id: ENE-CHP-001
current_name: 锅炉、汽轮机与动力设备热电联产与余热利用方法
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6用一项科技覆盖锅炉汽轮机、内燃机和全部工业余热，并错误依赖蓄电储能。当前候选收窄为内燃发电机组热电联供，只回收排气与冷却余热并让供热随机组状态联动。
evidence: SPEC-M1-STAGE07-ENGINE-COGENERATION-FACT-AMENDMENT-001
related_tech_ids: ENE-GEN-001, ENE-GEN-002, ENE-STM-001, NRG-STO-001, ENE-WND-001
blocks_prose: false
provisional_post_review_action: RENAME_NARROW, REWIRE_PREREQUISITE, RETYPE, REWRITE_UNLOCK, REMOVE_GENERIC_OUTPUT, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零四项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-EMG-001

```text
tech_id: ENE-EMG-001
current_name: 移动应急电源、快速接入与关键负载恢复方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6名称把产品、工程和行动串成方法，并重复直连发电机修复、错误连接站级储能。当前候选保留完整移动应急供电里程碑，以YD-A1机组、快速接口、接入标准和供电行动形成闭环。
evidence: SPEC-M1-STAGE07-MOBILE-EMERGENCY-POWER-FACT-AMENDMENT-001
related_tech_ids: ENE-GEN-001, NRG-GEN-001, ENE-BES-001, ENE-GEN-002
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVIEW_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零五项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-GEN-002

```text
tech_id: ENE-GEN-002
current_name: 标准中型内燃发电机组并联、冷却与连续运行方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, TYPE_MISMATCH, SCALE_ERROR
issue_statement: R6把QF-B1产品定型与多机同步并联合成一个节点，并错误依赖储能与固定沼气路线。当前候选拆为中型机组定型和机组并联运行，分别承担产品与电站里程碑。
evidence: SPEC-M1-STAGE07-MEDIUM-GENERATOR-SPLIT-AMENDMENT-001
related_tech_ids: ENE-GEN-001, ENE-GEN-002-A, ENE-GEN-002-B, NRG-GRD-001, ENE-TRF-001, ENE-CHP-001
blocks_prose: true_until_split_application
provisional_post_review_action: SPLIT, RETIRE_ALIAS, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REASSESS_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零六项事实审查
resolution_status: split_candidates_text_pass_waiting_post_tree_application
```

### ENE-HYD-001

```text
tech_id: ENE-HYD-001
current_name: 小型水轮机、调速与发电机组设计方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把SL-A1机组产品定型与地点化水力站工程合并，并错误依赖液体燃料。当前候选拆为水轮机组定型和水力站设计，分别承担产品与设施里程碑。
evidence: SPEC-M1-STAGE07-SMALL-HYDRO-SPLIT-AMENDMENT-001
related_tech_ids: ENE-HYD-001-A, ENE-HYD-001-B, NRG-REN-001-A, MCH-BAS-001, NRG-GRD-001, ENE-MVD-001
blocks_prose: true_until_split_application
provisional_post_review_action: SPLIT, RETIRE_ALIAS, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REASSESS_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百零七项事实审查
resolution_status: split_candidates_text_pass_waiting_post_tree_application
```

### FOD-HAR-001

```text
tech_id: FOD-HAR-001
current_name: 收获、脱粒、干燥与初级加工
fact_gate: return_replace
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, TYPE_MISMATCH, SCALE_ERROR
issue_statement: R6把谷物、蔬果和蛋白食品三类完全不同的采后处理混为一项，并以错误记录和生产线输出固定实例。当前候选收窄为谷物脱粒干燥，只让实际收获谷物取得可入库状态。
evidence: SPEC-M1-STAGE07-GRAIN-DRYING-REPLACEMENT-AMENDMENT-001
related_tech_ids: AGR-CER-001, AGR-MIL-001, AGR-TUB-001, AGR-VEG-001, FOD-PRS-001, AGR-FED-001, AGR-MEC-001, AGR-SLA-001
blocks_prose: false
provisional_post_review_action: REPLACE_NARROW, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百零八项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-PRO-001

```text
tech_id: FOD-PRO-001
current_name: 肥料配制、病虫监测与安全施用
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把肥料生产、病虫监测、植保处置和残留控制混为一项，并自动发放肥料与农业投入品。当前候选删除肥料身份，收窄为监测阈值驱动的田间病虫防治方法。
evidence: SPEC-M1-STAGE07-FIELD-PEST-CONTROL-REPLACEMENT-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-SOI-001, CHM-FRT-001-A, CHM-FRT-001-B, CHM-FRT-001-C, AGR-FOR-001, AGR-LEG-001, AGR-MIL-001, FOD-NET-001, AGR-AQU-001, AGR-VET-001
blocks_prose: false
provisional_post_review_action: REPLACE_NARROW, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百零九项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-EMC-001

```text
tech_id: ICD-EMC-001
current_name: 电磁兼容、接地、屏蔽与干扰排查
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DEPENDENCY_DIRECTION_ERROR, SCALE_ERROR
issue_statement: R6名称串联多个动作，只依赖通信并让基础电压电流仪表倒置依赖本项。当前候选保留完整电磁兼容治理闭环，承接信号和低压供电两侧并纠正仪表依赖方向。
evidence: SPEC-M1-STAGE07-EMC-CONTROL-FACT-AMENDMENT-001
related_tech_ids: ELC-WIR-001, NRG-GRD-001, ICD-VLT-001, MIL-EXT-041, MIL-EXT-042
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REVERSE_OR_REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百一十项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-LNE-001

```text
tech_id: ICD-LNE-001
current_name: 区域信号线路、中继、避雷与故障定位
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, MODEL_ID_CONFLICT
issue_statement: R6用长名串联区域网络组成，把骨干线路误作产品并缺少中继站、分段和避雷对象。当前候选保留区域有线通信完整里程碑，并发现ZJ-A1与其他系统型号冲突。
evidence: SPEC-M1-STAGE07-REGIONAL-WIRED-COMMUNICATIONS-FACT-AMENDMENT-001
related_tech_ids: ELC-WIR-001, ICD-EMC-001, ICD-STO-001, ICD-RPT-001, MIL-EXT-041, MIL-EXT-042
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, RESOLVE_MODEL_CONFLICT
raised_at: M0正式全树续跑第一百一十一项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-HND-001

```text
tech_id: LOG-HND-001
current_name: 装卸站、周转容器与货物固定
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, DUPLICATE_OUTPUT, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6重复列出周转容器，把货物固定误作产品并让科研自动生成装卸站。当前候选保留标准化装卸完整里程碑，以ZX-A1周转箱、装卸站工程、载荷固定标准和交接行动形成闭环。
evidence: SPEC-M1-STAGE07-STANDARDIZED-HANDLING-FACT-AMENDMENT-001
related_tech_ids: LOG-WHS-001, VEH-CAR-001, Y2-PROD-CIV-006, IND-EXP-003, LOG-DSP-001, MIL-EXT-046, TLG-MHE-001, TLG-TRL-001
blocks_prose: false
provisional_post_review_action: RENAME, DEDUP_OUTPUT, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百一十二项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-BAS-001

```text
tech_id: MCH-BAS-001
current_name: 机械几何基准与精度传递
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6名称过长并把三类实体基准误作记录且各生成三件。当前候选保留机械几何基准方法，以JP-A1平板、JC-A1直尺、JG-A1工装和互检标准形成可传递精度链。
evidence: SPEC-M1-STAGE07-GEOMETRIC-DATUM-FACT-AMENDMENT-001
related_tech_ids: MCH-RES-001, QLT-MET-001, MCH-LAT-001, MCH-GAG-001, ENE-HYD-001-A, ELC-INS-001, MCH-PMP-001-A, ELC-MOT-001-A
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODELS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT
raised_at: M0正式全树续跑第一百一十三项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-DSP-001

```text
tech_id: NRG-DSP-001
current_name: 燃料调度与应急储备
fact_gate: pass_with_tree_review
issue_tags: TECH_IDENTITY_MISMATCH, NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, POLICY_BOUNDARY_ERROR
issue_statement: R6名称声称燃料调度储备，正文却是电源储能负载调度，并强制依赖所有能源路线且只生成台账。当前候选收窄为电力负载调度，严格执行外部登记的优先序而不制定政策。
evidence: SPEC-M1-STAGE07-LOAD-DISPATCH-REPLACEMENT-AMENDMENT-001
related_tech_ids: NRG-GRD-001, NRG-REN-001-A, NRG-REN-001-B, NRG-REN-001-C, NRG-STO-001, ELC-MET-001, NRG-NET-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REDISTRIBUTE_RESEARCH_POINTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十四项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-IND-001-A

```text
tech_id: RAW-IND-001-A
current_name: 石灰石分类利用
fact_gate: pass_with_tree_review
issue_tags: TECH_IDENTITY_MISMATCH, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR
issue_statement: R6以同名抽象产品表示石灰石评价，重复连接地质链并把破碎误作知识前置，同时向多项无关材料科技扩散依赖。当前候选改为石灰石用途分级，只形成评价、记录和用途等级状态。
evidence: SPEC-M1-STAGE07-LIMESTONE-USE-GRADE-FACT-AMENDMENT-001
related_tech_ids: RAW-GEO-001-C, SCI-LAB-001, CNS-MAT-001, RAW-GLS-001, MET-FUR-001-A, MET-FUR-001-B, MET-FUR-001-C, RAW-NET-001, Y2-PROD-BLD-005, RAW-QUA-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十五项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-IND-001-B

```text
tech_id: RAW-IND-001-B
current_name: 黏土分类利用
fact_gate: pass_with_tree_review
issue_tags: TECH_IDENTITY_MISMATCH, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR
issue_statement: R6以同名抽象产品表示黏土评价，重复连接地质链并把破碎误作知识前置，同时向炉体、浇注、玻璃和资源网络扩散无关依赖。当前候选改为黏土用途分级，只形成成形试烧记录和用途等级状态。
evidence: SPEC-M1-STAGE07-CLAY-USE-GRADE-FACT-AMENDMENT-001
related_tech_ids: RAW-GEO-001-C, SCI-LAB-001, CNS-MAT-001, MET-FUR-001-A, MET-FUR-001-B, MET-FUR-001-C, RAW-GLS-001, RAW-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十六项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-IND-001-C

```text
tech_id: RAW-IND-001-C
current_name: 盐矿物分类利用
fact_gate: pass_with_tree_review
issue_tags: TECH_IDENTITY_MISMATCH, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR
issue_statement: R6以同名抽象产品表示盐源评价，重复连接地质链并把破碎误作知识前置，还向多个仅因“盐”字关联的材料节点扩散依赖。当前候选改为盐矿物评价，区分氯化钠盐源、其他盐类和污染状态。
evidence: SPEC-M1-STAGE07-SALT-MINERAL-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RAW-GEO-001-C, SCI-LAB-001, CHM-ACD-001-C, CNS-MAT-001, MET-FUR-001-A, MET-FUR-001-B, MET-FUR-001-C, RAW-GLS-001, RAW-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十七项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-COL-001

```text
tech_id: RSC-COL-001
current_name: 固体矿物燃料勘查、分级与安全开采
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR
issue_statement: R6把资源勘查、燃料评价、矿场建设、安全开采和自燃监测揉成一项，并依赖无关的铁矿物评价。当前候选收窄为固体燃料评价，只形成样品评价、记录及用途和风险状态。
evidence: SPEC-M1-STAGE07-SOLID-FUEL-EVALUATION-FACT-AMENDMENT-001
related_tech_ids: RAW-GEO-001-A, SCI-LAB-001, RSC-FE-001, RSC-CLS-001, ENE-SLD-001, RAW-MIN-001, RAW-SAF-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十八项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-FOR-001

```text
tech_id: RSC-FOR-001
current_name: 林分调查、采伐限额与持续更新方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, POLICY_BOUNDARY_ERROR, DEPENDENCY_ERROR
issue_statement: R6名称过长，前置是无关矿业科技，并把林场容量和法律许可误作科技自动解锁。当前候选保留森林经营闭环，形成林分档案、年度采伐方案、可持续采伐量和更新验收状态。
evidence: SPEC-M1-STAGE07-FOREST-MANAGEMENT-PLANNING-FACT-AMENDMENT-001
related_tech_ids: QLT-UNI-001, RAW-GEO-001-A, RSC-PB-001, RSC-CLS-001, RSC-SAW-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百一十九项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-SAW-001

```text
tech_id: RSC-SAW-001
current_name: 原木制材、干燥、分级与防腐方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把普通锯材生产与只适用于特定暴露环境的木材防腐绑成一项，并依赖无关矿物评价。当前候选拆为锯材生产和木材防腐，分别形成MC-A型分级锯材与MC-F1型防腐锯材路线。
evidence: SPEC-M1-STAGE07-SAWN-TIMBER-PRESERVATION-SPLIT-AMENDMENT-001
related_tech_ids: RSC-FOR-001, MCH-HND-001, CHM-LAB-001, MET-SRT-001, RSC-AL-001, RSC-SAW-001-A, RSC-SAW-001-B
blocks_prose: false
provisional_post_review_action: SPLIT, RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十项事实审查
resolution_status: waiting_post_tree_review
```

### SET-PUB-001-A

```text
tech_id: SET-PUB-001-A
current_name: 聚居点诊疗设施配置
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR, ENDPOINT_MISMATCH
issue_statement: R6名称过长且把设施设计误写为泛组织，设施也未落到端点已明确的基层诊疗所。当前候选改为诊疗设施规划，分别开放规划图、标准、工程和完工设施类型。
evidence: SPEC-M1-STAGE08-PRIMARY-CLINIC-PLANNING-FACT-AMENDMENT-001
related_tech_ids: POP-STA-001, SET-BLK-001, SET-EXP-001, GOV-ADM-001, MED-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_TECH, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十一项事实审查
resolution_status: waiting_post_tree_review
```

### SET-PUB-001-B

```text
tech_id: SET-PUB-001-B
current_name: 聚居点照护设施配置
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, ENDPOINT_MISMATCH, DEPENDENCY_ERROR
issue_statement: R6以一个抽象照护设施同时承载母婴与长期照护，违背端点对两类设施的独立要求。当前候选拆为母婴设施规划和长期照护规划，分别形成工程和完工设施类型。
evidence: SPEC-M1-STAGE08-CARE-FACILITY-PLANNING-SPLIT-AMENDMENT-001
related_tech_ids: POP-MCH-001, POP-HEA-001, SET-BLK-001, SET-EXP-001, GOV-ADM-001, HLT-LTC-001
blocks_prose: false
provisional_post_review_action: SPLIT, RENAME, RETYPE_TECH, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十二项事实审查
resolution_status: waiting_post_tree_review
```

### SET-PUB-001-C

```text
tech_id: SET-PUB-001-C
current_name: 聚居点教育设施配置
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, ENDPOINT_MISMATCH, DEPENDENCY_ERROR
issue_statement: R6名称过长且把学校设施设计误作泛组织，没有把端点中的基础学校落成明确对象。当前候选分别开放基础学校规划图、标准、工程和完工设施类型。
evidence: SPEC-M1-STAGE08-SCHOOL-FACILITY-PLANNING-FACT-AMENDMENT-001
related_tech_ids: POP-STA-001, SET-BLK-001, SET-EXP-001, GOV-ADM-001, SOC-LIT-001, SOC-TEC-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_TECH, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十三项事实审查
resolution_status: waiting_post_tree_review
```

### SET-PUB-001-D

```text
tech_id: SET-PUB-001-D
current_name: 聚居点公共登记设施配置
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR, GOVERNANCE_BOUNDARY_ERROR
issue_statement: R6名称过长且把登记设施规划与登记制度、行政能力混在一起。当前候选只形成公共登记处规划图、标准、工程和完工设施类型，不把建筑设计作为治理知识前置。
evidence: SPEC-M1-STAGE08-REGISTRY-FACILITY-PLANNING-FACT-AMENDMENT-001
related_tech_ids: POP-STA-001, SET-BLK-001, SET-EXP-001, GOV-ADM-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_TECH, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十四项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-BRG-001

```text
tech_id: TLG-BRG-001
current_name: 桥梁承载检测、限载与结构健康监测
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, POLICY_BOUNDARY_ERROR, MONITORING_SCOPE_ERROR
issue_statement: R6把早期旧桥通行判断、行政限载、加固工程与连续结构监测揉成一项，并依赖人力推车。当前候选收窄为旧桥通行评定，只形成现状档案和技术承载状态。
evidence: SPEC-M1-STAGE08-BRIDGE-PASSAGE-ASSESSMENT-FACT-AMENDMENT-001
related_tech_ids: LOG-RTE-001-B, VEH-CAR-001, TLG-HAZ-001, LOG-BRG-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十五项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-REF-001

```text
tech_id: TLG-REF-001
current_name: 冷藏车辆、温度记录与故障处置
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, PRODUCT_SCOPE_ERROR
issue_statement: R6在只有人力推车的阶段暗示主动制冷车辆，并把道路设计设为知识前置。当前候选收窄为依靠保温容器、已有冷源和测温记录的保温冷藏运输。
evidence: SPEC-M1-STAGE08-INSULATED-COLD-TRANSPORT-FACT-AMENDMENT-001
related_tech_ids: VEH-CAR-001, TLG-GRD-001, TLG-SEC-001, HLT-VAC-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百二十六项事实审查
resolution_status: waiting_post_tree_review
```

### URB-DRN-001

```text
tech_id: URB-DRN-001
current_name: 街区雨水、边沟、涵洞与低点排涝设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR
issue_statement: R6名称过长，依赖住房与电气并把沟涵构件误作科研产品。当前候选保留完整街区雨水系统，改接街区布局规划并删除构件产品。
evidence: SPEC-M1-STAGE08-BLOCK-DRAINAGE-DESIGN-FACT-AMENDMENT-001
related_tech_ids: SET-BLK-001, SET-HOU-001, URB-ELC-001, URB-DEM-001, WTR-BAS-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百二十七项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-COA-001

```text
tech_id: WSE-COA-001
current_name: 原水混凝、絮凝与沉淀控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, STAGE_ERROR, DEPENDENCY_ERROR
issue_statement: R6把原水混凝接在污水处理后，并把设备和通用药方写成科研产物。当前候选后移到原水预处理之后，投加方案必须对应实际原水和混凝剂。
evidence: SPEC-M1-STAGE08-COAGULATION-SEDIMENTATION-FACT-AMENDMENT-001
related_tech_ids: WTR-RAW-001, CHM-LAB-001, WTR-SEW-001, WSE-SWG-001, WTR-POT-001
blocks_prose: false
provisional_post_review_action: RENAME, MOVE_STAGE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百二十八项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-REU-001

```text
tech_id: WTR-REU-001
current_name: 中水回用、污泥安全利用与风险隔离
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, POTABLE_WATER_BOUNDARY_ERROR, AGRICULTURAL_USE_BOUNDARY_ERROR
issue_statement: R6把液态中水与固态污泥合并，并把处理出水和污泥直接标成可回用系统及合格土壤投入品。当前候选拆为中水回用与污泥卫生处理，分别保留检验和隔离边界。
evidence: SPEC-M1-STAGE08-WATER-REUSE-SLUDGE-TREATMENT-SPLIT-AMENDMENT-001
related_tech_ids: WTR-SEW-001-B, WTR-TST-001, FOD-SOI-001, WTR-REU-001-A, WTR-REU-001-B
blocks_prose: false
provisional_post_review_action: SPLIT, RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百二十九项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-WEL-001-C

```text
tech_id: WTR-WEL-001-C
current_name: 滤水结构与洗井成井
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, SCALE_ERROR, DEPENDENCY_ERROR, POTABLE_WATER_BOUNDARY_ERROR
issue_statement: R6名称过长，产品无型号，并把浅井设成所有原水预处理的必经节点。当前候选保留成井闭环，新增专用滤水组件型号并把浅井改为可选水源。
evidence: SPEC-M1-STAGE08-SHALLOW-WELL-COMPLETION-FACT-AMENDMENT-001
related_tech_ids: WTR-WEL-001-B, WTR-RAW-001, WTR-TST-001, WTR-WEL-001-C
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百三十项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-FOR-001

```text
tech_id: AGR-FOR-001
current_name: 饲草种植、刈割、干草与青贮管理方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把田间饲草生产与收获后的干草青贮保藏绑成一项，并依赖谷物和植保节点。当前候选拆为饲草栽培与饲草保藏，鲜草、干草和青贮分别由实际行动形成。
evidence: SPEC-M1-STAGE08-FIELD-CROPS-PROCESSING-BATCH-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-PRO-001, AGR-CER-001, AGR-FOR-001-A, AGR-FOR-001-B, AGR-FED-001, AGR-ORC-001
blocks_prose: false
provisional_post_review_action: SPLIT, RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百三十一项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-LEG-001

```text
tech_id: AGR-LEG-001
current_name: 食用豆类接种、轮作与成熟收获方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6依赖植保科技并把生产线、种子和豆类批次作为科研产物。当前候选改为食用豆类栽培，承接露地耕作并把收获物挂到实际种植行动。
evidence: SPEC-M1-STAGE08-FIELD-CROPS-PROCESSING-BATCH-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-PRO-001, AGR-MEC-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百三十二项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-MIL-001

```text
tech_id: AGR-MIL-001
current_name: 谷物清理、脱粒、磨制与粉尘控制方法
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6重复前项脱粒能力，依赖无关植保与油料作物，并以两条生产线替代实际加工结果。当前候选收窄为谷物清理磨制，直接承接谷物脱粒干燥。
evidence: SPEC-M1-STAGE08-FIELD-CROPS-PROCESSING-BATCH-AMENDMENT-001
related_tech_ids: FOD-HAR-001, FOD-PRO-001, AGR-OIL-001, AGR-BAK-001, AGR-SLA-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百三十三项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-TUB-001

```text
tech_id: AGR-TUB-001
current_name: 块根繁殖材料保存、切块处理与田间管理方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把块根栽培错误接在谷物收后处理后，并自动生成生产线、繁殖材料和食用块根。当前候选改接露地耕作，收获物由实际种植行动产生。
evidence: SPEC-M1-STAGE08-FIELD-CROPS-PROCESSING-BATCH-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-HAR-001, AGR-ORC-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百三十四项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-VEG-001

```text
tech_id: AGR-VEG-001
current_name: 蔬菜育苗、分期栽培与鲜食采收方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把蔬菜栽培错误接在谷物收后处理后，并自动生成生产线、种苗和蔬菜批次。当前候选改接露地耕作，保留实际种植行动及鲜食采收标准。
evidence: SPEC-M1-STAGE08-FIELD-CROPS-PROCESSING-BATCH-AMENDMENT-001
related_tech_ids: FOD-FLD-001, FOD-HAR-001, AGR-OIL-002, Y2-PROD-FOD-004, Y2-PROD-FOD-009
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY
raised_at: M0正式全树续跑第一百三十五项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-CLN-001-A

```text
tech_id: CHM-CLN-001-A
current_name: 肥皂制备
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把全部酸碱盐和分离方法设为共同前置，并只给出抽象肥皂产品。当前候选改接氯碱电解与化学品安全鉴别，分列手部清洁皂和衣物洗涤皂批次。
evidence: SPEC-M1-STAGE08-CLEANING-CHEMICALS-BATCH-AMENDMENT-001
related_tech_ids: CHM-ACD-001-B, CHM-LAB-001, AGR-OIL-002, CIV-HYG-001-A
blocks_prose: false
provisional_post_review_action: NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百三十六项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-CLN-001-B

```text
tech_id: CHM-CLN-001-B
current_name: 洗涤剂配制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_RESOURCE_CHAIN, DEMOTE_CANDIDATE
issue_statement: R6机械依赖全部基础化学品，并把配制能力写成已经恢复合成洗涤剂工业。当前候选只调制实际存在的表面活性剂与助剂，分列衣物和餐具洗涤剂，原料路线未闭合前后移为可选分支。
evidence: SPEC-M1-STAGE08-CLEANING-CHEMICALS-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, CIV-HYG-001-A, CHM-NET-001
blocks_prose: false
provisional_post_review_action: DEMOTE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, ADD_MISSING_RESOURCE_CHAIN, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百三十七项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-CLN-001-C

```text
tech_id: CHM-CLN-001-C
current_name: 消毒剂配制
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6以一个通用消毒剂产品概括多类化学路线，并机械依赖全部酸碱盐。当前候选收窄为含氯消毒液配制，只生产按有效氯浓度和适用范围分级的次氯酸钠消毒液批次。
evidence: SPEC-M1-STAGE08-CLEANING-CHEMICALS-BATCH-AMENDMENT-001
related_tech_ids: CHM-ACD-001-B, CHM-LAB-001, MED-IPC-001, MED-SUP-001-A
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百三十八项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-CLN-001-D

```text
tech_id: CHM-CLN-001-D
current_name: 卫生药剂配制
fact_gate: return_delete
issue_tags: DELETE_CANDIDATE, OVERBROAD_TECH_IDENTITY, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: 精简规格已明确删除万能卫生药剂；本项没有独立原料、工艺、产品或验收指标，范围被具体肥皂、洗涤剂和含氯消毒液覆盖。
evidence: SPEC-M1-STAGE08-CLEANING-CHEMICALS-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001, CIV-HYG-001-A, CIV-HYG-001-B, CIV-HYG-001-C, MED-IPC-001, MIL-EQP-011, CHM-NET-001
blocks_prose: true
provisional_post_review_action: DELETE, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCIES, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百三十九项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-ENE-001

```text
tech_id: CHM-ENE-001
current_name: 推进剂、起爆药与工业爆破材料安全制备
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, OVERBROAD_TECH_IDENTITY, MISSING_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6把共同安全基础、缺失硝酸前体、枪炮发射药、起爆药、工业炸药、底火和泛推进剂揉成一项，并依赖全部酸碱盐。当前候选拆为含能材料安全、工业硝酸制备及三条受控产品路线。
evidence: SPEC-M1-STAGE08-ENERGETIC-MATERIALS-SPLIT-AMENDMENT-001
related_tech_ids: CHM-LAB-001, LOG-WHS-001, CHM-ACD-001-A, CHM-SEP-001-A, CHM-ENE-001-A, CHM-ENE-001-B, CHM-ENE-001-C, CHM-ENE-001-D, CHM-ENE-001-E, CHM-NET-001, MIL-EQP-002, MIL-EQP-004, MIL-EQP-005, MIL-EQP-009, MIL-EXT-032
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_MISSING_MILESTONE, RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS, ADD_MISSING_RESOURCE_CHAINS
raised_at: M0正式全树续跑第一百四十项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-FRT-001-A

```text
tech_id: CHM-FRT-001-A
current_name: 基础肥料配制
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6以万能基础肥料和标准肥料代表未知成分产品，并机械依赖全部酸碱盐。当前候选改为配方肥调制，只对实际养分原料按保证成分和作物用途形成批次。
evidence: SPEC-M1-STAGE09-AGRICULTURAL-CHEMICAL-INPUTS-BATCH-AMENDMENT-001
related_tech_ids: FOD-SOI-001, CHM-LAB-001, CHM-FRT-001-B, CHM-FRT-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, ADD_MISSING_RESOURCE_CHAINS, REBALANCE_COST
raised_at: M0正式全树续跑第一百四十一项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-FRT-001-B

```text
tech_id: CHM-FRT-001-B
current_name: 营养液配制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6把育苗与水培营养液合并为抽象库存并机械依赖全部酸碱盐和土壤科技。当前候选改接标准溶液配制，分别形成育苗与水培营养液标准和批次。
evidence: SPEC-M1-STAGE09-AGRICULTURAL-CHEMICAL-INPUTS-BATCH-AMENDMENT-001
related_tech_ids: CHM-ACD-001-D, FOD-CTL-001-A, FOD-CTL-001-B
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, ADD_MISSING_RESOURCE_CHAINS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百四十二项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-FRT-001-C

```text
tech_id: CHM-FRT-001-C
current_name: 土壤改良剂配制
fact_gate: pass_with_tree_review
issue_tags: OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: R6以万能土壤改良剂概括不同材料与用途，并机械依赖全部酸碱盐。当前候选改为土壤调理剂配制，分别形成酸性土石灰质与钠化土石膏质产品支路。
evidence: SPEC-M1-STAGE09-AGRICULTURAL-CHEMICAL-INPUTS-BATCH-AMENDMENT-001
related_tech_ids: FOD-SOI-001, CHM-LAB-001, RAW-IND-001-A, CHM-FRT-001-A
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, ADD_MISSING_RESOURCE_CHAINS, REBALANCE_COST
raised_at: M0正式全树续跑第一百四十三项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-INS-001-A

```text
tech_id: CHM-INS-001-A
current_name: 电气绝缘材料配制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, STAGE_ERROR, UNLOCK_MISMATCH, SCOPE_ERROR
issue_statement: R6以标准溶液和分离技术直接产生全类电气绝缘材料。当前候选后移到基础树脂路线并收窄为绕组绝缘配制，只形成漆包线绝缘漆和绕组浸渍漆。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: CHM-POL-001, CHM-LAB-001, ELC-CAB-001-A, ENE-TRF-001, ELC-MOT-001-A
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, MOVE_STAGE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百四十四项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-MAT-001

```text
tech_id: CNS-MAT-001
current_name: 木材、砖石、石灰与再生构件分级利用
fact_gate: pass_with_tree_review
issue_tags: SCOPE_ERROR, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6以材料汇总名称重复木材骨料废料等既有能力，实际只输出建筑石灰。当前候选替换为建筑石灰烧制，形成明确窑炉、行动、等级和产品批次。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: RAW-IND-001-A, NRG-HTR-001-B, RAW-IND-001-B, RAW-IND-001-C, RAW-QUA-001, RAW-SCR-001, CNS-CEM-001-A
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百四十五项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-INS-001

```text
tech_id: ELC-INS-001
current_name: 基础工业测量仪表
fact_gate: pass_with_tree_review
issue_tags: SCALE_ERROR, DUPLICATE_MILESTONE, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6把电压电流温度压力流量五类仪表揉成一项并与后续专门科技重复。当前候选收窄为电工仪表制造，只保留V-A1电压表和A-A1电流表。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: ELC-CMP-001, MCH-BAS-001, ICD-VLT-001, ICD-PRS-001, ICD-TMP-001, ICD-FLW-001
blocks_prose: false
provisional_post_review_action: REPLACE_IDENTITY, NARROW_IDENTITY, ADD_PRODUCT_MODELS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCIES, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百四十六项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-MVD-001

```text
tech_id: ENE-MVD-001
current_name: 区域中压线路、电缆接头与安全间距设计方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DEPENDENCY_REORDER
issue_statement: R6依赖储能和旧水力汇总，并把中压电缆作为科研产物。当前候选改为中压线路设计，承接变压器定型与绝缘线缆制造，只开放线路工程和验收边界。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: ENE-TRF-001, ELC-CAB-001-A, NRG-STO-001, ENE-HYD-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REORDER_DEPENDENCY
raised_at: M0正式全树续跑第一百四十七项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-TRF-001

```text
tech_id: ENE-TRF-001
current_name: 配电变压器设计、绝缘、冷却与耐压试验方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, STAGE_ERROR, UNLOCK_MISMATCH, DEPENDENCY_REORDER
issue_statement: R6仅凭低压配电和旧机组汇总直接产生变压器，缺少绕组绝缘和导体线缆能力。当前候选后移并定型S-A1标准配电变压器，置于中压线路之前。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: ENE-GEN-002-A, NRG-GRD-001, CHM-INS-001-A, ELC-CAB-001-A, ENE-MVD-001
blocks_prose: false
provisional_post_review_action: RENAME, MOVE_STAGE, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REORDER_DEPENDENCY
raised_at: M0正式全树续跑第一百四十八项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-WND-001

```text
tech_id: ENE-WND-001
current_name: 小型风力机叶轮、塔架、变换与安全停机方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6依赖热电联供并用泛风力场表示整机与工程。当前候选改为小型风机定型，承接风能站址机械几何和低压配电，形成FL-A1整机及小型风力站工程。
evidence: SPEC-M1-STAGE09-MATERIAL-INSTRUMENT-GRID-BATCH-AMENDMENT-001
related_tech_ids: NRG-REN-001-B, MCH-BAS-001, NRG-GRD-001, ENE-CHP-001, ENE-SOL-001, ENE-SWG-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCIES, REBALANCE_COST
raised_at: M0正式全树续跑第一百四十九项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-PRS-001

```text
tech_id: FOD-PRS-001
current_name: 发酵、腌制、罐藏与低温保藏
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, MISSING_MILESTONE, ID_NAMESPACE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把食品发酵、盐渍、具体罐藏、机械制冷和冷库设施揉成一项，重新制造食品与罐混合。当前候选拆为食品发酵控制、食品盐渍控制、机械制冷循环和食品冷库设计，罐藏交回四条既有独立路线。
evidence: SPEC-M1-STAGE09-FOOD-PRESERVATION-REFRIGERATION-SPLIT-AMENDMENT-001
related_tech_ids: FOD-PRS-001-A, FOD-PRS-001-B, MCH-REF-001, FOD-PRS-001-D, Y2-PROD-CIV-006, Y2-PROD-FOD-007, Y2-PROD-FOD-008, Y2-PROD-FOD-009, FOD-NET-001
blocks_prose: false
provisional_post_review_action: SPLIT, DELETE_AGGREGATE_IDENTITY, ADD_MISSING_MILESTONE, MIGRATE_ID, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS, REBALANCE_COST
raised_at: M0正式全树续跑第一百五十项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-ALU-001

```text
tech_id: MAT-ALU-001
current_name: 铝熔体净化、除气与铸锭质量控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, RESEARCH_COST_REVIEW
issue_statement: R6以基础酸制备为前置并把再生铝锭、设施和检验直接混入研究结果，且与后续再生铝精炼重复。当前候选改为再生铝锭精炼，承接再生炉料分选和小型熔炉设计并形成ADC12压铸用再生铝合金锭路线。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: MET-SRT-001, MET-FUR-001-B, MET-FUR-001-C, MET-NFR-001-B, MAT-ACD-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_DEPENDENCY, MERGE_DUPLICATE, REBALANCE_COST
raised_at: M0正式全树续跑第一百五十一项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-PLT-001

```text
tech_id: MAT-PLT-001
current_name: 钢板厚度、平直度与表面质量控制
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, DEMOTE_CANDIDATE
issue_statement: R6把钢板厚度板形和表面质量另立节点，但后续标准板材生产已经覆盖同一里程碑，且基础酸和锻件依赖均无事实因果。当前结论为合并删除并把有效内容交给MET-ROL-001-C。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-C, MAT-FRG-001, CHM-ACD-001-A
blocks_prose: false
provisional_post_review_action: MERGE_DELETE, REMOVE_DEPENDENCY, REWIRE_DEPENDENTS, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百五十二项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-LAT-001

```text
tech_id: MCH-LAT-001
current_name: 车床、铣床、钻床与磨床精度恢复
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6名称过长并把聚合的四类基础机床误写成固定数量工场。当前候选改为通用机床修复，保留玩家有意义的聚合尺度，只开放一个工场类型与四项独立加工能力状态。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, MCH-CUT-001, MCH-GAG-001, RPR-SHP-001, VEH-BIC-001, VEH-ENG-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS, REVIEW_COST
raised_at: M0正式全树续跑第一百五十三项事实审查
resolution_status: waiting_post_tree_review
```

### MET-FUR-001-A

```text
tech_id: MET-FUR-001-A
current_name: 耐火材料设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCOPE_REDUCTION
issue_statement: R6以全类耐火材料身份依赖废钢石灰石黏土和盐矿物。当前候选收窄为黏土耐材制备，仅形成N-3黏土耐火砖与NN-30耐火泥，不新增硅质耐材评价或代表特种耐材路线。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: RAW-IND-001-B, NRG-HTR-001-B, MET-FUR-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_DEPENDENCIES
raised_at: M0正式全树续跑第一百五十四项事实审查
resolution_status: waiting_post_tree_review
```

### MET-FUR-001-B

```text
tech_id: MET-FUR-001-B
current_name: 熔炼炉设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6以无关矿物共同前置并把熔炉与三条铸造线作为研究直接产出。当前候选收窄为XR-A1小型熔炉设计，只覆盖普通小规模铸铁和常用有色金属熔炼。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: MET-FUR-001-A, NRG-HTR-001-B, MET-FUR-001-C, MAT-ALU-001, MET-CAS-001-A, MET-CAS-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百五十五项事实审查
resolution_status: waiting_post_tree_review
```

### MET-FUR-001-C

```text
tech_id: MET-FUR-001-C
current_name: 浇注安全设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6依赖无关矿物并把浇注安全误作产品。当前候选改为金属浇注安全，只开放浇包模具型芯干燥、隔离、停浇、放行和记录状态，科研点候选降至50。
evidence: SPEC-M1-STAGE09-FOUNDRY-MACHINE-TOOL-BATCH-AMENDMENT-001
related_tech_ids: MET-FUR-001-B, MET-CAS-001-A, MET-CAS-001-B, MAT-ALU-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_PRODUCT, REDISTRIBUTE_RESEARCH_POINTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百五十六项事实审查
resolution_status: waiting_post_tree_review
```

### NRG-NET-001

```text
tech_id: NRG-NET-001
current_name: 区域燃料供应组织
fact_gate: merge_delete
issue_tags: TECH_IDENTITY_MISMATCH, DUPLICATE_MILESTONE, UNLOCK_MISMATCH, PREREQUISITE_ERROR
issue_statement: R6名称声称燃料供应，正文和解锁却描述区域微电网孤岛互联与恢复，并与后续孤岛运行重复。当前结论为合并删除，孤岛内容归ENE-ISL-001，移动应急电源归ENE-EMG-001。
evidence: SPEC-M1-STAGE09-MEASUREMENT-GLASS-RESOURCE-NETWORK-BATCH-AMENDMENT-001
related_tech_ids: ENE-ISL-001, ENE-EMG-001, NRG-DSP-001, NRG-GRD-001, ENE-GEN-002-B, ENE-BES-001
blocks_prose: false
provisional_post_review_action: MERGE_DELETE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS, REDISTRIBUTE_RESEARCH_POINTS
raised_at: M0正式全树续跑第一百五十七项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-MET-001

```text
tech_id: QLT-MET-001
current_name: 测量基准、量具校准与误差记录
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH
issue_statement: R6名称过长并把行动与记录重复作为直接效果。当前候选改为量具校准，只形成校准行动、复校标准、记录及合格超差到期状态，不制造或自动校准量具。
evidence: SPEC-M1-STAGE09-MEASUREMENT-GLASS-RESOURCE-NETWORK-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, QLT-UNI-001, QLT-SMP-001, ELC-INS-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百五十八项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-GLS-001

```text
tech_id: RAW-GLS-001
current_name: 玻璃原料矿物分级
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6依赖黏土和盐矿物并只输出硅质石灰质两项抽象产品。当前候选改为玻璃配料分级，分别形成SY-G1硅砂、SH-G1石灰质配料和BL-C1回收碎玻璃批次。
evidence: SPEC-M1-STAGE09-MEASUREMENT-GLASS-RESOURCE-NETWORK-BATCH-AMENDMENT-001
related_tech_ids: RSC-SIL-001, RAW-IND-001-A, LOG-WHS-001, CNS-GLS-BASE-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_DEPENDENCIES
raised_at: M0正式全树续跑第一百五十九项事实审查
resolution_status: waiting_post_tree_review
```

### RAW-NET-001

```text
tech_id: RAW-NET-001
current_name: 区域资源台账、采储计划与矿区复垦
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCOPE_REDUCTION, RESEARCH_COST_REVIEW
issue_statement: R6把原料调度、矿山关闭和复垦揉成一项，并自动生成抽象供应网。当前候选收窄为区域原料调度，只形成组织计划记录与供应缺口状态，关闭和复垦交还专门科技。
evidence: SPEC-M1-STAGE09-MEASUREMENT-GLASS-RESOURCE-NETWORK-BATCH-AMENDMENT-001
related_tech_ids: RSC-RSV-001, LOG-WHS-001, RSC-CLS-001, RSC-RCL-001, LOG-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_IDENTITY, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, REMOVE_DEPENDENCIES, REBALANCE_COST
raised_at: M0正式全树续跑第一百六十项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-PMV-001

```text
tech_id: RPR-PMV-001
current_name: 清洁、润滑、紧固与预防性保养
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6名称过长并把燃料净化润滑油冷却液全部设为知识前置，只输出一张工单。当前候选改为预防保养，耗材转为实体投入并形成行动周期工单与到期逾期状态。
evidence: SPEC-M1-STAGE10-MAINTENANCE-SETTLEMENT-WATER-FOOD-BATCH-AMENDMENT-001
related_tech_ids: RPR-INS-001, CHM-LUB-001-A, CHM-LUB-001-B, CHM-LUB-001-C, RPR-DIA-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十一项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-CLS-001

```text
tech_id: RSC-CLS-001
current_name: 矿山关闭、边坡稳定、排水与污染控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6以固体燃料林业和废墟回收作为通用矿山关闭前置，正文又错写勘探证据。当前候选改为矿山关闭治理，承接矿井环境监控与储量核算并形成工程行动记录和三段状态。
evidence: SPEC-M1-STAGE10-MAINTENANCE-SETTLEMENT-WATER-FOOD-BATCH-AMENDMENT-001
related_tech_ids: RAW-SAF-001, RSC-RSV-001, RSC-RCL-001, RAW-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十二项事实审查
resolution_status: waiting_post_tree_review
```

### SET-EXP-001

```text
tech_id: SET-EXP-001
current_name: 模块化住区扩建与公共接口预留
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把诊疗照护教育登记设施全部设为扩建硬前置，并把接口预留误作产品。当前候选改为模块住区扩建，只承接街区与公用接口能力并形成施工图工程标准和接入状态。
evidence: SPEC-M1-STAGE10-MAINTENANCE-SETTLEMENT-WATER-FOOD-BATCH-AMENDMENT-001
related_tech_ids: SET-BLK-001, SET-SVC-001-A, SET-SVC-001-B, NRG-GRD-001, SET-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_DEPENDENCIES, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十三项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-RAW-001

```text
tech_id: WTR-RAW-001
current_name: 取水、沉淀与原水预处理
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, DUPLICATE_MILESTONE, UNLOCK_MISMATCH, TYPE_MISMATCH
issue_statement: R6把水源接入与净水线粗处理混成一项，要求地表地下管线旧管网浅井全部完成，并把原水池误作记录。当前候选拆为原水取水设计与原水预处理，后者严格排除既有药剂混凝沉淀。
evidence: SPEC-M1-STAGE10-MAINTENANCE-SETTLEMENT-WATER-FOOD-BATCH-AMENDMENT-001
related_tech_ids: WTR-RAW-001-A, WTR-RAW-001-B, WTR-SUR-001-A, WTR-WEL-001-C, WSE-COA-001, WTR-POT-001
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, REMOVE_REQUIRED_COUNT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十四项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-BAK-001

```text
tech_id: AGR-BAK-001
current_name: 标准烤制主食发酵、成形与烘烤方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6名称过长正文错写土壤种源，且使用抽象标准主食产品。当前候选改为烤制主食生产，承接谷物磨制食品发酵与热工能力并形成MB-A1标准面包首代产品。
evidence: SPEC-M1-STAGE10-MAINTENANCE-SETTLEMENT-WATER-FOOD-BATCH-AMENDMENT-001
related_tech_ids: AGR-MIL-001, FOD-PRS-001-A, NRG-HTR-001-B, FOD-NET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十五项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-FED-001

```text
tech_id: AGR-FED-001
current_name: 饲料原料检验、营养配比与安全混合方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_MILESTONE
issue_statement: R6只开放万能饲料配方与生产线，且精简树漏装禽畜生产闭环。当前候选改为配合饲料生产，分别形成禽育01号与反刍维持01号配方产品，并登记四个既有畜牧里程碑恢复待办。
evidence: SPEC-M1-STAGE10-AGRICULTURAL-PROCESSING-LIVESTOCK-BATCH-AMENDMENT-001
related_tech_ids: AGR-MIL-001, AGR-FOR-001-B, AGR-BIO-001, AGR-POU-001, AGR-LIV-001, AGR-VET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, RETYPE_OUTPUTS, REWRITE_UNLOCK, RESTORE_MISSING_MILESTONES
raised_at: M0正式全树续跑第一百六十六项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-MEC-001

```text
tech_id: AGR-MEC-001
current_name: 农业拖拉机、农具配套与季节作业维护方法
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, STAGE_ERROR
issue_statement: R6名称与拖拉机设计和设备维护重叠，并错误依赖收获豆类。当前候选后移并改为农机作业组织，只处理已有农机驾驶员季节任务和维护窗口的排程。
evidence: SPEC-M1-STAGE10-AGRICULTURAL-PROCESSING-LIVESTOCK-BATCH-AMENDMENT-001
related_tech_ids: VEH-AGR-001, FOD-FLD-001, RPR-PMV-001
blocks_prose: false
provisional_post_review_action: RENAME, MOVE_STAGE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百六十七项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-OIL-002

```text
tech_id: AGR-OIL-002
current_name: 油料清理、压榨、过滤与食用油检验方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6依赖种源与蔬菜栽培却遗漏食用油主产品，只列生产线和饼粕。当前候选改为食用油压榨，承接油料作物并分别形成分物种压榨油和饼粕批次及饲用状态。
evidence: SPEC-M1-STAGE10-AGRICULTURAL-PROCESSING-LIVESTOCK-BATCH-AMENDMENT-001
related_tech_ids: AGR-OIL-001, AGR-FED-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, ADD_MISSING_PRODUCT, REWRITE_UNLOCK
raised_at: M0正式全树续跑第一百六十八项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-ORC-001

```text
tech_id: AGR-ORC-001
current_name: 旧果园鉴定、修复、嫁接与多年生作物管理方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6错误依赖块根与饲草并直接列出种苗鲜果。当前候选改为果园复育，承接种源土壤和苗圃能力，工程完成后才按品种母株与用途等级形成实际产品。
evidence: SPEC-M1-STAGE10-AGRICULTURAL-PROCESSING-LIVESTOCK-BATCH-AMENDMENT-001
related_tech_ids: FOD-SED-001, FOD-SOI-001, FOD-CTL-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK
raised_at: M0正式全树续跑第一百六十九项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-SLA-001

```text
tech_id: AGR-SLA-001
current_name: 禽畜屠宰、胴体检验、冷却与污染控制方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_MILESTONE, RESEARCH_COST_REVIEW
issue_statement: R6错误依赖谷物加工并直接产生胴体，精简树又漏装动物来源养殖和卫生科技。当前候选改为禽畜屠宰检疫，家禽家畜路线分别读取待恢复的四个核心里程碑并按卫生等级形成冷却胴体批次。
evidence: SPEC-M1-STAGE10-AGRICULTURAL-PROCESSING-LIVESTOCK-BATCH-AMENDMENT-001
related_tech_ids: FOD-PRS-001-C, WTR-TST-001, AGR-BIO-001, AGR-POU-001, AGR-LIV-001, AGR-VET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RESTORE_MISSING_MILESTONES, RETYPE_OUTPUTS, REWRITE_UNLOCK, REBALANCE_COST
raised_at: M0正式全树续跑第一百七十项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-GAS-001-A

```text
tech_id: CHM-GAS-001-A
current_name: 分子筛制氧、氧气纯度分级与缓冲储存方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_MILESTONE, STAGE_ERROR
issue_statement: R6把工艺制氧与更高等级氧气用途混写，又缺少压缩空气和检测条件。当前候选收窄为分子筛制氧，形成ZY-A1机组与O90级工艺氧气，医用氧气保持独立路线。
evidence: SPEC-M1-STAGE10-OXYGEN-TEXTILE-MORTAR-GLASS-SURVEY-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, NRG-GRD-001, ICD-PRS-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, RESTORE_MISSING_MILESTONE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十一项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-TEX-001

```text
tech_id: CIV-TEX-001
current_name: 纤维处理、纺纱、织造与基础衣物制作
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_MILESTONE
issue_statement: R6把纺纱织造和衣被制作合成一项并直接开放多类产品，却没有可靠纤维来源。当前候选拆为纤维纺纱、布料织造和衣被制作，分别形成通用纱01号、平纹布01号、基础衣物01型和被褥01型。
evidence: SPEC-M1-STAGE10-OXYGEN-TEXTILE-MORTAR-GLASS-SURVEY-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001-A, CIV-TEX-001-B, CIV-TEX-001-C
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, RETYPE_OUTPUTS, RESTORE_MISSING_MILESTONE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十二项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-CEM-001-A

```text
tech_id: CNS-CEM-001-A
current_name: 石灰胶结料熟化、配制与施工检验方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6以抽象胶结料掩盖实际产品并错误连接水泥烧成。当前候选改为石灰砂浆配制，分别形成砌筑与抹灰石灰砂浆批次，并将后续水泥砂浆改为并行路线。
evidence: SPEC-M1-STAGE10-OXYGEN-TEXTILE-MORTAR-GLASS-SURVEY-BATCH-AMENDMENT-001
related_tech_ids: CNS-MAT-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODELS, RETYPE_OUTPUTS, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十三项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-GLS-BASE-001

```text
tech_id: CNS-GLS-BASE-001
current_name: 玻璃配料、熔制、澄清与退火基础
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_MILESTONE
issue_statement: R6把配料熔制与退火混成一项，并把炉内熔体和成品边界写乱。当前候选拆为玻璃配料调制、基础玻璃熔制和玻璃退火，登记纯碱与助熔剂供应缺口，并保留成形工序的实际生产位置。
evidence: SPEC-M1-STAGE10-OXYGEN-TEXTILE-MORTAR-GLASS-SURVEY-BATCH-AMENDMENT-001
related_tech_ids: CNS-GLS-BASE-001-A, CNS-GLS-BASE-001-B, CNS-GLS-BASE-001-C, RAW-GLS-001
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, RESTORE_MISSING_MILESTONE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十四项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-SUR-001

```text
tech_id: CNS-SUR-001
current_name: 工程场地测量、地基承载判定与施工放样
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把现场基准、地基适用性与施工流程混写。当前候选拆为工程场地测量和地基承载判定，分别形成测量基准与基础适用状态，施工放样不再作为额外科技捆绑。
evidence: SPEC-M1-STAGE10-OXYGEN-TEXTILE-MORTAR-GLASS-SURVEY-BATCH-AMENDMENT-001
related_tech_ids: CNS-SUR-001-A, CNS-SUR-001-B, QLT-MET-001, SET-SUR-001-A, RAW-GEO-001-A, WTR-SUR-001-B
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十五项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-RAD-001

```text
tech_id: ELC-RAD-001
current_name: 基础无线电收发、频率管理与天线适配
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, RESEARCH_COST_REVIEW
issue_statement: R6把固定台便携台频率行政和覆盖复测混成一项。当前候选收窄为无线电台定型，只交付WXD-A1固定台与TX-A1天线馈线组，便携台和覆盖补偿分别留给既有后续节点。
evidence: SPEC-M1-STAGE10-RADIO-RECORD-SOLAR-SWITCHGEAR-FOOD-BATCH-AMENDMENT-001
related_tech_ids: ELC-CMP-001, ICD-EMC-001, ICD-POR-001, ICD-RPT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, REMOVE_DUPLICATE_UNLOCKS, ADD_PRODUCT_MODELS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十六项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-REC-001

```text
tech_id: ELC-REC-001
current_name: 数据记录、时钟同步与设备运行日志
fact_gate: pass_with_tree_review
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6重复占用统一时钟同步且只列档案。当前候选收窄为工业运行记录，增加JL-A1工业记录仪和明确的中断状态，跨设备校时继续由ICD-TIM-001负责。
evidence: SPEC-M1-STAGE10-RADIO-RECORD-SOLAR-SWITCHGEAR-FOOD-BATCH-AMENDMENT-001
related_tech_ids: ELC-INS-001, QLT-UNI-001, ICD-TIM-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_DUPLICATE_UNLOCK, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十七项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-SOL-001

```text
tech_id: ENE-SOL-001
current_name: 回收光伏组件分级、阵列、逆变与并网方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把既有组件库存分级和电站设计混成一项，并错误要求储能蒸汽与风力路线。当前候选拆为光伏组件分级和光伏电站设计，分别形成库存状态与GF-A1设备组和太阳能场工程。
evidence: SPEC-M1-STAGE10-RADIO-RECORD-SOLAR-SWITCHGEAR-FOOD-BATCH-AMENDMENT-001
related_tech_ids: ENE-SOL-001-A, ENE-SOL-001-B, NRG-REN-001-C, NRG-GRD-001
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, REMOVE_DEPENDENCIES, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十八项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-SWG-001

```text
tech_id: ENE-SWG-001
current_name: 中压开关、分段保护与变配电站联锁方法
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把中压开关产品定型和变配电站地点工程混成一项，35点又严重低估。当前候选拆为KYN-A1中压开关定型和变配电站设计，衔接既有S-A1配电变压器与中压线路。
evidence: SPEC-M1-STAGE10-RADIO-RECORD-SOLAR-SWITCHGEAR-FOOD-BATCH-AMENDMENT-001
related_tech_ids: ENE-SWG-001-A, ENE-SWG-001-B, ENE-TRF-001, ENE-MVD-001, NRG-GRD-001
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百七十九项事实审查
resolution_status: waiting_post_tree_review
```

### FOD-NET-001

```text
tech_id: FOD-NET-001
current_name: 区域食品生产与供应组织
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把区域食品网和战略种源写成科研产出，并要求已失效的生产与保藏汇总前置。当前候选收窄为区域食品调度，只读取实际库存需求运输保藏和种源状态，删除自动食品网与种源产出。
evidence: SPEC-M1-STAGE10-RADIO-RECORD-SOLAR-SWITCHGEAR-FOOD-BATCH-AMENDMENT-001
related_tech_ids: LOG-WHS-001, FOD-RAT-001, FOD-SED-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REMOVE_FALSE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-POR-001

```text
tech_id: ICD-POR-001
current_name: 便携无线电电源、频道与野外可靠性设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: R6直接承接电工仪表并以便携电台占位，未接固定无线电平台。当前候选改为便携电台定型，只交付WXB-A1便携型号，覆盖中继与固定台保持独立。
evidence: SPEC-M1-STAGE11-RADIO-MACHINE-ROAD-ACID-BATCH-AMENDMENT-001
related_tech_ids: ELC-RAD-001, ICD-RPT-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十一项事实审查
resolution_status: waiting_post_tree_review
```

### IME-GRD-001

```text
tech_id: IME-GRD-001
current_name: 标准磨床砂轮、主轴、冷却与精度验收
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把新造标准磨床仅按25点和通用磨床占位处理。当前候选改为标准磨床定型，交付MA-A1标准平面磨床并补入铸件量具与真实部件条件。
evidence: SPEC-M1-STAGE11-RADIO-MACHINE-ROAD-ACID-BATCH-AMENDMENT-001
related_tech_ids: MCH-LAT-001, QLT-MET-001, MET-CAS-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十二项事实审查
resolution_status: waiting_post_tree_review
```

### IME-LAT-001

```text
tech_id: IME-LAT-001
current_name: 标准车床床身、主轴、进给与整机验收
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把新造标准车床仅按25点和通用车床占位处理。当前候选改为标准车床定型，交付CA-A1标准车床，并与标准磨床平行承接修复机床制造首批设备。
evidence: SPEC-M1-STAGE11-RADIO-MACHINE-ROAD-ACID-BATCH-AMENDMENT-001
related_tech_ids: MCH-LAT-001, QLT-MET-001, MET-CAS-001-C
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十三项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-RDS-001

```text
tech_id: LOG-RDS-001
current_name: 基础道路建设与养护
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把土路和碎石路误作记录，又依赖已收窄为建筑石灰的材料汇总节点。当前候选改为道路建设养护，道路线形提供知识前置，实际骨料作为工程投入，完工后形成道路与限行状态。
evidence: SPEC-M1-STAGE11-RADIO-MACHINE-ROAD-ACID-BATCH-AMENDMENT-001
related_tech_ids: TLG-GRD-001, RAW-QUA-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REMOVE_DEPENDENCY, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十四项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-ACD-001

```text
tech_id: MAT-ACD-001
current_name: 酸碱连续制备、浓度控制与耐腐蚀输送
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, OVERBROAD_TECH_IDENTITY, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6把不同化学链的酸碱连续生产和耐蚀工段混成50点，并重新生成万能工业酸碱。当前候选拆为硫酸连续生产和氯碱连续生产，沿用具体产品身份，耐蚀输送下沉为各自工段条件。
evidence: SPEC-M1-STAGE11-RADIO-MACHINE-ROAD-ACID-BATCH-AMENDMENT-001
related_tech_ids: MAT-ACD-001-A, MAT-ACD-001-B, CHM-ACD-001-A, CHM-ACD-001-B
blocks_prose: false
provisional_post_review_action: SPLIT, REWIRE_PREREQUISITE, REMOVE_ABSTRACT_PRODUCTS, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十五项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-FRG-001

```text
tech_id: MAT-FRG-001
current_name: 锻件加热、变形量与纤维流线验收
fact_gate: return_merge
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: 本项与MET-FOR-001处理同一锻造工艺与锻件验收，没有独立玩家里程碑。当前处置为合并删除，后继改接通用锻件生产，35点回整树重估池。
evidence: SPEC-M1-STAGE11-FORGING-TOLERANCE-PUMP-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MET-FOR-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_DEPENDENCIES, REBALANCE_COST
raised_at: M0正式全树续跑第一百八十六项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-GAG-001

```text
tech_id: MCH-GAG-001
current_name: 公差、量规与互换性检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6把标准量规误作记录并把互换体系误作产品。当前候选改为公差互换标准，LG-A1极限量规组是产品，跨批互换性是尺寸系列状态。
evidence: SPEC-M1-STAGE11-FORGING-TOLERANCE-PUMP-CASTING-BATCH-AMENDMENT-001
related_tech_ids: QLT-MET-001, MCH-LAT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十七项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-PMP-001-A

```text
tech_id: MCH-PMP-001-A
current_name: 离心泵水力设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, STAGE_ORDER_ERROR
issue_statement: R6错误承接已收窄的电工仪表，并把叶轮样件列为科研自动产品。当前候选后移到压力流量仪表之后，只形成设计系列、工况区和LJ-A1试验叶轮样件。
evidence: SPEC-M1-STAGE11-FORGING-TOLERANCE-PUMP-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, ICD-PRS-001, ICD-FLW-001, MCH-PMP-001-B, MCH-PMP-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, MOVE_STAGE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十八项事实审查
resolution_status: waiting_post_tree_review
```

### MET-CAS-001-A

```text
tech_id: MET-CAS-001-A
current_name: 砂型铸造
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6把工艺名砂型铸造写成产品。当前候选承接小型熔炉和浇注安全，科研开放砂型工位工艺与检验，实际产品是按材料图样类别和批次登记的铸件毛坯。
evidence: SPEC-M1-STAGE11-FORGING-TOLERANCE-PUMP-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MET-FUR-001-B, MET-FUR-001-C, MET-CAS-001-C
blocks_prose: false
provisional_post_review_action: REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REWRITE_UNLOCK, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百八十九项事实审查
resolution_status: waiting_post_tree_review
```

### MET-CAS-001-B

```text
tech_id: MET-CAS-001-B
current_name: 金属型铸造
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCOPE_REDUCTION, RESEARCH_COST_REVIEW
issue_statement: R6复制砂型条件并把工艺名写成产品，范围又默认覆盖全部金属。当前候选后移并收窄至适用常用有色合金，以永久金属模寿命温控和重复尺寸状态形成独立里程碑。
evidence: SPEC-M1-STAGE11-FORGING-TOLERANCE-PUMP-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MET-CAS-001-A, MCH-GAG-001
blocks_prose: false
provisional_post_review_action: NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十项事实审查
resolution_status: waiting_post_tree_review
```

### MET-CAS-001-C

```text
tech_id: MET-CAS-001-C
current_name: 重复铸件工艺控制
fact_gate: return_merge
issue_tags: DUPLICATE_MILESTONE, LOW_GAME_VALUE, UNLOCK_MISMATCH, DEMOTE_CANDIDATE
issue_statement: 砂型和金属型铸造已各自承担重复生产，公差互换标准承担跨批装配。当前节点只汇总既有能力，无新增玩家决策，合并删除并取消抽象标准铸件产品。
evidence: SPEC-M1-STAGE11-CASTING-STEEL-COPPER-ALLOY-BATCH-AMENDMENT-001
related_tech_ids: MET-CAS-001-A, MET-CAS-001-B, MCH-GAG-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_FALSE_OUTPUT
raised_at: M0正式全树续跑第一百九十一项事实审查
resolution_status: waiting_post_tree_review
```

### MET-IRN-001

```text
tech_id: MET-IRN-001
current_name: 基础碳钢成分控制与脱氧精炼
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_MILESTONE, MISSING_RESOURCE_CHAIN, RESEARCH_COST_REVIEW
issue_statement: R6从矿石选矿直接跳到结构钢并把脱氧误作产品。当前候选收窄为废钢炼钢，形成Q235B再生结构钢炉次，同时登记铁矿还原炼铁、高温炉型与耐材缺口。
evidence: SPEC-M1-STAGE11-CASTING-STEEL-COPPER-ALLOY-BATCH-AMENDMENT-001
related_tech_ids: MET-SRT-001, MET-FUR-001-C, RAW-BEN-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, RESTORE_MISSING_MILESTONES, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十二项事实审查
resolution_status: waiting_post_tree_review
```

### MET-NFR-001-A

```text
tech_id: MET-NFR-001-A
current_name: 再生铜精炼
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCOPE_REDUCTION, DUPLICATE_MILESTONE, RESEARCH_COST_REVIEW
issue_statement: R6直接开放再生铜和全部铜材，与后续铜精炼重复。当前候选收窄为再生粗铜熔炼，产出含铜量95%级粗铜锭，导电铜留给后续精炼。
evidence: SPEC-M1-STAGE11-CASTING-STEEL-COPPER-ALLOY-BATCH-AMENDMENT-001
related_tech_ids: MET-SRT-001, MET-FUR-001-B, MET-FUR-001-C, MAT-COP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, REMOVE_FALSE_OUTPUTS, REBALANCE_COST, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十三项事实审查
resolution_status: waiting_post_tree_review
```

### MET-NFR-001-B

```text
tech_id: MET-NFR-001-B
current_name: 再生铝精炼
fact_gate: return_merge
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: 本项与阶段09已冻结的MAT-ALU-001 ADC12再生铝锭精炼完全重复。当前处置为合并删除，35点回池，后继改接ADC12路线。
evidence: SPEC-M1-STAGE11-CASTING-STEEL-COPPER-ALLOY-BATCH-AMENDMENT-001
related_tech_ids: MAT-ALU-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_FALSE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第一百九十四项事实审查
resolution_status: waiting_post_tree_review
```

### MET-NFR-001-C

```text
tech_id: MET-NFR-001-C
current_name: 常用有色合金熔配
fact_gate: return_split
issue_tags: SPLIT_CANDIDATE, OVERBROAD_TECH_IDENTITY, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, MISSING_RESOURCE_CHAIN
issue_statement: R6以常用有色合金概括多条材料链并与后续铜铝合金节点重复。当前候选拆为H62黄铜和CuSn10锡青铜两条首代路线，ADC12保持独立，并登记锌锡金属来源缺口。
evidence: SPEC-M1-STAGE11-CASTING-STEEL-COPPER-ALLOY-BATCH-AMENDMENT-001
related_tech_ids: MET-NFR-001-C1, MET-NFR-001-C2, MAT-COP-001, MAT-ALY-001, MAT-ALU-001
blocks_prose: false
provisional_post_review_action: SPLIT, ADD_PRODUCT_GRADES, RESTORE_MISSING_RESOURCE_CHAINS, MERGE_LATER_DUPLICATE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十五项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-SMP-001

```text
tech_id: QLT-SMP-001
current_name: 生产全过程质量检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6只堆叠检验行动与记录，未形成批次状态。当前候选改为生产质量检验，统一原料过程和成品检验，检验完成后更新具体批次的待检合格隔离或返工状态。
evidence: SPEC-M1-STAGE11-QUALITY-REPAIR-RECLAMATION-SERVICE-BICYCLE-BATCH-AMENDMENT-001
related_tech_ids: QLT-MET-001, MCH-GAG-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_BATCH_STATES, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十六项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-DIA-001

```text
tech_id: RPR-DIA-001
current_name: 故障诊断、拆检与失效原因分析
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6依赖已收窄的电工仪表并重复堆叠工单记录。当前候选改为设备故障诊断，以症状坏件和根因三类状态形成同一维修决策闭环，不自动执行维修。
evidence: SPEC-M1-STAGE11-QUALITY-REPAIR-RECLAMATION-SERVICE-BICYCLE-BATCH-AMENDMENT-001
related_tech_ids: RPR-INS-001, QLT-MET-001, RPR-PMV-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十七项事实审查
resolution_status: waiting_post_tree_review
```

### RSC-RCL-001

```text
tech_id: RSC-RCL-001
current_name: 表土回覆、植被恢复与矿区复垦验收
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6错误依赖废金属和玻璃砂，并把恢复地块写成产品。当前候选改为矿区复垦，严格承接矿山已稳定状态，工程与验收后才更新表土植被限制用途和完成等地点状态。
evidence: SPEC-M1-STAGE11-QUALITY-REPAIR-RECLAMATION-SERVICE-BICYCLE-BATCH-AMENDMENT-001
related_tech_ids: RSC-CLS-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, ADD_LOCATION_STATES, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十八项事实审查
resolution_status: waiting_post_tree_review
```

### SET-NET-001

```text
tech_id: SET-NET-001
current_name: 多聚居点服务分级与区域节点协同
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把人口迁移和住区扩建机械设为前置并自动生成区域网络。当前候选改为区域服务协同，只在真实多聚居点交通通信和服务能力成立时开放跨点转接组织和状态。
evidence: SPEC-M1-STAGE11-QUALITY-REPAIR-RECLAMATION-SERVICE-BICYCLE-BATCH-AMENDMENT-001
related_tech_ids: POP-MIG-001, SET-EXP-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_PREREQUISITES, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第一百九十九项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-BIC-001

```text
tech_id: VEH-BIC-001
current_name: 自行车车架、链传动与道路骑行
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6只开放自行车首投型号占位。当前候选改为自行车定型，交付ZC-A1型载货自行车及图纸载荷制动维护标准，与TC-A1推车和MT-A1摩托车型号序列衔接。
evidence: SPEC-M1-STAGE11-QUALITY-REPAIR-RECLAMATION-SERVICE-BICYCLE-BATCH-AMENDMENT-001
related_tech_ids: VEH-CAR-001, MCH-GAG-001, VEH-MOT-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-ENG-001

```text
tech_id: VEH-ENG-001
current_name: 小型内燃机修复、测功与标准附件
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把发动机总成误作记录并与燃料发电路线混连。当前候选改为小型发动机修复，形成FD-A1再制造总成，与内燃发电机组保持独立。
evidence: SPEC-M1-STAGE12-ENGINE-WATER-BRICK-FOOD-AQUACULTURE-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, MCH-LAT-001, CHM-LUB-001-B, CHM-LUB-001-C, ENE-GEN-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百零一项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-POT-001

```text
tech_id: WTR-POT-001
current_name: 安全饮用水处理
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6把介质过滤误作产品并让科研直接生成净水设施与水批次。当前候选承接原水预处理和饮水检验，实际运行与检验后才更新饮用水批次状态。
evidence: SPEC-M1-STAGE12-ENGINE-WATER-BRICK-FOOD-AQUACULTURE-BATCH-AMENDMENT-001
related_tech_ids: WTR-RAW-001-B, WTR-TST-001, WTR-STO-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS, AUDIT_MODEL_CONFLICT
raised_at: M0正式全树续跑第二百零二项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-BLD-006

```text
tech_id: Y2-PROD-BLD-006
current_name: 标准砌筑砖配料、成形与烧成
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6错误依赖建筑石灰并把生产规格当产品。当前候选改为砌筑砖烧制，以MU10级烧结普通砖形成明确材料里程碑。
evidence: SPEC-M1-STAGE12-ENGINE-WATER-BRICK-FOOD-AQUACULTURE-BATCH-AMENDMENT-001
related_tech_ids: RAW-IND-001-B, NRG-HTR-001-B
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百零三项事实审查
resolution_status: waiting_post_tree_review
```

### Y2-PROD-FOD-004

```text
tech_id: Y2-PROD-FOD-004
current_name: 蔬菜脱水、复水与储存稳定性控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR
issue_statement: R6依赖已拆除的食品保藏总包并把规格当产品。当前候选收窄为蔬菜脱水，产品按物种脱水等级包装状态和批次登记。
evidence: SPEC-M1-STAGE12-ENGINE-WATER-BRICK-FOOD-AQUACULTURE-BATCH-AMENDMENT-001
related_tech_ids: AGR-VEG-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_DEPENDENCY, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百零四项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-AQU-001

```text
tech_id: AGR-AQU-001
current_name: 养殖水体、水质、苗种、饲喂与起捕管理方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, SCALE_ERROR, MISSING_MILESTONE
issue_statement: R6错误依赖植保油料和屠宰，并让科研生成容量亲本与水产品。当前候选改为水产养殖，恢复动物疫病防治，实际运行后才形成物种化健康状态和起捕批次。
evidence: SPEC-M1-STAGE12-ENGINE-WATER-BRICK-FOOD-AQUACULTURE-BATCH-AMENDMENT-001
related_tech_ids: WTR-TST-001, AGR-VET-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RESTORE_MISSING_MILESTONE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百零五项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-DAI-001

```text
tech_id: AGR-DAI-001
current_name: 原料乳挤取、冷却、检验与巴氏杀菌方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE, SCOPE_NARROWED
issue_statement: R6把家畜养殖的原料乳生产与乳品加工混成一项。当前候选收窄为巴氏乳生产，实际合格原料乳由家畜养殖提供。
evidence: SPEC-M1-STAGE12-DAIRY-VET-MEDICAL-OXYGEN-APPLIANCE-BATCH-AMENDMENT-001
related_tech_ids: AGR-LIV-001, AGR-VET-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百零六项事实审查
resolution_status: waiting_post_tree_review
```

### AGR-VET-001

```text
tech_id: AGR-VET-001
current_name: 动物疫病监测、免疫、治疗与死亡处置方法
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_MILESTONE
issue_statement: R6漏装畜牧核心并错误依赖植保果园。当前候选恢复动物疫病防治，以健康观察隔离暴发恢复状态形成统一生物安全闭环。
evidence: SPEC-M1-STAGE12-DAIRY-VET-MEDICAL-OXYGEN-APPLIANCE-BATCH-AMENDMENT-001
related_tech_ids: AGR-BIO-001, AGR-POU-001, AGR-LIV-001, AGR-AQU-001
blocks_prose: false
provisional_post_review_action: RENAME, RESTORE_MISSING_MILESTONE, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百零七项事实审查
resolution_status: waiting_post_tree_review
```

### CHM-GAS-001-B

```text
tech_id: CHM-GAS-001-B
current_name: 医用氧气压缩与纯度控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_INSUFFICIENT, QUALITY_GRADE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6暗示O90工艺氧经压缩即可成为医用氧。当前候选改为医用氧充装控制，只有医用质量洁净压缩和气瓶体系共同成立后才生产O93-M瓶装医用氧。
evidence: SPEC-M1-STAGE12-DAIRY-VET-MEDICAL-OXYGEN-APPLIANCE-BATCH-AMENDMENT-001
related_tech_ids: CHM-GAS-001-A, QLT-SMP-001, MED-DEV-001-B
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百零八项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-APP-001-A

```text
tech_id: CIV-APP-001-A
current_name: 家用风扇设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, RANK_MISMATCH, MODEL_COLLISION
issue_statement: R6错误依赖内燃机并缺少产品型号。当前候选后移至电动机性能路线，交付JF-A1家用风扇并避开FS-A1既有防水产品冲突。
evidence: SPEC-M1-STAGE12-DAIRY-VET-MEDICAL-OXYGEN-APPLIANCE-BATCH-AMENDMENT-001
related_tech_ids: CIV-LGT-001, ELC-MOT-001-C
blocks_prose: false
provisional_post_review_action: RENAME, MOVE_STAGE, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL
raised_at: M0正式全树续跑第二百零九项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-APP-001-B

```text
tech_id: CIV-APP-001-B
current_name: 家用加热器设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_RESOURCE_CHAIN
issue_statement: R6错误依赖内燃机并假定电热元件存在。当前候选改为电暖器定型，交付JR-A1电阻式电暖器，同时登记电热元件供应或检验缺口。
evidence: SPEC-M1-STAGE12-DAIRY-VET-MEDICAL-OXYGEN-APPLIANCE-BATCH-AMENDMENT-001
related_tech_ids: CIV-LGT-001, ICD-TMP-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第二百一十项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-APP-001-C

```text
tech_id: CIV-APP-001-C
current_name: 家用冷藏设备设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6错误依赖内燃机并缺少产品型号。当前候选改为冰箱定型，承接机械制冷住宅用电和温控，交付LC-A1家用冰箱。
evidence: SPEC-M1-STAGE12-FRIDGE-HYGIENE-CEMENT-BATCH-AMENDMENT-001
related_tech_ids: MCH-REF-001, CIV-LGT-001, ICD-TMP-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL
raised_at: M0正式全树续跑第二百一十一项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-HYG-001-A

```text
tech_id: CIV-HYG-001-A
current_name: 家庭清洁用品配制
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, ABSTRACT_PRODUCT, PREREQUISITE_ERROR, LOW_GAME_VALUE
issue_statement: 抽象家庭清洁用品与肥皂洗涤剂和含氯消毒液完全重叠，没有独立玩家决策。当前节点合并删除，家庭用途并入具体产品标准。
evidence: SPEC-M1-STAGE12-FRIDGE-HYGIENE-CEMENT-BATCH-AMENDMENT-001
related_tech_ids: CHM-CLN-001-A, CHM-CLN-001-B, CHM-CLN-001-C
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_ABSTRACT_PRODUCT
raised_at: M0正式全树续跑第二百一十二项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-HYG-001-B

```text
tech_id: CIV-HYG-001-B
current_name: 个人卫生用品制作
fact_gate: return_delete
issue_tags: ABSTRACT_PRODUCT, MISSING_PRODUCT_IDENTITY, DUPLICATE_MILESTONE, LOW_GAME_VALUE
issue_statement: 现有规格仅有个人卫生用品总称，缺少单一产品材料链和制造边界。当前确认删除，不临时发明产品组。
evidence: SPEC-M1-STAGE12-FRIDGE-HYGIENE-CEMENT-BATCH-AMENDMENT-001
related_tech_ids: CHM-CLN-001-A, CIV-HYG-001-C
blocks_prose: true
provisional_post_review_action: DELETE, REMOVE_ABSTRACT_PRODUCT, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百一十三项事实审查
resolution_status: waiting_post_tree_review
```

### CIV-HYG-001-C

```text
tech_id: CIV-HYG-001-C
current_name: 经期照护用品制作
fact_gate: pass_with_tree_review
issue_tags: SCOPE_REDUCTION, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6以抽象经期用品掩盖材料边界。当前候选收窄为可洗经期垫生产，以既有织物链交付JQ-A1产品，不假定一次性吸收材料已经供应。
evidence: SPEC-M1-STAGE12-FRIDGE-HYGIENE-CEMENT-BATCH-AMENDMENT-001
related_tech_ids: CIV-TEX-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REWIRE_PREREQUISITE, ADD_PRODUCT_MODEL, REBALANCE_COST
raised_at: M0正式全树续跑第二百一十四项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-CEM-001-B

```text
tech_id: CNS-CEM-001-B
current_name: 水泥烧成
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_RESOURCE_CHAIN, MISSING_EQUIPMENT_CHAIN, RESEARCH_COST_REVIEW
issue_statement: R6错误依赖石灰砂浆且仅开放抽象水泥。当前候选扩正为硅酸盐水泥生产，交付P.O42.5产品并登记耐碱炉衬和工业粉磨缺口。
evidence: SPEC-M1-STAGE12-FRIDGE-HYGIENE-CEMENT-BATCH-AMENDMENT-001
related_tech_ids: RAW-IND-001-A, RAW-IND-001-B, NRG-HTR-001-B, SCI-LAB-001, CNS-CEM-001-A
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, RESTORE_MISSING_CHAINS, REBALANCE_COST
raised_at: M0正式全树续跑第二百一十五项事实审查
resolution_status: waiting_post_tree_review
```

## 后续写入规则

从下一项科技起，每次`fact_gate`结束必须在本账新增记录或明确`issue_tags: none`。无标签的通过不需要单独占一节；所有`pass_with_tree_review`、`return`和`blocked`必须登记。全部正文完成后，以本账为问题索引，但仍须覆盖未被标记的全部节点执行整树复审。

### IME-REM-001

```text
tech_id: IME-REM-001
current_name: 再制造清洗、尺寸恢复、复装与性能放行
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, SCALE_ERROR, PRODUCT_TYPE_ERROR, LOW_GAME_VALUE
issue_statement: 万能再制造无法覆盖不同设备对象。节点并入设备大修旧件再制造与专用产品路线，删除抽象总成和产线。
evidence: SPEC-M1-STAGE15-REMANUFACTURE-WORKSHOP-BRIDGE-ALLOY-CASTING-BATCH-AMENDMENT-001
related_tech_ids: RPR-OVH-001, RPR-REM-001, VEH-ENG-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_ABSTRACT_PRODUCTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百七十六项事实审查
resolution_status: waiting_post_tree_review
```

### IND-SIT-001

```text
tech_id: IND-SIT-001
current_name: 小型专业作坊布局与基础安全设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为专业作坊设计，支撑1000人阶段多品类小作坊的通用布局与安全边界，不解锁产品工艺或设备。
evidence: SPEC-M1-STAGE15-REMANUFACTURE-WORKSHOP-BRIDGE-ALLOY-CASTING-BATCH-AMENDMENT-001
related_tech_ids: CNS-SIT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百七十七项事实审查
resolution_status: waiting_post_tree_review
```

### LOG-BRG-001

```text
tech_id: LOG-BRG-001
current_name: 桥涵承载、限行与加固
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, OVERLAP_RISK, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, POINTS_REVIEW
issue_statement: 当前候选改为桥涵复核加固，位于旧桥初评和新建桥涵之后，实际复核与加固验收才改变通行等级。
evidence: SPEC-M1-STAGE15-REMANUFACTURE-WORKSHOP-BRIDGE-ALLOY-CASTING-BATCH-AMENDMENT-001
related_tech_ids: TLG-BRG-001, CNS-INF-001-B, CNS-STR-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百七十八项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-ALY-001

```text
tech_id: MAT-ALY-001
current_name: 常用铜铝合金成分、熔配与牌号控制
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, SCALE_ERROR, PRODUCT_TYPE_ERROR
issue_statement: 本汇总与ADC12再生铝H62黄铜CuSn10锡青铜三条已冻结路线完全重复，确认合并删除。
evidence: SPEC-M1-STAGE15-REMANUFACTURE-WORKSHOP-BRIDGE-ALLOY-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MAT-ALU-001, MET-NFR-001-C1, MET-NFR-001-C2
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_ABSTRACT_PRODUCT, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百七十九项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-CST-001

```text
tech_id: MAT-CST-001
current_name: 铸件浇注系统、补缩与缺陷检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, PRODUCT_IDENTITY_ERROR, POINTS_TOO_LOW
issue_statement: 当前候选收窄为铸钢件生产，交付ZG230-450通用铸钢毛坯，Q235B轧材牌号不再误用为铸钢。
evidence: SPEC-M1-STAGE15-REMANUFACTURE-WORKSHOP-BRIDGE-ALLOY-CASTING-BATCH-AMENDMENT-001
related_tech_ids: MET-IRN-001, MET-CAS-001-A, MET-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADE, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百八十项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-TIM-001

```text
tech_id: ICD-TIM-001
current_name: 统一时钟分发、漂移监测与校时
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, LEGACY_COMPONENT_DEPENDENCY
issue_statement: 当前候选改为统一时间基准，以SJ-A1设备组提供跨设备一致时间，多种分发通道可替代而非全选。
evidence: SPEC-M1-STAGE15-TIME-GEAR-PUMP-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: ELC-REC-001, ELC-CMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百七十一项事实审查
resolution_status: waiting_post_tree_review
```

### IME-FAT-001

```text
tech_id: IME-FAT-001
current_name: 设备出厂验收、负载测试与交付基线
fact_gate: return_merge
issue_tags: DUPLICATE_MILESTONE, LOW_GAME_VALUE, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 通用设备验收重复各产品定型与质量放行。节点合并删除，设备基线改为具体配置记录或状态。
evidence: SPEC-M1-STAGE15-TIME-GEAR-PUMP-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: QLT-SMP-001, QLT-UNI-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_FALSE_PRODUCT
raised_at: M0正式全树续跑第二百七十二项事实审查
resolution_status: waiting_post_tree_review
```

### IME-GER-001

```text
tech_id: IME-GER-001
current_name: 齿轮齿形、热处理、啮合与噪声检验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_RESOURCE_CHAIN, RESEARCH_COST_ERROR
issue_statement: 当前候选改为齿轮生产定型，以45钢直齿轮规格族提供互换传动件；45钢供应链仍缺失。
evidence: SPEC-M1-STAGE15-TIME-GEAR-PUMP-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: IME-MIL-001, MCH-GAG-001, MET-HTR-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_SERIES, RESTORE_MISSING_RESOURCE_CHAIN, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百七十三项事实审查
resolution_status: waiting_post_tree_review
```

### IME-MSA-001

```text
tech_id: IME-MSA-001
current_name: 测量系统能力、重复性与再现性评估
fact_gate: return_merge
issue_tags: LOW_GAME_VALUE, DUPLICATE_MILESTONE, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 测量系统评估是现有校准和质量检验的细化执行，没有独立玩家产物或选择，确认合并删除。
evidence: SPEC-M1-STAGE15-TIME-GEAR-PUMP-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: QLT-MET-001, QLT-SMP-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS, REMOVE_FALSE_PRODUCT
raised_at: M0正式全树续跑第二百七十四项事实审查
resolution_status: waiting_post_tree_review
```

### IME-PMP-001

```text
tech_id: IME-PMP-001
current_name: 离心泵系列化、密封、扬程与效率试验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, DUPLICATE_MILESTONE, RESEARCH_COST_ERROR
issue_statement: 当前候选改为通用离心泵定型，IS-A1首次形成完整泵，并吸收后续泵阀节点中的重复泵制造和性能试验。
evidence: SPEC-M1-STAGE15-TIME-GEAR-PUMP-QUALITY-BATCH-AMENDMENT-001
related_tech_ids: MCH-PMP-001-A, MCH-PMP-001-B, MCH-PMP-001-C, WSE-PMP-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, MERGE_DUPLICATES, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百七十五项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-ABX-001

```text
tech_id: HLT-ABX-001
current_name: 抗感染药敏、合理使用与耐药监测
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_MILESTONE, MISSING_RESOURCE_CHAIN, RESEARCH_COST_ERROR
issue_statement: 临床药敏不能生产抗感染药。当前候选只对实际库存药物形成适用限制与耐药状态，药房和药物供应链须另行恢复。
evidence: SPEC-M1-STAGE15-MEDICAL-COMPUTING-PRESSURE-BATCH-AMENDMENT-001
related_tech_ids: HLT-LAB-001, HLT-PHM-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_FALSE_PRODUCT, RESTORE_MISSING_CHAINS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百六十六项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-BLD-001

```text
tech_id: HLT-BLD-001
current_name: 血型检验、供血筛查、储存与输血安全
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选改为输血安全管理，区分供血筛查全血单位血库设施配血与输注记录，科研不自动产生血液或血库。
evidence: SPEC-M1-STAGE15-MEDICAL-COMPUTING-PRESSURE-BATCH-AMENDMENT-001
related_tech_ids: MED-IPC-001, HLT-LAB-001, MCH-REF-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百六十七项事实审查
resolution_status: waiting_post_tree_review
```

### HLT-NEO-001

```text
tech_id: HLT-NEO-001
current_name: 新生儿复苏、保温、喂养与危险征象监测
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选收敛为新生儿初级照护，照护用品删除为抽象产品，照护位改容量，实际患者经照护后才形成状态。
evidence: SPEC-M1-STAGE15-MEDICAL-COMPUTING-PRESSURE-BATCH-AMENDMENT-001
related_tech_ids: MED-IPC-001, MED-MAT-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REMOVE_ABSTRACT_PRODUCT, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百六十八项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-CMP-001

```text
tech_id: ICD-CMP-001
current_name: 标准计算设备整机组装与硬件验收
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选改为计算设备组装，以遗产或贸易模块形成JS-A1统一整机；装配线验收基线不再误作产品，也不假设芯片制造。
evidence: SPEC-M1-STAGE15-MEDICAL-COMPUTING-PRESSURE-BATCH-AMENDMENT-001
related_tech_ids: ELC-DIG-001, ICD-EMC-001, ICD-LAN-001, ICD-STO-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, MOVE_STAGE, REBALANCE_COST
raised_at: M0正式全树续跑第二百六十九项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-PRS-001

```text
tech_id: ICD-PRS-001
current_name: 压力仪表结构、过压保护与校准
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选改为压力仪表定型，交付P-A1工业压力表；压力校准和过压验收改为行动与记录。
evidence: SPEC-M1-STAGE15-MEDICAL-COMPUTING-PRESSURE-BATCH-AMENDMENT-001
related_tech_ids: MCH-BAS-001, QLT-MET-001, ICD-FLW-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百七十项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-INF-001

```text
tech_id: CNS-INF-001
current_name: 道路、桥涵、管沟与公共基础工程
fact_gate: return_split_merge
issue_tags: OVERBROAD_TECH_IDENTITY, DUPLICATE_MILESTONE, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 道路桥涵管沟是三个独立工程对象。道路并回既有路线，原节点恢复为桥涵工程设计和综合管沟设计两项。
evidence: SPEC-M1-STAGE15-INFRASTRUCTURE-DATA-CABLE-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: LOG-RDS-001, TLG-PAV-001, CNS-INF-001-B, CNS-INF-001-C
blocks_prose: false
provisional_post_review_action: SPLIT, MERGE_ROAD_SCOPE, RETYPE_OUTPUTS, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百六十一项事实审查
resolution_status: waiting_post_tree_review
```

### DIP-INT-001

```text
tech_id: DIP-INT-001
current_name: 势力人口、生产、需求与内部意见档案
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为外部势力档案，所有内容保留来源可信度时效和矛盾状态，科研不自动获得真实情报。
evidence: SPEC-M1-STAGE15-INFRASTRUCTURE-DATA-CABLE-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: DIP-CON-001, SCI-ARC-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百六十二项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-CAB-001-A

```text
tech_id: ELC-CAB-001-A
current_name: 绝缘线缆制造
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, STAGE_ORDER_ERROR, MISSING_RESOURCE_CHAIN
issue_statement: 当前候选保留BV低压电线VV动力电缆和KVV控制电缆的共享工艺平台，但必须后移到T2铜与线缆级绝缘护套材料之后。
evidence: SPEC-M1-STAGE15-INFRASTRUCTURE-DATA-CABLE-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: MAT-COP-001, CHM-POL-001, CHM-INS-001-A
blocks_prose: false
provisional_post_review_action: MOVE_STAGE, REWIRE_PREREQUISITE, ADD_PRODUCT_SPECS, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第二百六十三项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-DIG-001

```text
tech_id: ELC-DIG-001
current_name: 本地计算与数据服务
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, OVERBROAD_TECH_IDENTITY, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选收窄为计算设备修复，只恢复遗产设备与本地算力；网络备份存储和标准设备组装分别归专门节点。
evidence: SPEC-M1-STAGE15-INFRASTRUCTURE-DATA-CABLE-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, ELC-CMP-001, ICD-LAN-001, ICD-STO-001, ICD-CMP-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REBALANCE_COST, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百六十四项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-BES-001

```text
tech_id: ENE-BES-001
current_name: 站级蓄电池储能功率控制、均衡与消防方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, LEGACY_COMPONENT_DEPENDENCY
issue_statement: 当前候选限定遗产电池路线，实际容量衰减批次差异和故障隔离均保留；节点不制造电芯不恢复容量。
evidence: SPEC-M1-STAGE15-INFRASTRUCTURE-DATA-CABLE-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: NRG-STO-001, ELC-CTL-001-B, ENE-ISL-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百六十五项事实审查
resolution_status: waiting_post_tree_review
```

### VEH-MOT-001

```text
tech_id: VEH-MOT-001
current_name: 摩托车底盘、动力匹配与野外维护
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, MODEL_NAME_ERROR, MILITARY_SCOPE_ERROR
issue_statement: 当前候选改为摩托车定型，只交付MT-A1民用轻型平台；军用配置由后继派生，不重复生成两个基础平台。
evidence: SPEC-M1-STAGE14-MOTORCYCLE-WATER-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: VEH-BIC-001, VEH-ENG-001, MIL-EQP-012
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, NARROW_SCOPE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百五十六项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-PMP-001

```text
tech_id: WSE-PMP-001
current_name: 取水泵站水力、汽蚀与备用机组设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, MISSING_PRODUCT_CHAIN
issue_statement: 当前候选改为取水泵站设计，交付BS-A1设备组；LJ-A1试验叶轮不是完整水泵，完整离心泵产品链仍需补齐。
evidence: SPEC-M1-STAGE14-MOTORCYCLE-WATER-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: WTR-RAW-001-A, MCH-PMP-001-C
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, RESTORE_MISSING_PRODUCT_CHAIN
raised_at: M0正式全树续跑第二百五十七项事实审查
resolution_status: waiting_post_tree_review
```

### WSE-TNK-001

```text
tech_id: WSE-TNK-001
current_name: 清水池、高位储罐与防二次污染设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选收窄为清水储存设计，以SG-A1储罐清水池和高位设施承担储水实体，不重复配水追溯。
evidence: SPEC-M1-STAGE14-MOTORCYCLE-WATER-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: WTR-POT-001, CNS-STR-001, WTR-STO-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, NARROW_SCOPE
raised_at: M0正式全树续跑第二百五十八项事实审查
resolution_status: waiting_post_tree_review
```

### WTR-STO-001

```text
tech_id: WTR-STO-001
current_name: 清水储存、分区配水与批次追溯
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, DUPLICATE_SCOPE, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为分区配水追溯，只承担储水后的流向追踪和区域隔离，配水区改为区域状态。
evidence: SPEC-M1-STAGE14-MOTORCYCLE-WATER-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: WSE-TNK-001, WSE-HYD-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百五十九项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-CEM-001-C

```text
tech_id: CNS-CEM-001-C
current_name: 砂浆配合比控制
fact_gate: pass_with_tree_review
issue_tags: TYPE_MISMATCH, GENERIC_PRODUCT_ERROR, DUPLICATE_SCOPE, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR, POINT_SCALE_ERROR
issue_statement: 当前候选改为水泥砂浆配制，以M5砌筑和M10抹灰两个用途批次替代抽象砂浆产品，并与石灰砂浆并行。
evidence: SPEC-M1-STAGE14-MOTORCYCLE-WATER-MORTAR-BATCH-AMENDMENT-001
related_tech_ids: CNS-CEM-001-B, CNS-CEM-001-A
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_GRADES, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百六十项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-SFT-001

```text
tech_id: SOC-SFT-001
current_name: 岗位危险识别、个人防护与事故预防
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, TYPE_MISMATCH
issue_statement: 当前候选改为职业安全管理，以岗位风险防护和停工状态形成跨行业能力，并与劳动法施工安全和产品质量分层。
evidence: SPEC-M1-STAGE14-SAFETY-TRAINING-TRANSPORT-ROAD-BATCH-AMENDMENT-001
related_tech_ids: CNS-SIT-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REMOVE_FALSE_PRODUCT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百五十一项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-TEC-001

```text
tech_id: SOC-TEC-001
current_name: 工业、农业、医疗与行政职业课程标准
fact_gate: return_demote_delete
issue_tags: NOT_RESEARCH_TECH, SCALE_ERROR, ADMIN_DETAIL, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, TYPE_MISMATCH
issue_statement: 玩家无需研究四专业课程目录。课程框架版本与训练班下沉教育组织，实际技能由学徒训练和岗位资格系统承接。
evidence: SPEC-M1-STAGE14-SAFETY-TRAINING-TRANSPORT-ROAD-BATCH-AMENDMENT-001
related_tech_ids: SOC-APR-001, SOC-CRT-001
blocks_prose: true
provisional_post_review_action: DEMOTE_DELETE, REWIRE_DEPENDENTS, REMOVE_FALSE_PRODUCTS
raised_at: M0正式全树续跑第二百五十二项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-HAZ-001

```text
tech_id: TLG-HAZ-001
current_name: 危险品车辆、容器、路线与应急隔离
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, GENERIC_PRODUCT_ERROR
issue_statement: 当前候选改为危险品运输，只形成相容装载路线和事故隔离能力；不同危险品容器由具体产品路线供应。
evidence: SPEC-M1-STAGE14-SAFETY-TRAINING-TRANSPORT-ROAD-BATCH-AMENDMENT-001
related_tech_ids: CHM-LAB-001, LOG-WHS-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_GENERIC_PRODUCT, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百五十三项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-LIC-001

```text
tech_id: TLG-LIC-001
current_name: 驾驶资格、车型签注与复训方法
fact_gate: return_demote_delete
issue_tags: NOT_RESEARCH_TECH, ADMIN_DETAIL, DUPLICATE_MILESTONE, PREREQUISITE_ERROR, AUTO_INSTANCE_ERROR
issue_statement: 驾驶资格属于法律资格和运输训练运行，不是科研突破。节点下沉删除，玩家继续管理合格驾驶员和暂停状态。
evidence: SPEC-M1-STAGE14-SAFETY-TRAINING-TRANSPORT-ROAD-BATCH-AMENDMENT-001
related_tech_ids: SOC-CRT-001, TLG-HAZ-001, TLG-MHE-001
blocks_prose: true
provisional_post_review_action: DEMOTE_DELETE, REWIRE_DEPENDENTS, REMOVE_AUTO_INSTANCE
raised_at: M0正式全树续跑第二百五十四项事实审查
resolution_status: waiting_post_tree_review
```

### TLG-PAV-001

```text
tech_id: TLG-PAV-001
current_name: 级配路基、稳定基层与耐久路面设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, GENERIC_PRODUCT_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: 当前候选改为道路结构设计，首代限定水泥稳定基层和水泥混凝土路面，不开放抽象道路材料或缺链沥青路线。
evidence: SPEC-M1-STAGE14-SAFETY-TRAINING-TRANSPORT-ROAD-BATCH-AMENDMENT-001
related_tech_ids: LOG-RDS-001, CNS-CEM-001-D
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, REMOVE_GENERIC_PRODUCT, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百五十五项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EXT-041

```text
tech_id: MIL-EXT-041
current_name: “听地”地面监视雷达（地监—01）总体设计
fact_gate: return_defer
issue_tags: STAGE_ORDER_ERROR, PREREQUISITE_ERROR, MISSING_MILESTONE, MISSING_COMPONENT_CHAIN, UNLOCK_MISMATCH, MODEL_NAME_ERROR
issue_statement: 普通无线电和电磁兼容不足以推出雷达。节点后移，等待完整射频振荡接收扫描信号处理显示标定和精密制造链。
evidence: SPEC-M1-STAGE14-QUALITY-REPAIR-APPLIANCE-RADAR-BATCH-AMENDMENT-001
related_tech_ids: ELC-RAD-001, ICD-EMC-001, MIL-EXT-042, MIL-EXT-051
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_COMPONENT_CHAIN, REMOVE_PREMATURE_MODEL, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百四十六项事实审查
resolution_status: waiting_post_tree_review
```

### QLT-NCR-001

```text
tech_id: QLT-NCR-001
current_name: 不合格品隔离、返工与降级使用
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为不合格品处置，质量检验负责判定，本项负责隔离返工降级报废及批次去向。
evidence: SPEC-M1-STAGE14-QUALITY-REPAIR-APPLIANCE-RADAR-BATCH-AMENDMENT-001
related_tech_ids: QLT-SMP-001, QLT-TRC-001, QLT-RCL-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百四十七项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-SHP-001

```text
tech_id: RPR-SHP-001
current_name: 综合维修工场组织
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 当前候选改为维修工场组织，综合工场是机械电气车辆专业工区的小规模共址形式，扩建后可独立分场。
evidence: SPEC-M1-STAGE14-QUALITY-REPAIR-APPLIANCE-RADAR-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, MCH-LAT-001, RPR-OVH-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REMOVE_AUTO_INSTANCES, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百四十八项事实审查
resolution_status: waiting_post_tree_review
```

### RPR-SPR-001

```text
tech_id: RPR-SPR-001
current_name: 备件储备与替换组织
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, AUTO_INSTANCE_ERROR
issue_statement: 八类备件池被误作产品。当前候选改为备件库存组织，以分类最低库存相容替换和缺货状态管理实际备件。
evidence: SPEC-M1-STAGE14-QUALITY-REPAIR-APPLIANCE-RADAR-BATCH-AMENDMENT-001
related_tech_ids: LOG-WHS-001, RPR-DIA-001, RPR-OVH-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REMOVE_ABSTRACT_PRODUCT, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百四十九项事实审查
resolution_status: waiting_post_tree_review
```

### SOC-APP-001

```text
tech_id: SOC-APP-001
current_name: 家用电器通用电气安全设计标准
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_SCOPE
issue_statement: R6以安全标准自动开放三类家电。当前候选改为三款家电定型的共同上游安全标准，不替代各自产品边界。
evidence: SPEC-M1-STAGE14-QUALITY-REPAIR-APPLIANCE-RADAR-BATCH-AMENDMENT-001
related_tech_ids: CIV-LGT-001, QLT-SMP-001, CIV-APP-001-A, CIV-APP-001-B, CIV-APP-001-C
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, MOVE_STAGE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百五十项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ROL-001-D

```text
tech_id: MET-ROL-001-D
current_name: 标准棒材生产
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 当前候选收窄为标准钢棒生产，以Q235B圆钢承接热轧及可选冷拉交付状态，不覆盖其他材料和成品轴件。
evidence: SPEC-M1-STAGE14-STEEL-PRODUCTS-MILITARY-EQUIPMENT-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-A, MET-ROL-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, ADD_PRODUCT_GRADE
raised_at: M0正式全树续跑第二百四十一项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ROL-001-E

```text
tech_id: MET-ROL-001-E
current_name: 标准线材生产
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, GENERATION_SCOPE_ERROR
issue_statement: 当前候选收窄为热轧盘条生产，只交付Q235B盘条；冷拉钢丝与有色导线留给具体后继。
evidence: SPEC-M1-STAGE14-STEEL-PRODUCTS-MILITARY-EQUIPMENT-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-A, MET-ROL-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, ADD_PRODUCT_GRADE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百四十二项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-004

```text
tech_id: MIL-EQP-004
current_name: “短弧”轻型迫击支援武器（曲火—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, MODEL_NAME_ERROR, MISSING_MILESTONE
issue_statement: 当前候选改为轻型迫击炮定型，交付QP-A1型60毫米迫击炮；独立弹药里程碑仍缺失，武器定型不等于稳定补给。
evidence: SPEC-M1-STAGE14-STEEL-PRODUCTS-MILITARY-EQUIPMENT-BATCH-AMENDMENT-001
related_tech_ids: MCH-GAG-001, MET-HTR-001, QLT-SMP-001
blocks_prose: false
provisional_post_review_action: RENAME, REPLACE_MODEL, REWIRE_PREREQUISITE, RESTORE_MISSING_MILESTONE
raised_at: M0正式全树续跑第二百四十三项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-006

```text
tech_id: MIL-EQP-006
current_name: “开楔”近程反装甲武器（反装—01）
fact_gate: return_defer
issue_tags: NAME_TOO_LONG, MODEL_NAME_ERROR, PREREQUISITE_ERROR, MISSING_MILESTONE, MISSING_AMMUNITION_CHAIN, STAGE_ORDER_ERROR
issue_statement: 当前工业只能支撑部分发射器机械件，无法推出聚能反装甲弹药。节点退回后移，待完整弹药设计制造和实弹验收链成立后恢复。
evidence: SPEC-M1-STAGE14-STEEL-PRODUCTS-MILITARY-EQUIPMENT-BATCH-AMENDMENT-001
related_tech_ids: MIL-TACTIC-009
blocks_prose: true
provisional_post_review_action: DEFER, RESTORE_MISSING_AMMUNITION_CHAIN, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百四十四项事实审查
resolution_status: waiting_post_tree_review
```

### MIL-EQP-010

```text
tech_id: MIL-EQP-010
current_name: “联声”班组与车载通信设备套装（军通—01）
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, MODEL_NAME_ERROR
issue_statement: 当前候选改为军用通信集成，以WXB-A1电台核心形成JT-A1班组车载套装，新增军用供电接口抗振与携行能力。
evidence: SPEC-M1-STAGE14-STEEL-PRODUCTS-MILITARY-EQUIPMENT-BATCH-AMENDMENT-001
related_tech_ids: ICD-POR-001, ICD-EMC-001, ICD-RPT-001
blocks_prose: false
provisional_post_review_action: RENAME, REPLACE_MODEL, REWIRE_PREREQUISITE, NARROW_SCOPE
raised_at: M0正式全树续跑第二百四十五项事实审查
resolution_status: waiting_post_tree_review
```

### MED-IPC-001

```text
tech_id: MED-IPC-001
current_name: 清洁、消毒、隔离与医疗感染控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 当前候选收敛为医疗感染控制，诊疗分区器具消毒和患者隔离构成同一传播阻断闭环；区域类型和状态不再误作记录。
evidence: SPEC-M1-STAGE13-MEDICAL-FORGING-ROLLING-BATCH-AMENDMENT-001
related_tech_ids: MED-TRI-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百三十六项事实审查
resolution_status: waiting_post_tree_review
```

### MET-FOR-001

```text
tech_id: MET-FOR-001
current_name: 加热锻造、压力成形与纤维流线控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: R6荒谬开放产品压力。当前候选恢复通用锻件生产，交付Q235B通用锻件毛坯并吸收已删重复节点。
evidence: SPEC-M1-STAGE13-MEDICAL-FORGING-ROLLING-BATCH-AMENDMENT-001
related_tech_ids: MAT-BLT-001, MET-HTR-001, IME-PRS-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_GRADE, MERGE_DUPLICATE
raised_at: M0正式全树续跑第二百三十七项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ROL-001-A

```text
tech_id: MET-ROL-001-A
current_name: 金属轧制
fact_gate: pass_with_tree_review
issue_tags: SCOPE_ERROR, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 泛金属轧制没有真实产品边界。当前候选收窄为钢坯初轧，以Q235B钢锭形成可追溯普通钢坯内部批次。
evidence: SPEC-M1-STAGE13-MEDICAL-FORGING-ROLLING-BATCH-AMENDMENT-001
related_tech_ids: MAT-BLT-001, MET-ROL-001-C, MET-ROL-001-D, MET-ROL-001-E
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百三十八项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ROL-001-B

```text
tech_id: MET-ROL-001-B
current_name: 金属拉拔
fact_gate: return_merge_delete
issue_tags: ABSTRACT_MILESTONE, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: 拉拔没有独立战略产品和玩家决策，当前确认合并删除，由标准棒材和标准线材按各自产品吸收设备模具润滑与退火条件。
evidence: SPEC-M1-STAGE13-MEDICAL-FORGING-ROLLING-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-D, MET-ROL-001-E
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_ABSTRACT_PRODUCT, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百三十九项事实审查
resolution_status: waiting_post_tree_review
```

### MET-ROL-001-C

```text
tech_id: MET-ROL-001-C
current_name: 标准板材生产
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: 当前候选收窄为标准钢板生产，交付按规格和炉批登记的Q235B热轧钢板，不再以抽象标准板材覆盖所有金属。
evidence: SPEC-M1-STAGE13-MEDICAL-FORGING-ROLLING-BATCH-AMENDMENT-001
related_tech_ids: MET-ROL-001-A
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百四十项事实审查
resolution_status: waiting_post_tree_review
```

### IME-PRS-001

```text
tech_id: IME-PRS-001
current_name: 压力机机架、滑块、模具接口与安全保护
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_ERROR
issue_statement: 当前候选收窄为开式压力机定型，交付YA-A1型630千牛开式压力机；冲压模具工艺和热锻设备保持独立。
evidence: SPEC-M1-STAGE13-PRESS-STEEL-COPPER-VALVE-BATCH-AMENDMENT-001
related_tech_ids: MCH-GAG-001, ELC-CTL-001-A, MCH-FRM-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百三十一项事实审查
resolution_status: waiting_post_tree_review
```

### IME-VLV-001

```text
tech_id: IME-VLV-001
current_name: 工业阀门系列、密封等级与压力试验
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: 当前候选收窄为既有工业阀门检验，与后续新阀门设计和制造分层，实际检验只形成状态与记录。
evidence: SPEC-M1-STAGE13-PRESS-STEEL-COPPER-VALVE-BATCH-AMENDMENT-001
related_tech_ids: RPR-DIA-001, MCH-VLV-001-A, MCH-PMP-001-B
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百三十二项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-BLT-001

```text
tech_id: MAT-BLT-001
current_name: 钢坯连贯浇注、缩孔控制与批次切分
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, SCOPE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_ERROR
issue_statement: 当前设备链不能支持连续铸钢，候选收窄为钢锭模铸，以Q235B钢液形成可追溯普通钢锭中间批次。
evidence: SPEC-M1-STAGE13-PRESS-STEEL-COPPER-VALVE-BATCH-AMENDMENT-001
related_tech_ids: MET-IRN-001, MET-ROL-001-A, MET-FOR-001
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百三十三项事实审查
resolution_status: waiting_post_tree_review
```

### MAT-COP-001

```text
tech_id: MAT-COP-001
current_name: 铜电解、火法精炼与导电性能控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCALE_ERROR, RESEARCH_COST_ERROR
issue_statement: 当前候选改为导电铜精炼，95%再生粗铜经阳极精炼和电解形成T2导电铜，酸电力和耐蚀设备必须实际供应。
evidence: SPEC-M1-STAGE13-PRESS-STEEL-COPPER-VALVE-BATCH-AMENDMENT-001
related_tech_ids: MET-NFR-001-A
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, ADD_PRODUCT_GRADE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百三十四项事实审查
resolution_status: waiting_post_tree_review
```

### MCH-VLV-001-A

```text
tech_id: MCH-VLV-001-A
current_name: 阀门与密封结构设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, DUPLICATE_MILESTONE
issue_statement: 当前候选保留为新阀门结构设计，定型J41H-16C截止阀与H44H-16C止回阀；既有阀门检验和后续批产分别独立。
evidence: SPEC-M1-STAGE13-PRESS-STEEL-COPPER-VALVE-BATCH-AMENDMENT-001
related_tech_ids: IME-VLV-001, MCH-GAG-001, MCH-PMP-001-B, MCH-PMP-001-C
blocks_prose: false
provisional_post_review_action: RENAME, NARROW_SCOPE, ADD_PRODUCT_MODELS, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百三十五项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-SWX-001

```text
tech_id: ICD-SWX-001
current_name: 有线电话交换、编号与呼叫路由方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: 当前候选压缩为有线电话交换，以JH-A1设备组建立本地编号与路由；区域骨干仍由区域有线通信承担。
evidence: SPEC-M1-STAGE13-TELEPHONE-BEARING-MACHINE-TOOLS-BATCH-AMENDMENT-001
related_tech_ids: ELC-WIR-001, ICD-LNE-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十六项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-VLT-001

```text
tech_id: ICD-VLT-001
current_name: 电压电流仪表量程、精度与安全隔离
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: 阶段九的电工仪表制造已交付V-A1电压表与A-A1电流表并覆盖量程精度隔离校准，本节点无新增玩家能力，确认合并删除。
evidence: SPEC-M1-STAGE13-TELEPHONE-BEARING-MACHINE-TOOLS-BATCH-AMENDMENT-001
related_tech_ids: ELC-INS-001
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百二十七项事实审查
resolution_status: waiting_post_tree_review
```

### IME-BRG-001

```text
tech_id: IME-BRG-001
current_name: 滚动轴承套圈、滚动体、热处理与游隙控制
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, RESEARCH_COST_ERROR, DUPLICATE_MILESTONE, MISSING_MATERIAL_CHAIN
issue_statement: 当前候选收敛三处重复轴承里程碑，形成6200深沟球与30200圆锥滚子轴承生产；稳定轴承钢链仍缺失。
evidence: SPEC-M1-STAGE13-TELEPHONE-BEARING-MACHINE-TOOLS-BATCH-AMENDMENT-001
related_tech_ids: MCH-GAG-001, MET-HTR-001, QLT-SMP-001, MCH-STD-001-C, Y2-PROD-MCH-004
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_SERIES, MERGE_DUPLICATES, RESTORE_MISSING_RESOURCE_CHAIN, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十八项事实审查
resolution_status: waiting_post_tree_review
```

### IME-DRL-001

```text
tech_id: IME-DRL-001
current_name: 标准钻床立柱、主轴与进给设计
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: 当前候选改为标准钻床定型，交付ZA-A1立式钻床；首批加工由遗产机床承担，避免新机床自循环。
evidence: SPEC-M1-STAGE13-TELEPHONE-BEARING-MACHINE-TOOLS-BATCH-AMENDMENT-001
related_tech_ids: MET-CAS-001-A, MCH-GAG-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十九项事实审查
resolution_status: waiting_post_tree_review
```

### IME-MIL-001

```text
tech_id: IME-MIL-001
current_name: 标准铣床导轨、主轴、工作台与整机验收
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_ERROR
issue_statement: 当前候选改为标准铣床定型，交付XA-A1升降台铣床；不与其他新机床互设前置，也不包含齿轮专用能力。
evidence: SPEC-M1-STAGE13-TELEPHONE-BEARING-MACHINE-TOOLS-BATCH-AMENDMENT-001
related_tech_ids: MET-CAS-001-A, MCH-GAG-001, IME-GER-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百三十项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-CTL-001-C

```text
tech_id: ELC-CTL-001-C
current_name: 安全联锁设计
fact_gate: return_merge_delete
issue_tags: DUPLICATE_MILESTONE, PRODUCT_ARCHITECTURE_ERROR, UNLOCK_MISMATCH, LOW_GAME_VALUE
issue_statement: 节点与继电控制和可编程控制中的联锁能力重复，且不存在独立安全仪表硬件链。当前确认合并删除，不保留抽象安全联锁产品。
evidence: SPEC-M1-STAGE13-CONTROL-GRID-NETWORK-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: ELC-CTL-001-A, ELC-CTL-001-B
blocks_prose: true
provisional_post_review_action: MERGE_DELETE, REMOVE_ABSTRACT_PRODUCT, REWIRE_DEPENDENTS
raised_at: M0正式全树续跑第二百二十一项事实审查
resolution_status: waiting_post_tree_review
```

### ENE-ISL-001

```text
tech_id: ENE-ISL-001
current_name: 电网孤岛运行、黑启动与逐级恢复方法
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: 当前候选压缩为电网孤岛恢复，承接并联运行和负载调度；科研只开放方案和行动，实际启动才改变电网状态。
evidence: SPEC-M1-STAGE13-CONTROL-GRID-NETWORK-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: ENE-GEN-002-B, NRG-DSP-001, ENE-BES-001
blocks_prose: false
provisional_post_review_action: RENAME, REWIRE_PREREQUISITE, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十二项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-LAN-001

```text
tech_id: ICD-LAN-001
current_name: 本地网络地址、交换、布线与故障隔离
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6将设备组能力和日志混写。当前候选以WL-A1设备组与布线工程形成本地数据网络，并限制故障到具体网段。
evidence: SPEC-M1-STAGE13-CONTROL-GRID-NETWORK-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: ELC-WIR-001, ICD-CMP-001, ICD-STO-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE
raised_at: M0正式全树续跑第二百二十三项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-RPT-001

```text
tech_id: ICD-RPT-001
current_name: 无线电中继、覆盖测量与盲区补偿
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, UNLOCK_MISMATCH, MODEL_ID_CONFLICT, RESEARCH_COST_REVIEW
issue_statement: 当前候选以WZ-A1无线中继设备组建立无线中继覆盖，避开ZJ-A1有线中继型号并区分设备建站测量与盲区工程。
evidence: SPEC-M1-STAGE13-CONTROL-GRID-NETWORK-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: ELC-RAD-001, ICD-LNE-001
blocks_prose: false
provisional_post_review_action: RENAME, ADD_PRODUCT_MODEL, RETYPE_OUTPUTS, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十四项事实审查
resolution_status: waiting_post_tree_review
```

### ICD-STO-001

```text
tech_id: ICD-STO-001
current_name: 数据存储介质分级、备份与恢复验证
fact_gate: pass_with_tree_review
issue_tags: NAME_TOO_LONG, PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH, RESEARCH_COST_REVIEW
issue_statement: R6把备份库误作产品并混淆副本存在与可恢复。当前候选以CC-A1设备组支撑备份，只有恢复验证成功才形成有效备份状态。
evidence: SPEC-M1-STAGE13-CONTROL-GRID-NETWORK-STORAGE-BATCH-AMENDMENT-001
related_tech_ids: ICD-CMP-001, SCI-ARC-001, ICD-LAN-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, REBALANCE_COST
raised_at: M0正式全树续跑第二百二十五项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-SIT-001

```text
tech_id: CNS-SIT-001
current_name: 标准工地组织与施工安全
fact_gate: pass_with_tree_review
issue_tags: TYPE_MISMATCH, UNLOCK_MISMATCH, PREREQUISITE_ERROR
issue_statement: R6把具体工程的标准工地误作固定数量记录。当前候选改为施工安全组织，科研建立岗位交接和停工规则，标准工地只作为实际工程状态。
evidence: SPEC-M1-STAGE12-CONSTRUCTION-CONTACT-CONTROL-BATCH-AMENDMENT-001
related_tech_ids: CNS-SUR-001-A, CNS-STR-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百一十六项事实审查
resolution_status: waiting_post_tree_review
```

### CNS-STR-001

```text
tech_id: CNS-STR-001
current_name: 建筑结构设计
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH, SCOPE_ERROR, RESEARCH_COST_REVIEW
issue_statement: R6将一般结构设计与所有灾害专项合并，并用结构钢限制所有材料路线。当前候选保留一般荷载连接和加固，专项抗灾另行恢复。
evidence: SPEC-M1-STAGE12-CONSTRUCTION-CONTACT-CONTROL-BATCH-AMENDMENT-001
related_tech_ids: CNS-SUR-001-B, QLT-UNI-001
blocks_prose: false
provisional_post_review_action: NARROW_SCOPE, REWIRE_PREREQUISITE, REMOVE_ABSTRACT_UNLOCKS, REBALANCE_COST
raised_at: M0正式全树续跑第二百一十七项事实审查
resolution_status: waiting_post_tree_review
```

### DIP-CON-001

```text
tech_id: DIP-CON-001
current_name: 外部信号识别、安全接触与代表确认
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, UNLOCK_MISMATCH
issue_statement: R6把无线电和多条路线同时设为强制条件。当前候选改为外部接触核验，无线电、信使和现场会面成为按接触方式选择的实体条件。
evidence: SPEC-M1-STAGE12-CONSTRUCTION-CONTACT-CONTROL-BATCH-AMENDMENT-001
related_tech_ids: ELC-RAD-001, LOG-RTE-001, DIP-INT-001
blocks_prose: false
provisional_post_review_action: RENAME, REMOVE_FORCED_PREREQUISITES, RETYPE_OUTPUTS, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百一十八项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-CTL-001-A

```text
tech_id: ELC-CTL-001-A
current_name: 继电控制
fact_gate: pass_with_tree_review
issue_tags: PREREQUISITE_ERROR, TYPE_MISMATCH, UNLOCK_MISMATCH
issue_statement: R6将继电控制柜误作记录且未给产品身份。当前候选交付JK-A1型继电控制柜，范围限于固定顺序联锁急停与有限反馈。
evidence: SPEC-M1-STAGE12-CONSTRUCTION-CONTACT-CONTROL-BATCH-AMENDMENT-001
related_tech_ids: ELC-CMP-001, NRG-GRD-001, ELC-CTL-001-B
blocks_prose: false
provisional_post_review_action: RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, REWIRE_PREREQUISITE, AUDIT_DEPENDENTS
raised_at: M0正式全树续跑第二百一十九项事实审查
resolution_status: waiting_post_tree_review
```

### ELC-CTL-001-B

```text
tech_id: ELC-CTL-001-B
current_name: 可编程逻辑设计
fact_gate: pass_with_tree_review
issue_tags: TECH_IDENTITY_MISMATCH, TYPE_MISMATCH, PREREQUISITE_ERROR, UNLOCK_MISMATCH, MISSING_HARDWARE_CHAIN
issue_statement: R6把可编程逻辑误作库存产品且未交代控制器来源。当前候选改为可编程控制设计，以遗产控制器集成KZ-A1控制柜并保留本地控制器制造缺口。
evidence: SPEC-M1-STAGE12-CONSTRUCTION-CONTACT-CONTROL-BATCH-AMENDMENT-001
related_tech_ids: ELC-CTL-001-A, ELC-DIG-001
blocks_prose: false
provisional_post_review_action: RENAME, RETYPE_OUTPUTS, ADD_PRODUCT_MODEL, ADD_RESOURCE_CONDITION, RESTORE_MISSING_RESOURCE_CHAIN
raised_at: M0正式全树续跑第二百二十项事实审查
resolution_status: waiting_post_tree_review
```

## 整树复审确定性裁决覆盖表

本节是正文逐项审查完成后的整树裁决。若早期条目的`provisional_post_review_action`或`resolution_status`与本节冲突，以本节为准。

| 稳定ID | 最终事实门 | 最终处置 | 点数处理 | 最终问题标签 |
|---|---|---|---:|---|
| `POP-AGE-001` | `return_demote` | 下沉为人口年龄推进与劳动资格运行规则 | 30点回池 | `LOW_GAME_VALUE`、`DEMOTE_REQUIRED` |
| `POP-MIG-001` | `return_demote` | 下沉为迁居、派驻与迁出行动 | 45点回池 | `LOW_GAME_VALUE`、`DEMOTE_REQUIRED` |
| `POP-MCH-001` | `return_merge_demote` | 登记并入人口总账，医疗照护归孕产路线 | 80点回池 | `DUPLICATE_MILESTONE`、`DEMOTE_REQUIRED` |
| `POP-REF-A02` | `return_demote_merge` | 临时安置归入境接纳与营地运行，技能核验读取岗位资格 | 55点回池 | `LOW_GAME_VALUE`、`DEMOTE_REQUIRED` |
| `RAW-GEO-001-A` | `pass` | 吸收露头编录与资源候选区划定 | 保留30点 | 无 |
| `RAW-GEO-001-B` | `return_merge` | 合并入`RAW-GEO-001-A` | 40点回池 | `LOW_GAME_VALUE`、`MERGE_REQUIRED` |
| `RAW-GEO-001-C` | `return_merge` | 合并入`RAW-GEO-001-A` | 30点回池 | `DUPLICATE_MILESTONE`、`MERGE_REQUIRED` |
| `FOD-CTL-001-B` | `defer` | 营养液、循环供氧和监测链闭合后再开放 | 30点后移 | `MISSING_RESOURCE_CHAIN`、`STAGE_ERROR` |
| `CHM-CLN-001-B` | `defer` | 表面活性剂与助剂供应链闭合后再开放 | 60点后移 | `MISSING_RESOURCE_CHAIN`、`STAGE_ERROR` |
| `HLT-IVF-001-A` | `defer` | 注射用水、无菌容器与洁净灌装链闭合后再开放 | 100点后移 | `MISSING_RESOURCE_CHAIN`、`MISSING_MILESTONE`、`STAGE_ERROR` |
| `AGR-BIO-001` | `pass` | 恢复动物来源核验里程碑 | 35点当前有效 | `RESTORED_MILESTONE` |
| `AGR-POU-001` | `pass` | 恢复家禽养殖里程碑 | 50点当前有效 | `RESTORED_MILESTONE` |
| `AGR-LIV-001` | `pass` | 恢复家畜养殖里程碑 | 60点当前有效 | `RESTORED_MILESTONE` |

型号冲突最终改名：远程计量终端`JL-A1 → YC-A1`；六十毫米迫击炮弹`PD-A1 → PD-60A1`；车载近程防空系统`JF-A1 → FK-A1`；近程防空导弹`JF-D1 → FK-D1`；轻型武装直升机`WZ-A1 → ZH-A1`；履带式装甲障碍清理车`ZG-A1 → GC-A1`。原型号分别保留给工业记录仪、低压配电柜、家用风扇、无线电中继设备组和昼间侦察观察组。

资源链最终边界：纯碱、锌、锡、电工钢片、漆包铜绕组线、绕组浸渍绝缘料及高铝原料在当前两年终局均作为遗产回收、拆取检验、贸易或已有明确节点的实际合格批次，不新增未经R7逐项审查的本地生产科技；相关产物保持`CONDITIONAL_PRODUCTION`。结构钢当前只读取废钢炼钢和实际合格钢坯，铁矿炼铁路线整体后移。

整树最终数量与点数：当前有效471项、29,085点；后移48项、12,005点；合计519项、41,090点。旧521项、40,935点总账撤销；`MIL-EXT-016`和`MAT-PLT-001`均不是独立候选，所有519项候选均已冻结唯一整数科研点。
