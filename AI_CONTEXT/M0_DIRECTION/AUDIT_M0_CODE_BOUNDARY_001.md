---
output_id: AUDIT-M0-CODE-BOUNDARY-001
task_id: M0-L4-011
status: accepted
created_at: 2026-08-25T16:34:00+08:00
source_thread: 01a03800-3d9f-7c70-b1dc-70a30bc8bf01
source_models:
  - gpt-5.3-codex-spark/high (quota_exhausted_before_final)
  - gpt-5.6-terra/high (completed_same_thread)
scope: read_only_file_boundary_audit
overall_spec_frozen: true
implementation_authorized: false
user_acceptance: accepted_with_implementation_preflight
acceptance_source: M0-S003-U105
accepted_at: 2026-08-25T16:53:36+08:00
---

# AUDIT-M0-CODE-BOUNDARY-001

## 第一层复核结论

修订版已满足本轮“逐文件归类”的完成条件：运行、构建、测试和资源相关文件共 353 个，已分类 353 个，未分类 0 个；下层任务全程只读，没有修改、移动、删除、安装、提交、推送或运行测试。

用户已经接受本审计，但它不能直接当作删除执行单：97 个文件只是满足前置条件后的拟删除候选；186 个文件仍缺少函数级依赖或全仓零引用证据。用户决定不再为 186 项单独建立大审计任务，而是在相应实现批次开始前逐组检查。接受只确认边界、顺序和后续检查方法，不等于授权删除或修改代码。

## 覆盖核对

| 范围 | 文件数 | 分类数 |
|---|---:|---:|
| 运行、构建、测试、资源相关文件 | 353 | 353 |
| `public/` | 0（目录不存在） | 0 |
| 文档与 `AI_CONTEXT` 治理文件 | 149 | 单列保留，不逐篇分析 |
| 未分类 | 0 | 0 |

分类结果：

- 保留：64
- 改造后保留：6
- 拟删除：97
- 无法判断：186

`.git` 是工作树元数据，不属于本次运行、构建、测试与资源集合。

## 保留（64）

明确消费者是 M0 的工程外壳、构建、打包或项目治理，不包含旧玩法代码。

```text
.gitignore
.npmrc
package-lock.json
tsconfig.json
vite.config.ts
src/assets.d.ts

src-tauri/Cargo.lock
src-tauri/build.rs
src-tauri/capabilities/default.json
src-tauri/src/lib.rs
src-tauri/src/main.rs

src-tauri/icons/128x128.png
src-tauri/icons/128x128@2x.png
src-tauri/icons/32x32.png
src-tauri/icons/64x64.png
src-tauri/icons/Square107x107Logo.png
src-tauri/icons/Square142x142Logo.png
src-tauri/icons/Square150x150Logo.png
src-tauri/icons/Square284x284Logo.png
src-tauri/icons/Square30x30Logo.png
src-tauri/icons/Square310x310Logo.png
src-tauri/icons/Square44x44Logo.png
src-tauri/icons/Square71x71Logo.png
src-tauri/icons/Square89x89Logo.png
src-tauri/icons/StoreLogo.png
src-tauri/icons/app-icon.png
src-tauri/icons/icon.icns
src-tauri/icons/icon.ico
src-tauri/icons/icon.png
src-tauri/icons/android/mipmap-anydpi-v26/ic_launcher.xml
src-tauri/icons/android/mipmap-hdpi/ic_launcher.png
src-tauri/icons/android/mipmap-hdpi/ic_launcher_foreground.png
src-tauri/icons/android/mipmap-hdpi/ic_launcher_round.png
src-tauri/icons/android/mipmap-mdpi/ic_launcher.png
src-tauri/icons/android/mipmap-mdpi/ic_launcher_foreground.png
src-tauri/icons/android/mipmap-mdpi/ic_launcher_round.png
src-tauri/icons/android/mipmap-xhdpi/ic_launcher.png
src-tauri/icons/android/mipmap-xhdpi/ic_launcher_foreground.png
src-tauri/icons/android/mipmap-xhdpi/ic_launcher_round.png
src-tauri/icons/android/mipmap-xxhdpi/ic_launcher.png
src-tauri/icons/android/mipmap-xxhdpi/ic_launcher_foreground.png
src-tauri/icons/android/mipmap-xxhdpi/ic_launcher_round.png
src-tauri/icons/android/mipmap-xxxhdpi/ic_launcher.png
src-tauri/icons/android/mipmap-xxxhdpi/ic_launcher_foreground.png
src-tauri/icons/android/mipmap-xxxhdpi/ic_launcher_round.png
src-tauri/icons/android/values/ic_launcher_background.xml
src-tauri/icons/ios/AppIcon-20x20@1x.png
src-tauri/icons/ios/AppIcon-20x20@2x-1.png
src-tauri/icons/ios/AppIcon-20x20@2x.png
src-tauri/icons/ios/AppIcon-20x20@3x.png
src-tauri/icons/ios/AppIcon-29x29@1x.png
src-tauri/icons/ios/AppIcon-29x29@2x-1.png
src-tauri/icons/ios/AppIcon-29x29@2x.png
src-tauri/icons/ios/AppIcon-29x29@3x.png
src-tauri/icons/ios/AppIcon-40x40@1x.png
src-tauri/icons/ios/AppIcon-40x40@2x-1.png
src-tauri/icons/ios/AppIcon-40x40@2x.png
src-tauri/icons/ios/AppIcon-40x40@3x.png
src-tauri/icons/ios/AppIcon-512@2x.png
src-tauri/icons/ios/AppIcon-60x60@2x.png
src-tauri/icons/ios/AppIcon-60x60@3x.png
src-tauri/icons/ios/AppIcon-76x76@1x.png
src-tauri/icons/ios/AppIcon-76x76@2x.png
src-tauri/icons/ios/AppIcon-83.5x83.5@2x.png
```

