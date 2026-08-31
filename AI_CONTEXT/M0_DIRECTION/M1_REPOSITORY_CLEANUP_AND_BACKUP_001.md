---
audit_id: AUDIT-M1-REPOSITORY-CLEANUP-AND-BACKUP-001
date: 2026-08-31
status: cleanup_completed_with_safety_retention
branch: context/m0-direction
accepted_product_source_commit: 099aa0e6994078cc7e0a8bb92668e1b9880e7484
---

# R4并入、空间清理与GitHub备份审计

## 已并入

- 第四层R4提交只含十二个产品文件，两张验收截图未进入提交；
- 主目录使用`cherry-pick -n`吸收产品差异，不保留独立中间提交，使产品、方向规则、审查和本审计进入同一主线同步批次；
- 主目录重新通过`npm run typecheck`、`npm run test:m0`、`npm run build -- --configLoader runner`与`git diff --check`。

## 已删除

- `src-tauri/target/`：约3.0GB，Git明确忽略的Rust构建缓存，可重新构建；
- `.cargo-home/`：约175MB，Git明确忽略的依赖下载缓存，可重新下载；
- `.npm-cache/`：约169MB，Git明确忽略的依赖下载缓存，可重新下载；
- 五个完全干净的历史工作树：`1999`、`5aa0`、`6695`、`bb75`、`cf20`，合计约110MB；
- 已提交并合入的R4工作树`bf6a`及其中两张未提交验收截图，约23MB。

主目录由清理前约3.5GB降至约289MB。`node_modules/`约86MB暂时保留，使下一阶段可以直接运行和验证。

## 安全保留但不进入GitHub备份

以下对象没有加入本次提交：

- `output/`约5.9MB：旧科技树PDF；
- `tmp/`约29MB：PDF渲染图、检查图和临时生成脚本；
- `AI_CONTEXT/M0_DIRECTION/visuals/`约21MB：早期视觉候选与校准图；
- `04bb`、`53a1`、`c8b8`三个历史工作树，合计约288MB。

前三个目录包含仍被历史规格引用的审查产物；三个工作树包含未提交差异。逐文件比对表明主目录已经具有更新规则、完整M1正文与规格，R4也已取代旧产品代码，但强制删除会不可恢复地丢弃未提交历史状态。因此本轮只把它们排除在GitHub备份之外，不冒充已经删除。后续若继续释放约344MB，必须把上述七个精确目标作为一次独立不可恢复清理处理。

## 保留规则

- 科技树、正文、规则、任务卡、决定、审查与退回记录全部保留并进入Git备份；
- R3错误视觉方向保留小体积文字退回证据，避免未来重复采用球体底图、永久格线、透明大型贴图和普通地点跨大格；
- 构建缓存、下载缓存、验收截图和已经迁移的干净工作树不作为项目事实，不进入Git备份。
