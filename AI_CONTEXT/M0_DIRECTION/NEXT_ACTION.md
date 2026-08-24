---
card_version: 1
handoff_id: M0-H002
routing_epoch: 3
routing_state: active
source_host: windows
source_lane: M0-DIR-B
source_session: M0-S002
target_host: mac
target_lane: M0-DIR-A
target_work_lane: M0-L1-DIRECTION
target_layer: 1
target_task: M0-L1-106
assigned_session: M0-S003
action_status: active
required_branch: context/m0-direction
startup_phrase: 你是第一层
---

# 唯一下一会话卡

## 下一步去哪里

- 设备：Mac。
- 逻辑方向 lane：`M0-DIR-A`。
- 稳定工作 lane：`M0-L1-DIRECTION`。
- 建议会话标题：`AG-M0｜L1-DIRECTION｜101-106｜MAC`。
- 当前 session：`M0-S003`。
- 已接受任务：`M0-L1-101`，acceptance 提交 `0e2637f`；`M0-L1-102`，acceptance 提交 `f8ae1e9`；`M0-L1-103`，acceptance 提交 `0e1723d`；`M0-L1-104`，acceptance 提交 `d34d6ab`；`M0-L1-105`，acceptance 提交 `ab02d36`。
- 当前任务：`M0-L1-106 · 工程与科技描述结构、风格与总规格冻结`，状态为 `active`。
- 当前输入：已接受的 `SPEC-M0-INTEGRATED-001`，路径 `specs/spec-m0-integrated-001.md`；以及 `REF-M0-ENGINEERING-TECH-STYLE-001`。
- 当前输出：`SPEC-M0-DESCRIPTION-001` 已创建并 active。
- 当前动作：第一项复核；检查“默认短卡、图标悬停说明成本/分类、名称或短表述悬停显示完整正文”是否符合预期。

Mac 已在原用户聊天中接管 `M0-H002` 并创建 `M0-S003`。UI 中是否新建聊天不再是前置；Git session、活动 lane 和任务 ID 才是接力身份。

## 当前路由步骤

