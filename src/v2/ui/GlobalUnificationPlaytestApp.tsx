import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  advanceNationKernelDays,
  assignProductionFactories,
  conductMissileDemonstration,
  createGlobalUnificationPlaytestState,
  createIndustrialStrategy,
  globalUnificationReadiness,
  launchBasicSatellite,
  ratifyGlobalSettlement,
  setEconomicAllocation,
  setIndustrialStrategy,
  setOccupationApproach,
  strategicAssetPresentation,
} from '../nationKernel';
import type { NationKernelState } from '../nationKernel';
import './globalUnification.css';

type PageId = 'overview' | 'industry' | 'conflict' | 'governance' | 'infrastructure' | 'unification';
type Tone = 'good' | 'warn' | 'danger' | 'neutral';

const pages: Array<{ id: PageId; icon: string; label: string; eyebrow: string }> = [
  { id: 'overview', icon: '⌂', label: '国家总览', eyebrow: '全局态势' },
  { id: 'industry', icon: '▦', label: '工业与装备', eyebrow: '生产决策' },
  { id: 'conflict', icon: '⌁', label: '战区与外交', eyebrow: '有限战争' },
  { id: 'governance', icon: '◎', label: '地区治理', eyebrow: '整合成本' },
  { id: 'infrastructure', icon: '△', label: '海空天网络', eyebrow: '国家神经' },
  { id: 'unification', icon: '✦', label: '全球统一', eyebrow: 'R37 门槛' },
];

const format = (value: number, digits = 1): string => new Intl.NumberFormat('zh-CN', { maximumFractionDigits: digits }).format(value);
const percent = (value: number, ratio = false): string => `${format(ratio ? value * 100 : value)}%`;
const clamp = (value: number): number => Math.max(0, Math.min(100, value));
const stageNames: Record<string, string> = { fragmented: '碎片化世界', contestedOrder: '秩序竞逐', hegemonicSettlement: '霸权性整合', globalUnion: '全球共同体' };
const occupationNames: Record<string, string> = { militaryControl: '军事管制', stabilizing: '秩序恢复', civilAdministration: '民政治理', integrated: '完成整合', failed: '治理失败' };

function Meter({ value, tone = 'neutral' }: { value: number; tone?: Tone }): ReactElement {
  return <span className={`gu-meter ${tone}`}><i style={{ width: `${clamp(value)}%` }} /></span>;
}

function Stat({ label, value, detail, tone = 'neutral' }: { label: string; value: string; detail: string; tone?: Tone }): ReactElement {
  return <article className={`gu-stat ${tone}`}><span>{label}</span><strong>{value}</strong><small>{detail}</small></article>;
}

function SectionTitle({ kicker, title, aside }: { kicker: string; title: string; aside?: string }): ReactElement {
  return <header className="gu-section-title"><div><span>{kicker}</span><h2>{title}</h2></div>{aside != null && <small>{aside}</small>}</header>;
}

