import type { Planet, SolarState } from '../core/types';

/** 生成母星系(seed 决定行星布局) */
export function generateSolar(seed: number): SolarState {
  const rnd = mulberry(seed);
  const planets: Planet[] = [
    { id: 'p_home', name: '家园星', type: 'lush', orbitRadius: 92, orbitSpeed: 0.00042, angle: rnd() * 6.28, size: 16, color: '#4a8a5a', colony: true },
    { id: 'p_ember', name: '灼日', type: 'rocky', orbitRadius: 55, orbitSpeed: 0.0008, angle: rnd() * 6.28, size: 8, color: '#c07050', colony: false },
    { id: 'p_dust', name: '荒原', type: 'rocky', orbitRadius: 128, orbitSpeed: 0.0003, angle: rnd() * 6.28, size: 11, color: '#a88870', colony: false },
    { id: 'p_belt', name: '碎石带', type: 'asteroid', orbitRadius: 172, orbitSpeed: 0.00022, angle: rnd() * 6.28, size: 6, color: '#8a8a90', colony: false },
    { id: 'p_giant', name: '朱庇特', type: 'gas', orbitRadius: 232, orbitSpeed: 0.00015, angle: rnd() * 6.28, size: 26, color: '#c8a06a', colony: false },
    { id: 'p_ice', name: '凛冬', type: 'ice', orbitRadius: 292, orbitSpeed: 0.00011, angle: rnd() * 6.28, size: 20, color: '#8ab8d8', colony: false },
    { id: 'p_rich', name: '富矿', type: 'rocky', orbitRadius: 342, orbitSpeed: 0.00008, angle: rnd() * 6.28, size: 13, color: '#b0a090', colony: false },
  ];

  return {
    starName: '天启',
    planets,
    stations: [
      { id: 'st_home', kind: 'station', name: '轨道空间站', planetId: 'p_home', level: 1 },
    ],
    fleets: [
      {
        id: 'f_first', name: '第一舰队',
        ships: [{ id: 'sh_dawn', name: '曙光号', cls: 'corvette', power: 10, hp: 100 }],
        x: 100, y: 140,
      },
    ],
  };
}

/** 简单可复现随机 */
function mulberry(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
