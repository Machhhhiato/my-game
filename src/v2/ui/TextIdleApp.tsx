import { useEffect, useMemo, useState } from 'react';
import { RegionalCampaignApp } from './RegionalCampaignApp';
import { TEXT_POLICIES, TEXT_PROJECTS, TEXT_TECHS } from '../textIdle/content';
import { TEXT_EXPLORATION_TARGETS } from '../textIdle/exploration';
import { textPlaytestGuidance } from '../textIdle/playtestGuidance';
import { createRegionalNationFromTextIdle } from '../textIdle/regionalBridge';
import { STARTER_CONTENT_COUNTS } from '../textIdle/starterContent';
import { installTextCampaignTemplate, textCampaignTemplate } from '../textIdle/campaignTemplates';
import {
  acceptTextPopulation, advanceTextIdleDay, availableTextExplorationTargets, availableTextPolicies, availableTextProjects, availableTextTechs,
  collectEmergencyReserve, newTextIdleState, setTextFocus, setTextSlotMode,
  startTextExploration, startTextPolicy, startTextProject, startTextResearch, textAutomationUnlocked, textAvailableWorkforce, textExplorationBlockers,
  textEmergencyOrderBlockers, textPolicyBlockers, textPopulationCapacity, textProjectBlockers, textReceptionBlockers, textResearchBlockers, textReserveCapacity,
} from '../textIdle/simulation';
import type { ReserveId, TextFocusId, TextIdleState, TextReport } from '../textIdle/types';
import './textIdle.css';

const SAVE_KEY = 'always-game-text-idle-v6';
const BASE_DAY_INTERVAL_MS = 18_000;
const RESERVES: Array<{ id: ReserveId; name: string; action: string }> = [
  { id: 'water', name: '饮水', action: '征集水源' },
  { id: 'food', name: '食物', action: '征集食物' },
  { id: 'repair', name: '维修', action: '征集材料' },
];
const FOCUSES: Array<{ id: TextFocusId; name: string }> = [
  { id: 'settle', name: '安顿共同体' },
  { id: 'build', name: '优先建设' },
  { id: 'learn', name: '重视研究' },
  { id: 'defend', name: '防卫戒备' },
];

