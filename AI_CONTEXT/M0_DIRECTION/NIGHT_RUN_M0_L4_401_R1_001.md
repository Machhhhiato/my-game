---
night_run_id: NIGHT-M0-L4-401-R1-001
formal_task: M0-L4-401-R1
output_id: BUILD-M0-CORE-001-R1
run_status: implemented_waiting_user_acceptance
input_commit: fe6373591098c854246cad93a0e349fd65e7eab7
output_commit: this_implementation_commit
started_at: 2026-08-26T10:24:03+08:00
finished_at: 2026-08-26T11:23:13+08:00
---

# NIGHT-M0-L4-401-R1-001 执行报告

## 结果

`BUILD-M0-CORE-001-R1` 已完成第一层实现验收，当前为 `implemented_waiting_user_acceptance`。本轮没有进入 `M0-L4-402`，中央区域只提供正式地图容器，不绘制假地图。

## 线程与退回过程

- 首次任务 `/root/m0_l4_401_r1` 使用 `gpt-5.6-terra / medium`。任务创建成功，但压缩式重写被第一层否决；还原后再次确认无法安全完成核心迁移，因此按能力失败关闭。工作区恢复干净，无提交、无推送。
- 用户修订线程规则并形成 `D-M0-DIR-040` 后，接替任务 `/root/m0_l4_401_r1_sol` 使用 `gpt-5.6-sol / high` 完成同一执行单。
- 第一层阶段 A 退回一次：修正月中持续产消后的真实可用库存，避免负净流量重复支出，也允许正净流量支持即时工程支出。
- 第一层阶段 B 退回一次：资源覆盖时间改为净消耗口径；事件窗增加键盘移动；非法位置不得写入状态。
- 第一层真实浏览器复核又发现指针拖动没有生效。第一层把拖动监听改为窗口级指针链路后复验通过。

## 已完成

- 完整格里高利公历与闰年规则；日期按天推进，支持暂停、1x、2x、4x，倍速不跳过日结算。
- 持续资源按月入账，月中按实际经过天数分段累计；一次性工程支出即时影响真实可用量；水和食物在月中可于真实日期耗尽。
- 删除玩家侧安全线与库存锁定、预留、工程影子成本；保留供水、食物、维护、人力、项目暂停恢复和确定性账本。
- 存档升级为 `always-game-m0-v2`，严格校验公历、月账本、事件窗位置和新增状态；不迁移旧 v1 存档。
- 正式 UI 改为中央地图容器、顶部人口/六资源/日期/速度、左侧图标系统入口、单一系统 sheet 和事实事件窗。
- 工程只在工程 sheet；顶部持续资源显示下次月结预计，聚焦后展示生产、需求、累计、剩余预测、预计结余与真实覆盖说明。
- 人口变化只在实际增减后短暂显示，不进入存档；事件窗支持指针拖动、键盘方向键移动并在刷新后保留位置。

## 修改文件

- `src/m0/calendar.ts`
- `src/m0/economy.ts`
- `src/m0/types.ts`
- `src/m0/state.ts`
- `src/m0/simulation.ts`
- `src/m0/save.ts`
- `src/m0/M0App.tsx`
- `src/m0/m0.css`
- `scripts/m0-core-sim.ts`

## 验证证据

- `npm run typecheck`：通过。
- `npm run test:m0`：通过；输出为 `M0 stage A+B checks passed: core accounting, deterministic time, strict saves, UI position, and speed sequencing.`
- `npm run build`：通过；Vite 构建 36 个模块。
- `git diff --check`：通过。
- 真实浏览器桌面与 390 x 844 窄屏均检查；顶部栏、系统 sheet、地图容器、资源明细与事件窗可操作，控制台无 error 或 warning。
- 真实 4x 运行检查：日期从 2001 年 1 月 1 日推进到 1 月 2 日，没有跳过日结算。
- 水资源明细显示每日生产 28、每日需求 28、预计结余 280，并明确显示“当前生产不低于需求”。
- 事件窗键盘移动后刷新保持位置；指针从右上拖到地图中部后刷新仍保持同一位置。

## 已知边界与回退

- 本轮只建立地图容器；球体、六边格和地图交互仍属于 `M0-L4-402`，当前继续阻塞。
- v1 存档按用户“不保留旧存档”的决定不迁移；读取不到合法 v2 时建立新状态。
- 输入与回退锚点为 `fe6373591098c854246cad93a0e349fd65e7eab7`。
- 当前结果只能交给用户试玩决定是否接受，不得由第一层自行把 `M0-L4-401` 标记为 accepted。

## 唯一下一步

用户试玩 `BUILD-M0-CORE-001-R1`，决定接受或指出需要返工的具体界面、结算或交互问题；在用户接受前不开始 `M0-L4-402`。
