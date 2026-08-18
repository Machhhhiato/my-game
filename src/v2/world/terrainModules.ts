import type { ClimateKind, TerrainEdge, TerrainModuleLink, TerrainModuleSlot, TerrainRegionKind } from '../types';

type EdgeDirection = 'north' | 'east' | 'south' | 'west';
type ModuleDraft = Omit<TerrainModuleSlot, 'templateId'>;

/**
 * 这是未来美术资产的“接口”，而不是图片清单。每个模板可在 R5 后对应一组同风格素材，
 * 但世界生成器只能在其地貌、气候与边缘都成立时选择它。
 */
export interface TerrainModuleTemplate {
  id: string;
  region: TerrainRegionKind;
  climates: ClimateKind[];
  allowedEdges: TerrainEdge[];
  variants: number;
}

export const TERRAIN_MODULE_TEMPLATES: TerrainModuleTemplate[] = [
  { id: 'ocean_open', region: 'ocean', climates: ['polar', 'cold', 'temperate', 'arid', 'tropical'], allowedEdges: ['ocean', 'coast'], variants: 6 },
  { id: 'coast_rugged', region: 'coast', climates: ['cold', 'temperate', 'arid', 'tropical'], allowedEdges: ['ocean', 'coast', 'plain', 'forest', 'highland'], variants: 5 },
  { id: 'plain_temperate', region: 'plain', climates: ['temperate', 'tropical', 'arid'], allowedEdges: ['plain', 'river', 'coast', 'forest', 'highland', 'arid'], variants: 6 },
  { id: 'plain_cold', region: 'plain', climates: ['cold'], allowedEdges: ['plain', 'river', 'coast', 'forest', 'highland', 'tundra'], variants: 5 },
  { id: 'river_valley_temperate', region: 'river_valley', climates: ['temperate', 'arid'], allowedEdges: ['river', 'plain', 'ridge', 'highland', 'forest'], variants: 6 },
  { id: 'river_valley_tropical', region: 'river_valley', climates: ['tropical'], allowedEdges: ['river', 'plain', 'ridge', 'highland', 'forest'], variants: 5 },
  { id: 'highland_granite', region: 'highland', climates: ['cold', 'temperate', 'arid', 'tropical'], allowedEdges: ['ridge', 'highland', 'plain', 'forest', 'tundra', 'arid'], variants: 6 },
  { id: 'mountain_alpine', region: 'mountain', climates: ['cold', 'polar'], allowedEdges: ['ridge', 'highland', 'tundra', 'ocean'], variants: 5 },
  { id: 'forest_dense', region: 'forest', climates: ['temperate', 'tropical'], allowedEdges: ['forest', 'plain', 'river', 'highland', 'coast'], variants: 6 },
  // 温带半干旱盆地与严格干旱盆地共用地貌接口；气候场仍会区分二者，不能反过来用素材决定气候。
  { id: 'arid_basin', region: 'arid', climates: ['arid', 'temperate'], allowedEdges: ['arid', 'plain', 'highland', 'coast'], variants: 6 },
  { id: 'tundra_open', region: 'tundra', climates: ['polar', 'cold'], allowedEdges: ['tundra', 'ridge', 'highland', 'ocean', 'plain'], variants: 5 },
];

const COMPATIBLE_EDGES: Record<TerrainEdge, TerrainEdge[]> = {
  ocean: ['ocean', 'coast'],
  coast: ['ocean', 'coast', 'plain', 'forest', 'highland', 'arid'],
  plain: ['plain', 'river', 'coast', 'forest', 'highland', 'arid', 'tundra'],
  river: ['river', 'plain', 'forest', 'highland'],
  ridge: ['ridge', 'highland', 'tundra'],
  highland: ['ridge', 'highland', 'plain', 'forest', 'arid', 'tundra', 'coast'],
  forest: ['forest', 'plain', 'river', 'highland', 'coast'],
  arid: ['arid', 'plain', 'highland', 'coast'],
  tundra: ['tundra', 'ridge', 'highland', 'plain', 'ocean'],
};

function deterministicIndex(seed: number, id: string, length: number): number {
  let value = seed >>> 0;
  for (let i = 0; i < id.length; i++) value = Math.imul(value ^ id.charCodeAt(i), 16777619) >>> 0;
  return value % length;
}

export function edgesOf(slot: Pick<TerrainModuleSlot, 'edges'>): TerrainEdge[] {
  return [slot.edges.north, slot.edges.east, slot.edges.south, slot.edges.west];
}

export function edgesCanConnect(a: TerrainEdge, b: TerrainEdge): boolean {
  return COMPATIBLE_EDGES[a].includes(b) && COMPATIBLE_EDGES[b].includes(a);
}

export function selectTerrainModuleTemplate(draft: ModuleDraft, seed: number): TerrainModuleSlot {
  const candidates = TERRAIN_MODULE_TEMPLATES.filter((template) =>
    template.region === draft.region
    && template.climates.includes(draft.climate)
    && edgesOf(draft).every((edge) => template.allowedEdges.includes(edge)),
  );
  if (candidates.length === 0) throw new Error(`No terrain template for ${draft.id} (${draft.region}/${draft.climate})`);
  const template = candidates[deterministicIndex(seed, draft.id, candidates.length)];
  return { ...draft, templateId: template.id, variant: draft.variant % template.variants };
}

function opposite(direction: EdgeDirection): EdgeDirection {
  return direction === 'north' ? 'south' : direction === 'south' ? 'north' : direction === 'east' ? 'west' : 'east';
}

/**
 * 连接记录描述模块之间真实存在的边界，而不是把视觉块任意重叠。
 * 方位必须相对，边缘类型必须双向兼容，避免海洋贴到雪岭或河道凭空消失。
 */
export function validateTerrainModuleProtocol(modules: TerrainModuleSlot[], links: TerrainModuleLink[]): void {
  const byId = new Map(modules.map((entry) => [entry.id, entry]));
  if (byId.size !== modules.length) throw new Error('duplicate terrain module id');
  for (const slot of modules) {
    const template = TERRAIN_MODULE_TEMPLATES.find((entry) => entry.id === slot.templateId);
    if (!template) throw new Error(`${slot.id} references unknown terrain template`);
    if (template.region !== slot.region || !template.climates.includes(slot.climate)) throw new Error(`${slot.id} violates template region/climate`);
    if (!edgesOf(slot).every((edge) => template.allowedEdges.includes(edge))) throw new Error(`${slot.id} violates template edge contract`);
    if (slot.variant < 0 || slot.variant >= template.variants) throw new Error(`${slot.id} has invalid template variant`);
  }
  if (new Set(links.map((link) => link.id)).size !== links.length) throw new Error('duplicate terrain link id');
  const usedEdges = new Set<string>();
  for (const link of links) {
    const from = byId.get(link.fromId), to = byId.get(link.toId);
    if (!from || !to) throw new Error(`${link.id} references missing module`);
    if (from.id === to.id) throw new Error(`${link.id} links a module to itself`);
    if (opposite(link.fromEdge) !== link.toEdge) throw new Error(`${link.id} has non-opposite directions`);
    const fromKey = `${from.id}:${link.fromEdge}`, toKey = `${to.id}:${link.toEdge}`;
    if (usedEdges.has(fromKey) || usedEdges.has(toKey)) throw new Error(`${link.id} reuses an occupied edge`);
    usedEdges.add(fromKey); usedEdges.add(toKey);
    if (!edgesCanConnect(from.edges[link.fromEdge], to.edges[link.toEdge])) throw new Error(`${link.id} has incompatible edges`);
  }
}
