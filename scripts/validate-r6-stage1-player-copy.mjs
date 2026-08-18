import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(process.cwd());
const readJson = (path) => readFile(resolve(root, path), 'utf8').then(JSON.parse);
const r5 = 'content/r5/stage-1';
const r6 = 'content/r6/stage-1/player-copy.json';
const [techs, projects, policies, copy] = await Promise.all([
  readJson(`${r5}/tech-catalog.json`),
  readJson(`${r5}/project-catalog.json`),
  readJson(`${r5}/policy-catalog.json`),
  readJson(r6),
]);

const forbidden = /LDU|NDU|PDU|SDU|requirement\.|copyKey|状态机|权重|槽位|债务|[a-z][0-9](?:[a-z][0-9])?/i;
const categories = new Set(['生存与资源', '工业、能源与基建', '交通、通信与后勤', '军事与安全', '社会与治理', '科学、教育与外拓', '当前政策']);

function fail(message) { throw new Error(`R6 文案校验失败：${message}`); }
function unique(values, label) { if (new Set(values).size !== values.length) fail(`${label} 中存在重复 key`); }
function validateEntries(entries, source, type, requiredFields) {
  if (entries.length !== source.length) fail(`${type} 数量为 ${entries.length}，应为 ${source.length}`);
  const sourceKeys = new Set(source.map((item) => item.playerCopyKey));
  unique(entries.map((entry) => entry.key), type);
  for (const entry of entries) {
    if (!sourceKeys.has(entry.key)) fail(`${type} 含未知 key：${entry.key}`);
    if (entry.type !== type) fail(`${entry.key} 的类型不是 ${type}`);
    if (!categories.has(entry.category)) fail(`${entry.key} 的分类不在冻结字典内`);
    for (const field of requiredFields) {
      const value = entry[field];
      if (typeof value === 'string' && !value.trim()) fail(`${entry.key}.${field} 为空`);
      if (Array.isArray(value) && value.some((line) => typeof line !== 'string' || !line.trim())) fail(`${entry.key}.${field} 含空条件`);
    }
    for (const [field, value] of Object.entries(entry)) {
      if (field === 'key') continue;
      if (typeof value === 'string' && forbidden.test(value)) fail(`${entry.key} 含开发语言`);
      if (Array.isArray(value) && value.some((line) => forbidden.test(line))) fail(`${entry.key} 含开发语言`);
    }
  }
}

validateEntries(copy.technology, techs, 'technology', ['title', 'summary', 'requirements', 'unlocks', 'limitation']);
validateEntries(copy.project, projects, 'project', ['title', 'summary', 'location', 'construction', 'requirements', 'outcome', 'limitation', 'mapResult']);
validateEntries(copy.policy, policies, 'policy', ['title', 'summary', 'duration', 'requirements', 'limitation', 'progression']);

console.log(JSON.stringify({
  result: 'passed',
  technology: copy.technology.length,
  project: copy.project.length,
  policy: copy.policy.length,
  categories: [...new Set([...copy.technology, ...copy.project, ...copy.policy].map((entry) => entry.category))],
  internalLanguage: 'none found',
}, null, 2));