保留理由：

- `.npmrc`、`package-lock.json`、`vite.config.ts`、`tsconfig.json`：M0 依赖解析、类型检查和 Vite 构建。
- `src/assets.d.ts`：M0 前端资源导入声明。
- `src-tauri/src/*`、`build.rs`、`Cargo.lock`、`capabilities/default.json`：M0 桌面应用宿主。
- `src-tauri/icons/**`：当前 Tauri 打包资源；顶层图标被 `tauri.conf.json` 直接引用。当前未冻结平台裁剪范围，因此暂不删跨平台图标。
- `.gitignore`：M0 构建产物与本地状态的仓库卫生。
- 项目治理文档与 `AI_CONTEXT` 共 149 个文件，整体保留，不纳入玩法删除判断。

## 改造后保留（6）

| 文件 | M0 消费者 | 改造边界 |
|---|---|---|
| `index.html` | M0 浏览器页面和 React 根节点 | 保留单入口，移除旧产品文案。 |
| `package.json` | M0 的开发、类型检查、构建和 Tauri 命令 | 增加 M0 自动测试链；当前没有统一测试命令。 |
| `src-tauri/Cargo.toml` | M0 Tauri/Rust 依赖与桌面目标 | 更正旧 `ColonyToStars`/M1 名称与说明。 |
| `src-tauri/tauri.conf.json` | M0 桌面窗口、前端构建和打包配置 | 更正旧产品名、标题和窗口文案。 |
| `src/main.tsx` | M0 浏览器启动入口 | 只挂载新的 `M0App`；删除旧查询路由。 |
| `src/v2/world/geoGrid.ts` | M0 本地地图的稳定地点 ID、邻接和地理引用 | 只抽取无世界观的接口，不保留旧三角全球网格。 |

## 拟删除（97）

所有拟删除项都必须先满足：M0 最小入口替代默认入口、没有剩余导入、M0 测试已经替代有效旧断言。它们不是本轮授权删除项。

### 初代 `src/` 旧游戏簇（47）

这些文件不在默认 Vite 运行导入图中，但因 `tsconfig.json` 覆盖整个 `src`，仍参与 TypeScript 构建检查。它们属于旧“殖民地到银河”链，没有 M0 消费者。

