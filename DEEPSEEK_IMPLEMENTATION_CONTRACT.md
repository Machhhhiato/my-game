# DeepSeek 实现交接约定

## 角色边界

DeepSeek 是本项目的**实现工程师**，不是视觉设计师、产品负责人或创意裁决者。所有界面视觉以 `P1-S01_VISUAL_BASELINE.md`、`P1-S01_UI_SPEC.md` 和本任务包为准。

- 可以：用 React、Canvas、CSS、TypeScript 将已明确的规则实现为稳定、低资源消耗的功能；修正明确的技术缺陷；报告无法由文字确定的阻塞点。
- 不可以：自行改动布局、颜色体系、字号层级、地图图层顺序、弹窗位置、信息密度或交互范围；自行增加常驻面板、图标、装饰、微操系统；把技术完成等同于视觉验收通过。
- 遇到未定义的视觉选择：停止在该选择处，说明“缺什么、会影响哪里、可选的最小方案”；等待裁决，不猜测。

## 任务回报纪律

1. 实现过程中可以在 Harness 内部显示进度，但不得要求 Codex 对中间文本作反馈。
2. 完成时的回报必须包含：修改文件、未修改的范围、执行的命令及结果、所有截图路径、已知限制、唯一需要裁决的问题（如有）。
3. 不得用“无法目视核对”“DOM 存在”替代视觉结论；只能如实陈述可自动验证的事实。
4. 不得提交、推送、删除旧代码/旧存档、引入依赖或扩大任务范围，除非任务明确授权。

## 完成信号：只在正式完成后触发

仅当以下条件全部成立时，作为最后一个动作执行：

```bash
mkdir -p .codex/review-reports
# 先将最终 Harness 回报的相同内容写入：
# .codex/review-reports/<任务编号>.md
node scripts/review-handoff.mjs mark \
  --task <任务编号> \
  --summary "<一句话完成内容>" \
  --report .codex/review-reports/<任务编号>.md \
  --artifact <截图或关键产物路径> [--artifact <更多产物路径>]
```

该 Markdown 必须包含：修改文件、执行命令及结果、截图/关键产物路径、客观已知限制、待裁决问题。该命令会重新执行 `npm run typecheck`、`npm run build` 和 `git diff --check`；全部通过且产物和正式回报存在后，才会原子写入 `.codex/review-ready.json`。若任一步失败，不产生完成信号，继续修复或报告失败。

Codex 只在完成信号出现后执行 `node scripts/review-handoff.mjs read --task <任务编号>` 读取正式回报，因此不要在中间阶段运行该命令，也不要手工创建、编辑或保留该 JSON 文件。
