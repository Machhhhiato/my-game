import type {
  CellIntel,
  IntelStage,
  LocalMapCell,
  LocalMapRoute,
  MapRotation,
  M0MapState,
  SurveyRecord,
  SurveyTargetId,
} from './types';

export const SPHERICAL_LOCAL_WINDOW = {
  kind: 'spherical-local-window',
  contentCellCount: 37,
  wholePlanetCellCount: null,
  outsideContent: 'unexplored-shell',
} as const;

export const MAP_ROTATION_LIMITS = {
  yaw: 1.05,
  pitch: 0.6,
} as const;

export interface ProjectedLocalCell {
  id: string;
  intel: CellIntel;
  xPercent: number;
  yPercent: number;
  depth: number;
  scale: number;
  visible: boolean;
  corners: Array<{
    xPercent: number;
    yPercent: number;
    depth: number;
  }>;
}

export function normalizeMapRotation(rotation: MapRotation): MapRotation {
  const finite = (value: number): number => Number.isFinite(value) ? value : 0;
  return {
    yaw: Math.max(-MAP_ROTATION_LIMITS.yaw, Math.min(MAP_ROTATION_LIMITS.yaw, finite(rotation.yaw))),
    pitch: Math.max(-MAP_ROTATION_LIMITS.pitch, Math.min(MAP_ROTATION_LIMITS.pitch, finite(rotation.pitch))),
  };
}

function projectTangentPoint(
  tangentX: number,
  tangentY: number,
  rotation: MapRotation,
): { xPercent: number; yPercent: number; depth: number; scale: number } {
  const tangentRadius = Math.hypot(tangentX, tangentY);
  const angularRadius = tangentRadius * 0.23;
  const radialScale = tangentRadius === 0 ? 0 : Math.sin(angularRadius) / tangentRadius;
  const baseX = tangentX * radialScale;
  const baseY = tangentY * radialScale;
  const baseZ = Math.cos(angularRadius);

  const cosYaw = Math.cos(rotation.yaw);
  const sinYaw = Math.sin(rotation.yaw);
  const yawX = baseX * cosYaw + baseZ * sinYaw;
  const yawZ = -baseX * sinYaw + baseZ * cosYaw;
  const cosPitch = Math.cos(rotation.pitch);
  const sinPitch = Math.sin(rotation.pitch);
  const pitchY = baseY * cosPitch - yawZ * sinPitch;
  const depth = baseY * sinPitch + yawZ * cosPitch;
  const perspective = 0.82 + Math.max(-0.2, depth) * 0.18;

  return {
    xPercent: 50 + yawX * 44 * perspective,
    yPercent: 50 - pitchY * 44 * perspective,
    depth,
    scale: Math.max(0.62, 0.76 + depth * 0.24),
  };
}

export function projectLocalCell(cell: LocalMapCell, requestedRotation: MapRotation): ProjectedLocalCell {
  const rotation = normalizeMapRotation(requestedRotation);
  const tangentX = cell.q + cell.r * 0.5;
  const tangentY = -cell.r * Math.sqrt(3) / 2;
  const center = projectTangentPoint(tangentX, tangentY, rotation);
  const cornerRadius = 1 / Math.sqrt(3);
  const corners = Array.from({ length: 6 }, (_, index) => {
    const angle = Math.PI / 6 + index * Math.PI / 3;
    const corner = projectTangentPoint(
      tangentX + Math.cos(angle) * cornerRadius,
      tangentY + Math.sin(angle) * cornerRadius,
      rotation,
    );
    return { xPercent: corner.xPercent, yPercent: corner.yPercent, depth: corner.depth };
  });

  return {
    id: cell.id,
    intel: cell.intel,
    xPercent: center.xPercent,
    yPercent: center.yPercent,
    depth: center.depth,
    scale: center.scale,
    visible: center.depth > 0.04,
    corners,
  };
}

export function projectSphericalLocalWindow(cells: LocalMapCell[], rotation: MapRotation): ProjectedLocalCell[] {
  return cells.map((cell) => projectLocalCell(cell, rotation));
}

export const localCellId = (q: number, r: number): string => `local-${q}-${r}`;

const directions = [[1, 0], [1, -1], [0, -1], [-1, 0], [-1, 1], [0, 1]] as const;

export const LOCATION_CELLS = {
  headquarters: localCellId(0, 0),
  waterworks: localCellId(0, -1),
  foodSite: localCellId(-1, 1),
  ruinA: localCellId(2, -1),
  ruinB: localCellId(3, -2),
  futureFarm: localCellId(-2, 2),
  futureMine: localCellId(-3, 0),
  futureShore: localCellId(1, 2),
} as const;

export const SURVEY_ROUTE_IDS: Record<SurveyTargetId, string> = {
  'ruin-a': 'route-hq-ruin-a-old-road',
  'ruin-b': 'route-hq-ruin-b-damaged-road',
};