```text
src/App.tsx
src/content/buildings.ts
src/content/colonists.ts
src/content/directions.ts
src/content/galaxy.ts
src/content/solar.ts
src/content/spaceProgram.ts
src/content/techs.ts
src/content/world.ts
src/core/events-run.ts
src/core/galaxy.ts
src/core/rates.ts
src/core/save.ts
src/core/solar.ts
src/core/space.ts
src/core/state.ts
src/core/tick.ts
src/core/types.ts
src/core/util.ts
src/core/world.ts
src/engine.ts
src/render/colony.ts
src/render/galaxy.ts
src/render/planet.ts
src/render/solar.ts
src/render/world.ts
src/store/useGame.ts
src/styles.css
src/ui/BuildMenu.tsx
src/ui/ColonistBar.tsx
src/ui/ColonyView.tsx
src/ui/DetailsPanel.tsx
src/ui/EventLog.tsx
src/ui/GalaxyView.tsx
src/ui/LogPanel.tsx
src/ui/NavPanel.tsx
src/ui/Overlays.tsx
src/ui/ResearchPanel.tsx
src/ui/SettingsPanel.tsx
src/ui/SolarView.tsx
src/ui/SpacePanel.tsx
src/ui/TargetPanel.tsx
src/ui/TimeControls.tsx
src/ui/TopBar.tsx
src/ui/WidgetMode.tsx
src/ui/WorldView.tsx
src/ui/meta.ts
```

### R38 UI、样式和旧文本战役簇（39）

当前 `src/main.tsx` 默认进入 `CampaignGlobeApp`；其他旧入口可通过查询参数或延迟导入进入。删除前必须先切换成 M0 唯一入口。

```text
src/v2/fixtures/legacy-valley/manifest.ts
src/v2/v2.css

src/v2/textIdle/campaignTemplates.ts
src/v2/textIdle/content.ts
src/v2/textIdle/exploration.ts
src/v2/textIdle/playtestGuidance.ts
src/v2/textIdle/regionalBridge.ts
src/v2/textIdle/regionalCampaign.ts
src/v2/textIdle/simulation.ts
src/v2/textIdle/starterContent.ts
src/v2/textIdle/strategicMapModel.ts
src/v2/textIdle/types.ts
src/v2/textIdle/unifiedNation.ts

src/v2/ui/CampaignGlobeApp.tsx
src/v2/ui/CommandBar.tsx
src/v2/ui/EventLog.tsx
src/v2/ui/GlobalUnificationPlaytestApp.tsx
src/v2/ui/LayerToggles.tsx
src/v2/ui/LeftRail.tsx
src/v2/ui/NationKernelInspector.tsx
src/v2/ui/ObjectPanel.tsx
src/v2/ui/ObserverDrawer.tsx
src/v2/ui/OperationPanel.tsx
src/v2/ui/PlanetCanvas.tsx
src/v2/ui/RegionalCampaignApp.tsx
src/v2/ui/ResourceLedger.tsx
src/v2/ui/RetirementNotice.tsx
src/v2/ui/StageRoadmap.tsx
src/v2/ui/StrategicCabinetApp.tsx
src/v2/ui/StrategicGlobe.tsx
src/v2/ui/TextIdleApp.tsx
src/v2/ui/TopToolbar.tsx
src/v2/ui/UnifiedNationCampaignApp.tsx
src/v2/ui/V2App.tsx

src/v2/ui/campaignGlobe.css
src/v2/ui/globalUnification.css
src/v2/ui/nationKernel.css
src/v2/ui/strategicCabinet.css
src/v2/ui/textIdle.css
```

依赖边界：

- `CampaignGlobeApp.tsx` 是当前默认入口，读取 `always-game-text-idle-v6`。
- `TextIdleApp.tsx` 是 `?text=1` 旧入口。
- `V2App.tsx` 是 `?map=1` 旧入口。
- `NationKernelInspector.tsx`、`UnifiedNationCampaignApp.tsx`、`StrategicCabinetApp.tsx` 由 `kernel`、`kernel=unified`、`playtest=r37` 路由进入。
- `regionalBridge.ts` 是旧文本存档向区域/统一国家的迁移桥；M0 已明确不迁移旧存档。
- `content.ts` 引用旧 JSON；这些 JSON 本轮尚不能删除，列入“无法判断”。

### 旧文本战役手工测试脚本（11）

这些脚本不在 `package.json` 生命周期中，只是人工执行的旧战役测试入口。删除前必须用 M0 测试替换仍有价值的断言。

```text
scripts/r10-text-idle-sim.ts
scripts/r15-playable-framework-sim.ts
scripts/r20-route-simulation.ts
scripts/r21-regional-bridge-sim.ts
scripts/r22-regional-integration-sim.ts
scripts/r23-unified-nation-sim.ts
scripts/r24-exploration-engagement-sim.ts
scripts/r25-template-separation-sim.ts
scripts/r26-growth-exploration-sim.ts
scripts/r38-globe-map-simulation.ts
scripts/r38-template-horizon-simulation.ts
```

## 无法判断（186）

