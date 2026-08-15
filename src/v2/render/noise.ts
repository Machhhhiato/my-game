// ============ 确定性噪声（种子复现，无外部依赖） ============

export function hash3(ix: number, iy: number, iz: number, seed: number): number {
  let h = (seed ^ Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263) ^ Math.imul(iz, 946050911)) >>> 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

export function hash2(ix: number, iy: number, seed: number): number {
  let h = (seed ^ Math.imul(ix, 374761393) ^ Math.imul(iy, 668265263)) >>> 0;
  h = (h ^ (h >> 13)) * 1274126177;
  h = h ^ (h >> 16);
  return ((h >>> 0) % 10000) / 10000;
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

/** 3D 值噪声（三线性插值） */
export function noise3(x: number, y: number, z: number, seed: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const u = smooth(fx), v = smooth(fy), w = smooth(fz);
  let acc = 0;
  for (let di = 0; di < 2; di++) {
    for (let dj = 0; dj < 2; dj++) {
      for (let dk = 0; dk < 2; dk++) {
        const h = hash3(ix + di, iy + dj, iz + dk, seed);
        acc += h * (di ? u : 1 - u) * (dj ? v : 1 - v) * (dk ? w : 1 - w);
      }
    }
  }
  return acc;
}

/** 球面多 octave 噪声（经度无缝）；baseFreq 控制首 octave 频率（大陆尺度用 <1） */
export function fbm3(x: number, y: number, z: number, seed: number, octaves = 4, baseFreq = 1.6): number {
  let acc = 0;
  let amp = 0.5;
  let freq = baseFreq;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    acc += noise3(x * freq, y * freq, z * freq, seed + i * 101) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.0;
  }
  return acc / norm;
}

/** mulberry32 种子随机（用于河流选点等确定性抽样） */
export function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