const createRoutes = (): LocalMapRoute[] => [
  {
    id: SURVEY_ROUTE_IDS['ruin-a'],
    targetId: 'ruin-a',
    cellIds: [LOCATION_CELLS.headquarters, localCellId(1, 0), LOCATION_CELLS.ruinA],
    facts: ['stable-old-road'],
  },
  {
    id: SURVEY_ROUTE_IDS['ruin-b'],
    targetId: 'ruin-b',
    cellIds: [LOCATION_CELLS.headquarters, localCellId(1, -1), localCellId(2, -2), LOCATION_CELLS.ruinB],
    facts: ['mud-section', 'damaged-passage'],
  },
];

function createCell(q: number, r: number): LocalMapCell {
  const id = localCellId(q, r);
  const cell: LocalMapCell = {
    id,
    q,
    r,
    terrain: 'plain',
    neighbors: [],
    occupation: 'empty',
    water: 'dry',
    resource: 'none',
    risk: 'none',
    intel: 'unknown',
  };

  if (id === LOCATION_CELLS.headquarters) Object.assign(cell, { occupation: 'headquarters', terrain: 'hardground', intel: 'known' });
  if (id === LOCATION_CELLS.waterworks) Object.assign(cell, { occupation: 'waterworks', water: 'near-water', intel: 'known' });
  if (id === LOCATION_CELLS.foodSite) Object.assign(cell, { occupation: 'food-site', water: 'near-water', resource: 'food', intel: 'known' });
  if (id === LOCATION_CELLS.ruinA) Object.assign(cell, { occupation: 'industrial-ruin', terrain: 'hardground', resource: 'engineering-salvage', risk: 'heavy-clearing' });
  if (id === LOCATION_CELLS.ruinB) Object.assign(cell, { occupation: 'industrial-ruin', terrain: 'hardground', resource: 'alloy-salvage', risk: 'damaged-passage' });
  if (id === localCellId(2, -2)) Object.assign(cell, { terrain: 'mud', water: 'waterlogging' });
  if (id === LOCATION_CELLS.futureFarm) Object.assign(cell, { occupation: 'future-site', water: 'near-water', resource: 'farmland-potential', risk: 'future-use-only', intel: 'site' });
  if (id === LOCATION_CELLS.futureMine) Object.assign(cell, { occupation: 'future-site', terrain: 'slope', resource: 'mineral-sign', risk: 'future-use-only', intel: 'known' });
  if (id === LOCATION_CELLS.futureShore) Object.assign(cell, { occupation: 'future-site', terrain: 'shore', water: 'near-water', resource: 'shore-potential', risk: 'future-use-only', intel: 'known' });
  return cell;
}

function createSurvey(targetId: SurveyTargetId): SurveyRecord {
  return {
    targetId,
    projectId: `survey-${targetId}`,
    stage: 'direction',
    workDone: 0,
    approved: false,
    workers: 2,
    priority: 'P2',
    paused: false,
    pauseReason: null,
    maximumDays: null,
    daysWorked: 0,
    useDrone: true,
    droneAppliedStages: [],
    selectedRouteId: null,
  };
}

export function createLocalMap(): M0MapState {
  const cells: LocalMapCell[] = [];
  for (let q = -3; q <= 3; q += 1) {
    for (let r = -3; r <= 3; r += 1) {
      if (Math.max(Math.abs(q), Math.abs(r), Math.abs(q + r)) <= 3) cells.push(createCell(q, r));
    }
  }

  const ids = new Set(cells.map((cell) => cell.id));
  for (const cell of cells) {
    cell.neighbors = directions
      .map(([dq, dr]) => localCellId(cell.q + dq, cell.r + dr))
      .filter((id) => ids.has(id));
  }

  return {
    cells,
    routes: createRoutes(),
    selectedCellId: LOCATION_CELLS.headquarters,
    surveys: [createSurvey('ruin-a'), createSurvey('ruin-b')],
  };
}

export const surveyWorkRequired: Record<Exclude<IntelStage, 'direction'>, number> = {
  area: 6,
  route: 12,
  site: 12,
};

export const nextIntelStage: Record<IntelStage, Exclude<IntelStage, 'direction'> | null> = {
  direction: 'area',
  area: 'route',
  route: 'site',
  site: null,
};

export function intelStageName(stage: IntelStage): string {
  return {
    direction: '方向线索',
    area: '范围确认',
    route: '路线确认',
    site: '现场确认',
  }[stage];
}

export function surveyFor(map: M0MapState, targetId: SurveyTargetId): SurveyRecord {
  const survey = map.surveys.find((candidate) => candidate.targetId === targetId);
  if (!survey) throw new Error(`Missing survey record: ${targetId}`);
  return survey;
}