1. `M0-L1-101` 已在 `0e2637f` accepted。
2. `SPEC-M0-OPS-001` 与 `M0-L1-102` 已在 `f8ae1e9` accepted。
3. 用户已在 `M0-S003-U016` 明确开始 `M0-L1-103`，任务已切到 `active`。
4. 用户在 `M0-S003-U021` 确认可登陆星球永久冰封两极、不可登陆资源星球不生成地表格；第一项整体 accepted，第二项恢复 active。
5. 用户在 `M0-S003-U022` 接受按工程占用格与总部连接判断选址；第二项 accepted，第三项转为 active。
6. 用户在 `M0-S003-U023` 接受四级情报、一次批准自动推进、暂停不清零和存档不重随；第三项 accepted，第四项转为 active。
7. 用户在 `M0-S003-U024` 认可第四项整体逻辑，并修正运输升级：卡车改变车队人力、载量和速度；叉车等工业载具改变所在设施装卸能力；路面、路基与桥涵单独限制通行和速度。第四项保持 active，等待修订版最终接受。
8. 用户在 `M0-S003-U025` 接受修订后的第四项，形成 `D-M0-PROD-029`；`SPEC-M0-MAP-001` 与 `M0-L1-103` 转入整体 review，尚未 accepted。
9. 用户在 `M0-S003-U026` 整体接受 `SPEC-M0-MAP-001` 与 `M0-L1-103`；`M0-L1-104` 只切到 ready，等待明确开始。
10. 用户在 `M0-S003-U027` 明确开始 `M0-L1-104`；创建 `SPEC-M0-PROGRESSION-001`，第一项科研控制转为 active。
11. 用户在 `M0-S003-U028` 修正第一项：删除“发展人力池”，明确玩家指定远期目标并自动补前置或手动预排序，以及领域按优先顺序自动推进两条控制路线；修订提案仍待接受。
12. 用户在 `M0-S003-U029` 接受第一项修订稿，形成 `D-M0-PROD-030`；`Q-M0-006` resolved，第二项精密制造中心与勘测无人机实体链转为 active。
13. 用户在 `M0-S003-U030` 修正第二项前提：避难所有封闭内部供电和兼容设备接口，但没有对外工业供能能力；撤回专用人力充电台，并把科技发展改为档案复原与超出基础水平后的发现、尝试、落地、改进。旧运营与地图规格中的“避难所完全无电”原因文字已窄范围修订，accepted 状态不变；第二项仍为提案，等待整体接受。
14. 用户在 `M0-S003-U031` 接受修订后的第二项，形成 `D-M0-PROD-031`；`Q-M0-015`、`Q-M0-027` resolved，第三项第一座前哨完整首建、稳定验收与标准工程包转为 active。
15. 用户在 `M0-S003-U032` 至 `U033` 接受第三项核心链路，并补充首次阶段报告、逐段物资与设备需求、实体设备改善对应环节和前后耗时直观显示，形成 `D-M0-PROD-032`；第三项 accepted，第四项转为 active。
16. 用户在 `M0-S003-U034` 接受第四项，形成 `D-M0-PROD-033`；`Q-M0-029` resolved，`SPEC-M0-PROGRESSION-001` 与 `M0-L1-104` 转入整体 review，`M0-L1-105` 继续 blocked_upstream。
17. 用户在 `M0-S003-U035` 整体接受 `SPEC-M0-PROGRESSION-001` 与 `M0-L1-104`；`Q-M0-030` resolved，`M0-L1-105` 只切到 ready，等待明确开始。
18. 用户在 `M0-S003-U036` 明确开始 `M0-L1-105`，并要求在 105 后增加工程与科技描述风格环节；创建 `SPEC-M0-INTEGRATED-001`，105 转为 active，新增 `M0-L1-106` 与 `D-M0-DIR-007`，最终冻结移到 106。
19. 用户在 `M0-S003-U037` 接受第一项，形成 `D-M0-PROD-034`；`Q-M0-031` resolved，`T00` accepted，第二项 `T01/T02` 与 `Q-M0-033` 转为 active。
20. 用户在 `M0-S003-U038` 接受第二项，形成 `D-M0-PROD-035`；同时授权 AI 自行完成后续推演并一次性交付总结，形成 `D-M0-DIR-008`。三条 90 日路线、固定事故、人口变化和存档重载已 `self_checked`；`Q-M0-034` active，等待用户整体判断。
21. 用户在 `M0-S003-U039` 整体接受 `SPEC-M0-INTEGRATED-001` 与 `M0-L1-105`，形成 `D-M0-PROD-036`；验收提交为 `ab02d36`。`Q-M0-034` resolved，`M0-L1-106` 与 `Q-M0-032` 只切到 ready；整套 M0 尚未冻结。
22. 用户在 `M0-S003-U040` 明确开始 `M0-L1-106`；创建 `SPEC-M0-DESCRIPTION-001`，任务与 `Q-M0-032` 转为 active，第一项 active、其余七项 pending；整套 M0 仍未冻结。
23. 用户在 `M0-S003-U041` 明确不接受第一项第一次提案，指出“列表四行、详情十项”是底层逻辑，不是玩家看到的科研内容；第一项转为 active_rework。
24. 用户在 `M0-S003-U042` 要求查看一个《群星》科研案例和一个此前附件中的科研案例，找不到时再核对对应小说原文；已找到《群星》的“动力外骨骼”、附件中的“工蜂-7工业外骨骼”，并补充核对小说“起航雷达”短摘。
25. 用户在 `M0-S003-U043` 认可短卡加完整正文的组合方向，并纠正《群星》卡片信息层级：默认不常驻“工程学、工业技术、T1、基础花费”等文字；成本与分类由小图标悬停说明，名称或短表述悬停显示完整正文。第一项转为 active_review。

## 当前正确状态至少包含

```text
状态：ACTIVE
层级：第一层｜方向与系统设计
活动 lane：M0-DIR-A｜Mac｜M0-S003
当前任务：M0-L1-106｜工程与科技描述结构、风格与总规格冻结
任务状态：active
已接受输出：SPEC-M0-PLAY-001｜specs/spec-m0-play-001.md｜0e2637f
已接受输出：SPEC-M0-OPS-001｜specs/spec-m0-ops-001.md｜f8ae1e9
不会做：故事正文、最终玩家文字、游戏代码和 main 修改
已接受输出：SPEC-M0-MAP-001｜specs/spec-m0-map-001.md｜0e1723d
已接受输出：SPEC-M0-PROGRESSION-001｜specs/spec-m0-progression-001.md｜d34d6ab
已接受输出：SPEC-M0-INTEGRATED-001｜specs/spec-m0-integrated-001.md｜ab02d36
当前输出：SPEC-M0-DESCRIPTION-001｜specs/spec-m0-description-001.md｜active
当前项：第一项｜玩家先看到的玩法信息与展开顺序｜active_review
默认卡：科技图像｜名称｜直接效果或解锁｜一句短表述｜成本/分类图标
悬停：图标显示准确说明｜名称或短表述显示完整正文
下一步：用户复核三个状态；接受后进入第二项
```

## 完成条件

`M0-L1-105` 已在 `ab02d36` accepted，`M0-L1-106` 已 active。第一项修订卡片正在复核；之后仍需逐项接受描述结构、技术可信度、文体、强度、长度、动态字段与分层交接，并最终整体接受，才可标记 `overall_spec_frozen`。
