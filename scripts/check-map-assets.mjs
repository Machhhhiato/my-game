import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const assetDir = fileURLToPath(new URL('../src/v2/assets/', import.meta.url));
const limit = 20 * 1024;
async function collect(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const relative = join(prefix, entry.name);
    if (entry.isDirectory()) output.push(...await collect(join(dir, entry.name), relative));
    else if (entry.name.endsWith('.svg') || entry.name.endsWith('.png')) output.push(relative);
  }
  return output;
}

// 地图运行时引用的每张独立贴图都受同一体积预算约束，而非只检查第一批设施。
const files = await collect(assetDir);
let failed = false;
for (const name of files) {
  const bytes = (await stat(join(assetDir, name))).size;
  if (bytes > limit) { console.error(`OVER LIMIT ${name}: ${bytes} bytes`); failed = true; }
  else console.log(`OK ${name}: ${bytes} bytes`);
}
if (failed) process.exit(1);
