import type { DevelopmentStage, QuantityDefinition, QuantityPanel } from './types';

const q = (id: string, kind: QuantityDefinition['kind'], unit: string, display: QuantityDefinition['display'], panel: QuantityPanel, visibleFrom: DevelopmentStage, min = 0, max?: number): QuantityDefinition => ({ id, kind, unit, display, min, max, precision: kind === 'count' ? 0 : 1, source: 'stored', presentation: { panel, visibleFrom, copyKey: `quantity.${id}` } });

/** 全时代量纲目录。科技/工程/政策只能引用这里的 ID；UI 按 visibleFrom 和 panel 决定何时、何处展示。 */
export const R11_QUANTITY_CATALOG: Record<string, QuantityDefinition> = {
  'provision.waterDays': q('provision.waterDays', 'coverageDays', 'day', 'coverage', 'topbar', 'survival'),
  'provision.foodDays': q('provision.foodDays', 'coverageDays', 'day', 'coverage', 'topbar', 'survival'),
  'provision.repairDays': q('provision.repairDays', 'coverageDays', 'day', 'coverage', 'topbar', 'survival'),
  'construction.ldu': q('construction.ldu', 'supplyUnit', 'LDU', 'exact', 'nation', 'survival'),
  'construction.ndu': q('construction.ndu', 'supplyUnit', 'NDU', 'exact', 'nation', 'unifiedNation'),
  'service.waterCoverage': q('service.waterCoverage', 'coverage', 'percent', 'status', 'city', 'settlement', 0, 100),
  'service.healthCoverage': q('service.healthCoverage', 'coverage', 'percent', 'status', 'city', 'settlement', 0, 100),
  'service.educationCoverage': q('service.educationCoverage', 'coverage', 'percent', 'status', 'city', 'regional', 0, 100),
  'capacity.engineering': q('capacity.engineering', 'capacity', 'index', 'trend', 'topbar', 'survival', 0, 100),
  'capacity.energy': q('capacity.energy', 'capacity', 'index', 'trend', 'topbar', 'settlement', 0, 100),
  'capacity.research': q('capacity.research', 'capacity', 'index', 'trend', 'topbar', 'survival', 0, 100),
  'capacity.coordination': q('capacity.coordination', 'capacity', 'index', 'trend', 'topbar', 'regional', 0, 100),
  'capacity.logistics': q('capacity.logistics', 'capacity', 'index', 'trend', 'topbar', 'regional', 0, 100),
  'capacity.defense': q('capacity.defense', 'capacity', 'index', 'trend', 'topbar', 'regional', 0, 100),
  'capacity.cohesion': q('capacity.cohesion', 'score', 'index', 'status', 'topbar', 'survival', 0, 100),
  'capacity.ecology': q('capacity.ecology', 'score', 'index', 'status', 'topbar', 'survival', 0, 100),
  'maintenance.backlog': q('maintenance.backlog', 'ratio', 'percent', 'status', 'nation', 'settlement', 0, 100),
  'defense.readiness': q('defense.readiness', 'ratio', 'percent', 'status', 'military', 'regional', 0, 100),
  'defense.supplyDays': q('defense.supplyDays', 'coverageDays', 'day', 'coverage', 'military', 'regional'),
  'diplomacy.trust': q('diplomacy.trust', 'score', 'index', 'status', 'diplomacy', 'regional', -100, 100),
  'diplomacy.intelligenceConfidence': q('diplomacy.intelligenceConfidence', 'ratio', 'percent', 'status', 'diplomacy', 'regional', 0, 100),
  'space.launchCapacity': q('space.launchCapacity', 'capacity', 'tonPerYear', 'exact', 'space', 'spaceflight'),
  'space.routeSupplyDays': q('space.routeSupplyDays', 'coverageDays', 'day', 'coverage', 'space', 'spaceflight'),
  'space.communicationDelay': q('space.communicationDelay', 'capacity', 'minute', 'exact', 'space', 'interstellar'),
};

export function quantitiesForStage(stage: DevelopmentStage): QuantityDefinition[] {
  const order: DevelopmentStage[] = ['survival', 'settlement', 'regional', 'unifiedNation', 'spaceflight', 'interstellar'];
  return Object.values(R11_QUANTITY_CATALOG).filter((definition) => order.indexOf(definition.presentation.visibleFrom) <= order.indexOf(stage));
}
