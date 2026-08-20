---
workflow_id: always-game-m0-four-layer
workflow_version: 1
milestone: M0-personal-playable
direction_branch: context/m0-direction
active_tasks: AI_CONTEXT/M0_DIRECTION/ACTIVE_TASKS.md
task_packages: AI_CONTEXT/M0_DIRECTION/TASK_PACKAGES.md
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
4. 阅读所选层级的角色文件。
5. 阅读 `PLAIN_LANGUAGE_RULES.md`。
6. 阅读 `ACTIVE_TASKS.md`，只选择该层当前任务。
7. 阅读 `TASK_PACKAGES.md` 中对应任务卡。
8. 检查全部依赖、输入版本、允许路径和禁止事项。
9. 返回启动回执，等待用户明确说“开始”或给出实际任务；启动语本身不授权写入。

Codex 在每个新任务开始时建立一次全局到项目的说明链。安装或修改入口后，必须新建任务测试，不能用已经打开的旧任务证明新入口生效。全局入口还必须先检查 `AGENTS.override.md` 是否存在，因为它会覆盖同级 `AGENTS.md`。

## 任务选择规则

- 每个层级最多只能有一个 `ready` 或 `active` 任务。
- 一个任务为 `ready`：返回 `READY`，显示任务 ID，但不自动开始。
- 当前任务为 `blocked_upstream`：返回 `BLOCKED_UPSTREAM`，写明阻塞任务和恢复动作。
- 工作流入口尚未安装：返回 `BLOCKED_WORKFLOW`，只允许执行 `M0-L4-000` 的一次性安装任务。
- 同层出现两个可执行任务：返回 `TASK_CONFLICT`，不得自行挑选。
- 任务卡、角色卡或写入白名单缺失：返回 `BLOCKED_CONTRACT`，不得补默认规则。
- Git 落后、分叉或当前目录错误：返回 `BLOCKED_GIT`，不得强制覆盖。

## 固定启动回执

```text
状态：READY / BLOCKED_UPSTREAM / BLOCKED_WORKFLOW / TASK_CONFLICT / BLOCKED_CONTRACT / BLOCKED_GIT
项目：Always Game
里程碑：M0 个人完整试玩版
层级：<第一至第四层｜名称>
协议：M0 四层工作流 v1
Git 基线：<branch>@<commit>
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

## 当前一次性启动例外

项目入口和 Mac/Windows 全局短语路由尚未安装。因此第一次执行 `M0-L4-000` 时，不能假装一句话路由已经生效，必须使用该任务卡中的完整引导语。安装并验证后，后续会话才只需输入“你是第 N 层”。

官方行为依据：[OpenAI Docs：Custom instructions with AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)。
