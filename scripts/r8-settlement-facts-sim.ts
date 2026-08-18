import { newCampaignV6 } from '../src/v2/state';
import { EMERALD_VALLEY, settlementStage } from '../src/v2/content/settlements';
import { alignMapNodesToWorld } from '../src/v2/worldBlueprint';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`R8 聚居地地图事实验收失败：${message}`);
}

const state = newCampaignV6();
expect(settlementStage(state, EMERALD_VALLEY) === 'camp', '开局不应跳过外拓营阶段');

state.completed.projects = ['water_main'];
expect(settlementStage(state, EMERALD_VALLEY) === 'settlement', '净水干线投用后应成为聚居地');

state.completed.projects = ['water_main', 'valley_greenhouse'];
state.population = 60;
expect(settlementStage(state, EMERALD_VALLEY) === 'settlement', '只有净水与温室时不应跳过工务镇的渡口门槛');

state.completed.projects = ['water_main', 'valley_greenhouse', 'ferry_workshop'];
expect(settlementStage(state, EMERALD_VALLEY) === 'worktown', '渡口工务、温室与常住人口齐备后应成为工务镇');

state.completed.projects = ['water_main', 'valley_greenhouse', 'ferry_workshop', 'well_radio_tower'];
state.population = 130;
expect(settlementStage(state, EMERALD_VALLEY) === 'city', '完整首期实体设施后应进入城市阶段');

const shifted = structuredClone(state.world);
shifted.siteAnchors.find((entry) => entry.id === EMERALD_VALLEY.nodeId)!.position = [41.1, 16.1];
const aligned = alignMapNodesToWorld(state.nodes, shifted);
const settlementNode = aligned.find((entry) => entry.id === EMERALD_VALLEY.nodeId)!;
expect(settlementNode.lon === 41.1 && settlementNode.lat === 16.1, '聚居地没有跟随世界蓝图节点移动');

console.log(JSON.stringify({
  result: 'passed',
  stages: ['camp', 'settlement', 'worktown', 'city'],
  renderedAnchorSource: EMERALD_VALLEY.nodeId,
  shiftedAnchor: [settlementNode.lon, settlementNode.lat],
}));