这些文件既没有冻结的 M0 消费者，也缺少足够证据证明可以删除。下一步必须按函数级依赖或全仓零引用继续判断，不能按“以后可能有用”保留，也不能凭直觉删除。

### 旧内容、静态资料与视觉基线（54）

```text
content/r5/stage-1/map-asset-family-manifest.json
content/r5/stage-1/map-asset-manifest.json
content/r5/stage-1/policy-catalog.json
content/r5/stage-1/project-catalog.json
content/r5/stage-1/summary.json
content/r5/stage-1/tech-catalog.json
content/r6/stage-1/player-copy.json
content/r6/stage-1/summary.json
content/r8/texture-production-manifest.json

cp2_tech_buttress.html
cp2_tech_cybernetics.html
cp2_tech_future_tech.html
cp2_tech_offworld_mission.html
cp2_tech_refining.html
cp_tech_advanced_ai.html
cp_tech_advanced_power_cells.html
cp_tech_offworld_mission.html
cp_tech_predictive_systems.html
cp_tech_seasteads.html
cp_tech_smart_materials.html
cpx_tech_combustion.html
cpx_tech_education.html
cpx_tech_plastics.html
cpx_tech_steel.html
cx_currency.html
cx_economics.html
cx_gunpowder.html
cx_steel.html
design/visual-baseline/p1-planet-far.png
design/visual-baseline/p1-river-valley-close.png
design/visual-baseline/p1-river-valley-medium.png
fut.html
futera2.html
gamersky.html
gs_techs.json
gsk_2.html
gsk_3.html
gsk_4.html
gsk_5.html
gsk_6.html
gsk_7.html
gsk_8.html
gsk_9.html
zh_buttress.html
zh_tech_advanced_ai.html
zh_tech_advanced_power_cells.html
zh_tech_buttress.html
zh_tech_cybernetics.html
zh_tech_future_tech.html
zh_tech_offworld_mission.html
zh_tech_predictive_systems.html
zh_tech_refining.html
zh_tech_seasteads.html
zh_tech_smart_materials.html
```

其中四个旧内容 JSON 已被旧 `textIdle/content.ts` 引用；在入口切换和全仓零引用证明前不得删除。

### 其余手工脚本（47）

```text
scripts/build-r5-stage1-content.mjs
scripts/build-r6-stage1-player-copy.mjs
scripts/build-r7-discovery-index.mjs
scripts/build-r8-texture-production-manifest.mjs
scripts/check-map-assets.mjs
scripts/civilization-sim-fixture.ts
scripts/gen-icon.mjs
scripts/p1-s02-sim.ts
scripts/p1-s03-population-stage-sim.ts
scripts/p1-s03a-runtime-sim.ts
scripts/p1-s03c-continuous-nation-sim.ts
scripts/pre-r37-maritime-aerospace-space-sim.ts
scripts/r11-nation-kernel-sim.ts
scripts/r11-save-fixtures-sim.ts
scripts/r12-unified-nation-sim.ts
scripts/r13-diplomatic-conflict-sim.ts
scripts/r14-content-package-sim.ts
scripts/r1b-balance-audit.ts
scripts/r2-v6-sim.ts
scripts/r28-civilization-core-sim.ts
scripts/r28-ground-content-sim.ts
scripts/r29-industrial-production-sim.ts
scripts/r30-r32-conflict-governance-sim.ts
scripts/r33-r36-state-systems-sim.ts
scripts/r37-all-board-direction-sim.ts
scripts/r37-global-unification-integration-sim.ts
scripts/r37-industrial-logistics-direction-sim.ts
scripts/r37-playtest-route-sim.ts
scripts/r37-politics-events-cooperation-sim.ts
scripts/r37-strategic-direction-matrix-sim.ts
scripts/r37-timeline-content-sim.ts
scripts/r4-1-save-migration-sim.ts
scripts/r4-1-world-blueprint-sim.ts
scripts/r4-map-state-sim.ts
scripts/r6-demo-acceptance.ts
scripts/r7-discovery-index-sim.ts
scripts/r8-map-foundation-sim.ts
scripts/r8-settlement-facts-sim.ts
scripts/r8-world-surface-sim.ts
scripts/r9-world-skeleton-sim.ts
scripts/review-handoff.mjs
scripts/s0a-data-skeleton-sim.ts
scripts/sim.ts
scripts/validate-r5-stage1-content.mjs
scripts/validate-r6-stage1-player-copy.mjs
scripts/validate-r7-discovery-index.mjs
scripts/validate-r8-texture-production-manifest.mjs
```

