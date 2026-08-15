# P1-S03 R1A：内容与规则框架

> **状态**：Codex 冻结中；禁止据此直接实现。  
> **目的**：先确定“内容怎样成为规则”，再填写数值、事件正文与地图细节。  
> **不含**：最终平衡数值、事件叙事、UI 视觉、图片、音效、地图绘制。

## 1. 内容不是散落在代码里的条件判断

首局所有可玩内容分成两部分：

```text
作者数据（Codex 编写）                 运行状态（模拟内核计算）
科技、工程、当前政策、设施、地区  →  解锁、进度、设施阶段、影响、事件、通知
```

运行内核不得自行创造新内容、补全缺失前置、猜测数值或编写玩家文字；它只能读取已冻结的注册表并按统一规则结算。

## 2. 四种作者对象

| 对象 | 目的 | 是否可重复 | 是否有地图锚点 | 典型结果 |
|---|---|---:|---:|---|
| `TechDefinition` 科技 | 验证知识、方法或制度能力 | 否 | 可选，通常关联设施/地区 | 解锁工程、政策、后续科技、修正风险 |
| `ProjectDefinition` 工程 | 建造/改造一个实体设施 | 否 | 必须 | 设施阶段、永久指标修正、地图变化 |
| `PolicyDefinition` 当前政策 | 进行一次短期、局部集中行动 | 可重复但有冷却/条件 | 必须写地点或对象 | 临时指标/风险修正、政策结果通知 |
| `FacilityDefinition` 设施 | 地图上已存在或由工程建成的事实 | 不适用 | 必须 | 提供前置、持续效果、事件上下文、地图表现 |

国策不是作者对象卡池：它是固定的 5 项全局资源倾斜规则；只允许改变日速率、自动优先序和风险权重。

## 3. 统一前置系统

所有锁定条件只使用一个 `Requirement` 联合类型；不得在 UI、模拟或地图分别写不同条件。

```ts
type Requirement =
  | { kind: 'tech'; id: TechId }
  | { kind: 'facility'; id: FacilityId; stage: 'construction' | 'trial' | 'operational' }
  | { kind: 'metric'; id: MetricId; min: number }
  | { kind: 'region'; id: RegionId; state: RegionState }
  | { kind: 'project'; id: ProjectId; milestone: 25 | 50 | 75 | 100 };

interface RequirementSet {
  all: Requirement[];      // 必须全部满足
  any?: Requirement[];     // 若存在，则至少满足其中一项
}
```

显示层永远调用同一 `explainRequirement()`：

```text
满足：河谷地形勘查已投入使用
未满足：旧渡口工务所仍在施工；需要达到试运行
未满足：工业产能 27 / 30
```

## 4. 固定生命周期

### 4.1 科技与工程

```text
locked → available → active → milestone 25/50/75 → completed → archived
                         ↘ stalled ↗
```

- `locked`：前置不满足，不可选；
- `available`：前置满足，尚未选择；
- `active`：正在投入；
- `stalled`：前置在运行中失效或关键指标跌破维持线，保留进度并说明原因；
- `completed`：100% 时一次性结算效果并写入设施/科技状态；
- `archived`：完成后退出选择器，进入“已投入使用”档案；
- 自动推进只能从 `available` 项中选，绝不从 `locked`、`completed` 或 `stalled` 项中选。

### 4.2 当前政策

```text
locked → available → active(剩余天数) → resolved → cooldown → available
```

政策不是进度条、不是设施、不会进入工程档案。提前替换时进入 `cancelled`，并生成一条明确结果通知。

### 4.3 设施

```text
locked → planned → construction → trial → operational ↔ damaged
```

设施阶段由对应工程的节点推进，或由事件改变；地图、指标、科技前置、政策前置和事件权重都读取这个阶段。

## 5. 静态数据的最小字段

