import type { CampaignSaveV2, LedgerValue, ResourceLedger } from './types';
import { NODES, REGIONS } from './data';

export const V2_SEED = 7007;

function lv(stock: number, income: number, demand: number, reserveTarget: number, trend: -1 | 0 | 1, danger: LedgerValue['danger'], sources: string[], gaps: string[]): LedgerValue {
  return { stock, income, demand, reserveTarget, trend, danger, sources, gaps };
}

function initialLedger(): ResourceLedger {
  return {
    safeWater: lv(120, 9, 11, 60, 1, 'normal', ['翡翠河谷水网', '第 07 号净水单元'], ['滤芯储备低于目标']),
    calories: lv(100, 6, 8, 80, 0, 'warn', ['混合配给仓', '试验田早期产出'], ['种源圃未建成，热源单一']),
    bioLandCapital: lv(28, 1, 2, 40, -1, 'warn', ['河谷冲积耕地', '遗址回收基质'], ['南部酸雨侵蚀、用地争议']),
    reclaimedMaterial: lv(64, 4, 5, 50, 1, 'normal', ['河谷工务所回收', '旧渡口以物易物'], ['高精度回收产能不足']),
    precisionParts: lv(18, 1, 3, 24, -1, 'danger', ['第 07 号库存', '旧渡口零星交换'], ['净水续命占用、滤芯磨损']),
    effectiveLabor: lv(21, 0, 26, 24, -1, 'warn', ['健康有效劳力 21', '临时登记劳工'], ['照护负担挤占、工务负荷高']),
    publicCredit: lv(42, 2, 1, 40, 1, 'normal', ['协作契约履约', '短波信标预告'], ['旧渡口登记争议可能反噬']),
  };
}

export function newCampaignV2(): CampaignSaveV2 {
  return {
    version: 2,
    seed: V2_SEED,
    startedAt: Date.now(),
    lastSavedAt: Date.now(),
    clock: { eraId: 'ember', year: 1, period: 1, elapsed: 0, speed: 1 },
    player: {
      primaryDirection: 'survival',
      secondaryDirection: null,
      flagshipProjectId: 'water_life',
      policyId: 'mixed_ration',
      securityPosture: 'escort',
    },
    nation: {
      name: '河谷应急协调会',
      stage: 'shelter_outreach',
      population: {
        registered: 31, temporary: 0, children: 6, careDependents: 4,
        healthyWorkforce: 21, housingPressure: 20,
      },
      resources: initialLedger(),
      capacities: {
        materialBase: { value: 42, trend: 0 },
        knowledgeBase: { value: 36, trend: 0 },
        coerciveCapacity: { value: 18, trend: 0 },
        integrationCapacity: { value: 25, trend: 0 },
        socialCapacity: { value: 52, trend: 0 },
        logisticsResilience: { value: 31, trend: 0 },
      },
      debts: {
        maintenance: { value: 38, trend: 1 },
        ecology: { value: 14, trend: 1 },
        housing: { value: 20, trend: 1 },
        trust: { value: 18, trend: 0 },
        military: { value: 6, trend: 0 },
        integration: { value: 12, trend: 0 },
      },
    },
    nodes: NODES,
    regions: REGIONS,
    activeLayers: ['political'],
    log: [
      {
        id: 1, period: '第 1 期', place: '翡翠河谷水网',
        summary: '滤芯储备低于目标，工务所已请求 2 单位备件。',
        severity: 'warn', nodeId: 'facility_07',
      },
      {
        id: 2, period: '第 1 期', place: '旧渡口行旅营',
        summary: '断续道路有登记旅团到达，请求临时接纳与水源。',
        severity: 'info', nodeId: 'old_ferry_camp',
      },
      {
        id: 3, period: '第 1 期', place: '第 07 号设施',
        summary: '档案室冷却组维护债上升，校验作业被推迟。',
        severity: 'warn', nodeId: 'facility_07',
      },
      {
        id: 4, period: '第 1 期', place: '南部酸雨带',
        summary: '地表试验地暴露，生态账出现 2 单位新债。',
        severity: 'danger',
      },
    ],
    logUnread: 4,
    retiredNoticeShown: false,
  };
}
