# R10 第一阶段内容运行时绑定

> 状态：运行时数据合同。它把 R5 目录的每一项内容接入 R10 持续模拟；不冻结最终平衡数值，也不替代 R6 玩家文案。

## 1. 共同原则

科技、工程、政策都保留稳定内容 ID、前置关系与 R6 文案键，并额外拥有 `runtime`。运行时只读取该字段，不依据显示名、剧本地点或界面类别推断数值。

`runtime` 统一回答四个问题：

| 问题 | 字段 | 含义 |
|---|---|---|
| 要多久 | `time.workDays` / `time.durationDays` | 在满足编制时所需的基础工作日；实际速度仍受国策、设施和风险影响。 |
| 占多少人 | `staffing` | 研究组、工务队或行政执行编制；是后台并发限制，不显示工时百分比。 |
| 开始要什么 | `demand` | 工程消耗建设物资，政策消耗协调能力；科技只需要知识与研究编制。 |
| 结果是什么 | `result` | 以能力、设施、储备产出、核心指标、维护与制度效果等标准字段描述，供模拟、报告和未来空间层共同读取。 |

## 2. 三类内容

### 科技

```ts
runtime: {
  time: { workDays, milestones: [25, 50, 75, 100] },
  staffing: { researchers },
  demand: { researchLoad },
  result: { capability, unlocks, automationEligible }
}
```

科技的“结果”首先是能力和解锁；不在科技记录中凭空制造设施产出。只有设施投用后，才改变储备、维护或服务能力。

### 工程

```ts
runtime: {
  time: { workDays, milestones: [25, 50, 75, 100] },
  staffing: { builders },
  demand: { constructionSupply, maintenanceLoad },
  result: { reserveOutput, metricEffects, facilityState, mapClass }
}
```

`constructionSupply` 使用早期共同体的 LDU 工务物资尺度；它是开工阈值和一次性占用，不能被理解为无限吨数。`mapClass` 只是未来空间层要消费的工程模块类型，不是坐标或贴图。

### 政策

```ts
runtime: {
  time: { durationDays, milestones: [100] },
  staffing: { administrators },
  demand: { coordinationLoad },
  result: { metricEffects, reserveOutput, cooldownDays }
}
```

政策是有限期行政行动；生效期间占用行政执行编制，结束后释放。它不取代工程，也不会永久保留在主选择区。

## 3. 初始数值标尺

- 第一阶段研究：2–3 名研究人员，按目录层级与类型调整工作日。
- 第一阶段工程：4–5 名工务人员，8–26 单位建设物资，按层级、工程阶段和规模调整。
- 第一阶段政策：1–3 名行政执行人员，21 / 45 / 90 日对应 early / capable / institutional 版本。
- 这些是供第一轮文字挂机测试的**归一化初值**，不是最终平衡结论。后续平衡只调 `runtime` 数据，不改界面逻辑或内容 ID。

## 4. 验收条件

1. 1000 科技、1000 工程、60 政策版本全部有合法 `runtime`。
2. R10 适配器不再用内容 ID、名称或 UI 类别推导工期、人手、建设物资和效果。
3. 政策启动和持续期间的人力占用可由状态与每日账本追溯。
4. 同种子、同指令序列的模拟保持确定性；目录、类型、模拟和生产构建均通过。
