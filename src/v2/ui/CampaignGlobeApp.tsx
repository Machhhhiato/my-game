import { useEffect, useMemo, useState } from 'react';
import { TEXT_PROJECTS, TEXT_TECHS } from '../textIdle/content';
import { installTextCampaignTemplate, textCampaignTemplate } from '../textIdle/campaignTemplates';
import { textCampaignMapBriefing, type MapEntity } from '../textIdle/strategicMapModel';
import {
  acceptTextPopulation, advanceTextIdleDay, availableTextExplorationTargets, availableTextProjects, availableTextTechs,
  collectEmergencyReserve, newTextIdleState, startTextExploration, startTextProject, startTextResearch,
  textAvailableWorkforce, textExplorationBlockers, textPopulationCapacity, textProjectBlockers, textReceptionBlockers, textResearchBlockers,
} from '../textIdle/simulation';
import type { ReserveId, TextIdleState } from '../textIdle/types';
import { StrategicGlobe } from './StrategicGlobe';
import './campaignGlobe.css';

const SAVE_KEY = 'always-game-text-idle-v6';
const RESERVES: Array<{ id: ReserveId; label: string }> = [{ id: 'water', label: '饮水' }, { id: 'food', label: '食物' }, { id: 'repair', label: '维修' }];

function loadState(): TextIdleState {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY) ?? '') as Partial<Omit<TextIdleState, 'version'>> & { version?: number };
    if ((parsed.version === 6 || parsed.version === 7 || parsed.version === 8 || parsed.version === 9) && parsed.reserves && parsed.research && parsed.project && parsed.calendar && Array.isArray(parsed.discoveries)) {
      return { ...parsed, version: 9, campaignTemplateId: parsed.campaignTemplateId ?? 'campaign.starter-v1', pendingPopulation: parsed.pendingPopulation ?? [], routeFacts: parsed.routeFacts ?? [], facilityFacts: parsed.facilityFacts ?? [] } as TextIdleState;
    }
  } catch { /* fall through to a new campaign */ }
  return newTextIdleState(410);
}

function phaseDate(state: TextIdleState): string { return `余烬历 ${state.calendar.year} 年 ${state.calendar.month} 月 · 第 ${state.calendar.dayInPhase} 日`; }
function activeOperations(state: TextIdleState): string[] {
  const items: string[] = [];
  if (state.exploration) items.push('勘察队正在外出');
  if (state.research.id) items.push(`研究：${TEXT_TECHS[state.research.id]?.name ?? state.research.id}`);
  if (state.project.id) items.push(`工程：${TEXT_PROJECTS[state.project.id]?.name ?? state.project.id}`);
  if (state.emergencyOrder) items.push('临时征集正在执行');
  return items.length ? items : ['日常值守维持供给、巡查与公共事务'];
}