function loadState(): TextIdleState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw != null) {
      const parsed = JSON.parse(raw) as Partial<Omit<TextIdleState, 'version'>> & { version?: number };
      if ((parsed?.version === 6 || parsed?.version === 7 || parsed?.version === 8) && parsed.reserves && parsed.research && parsed.project && parsed.calendar && 'exploration' in parsed && Array.isArray(parsed.discoveries)) {
        return { ...parsed, version: 8, campaignTemplateId: parsed.campaignTemplateId ?? 'campaign.starter-v1', pendingPopulation: parsed.pendingPopulation ?? [], routeFacts: parsed.routeFacts ?? [] } as TextIdleState;
      }
    }
  } catch { /* a damaged text-demo save simply starts fresh */ }
  return newTextIdleState(410);
}
function focusName(id: TextFocusId): string { return FOCUSES.find((focus) => focus.id === id)?.name ?? id; }
function phaseName(phase: TextIdleState['calendar']['phase']): string { return phase === 'early' ? '上旬' : phase === 'mid' ? '中旬' : '下旬'; }
function stageName(stage: TextIdleState['developmentStage']): string { return stage === 'emergency' ? '生存应急' : stage === 'recovery' ? '恢复安顿' : '稳定聚居'; }
function reportText(report: TextReport): string {
  const id = String(report.params.id ?? '');
  if (report.copyKey === 'research.completed') return `研究完成：${TEXT_TECHS[id as keyof typeof TEXT_TECHS]?.name ?? id}`;
  if (report.copyKey === 'project.completed') return `工程投用：${TEXT_PROJECTS[id as keyof typeof TEXT_PROJECTS]?.name ?? id}`;
  if (report.copyKey === 'exploration.completed') return `探索完成：${TEXT_EXPLORATION_TARGETS[id]?.direction ?? ''}${TEXT_EXPLORATION_TARGETS[id]?.name ?? id} 的发现已归档。`;
  if (report.copyKey === 'exploration.progress') return `勘察进展：${TEXT_EXPLORATION_TARGETS[id]?.name ?? '外围探索'} 已完成中途记录，队伍继续核验。`;
  if (report.copyKey === 'exploration.result.materials') return '打捞完成：回收物已计入建设与维修储备。';
  if (report.copyKey === 'exploration.result.survivor-contact') return `发现避难者：${report.params.population} 人正在等待共同体安排接纳。`;
  if (report.copyKey === 'exploration.result.route') return '路线归档：外围轮换与前哨候选线已写入调度记录。';
  if (report.copyKey === 'population.accepted') return `接纳完成：${report.params.population} 人已登记，供给与公共服务压力同步增加。`;
  if (report.copyKey === 'research.started') return `开始研究：${TEXT_TECHS[id as keyof typeof TEXT_TECHS]?.name ?? id}`;
  if (report.copyKey === 'project.started') return `开始建设：${TEXT_PROJECTS[id as keyof typeof TEXT_PROJECTS]?.name ?? id}`;
  if (report.copyKey === 'exploration.started') return `派出勘察队：前往${TEXT_EXPLORATION_TARGETS[id]?.direction ?? '外围区域'}。`;
  if (report.copyKey === 'auto.research.started') return `自动研究接续：${TEXT_TECHS[id as keyof typeof TEXT_TECHS]?.name ?? id}`;
  if (report.copyKey === 'auto.project.started') return `自动工程接续：${TEXT_PROJECTS[id as keyof typeof TEXT_PROJECTS]?.name ?? id}`;
  if (report.copyKey === 'reserve.depleted') return `${RESERVES.find((reserve) => reserve.id === report.params.reserve)?.name ?? '保障'}储备已经耗尽。`;
  if (report.copyKey === 'focus.transition.started') return `国策调整为：${focusName(String(report.params.focus) as TextFocusId)}。组织正在交接。`;
  if (report.copyKey === 'auto.research.waiting') return '自动研究正在等待新的前置条件。';
  if (report.copyKey === 'auto.project.waiting') return '自动工程正在等待新的前置条件。';
  if (report.copyKey === 'policy.started') return `开始执行：${TEXT_POLICIES[id as keyof typeof TEXT_POLICIES]?.name ?? id}`;
  if (report.copyKey === 'policy.completed') return `政策结束：${TEXT_POLICIES[id as keyof typeof TEXT_POLICIES]?.name ?? id}`;
  if (report.copyKey === 'emergency.order.started') return `临时行动开始：已抽调人手处理${RESERVES.find((reserve) => reserve.id === report.params.id)?.name ?? '物资搜集'}。`;
  if (report.copyKey === 'emergency.order.completed') return '临时行动结束：人员已回到共同体的常规编制。';
  if (report.copyKey === 'failure.strained') return '保障开始紧张：一项储备已经耗尽，日常生活将首先受到影响。';
  if (report.copyKey === 'failure.critical') return '共同体进入临界状态：必须尽快恢复耗尽的保障储备。';
  if (report.copyKey === 'failure.lost') return '共同体已经失守：当前战役停止推进。';
  if (report.copyKey === 'failure.recovered') return '保障已经恢复：共同体重新回到可维持状态。';
  if (report.copyKey === 'stage.settled') return '稳定聚居已建立：基础供给已能由固定设施和班次持续维持。';
  return '调度状态已经更新。';
}
function isImportantReport(report: TextReport): boolean {
  return report.kind === 'completion'
    || report.kind === 'warning'
    || report.copyKey === 'exploration.progress'
    || report.copyKey === 'failure.recovered';
}

