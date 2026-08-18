import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const file = resolve(root, 'src/v2/content/stage1Discovery.ts');
const source = await readFile(file, 'utf8');
const count = (needle) => (source.match(new RegExp(needle, 'g')) ?? []).length;
if (count('"tier":') !== 50) throw new Error('R7 索引缺少主干突破');
if (count('"versions":') !== 20) throw new Error('R7 索引缺少政策脉络');
if (count('"branchCount": 15') !== 50 || count('"refinementCount": 4') !== 50) throw new Error('R7 索引的主干路线统计不完整');
if (/LDU|NDU|PDU|SDU|requirement\.|copyKey|状态机|权重|槽位|债务/.test(source)) throw new Error('R7 索引含内部术语');
console.log(JSON.stringify({ result: 'passed', majorDiscoveries: 50, policyLineages: 20, internalLanguage: 'none found' }, null, 2));
