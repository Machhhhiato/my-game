import { useEffect, useMemo, useState } from 'react';
import { availableWorkforce, advanceNationKernelDays, changeRegionalServiceAssignment, startOperation } from '../nationKernel/simulation';
import type { NationKernelState, OperationState } from '../nationKernel/types';
import { installRegionalCampaignContent, REGIONAL_OPERATION_DEFINITIONS, regionalCampaignComplete, regionalIntegrationComplete } from '../textIdle/regionalCampaign';
import { installUnifiedNationContent, UNIFIED_NATION_OPERATION_DEFINITIONS, unifiedNationComplete } from '../textIdle/unifiedNation';
import './textIdle.css';

const SAVE_KEY = 'always-game-regional-v1';
const BASE_DAY_INTERVAL_MS = 18_000;

function loadRegionalState(fallback: NationKernelState): NationKernelState {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw != null) {
      const parsed = JSON.parse(raw) as NationKernelState;
      if (parsed?.version === 1 && parsed.polities?.[parsed.playerPolityId] && parsed.operations != null) return parsed;
    }
  } catch { /* damaged demo state returns to the migration bridge */ }
  return fallback;
}

function statusName(status: OperationState['status']): string {
  if (status === 'planned') return '待启动';
  if (status === 'active') return '进行中';
  if (status === 'completed') return '已完成';
  if (status === 'blocked') return '受阻';
  return '已取消';
}
function kindName(kind: OperationState['kind']): string { return kind === 'survey' ? '勘察' : kind === 'engineering' ? '工程' : kind === 'policy' ? '政策' : kind; }
function progress(operation: OperationState): number { const total = operation.workRequired > 0 ? operation.workRequired : operation.durationDays ?? 1; const current = operation.workRequired > 0 ? operation.workDone : operation.elapsedDays; return Math.min(100, Math.round(current / total * 100)); }