function progress(current: number, total: number): string {
  return `${Math.min(100, Math.round(current / total * 100))}%`;
}
function explorationUpdate(state: TextIdleState): string {
  const runtime = state.exploration;
  const target = runtime ? TEXT_EXPLORATION_TARGETS[runtime.targetId] : null;
  if (runtime == null || target == null || !target.updates?.length) return '勘察队正在核验通行、样本与候选地点。';
  const elapsed = runtime.totalDays - runtime.daysRemaining;
  const interval = Math.max(1, Math.ceil(runtime.totalDays / target.updates.length));
  return target.updates[Math.min(target.updates.length - 1, Math.floor(elapsed / interval))];
}
function reserveResult(output: Partial<Record<ReserveId, number>> | undefined): string {
  const parts = RESERVES.map((reserve) => {
    const value = output?.[reserve.id] ?? 0;
    return value > 0 ? `${reserve.name}每天 +${value.toFixed(2)} 天` : null;
  }).filter((entry): entry is string => entry != null);
  return parts.join('；');
}
function technologyOutcome(id: string): string { return TEXT_TECHS[id]?.runtime.capability ?? '获得一项可继续使用的研究能力。'; }
function projectOutcome(id: string): string {
  const project = TEXT_PROJECTS[id];
  if (project == null) return '投用后会改善共同体的持续运转。';
  const result = reserveResult(project.output);
  return result || '投用后会改善共同体的持续运转。';
}
function policyOutcome(id: string): string {
  const policy = TEXT_POLICIES[id];
  return reserveResult(policy?.output) || '执行期间会集中改善相关公共事务。';
}
function explorationOutcome(target: typeof TEXT_EXPLORATION_TARGETS[string]): string {
  const results = target.results ?? [];
  const summary = results.map((result) => result.kind === 'materials' ? '回收建设/维修物资' : result.kind === 'survivor-contact' ? `联络 ${result.population} 名避难者` : '归档前哨路线').join('；');
  return [target.discoveries.length > 0 ? '研究线索与工程候选地' : '', summary].filter(Boolean).join('；') || '归档区域事实。';
}