```ts
interface TechDefinition {
  id: TechId;
  name: string;
  summary: string;
  requirements: RequirementSet;
  researchProfile: ResearchProfileId;
  unlocks: UnlockEffect[];
  stages: MilestoneDefinition[];
}

interface ProjectDefinition {
  id: ProjectId;
  name: string;
  location: NodeId;
  facilityId: FacilityId;
  requirements: RequirementSet;
  workProfile: ProjectProfileId;
  builder: string;
  beneficiary: string;
  stages: MilestoneDefinition[];
  completion: CompletionEffect[];
}

interface PolicyDefinition {
  id: PolicyId;
  name: string;
  location: NodeId | RegionId;
  target: string;
  durationDays: number;
  requirements: RequirementSet;
  effects: TimedEffect[];
  completion: CompletionEffect[];
  cooldownDays: number;
}

interface FacilityDefinition {
  id: FacilityId;
  name: string;
  anchor: NodeId;
  source: 'starting' | ProjectId;
  stageEffects: Record<FacilityStage, FacilityEffect[]>;
  mapPresentation: Record<FacilityStage, MapPresentation>;
}
```

**作者责任**：上述每一个面向玩家的字符串、效果数值、阶段内容和地图描述均由 Codex 写入正式内容表。实现者不可添加后备文案、默认数值或“合理猜测”。

## 6. 效果分类：短期、长期、解锁必须分开

| 效果 | 来源 | 生命周期 | 可修改对象 |
|---|---|---|---|
| `TimedEffect` | 当前政策、事件 | 到期移除 | 指标日速率、项目速度、风险权重 |
| `FacilityEffect` | 工程里程碑、设施状态 | 直到设施受损/替换 | 指标日速率、风险权重、地区状态 |
| `UnlockEffect` | 科技完成、设施阶段 | 永久（除非世界状态撤销） | 解锁科技/工程/政策/制度 |
| `CompletionEffect` | 科研或工程 100% | 一次结算 + 可能附带永久效果 | 通知、设施状态、地图状态、指标 |

所有数值修正均进入一个 `ModifierResolver`；不可在每个事件里直接修改指标并遗失来源。玩家点击任何指标时必须能列出其当前修正来源。

## 7. 首局关系骨架（只冻结结构）

```mermaid
flowchart TD
  S[第07号基础维护手册：开局既有] --> VS[河谷地形勘查]
  S --> AP[旧世代档案译读]
  VS --> MR[净水膜复用工艺]
  VS --> FR[河谷田间恢复法]
  VS --> W[西岸净水干线]
  VS --> WS[旧渡口工务所改造]
  AP --> T[第07号短波通信塔]
  WS --> MT[维护学徒制度]
  T --> SP[短波通讯协议]
  MR --> PH[公共卫生流程]
  FR --> PH
  FR --> G[河谷培养温室]
  VS --> HP[河谷集体狩猎周]
  MR --> RP[井口配给整顿]
  G --> SPH[公共卫生清扫]
  T --> NC[夜间护运]
```

此图只定义“谁能解锁谁”。下一步 R1B 再为每个节点写：地点、阶段、数值、普通人后果、实际地图表现和准确玩家文本。

## 8. 运行状态边界

```ts
interface CampaignStateV6 {
  day: number;
  speed: 0 | 1 | 2 | 4;
  nationalPolicy: NationalPolicyState;
  currentPolicy: ActivePolicyState | null;
  projectSlot: SlotRuntime<ProjectId>;
  researchSlot: SlotRuntime<TechId>;
  completed: { techs: TechId[]; projects: ProjectId[] };
  facilities: Record<FacilityId, FacilityRuntime>;
  metrics: Record<MetricId, MetricValue>;
  regions: Record<RegionId, RegionRuntime>;
  notifications: Notification[];
}
```

不进入 `CampaignStateV6` 的内容：旧资源库存账、旧债务条、独立地图完成判断、UI 临时文本、任何未冻结的作者内容。

## 9. R1A 完成条件

- 任何科技、工程、政策都可从 ID 追溯到前置、效果、地点与生命周期；
- 任何设施阶段能同时解释地图、指标、事件和解锁；
- 工程与科研的手动/自动分支没有歧义；
- 所有可由实现者“猜出来”的部分明确标为 Codex 待填数据；
- 不创建代码任务、不制作视觉、不委托 DeepSeek。