export function CampaignGlobeApp() {
  const [state, setState] = useState<TextIdleState>(loadState);
  const [selectedId, setSelectedId] = useState('settlement.home');
  const [drawer, setDrawer] = useState<'place' | 'explore' | 'knowledge' | 'community'>('place');
  const [catalogRevision, setCatalogRevision] = useState(0);
  const briefing = useMemo(() => textCampaignMapBriefing(state), [state]);
  const selected = briefing.entities.find((entity) => entity.id === selectedId) ?? briefing.entities[0];
  const template = textCampaignTemplate(state.campaignTemplateId);
  const availableTargets = useMemo(() => availableTextExplorationTargets(state), [catalogRevision, state]);
  const availableTechs = useMemo(() => availableTextTechs(state), [catalogRevision, state]);
  const availableProjects = useMemo(() => availableTextProjects(state), [catalogRevision, state]);
  useEffect(() => { installTextCampaignTemplate(template); setCatalogRevision((revision) => revision + 1); }, [template]);
  useEffect(() => { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }, [state]);
  const select = (entity: MapEntity) => { setSelectedId(entity.id); setDrawer(entity.kind === 'exploration' ? 'explore' : 'place'); };
  const advance = (days: number) => setState((previous) => {
    let next = previous;
    for (let index = 0; index < days && next.failure.level !== 'lost'; index += 1) next = advanceTextIdleDay(next);
    return next;
  });
  return <main className="campaign-globe-shell">
    <header className="campaign-globe-topbar">
      <div className="campaign-brand"><span>AG</span><div><small>ALWAYS GAME · 地表开拓战役</small><strong>共同体星图</strong></div></div>
      <div className="campaign-date"><small>{phaseDate(state)}</small><strong>{briefing.title}</strong></div>
      <div className="campaign-metrics"><span><b>{state.population}</b> 登记人口 / {textPopulationCapacity(state)} 安置容量</span><span><b>{textAvailableWorkforce(state)}</b> 可调度人手</span><span className={state.failure.level === 'stable' ? 'good' : 'danger'}>{state.failure.level === 'stable' ? '日常保障稳定' : '日常保障承压'}</span></div>
      <div className="campaign-time"><button onClick={() => advance(1)}>推进 1 日</button><button onClick={() => advance(10)}>推进 10 日</button><button className="primary" onClick={() => advance(30)}>推进一月</button></div>
    </header>
    <section className="campaign-map-stage">
      <StrategicGlobe briefing={briefing} selectedId={selected?.id ?? null} onSelect={select} />
      <aside className="campaign-briefing"><small>当前局势</small><h1>{briefing.title}</h1><p>{briefing.summary}</p><b>下一步</b><p>{briefing.nextAction}</p><ul>{activeOperations(state).map((item) => <li key={item}>{item}</li>)}</ul></aside>
      <div className="campaign-legend"><span><i className="home" />共同体</span><span><i className="survey" />勘察 / 线索</span><span><i className="site" />工程候选地</span><span><i className="risk" />风险</span><small>拖动旋转星球 · 点击地标查看档案</small></div>
      <section className="campaign-drawer">
        <nav>{([['place', '地点档案'], ['explore', '勘察'], ['knowledge', '研究与工程'], ['community', '共同体']] as const).map(([id, label]) => <button key={id} className={drawer === id ? 'active' : ''} onClick={() => setDrawer(id)}>{label}</button>)}</nav>
        {drawer === 'place' && <div className="drawer-body"><small>{selected?.kind === 'settlement' ? '共同体驻地' : '地点档案'}</small><h2>{selected?.label}</h2><p>{selected?.summary}</p><p className="drawer-note">位置由稳定地理记录确定；转动星球不会改变任何路线、发现或工程判定。</p></div>}
        {drawer === 'explore' && <div className="drawer-body"><small>外出勘察</small><h2>把未知方向变成可用记录</h2><p>勘察可以带回知识、工程候选地、材料、人口联络与路线；每项结果都会留在星球上。</p><div className="drawer-list">{template.explorationTargets.map((target) => { const available = availableTargets.includes(target.id); const active = state.exploration?.targetId === target.id; const blockers = textExplorationBlockers(state, target.id); return <article key={target.id}><div><b>{target.direction} · {target.name}</b><small>{target.summary}</small></div><button disabled={!available || active || state.exploration != null} onClick={() => { setState((previous) => startTextExploration(previous, target.id)); setSelectedId(`exploration:${target.id}`); }}>{active ? '正在勘察' : available ? '派出勘察队' : blockers[0] ?? '条件不足'}</button></article>; })}</div></div>}
        {drawer === 'knowledge' && <div className="drawer-body"><small>知识与建设</small><h2>把记录变成持续能力</h2><div className="drawer-columns"><section><h3>研究</h3>{availableTechs.map((id) => <article key={id}><b>{TEXT_TECHS[id]?.name ?? id}</b><small>{TEXT_TECHS[id]?.runtime.capability}</small><button disabled={state.research.id != null} onClick={() => setState((previous) => startTextResearch(previous, id))}>{state.research.id === id ? '分析中' : state.research.id ? '研究组忙碌' : textResearchBlockers(state, id)[0] ?? '开始分析'}</button></article>)}</section><section><h3>工程</h3>{availableProjects.map((id) => <article key={id}><b>{TEXT_PROJECTS[id]?.name ?? id}</b><small>{TEXT_PROJECTS[id]?.summary}</small><button disabled={state.project.id != null} onClick={() => setState((previous) => startTextProject(previous, id))}>{state.project.id === id ? '施工中' : state.project.id ? '工务队忙碌' : textProjectBlockers(state, id)[0] ?? '开工'}</button></article>)}</section></div></div>}
        {drawer === 'community' && <div className="drawer-body"><small>共同体调度</small><h2>生活先于扩张</h2><div className="reserve-row">{RESERVES.map((reserve) => <article key={reserve.id}><b>{reserve.label}</b><strong>{state.reserves[reserve.id].toFixed(1)}</strong><small>容量 {state.reserves[reserve.id] <= 0 ? '已耗尽' : '可维持'}</small><button disabled={state.emergencyOrder != null} onClick={() => setState((previous) => collectEmergencyReserve(previous, reserve.id))}>{state.emergencyOrder?.id === reserve.id ? '征集中' : '临时征集'}</button></article>)}</div>{state.pendingPopulation.length > 0 && <section className="arrival-list"><h3>等待接纳的人口</h3>{state.pendingPopulation.map((arrival) => <article key={arrival.id}><span><b>{arrival.label}</b><small>{arrival.population} 人等待安置</small></span><button disabled={textReceptionBlockers(state, arrival).length > 0} onClick={() => setState((previous) => acceptTextPopulation(previous, arrival.id))}>{textReceptionBlockers(state, arrival)[0] ?? '接纳并登记'}</button></article>)}</section>}</div>}
      </section>
    </section>
    <footer className="campaign-bottom-bar"><span>星球地表</span><button onClick={() => setDrawer('community')}>国家与社会</button><button onClick={() => setDrawer('knowledge')}>研究 / 工程 / 生产</button><button disabled>地区（稳定第二节点后）</button><button disabled>外交 / 军事（接触或威胁后）</button><button disabled>航天（地面站条件满足后）</button></footer>
  </main>;
}