export function surveyPlanControlState(survey: SurveyRecord): {
  editable: boolean;
  needsApproval: boolean;
  canTogglePause: boolean;
} {
  return {
    editable: survey.stage !== 'site',
    needsApproval: !survey.approved,
    canTogglePause: survey.approved
      && survey.pauseReason !== 'route-choice'
      && survey.pauseReason !== 'day-limit',
  };
}

export function routeForTarget(map: M0MapState, targetId: SurveyTargetId): LocalMapRoute {
  const route = map.routes.find((candidate) => candidate.targetId === targetId);
  if (!route) throw new Error(`Missing survey route: ${targetId}`);
  return route;
}

function targetCellId(targetId: SurveyTargetId): string {
  return targetId === 'ruin-a' ? LOCATION_CELLS.ruinA : LOCATION_CELLS.ruinB;
}

function setIntel(map: M0MapState, cellId: string, intel: CellIntel): void {
  const order: CellIntel[] = ['unknown', 'known', 'candidate', 'route', 'site'];
  const cell = map.cells.find((candidate) => candidate.id === cellId);
  if (cell && order.indexOf(intel) > order.indexOf(cell.intel)) cell.intel = intel;
}

export function refreshMapIntel(map: M0MapState): void {
  const permanentlyKnown = new Set([
    LOCATION_CELLS.headquarters,
    LOCATION_CELLS.waterworks,
    LOCATION_CELLS.foodSite,
    LOCATION_CELLS.futureMine,
    LOCATION_CELLS.futureShore,
  ]);
  for (const cell of map.cells) {
    cell.intel = cell.id === LOCATION_CELLS.futureFarm ? 'site' : permanentlyKnown.has(cell.id) ? 'known' : 'unknown';
  }

  for (const survey of map.surveys) {
    if (survey.stage === 'direction') continue;
    const anchorId = targetCellId(survey.targetId);
    const anchor = map.cells.find((cell) => cell.id === anchorId);
    for (const candidateId of [anchorId, ...(anchor?.neighbors.slice(0, 2) ?? [])]) setIntel(map, candidateId, 'candidate');
    if (survey.stage === 'area') continue;
    for (const routeCellId of routeForTarget(map, survey.targetId).cellIds) setIntel(map, routeCellId, 'route');
    if (survey.stage === 'site') setIntel(map, anchorId, 'site');
  }
}

export function surveyConclusion(targetId: SurveyTargetId, stage: IntelStage): { label: string; reason: string } | null {
  if (stage !== 'site') return null;
  if (targetId === 'ruin-a') return { label: '适合', reason: '旧路稳定；现场清理较重，属于正常建设工作。' };
  return { label: '有条件适合', reason: '先处理泥地路线和受损通路，之后可建设。' };
}

export function futureFarmConclusion(stage: IntelStage): { label: string; reason: string } | null {
  return stage === 'site' ? { label: '不可用', reason: '没有可供回收的工业废墟。' } : null;
}

export function surveyVisibleFacts(targetId: SurveyTargetId, stage: IntelStage): string[] {
  if (stage === 'direction') return [targetId === 'ruin-a' ? '东北方向存在待勘测线索。' : '东侧更远处存在待勘测线索。'];
  if (stage === 'area') return [targetId === 'ruin-a'
    ? '候选范围距总部约 2 格；主要地面轮廓已看到。'
    : '候选范围距总部约 3 格；主要地面轮廓已看到。'];
  if (stage === 'route') return targetId === 'ruin-a'
    ? ['路线相隔 2 格。', '已确认一条较稳定的旧路。']
    : ['路线相隔 3 格。', '途中有泥地和一处受损通路。'];
  return targetId === 'ruin-a'
    ? ['工业硬地与工作区已确认。', '工程构件较多；现场清理较重。']
    : ['现场工业地面较好。', '合金料较多；路线仍有泥地和受损通路。'];
}

export function visibleCellClass(cell: LocalMapCell): string {
  if (cell.intel === 'unknown') return 'unknown';
  if (cell.intel === 'candidate') return 'candidate';
  if (cell.intel === 'route') return 'route';
  if (cell.intel === 'site') return cell.occupation;
  return cell.occupation === 'industrial-ruin' ? 'unknown' : cell.occupation;
}

export function visibleCellTitle(cell: LocalMapCell): string {
  if (cell.intel === 'unknown') return '尚未确认的地表';
  if (cell.intel === 'candidate') return '候选范围；现场事实尚未确认';
  if (cell.intel === 'route') return '已确认路线经过格';
  if (cell.occupation === 'headquarters') return '总部';
  if (cell.occupation === 'waterworks') return '水源与旧供水设施';
  if (cell.occupation === 'food-site') return '附近食物点';
  if (cell.resource === 'farmland-potential') return '未来农田候选地';
  if (cell.resource === 'mineral-sign') return '未来矿产坡地';
  if (cell.resource === 'shore-potential') return '未来河岸候选地';
  if (cell.occupation === 'industrial-ruin') return '已现场确认的工业废墟';
  return '已知地表';
}
