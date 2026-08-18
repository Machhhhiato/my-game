import { newCampaignV6 } from '../src/v2/state';
import { advanceDaysV6, startProjectV6, startResearchV6 } from '../src/v2/simulationV6';
import { preciseTerrainRGB, terrainModuleAt } from '../src/v2/render/terrain';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`R8 地图验收失败：${message}`);
}

let state = newCampaignV6();
const valley = terrainModuleAt(state.world, 40.6, 16.4);
const mountain = terrainModuleAt(state.world, 28, 42);
expect(valley?.slot.region === 'river_valley', '外拓营没有落在河谷模块');
expect(mountain?.slot.region === 'mountain', '北部山系没有落在山地模块');

const valleyColor = preciseTerrainRGB(40.6, 16.4, state.world);
const mountainColor = preciseTerrainRGB(28, 42, state.world);
expect(valleyColor.every(Number.isFinite) && mountainColor.every(Number.isFinite), '地形材料不能生成有效颜色');
expect(valleyColor.join(',') !== mountainColor.join(','), '河谷与山地没有可读的材料差异');

state = startResearchV6(state, 'valley_survey');
state = advanceDaysV6(state, 30);
state = startProjectV6(state, 'water_main');
state = advanceDaysV6(state, 80);
const change = state.world.terrainChanges.find((entry) => entry.id === 'water-main-settlement-growth');
const corridor = state.world.terrainChanges.find((entry) => entry.id === 'water-main-utility-corridor');
expect(state.completed.projects.includes('water_main'), '净水干线没有完成，无法验证地图变化');
expect(change?.kind === 'urban_growth', '净水干线未写入聚居地扩张变化');
expect(change.data.milestone === 100 && change.data.radius === 0.92, '净水干线投用后地图变化没有升级');
expect(corridor?.kind === 'utility_corridor' && corridor.data.route === 'water_main', '净水干线没有写入可长期读取的水务走廊');

const beforeCorridor = structuredClone(state);
beforeCorridor.world.terrainChanges = beforeCorridor.world.terrainChanges.filter((entry) => entry.id !== 'water-main-utility-corridor');
const corridorPoint: [number, number] = [39.4, 17.5];
expect(preciseTerrainRGB(...corridorPoint, state.world).join(',') !== preciseTerrainRGB(...corridorPoint, beforeCorridor.world).join(','), '水务走廊没有改变对应的地表材料');

// 工务所的道路反馈不是 UI 线条，而是第二条存档内的工程事实。
state.metrics.industry.value = 40;
state = startProjectV6(state, 'ferry_workshop');
state = advanceDaysV6(state, 80);
const road = state.world.terrainChanges.find((entry) => entry.id === 'ferry-road-connection');
const ferryGrowth = state.world.terrainChanges.find((entry) => entry.id === 'ferry-worktown-growth');
expect(state.completed.projects.includes('ferry_workshop'), '旧渡口工务所没有完成，无法验证道路变化');
expect(road?.kind === 'road' && road.data.route === 'ferry_road', '工务所没有写入道路连接');
expect(ferryGrowth?.kind === 'urban_growth' && ferryGrowth.data.radius === 0.66, '工务所没有写入渡口服务聚落扩张');

console.log(JSON.stringify({
  result: 'passed',
  terrainModules: { valley: valley.slot.templateId, mountain: mountain.slot.templateId },
  materialSamples: { valley: valleyColor.map(Math.round), mountain: mountainColor.map(Math.round) },
  terrainChanges: state.world.terrainChanges.map((entry) => ({ id: entry.id, kind: entry.kind, data: entry.data })),
}, null, 2));
