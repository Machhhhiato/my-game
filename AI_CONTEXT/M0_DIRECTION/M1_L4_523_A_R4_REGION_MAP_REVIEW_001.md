---
review_id: REVIEW-M1-L4-523-A-R4-REGION-MAP-001
task_id: M1-L4-523-A-R4
status: accepted_integrated
implementation_thread_id: 01a05695-be67-7c42-9d10-be44cbdf8f66
implementation_worktree: /Users/xujiangyue/.codex/worktrees/bf6a/always game
reviewed_at: 2026-08-31
implementation_commit: 099aa0e6994078cc7e0a8bb92668e1b9880e7484
main_checkout_integration: authorized_and_applied
backup_push: authorized_in_same_sync_batch
---

# 千人阶段连续区域地图第一层审查

## 结论

R4已经完成方向纠正并由用户明确接受，状态为`accepted_integrated`。接受范围是连续区域地图母版、R2千人循环接线和任务图层交互；不代表最终地图美术、地点资产或工业化阶段已经接受。

R3的深色球体、永久格线、五张透明放大建筑、贴图锚点和普通地点跨大格表现均未进入R4。R2的连续时间、千人自循环、科研与生产分离、调查不暂停、保底回收、队列、固定产品生产行和严格存档迁移继续保留。

## 地图结果

- 区域底座为24公里、469个稳定规则格；默认格线隐藏；
- 地形、河流和道路以连续SVG路径跨越规则格；
- 避难所总部、既存聚居点、水源、食物点、仓库、精密工坊、两处工业废墟和旧路出口均为地点对象；
- 普通地点使用克制的地图符号与小型屋顶群，不再由大型透明立绘覆盖多格；
- 地图支持连续缩放、拖动和恢复总部视角，地点选择在镜头变化中保留；
- 工程与探索打开临时空间裁决格线；关闭后格线退出；科研和生产不显示格线；
- 科研、工程、生产继续以地图上方悬浮面板打开，地图不被切走。

## 验证

第四层最终通过：

- `npm run typecheck`；
- `npm run test:m0`；
- `npm run build -- --configLoader runner`；
- `git diff --check`。

浏览器实操覆盖：

- 1920×1080与1366×768无页面级溢出；
- 默认地图格线数量为0；工程面板打开后出现61个临时裁决格，关闭后恢复为0；
- 科研和生产面板打开时地图仍存在，格线保持为0；
- 调查开始后世界日期继续推进，没有自动暂停；
- 千人聚居接入、九项最低循环工程、普通零件保底回收和固定产品生产行完成实操；
- 第一层再次独立打开`http://127.0.0.1:4173/`，确认球面DOM为0、连续区域地图为1，工程/科研/生产的格线与地图共存行为符合执行单。

截图：

- `/Users/xujiangyue/.codex/worktrees/bf6a/always game/r4-region-map-1920x1080.png`；
- `/Users/xujiangyue/.codex/worktrees/bf6a/always game/r4-region-map-1366x768.png`。

## 当前未冻结

- 地形、道路、河流、农地与地点仍为灰盒至风格样张之间的程序图形，不是最终拟真美术；
- 当前只做第五分钟与千人循环，没有扩展工业化中期、能力终局、治理、正式军事或太空地图；
- 事件窗和部分中心标签仍会占用地图信息密度，后续是否缩减由用户本轮视觉审查决定；
- 第四层已创建只含十二个产品文件的本地提交`099aa0e6994078cc7e0a8bb92668e1b9880e7484`；两张验收截图未进入提交。用户随后授权把该提交无独立提交地并入主目录，与相关规则、验收和清理记录形成同一主线备份。