type ActivityKind = 'routine' | 'gather' | 'explore' | 'research' | 'project';
type Activity = { kind: ActivityKind; title: string; detail: string };
function activitiesFor(state: TextIdleState): Activity[] {
  const activities: Activity[] = [];
  if (state.emergencyOrder) activities.push({ kind: 'gather', title: '临时征集', detail: `小队正在处理${RESERVES.find((reserve) => reserve.id === state.emergencyOrder?.id)?.name ?? '物资'}保障。` });
  if (state.exploration) {
    const target = TEXT_EXPLORATION_TARGETS[state.exploration.targetId];
    activities.push({ kind: 'explore', title: '外围探索', detail: `勘察队正前往${target?.direction ?? '外围区域'}的${target?.name ?? '目标区域'}。` });
  }
  if (state.research.id) activities.push({ kind: 'research', title: '研究分析', detail: `研究组正在处理${TEXT_TECHS[state.research.id]?.name ?? '当前研究'}。` });
  if (state.project.id) activities.push({ kind: 'project', title: '工程施工', detail: `工务队正在建设${TEXT_PROJECTS[state.project.id]?.name ?? '当前工程'}。` });
  return activities.length > 0 ? activities : [{ kind: 'routine', title: '日常值守', detail: '共同体正在维持供给、巡查与公共事务。' }];
}
function ActivitySketch({ kind }: { kind: ActivityKind }) {
  if (kind === 'explore') return <svg className="activity-sketch explore" viewBox="0 0 240 130" aria-hidden="true"><path className="ground" d="M12 105H228" /><path className="route" d="M42 96C84 58 128 90 190 42" /><circle className="marker" cx="190" cy="42" r="9" /><path className="person" d="M78 79v18m-8-9h16m-12 9-5 10m9-10 6 10" /><path className="compass" d="M118 56l12-16 4 20-16-4z" /></svg>;
  if (kind === 'research') return <svg className="activity-sketch research" viewBox="0 0 240 130" aria-hidden="true"><path className="desk" d="M40 99h150m-124 0v17m92-17v17" /><path className="paper" d="M105 80l28-18 27 18-27 12z" /><path className="person" d="M78 70v27m-9-13h18m-12 13-6 11m10-11 7 11" /><circle className="scan" cx="139" cy="61" r="21" /><path className="notes" d="M169 51h26m-20 9h20m-16 9h14" /></svg>;
  if (kind === 'project') return <svg className="activity-sketch project" viewBox="0 0 240 130" aria-hidden="true"><path className="ground" d="M14 105h212" /><path className="frame" d="M76 102l23-57 25 57m-12-31h46l19 31m-54-57v57m42-31v31" /><path className="plank" d="M67 102h121" /><path className="person" d="M53 78v20m-8-9h16m-12 9-5 10m9-10 6 10" /><path className="lift" d="M192 88V55m-8 9 8-9 8 9" /></svg>;
  if (kind === 'gather') return <svg className="activity-sketch gather" viewBox="0 0 240 130" aria-hidden="true"><path className="ground" d="M14 105h212" /><path className="person" d="M92 67v31m-10-14h20m-14 14-6 10m11-10 8 10" /><path className="person second" d="M145 72v26m-9-12h18m-12 12-5 10m9-10 6 10" /><path className="crate" d="M170 88h29v18h-29zM170 97h29m-14-9v18" /><path className="carry" d="M107 82c14-14 28-11 40 0" /></svg>;
  return <svg className="activity-sketch routine" viewBox="0 0 240 130" aria-hidden="true"><path className="ground" d="M14 105h212" /><path className="hut" d="M83 104V69l37-29 38 29v35m-66-1h56M111 104V82h18v22" /><path className="smoke" d="M144 57c-6-9 9-12 3-23" /><path className="person" d="M63 77v21m-8-10h16m-12 10-5 10m9-10 6 10" /></svg>;
}
function ExplorationAtlas({ state }: { state: TextIdleState }) {
  const targets = Object.values(TEXT_EXPLORATION_TARGETS);
  return <svg className="exploration-atlas" viewBox="0 0 320 180" role="img" aria-label="已知范围与探索方向">
    <circle className="atlas-range" cx="160" cy="92" r="45" />
    <circle className="atlas-hub" cx="160" cy="92" r="10" />
    <text x="160" y="117" textAnchor="middle">聚居地</text>
    {targets.map((target) => {
      const complete = target.discoveries.every((discovery) => state.discoveries.some((known) => known.id === discovery.id));
      const active = state.exploration?.targetId === target.id;
      const status = active ? 'active' : complete ? 'known' : 'unknown';
      return <g key={target.id} className={`atlas-target ${status}`}>
        <path d={`M160 92 L${target.mapPosition[0]} ${target.mapPosition[1]}`} />
        <circle cx={target.mapPosition[0]} cy={target.mapPosition[1]} r="10" />
        <text x={target.mapPosition[0]} y={target.mapPosition[1] + (target.mapPosition[1] < 60 ? -15 : 25)} textAnchor="middle">{complete ? target.name : target.direction}</text>
      </g>;
    })}
  </svg>;
}