### 初代 Tauri 前端辅助桥（1）

```text
src/lib/tauri.ts
```

它只被初代 `App.tsx` 使用。M0 若需要 Tauri 前端 API，应新建明确调用方或单独抽取；本轮不假定复用。

### V2 资产、内容、核心、NationKernel、地图生成与渲染（84）

```text
src/v2/assets/facility-greenhouse.png
src/v2/assets/facility-radio-tower.png
src/v2/assets/facility-water-main.png
src/v2/assets/facility-workshop.png
src/v2/assets/map/settlements/river-camp-01.png
src/v2/assets/map/settlements/river-city-01.png
src/v2/assets/map/settlements/river-settlement-01.png
src/v2/assets/map/settlements/river-worktown-01.png
src/v2/assets/map/terrain/arid/dry-wash.png
src/v2/assets/map/terrain/arid/dune-field.png
src/v2/assets/map/terrain/arid/mesa-outcrop.png
src/v2/assets/map/terrain/coast/beach-inlet.png
src/v2/assets/map/terrain/coast/cliff-headland.png
src/v2/assets/map/terrain/coast/estuary.png
src/v2/assets/map/terrain/forest/dense-canopy.png
src/v2/assets/map/terrain/forest/open-canopy.png
src/v2/assets/map/terrain/forest/woodland-edge.png
src/v2/assets/map/terrain/highland/broken-shelf.png
src/v2/assets/map/terrain/highland/escarpment.png
src/v2/assets/map/terrain/highland/hill-mass.png
src/v2/assets/map/terrain/mountain/ridge-crest.png
src/v2/assets/map/terrain/mountain/shoulder-slope.png
src/v2/assets/map/terrain/mountain/single-peak.png
src/v2/assets/map/terrain/mountain/snow-cap.png
src/v2/assets/map/terrain/plain/field-mosaic.png
src/v2/assets/map/terrain/plain/scrub-border.png
src/v2/assets/map/terrain/river_valley/river-bank.png
src/v2/assets/map/terrain/river_valley/terraced-field.png
src/v2/assets/map/terrain/river_valley/wetland-fringe.png
src/v2/assets/map/terrain/tundra/frost-heath.png
src/v2/assets/map/terrain/tundra/ice-rock.png
src/v2/assets/map/terrain/tundra/snow-drift.png

src/v2/content/campaignStage.ts
src/v2/content/copyKeys.ts
src/v2/content/definitions.ts
src/v2/content/facilities.ts
src/v2/content/metrics.ts
src/v2/content/projectMapEffects.ts
src/v2/content/requirements.ts
src/v2/content/settlements.ts
src/v2/content/stage1Discovery.ts

src/v2/contracts/index.ts
src/v2/contracts/types.ts
src/v2/contracts/validate.ts
src/v2/data.ts
src/v2/nation.ts

src/v2/nationKernel/assetPresentation.ts
src/v2/nationKernel/civilizationSystems.ts
src/v2/nationKernel/contentPackage.ts
src/v2/nationKernel/diplomaticConflictContent.ts
src/v2/nationKernel/fixture.ts
src/v2/nationKernel/globalUnificationDevelopmentContent.ts
src/v2/nationKernel/globalUnificationFixture.ts
src/v2/nationKernel/index.ts
src/v2/nationKernel/industrialStrategy.ts
src/v2/nationKernel/quantityCatalog.ts
src/v2/nationKernel/r28GroundContent.ts
src/v2/nationKernel/saveFixtures.ts
src/v2/nationKernel/simulation.ts
src/v2/nationKernel/strategicBoardContent.ts
src/v2/nationKernel/strategicDirectionContent.ts
src/v2/nationKernel/types.ts
src/v2/nationKernel/unifiedNationContent.ts
src/v2/nationKernel/validate.ts

src/v2/render/layers.ts
src/v2/render/noise.ts
src/v2/render/planetMap.ts
src/v2/render/terrain.ts
src/v2/render/worldSurface.ts

src/v2/save.ts
src/v2/simulation.ts
src/v2/simulationV6.ts
src/v2/state.ts
src/v2/store.ts
src/v2/terms.ts
src/v2/types.ts

src/v2/world/climate.ts
src/v2/world/ecology.ts
src/v2/world/hydrology.ts
src/v2/world/mapModules.ts
src/v2/world/siteSuitability.ts
src/v2/world/spatialNetwork.ts
src/v2/world/terrainModules.ts
src/v2/worldBlueprint.ts
```

