import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const file = resolve(process.cwd(), 'content/r8/texture-production-manifest.json');
const manifest = JSON.parse(await readFile(file, 'utf8'));
const fail = (message) => { throw new Error(`R8 texture manifest validation failed: ${message}`); };
const assert = (condition, message) => { if (!condition) fail(message); };
const { terrain, settlements, landmarkImages } = manifest.assets;
const all = [...terrain, ...settlements, ...landmarkImages];

assert(manifest.version === 1, 'version must be 1');
assert(terrain.length === 24, `expected 24 terrain stamps, got ${terrain.length}`);
assert(settlements.length === 20, `expected 20 generic settlement silhouettes, got ${settlements.length}`);
assert(landmarkImages.length === 320, `expected 320 R5 landmark states, got ${landmarkImages.length}`);
assert(manifest.totals.totalImages === 364, `expected 364 total images, got ${manifest.totals.totalImages}`);
assert(new Set(all.map((asset) => asset.id)).size === all.length, 'duplicate asset ids');
assert(all.every((asset) => asset.background === 'transparent' && asset.alphaRequired), 'every asset must require real transparency');
assert(all.every((asset) => asset.maxBytes <= 20 * 1024), 'an asset exceeds the 20KB cap');
assert(all.every((asset) => asset.rendering.pixelated && asset.rendering.imageSmoothing === false && asset.rendering.noText), 'pixel rendering contract is incomplete');
// 河谷是合法的通用地貌类别；但聚居地和工程资源不能锁死到当前河谷剧情原型。
assert([...settlements, ...landmarkImages].every((asset) => !/river|hegu|facility07|第 ?07|河谷/i.test(`${asset.id} ${asset.file}`)), 'settlement or landmark assets must not be tied to the river-valley prototype');
assert(new Set(terrain.map((asset) => asset.family)).size === 8, 'terrain must cover eight visual families');
assert(new Set(settlements.map((asset) => asset.climate)).size === 5, 'settlements must cover five climate families');
assert(new Set(settlements.map((asset) => asset.stage)).size === 4, 'settlements must cover four growth stages');
assert(new Set(landmarkImages.map((asset) => asset.family)).size === 40, 'landmarks must cover forty R5 families');
assert(landmarkImages.every((asset) => asset.appliesToProjectCount === 5), 'landmark reuse count must stay at five projects per family');
assert(manifest.production.terrainLibrary.status === 'delivered' && manifest.production.terrainLibrary.deliveredAssetCount === terrain.length, 'terrain delivery state is inconsistent');
await Promise.all(terrain.map((asset) => access(resolve(process.cwd(), asset.file)).catch(() => fail(`missing delivered terrain asset ${asset.file}`))));
console.log(JSON.stringify({
  ok: true,
  terrainStamps: terrain.length,
  settlementSilhouettes: settlements.length,
  landmarkImages: landmarkImages.length,
  runtimeWave1: manifest.totals.runtimeWave1,
  landmarkWave2: manifest.totals.landmarkWave2,
  deliveredTerrainAssets: manifest.production.terrainLibrary.deliveredAssetCount,
}, null, 2));
