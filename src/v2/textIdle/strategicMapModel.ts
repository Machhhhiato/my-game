import { geoPointAt, geoReferenceLonLat } from '../world/geoGrid';
import type { GeoReference } from '../types';
import { TEXT_PROJECTS } from './content';
import { textCampaignTemplate } from './campaignTemplates';
import type { TextIdleState } from './types';

export type MapEntityKind = 'settlement' | 'exploration' | 'discovery' | 'site' | 'facility' | 'route' | 'population' | 'risk' | 'operation';

export interface MapEntity {
  id: string;
  kind: MapEntityKind;
  geoRef: GeoReference;
  label: string;
  summary: string;
  status: 'home' | 'available' | 'active' | 'known' | 'blocked' | 'warning';
  coordinateRef?: string;
  targetId?: string;
}

export interface MapRoute {
  id: string;
  from: GeoReference;
  to: GeoReference;
  status: 'active' | 'known' | 'planned';
  label: string;
}

export interface MapBriefing {
  phase: 'foothold' | 'settlement' | 'network' | 'integration';
  title: string;
  summary: string;
  nextAction: string;
  entities: MapEntity[];
  routes: MapRoute[];
}

/**
 * Text campaign coordinate references predate the 3D surface adapter.  The stable
 * reference is their identifier, never the old SVG `mapPosition`.  This resolver
 * turns that identifier into a deterministic cell-backed GeoReference, so different
 * templates obtain different geography without leaking display coordinates into rules.
 */
export function geoReferenceForCoordinateRef(coordinateRef: string): GeoReference {
  let hash = 2166136261;
  for (let index = 0; index < coordinateRef.length; index += 1) {
    hash ^= coordinateRef.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  const longitude = ((hash >>> 0) % 30000) / 100 - 150;
  const latitude = (((Math.imul(hash ^ 0x9e3779b9, 1103515245) >>> 0) % 11000) / 100) - 55;
  return geoPointAt(longitude, latitude);
}

export function mapEntityLonLat(entity: Pick<MapEntity, 'geoRef'>): [number, number] {
  return geoReferenceLonLat(entity.geoRef);
}

function phaseForDay(day: number): Pick<MapBriefing, 'phase' | 'title' | 'summary'> {
  if (day <= 90) return { phase: 'foothold', title: '立足期', summary: '先让饮水、住处与外出队伍撑过最初的季节。' };
  if (day <= 720) return { phase: 'settlement', title: '定居期', summary: '把勘察记录变成能持续使用的设施与服务。' };
  if (day <= 1800) return { phase: 'network', title: '区域网络', summary: '让多个地点通过补给、生产与公共服务相互支撑。' };
  return { phase: 'integration', title: '区域统合', summary: '登记、服务与外部联络开始把分散地点组织为共同体。' };
}

export function textCampaignMapBriefing(state: TextIdleState): MapBriefing {
  const template = textCampaignTemplate(state.campaignTemplateId);
  const homeRef = geoReferenceForCoordinateRef(`home:${template.id}:${state.seed}`);
  const entities: MapEntity[] = [{
    id: 'settlement.home', kind: 'settlement', geoRef: homeRef, label: '共同体驻地',
    summary: `${state.population} 人已登记；饮水、食物与维修储备在此统一调度。`, status: 'home',
  }];
  const routes: MapRoute[] = [];
  for (const target of template.explorationTargets) {
    const discoveries = target.discoveries;
    const known = discoveries.every((item) => state.discoveries.some((entry) => entry.id === item.id));
    const active = state.exploration?.targetId === target.id;
    const blocked = !known && target.requirements?.discoveries?.some((id) => !state.discoveries.some((entry) => entry.id === id));
    const geoRef = geoReferenceForCoordinateRef(target.coordinateRef);
    entities.push({
      id: `exploration:${target.id}`, kind: 'exploration', geoRef, coordinateRef: target.coordinateRef, targetId: target.id,
      label: known ? target.name : target.direction, summary: target.summary,
      status: active ? 'active' : known ? 'known' : blocked ? 'blocked' : 'available',
    });
    routes.push({ id: `route:survey:${target.id}`, from: homeRef, to: geoRef, label: target.direction, status: active ? 'active' : known ? 'known' : 'planned' });
  }
  for (const discovery of state.discoveries) {
    const isSite = discovery.kind === 'engineering-site';
    entities.push({
      id: `discovery:${discovery.id}`, kind: isSite ? 'site' : 'discovery', geoRef: geoReferenceForCoordinateRef(discovery.coordinateRef),
      coordinateRef: discovery.coordinateRef, label: isSite ? '工程候选地' : '已归档线索',
      summary: isSite ? '已确认条件，等待材料、人手和对应工程。' : '这份记录可作为研究或复勘的证据。', status: 'known',
    });
  }
  for (const facility of state.facilityFacts ?? []) {
    const project = facility.projectId;
    const projectName = TEXT_PROJECTS[project]?.name ?? '这项工程';
    entities.push({
      id: facility.id, kind: 'facility', geoRef: geoReferenceForCoordinateRef(facility.coordinateRef), coordinateRef: facility.coordinateRef,
      label: facility.status === 'building' ? '施工中的工程' : '已投用设施',
      summary: facility.status === 'building'
        ? `工程正在施工；完成后会以${facility.mapClass}的形式持续服务。`
        : `${projectName}已投用；后续维护与升级仍需在此地发生。`,
      status: facility.status === 'building' ? 'active' : 'known',
    });
  }
  for (const route of state.routeFacts) {
    const geoRef = geoReferenceForCoordinateRef(route.coordinateRef);
    entities.push({ id: `route:${route.id}`, kind: 'route', geoRef, coordinateRef: route.coordinateRef, label: route.label, summary: '已归档为后续轮换、补给和前哨建设的路线事实。', status: 'known' });
    routes.push({ id: `route:fact:${route.id}`, from: homeRef, to: geoRef, label: route.label, status: 'known' });
  }
  for (const arrival of state.pendingPopulation) {
    entities.push({ id: `arrival:${arrival.id}`, kind: 'population', geoRef: geoReferenceForCoordinateRef(arrival.coordinateRef), coordinateRef: arrival.coordinateRef, label: arrival.label, summary: `${arrival.population} 人等待接纳；安置会同步增加饮水、食物与公共服务需求。`, status: 'available' });
  }
  if (state.failure.level !== 'stable') {
    entities.push({ id: 'risk:reserves', kind: 'risk', geoRef: homeRef, label: '日常保障承压', summary: '至少一项储备不足，生活秩序需要优先恢复。', status: 'warning' });
  }
  if (state.exploration || state.research.id || state.project.id || state.emergencyOrder) {
    entities.push({ id: 'operation:current', kind: 'operation', geoRef: homeRef, label: '正在进行的调度', summary: '勘察、研究、工程和临时征集会在每日推进中留下可追溯结果。', status: 'active' });
  }
  const phase = phaseForDay(state.calendar.absoluteDay);
  const nextAction = state.exploration ? '等待勘察队带回记录，或在驻地安排保障。' : state.failure.level !== 'stable' ? '先恢复耗尽的日常储备。' : '在星球上选择一处可勘察方向，建立第一条外出记录。';
  return { ...phase, nextAction, entities, routes };
}
