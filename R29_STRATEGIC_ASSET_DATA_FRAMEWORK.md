# R29：高端战略资产与威力想象数据框架

## 0. 目标

高端武器、舰船、航天器和战略设施必须让玩家产生“我真正拥有了它”的感觉。产能、成本和战力只说明系统效率，不能替代资产想象。

本框架要求同一资产同时具备：结构化结算事实、可比较性能、可想象威力、明确限制、生产来源和服役历史。

## 1. 玩家拥有感的六个来源

### 1.1 身份

名称、型号、代际、类别、设计来源、制造批次和首次服役时间，让资产从“数量 1”变成可记忆对象。

### 1.2 角色

说明它解决什么战略问题：守备、攻坚、远程拒止、防空、反舰、轨道观测、深空运输、行星防御等。

### 1.3 可想象威力

不用单一伤害值，而用目标尺度和可观察结果描述：

- 能破坏什么等级的目标；
- 能覆盖或拒止多大范围；
- 一次行动能改变怎样的战场或任务状态；
- 对建筑、舰船、编制、轨道资产或地区分别有什么效果。

### 1.4 标志性表现

发射、开火、命中、机动、展开、冷却和故障时的可感知现象。表现来自结构化标签和文案模板，不进入战斗公式。

### 1.5 限制与代价

能源、弹药/组件、补给、冷却、维护、平台、部署时间、人员、政治风险与附带损害。限制是威力可信和战略选择成立的前提。

### 1.6 经历

原型试验、验收、首次部署、战绩、事故、损伤、修复、改型和退役记录。经历让同型号资产也能产生历史差异。

## 2. 七层数据结构

### 2.1 资产身份 `AssetIdentity`

```text
displayName
modelName
generation
assetClass
roleIds[]
designerId
manufacturerIds[]
introducedDay
summaryKey
```

### 2.2 设计性能 `PerformanceProfile`

```text
effectiveness        综合任务效果 0–100
reliability          可靠性 0–100
adaptability         适应多环境/任务能力 0–100
precision            精确性 0–100，可选
survivability        生存性 0–100，可选
mobility             机动性 0–100，可选
signature            暴露程度 0–100，可选
```

综合分数只用于排序和 AI 粗判断；玩家详情必须展示具体角色和结果。

### 2.3 威力事实 `ImpactProfile`

```text
targetDomains[]      infantry / armor / fortification / air / naval / orbital / surface
effectiveRangeBand   local / regional / theatre / orbital / interplanetary / interstellar
targetScale          squad / formation / facility / capitalShip / orbitalNode / region
destructiveScale     disable / missionKill / destroy / areaDenial / infrastructureCollapse
penetrationClass     none / light / medium / heavy / strategic
areaEffectClass      point / site / corridor / district / regional
demonstratedEffectIds[]
comparisonTags[]
```

`ImpactProfile` 描述“能造成什么事实”，不直接替代未来战斗模型。

### 2.4 运行需求 `OperationalDemandProfile`

```text
personnelRequired
powerDemand
strategicSupplyPerDay
ammunitionOrComponentUse
deploymentDays
reloadOrTurnaroundDays
maintenanceLoad
requiredFacilityIds[]
requiredNetworkKinds[]
environmentLimits[]
```

### 2.5 风险与限制 `ConstraintProfile`

```text
failureModes[]
collateralRisk
politicalRisk
escalationRisk
minimumReadiness
minimumSupplyDays
weatherOrOrbitLimits[]
counteredByTags[]
```

### 2.6 生产与库存 `IndustrialProvenance`

```text
designId
productionLineId
facilityId
batchId
unitCost
productionDays
condition
stockpileId
deliveredToIds[]
```

玩家必须能从服役资产追溯到设计、工厂、产线和批次。

### 2.7 服役记录 `ServiceRecord`

```text
prototypeDay
acceptedDay
deployedDay
eventIds[]
missionIds[]
confirmedOutcomeIds[]
damageHistory[]
refitHistory[]
retiredDay
```

服役记录只保存稳定事件引用和关键状态，不复制整段日志。

## 3. 文案生成结构

### 3.1 一句话拥有感

格式：

```text
[名称] 是一种 [角色]，能够在 [距离/尺度] 对 [目标] 造成 [可观察结果]。
```

### 3.2 威力想象

格式：

```text
在 [典型条件] 下，它可以 [作用过程]，使 [目标对象] 出现 [任务级结果]。
```

### 3.3 可信限制

格式：

```text
代价是 [能源/补给/维护/部署限制]；若 [条件不足]，则会 [降级或风险]。
```

### 3.4 文明意义

格式：

