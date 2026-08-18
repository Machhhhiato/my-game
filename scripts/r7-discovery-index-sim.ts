import {
  DISCOVERY_CATEGORIES,
  majorDiscoveriesFor,
  STAGE_1_MAJOR_DISCOVERIES,
  STAGE_1_POLICY_LINEAGES,
} from '../src/v2/content/stage1Discovery';

function expect(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(`R7 目录验收失败：${message}`);
}

expect(DISCOVERY_CATEGORIES.length === 6, '玩家分类不是六类');
expect(STAGE_1_MAJOR_DISCOVERIES.length === 50, '主干突破数量不是 50');
expect(STAGE_1_POLICY_LINEAGES.length === 20, '政策脉络数量不是 20');

for (const category of DISCOVERY_CATEGORIES) {
  const discoveries = majorDiscoveriesFor(category.id);
  const domains = [...new Set(discoveries.map((entry) => entry.domain))];
  const expectedDomains = ['logistics', 'security'].includes(category.id) ? 1 : 2;
  expect(domains.length === expectedDomains, `${category.name} 领域数量不正确`);
  expect(discoveries.length === expectedDomains * 5, `${category.name} 没有完整的五层主干`);
  for (const domain of domains) {
    const route = discoveries.filter((entry) => entry.domain === domain);
    expect(route.length === 5, `${category.name} 的 ${domain} 主干不是五层`);
    expect(route.every((entry) => entry.branchCount === 15 && entry.refinementCount === 4), `${category.name} 的 ${domain} 路线统计不正确`);
  }
}

for (const lineage of STAGE_1_POLICY_LINEAGES) {
  expect(lineage.versions.length === 3, `${lineage.id} 没有三阶段版本`);
  expect(lineage.versions.every((version) => version.title && version.summary && version.duration && version.limitation), `${lineage.id} 的玩家信息不完整`);
}

console.log(JSON.stringify({
  result: 'passed',
  categories: DISCOVERY_CATEGORIES.length,
  majorDiscoveries: STAGE_1_MAJOR_DISCOVERIES.length,
  policyLineages: STAGE_1_POLICY_LINEAGES.length,
  readingPattern: 'six categories → one or two domain trunks → next major step',
}, null, 2));
