import type { ResourceId } from '../core/types';

export const RES_META: Record<ResourceId, { icon: string; name: string }> = {
  wood: { icon: '🪵', name: '木材' },
  steel: { icon: '🔩', name: '钢铁' },
  components: { icon: '🧩', name: '零件' },
  food: { icon: '🍖', name: '食物' },
  herbal: { icon: '🌿', name: '草药' },
  rp: { icon: '🔬', name: '研究点' },
  alloy: { icon: '🧱', name: '合金' },
  fuel: { icon: '⛽', name: '燃料' },
};

export const RES_ORDER: ResourceId[] = ['wood', 'steel', 'components', 'food', 'herbal', 'rp', 'alloy', 'fuel'];

export const STATE_EMOJI: Record<string, string> = {
  idle: '😐', walk: '🚶', work: '🔧', eat: '🍖', sleep: '💤',
  recreate: '🎵', broken: '😵', heal: '💊', dead: '💀',
};
