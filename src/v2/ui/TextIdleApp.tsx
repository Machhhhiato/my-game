import { useEffect, useMemo, useState } from 'react';
import { TEXT_POLICIES, TEXT_PROJECTS, TEXT_TECHS } from '../textIdle/content';
import { installStarterContent, STARTER_CONTENT_COUNTS } from '../textIdle/starterContent';
import {
  advanceTextIdleDay, availableTextPolicies, availableTextProjects, availableTextTechs,
  collectEmergencyReserve, newTextIdleState, setTextFocus, setTextSlotMode,
  startTextPolicy, startTextProject, startTextResearch, textAutomationUnlocked, textAvailableWorkforce, textPolicyBlockers,
  textProjectBlockers, textResearchBlockers, textReserveCapacity,
} from '../textIdle/simulation';
import type { ReserveId, TextFocusId, TextIdleState, TextReport } from '../textIdle/types';
import './textIdle.css';

const SAVE_KEY = 'always-game-text-idle-v5';
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
      const parsed = JSON.parse(raw) as TextIdleState;
      if (parsed?.version === 5 && parsed.reserves && parsed.research && parsed.project && parsed.calendar) return parsed;
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
  if (report.copyKey === 'research.started') return `开始研究：${TEXT_TECHS[id as keyof typeof TEXT_TECHS]?.name ?? id}`;
  if (report.copyKey === 'project.started') return `开始建设：${TEXT_PROJECTS[id as keyof typeof TEXT_PROJECTS]?.name ?? id}`;
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
  if (report.copyKey === 'stage.settled') return '稳定聚居已建立：基础供给已能由固定设施和班次持续维持。';
  return '调度状态已经更新。';
}

