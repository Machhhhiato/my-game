---
output_id: AUDIT-M0-TECH-001
task_id: M0-L4-010
status: accepted
created_at: 2026-08-25T15:28:04+08:00
source_thread: 01a037ea-d006-7690-ae23-1a93a824429e
source_model: application_default_not_reported
scope: read_only_current_code_against_frozen_m0
overall_spec_frozen: true
implementation_authorized: false
user_acceptance: accepted_with_revised_implementation_baseline
acceptance_source: M0-S003-U101_to_U102
---

# AUDIT-M0-TECH-001

## 结论

当前默认游戏不是 M0 实现，而是旧 R38 文字战役。现有仓库包含可参考或改造的通用底座，但旧战役规则、旧内容和旧存档不能算作 M0 已完成，也不再作为兼容目标。

用户接受的实施基线是：M0 成为唯一后续主线；只保留能够证明被 M0 使用的底座；其余旧 R38 内容列入可恢复删除计划；不读取、不迁移、不兼容旧存档。删除前必须先完成只读依赖清单、底座拆分和 M0 最小入口验证。本决定不等于授权删除或修改代码。

## 冻结规格对照

| 冻结规格 | 已有或可改造 | 缺失或冲突 |
|---|---|---|
| `SPEC-M0-PLAY-001` | 日推进、人口、储备、研究/工程/勘察的基础状态 | 没有精密制造、无人机、两座工业废墟前哨、工程包、批次回运、六库存和 90 日完成链 |
| `SPEC-M0-OPS-001` | 总人口、可用人手、每日账本和设施事实 | 旧模型只有水、食物、维修三种储备；没有四条日常线、三档人力、P0-P3、库存底线、暂停恢复与维护积压；连续短缺固定失败与 M0 冲突 |
| `SPEC-M0-MAP-001` | 稳定地理 ID、邻接、世界蓝图和候选点验证原型 | 默认地图是视觉球体和哈希地点；`geoGrid` 是三角单元，不是球面六边格；没有工程占格、路线、管线和逐段勘测状态 |
| `SPEC-M0-PROGRESSION-001` | 研究、工程、自动槽、前置条件、进度与持久化结构 | 没有 M0 科研规则、档案复原、精密工坊、无人机实体链、四段勘测、七段首建、工程包和第二座复制 |
| `SPEC-M0-INTEGRATED-001` | 可读且确定性的日步入口；另一旧原型有版本化存档 | 默认战役和 v6 原型状态分裂；没有运输批次、事故自然结算、90 日观察合同、开局/结局对比和重载一致性验证 |
| `SPEC-M0-DESCRIPTION-001` | 结构化报告、项目/科技 ID 和通知日志原型 | 没有 M0 工作单字段、真实动态变量审计接口、对象页/统一日志/一次通知分工，也没有第二、三层正式内容 |

## 关键证据

- 默认入口渲染旧 `CampaignGlobeApp`；`V2App` 只在 `?map=1` 原型入口出现：`src/main.tsx:17`。
- 默认文字战役使用独立保存键 `always-game-text-idle-v6`：`src/v2/ui/CampaignGlobeApp.tsx:14`。
- 旧状态只有三种储备，28 人只是旧战役初始值：`src/v2/textIdle/types.ts:216`、`src/v2/textIdle/simulation.ts:137`。
- 旧失败条件在持续短缺 12 日后结束战役：`src/v2/textIdle/simulation.ts:385`。
- 旧勘测倒计时完成后一次性写入全部发现：`src/v2/textIdle/simulation.ts:352`。
- 地点坐标来自文本 ID 哈希，球体大陆由绘制循环临时生成：`src/v2/textIdle/strategicMapModel.ts:43`、`src/v2/ui/StrategicGlobe.tsx:59`。
- 可参考的地理网格是三角单元：`src/v2/world/geoGrid.ts:38`。
- 当前没有统一测试命令，现有脚本主要验证旧 R38 fixture：`package.json:6`、`scripts/r38-globe-map-simulation.ts:8`。

## 已接受的代码库基线

1. M0 使用新的状态模型、入口和存档键，不编写旧存档迁移。
2. 每个保留文件必须能指出明确的 M0 使用方；“以后可能有用”不是保留理由。
3. 可优先评估保留 React/Tauri 工程外壳、确定性推进、稳定 ID、可改造球体渲染、通用存档框架和测试工具。
4. 旧 R38 文字战役、固定地点内容、三库存、固定失败、旧入口、旧界面、旧存档兼容和只验证旧玩法的脚本进入拟删除范围。
5. 删除必须在底座拆分、M0 最小入口和验证链建立之后执行，并通过 Git 保持可恢复。
6. 当前只接受方向与审计结果；`implementation_authorized: false`，尚未授权修改或删除代码。

## 下一步

执行 `M0-L4-011 · 可复用底座与旧代码删除边界审计`，产出逐文件的保留、改造、删除、无法判断清单、依赖关系、删除顺序和验证办法。该任务仍为只读；用户验收清单后再准备实施授权。
