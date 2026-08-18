import type { MapModuleDefinition } from '../types';

/**
 * 工程模块只定义可复用的空间能力，不携带某局名称、剧情文本、进度或图片。
 * 项目/科技解锁某个 moduleId 后，必须先通过对应自然条件才能写入 WorldEffectInstance。
 */
export const MAP_MODULES: MapModuleDefinition[] = [
  {
    id: 'water_utility', kind: 'utility', compatibleTerrain: ['plain', 'river_valley', 'coast'], geometry: 'path',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'freshwater', min: 0.30 }, { kind: 'slope_max', max: 0.22 }],
  },
  {
    id: 'settlement_core', kind: 'settlement', compatibleTerrain: ['plain', 'river_valley', 'coast', 'forest'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'freshwater', min: 0.30 }, { kind: 'slope_max', max: 0.13 }],
  },
  {
    id: 'farm_district', kind: 'service_area', compatibleTerrain: ['plain', 'river_valley', 'coast'], geometry: 'area',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'fertility', min: 0.48 }, { kind: 'freshwater', min: 0.25 }, { kind: 'slope_max', max: 0.10 }],
  },
  {
    id: 'greenhouse_complex', kind: 'facility', compatibleTerrain: ['plain', 'river_valley', 'coast'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'freshwater', min: 0.25 }, { kind: 'fertility', min: 0.32 }, { kind: 'slope_max', max: 0.15 }],
  },
  {
    id: 'workshop_hub', kind: 'facility', compatibleTerrain: ['plain', 'river_valley', 'coast', 'highland'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'slope_max', max: 0.28 }],
  },
  {
    id: 'signal_relay', kind: 'facility', compatibleTerrain: ['plain', 'river_valley', 'highland', 'mountain', 'coast'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'slope_max', max: 0.48 }],
  },
  {
    id: 'mine_complex', kind: 'mine', compatibleTerrain: ['mountain', 'highland', 'arid'], geometry: 'area',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'metal_ore', min: 0.52 }, { kind: 'slope_max', max: 0.48 }],
  },
  {
    id: 'river_dam', kind: 'dam', compatibleTerrain: ['river_valley', 'highland', 'mountain'], geometry: 'edge',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'freshwater', min: 0.45 }, { kind: 'river_drop', min: 0.035 }],
  },
  {
    id: 'seaport', kind: 'harbor', compatibleTerrain: ['coast'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'harbor', min: 0.55 }, { kind: 'slope_max', max: 0.16 }],
  },
  {
    id: 'geothermal_station', kind: 'facility', compatibleTerrain: ['highland', 'mountain', 'arid'], geometry: 'point',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'geothermal', min: 0.46 }, { kind: 'slope_max', max: 0.34 }],
  },
  {
    id: 'overland_corridor', kind: 'road', compatibleTerrain: ['coast', 'plain', 'river_valley', 'highland', 'mountain', 'forest', 'arid', 'tundra'], geometry: 'path',
    phases: ['survey', 'construction', 'trial', 'operational'],
    siteRequirements: [{ kind: 'land' }, { kind: 'slope_max', max: 0.42 }],
  },
];

export function mapModuleById(id: string): MapModuleDefinition {
  const module = MAP_MODULES.find((entry) => entry.id === id);
  if (!module) throw new Error(`unknown map module ${id}`);
  return module;
}