function progress(current: number, total: number): string {
  return `${Math.min(100, Math.round(current / total * 100))}%`;
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

export function TextIdleApp() {
  const [state, setState] = useState<TextIdleState>(loadState);
  const [speed, setSpeed] = useState<0 | 1 | 2 | 4>(1);
  const [catalogReady, setCatalogReady] = useState(false);
  const [catalogError] = useState<string | null>(null);
  const available = useMemo(() => ({
    techs: availableTextTechs(state),
    projects: availableTextProjects(state),
    policies: availableTextPolicies(state),
  }), [catalogReady, state]);

  useEffect(() => {
    installStarterContent();
    setCatalogReady(true);
  }, []);
  useEffect(() => { if (catalogReady) localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }, [catalogReady, state]);
  useEffect(() => {
    if (!catalogReady || speed === 0) return undefined;
    const timer = window.setInterval(() => {
      setState((previous) => {
        let next = previous;
        for (let step = 0; step < speed; step += 1) next = advanceTextIdleDay(next);
        return next;
      });
    }, BASE_DAY_INTERVAL_MS / speed);
    return () => window.clearInterval(timer);
  }, [catalogReady, speed]);

  const activeResearch = state.research.id ? TEXT_TECHS[state.research.id] : null;
  const activeProject = state.project.id ? TEXT_PROJECTS[state.project.id] : null;
  const automationReady = textAutomationUnlocked(state);

  if (catalogError) return <main className="text-idle-shell"><section className="text-idle-card catalog-state"><h1>内容读取失败</h1><p>{catalogError}</p></section></main>;
  if (!catalogReady) return <main className="text-idle-shell"><section className="text-idle-card catalog-state"><span className="text-idle-kicker">正在准备第一阶段</span><h1>载入科技、工程与政策目录…</h1><p>内容目录会作为独立数据读取，不占用主界面的启动资源。</p></section></main>;

  return <main className="text-idle-shell">
    <header className="text-idle-topbar">
      <div><span className="text-idle-kicker">大统合联邦 · 早期开拓验证</span><h1>共同体调度</h1></div>
      <div className="text-idle-status"><strong>余烬历 {state.calendar.year} 年 {state.calendar.month} 月 · {phaseName(state.calendar.phase)}</strong><span>{stageName(state.developmentStage)} · {state.population} 人登记在册 · 可调度 {textAvailableWorkforce(state)} 人</span></div>
      <div className="text-idle-speed" aria-label="时间速度">
        {([0, 1, 2, 4] as const).map((value) => <button key={value} className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)}>{value === 0 ? '暂停' : `${value}×`}</button>)}
        <button className="restart" onClick={() => setState(newTextIdleState(410))}>重新开始</button>
      </div>
    </header>

    <section className="text-idle-alert">
      <strong>当前目标</strong><span>{state.developmentStage === 'settled' ? '基础供给已经稳定。可以继续扩展，也可以重新开始尝试其他路线。' : '先维持保障，再把重复工作交给流程和设施。'}</span><small>本旬第 {state.calendar.dayInPhase} 日 · 建设物资 {state.construction.stock.toFixed(1)} / {state.construction.capacity} · 试玩样本：{STARTER_CONTENT_COUNTS.technologies} 项研究 · {STARTER_CONTENT_COUNTS.projects} 项工程</small>
      {state.nationalFocus.transitionDays > 0 && <em>国策交接还需 {state.nationalFocus.transitionDays} 日</em>}
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
              <button onClick={() => setState((previous) => collectEmergencyReserve(previous, reserve.id))}>{reserve.action}</button>
            </div>;
          })}
        </div>
        <p className="card-note">临时行动会持续一个旬并占用人手；设施投用后，基础供给会逐步自动维持。</p>
      </article>

      <article className="text-idle-card focus-card">
        <div className="card-heading"><div><span>国策</span><h2>{focusName(state.nationalFocus.id)}</h2></div><small>可随时调整，交接期间效率降低</small></div>
        <div className="focus-options">{FOCUSES.map((focus) => <button key={focus.id} className={state.nationalFocus.id === focus.id ? 'selected' : ''} onClick={() => setState((previous) => setTextFocus(previous, focus.id))}>{focus.name}</button>)}</div>
        <div className="metric-strip"><span>日常保障 {Math.round(state.metrics.livelihood)}</span><span>工务 {Math.round(state.metrics.industry)}</span><span>研究 {Math.round(state.metrics.research)}</span><span>秩序 {Math.round(state.metrics.stability)}</span></div>
      </article>

      <article className="text-idle-card work-card">
        <div className="card-heading"><div><span>研究</span><h2>{activeResearch?.name ?? (state.research.waitingForUnlock ? '等待前置条件' : '等待指令')}</h2></div><button disabled={!automationReady && state.research.mode !== 'auto'} className={state.research.mode === 'auto' ? 'small-toggle active' : 'small-toggle'} onClick={() => setState((previous) => setTextSlotMode(previous, 'research', previous.research.mode === 'auto' ? 'manual' : 'auto'))}>自动：{state.research.mode === 'auto' ? '开' : '关'}</button></div>
        {activeResearch ? <><p>{activeResearch.summary}</p><p className="work-result">完成后：{technologyOutcome(activeResearch.id)}</p><div className="work-meter"><i style={{ width: progress(state.research.work, activeResearch.work) }} /></div><small>{progress(state.research.work, activeResearch.work)} · 研究组 {state.research.teamSize} 人</small></> : <div className="choice-list">{available.techs.slice(0, 6).map((id) => {
          const blockers = textResearchBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextResearch(previous, id))}><strong>{TEXT_TECHS[id].name}</strong><span>{TEXT_TECHS[id].summary}</span><em>完成后：{technologyOutcome(id)}</em>{blockers.length > 0 && <small>暂不能开始：{blockers[0]}</small>}</button>;
        })}{available.techs.length > 6 && <p className="choice-more">另有 {available.techs.length - 6} 项已满足前置条件。</p>}</div>}
      </article>

      <article className="text-idle-card work-card">
        <div className="card-heading"><div><span>工程</span><h2>{activeProject?.name ?? (state.project.waitingForUnlock ? '等待前置条件' : '等待指令')}</h2></div><button disabled={!automationReady && state.project.mode !== 'auto'} className={state.project.mode === 'auto' ? 'small-toggle active' : 'small-toggle'} onClick={() => setState((previous) => setTextSlotMode(previous, 'project', previous.project.mode === 'auto' ? 'manual' : 'auto'))}>自动：{state.project.mode === 'auto' ? '开' : '关'}</button></div>
        {activeProject ? <><p>{activeProject.summary}</p><p className="work-result">投用后：{projectOutcome(activeProject.id)}</p><div className="work-meter"><i style={{ width: progress(state.project.work, activeProject.work) }} /></div><small>{progress(state.project.work, activeProject.work)} · 工务队 {state.project.teamSize} 人</small></> : <div className="choice-list">{available.projects.slice(0, 6).map((id) => {
          const blockers = textProjectBlockers(state, id);
          return <button key={id} disabled={blockers.length > 0} onClick={() => setState((previous) => startTextProject(previous, id))}><strong>{TEXT_PROJECTS[id].name}</strong><span>{TEXT_PROJECTS[id].summary}</span><em>投用后：{projectOutcome(id)}</em>{blockers.length > 0 && <small>暂不能开工：{blockers[0]}</small>}</button>;
        })}{available.projects.length > 6 && <p className="choice-more">另有 {available.projects.length - 6} 项已满足前置条件。</p>}</div>}
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
        <ol>{state.reports.slice(-6).reverse().map((report) => <li key={report.id}><time>第 {report.day} 日</time><span className={report.kind}>{reportText(report)}</span></li>)}</ol>
      </article>

      <article className="text-idle-card archive-card">
        <div className="card-heading"><div><span>已完成档案</span><h2>已经成为共同体能力的项目</h2></div><small>完成项不会回到主选择区</small></div>
        <div className="archive-columns">
          <section><strong>研究 · {state.completedTechs.length}</strong>{state.completedTechs.length === 0 ? <span>尚无完成研究</span> : state.completedTechs.slice(-4).reverse().map((id) => <span key={id}>{TEXT_TECHS[id]?.name}</span>)}</section>
          <section><strong>工程 · {state.completedProjects.length}</strong>{state.completedProjects.length === 0 ? <span>尚无投用工程</span> : state.completedProjects.slice(-4).reverse().map((id) => <span key={id}>{TEXT_PROJECTS[id]?.name}</span>)}</section>
          <section><strong>发展阶段</strong><span>{stageName(state.developmentStage)}</span><span>{state.developmentStage === 'settled' ? '基础供给已由设施和班次持续维持。' : '完成设施与固定值守自动化后，进入稳定聚居。'}</span></section>
        </div>
      </article>
    </section>
  </main>;
}
