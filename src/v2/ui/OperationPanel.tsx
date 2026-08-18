import { useEffect } from 'react';
import { useV2 } from '../store';
import { FOCUS_DEFS, METRIC_DEFS } from '../nation';
import { METRIC_ORDER } from '../content/metrics';
import { POLICY_IDS, POLICIES, PROJECT_IDS, PROJECTS, TECH_IDS, TECHS } from '../content/definitions';
import { availablePolicies, availableProjects, availableTechs } from '../simulationV6';
import { notificationSummary, unmetRequirementsSummary } from '../content/copyKeys';
import { StageDiscoveryRoadmap, StagePolicyRoadmap } from './StageRoadmap';
import { campaignStage, sustainablePopulationCapacity } from '../content/campaignStage';
import type { RequirementSet } from '../content/requirements';
import type { FocusId, MetricId } from '../types';

function Title({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return <div className="v2-panel-head"><span className="v2-panel-title">{children}</span><button className="v2-panel-close" onClick={onClose}>×</button></div>;
}
function rate(value: number): string { return `${value >= 0 ? '+' : ''}${Math.round(value * 100) / 100}/日`; }
function unmetText(requirements: RequirementSet, state: ReturnType<typeof useV2.getState>['state']): string {
  return unmetRequirementsSummary(requirements, state);
}
function ModeControl({ slot }: { slot: 'project' | 'research' }) {
  const state = useV2((s) => s.state); const setMode = useV2((s) => s.setSlotMode);
  const mode = slot === 'project' ? state.projectSlot.mode : state.researchSlot.mode;
  return <div className="v2-note">推进方式：<button className={`v2-opt ${mode === 'manual' ? 'active' : ''}`} onClick={() => setMode(slot, 'manual')}>手动</button><button className={`v2-opt ${mode === 'auto' ? 'active' : ''}`} onClick={() => setMode(slot, 'auto')}>自动</button></div>;
}

export function OperationPanel() {
  const panel = useV2((s) => s.panel); const state = useV2((s) => s.state); const setPanel = useV2((s) => s.setPanel);
  const setFocus = useV2((s) => s.setFocus); const setProject = useV2((s) => s.setProject); const setResearch = useV2((s) => s.setResearch); const setPolicy = useV2((s) => s.setPolicy);
  useEffect(() => { if (!panel) return; const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(null); }; window.addEventListener('keydown', handler); return () => window.removeEventListener('keydown', handler); }, [panel, setPanel]);
  if (!panel) return null;
  const projects = new Set(availableProjects(state)), techs = new Set(availableTechs(state)), policies = new Set(availablePolicies(state));
  const activeProject = state.projectSlot.id ? PROJECTS[state.projectSlot.id] : null;
  const activeResearch = state.researchSlot.id ? TECHS[state.researchSlot.id] : null;
  const stage = campaignStage(state);
  return <div className="v2-opanel" onClick={(e) => e.stopPropagation()}>
    {panel === 'nation' && <><Title onClose={() => setPanel(null)}>河谷概览</Title><div className="v2-nation-name">第 07 号外拓共同体</div><div className="v2-kv"><span>当前阶段</span><b>{stage.name}</b></div><div className="v2-note">{stage.summary}</div>{stage.next && <div className="v2-note">{stage.next}</div>}<div className="v2-kv"><span>当前人口</span><b>{Math.round(state.population)} / {sustainablePopulationCapacity(state)} 人</b></div><div className="v2-section"><div className="v2-sub">每日变化</div>{METRIC_ORDER.map((id: MetricId) => <div className="v2-kv" key={id}><span>{METRIC_DEFS[id].name}</span><b>{Math.round(state.metrics[id].value)} <i>{rate(state.metrics[id].dailyRate)}</i></b></div>)}</div></>}
    {panel === 'focus' && <><Title onClose={() => setPanel(null)}>国策</Title><div className="v2-kv"><span>当前国策</span><b>{FOCUS_DEFS[state.nationalPolicy.id].name}</b></div>{state.nationalPolicy.transitionDaysRemaining > 0 && <div className="v2-note">人员和设备正在重新交接，还要 {state.nationalPolicy.transitionDaysRemaining} 日才能恢复全速。</div>}{(['survival', 'balanced', 'industry', 'science', 'military'] as FocusId[]).map((id) => <button key={id} className={`v2-opt wide ${state.nationalPolicy.id === id ? 'active' : ''}`} onClick={() => setFocus(id)}><b>{FOCUS_DEFS[id].name}</b><span className="v2-opt-desc">{FOCUS_DEFS[id].desc}</span></button>)}</>}
    {panel === 'project' && <><Title onClose={() => setPanel(null)}>工程建设</Title><ModeControl slot="project" /><div className="v2-note">{activeProject ? `施工中：「${activeProject.name}」已完成 ${Math.round(state.projectSlot.progressWork / activeProject.work * 100)}%。` : '工程队暂时空闲；选择一项设施开工，或开启自动推进。'}</div>{PROJECT_IDS.map((id) => { const def = PROJECTS[id], done = state.completed.projects.includes(id), active = state.projectSlot.id === id, available = projects.has(id); const slotBusy = !!state.projectSlot.id && !active; const status = done ? '这座设施已投入日常运行' : active ? '施工队正在推进这项工程' : slotBusy ? '工程队正在处理另一项工程' : available ? '可以开工' : unmetText(def.requirements, state); return <button key={id} className={`v2-proj ${active ? 'active' : ''}`} disabled={!available || !!state.projectSlot.id || done} onClick={() => setProject(id)}><div className="v2-proj-name">{def.name}{done ? '（已投入使用）' : active ? '（施工中）' : ''}</div><div className="v2-proj-line"><span>建在哪里</span>{def.location}</div><div className="v2-proj-line"><span>开工条件</span>{status}</div></button>; })}<StageDiscoveryRoadmap state={state} mode="project" /></>}
    {panel === 'research' && <><Title onClose={() => setPanel(null)}>研究</Title><ModeControl slot="research" /><div className="v2-note">{activeResearch ? `研究中：「${activeResearch.name}」已完成 ${Math.round(state.researchSlot.progressWork / activeResearch.work * 100)}%。` : '研究组暂时空闲；选择一项研究，或开启自动推进。'}</div>{TECH_IDS.map((id) => { const def = TECHS[id], done = state.completed.techs.includes(id), active = state.researchSlot.id === id, available = techs.has(id); const slotBusy = !!state.researchSlot.id && !active; const status = done ? '这项办法已进入日常使用' : active ? '研究组正在验证这项办法' : slotBusy ? '研究组正在处理另一项工作' : available ? '可以开始研究' : unmetText(def.requirements, state); return <button key={id} className={`v2-proj ${active ? 'active' : ''}`} disabled={!available || !!state.researchSlot.id || done} onClick={() => setResearch(id)}><div className="v2-proj-name">{def.name}{done ? '（已进入日常使用）' : active ? '（研究中）' : ''}</div><div className="v2-proj-line"><span>研究投入</span>{def.work} 份研究时间</div><div className="v2-proj-line"><span>开始条件</span>{status}</div></button>; })}<StageDiscoveryRoadmap state={state} mode="research" /></>}
    {panel === 'policy' && <><Title onClose={() => setPanel(null)}>当前政策</Title><div className="v2-note">{state.currentPolicy ? `正在执行「${POLICIES[state.currentPolicy.id].name}」，还剩 ${state.currentPolicy.daysRemaining} 日。` : '当前没有临时集中行动；日常服务仍会持续运行。'}</div>{POLICY_IDS.map((id) => { const def = POLICIES[id], cooling = state.policyCooldowns[id] ?? 0, available = policies.has(id); return <button key={id} className={`v2-proj ${state.currentPolicy?.id === id ? 'active' : ''}`} disabled={!available} onClick={() => setPolicy(id)}><div className="v2-proj-name">{def.name}</div><div className="v2-proj-line"><span>集中多久</span>{def.durationDays} 日</div><div className="v2-proj-line"><span>执行条件</span>{cooling ? `还需等待 ${cooling} 日` : available ? '可以执行' : unmetText(def.requirements, state)}</div></button>; })}<StagePolicyRoadmap /></>}
    {panel === 'report' && <><Title onClose={() => setPanel(null)}>河谷纪事</Title><div className="v2-sub">只保留值得你知道的变化</div>{[...state.notificationHistory].slice(-16).reverse().map((entry) => <div className="v2-note" key={entry.id}>第 {entry.day} 日 · {notificationSummary(entry)}</div>)}</>}
  </div>;
}
