# P1-S03A 任务包：真实时间与玩家语言

> **状态**：已冻结；实现部分可外包。  
> **前置**：`P1-S02_SETTLEMENT_SPEC.md`、`DEMO_FEEDBACK_BACKLOG.md`、`P1-S03_SETTLEMENT_FOUNDATION_SPEC.md`。  
> **目标**：将可验证的批量结算升级为可观看的日/周挂机，并把首局默认用语从后台术语改为普通人可理解的生活语言。

## 1. 玩家可感知的行为

1. 新局进入**暂停**。玩家选择“本期重点 / 重点工程 / 民生安排 / 警戒安排”，二次确认后，计划开始执行。
2. 1×、2×、4×真正改变游戏日推进速度；暂停真正停止库存、工程、事件与日期。
3. 顶部日期显示“第 N 年 · 本期第 D / 60 日”，不再在没有结算时跳计划期。
4. 每 7 日，事件日志新增一条“本周执行简报”；水、食物、备件和工程进度在运行中逐渐变化。
5. 一期到第 60 日自动暂停，弹出“期末简报”；玩家修改命令后开始下一期。
6. 玩家看到的是“水够几天、食物够几天、安全住处、维修积压、可投入人手”，不是“住房债/统合债/社会承受力”。

## 2. 范围与禁止项

### 必须实现

- P1-S02 的结算内核按日/周/期末推进，且保留批量测试入口；
- 速度 0/1/2/4 的真实运行、期末自动暂停、刷新和存档恢复；
- 四条生活底线及玩家用语替换；
- 本周执行日志、期末简报与现有资源账/国家概览的文本映射；
- v3 → v4 安全迁移；
- 独立模拟脚本与浏览器试玩截图。

### 明确不做

- 不改 `src/v2/render/**`、`src/v2/v2.css`、地图、Canvas、图层、颜色、字体、面板比例或视觉布局；
- 不增加共同居住区、接纳转常住、疾病、完整人口/产业链或“河谷定居成立”（属于 P1-S03B）；
- 不做离线追赶；页面重载时保持已结算的日进度，但不依据现实离线时间补算；
- 不加入新依赖、提交、推送或删除旧存档键。

## 3. 数据与迁移

### 3.1 CampaignSaveV4

`CampaignSaveV4` 使用新键 `cts-save-v4`，在 v3 基础上增加：

```ts
runtime: {
  activeCommand: PlayerCommandState | null
  dayInPeriod: number        // 0..60；0 表示等待计划
  dayRemainder: number       // 0..1，日推进的浮点余量
  weeklyStart: { resources, capacities, debts, projectProgress }
  periodStart: { resources, capacities, debts, projectProgress }
  pausedReason: 'awaiting_plan' | 'manual' | 'period_end' | 'event'
  startedPeriod: { year, period } | null
}
living: {
  waterDays: number
  foodDays: number
  shelteredBeds: number      // P1-S03A 固定为 31
  repairBacklog: number      // 映射维护债，0..100
}
```

- 读取顺序：v4 → v3 → v2；v3/v2 每次迁移前均原文备份到 `cts-save-v<old>-pre-runtime-<ISO>`；绝不删除旧键。
- v3 迁移：`dayInPeriod=0`、`activeCommand=null`、`pausedReason='awaiting_plan'`、床位 31；生活底线按当前库存和每日需求计算。
- 若重载时 `activeCommand !== null`，恢复后强制 `speed=0`、`pausedReason='manual'`，显示“上次运行停在第 N 日；继续或调整计划”。不做离线补算。

### 3.2 日/周纯函数

新增/重构纯模拟 API（不依赖 React、Zustand、Canvas、DOM、真实时间、`Math.random()`）：

```ts
startPlan(state: CampaignSaveV4, command: PlayerCommandState): CampaignSaveV4
advanceOneDay(state: CampaignSaveV4): RuntimeStepResult
advanceDays(state: CampaignSaveV4, days: number): RuntimeStepResult
previewPlanPeriod(state: CampaignSaveV4, command: PlayerCommandState): SettlementPreview
settlePlanPeriod(state: CampaignSaveV4, command: PlayerCommandState): SettlementResult
```

`settlePlanPeriod` 必须改为 `startPlan + advanceDays(60)` 的测试/批处理包装。日步和批量结算使用同一规则，不能保持两套公式。

## 4. 数值推进口径

### 4.1 期内分配

P1-S02 的资源、能力、债务和工程 delta 仍是“一期总量”。计划开始时根据当期命令计算出完整的 `periodBudget`，所有常规修正均匀分 60 日应用：

```text
dailyDelta = periodDelta / 60
weeklyLogDelta = day 1..7 的实际累计
```

- 小数库存可在内部保留两位；顶栏仍取整显示；
- 条件事件在它的阈值于某日跨越时立即触发并暂停；一次性事件代价当天应用，不再等到期末；
- 原 P1-S02 的基础债务检查改在每周第 7 日执行；期末只收束报告/日历/下一期状态；
- “滤芯拆借”在备件首次 `<=12` 的日末触发，应用代价并设 `pausedReason='event'`；玩家可在相同计划下继续，也可调整计划；
- 本阶段事件不提供额外危机选项，暂停本身是对玩家的反馈。P1-S03B 才增加选择。

### 4.2 速度和浏览器时钟

| 速度 | 真实时间 | 游戏推进 |
|---|---:|---:|
| 暂停 | 不推进 | 0 日 |
| 1× | 0.5 秒 | 1 游戏日 |
| 2× | 0.25 秒 | 1 游戏日 |
| 4× | 0.125 秒 | 1 游戏日 |

