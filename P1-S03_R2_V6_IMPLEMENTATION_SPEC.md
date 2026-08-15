# P1-S03 R2：v6 连续国家内核实施规格

> **状态**：Codex 已完成规格；尚未授权外包。  
> **输入权威**：`P1-S03_R1A_CONTENT_FRAMEWORK.md`、`P1-S03_R1B_STARTER_CONTENT_TABLES.md`、`P1-S03_R1C_BALANCE_AUDIT.md`。  
> **目标**：用一个单一、可复现的日步内核落实国策、当前政策、科技前置、实体工程、设施状态、手动/自动推进和 LDU；不处理最终 UI 视觉与玩家文案润色。

## 1. 版本与迁移

- 新存档版本：`CampaignSaveV6`；新键：`cts-save-v6`。
- 读取顺序：v6 → v5 → v4 → v3 → v2。
- 发现旧档时，先将原文备份为 `cts-save-v<旧版本>-pre-v6-<ISO>`；绝不删除旧键。
- v5 及更早版本的模型与 v6 语义不等价（没有科技前置、设施状态、当前政策、项目档案），因此迁移生成**新的元年起点**，并保留 `migrationNote`。玩家看到的固定提示由 R6 决定；本阶段仅保存提示 ID，不编写最终玩家文案。
- 不从 v5 猜测已完成科技/工程，不把旧“项目 100%”映射为 v6 设施，以避免制造伪历史。

## 2. v6 运行状态

```ts
type RunMode = 'manual' | 'auto';
type WorkStatus = 'locked' | 'available' | 'active' | 'stalled' | 'completed';
type FacilityStage = 'locked' | 'planned' | 'construction' | 'trial' | 'operational' | 'damaged';

interface SlotRuntime<Id extends string> {
  id: Id | null;
  mode: RunMode;
  progressWork: number;
  status: 'idle' | 'active' | 'stalled';
  handoverDays: number;
}

interface ActivePolicyState {
  id: PolicyId;
  daysRemaining: number;
  startedDay: number;
}

interface FacilityRuntime {
  stage: FacilityStage;
  reachedMilestones: Array<25 | 50 | 75 | 100>;
  damagedBy: string | null;
}

interface SupplyRuntime {
  scale: { era: 'settlement'; unit: 'LDU'; dailyDemand: number; labelId: string };
  coverage: { water: number; food: number; energy: number; maintenance: number };
}

interface CampaignSaveV6 extends CampaignSaveV2 {
  version: 6;
  day: number;
  nationalPolicy: FocusState;
  currentPolicy: ActivePolicyState | null;
  policyCooldowns: Partial<Record<PolicyId, number>>;
  projectSlot: SlotRuntime<ProjectId>;
  researchSlot: SlotRuntime<TechId>;
  completed: { techs: TechId[]; projects: ProjectId[] };
  facilities: Record<FacilityId, FacilityRuntime>;
  metrics: Record<MetricId, MetricValue>;
  population: number;
  supply: SupplyRuntime;
  events: NationEventCard[];
  notificationHistory: Notification[];
  migrationNote?: string;
}
```

`nation.resources`、旧债务、旧 `focus/project/research` 字段只允许作为 v5 迁移的输入；不可作为 v6 活跃模拟、UI 或地图的事实来源。

## 3. 静态内容目录

新增 `src/v2/content/`，只承载 Codex 冻结的纯数据：

```text
content/
  ids.ts              // 只定义 ID 联合类型
  requirements.ts     // Requirement、判断和解释键
  metrics.ts          // 基准速率、国策修正、LDU 定义
  techs.ts            // R1B 科技表
  projects.ts         // R1B 工程表
  policies.ts         // R1B 当前政策表
  facilities.ts       // 工程→设施状态、地图锚点、效果
  events.ts           // 事件条件和效果，非最终玩家叙事
  copyKeys.ts         // 固定文本键；不得由实现层补写中文
```

内容表只能导出数据；日步模拟不允许包含“若 id 等于某名称”的散落判断。所有需求使用 R1A 的 `RequirementSet`，所有效果使用统一 `ModifierResolver`。

## 4. 单一日步顺序

`advanceOneDay(state)` 必须为纯函数，按下列顺序执行且可复现：

1. 增加 `day`，衰减政策冷却、改组与交接天数；
2. 解析当前国策、有效政策、运行设施、已完成科技、事件的所有修正；
3. 计算 LDU 覆盖与九项国家指标的日变化，记录来源；
4. 检查运行中工程/科研是否因前置或指标跌线而停滞；
5. 推进未停滞工程/科研的工作量，并依次触发 25/50/75/100 节点；
6. 每个节点更新同一份 `FacilityRuntime`、解锁、LDU/指标修正、事件权重和通知；
7. 完成项进入 `completed` 档案、从候选池退出；若槽位为自动，在**下一日**才选最高优先合资格项；
8. 推进当前政策，到期结算其结果、进入冷却、槽位置空；
9. 解析事件预警、发生、缓解或解除；普通事件不把 `clock.speed` 设为 0；
10. 生成变化通知。60 日只追加完整历史简报，永不暂停。

