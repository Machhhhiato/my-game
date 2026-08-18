import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = process.cwd();
const r5File = resolve(root, 'content/r5/stage-1/map-asset-family-manifest.json');
const outDir = resolve(root, 'content/r8');
const outFile = resolve(outDir, 'texture-production-manifest.json');
const landmarkFamilies = JSON.parse(await readFile(r5File, 'utf8'));

const shared = {
  styleId: 'always-game-rimworld-zoomed-v1',
  background: 'transparent',
  alphaRequired: true,
  maxBytes: 20 * 1024,
  rendering: {
    pixelated: true,
    imageSmoothing: false,
    noText: true,
    noPlaceSpecificStory: true,
  },
};

const terrainSets = [
  ['mountain', '山地', 64, ['ridge-crest', 'single-peak', 'shoulder-slope', 'snow-cap']],
  ['highland', '高地', 64, ['escarpment', 'broken-shelf', 'hill-mass']],
  ['river_valley', '河谷', 64, ['river-bank', 'terraced-field', 'wetland-fringe']],
  ['plain', '平原', 48, ['field-mosaic', 'scrub-border']],
  ['forest', '森林', 48, ['dense-canopy', 'open-canopy', 'woodland-edge']],
  ['arid', '干旱地', 48, ['dune-field', 'mesa-outcrop', 'dry-wash']],
  ['tundra', '寒带', 48, ['frost-heath', 'ice-rock', 'snow-drift']],
  ['coast', '海岸', 64, ['cliff-headland', 'beach-inlet', 'estuary']],
];

const terrain = terrainSets.flatMap(([family, label, pixels, variants]) => variants.map((variant) => ({
  id: `terrain-${family}-${variant}`,
  category: 'terrainStamp',
  family,
  label: `${label}·${variant}`,
  file: `src/v2/assets/map/terrain/${family}/${variant}.png`,
  size: `${pixels}x${pixels}`,
  renderLayer: 'terrain-overlay',
  zoom: '全景先读宏观轮廓；中近景按同一地表占地细采样，不因缩放增加、移动或重掷贴图。',
  placement: '世界生成时由存档蓝图冻结真实坐标、朝向和占地；绝不按格铺满，也不按镜头即时散布。',
  batch: 'terrain-library',
  priority: 'runtime-wave-1',
  ...shared,
})));

const climates = [
  ['temperate_inland', '温带内陆'],
  ['arid_inland', '干旱内陆'],
  ['tropical_forest', '热带丛林'],
  ['highland_mountain', '高地山地'],
  ['polar_cold', '极地寒带'],
];
const stages = [
  ['stage_1', '萌芽聚落'],
  ['stage_2', '定居节点'],
  ['stage_3', '区域城镇'],
  ['stage_4', '都市节点'],
];
const settlements = climates.flatMap(([climate, climateLabel]) => stages.map(([stage, stageLabel]) => ({
  id: `settlement-${climate}-${stage}`,
  category: 'settlementSilhouette',
  climate,
  stage,
  label: `${climateLabel}·${stageLabel}`,
  file: `src/v2/assets/map/settlements/${climate}/${stage}.png`,
  size: '64x64',
  renderLayer: 'settlement',
  zoom: 'far/mid uses 0.45–0.9x with name flag and scale ring; near uses 1.0x',
  placement: '一个聚居地节点只引用一张；名称由旗帜绘制，贴图不得带文字、河流、编号或地名。',
  batch: 'settlement-library',
  priority: 'runtime-wave-1',
  ...shared,
})));

const landmarkImages = landmarkFamilies.flatMap((family) => family.requiredImages.map((state) => ({
  id: `landmark-${family.assetFamily}-${state}`,
  category: 'landmark',
  family: family.assetFamily,
  state,
  file: `src/v2/assets/map/landmarks/${family.assetFamily}/${state}.png`,
  size: ['foundation', 'structure', 'commissioning'].includes(state) ? '48x48' : '64x64',
  renderLayer: 'landmark',
  zoom: 'mid/near only; far view uses location flag and scale ring',
  placement: '只在对应工程状态和合法地形锚点同时满足时显示；不替代道路、水网、管线等事实层。',
  batch: 'landmark-library',
  priority: ['r5-water-link', 'r5-food-core', 'r5-industry-core', 'r5-logistics-interconnect'].includes(family.assetFamily) ? 'runtime-wave-1' : 'landmark-wave-2',
  appliesToProjectCount: family.appliesToProjectCount,
  ...shared,
})));

const manifest = {
  version: 1,
  generatedAt: '2026-08-16',
  title: 'R8 统一贴图生产清单',
  purpose: '先冻结统一美术生产需求，再按同一视觉基准分批制作；不是运行时随机生成贴图的目录。',
  visualContract: {
    target: '放大后的环世界式地图可读性：环境先被看见，透明像素贴图补充山脊、林簇、地表工程与聚居轮廓。',
    prohibited: ['文字、数字、徽章', '黑底或色键伪透明', '固定河谷、设施编号或剧情地点', '把完整地表做成一张不可存档的大图'],
    palette: '同一套低饱和土色、岩灰、苔绿、冷水蓝与琥珀灯火；深蓝绿 1px 轮廓，少量高光，避免霓虹与照片写实。',
  },
  totals: {
    terrainStamps: terrain.length,
    settlementSilhouettes: settlements.length,
    landmarkImages: landmarkImages.length,
    totalImages: terrain.length + settlements.length + landmarkImages.length,
    runtimeWave1: [...terrain, ...settlements, ...landmarkImages].filter((item) => item.priority === 'runtime-wave-1').length,
    landmarkWave2: landmarkImages.filter((item) => item.priority === 'landmark-wave-2').length,
  },
  production: {
    terrainLibrary: { status: 'delivered', deliveredOn: '2026-08-16', deliveredAssetCount: terrain.length },
    settlementLibrary: { status: 'planned', deliveredAssetCount: 0 },
    runtimeLandmarkWave1: { status: 'planned', deliveredAssetCount: 0 },
    landmarkWave2: { status: 'planned', deliveredAssetCount: 0 },
  },
  assets: { terrain, settlements, landmarkImages },
};

await mkdir(outDir, { recursive: true });
await writeFile(outFile, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`R8 texture manifest built: ${manifest.totals.totalImages} assets (${manifest.totals.runtimeWave1} runtime-wave-1).`);
