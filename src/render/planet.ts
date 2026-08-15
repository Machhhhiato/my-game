// 旋转星球渲染器: 程序化贴图 + 逐像素球面映射, 零依赖、低开销
export class PlanetRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texW = 256;
  private texH = 128;
  private tex: Uint8ClampedArray; // RGB 大陆纹理
  private lights: Uint8Array;     // 城市灯光强度
  private stars: { x: number; y: number; r: number; ph: number }[] = [];
  private rot = 0;
  private R = 100;
  private seed: number;

  constructor(canvas: HTMLCanvasElement, seed: number) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.seed = seed;
    this.tex = new Uint8ClampedArray(this.texW * this.texH * 3);
    this.lights = new Uint8Array(this.texW * this.texH);
    this.buildTexture();
    this.buildStars();
  }

  private rand(x: number, y: number): number {
    let h = (this.seed ^ (x * 374761393) ^ (y * 668265263)) >>> 0;
    h = (h ^ (h >> 13)) * 1274126177;
    h ^= h >> 16;
    return (h >>> 0) % 10000 / 10000;
  }

  private noise(x: number, y: number): number {
    const ix = Math.floor(x), iy = Math.floor(y);
    const fx = x - ix, fy = y - iy;
    const a = this.rand(ix, iy), b = this.rand(ix + 1, iy);
    const c = this.rand(ix, iy + 1), d = this.rand(ix + 1, iy + 1);
    const u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  }

  private elevation(u: number, v: number): number {
    const n1 = this.noise(u * 9 + 3, v * 5 + 7);
    const n2 = this.noise(u * 22 + 11, v * 13 + 2);
    return n1 * 0.68 + n2 * 0.32;
  }

  private buildTexture(): void {
    const t = this.tex, L = this.lights;
    for (let y = 0; y < this.texH; y++) {
      const v = y / this.texH;
      const lat = v - 0.5; // -0.5..0.5
      for (let x = 0; x < this.texW; x++) {
        const u = x / this.texW;
        const e = this.elevation(u, v);
        let r = 0, g = 0, b = 0;
        const ice = Math.abs(lat) > 0.44;
        if (ice) { r = 223; g = 233; b = 242; }
        else if (e < 0.45) { const d = e / 0.45; r = 26 + d * 40; g = 53 + d * 55; b = 87 + d * 65; }
        else if (e < 0.485) { r = 200; g = 180; b = 122; }
        else if (e < 0.62) { const d = (e - 0.485) / 0.135; r = 74 - d * 10; g = 122 - d * 20; b = 58; }
        else if (e < 0.74) { r = 47; g = 90; b = 42; }
        else if (e < 0.86) { r = 138; g = 128; b = 120; }
        else { r = 232; g = 236; b = 242; }
        const idx = (y * this.texW + x) * 3;
        t[idx] = r; t[idx + 1] = g; t[idx + 2] = b;
        // 城市灯光: 大陆 + 哈希稀疏点
        if (e > 0.485 && e < 0.74 && !ice) {
          const h = this.rand(x * 3 + 1, y * 3 + 5);
          if (h > 0.975) L[y * this.texW + x] = 60 + h * 160;
        }
      }
    }
  }

  private buildStars(): void {
    for (let i = 0; i < 70; i++) {
      this.stars.push({
        x: this.rand(i * 2 + 1, 9) * this.canvas.width,
        y: this.rand(i * 3 + 2, 17) * this.canvas.height,
        r: 0.4 + this.rand(i, 29) * 1.1,
        ph: this.rand(i * 7, 41) * Math.PI * 2,
      });
    }
  }

  resize(w: number, h: number): void {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    this.canvas.width = w * dpr;
    this.canvas.height = h * dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.R = Math.min(w, h) * 0.42;
    this.buildStars();
  }

  frame(tMs: number): void {
    const w = this.canvas.width / Math.min(2, window.devicePixelRatio || 1);
    const h = this.canvas.height / Math.min(2, window.devicePixelRatio || 1);
    this.rot += 0.00035; // 约 1 分钟一周
    const ctx = this.ctx;
    const cx = w / 2, cy = h / 2, R = this.R;
    ctx.clearRect(0, 0, w, h);
    // 星空
    for (const st of this.stars) {
      const a = 0.25 + 0.75 * Math.abs(Math.sin(tMs / 900 + st.ph));
      ctx.fillStyle = `rgba(220,230,255,${a.toFixed(2)})`;
      ctx.fillRect(st.x, st.y, st.r, st.r);
    }
    // 球体逐像素
    const img = ctx.createImageData(R * 2, R * 2);
    const data = img.data;
    const lx = -0.45, ly = 0.35, lz = 0.82;
    const ll = Math.hypot(lx, ly, lz);
    for (let sy = 0; sy < R * 2; sy++) {
      const dy = sy - R;
      for (let sx = 0; sx < R * 2; sx++) {
        const dx = sx - R;
        const r2 = dx * dx + dy * dy;
        const i = (sy * R * 2 + sx) * 4;
        if (r2 > R * R) { data[i + 3] = 0; continue; }
        const nz = Math.sqrt(R * R - r2) / R;
        const nx = dx / R, ny = -dy / R;
        const lon = Math.atan2(nx, nz);
        const u = ((lon / (Math.PI * 2) + this.rot) % 1 + 1) % 1;
        const v = Math.asin(Math.max(-1, Math.min(1, ny))) / Math.PI + 0.5;
        const tx = Math.min(this.texW - 1, Math.floor(u * this.texW));
        const ty = Math.min(this.texH - 1, Math.floor(v * this.texH));
        const ti = (ty * this.texW + tx) * 3;
        let r = this.tex[ti], g = this.tex[ti + 1], b = this.tex[ti + 2];
        const dot = (nx * lx + ny * ly + nz * lz) / ll;
        const shade = 0.22 + 0.78 * Math.max(0, dot);
        r *= shade; g *= shade; b *= shade;
        // 夜面城市灯光
        if (dot < 0.12) {
          const li = this.lights[ty * this.texW + tx];
          if (li > 0) {
            const k = li / 255 * (1 - Math.max(0, dot) * 2);
            r += 255 * k * 0.85; g += 210 * k * 0.75; b += 120 * k * 0.55;
          }
        }
        // 大气边缘光
        const rim = Math.pow(1 - nz, 1.8);
        r += 90 * rim; g += 150 * rim; b += 230 * rim;
        data[i] = Math.min(255, r);
        data[i + 1] = Math.min(255, g);
        data[i + 2] = Math.min(255, b);
        data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, cx - R, cy - R);
  }
}