- 使用固定间隔累加器；单帧最多推进 4 日，防止后台恢复时卡顿；
- 开始计划或从事件暂停恢复时恢复到玩家最后选定的非零速度；
- 期末/事件必须自动速度归零，禁止一帧越过期末或事件；
- 运行中每 7 日保存一次，期末/事件立即保存。

## 5. 首局语言与显示口径

### 5.1 固定替换

| 现有 ID / 术语 | 玩家显示 |
|---|---|
| `direction` | 本期重点 |
| `flagshipProject` | 重点工程 |
| `policy` | 民生安排 |
| `security` | 警戒安排 |
| 安全水 | 可饮用水 |
| 热量 | 食物储备 |
| 生物土地资本 | 耕地与种源 |
| 回收材料 | 可用材料 |
| 精密备件 | 关键备件 |
| 有效劳力 | 可投入人手 |
| 公共信用 | 协作信任 |
| 维护债 | 维修积压 |
| 生态债 | 土地损伤 |
| 住房债 | 拥挤与安置不足 |
| 信任债 | 公平争议 |
| 军事债 | 警戒负荷 |
| 统合债 | 调度阻塞 |

内部类型名、历史设定和深度报告可保留旧名，但 P1 主界面、按钮、资源账、国家概览、确认预览、事件日志和期末简报不得默认暴露“债”。

### 5.2 本期重点的首局映射

不增加方向 ID，只改首局显示名与描述；后期才恢复宏观的科研/工业/军事/航天战略方向。

| 现有 ID | 玩家显示 | 一句解释 |
|---|---|---|
| `survival` | 供水与食物 | 先让所有人有水喝、有饭吃。 |
| `balanced` | 定居与照护 | 少冒险，优先安顿、卫生与日常秩序。 |
| `science` | 学徒与资料 | 暂时少一部分人手，换来更会修、更会判断的人。 |
| `industry` | 工务与材料 | 多回收、多维修，为下一座设施打基础。 |
| `military` | 护运与警戒 | 保护水网、道路和夜间营地，但会占用人手。 |
| `space` | 远期筹备（不可执行） | 当前年代没有条件；按钮禁用并解释原因。 |

### 5.3 四条生活底线

固定展示/报告：

```text
可饮用水：库存 ÷ 当日总需水 = 可维持 N 天
食物储备：库存 ÷ 当日总需食物 = 可维持 N 天
安全住处：31 / 31 人（P1-S03A 固定）
维修积压：维护债的反向玩家语言，显示“低 / 注意 / 高”与最先受影响设施
```

“住房”在 P1-S03A 不做新的数值模型；只显示“地下宿舍已满，地表临时住处正在筹备”，避免伪造尚未实现的床位系统。

## 6. UI 接线

- 保持现有界面结构与 CSS，不重排、不重画；只接入已有控件的行为和文字。
- 顶部日期替换为：`余烬历 1 年 · 第 1 计划期 · 第 17 / 60 日`；未开始时为“等待本期计划”。
- “确认本计划期”在无 active plan 时显示“下达本期计划”；运行中显示“正在执行 · 第 N 日”；期末显示“审阅简报并制定下期”。
- 确认条写清：本期重点、重点工程、首先紧缺的生活底线、预计挤占哪一条工作；不显示“最大债务变化”。
- 事件日志按周记录人话：例如“第 2 周：水网维修队从回收场借调 2 人，饮水储备回升，但工务所排队增加。”
- “报告”面板在期末才自动打开；运行中可打开“本周执行简报”，显示第 N 周产出、挤占和下一周风险。

## 7. 自动验证与试玩

新增 `scripts/p1-s03a-runtime-sim.ts`，至少断言：

1. 相同 v4 初始状态与命令，`advanceDays(60)` 与 `settlePlanPeriod` 的状态/报告/种子键一致；
2. 暂停时推进 0 日，1×/2×/4×使用相同日步但由 UI 调度不同频率；
3. 60 日恰好自动暂停、推进一期、生成一份期末报告；
4. 备件跨越阈值时在当日触发一次滤芯拆借、自动暂停，恢复后不会重复触发；
5. 期内重载不补算离线日，且状态/生活底线保持；
6. 速度与显示用语中不再出现玩家可见的“住房债/统合债/社会承受力/有效劳力”。

人工试玩：从暂停新局下达“供水与食物 + 净水续命”，以 1×观看至少 7 日、切 4×至滤芯事件或期末；确认日数、库存和工程逐步变化；调整计划并跑至期末。截图仅验证功能，不评价视觉。

## 8. DeepSeek 交付约束

允许改动：`src/v2/types.ts`、`state.ts`、`save.ts`、`simulation.ts`、`store.ts`、`data.ts`、既有 `src/v2/ui/*.tsx` 文本/状态接线、`src/main.tsx`、`scripts/`。禁止改动渲染和 CSS。

最终报告路径：`.codex/review-reports/P1-S03A-runtime-clarity.md`。在 `npx tsx scripts/p1-s03a-runtime-sim.ts`、`npm run typecheck`、`npm run build`、`git diff --check` 均通过且截图存在后，才执行：

```bash
node scripts/review-handoff.mjs mark \
  --task P1-S03A-runtime-clarity \
  --summary "P1-S03A 真实时间与玩家语言已实现并通过模拟、构建与试玩" \
  --report .codex/review-reports/P1-S03A-runtime-clarity.md \
  --artifact P1-S03A_RUNTIME_CLARITY_SPEC.md \
  --artifact scripts/p1-s03a-runtime-sim.ts
```