export function GlobalUnificationPlaytestApp({ onExit }: { onExit: () => void }): ReactElement {
  const [state, setState] = useState<NationKernelState>(createGlobalUnificationPlaytestState);
  const [page, setPage] = useState<PageId>('overview');
  const [notice, setNotice] = useState('最后一个独立集团仍控制关键海峡。你的目标不是占满地图，而是建立一个能长期运行的全球共同体。');
  const systems = state.civilizationSystems!;
  const campaign = systems.campaigns['campaign.final-corridor'];
  const negotiation = systems.negotiations['negotiation.final-order'];
  const occupation = systems.occupations['occupation.final-bloc'];
  const readiness = globalUnificationReadiness(state)!;
  const readinessEntries = Object.entries(readiness);
  const metCount = readinessEntries.filter(([, item]) => item.met).length;
  const activePage = pages.find((item) => item.id === page)!;
  const lines = Object.values(state.productionLines).filter((line) => line.polityId === state.playerPolityId);
  const designs = Object.values(state.designs).filter((design) => design.polityId === state.playerPolityId && design.identity != null);
  const settlement = negotiation.settlementId == null ? undefined : systems.settlements[negotiation.settlementId];
  const alerts = useMemo(() => {
    const next: Array<{ tone: Tone; title: string; detail: string; page: PageId }> = [];
    if (systems.logistics.bottleneck > 0) next.push({ tone: 'danger', title: '全国物流出现缺口', detail: `每日需求超出有效运力 ${format(systems.logistics.bottleneck)} 点`, page: 'infrastructure' });
    if (occupation.resistance > 45) next.push({ tone: 'warn', title: '最后地区抵抗仍然活跃', detail: `抵抗压力 ${format(occupation.resistance)}，服务与司法尚未建立信任`, page: 'governance' });
    if (negotiation.status === 'accepted' && settlement?.status === 'active') next.push({ tone: 'good', title: '全球协议等待批准', detail: '批准后最后一个独立集团将进入共同制度', page: 'unification' });
    if (campaign.status === 'active') next.push({ tone: 'neutral', title: '海峡走廊战役进行中', detail: `控制度 ${format(campaign.control)}，我方疲劳 ${format(campaign.attackerExhaustion)}`, page: 'conflict' });
    return next;
  }, [campaign, negotiation.status, occupation, settlement?.status, systems.logistics.bottleneck]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = '全球统一 · Always Game';
    return () => { document.title = previousTitle; };
  }, []);

  function transform(action: (previous: NationKernelState) => NationKernelState, message: string, rejected = '当前条件不足，命令没有生效。'): void {
    setState((previous) => { const next = action(previous); setNotice(next === previous ? rejected : message); return next; });
  }
  function advance(days: number): void { transform((previous) => advanceNationKernelDays(previous, days), `时间推进 ${days} 日。所有生产、战役、治理与社会后果已经结算。`); }
  function applyRoute(route: 'service' | 'mobilization'): void {
    if (route === 'service') {
      transform((previous) => setOccupationApproach(setEconomicAllocation(previous, { militaryShare: .21, civilianShare: .28, reconstructionShare: .24, researchShare: .12, logisticsShare: .15 }), occupation.id, 25, 30), '已采用“公共服务整合”：保留最低守备预算，把主要资源投向民生、重建与长期整合。');
    } else {
      transform((previous) => setOccupationApproach(setEconomicAllocation(previous, { militaryShare: .46, civilianShare: .15, reconstructionShare: .07, researchShare: .1, logisticsShare: .22 }), occupation.id, 85, 8), '已采用“紧急军事动员”：安全提升更快，但民生、债务和长期整合将承受代价。');
    }
  }
  function setIndustry(policy: string, route: string, message: string): void {
    const strategy = createIndustrialStrategy(policy, route); if (strategy == null) return;
    transform((previous) => setIndustrialStrategy(previous, strategy), message);
  }

  return <main className="gu-shell">
    <aside className="gu-sidebar">
      <div className="gu-brand"><b>AG</b><div><strong>ALWAYS GAME</strong><span>国家内阁终端</span></div></div>
      <nav>{pages.map((item) => <button key={item.id} className={page === item.id ? 'active' : ''} onClick={() => setPage(item.id)}><i>{item.icon}</i><span><small>{item.eyebrow}</small>{item.label}</span>{item.id === 'unification' && <em>{metCount}/{readinessEntries.length}</em>}</button>)}</nav>
      <div className="gu-sidebar-foot"><span>当前阶段</span><strong>{stageNames[systems.globalUnification.stage]}</strong><Meter value={metCount / readinessEntries.length * 100} tone={metCount === readinessEntries.length ? 'good' : 'warn'} /><small>R37 · 全球统一节点</small></div>
    </aside>

    <section className="gu-workspace">
      <header className="gu-topbar">
        <div><span>{activePage.eyebrow}</span><h1>{activePage.label}</h1></div>
        <div className="gu-clock"><span>余烬历 {state.calendar.year} 年 {state.calendar.month} 月</span><strong>第 {state.calendar.day} 日</strong></div>
        <div className="gu-time-actions"><button onClick={() => advance(1)}>+1 日</button><button onClick={() => advance(10)}>+10 日</button><button className="primary" onClick={() => advance(30)}>推进一月</button><button onClick={() => { setState(createGlobalUnificationPlaytestState()); setNotice('R37 试玩场景已重置。'); }}>重置</button><button onClick={onExit}>退出</button></div>
      </header>

      <div className="gu-notice" aria-live="polite"><span>国家调度简报</span><p>{notice}</p></div>

      <div className="gu-content">
        {page === 'overview' && <>
          <section className="gu-hero">
            <div><span className="gu-kicker">全球局势 · 最后的整合窗口</span><h2>赢下战争很容易，<br />让世界继续运转才是胜利。</h2><p>一个独立集团、一条争议海峡、一个尚未信任中央的地区。军事、工业、民生与制度必须同时过线。</p><button className="gu-cta" onClick={() => setPage('unification')}>查看统一条件 <i>→</i></button></div>
            <div className="gu-orbit"><span className="ring r1" /><span className="ring r2" /><span className="planet"><i>{metCount}</i><small>项条件<br />已达成</small></span><em>全球共同体</em></div>
          </section>
          <section className="gu-stats">
            <Stat label="合法性" value={percent(systems.politics.legitimacy)} detail={`抗议压力 ${format(systems.politics.protestPressure)}`} tone={systems.politics.legitimacy >= 55 ? 'good' : 'danger'} />
            <Stat label="有效运力" value={format(systems.logistics.effectiveCapacity)} detail={`物流缺口 ${format(systems.logistics.bottleneck)}`} tone={systems.logistics.bottleneck === 0 ? 'good' : 'danger'} />
            <Stat label="民用物资可得" value={percent(systems.economy.civilianAvailability)} detail={`通胀压力 ${format(systems.economy.inflationPressure)}`} tone={systems.economy.civilianAvailability >= 60 ? 'good' : 'warn'} />
            <Stat label="地区整合" value={percent(systems.globalUnification.integratedPopulationRatio, true)} detail={`抵抗压力 ${format(systems.globalUnification.resistancePressure)}`} tone={systems.globalUnification.resistancePressure <= 35 ? 'good' : 'warn'} />
          </section>
          <section className="gu-two-column">
            <article className="gu-panel"><SectionTitle kicker="需要你决定" title="国家级待办" aside={`${alerts.length} 项正在影响全局`} /><div className="gu-alert-list">{alerts.map((alert) => <button key={alert.title} onClick={() => setPage(alert.page)}><i className={alert.tone} /><span><strong>{alert.title}</strong><small>{alert.detail}</small></span><em>查看 →</em></button>)}</div></article>
            <article className="gu-panel"><SectionTitle kicker="资源分配" title="国家预算方向" aside="总计 100%" /><div className="gu-allocation">{[['军事', systems.economy.militaryShare, 'danger'], ['民生', systems.economy.civilianShare, 'good'], ['重建', systems.economy.reconstructionShare, 'warn'], ['科研', systems.economy.researchShare, 'neutral'], ['物流', systems.economy.logisticsShare, 'neutral']].map(([label, value, tone]) => <div key={String(label)}><span>{label}<b>{percent(Number(value), true)}</b></span><Meter value={Number(value) * 100} tone={tone as Tone} /></div>)}</div><div className="gu-button-row"><button onClick={() => applyRoute('service')}>转向民生整合</button><button className="danger" onClick={() => applyRoute('mobilization')}>紧急军事动员</button></div></article>
          </section>
        </>}

        {page === 'industry' && <>
          <section className="gu-page-intro"><span>国家机器</span><h2>每一件装备都在争抢同一批工厂、工人和维护能力</h2><p>产能不是抽象数字。装备必须被生产、交付、磨损和补充，转产还会失去已经爬升的效率。</p></section>
          <section className="gu-two-column">
            <article className="gu-panel"><SectionTitle kicker="装备生产栏" title="军工厂分配" aside={`${lines.length} 条产线`} />{lines.map((line) => { const design = state.designs[line.designId]; const stock = state.stockpiles[line.stockpileId]; const presentation = design.identity == null ? undefined : strategicAssetPresentation(design.identity.presentationId); return <div className="gu-production" key={line.id}><div className="gu-production-head"><span><strong>{presentation?.displayName ?? design.id}</strong><small>{line.status === 'operating' ? '生产中' : line.status === 'retooling' ? '正在转产' : '已暂停'}</small></span><b>{format(stock?.quantity ?? 0)}<small>库存</small></b></div><div className="gu-factory-line"><span>投入军工厂</span><div><button onClick={() => transform((s) => assignProductionFactories(s, line.id, (line.assignedFactoryUnits ?? 0) - 1), '已减少一座军工厂。')}>−</button><strong>{format(line.assignedFactoryUnits ?? 0, 0)}</strong><button onClick={() => transform((s) => assignProductionFactories(s, line.id, (line.assignedFactoryUnits ?? 0) + 1), '已追加一座军工厂。')}>＋</button></div></div><div className="gu-line-metrics"><span>效率 <b>{percent(line.efficiency, true)}</b><Meter value={line.efficiency * 100} /></span><span>日产 <b>{format(line.dailyOutput)}</b><Meter value={Math.min(100, line.dailyOutput * 18)} tone="good" /></span></div></div>; })}</article>
            <article className="gu-panel"><SectionTitle kicker="工业路线" title="产量、韧性与转产速度" aside="路线可随时试切" /><div className="gu-choice-grid"><button onClick={() => setIndustry('policy.industry.limited-mobilization', 'technology-route.industry.flexible', '切换为弹性生产：转产损失更低、爬坡更快，峰值产量较低。')}><strong>弹性生产线</strong><span>适合多装备、小批量和战损后的快速恢复。</span></button><button onClick={() => setIndustry('policy.industry.limited-mobilization', 'technology-route.industry.concentrated', '切换为集中工业：成熟产线峰值更高，但转产慢且更怕设施受损。')}><strong>集中工业</strong><span>适合稳定型号的大规模连续生产。</span></button><button className="danger" onClick={() => setIndustry('policy.industry.war-economy', state.industrialStrategy?.technologyRouteId ?? 'technology-route.industry.balanced', '进入战时经济：军工产出提高，民用建设与稳定开始付出代价。')}><strong>战时经济</strong><span>更高产量，但民用建设下降并持续消耗稳定。</span></button><button onClick={() => setIndustry('policy.industry.civilian-economy', state.industrialStrategy?.technologyRouteId ?? 'technology-route.industry.balanced', '恢复民用经济：军工减产，建设和长期维护压力缓解。')}><strong>民用经济</strong><span>释放建设能力，为整合与公共服务提供空间。</span></button></div></article>
          </section>
          <section className="gu-arsenal">{designs.map((design) => { const item = strategicAssetPresentation(design.identity!.presentationId); if (item == null) return null; return <article key={design.id}><span>{design.kind === 'vehicle' ? '重装战略资产' : '标准化装备体系'}</span><h3>{item.displayName}</h3><p>{item.impactSummary}</p><div><b>拥有它意味着</b>{item.civilizationMeaning}</div><small>现实限制：{item.limitationSummary}</small></article>; })}</section>
        </>}

        {page === 'conflict' && <>
          <section className="gu-page-intro"><span>海峡走廊危机</span><h2>有限目标，有限战争，必须留下谈判出口</h2><p>战场控制会提高筹码，但伤亡、疲劳、民用损害与基础设施破坏也会改变国内政治。</p></section>
          <section className="gu-two-column">
            <article className="gu-panel"><SectionTitle kicker="战役态势" title="海峡走廊行动" aside={campaign.status === 'active' ? '交战中' : campaign.status} /><div className="gu-battle-balance"><div><strong>{format(campaign.control)}</strong><span>我方控制</span></div><Meter value={campaign.control} tone={campaign.control >= 55 ? 'good' : 'warn'} /><div><strong>{format(100 - campaign.control)}</strong><span>对方控制</span></div></div><div className="gu-metric-list"><span>我方疲劳 <b>{format(campaign.attackerExhaustion)}</b><Meter value={campaign.attackerExhaustion} tone="warn" /></span><span>民用影响 <b>{format(campaign.civilianImpact)}</b><Meter value={campaign.civilianImpact} tone="danger" /></span><span>基础设施损害 <b>{format(campaign.infrastructureDamage)}</b><Meter value={campaign.infrastructureDamage} tone="danger" /></span></div><div className="gu-button-row"><button className="primary" onClick={() => advance(10)}>继续行动 10 日</button><button onClick={() => setPage('governance')}>转向战后治理</button></div></article>
            <article className="gu-panel"><SectionTitle kicker="外交桌" title="最后秩序谈判" aside={negotiation.status === 'accepted' ? '已接受' : `接受度 ${format(negotiation.acceptance)}`} /><div className="gu-diplomacy-score"><strong>{format(negotiation.acceptance)}</strong><span>协议接受度</span><Meter value={negotiation.acceptance} tone={negotiation.acceptance >= 65 ? 'good' : 'warn'} /></div><div className="gu-metric-list compact"><span>可信度 <b>{format(negotiation.credibility)}</b></span><span>军事筹码 <b>{format(negotiation.militaryLeverage)}</b></span><span>让步价值 <b>{format(negotiation.concessionValue)}</b></span><span>紧张度 <b>{format(systems.diplomaticIssues[negotiation.issueId]?.tension ?? 0)}</b></span></div><div className="gu-button-row"><button onClick={() => advance(1)}>推进一轮谈判</button><button className="danger" onClick={() => transform((s) => conductMissileDemonstration(s, negotiation.id), '已实施导弹展示：可信度与军事筹码上升，但紧张和怨恨同步增加。')}>展示战略武力</button></div><p className="gu-consequence">高端武器提供的是可想象的威慑力，不是免费数字。每次展示都会消耗库存，并抬高升级风险。</p></article>
          </section>
        </>}

        {page === 'governance' && <>
          <section className="gu-page-intro"><span>最后地区</span><h2>控制领土不等于治理人口</h2><p>安全、登记、公共服务、司法与信任缺一不可。高压可以短期压住街面，但不会自动产生税收与共同身份。</p></section>
          <section className="gu-governance-hero"><div><span>当前治理阶段</span><strong>{occupationNames[occupation.status]}</strong><small>{format(occupation.displacedPopulation, 0)} 人仍处于流离状态</small></div>{[['安全', occupation.security], ['人口登记', occupation.registry], ['公共服务', occupation.services], ['司法', occupation.justice], ['居民信任', occupation.civilianTrust], ['抵抗', occupation.resistance]].map(([label, value]) => <div key={String(label)}><span>{label}</span><strong>{format(Number(value))}</strong><Meter value={Number(value)} tone={label === '抵抗' ? 'danger' : Number(value) >= 55 ? 'good' : 'warn'} /></div>)}</section>
          <section className="gu-route-cards"><button onClick={() => applyRoute('service')}><span>推荐路线</span><h3>公共服务整合</h3><p>保留最低守备预算，重建供水、诊疗、登记和申诉渠道。安全增长较慢，但会降低抵抗并形成长期财政整合。</p><strong>军事 21% · 民生 28% · 重建 24% · 强制 25</strong></button><button className="danger" onClick={() => applyRoute('mobilization')}><span>高风险路线</span><h3>紧急军事管制</h3><p>以守备和检查快速提高安全。民用物资下降、抗议和债务上升，地区可能长期停留在占领状态。</p><strong>军事 46% · 重建 7% · 强制 85</strong></button></section>
          <div className="gu-center-actions"><button className="primary" onClick={() => advance(90)}>执行政策 90 日</button><button onClick={() => advance(360)}>观察一年后果</button></div>
        </>}

        {page === 'infrastructure' && <>
          <section className="gu-page-intro"><span>统一前置能力</span><h2>港口、飞机、导弹与卫星共同构成全球国家的神经系统</h2><p>它们先于全球统一存在，并在统一门槛中承担运输、通信、威慑和灾害响应的不同责任。</p></section>
          <section className="gu-system-grid">
            <article className="gu-panel system"><span>海运</span><h3>全球海上生命线</h3><strong>{format(systems.logistics.maritimeThroughput)}<small> 有效吞吐</small></strong><Meter value={systems.logistics.maritimeThroughput * 2} tone="good" /><ul><li>商船运力 {format(systems.maritime.merchantShipping)}</li><li>港口容量 {format(systems.maritime.portCapacity)}</li><li>航路安全 {percent(systems.maritime.routeSecurity)}</li><li>护航能力 {format(systems.maritime.escortCapacity)}</li></ul></article>
            <article className="gu-panel system"><span>航空</span><h3>跨洲机动与应急响应</h3><strong>{format(systems.logistics.airliftCapacity)}<small> 空运能力</small></strong><Meter value={systems.logistics.airliftCapacity * 5} tone="good" /><ul><li>战斗机 {format(systems.aerospace.combatAircraft, 0)} 架</li><li>运输机 {format(systems.aerospace.transportAircraft, 0)} 架</li><li>机队妥善率 {percent(systems.aerospace.aircraftReadiness)}</li><li>制空能力 {format(systems.aerospace.airSuperiority)}</li></ul></article>
            <article className="gu-panel system"><span>航天</span><h3>第一代全球轨道网络</h3><strong>{format(systems.satellites.orbitalCoverage)}<small> 轨道覆盖</small></strong><Meter value={systems.satellites.orbitalCoverage} tone="warn" /><ul><li>侦察卫星 {systems.satellites.reconnaissanceSatellites} 颗</li><li>通信卫星 {systems.satellites.communicationSatellites} 颗</li><li>气象卫星 {systems.satellites.weatherSatellites} 颗</li><li>系统可靠度 {percent(systems.satellites.reliability)}</li></ul><div className="gu-button-row"><button onClick={() => transform((s) => launchBasicSatellite(s, 'communication'), '通信卫星发射任务完成，轨道通信能力将在随后数日形成覆盖。')}>发射通信星</button><button onClick={() => transform((s) => launchBasicSatellite(s, 'weather'), '气象卫星发射任务完成。')}>发射气象星</button></div></article>
          </section>
        </>}

        {page === 'unification' && <>
          <section className="gu-page-intro"><span>R37 大节点</span><h2>{systems.globalUnification.stage === 'globalUnion' ? '全球共同体已经成立' : '全球统一不是一个按钮，而是十二道同时成立的条件'}</h2><p>领土、人口、制度、合法性、财政与跨洲基础设施必须共同过线。任何一项短板都会让“统一”退化为脆弱霸权。</p></section>
          <section className="gu-unification-layout">
            <article className="gu-panel"><SectionTitle kicker="统一条件" title={`${metCount} / ${readinessEntries.length} 已达成`} aside={stageNames[systems.globalUnification.stage]} /><div className="gu-gates">{readinessEntries.map(([key, item]) => { const labels: Record<string, string> = { independentBlocs: '独立集团归一', controlledTerritoryRatio: '领土控制', integratedPopulationRatio: '人口整合', commonInstitutionScore: '共同制度', resistancePressure: '低抵抗压力', legitimacy: '政治合法性', sharedInfrastructure: '共享基础设施', fiscalSustainability: '财政可持续', communicationSatellites: '全球通信卫星', maritimeThroughput: '跨洲海运', airliftCapacity: '战略空运', strategicDeterrence: '可靠战略威慑' }; const ratio = key.includes('Ratio') ? true : false; const inverse = key === 'independentBlocs' || key === 'resistancePressure' || key === 'fiscalSustainability'; const progress = inverse ? item.required / Math.max(item.required, item.current) * 100 : item.current / Math.max(.001, item.required) * 100; const digits = key === 'fiscalSustainability' ? 2 : 1; return <div key={key} className={item.met ? 'met' : ''}><i>{item.met ? '✓' : '!'}</i><span><strong>{labels[key] ?? key}</strong><small>当前 {ratio ? percent(item.current, true) : format(item.current, digits)} · 门槛 {ratio ? percent(item.required, true) : format(item.required, digits)}</small><Meter value={progress} tone={item.met ? 'good' : 'warn'} /></span></div>; })}</div></article>
            <aside className="gu-union-card"><span>最终政治行动</span><h3>{settlement?.status === 'active' ? '全球协议可以批准' : settlement?.status === 'completed' ? '协议已经生效' : '等待谈判形成协议'}</h3><p>批准协议只会解决“独立集团”与部分制度门槛。地区治理、合法性和基础设施仍需真实运行。</p><button className="primary" disabled={settlement?.status !== 'active'} onClick={() => settlement != null && transform((s) => ratifyGlobalSettlement(s, settlement.id), '全球协议已批准。最后集团进入共同制度，但统一仍需满足全部运行门槛。')}>批准全球共同制度</button><button onClick={() => advance(180)}>运行制度 180 日</button><small>建议：先批准协议，再在“地区治理”采用公共服务路线，观察一年至两年的系统后果。</small></aside>
          </section>
        </>}
      </div>
    </section>
  </main>;
}