边界判断：

- `worldBlueprint.ts` 包含旧全球生成和固定测试地点，不能原样成为 M0 基座。
- `nationKernel/**` 当前服务 R11/R37/R38 UI、夹具、桥接和手工脚本；是否抽取确定性函数，必须先指出具体 M0 调用方。
- `render/**`、V2 store/save/simulation 与资产服务旧 V2 地图链；M0 当前没有冻结的视觉或状态消费者。
- M0 不需要程序化全球世界，不能以“可能复用”为由保留气候、生态、水文和地形模块。

## 存档与迁移边界

- 旧键 `always-game-text-idle-v6` 由 `CampaignGlobeApp` 和 `TextIdleApp` 读取。
- 旧键 `always-game-regional-v1` 由 `RegionalCampaignApp` 读取和写入。
- M0 不读取、不迁移、不清洗、不回写，也不主动删除上述旧键。
- M0 实现时建立独立新键；`always-game-m0-v1` 只是候选名称，尚未实施。
- `src/v2/save.ts` 的旧 V2 键和值域尚未完成函数级审计，仍属“无法判断”。

## 先抽取或新建的底座

1. 从 `src/main.tsx` 保留 React 挂载，建立唯一 `M0App` 入口。
2. 从 `src/v2/world/geoGrid.ts` 抽取稳定 ID、邻接和地理引用接口。
3. 新建 M0 状态、推进接口和存档封装，不复用旧文本战役状态与迁移器。
4. `nationKernel`、V2 模拟和世界模块只能函数级抽取；每项必须先有明确 M0 消费者。

## 安全实施批次

| 批次 | 删除前提 | 范围 | 验证 |
|---|---|---|---|
| A | M0 独立入口、状态、存档和最小测试链存在 | 不删除；先切换默认入口 | 类型检查、生产构建、M0 新档启动与重载，确认不读旧键。 |
| B | `main.tsx` 已无旧查询路由 | R38 UI、旧 CSS、`textIdle/**`、旧夹具 | 类型检查、构建、默认启动、旧导入/旧键/旧查询参数扫描。 |
| C | M0 测试已替代旧文本断言 | 11 个旧文本手工脚本 | 类型检查、构建、M0 测试、确认旧 JSON 不进打包。 |
| D | `nationKernel` 与 V2 world/render 完成函数级审计 | R37 脚本、旧 kernel/world/render | 类型检查、构建、M0 模拟回归、无旧夹具路由。 |
| E | 内容与资源全仓零引用，且归档决定获批 | 旧 JSON、无引用视觉资产、无引用 CSS | 构建产物与资源引用扫描、Tauri 启动检查。 |

当前 `package.json` 没有自动测试命令；不能把旧手工脚本当作 M0 验收。

## Git 回退建议

冻结规格锚点是 `ff064af236614b9d4cb7630690decd551dc0229d`，但它不是代码删除批次的回退点。

未来实施在另获授权且工作树干净后，每批建立独立提交，可考虑以下标签：

```text
m0-pre-extraction
m0-entry-cutover
m0-legacy-ui-removal
m0-textidle-removal
m0-kernel-world-removal
m0-resource-removal
```

回退使用 `git revert <batch-commit>`。本轮没有创建标签或提交。

## 规模估算

- `src/v2/textIdle/**`：约 1,541 行。
- 五个直接旧 UI：约 688 行。
- 直接关联旧手工脚本：约 693 行。
- 保守候选合计：约 2,922 行，不含替代代码、入口改造和 CSS。
- 若 R37 试玩、检查器及脚本在函数级审计后确认无 M0 消费者，范围可扩大到约 3,736 行。
- 当前可安全承诺删除的二进制或 JSON 资产仍为 0：旧 JSON 和 32 个 V2 地图资产尚未完成零引用证明。

## 接受结果

1. 用户在 `M0-S003-U105` 明确接受 `M0-L4-011` 与本审计。
2. 186 个无法判断项不单独建立大审计任务；在每个相关实现批次开始前，按实际调用方做函数级依赖或全仓零引用检查。
3. 本次接受不授权删除、改造、切换入口、创建标签或提交实现；`implementation_authorized: false` 保持不变。
