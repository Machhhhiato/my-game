import { useMemo, useState } from 'react';
import type { CampaignSaveV6, V6TechId } from '../types';
import {
  DISCOVERY_CATEGORIES,
  majorDiscoveriesFor,
  STAGE_1_POLICY_LINEAGES,
  type DiscoveryCategoryId,
  type MajorDiscovery,
} from '../content/stage1Discovery';

const PROTOTYPE_TO_STAGE: Partial<Record<V6TechId, string>> = {
  valley_survey: 'w1',
  membrane_reuse: 'w2',
  field_recovery: 'w3',
  archive_protocols: 's1',
  maintenance_training: 's2',
  shortwave_protocol: 'l2',
  public_health: 'h2',
  night_transit: 'q2',
};

const DOMAIN_NAMES: Record<string, string> = {
  water: '水土与居住', food: '食物与生物', industry: '材料与工务', energy: '能源与公用网',
  logistics: '交通与后勤', security: '安全与防务', admin: '行政与财政', social: '健康与社会',
  science: '科学与教育', frontier: '生态与外拓',
};

const POLICY_THEME_NAMES: Record<string, string> = {
  livelihood: '基本供给', production: '建设与生产', governance: '公共治理',
  mobility_security: '交通与安全', ecology_frontier: '环境与外拓',
};

function stageProgress(state: CampaignSaveV6): Set<string> {
  return new Set(state.completed.techs.map((id) => PROTOTYPE_TO_STAGE[id]).filter(Boolean) as string[]);
}

function nextByDomain(categoryId: DiscoveryCategoryId, complete: Set<string>): MajorDiscovery[] {
  const entries = majorDiscoveriesFor(categoryId);
  const domains = [...new Set(entries.map((entry) => entry.domain))];
  return domains.map((domain) => entries.find((entry) => entry.domain === domain && !complete.has(entry.id)) ?? entries.filter((entry) => entry.domain === domain).at(-1)!);
}

function CategoryTabs({ selected, onSelect }: { selected: DiscoveryCategoryId; onSelect: (id: DiscoveryCategoryId) => void }) {
  return <div className="v2-roadmap-tabs">
    {DISCOVERY_CATEGORIES.map((category) => <button key={category.id} className={`v2-roadmap-tab ${selected === category.id ? 'active' : ''}`} onClick={() => onSelect(category.id)}>{category.name}</button>)}
  </div>;
}

function MajorCard({ entry, complete, mode }: { entry: MajorDiscovery; complete: Set<string>; mode: 'research' | 'project' }) {
  const done = complete.has(entry.id);
  return <article className={`v2-roadmap-card ${done ? 'done' : ''}`}>
    <div className="v2-roadmap-card-top"><span>{DOMAIN_NAMES[entry.domain]} · 第 {entry.tier} 层</span><b>{done ? '已具备' : '下一项重大突破'}</b></div>
    <div className="v2-proj-name">{entry.title}</div>
    <p>{mode === 'research' ? entry.summary : `具备「${entry.title}」后，可开始规划${entry.unlocks.replace(/^开放「|」工程簇.*$/g, '')}。`}</p>
    <div className="v2-roadmap-line"><span>{mode === 'research' ? '会带来' : '将形成'}</span>{mode === 'research' ? entry.unlocks : `${entry.branchCount} 条推进路线与 ${entry.refinementCount} 项可靠性改善`}</div>
    {!done && entry.requirements.length > 0 && <div className="v2-roadmap-line"><span>开始前</span>{entry.requirements.slice(0, 2).join('；')}</div>}
    <div className="v2-roadmap-line"><span>代价</span>{entry.limitation}</div>
  </article>;
}

export function StageDiscoveryRoadmap({ state, mode }: { state: CampaignSaveV6; mode: 'research' | 'project' }) {
  const [selected, setSelected] = useState<DiscoveryCategoryId>('survival');
  const complete = useMemo(() => stageProgress(state), [state.completed.techs]);
  const next = nextByDomain(selected, complete);
  const domainCount = [...new Set(majorDiscoveriesFor(selected).map((entry) => entry.domain))].length;
  return <section className="v2-roadmap">
    <div className="v2-sub">阶段发展蓝图</div>
    <p className="v2-note">河谷走向区域城镇网络的长期路线图。这里的远期内容会在前面的研究和设施完成后，才进入可执行清单。</p>
    <CategoryTabs selected={selected} onSelect={setSelected} />
    <div className="v2-roadmap-summary">本方向有 {domainCount} 条主干、每条 5 个重大层级；当前只显示各自主干的下一步。</div>
    {next.map((entry) => <MajorCard key={entry.id} entry={entry} complete={complete} mode={mode} />)}
  </section>;
}

export function StagePolicyRoadmap() {
  const [theme, setTheme] = useState('livelihood');
  const lineages = STAGE_1_POLICY_LINEAGES.filter((entry) => entry.theme === theme);
  const themes = [...new Set(STAGE_1_POLICY_LINEAGES.map((entry) => entry.theme))];
  return <section className="v2-roadmap">
    <div className="v2-sub">政策如何发展</div>
    <p className="v2-note">当前政策是短期集中行动；当研究和设施成熟后，它会从临时安排变为固定服务，再发展为区域制度。</p>
    <div className="v2-roadmap-tabs">
      {themes.map((id) => <button key={id} className={`v2-roadmap-tab ${theme === id ? 'active' : ''}`} onClick={() => setTheme(id)}>{POLICY_THEME_NAMES[id] ?? id}</button>)}
    </div>
    {lineages.map((lineage) => <article className="v2-policy-lineage" key={lineage.id}>
      {lineage.versions.map((version, index) => <div className="v2-policy-version" key={version.version}>
        <span>{index === 0 ? '起步' : index === 1 ? '稳定服务' : '区域制度'}</span>
        <b>{version.title}</b>
      </div>)}
    </article>)}
  </section>;
}
