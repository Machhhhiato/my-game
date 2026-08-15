// 生成 1024x1024 应用图标(程序化行星+星环), 无第三方依赖
import { deflateSync } from 'zlib';
import { writeFileSync, mkdirSync } from 'fs';

const W = 1024, H = 1024;

// ---- PNG 编码 ----
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const out = Buffer.alloc(8 + data.length + 4);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}
function encodePNG(w, h, rgba) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; ihdr[9] = 6; // 8bit RGBA
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (w * 4 + 1)] = 0;
    rgba.copy(raw, y * (w * 4 + 1) + 1, y * w * 4, (y + 1) * w * 4);
  }
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0))]);
}

// ---- 绘制 ----
function rand(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const rng = rand(20240814);

const px = Buffer.alloc(W * H * 4);
// 背景渐变
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4;
    const t = y / H;
    px[i] = 13 - 9 * t; px[i + 1] = 20 - 14 * t; px[i + 2] = 40 - 32 * t; px[i + 3] = 255;
  }
}
// 星星
for (let n = 0; n < 260; n++) {
  const x = Math.floor(rng() * W), y = Math.floor(rng() * H);
  const r = rng() * 1.8 + 0.4, a = 90 + rng() * 165;
  for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
    const sx = x + dx, sy = y + dy;
    if (sx < 0 || sy < 0 || sx >= W || sy >= H) continue;
    if (dx * dx + dy * dy > r * r) continue;
    const i = (sy * W + sx) * 4;
    px[i] = 225; px[i + 1] = 232; px[i + 2] = 250; px[i + 3] = Math.max(px[i + 3], a);
  }
}
// 行星
function noise(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const h = (a, b) => {
    let v = (a * 374761393 + b * 668265263 + 777) >>> 0;
    v = (v ^ (v >> 13)) * 1274126177; v ^= v >> 16;
    return (v >>> 0) % 10000 / 10000;
  };
  const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
  return h(ix, iy) + (h(ix + 1, iy) - h(ix, iy)) * u + (h(ix, iy + 1) - h(ix, iy)) * v
    + (h(ix, iy) - h(ix + 1, iy) - h(ix, iy + 1) + h(ix + 1, iy + 1)) * u * v;
}
const cx = 512, cy = 512, R = 280;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = x - cx, dy = y - cy;
    const d2 = dx * dx + dy * dy;
    if (d2 > R * R) continue;
    const i = (y * W + x) * 4;
    const nx = dx / R, ny = dy / R, nz = Math.sqrt(1 - d2 / (R * R));
    const e = noise((nx + 1) * 5 + 3, (ny + 1) * 4 + 7) * 0.7 + noise((nx + 1) * 12 + 11, (ny + 1) * 9 + 2) * 0.3;
    const lat = ny;
    let r, g, b;
    if (Math.abs(lat) > 0.42) { r = 210; g = 228; b = 245; }
    else if (e < 0.45) { r = 26 + e * 60; g = 60 + e * 90; b = 105 + e * 90; }
    else if (e < 0.5) { r = 190; g = 175; b = 120; }
    else if (e < 0.62) { r = 62; g = 128; b = 70; }
    else if (e < 0.75) { r = 40; g = 95; b = 55; }
    else { r = 150; g = 140; b = 130; }
    const lx = -0.5, ly = 0.35, lz = 0.79;
    const ll = Math.hypot(lx, ly, lz);
    const shade = 0.25 + 0.75 * Math.max(0, (nx * lx + ny * ly + nz * lz) / ll);
    const rim = Math.pow(1 - nz, 2.2);
    px[i] = Math.min(255, r * shade + 90 * rim);
    px[i + 1] = Math.min(255, g * shade + 150 * rim);
    px[i + 2] = Math.min(255, b * shade + 230 * rim);
    px[i + 3] = 255;
  }
}
// 星环
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    const dx = (x - cx) / 1.0, dy = (y - cy - 30) / 0.36;
    const d = Math.hypot(dx, dy);
    if (d > 400 && d < 470) {
      const i = (y * W + x) * 4;
      if (px[i + 3] < 255) { // 只画星球外
        const a = 60 + 60 * Math.sin((d - 400) / 70 * Math.PI);
        px[i] = Math.min(255, px[i] * 0.4 + 200 * 0.6);
        px[i + 1] = Math.min(255, px[i + 1] * 0.4 + 210 * 0.6);
        px[i + 2] = Math.min(255, px[i + 2] * 0.4 + 235 * 0.6);
        px[i + 3] = a;
      }
    }
  }
}

mkdirSync('src-tauri/icons', { recursive: true });
writeFileSync('src-tauri/icons/app-icon.png', encodePNG(W, H, px));
console.log('icon written: src-tauri/icons/app-icon.png');
