# M0 方向会话索引

| Session | Lane | Host | 开始时间 | 状态 | 最后记录 | 文件 |
|---|---|---|---|---|---|---|
| `M0-S001` | `M0-DIR-A` | `mac` | 2026-08-20 11:59 +08:00 | closed | `M0-S001-A035` | `sessions/20260820-1159-mac-m0-s001.md` |
| `M0-S002` | `M0-DIR-B` | `windows` | 2026-08-20 20:34 +08:00 | closed | `M0-S002-A014` | `sessions/20260820-2034-windows-m0-s002.md` |
| `M0-S003` | `M0-DIR-A` | `mac` | 2026-08-21 11:55 +08:00 | active | `M0-S003-A012` | `sessions/20260821-1155-mac-m0-s003.md` |

补记：`M0-S002-AMEND-001` 记录交接推送等待期间遗漏的一条可见 commentary；它不改变 `M0-S002-A014` 的最终记录或任何路由状态。文件：`sessions/20260820-2228-windows-m0-s002-amendment-001.md`。

## 规则

- Session ID 全局唯一并单调增加。
- 每次设备、聊天或活动 lane 切换时创建新 session。
- closed session 不再改写；修正通过 amendment 或下一 session 引用。
- `ACTIVE.md` 的 `last_session` 和 `last_turn` 必须能在本索引与对应文件中找到。
