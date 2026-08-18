import { SEA, sampleHeight } from '../render/terrain';
import type { ClimateKind, WorldBlueprint } from '../types';

const D2R = Math.PI / 180;

function clamp(value: number, low = 0, high = 1): number {
  return Math.max(low, Math.min(high, value));
}

function wrapLon(lon: number): number {
  return ((lon + 180) % 360 + 360) % 360 - 180;
}

/**
 * 低纬信风、西风带与极地东风的简化方向。它不是天气预报，而是稳定的气候平均风，
 * 供“海上水汽从哪里来、哪侧山后会变干”这类长期世界事实使用。
 */
function prevailingWind(lat: number): [number, number] {
  const hemi = lat >= 0 ? 1 : -1;
  const abs = Math.abs(lat);
  if (abs < 30) return [-1, -0.10 * hemi];
  if (abs < 60) return [1, 0.16 * hemi];
  return [-1, -0.08 * hemi];
}

function macroOceanAt(lon: number, lat: number, world: WorldBlueprint): boolean {
  // 高程计算已包含海盆、大陆架和构造作用；这里让气候服从同一地形事实。
  return sampleHeight(wrapLon(lon), Math.max(-89.5, Math.min(89.5, lat)), world) < SEA;
}

function distanceToWatershed(lon: number, lat: number, world: WorldBlueprint): number {
  let best = Infinity;
  const cosLat = Math.max(0.28, Math.cos(lat * D2R));
  for (const watershed of world.watersheds) {
    for (let i = 0; i < watershed.path.length - 1; i++) {
      const [ax, ay] = watershed.path[i];
      const [bx, by] = watershed.path[i + 1];
      const dx = wrapLon(bx - ax) * cosLat, dy = by - ay;
      const lengthSquared = dx * dx + dy * dy;
      const px = wrapLon(lon - ax) * cosLat, py = lat - ay;
      const t = Math.max(0, Math.min(1, (px * dx + py * dy) / Math.max(0.00001, lengthSquared)));
      best = Math.min(best, Math.hypot(px - dx * t, py - dy * t));
    }
  }
  return best;
}

export interface ClimateSample {
  temperatureC: number;
  moisture: number;
  oceanFetch: number;
  rainShadow: number;
  climate: ClimateKind;
}

/**
 * 气候采样的最小可检验版本：纬度/海拔控制温度，主导风和上风向海面提供水汽，
 * 上风向山脉形成雨影。洋流仍是下一层全球海洋循环模型，不能在这里伪造成已实现。
 */
export function sampleClimate(lon: number, lat: number, world: WorldBlueprint): ClimateSample {
  const elevation = sampleHeight(lon, lat, world);
  const [windLon, windLat] = prevailingWind(lat);
  const cosLat = Math.max(0.28, Math.cos(lat * D2R));
  let oceanFetch = 0;
  let highestUpwind = elevation;
  const distances = [3, 7, 13, 22, 34];
  for (const distance of distances) {
    // 取来风方向而非去风方向：上风向的海面才是水汽来源。
    const upstreamLon = wrapLon(lon - windLon * distance / cosLat);
    const upstreamLat = Math.max(-89.5, Math.min(89.5, lat - windLat * distance));
    if (macroOceanAt(upstreamLon, upstreamLat, world)) oceanFetch += 1 / distances.length;
    highestUpwind = Math.max(highestUpwind, sampleHeight(upstreamLon, upstreamLat, world));
  }
  const altitudeAboveSea = Math.max(0, elevation - SEA);
  const temperatureC = 28.5 - Math.abs(lat) * 0.43 - altitudeAboveSea * 53;
  // 山脊位于上风侧且比当前位置明显高，才扣除水汽；山顶自身不会被错误判成背风荒漠。
  const rainShadow = clamp((highestUpwind - elevation - 0.035) / 0.18);
  const subtropicalDryness = Math.exp(-(((Math.abs(lat) - 25) / 11) ** 2)) * 0.16;
  // 大河谷本身不是海洋，但稳定水面、冲积土和植被蒸散会形成局部湿润带。
  // 它只能抬升邻近流域，不能把整个内陆错误变成热带雨林。
  const riverHumidity = clamp(1 - distanceToWatershed(lon, lat, world) / 3.2) * 0.32;
  const moisture = clamp(0.18 + oceanFetch * 0.55 + riverHumidity - rainShadow * 0.42 - subtropicalDryness);
  const climate: ClimateKind = temperatureC <= 0
    ? 'polar'
    : temperatureC < 8
      ? 'cold'
      : moisture < 0.30
        ? 'arid'
        : temperatureC >= 21 && moisture >= 0.48
          ? 'tropical'
          : 'temperate';
  return { temperatureC, moisture, oceanFetch, rainShadow, climate };
}