顺序不可为了 UI 改写。`advanceDays(n)` 仅循环调用 `advanceOneDay`；没有第二套批量公式。

## 5. 关键规则

### 5.1 前置与锁定

- `available(def, state)` 只由 `RequirementSet` 返回；
- 锁定卡可以展示、不能选择；显示的是 `explainRequirement` 返回的键与状态数据；
- 已完成卡不在选择器中，只进入档案；
- 运行中失去维持条件时标为 `stalled`，不清进度、不偷偷换项；
- 科技完成、设施到达试运行或指标跨线时，重新计算所有可用项。

### 5.2 手动/自动推进

- 两槽默认 `manual`、空闲；
- 切换槽模式不影响当前运行项；
- `auto` 在完成后的下一日从可用且未完成的项目中，按当前国策定义的固定 ID 优先序选择；
- 没有可用项时保持空闲，记录 `auto_no_candidate` 通知；
- 自动模式永远不能启动政策、切换国策、撤换项目或跳过前置。

### 5.3 当前政策

- 最多一项；`startPolicy` 只接受可用、未冷却项；
- 选择另一项时先正常结束旧项，生成 `policy_cancelled` 结果，旧项进入冷却；
- 政策只生成 `TimedEffect`，到期移除；不得创建设施、项目进度或永久科技；
- 每项效果与代价必须在修正来源里可追溯。

### 5.4 LDU

- 聚居地阶段 `dailyDemand = 1`，`LDU` 只用于供给覆盖、维护负担、工程与政策吞吐；
- 水、食物、能源、维修四个分项用相对覆盖率表示，不能重建库存条；
- 当某分项覆盖低于 1，产生可解释的指标/事件修正；高于 1 只形成有限余裕，不累积成无上限库存；
- v6 只实现 `settlement/LDU`；`NDU/PDU/SDU` 是同一结构在后续阶段的换标，不提前伪实现。

### 5.5 通知

只写入：工程/科研节点、设施投用或受损、指标跨档、当前政策开始/结束/取消、国策改组结束、事件发生/解除、自动推进成功/无候选。禁止固定每周流水账。

通知存储 `copyKey + 参数`，本阶段可以有开发键；R6 才把每条键映射成普通玩家读得懂的自然语言。

## 6. 允许与禁止的文件

### 允许修改

- `src/v2/types.ts`、`state.ts`、`save.ts`、`simulation.ts`、`store.ts`；
- `src/v2/content/**`（只录入 R1 冻结数据）；
- 新增 `scripts/r2-v6-sim.ts`；
- 仅为编译接线调整 `main.tsx`。

### 禁止修改

- `src/v2/render/**`、`PlanetCanvas.tsx`、`src/v2/v2.css`、任何地图视觉/布局/颜色/字体；
- `TopToolbar.tsx`、`OperationPanel.tsx`、`CommandBar.tsx`、`LeftRail.tsx` 的视觉与最终玩家文案（属于 R3/R4/R6）；
- 无冻结数据时新增中文、事件、图片、图标、数值或内容；
- 新依赖、提交、推送、删除旧存档键。

## 7. 自动验证矩阵

1. v2/v3/v4/v5 迁移均备份旧键，生成 day 1 的有效 v6 起点；
2. 锁定科技/工程/政策不可开始；满足前置后可开始；完成后不可再选；
3. 一个科技解锁一个工程、工程到 50% 解锁一个政策、设施试运行解锁后续科技；
4. 手动槽完成后保持空闲；自动槽只在下一日接续合资格项；没有候选不选；
5. 当前政策按 14 日结束并进入冷却；提前替换不产生永久设施效果；
6. 改国策后 10 日效率 0.65→1；普通事件、60 日简报、工程/研究完成均不断表；
7. 180 日四条路线与 `P1-S03_R1C_BALANCE_AUDIT.md` 的安全线一致；
8. 每个 LDU 分项低于 1 都能说明扣了哪项指标，且不出现库存大数字；
9. 同一 seed、同一指令序列的 180 日结果深度相等；重载不补算。

## 8. R6 普通玩家文案门（本规格的后置条件）

所有现在出现的名称、提示、开发键、指标解释、科技/工程/政策描述、事件通知和报告在 R6 都必须经过 **普通玩家可读性重写**：

- 不要求玩家理解“日速率、修正、前置、覆盖率、LDU、权重、状态机”等开发术语；
- 每段文字优先说明：发生什么、谁受影响、为什么重要、现在能做什么；
- 数字必须配合生活/建设含义，不能只给抽象点数；
- 由 Codex 完成逐条撰写、实际界面阅读与新玩家理解测试；
- R6 未通过时，R1/R2 的中文仅视为开发占位，Demo 不得宣布完成。