export function TextIdleApp() {
  const [state, setState] = useState<TextIdleState>(loadState);
  const [speed, setSpeed] = useState<0 | 1 | 2 | 4>(1);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogError] = useState<string | null>(null);
  const [activityTick, setActivityTick] = useState(0);
  const [focusMenuOpen, setFocusMenuOpen] = useState(false);
  const [campaignMode, setCampaignMode] = useState<'settlement' | 'regional'>(() => localStorage.getItem('always-game-regional-v1') != null ? 'regional' : 'settlement');
  const available = useMemo(() => ({
    techs: availableTextTechs(state),
    projects: availableTextProjects(state),
    policies: availableTextPolicies(state),
    explorations: availableTextExplorationTargets(state),
  }), [catalogReady, state]);

  useEffect(() => {
    installTextCampaignTemplate(textCampaignTemplate(state.campaignTemplateId));
    setCatalogReady(true);
  }, []);
  useEffect(() => { if (catalogReady) localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }, [catalogReady, state]);
  useEffect(() => {
    if (!catalogReady || speed === 0 || campaignMode === 'regional') return undefined;
    const timer = window.setInterval(() => {
      setState((previous) => advanceTextIdleDay(previous));
    }, BASE_DAY_INTERVAL_MS / speed);
    return () => window.clearInterval(timer);
  }, [campaignMode, catalogReady, speed]);
  useEffect(() => {
    if (speed === 0 || campaignMode === 'regional') return undefined;
    const timer = window.setInterval(() => setActivityTick((value) => value + 1), 4_200);
    return () => window.clearInterval(timer);
  }, [campaignMode, speed]);

  const activeResearch = state.research.id ? TEXT_TECHS[state.research.id] : null;
  const activeProject = state.project.id ? TEXT_PROJECTS[state.project.id] : null;
  const automationReady = textAutomationUnlocked(state);
  const progressTransitionMs = speed === 0 ? 0 : Math.max(250, BASE_DAY_INTERVAL_MS / speed - 160);
  const guidance = textPlaytestGuidance(state);
  const importantReports = state.reports.filter(isImportantReport).slice(-6).reverse();
  const activities = activitiesFor(state);
  const activeActivity = activities[activityTick % activities.length];
  const emergencyBlockers = textEmergencyOrderBlockers(state);

  if (campaignMode === 'regional') {
    const regional = createRegionalNationFromTextIdle(state);
    if (regional != null) return <RegionalCampaignApp initialState={regional} onRestart={() => { setCampaignMode('settlement'); setState(newTextIdleState(410)); }} />;
  }

  if (catalogError) return <main className="text-idle-shell"><section className="text-idle-card catalog-state"><h1>内容读取失败</h1><p>{catalogError}</p></section></main>;
  if (!catalogReady) return <main className="text-idle-shell"><section className="text-idle-card catalog-state"><span className="text-idle-kicker">正在准备第一阶段</span><h1>载入科技、工程与政策目录…</h1><p>内容目录会作为独立数据读取，不占用主界面的启动资源。</p></section></main>;

  return <main className="text-idle-shell">
    <header className="text-idle-topbar">
      <div><span className="text-idle-kicker">大统合联邦 · 早期开拓验证</span><h1>共同体调度</h1></div>
      <div className="text-idle-status"><strong>余烬历 {state.calendar.year} 年 {state.calendar.month} 月 · {phaseName(state.calendar.phase)}</strong><span>{stageName(state.developmentStage)} · {state.population} 人登记在册 / 容量 {textPopulationCapacity(state)} · 可调度 {textAvailableWorkforce(state)} 人</span></div>
      <div className="text-idle-speed" aria-label="时间速度">
        {([0, 1, 2, 4] as const).map((value) => <button key={value} className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)}>{value === 0 ? '暂停' : `${value}×`}</button>)}
        <button className="restart" onClick={() => setState(newTextIdleState(410))}>重新开始</button>
      </div>
    </header>

    <section className={`text-idle-alert ${guidance.tone}`} aria-live="polite">
      <div><strong>{guidance.title}</strong><span>{guidance.summary}</span><small>本旬第 {state.calendar.dayInPhase} 日 · 建设物资 {state.construction.stock.toFixed(1)} / {state.construction.capacity}</small></div>
      <p><b>下一步：</b>{guidance.nextAction}</p>
      {guidance.steps.length > 0 && <ul className="stage-checklist">{guidance.steps.map((step) => <li key={step.label} className={step.complete ? 'done' : ''}>{step.complete ? '已完成' : '待完成'} · {step.label}</li>)}</ul>}
      {state.nationalFocus.transitionDays > 0 && <em>国策交接还需 {state.nationalFocus.transitionDays} 日</em>}
      {state.failure.level === 'lost' && <button className="restart" onClick={() => setState(newTextIdleState(410))}>重新开始本轮试玩</button>}
    </section>

    <section className="focus-compact">
      <button className="focus-toggle" onClick={() => setFocusMenuOpen((open) => !open)}>国家方针：{focusName(state.nationalFocus.id)}{state.nationalFocus.transitionDays > 0 ? `（交接 ${state.nationalFocus.transitionDays} 日）` : ''}</button>
      {focusMenuOpen && <div className="focus-menu">{FOCUSES.map((focus) => <button key={focus.id} className={state.nationalFocus.id === focus.id ? 'selected' : ''} onClick={() => { setState((previous) => setTextFocus(previous, focus.id)); setFocusMenuOpen(false); }}>{focus.name}</button>)}</div>}
    </section>

    <section className="text-idle-grid">
      <article className="text-idle-card reserve-card">
        <div className="card-heading"><div><span>应急保障</span><h2>还能维持几天</h2></div><small>{state.emergencyOrder ? `临时行动剩余 ${state.emergencyOrder.daysRemaining} 日` : '可下达一项临时行动'}</small></div>
        <div className="reserve-list">
          {RESERVES.map((reserve) => {
            const capacity = textReserveCapacity(state, reserve.id);
            const value = state.reserves[reserve.id];
            return <div key={reserve.id} className="reserve-row">
              <div><strong>{reserve.name}</strong><span>{value.toFixed(1)} / {capacity} 天</span></div>
              <div className="reserve-meter"><i style={{ width: `${value / capacity * 100}%` }} /></div>
              <button disabled={emergencyBlockers.length > 0} onClick={() => setState((previous) => collectEmergencyReserve(previous, reserve.id))}>{reserve.action}</button>
            </div>;
          })}
        </div>
        <p className="card-note" aria-live="polite">{state.emergencyOrder ? `已受理：2 人正在征集${RESERVES.find((reserve) => reserve.id === state.emergencyOrder?.id)?.name ?? '物资'}。下一日结算会计入补充；若日常消耗更高，储备仍可能继续下降。${state.emergencyOrder.id === 'repair' ? '征集材料同时提高建设物资的日产出。' : ''}剩余 ${state.emergencyOrder.daysRemaining} 日。` : emergencyBlockers[0] ?? '下达后会立即抽调 2 人；从下一日结算开始计入补充，持续一个旬。'}</p>
      </article>

      <article className={speed === 0 ? 'text-idle-card activity-card is-paused' : 'text-idle-card activity-card'}>
        <div className="card-heading"><div><span>共同体动态</span><h2>{activeActivity.title}</h2></div><small>{activities.length > 1 ? `正在轮播 ${activities.length} 项作业` : '当前主要作业'}</small></div>
        <ActivitySketch kind={activeActivity.kind} />
        <p className="activity-caption">{activeActivity.detail}</p>
      </article>

      <article className="text-idle-card exploration-card">
        <div className="card-heading"><div><span>向外探索</span><h2>{state.exploration ? TEXT_EXPLORATION_TARGETS[state.exploration.targetId]?.name ?? '勘察中' : '选择方向'}</h2></div><small>{state.exploration ? `剩余 ${state.exploration.daysRemaining} 日` : `已归档 ${state.discoveries.length} 项发现`}</small></div>
        <ExplorationAtlas state={state} />
        {state.exploration ? <><p>{TEXT_EXPLORATION_TARGETS[state.exploration.targetId]?.summary}</p><p className="work-result">现场记录：{explorationUpdate(state)}</p><div className="work-meter"><i style={{ width: progress(state.exploration.totalDays - state.exploration.daysRemaining, state.exploration.totalDays), transitionDuration: `${progressTransitionMs}ms` }} /></div><small>{progress(state.exploration.totalDays - state.exploration.daysRemaining, state.exploration.totalDays)} · 勘察队 {state.exploration.teamSize} 人</small></> : <div className="choice-list">{available.explorations.map((id) => {
          const target = TEXT_EXPLORATION_TARGETS[id]; const blockers = textExplorationBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextExploration(previous, id))}><strong>{target.direction} · {target.name}</strong><span>{target.summary}</span><em>完成后：{explorationOutcome(target)}</em>{blockers.length > 0 && <small>暂不能出发：{blockers[0]}</small>}</button>;
        })}{available.explorations.length === 0 && <p className="choice-more">当前可达区域均已完成勘察。</p>}</div>}
      </article>

      <article className="text-idle-card population-card">
        <div className="card-heading"><div><span>人口与接纳</span><h2>{state.population} 人 / 可安置 {textPopulationCapacity(state)} 人</h2></div><small>每多一人，饮水与食物消耗同步增加</small></div>
        {(state.pendingPopulation ?? []).length === 0 ? <p className="card-note">尚无待接纳群体。探索中的联络行动可能找到避难者；接纳前必须先保证住处、饮水、食物与公共服务。</p> : <div className="choice-list">{(state.pendingPopulation ?? []).map((arrival) => {
          const blockers = textReceptionBlockers(state, arrival);
          return <button key={arrival.id} disabled={blockers.length > 0} onClick={() => setState((previous) => acceptTextPopulation(previous, arrival.id))}><strong>{arrival.label} · {arrival.population} 人</strong><span>其中 {arrival.dependents} 名需要照护；来自稳定地点记录。</span><em>接纳后：增加劳动力，也提高每日饮水、食物与服务压力</em>{blockers.length > 0 ? <small>暂不能接纳：{blockers[0]}</small> : <small>条件已满足：登记并接纳</small>}</button>;
        })}</div>}
        {(state.routeFacts ?? []).length > 0 && <p className="card-note">已归档路线：{(state.routeFacts ?? []).map((route) => route.label).join('；')}。它们改善外围轮换记录，不替代后续维护与工程。</p>}
      </article>

      <article className="text-idle-card work-card">
        <div className="card-heading"><div><span>研究</span><h2>{activeResearch?.name ?? (state.research.waitingForUnlock ? '等待前置条件' : '等待指令')}</h2></div><button disabled={!automationReady && state.research.mode !== 'auto'} className={state.research.mode === 'auto' ? 'small-toggle active' : 'small-toggle'} onClick={() => setState((previous) => setTextSlotMode(previous, 'research', previous.research.mode === 'auto' ? 'manual' : 'auto'))}>自动：{state.research.mode === 'auto' ? '开' : '关'}</button></div>
        {activeResearch ? <><p>{activeResearch.summary}</p><p className="work-result">完成后：{technologyOutcome(activeResearch.id)}</p><div className="work-meter"><i style={{ width: progress(state.research.work, activeResearch.work), transitionDuration: `${progressTransitionMs}ms` }} /></div><small>{progress(state.research.work, activeResearch.work)} · 研究组 {state.research.teamSize} 人</small></> : <div className="choice-list">{available.techs.slice(0, 6).map((id) => {
          const blockers = textResearchBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextResearch(previous, id))}><strong>{TEXT_TECHS[id].name}</strong><span>{TEXT_TECHS[id].summary}</span><em>完成后：{technologyOutcome(id)}</em>{blockers.length > 0 && <small>暂不能开始：{blockers[0]}</small>}</button>;
        })}{available.techs.length === 0 && <p className="choice-more">暂无可研究项目：继续探索以获得专业线索；搭棚、整理场地等基础作业不需要科研。</p>}{available.techs.length > 6 && <p className="choice-more">另有 {available.techs.length - 6} 项已满足前置条件。</p>}</div>}
      </article>

      <article className="text-idle-card work-card">
        <div className="card-heading"><div><span>工程</span><h2>{activeProject?.name ?? (state.project.waitingForUnlock ? '等待前置条件' : '等待指令')}</h2></div><button disabled={!automationReady && state.project.mode !== 'auto'} className={state.project.mode === 'auto' ? 'small-toggle active' : 'small-toggle'} onClick={() => setState((previous) => setTextSlotMode(previous, 'project', previous.project.mode === 'auto' ? 'manual' : 'auto'))}>自动：{state.project.mode === 'auto' ? '开' : '关'}</button></div>
        {activeProject ? <><p>{activeProject.summary}</p><p className="work-result">投用后：{projectOutcome(activeProject.id)}</p><div className="work-meter"><i style={{ width: progress(state.project.work, activeProject.work), transitionDuration: `${progressTransitionMs}ms` }} /></div><small>{progress(state.project.work, activeProject.work)} · 工务队 {state.project.teamSize} 人</small></> : <div className="choice-list">{available.projects.slice(0, 6).map((id) => {
          const blockers = textProjectBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextProject(previous, id))}><strong>{TEXT_PROJECTS[id].name}</strong><span>{TEXT_PROJECTS[id].summary}</span><em>投用后：{projectOutcome(id)}</em>{blockers.length > 0 && <small>暂不能开工：{blockers[0]}</small>}</button>;
        })}{available.projects.length === 0 && <p className="choice-more">暂无可施工工程：先探索确认候选地点，或积累建设物资。基础安置棚不需要科研。</p>}{available.projects.length > 6 && <p className="choice-more">另有 {available.projects.length - 6} 项已满足前置条件。</p>}</div>}
      </article>

      <article className="text-idle-card policy-card">
        <div className="card-heading"><div><span>当前政策</span><h2>{state.currentPolicy ? TEXT_POLICIES[state.currentPolicy.id].name : '暂无集中行动'}</h2></div>{state.currentPolicy && <small>剩余 {state.currentPolicy.daysRemaining} 日</small>}</div>
        {state.currentPolicy ? <><p>{TEXT_POLICIES[state.currentPolicy.id].summary}</p><p className="work-result">执行期间：{policyOutcome(state.currentPolicy.id)}</p></> : <div className="choice-list">{available.policies.map((id) => {
          const blockers = textPolicyBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextPolicy(previous, id))}><strong>{TEXT_POLICIES[id].name}</strong><span>{TEXT_POLICIES[id].summary}</span><em>执行期间：{policyOutcome(id)}</em>{blockers.length > 0 && <small>暂不能执行：{blockers[0]}</small>}</button>;
        })}</div>}
      </article>

      <article className="text-idle-card report-card">
        <div className="card-heading"><div><span>调度记录</span><h2>重要变化</h2></div><small>不会暂停时间</small></div>
        {importantReports.length === 0 ? <p className="card-note">尚未出现需要处理的重点变化。研究、工程完成或保障风险会显示在这里。</p> : <ol>{importantReports.map((report) => <li key={report.id}><time>第 {report.day} 日</time><span className={report.kind}>{reportText(report)}</span></li>)}</ol>}
      </article>

      <article className="text-idle-card archive-card">
        <div className="card-heading"><div><span>已完成档案</span><h2>已经成为共同体能力的项目</h2></div><small>完成项不会回到主选择区</small></div>
        <div className="archive-columns">
          <section><strong>研究 · {state.completedTechs.length}</strong>{state.completedTechs.length === 0 ? <span>尚无完成研究</span> : state.completedTechs.slice(-4).reverse().map((id) => <span key={id}>{TEXT_TECHS[id]?.name}</span>)}</section>
          <section><strong>工程 · {state.completedProjects.length}</strong>{state.completedProjects.length === 0 ? <span>尚无投用工程</span> : state.completedProjects.slice(-4).reverse().map((id) => <span key={id}>{TEXT_PROJECTS[id]?.name}</span>)}</section>
          <section><strong>发展阶段</strong><span>{stageName(state.developmentStage)}</span>{state.developmentStage === 'settled' ? <><span>基础供给已由设施和班次持续维持。</span><button className="regional-entry" onClick={() => setCampaignMode('regional')}>进入区域网络</button></> : <span>完成设施与固定值守自动化后，进入稳定聚居。</span>}</section>
          <section><strong>后期测试存档</strong><span>不读取或改写本轮试玩存档。</span><button className="regional-entry" onClick={() => window.location.assign('?kernel=unified')}>进入统一国家战役测试</button><span>沿用同一文字战役界面，含国家建设物资、科研、物流、公共服务与防卫数据。</span></section>
        </div>
      </article>
    </section>
  </main>;
}