export function RegionalCampaignApp({ initialState, onRestart }: { initialState: NationKernelState; onRestart: () => void }) {
  const [state, setState] = useState<NationKernelState>(() => installUnifiedNationContent(installRegionalCampaignContent(loadRegionalState(initialState))));
  const [speed, setSpeed] = useState<0 | 1 | 2 | 4>(1);
  const [notice, setNotice] = useState('区域联接正在从既有设施、固定班次和已归档能力中继续推进。');
  const player = state.polities[state.playerPolityId];
  const region = state.regions['region.home'];
  const complete = regionalCampaignComplete(state);
  const integrationComplete = regionalIntegrationComplete(state);
  const nationComplete = unifiedNationComplete(state);
  const operations = useMemo(() => (integrationComplete ? [...REGIONAL_OPERATION_DEFINITIONS, ...UNIFIED_NATION_OPERATION_DEFINITIONS] : REGIONAL_OPERATION_DEFINITIONS).map((definition) => ({ definition, operation: state.operations[definition.id] })), [state, integrationComplete]);
  const internalRegionCount = Object.values(state.regions).filter((item) => item.polityId === state.playerPolityId).length;
  const serviceAssignments = region?.serviceAssignments ?? {};
  const assignedServices = Object.values(serviceAssignments).reduce((sum, value) => sum + value, 0);
  const canDispatchServices = player.capabilities['capability.regional-service-registry'] != null;

  useEffect(() => { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }, [state]);
  useEffect(() => {
    if (speed === 0) return undefined;
    const timer = window.setInterval(() => setState((previous) => advanceNationKernelDays(previous, 1)), BASE_DAY_INTERVAL_MS / speed);
    return () => window.clearInterval(timer);
  }, [speed]);

  function begin(operationId: string): void {
    setState((previous) => {
      const next = startOperation(previous, operationId);
      if (next === previous) { setNotice('当前还不能启动：请先完成前置事项、预留建设物资，并保持足够的人手。'); return previous; }
      setNotice('事项已启动。时间会持续推进，完成后会写入本阶段记录。');
      return next;
    });
  }
  function adjustService(cityId: string, delta: number): void {
    setState((previous) => {
      const next = changeRegionalServiceAssignment(previous, 'region.home', cityId, delta);
      if (next === previous) { setNotice('无法这样调配服务人员：需保留现有人手，且总数不能超过公共服务编制。'); return previous; }
      setNotice('服务班次已调整；对应节点的供水与诊疗覆盖会在每日结算中逐步变化。');
      return next;
    });
  }

  return <main className="text-idle-shell">
    <header className="text-idle-topbar">
      <div><span className="text-idle-kicker">大统合联邦 · 文字战役</span><h1>{nationComplete ? '统一国家' : '区域网络'}</h1></div>
      <div className="text-idle-status"><strong>余烬历 {state.calendar.year} 年 {state.calendar.month} 月 · {state.calendar.phase === 'early' ? '上旬' : state.calendar.phase === 'mid' ? '中旬' : '下旬'}</strong><span>单一政体 · {player.population.residents} 人登记在册 · {internalRegionCount} 个内部行政区域 · 可调度 {availableWorkforce(state, state.playerPolityId)} 人</span></div>
      <div className="text-idle-speed" aria-label="时间速度">{([0, 1, 2, 4] as const).map((value) => <button key={value} className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)}>{value === 0 ? '暂停' : `${value}×`}</button>)}<button className="restart" onClick={() => { localStorage.removeItem(SAVE_KEY); onRestart(); }}>重新开始</button></div>
    </header>
    <section className="text-idle-alert ready" aria-live="polite"><div><strong>{nationComplete ? '统一国家已经成立' : integrationComplete ? '区域统合已经完成' : complete ? '区域网络已经形成' : '把临时外拓变成稳定网络'}</strong><span>{nationComplete ? '统一登记、跨区调度与公共服务责任已进入同一政体的持续运行结构。' : integrationComplete ? '多个内部节点、人口调拨和服务班次已经进入共同运行程序；现在可以建立统一国家所需的登记、调度和保障责任。' : complete ? '中继点、补给线和共同规则已接入同一套区域运行结构；现在开始建立内部节点与服务统合。' : notice}</span><small>区域服务 {region?.integration.services ?? 0} · 执行能力 {region?.integration.executionQuality ?? 0} · 建设物资 {(state.quantities[`polity:${state.playerPolityId}`]?.['construction.ldu']?.current ?? 0).toFixed(1)}</small></div><p><b>阶段目标：</b>{nationComplete ? '维持跨区服务、设施检修与统一调度；后续阶段将从这些事实继续扩展。' : integrationComplete ? '完成跨区登记、国家调度所、干线补给网与有期限的服务保障程序，再审议统一国家章程。' : complete ? '建立多个内部节点，调拨常驻人口与公共服务班次，再完成内部统合章程。' : '先勘察，再建设中继点和补给线；所有结果都写入国家内核，供统合阶段继续使用。'}</p></section>
    <section className="focus-compact" aria-label="战役阶段路线"><div className="focus-toggle"><strong>战役路线：</strong><span>区域网络 {complete ? '已完成' : '进行中'} → 区域统合 {integrationComplete ? '已完成' : '待完成'} → 统一国家 {nationComplete ? '已完成' : integrationComplete ? '可推进：先完成公共服务保障令，再审议统一国家章程' : '后续阶段：完成内部统合后开放'}</span></div></section>
    <section className="text-idle-grid regional-grid">
      <article className="text-idle-card activity-card"><div className="card-heading"><div><span>{nationComplete ? '国家态势' : '区域态势'}</span><h2>{nationComplete ? '统一调度正在运行' : complete ? '固定联接已建立' : '从聚居地向区域延伸'}</h2></div><small>持续运行</small></div><svg className="activity-sketch explore" viewBox="0 0 240 130" aria-hidden="true"><path className="ground" d="M12 105H228" /><path className="route" d="M48 95C90 70 120 84 174 49" /><circle className="marker" cx="176" cy="48" r="9" /><circle className="marker" cx="65" cy="93" r="7" /><path className="person" d="M109 76v20m-9-9h18m-12 9-5 10m9-10 6 10" /></svg><p className="activity-caption">内部行政区域 {internalRegionCount} 个 · 已投用设施 {Object.keys(state.facilities).length} 项 · 已接通网络 {Object.keys(state.networks).length} 条 · 已归档能力 {Object.keys(player.capabilities).length} 项</p></article>
      <article className="text-idle-card work-card regional-operations"><div className="card-heading"><div><span>{integrationComplete ? '统一国家事项' : '区域事项'}</span><h2>按前置关系推进</h2></div><small>{operations.filter(({ operation }) => operation?.status === 'completed').length} / {operations.length} 已完成</small></div><div className="choice-list">{operations.map(({ definition, operation }) => operation == null ? null : <section key={definition.id} className="regional-operation"><div><strong>{kindName(definition.kind)} · {definition.title}</strong><small>{statusName(operation.status)}</small></div><p>{definition.summary}</p><em>完成后：{definition.outcome}</em>{operation.status === 'active' && <><div className="work-meter"><i style={{ width: `${progress(operation)}%`, transitionDuration: `${speed === 0 ? 0 : Math.max(250, BASE_DAY_INTERVAL_MS / speed - 160)}ms` }} /></div><small>{progress(operation)} · 作业人员 {operation.staffRequired} 人</small></>}{operation.status === 'planned' && <button onClick={() => begin(definition.id)}>启动{definition.kind === 'policy' ? '政策' : '事项'}</button>}</section>)}</div></article>
      <article className="text-idle-card service-dispatch-card"><div className="card-heading"><div><span>公共服务调度</span><h2>{canDispatchServices ? '按节点分配服务班次' : '等待区域服务登记'}</h2></div><small>{assignedServices} / {player.workforce.publicServices} 人已排班</small></div>{canDispatchServices ? <div className="service-node-list">{(region?.cityIds ?? []).map((cityId) => { const city = state.cities[cityId]; if (city == null) return null; const values = state.quantities[`city:${cityId}`] ?? {}; const assigned = serviceAssignments[cityId] ?? 0; return <section key={cityId}><div><strong>{cityId === 'city.core' ? '核心聚居地' : cityId === 'city.regional-node-a' ? '第一个常驻节点' : '第二个常驻节点'}</strong><small>{city.population} 人常驻</small></div><span>供水 {(values['service.waterCoverage']?.current ?? 0).toFixed(0)} · 诊疗 {(values['service.healthCoverage']?.current ?? 0).toFixed(0)}</span><div className="service-adjust"><button disabled={assigned <= 0} onClick={() => adjustService(cityId, -1)}>−</button><b>{assigned} 人服务班次</b><button disabled={assignedServices >= player.workforce.publicServices} onClick={() => adjustService(cityId, 1)}>＋</button></div></section>; })}</div> : <p className="card-note">完成“区域服务登记”后，公共服务人员才能在各常驻节点间重新排班。</p>}</article>
      <article className="text-idle-card archive-card"><div className="card-heading"><div><span>{nationComplete ? '国家档案' : '区域档案'}</span><h2>已形成的长期事实</h2></div><small>可供下一阶段引用</small></div><div className="archive-columns"><section><strong>设施</strong>{Object.keys(state.facilities).map((id) => <span key={id}>{id === 'facility.regional-relay' ? '区域中继点' : id === 'facility.national-coordination-office' ? '国家调度所' : '既有聚居设施'}</span>)}</section><section><strong>网络</strong>{Object.keys(state.networks).length === 0 ? <span>尚无固定网络</span> : Object.keys(state.networks).map((id) => <span key={id}>{id === 'network.regional-supply-route' ? '区域补给线' : id === 'network.national-service-trunk' ? '干线补给网' : id}</span>)}</section><section><strong>阶段边界</strong><span>仍未创建外部政体或战争状态。</span><span>{nationComplete ? '统一国家仍只处理内部行政、服务与网络事实。' : '区域统合将先处理内部节点、服务与协调。'}</span></section></div></article>
    </section>
  </main>;
}