```text
它证明国家已经能够 [工业、科研或组织能力]，并使 [新任务/新地区/新对手] 成为可行动对象。
```

## 4. 示例：通用守备装备

### 结构化事实

```text
角色：边境守备、通道拒止、低维护持续部署
效果：58
可靠性：84
适应性：72
目标：轻装人员、小型车辆、非加固据点
范围：地区内
结果：压制渗透、保护补给节点、维持前沿通道
限制：不适合攻击重型筑垒和高机动正规军
维护：低到中
补给：编制需保持至少 12 日补给才能持续执行任务
```

### 玩家可读描述

> “通用守备装备”不是用于突破正面重防线的昂贵武器，而是一套能在缺乏完善维修条件的前沿连续运转数月的标准化装备。它足以压制轻装渗透力量、保护道路和补给据点，并让七千五百人的守备编制真正形成持续存在；面对重型筑垒或正规突击部队时，它仍需要炮兵、装甲和更深补给体系支援。

该描述让玩家理解自己拥有什么、它为什么强、强在哪里、又为什么仍需要下一代装备。

## 5. 对现有 Nation Kernel 的映射

| 新框架 | 当前对象 | 落地策略 |
|---|---|---|
| 身份、角色、性能 | `DesignState` | 下一轮扩展设计档案，不塞进 `tags` |
| 威力事实 | `DesignState` 或独立可复用 profile | 先作为设计层事实，战斗层只读取相关字段 |
| 运行需求、限制 | 设计 + 编制/舰船/资产实例 | 设计保存基准，实例保存当前满足程度 |
| 生产来源 | 产线、库存、设施 | 使用稳定 ID 串联，不复制对象 |
| 服役记录 | ledger + 稳定事件引用 | 增加轻量记录索引，不复制账本文本 |
| 玩家文案 | 展示目录/模板 | 由结构化事实生成或校验，不能成为结算来源 |

## 6. 分阶段实施

### R29-A：设计档案（已完成首个样例）

- 增加身份、角色、威力事实和限制字段。
- 为通用守备装备填写第一份完整样例。
- 校验所有数值范围和引用。
- UI 显示一句话拥有感、威力结果和主要限制。

当前实现已为 `DesignState` 增加身份、威力事实、运行需求和限制结构，并使用独立 `assetPresentation` 目录承载玩家文案。通用守备装备“磐石”已经完成第一份结构化档案、模拟校验和页面可读性核对；其他设计仍按需迁移，不批量伪造。

第二份样例“雷霆”机动重装装备也已完成，用于验证同一国家安全领域中的真实取舍：效果 78、可靠性 55、适应性 61、成本 2.1、维护 0.42、最低补给 18 日；“磐石”则为效果 58、可靠性 84、适应性 72、成本 1.2、维护 0.18、最低补给 12 日。页面比较已能说明“雷霆更强但更难养”，两者均不会在未量产、未交付前增加军力。

### R29-B：实例与服役记录

- 编制、舰船和太空资产引用设计档案。
- 增加生产批次、首次部署、损伤、改型和任务结果引用。
- 从具体资产反查工厂、产线和库存来源。

### R29-C：平衡与比较

- 同一角色至少提供两种有真实取舍的设计。
- 比较界面显示差异和适用场景，不只显示绿色大数字。
- 验证高性能设计确实承担更高成本、维护、补给或风险。

设计档案和只读比较已完成最小验证；下一步仍需让两套设计竞争同一工厂、产线、库存目标和编制需求，才能证明取舍进入实际结算。

该结算纵切现已完成：重装工装不会赠送装备；同一战略产线转产期间停止生产并从 25% 重新爬坡；磐石停止补库后雷霆库存才开始增长；消耗 8 单位雷霆装备后才能形成 9,500 人机动预备队；回切磐石再次停线并从 40% 爬坡。下一步不再扩纸面设计，应进入可重复生产订单、维护与装备损耗。

多军工厂与生产栏框架随后完成：同一设施的有限军工厂可以分配到多条装备栏并行生产，国家政策与集中工业/弹性生产线分别修改稳定产出、效率增长、换线保留和工业风险。详细字段和首轮对照见 `R29_B_MILITARY_INDUSTRY_FRAMEWORK.md`。

## 7. 禁止事项

- 不用一段华丽文案掩盖没有结构化效果的装备。
- 不把每件普通装备变成独立对象；高精度保留给战略资产、设计、批次和关键主力平台。
- 不用现实武器名称或作品专有名词代替世界内设计。
- 不把威力只写成 DPS、战力或百分比。
- 不让文案直接参与结算。
- 不在战斗系统尚未定义时伪造精确射程、口径和毁伤公式。
