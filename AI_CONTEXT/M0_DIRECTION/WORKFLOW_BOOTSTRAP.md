---
workflow_id: always-game-m0-four-layer
workflow_version: 2
milestone: M0-personal-playable
direction_branch: context/m0-direction
active_tasks: AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md
task_packages: AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md
next_action: AI_CONTEXT/M0_DIRECTION/NEXT_ACTION.md
session_routing: AI_CONTEXT/M0_DIRECTION/SESSION_ROUTING.md
---

# M0 四层会话启动入口

本文件定义“你是第 N 层”之后必须发生什么。层号只选择职责；当前任务、依赖、写入范围和完成条件必须从 Git 文件读取，不能从聊天记忆猜。

## 固定映射

| 启动语 | 层级 | 角色文件 |
|---|---|---|
| `你是第一层` | 方向与系统设计 | `roles/l1-direction-system.md` |
| `你是第二层` | 故事、任务与临时事件 | `roles/l2-story-events.md` |
| `你是第三层` | 玩家可见文字 | `roles/l3-player-text.md` |
| `你是第四层` | 代码操作、运行与验证 | `roles/l4-implement-verify.md` |

层号永久固定，不因模型、设备、任务或阶段变化而重新编号。

## 启动时的读取顺序

1. 找到唯一的 Always Game Git 仓库；找不到或找到多个时停止。
2. 核对远端 `context/m0-direction`，确认本地记录没有落后、分叉或未提交冲突。
3. 阅读本文件。
4. 阅读 `NEXT_ACTION.md`，确认下一目的地、设备、层级和任务。
5. 阅读 `SESSION_ROUTING.md`，确认当前是活动、交接等待还是阻塞。
6. 阅读 `ACTIVE_TASKS.md`，只选择该层当前任务。
7. 阅读所选层级的角色文件。
8. 阅读 `PLAIN_LANGUAGE_RULES.md`。
9. 阅读 `TASK_PACKAGES.md` 中对应任务卡。
10. 检查全部依赖、输入版本、允许路径和禁止事项。
11. 返回启动回执，等待用户明确说“开始 <task_id>”；启动语本身不授权执行产品任务。

Codex 在每个新任务开始时建立一次全局到项目的说明链。安装或修改入口后，必须新建任务测试，不能用已经打开的旧任务证明新入口生效。全局入口还必须先检查 `AGENTS.override.md` 是否存在，因为它会覆盖同级 `AGENTS.md`。

## 任务选择规则

- 每个层级最多只能有一个 `ready` 或 `active` 任务。
- 一个任务为 `ready`：返回 `READY`，显示任务 ID，但不自动开始。
- 一个任务为 `review`：返回 `REVIEW`，显示输出 ID、路径和待确认项；等待用户接受或修订，不得启动下一任务。
- 当前任务为 `blocked_upstream`：返回 `BLOCKED_UPSTREAM`，写明阻塞任务和恢复动作。
- 项目根短语入口缺失：返回 `BLOCKED_WORKFLOW`；不得假装全局路由或聊天记忆可以替代项目入口。
- 同层出现两个可执行任务：返回 `TASK_CONFLICT`，不得自行挑选。
- 任务卡、角色卡或写入白名单缺失：返回 `BLOCKED_CONTRACT`，不得补默认规则。
- Git 落后、分叉或当前目录错误：返回 `BLOCKED_GIT`，不得强制覆盖。

## 固定启动回执

```text
状态：READY / REVIEW / BLOCKED_UPSTREAM / BLOCKED_WORKFLOW / TASK_CONFLICT / BLOCKED_CONTRACT / BLOCKED_GIT
项目：Always Game
里程碑：M0 个人完整试玩版
层级：<第一至第四层｜名称>
协议：M0 四层工作流 v2
Git 基线：<branch>@<commit>
会话目的地：<stable lane｜host｜建议标题>
当前任务：<task_id｜名称>
任务状态：<status>
依赖：<满足项或阻塞项>
可以做：<任务卡允许范围>
不会做：<角色卡与任务卡禁区>
下一步：等待用户开始 / 先完成具体上游任务
```

## 完成后的回传

任务会话不得自行把下一个任务改为可执行。它只回传：

- 任务 ID 与输入版本；
- 实际输出及路径；
- 验证证据；
- 提交与分支；
- 未完成项、偏差和阻塞；
- 是否建议进入下一任务。

第一层方向 lane 核对证据后，才更新 `ACTIVE_TASKS.md`。这避免两个会话同时改任务顺序。

## 当前入口范围

- 项目内入口：已安装在 `context/m0-direction` 的项目根 `AGENTS.md`；必须从真实仓库根目录新建任务。
- Mac 下一次接管：拉取方向分支后，以 `你是第一层` 恢复 `M0-L1-101` 的 review；用户接受汇编后才解锁 `M0-L1-102`。
- 全局跨项目入口：暂缓；从任意其他项目目录输入短语，不保证能自动找到 Always Game。
- `M0-L4-000`：保留为将来可选的全局路由扩展与完整多设备测试，不再阻塞第一层产品讨论。

官方行为依据：[OpenAI Docs：Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。
