import { useEffect, useMemo, useState } from 'react';
import { availableWorkforce, advanceNationKernelDays, startOperation } from '../nationKernel/simulation';
import { createUnifiedNationSave } from '../nationKernel/saveFixtures';
import { unifiedNationOperationDefinitions } from '../nationKernel/unifiedNationContent';
import type { KernelId, NationKernelState, OperationState } from '../nationKernel/types';
import './textIdle.css';

const BASE_DAY_INTERVAL_MS = 18_000;

const cityRoleName: Record<string, string> = {
  industrial: '工业与维修核心', port: '港口与外运节点', administrative: '行政与调度核心', research: '科研与公共服务节点', logistics: '物流韧性节点',
};
const quantityLabels: Array<{ id: string; label: string; everyday: string }> = [
  { id: 'capacity.engineering', label: '建设与维修', everyday: '桥、泵站与厂房能持续被修好' },
  { id: 'capacity.energy', label: '能源', everyday: '家庭照明、冷链和车间班次更稳定' },
  { id: 'capacity.research', label: '科研', everyday: '标准能被验证并交给生产一线' },
  { id: 'capacity.logistics', label: '物流', everyday: '粮食、零件和药品能按线抵达' },
  { id: 'capacity.cohesion', label: '共同体', everyday: '跨区责任与申诉有共同的处理规则' },
  { id: 'capacity.defense', label: '防卫', everyday: '关键设施和通行秩序有最低保障' },
];

function numberText(value: number): string { return new Intl.NumberFormat('zh-CN', { maximumFractionDigits: 1 }).format(value); }
function statusName(status: OperationState['status']): string { return status === 'planned' ? '待启动' : status === 'active' ? '进行中' : status === 'completed' ? '已完成' : status === 'blocked' ? '受阻' : '已取消'; }
function kindName(kind: OperationState['kind']): string { return kind === 'survey' ? '勘察' : kind === 'engineering' ? '工程' : kind === 'policy' ? '政策' : '技术'; }
function operationProgress(operation: OperationState): number {
  const total = operation.workRequired > 0 ? operation.workRequired : operation.durationDays ?? 1;
  const current = operation.workRequired > 0 ? operation.workDone : operation.elapsedDays;
  return Math.min(100, Math.round(current / total * 100));
}

function fixtureState(): NationKernelState { return createUnifiedNationSave().state; }

/** R27 的玩家态后期测试入口：读取同一国家内核存档，但不写入首阶段试玩存档。 */
export function UnifiedNationCampaignApp({ onExit }: { onExit: () => void }) {
  const [state, setState] = useState<NationKernelState>(fixtureState);
  const [speed, setSpeed] = useState<0 | 1 | 2 | 4>(1);
  const [notice, setNotice] = useState('国家已拥有数个运行中的城市与网络。先用技术和工程补齐跨区能力，再让制度把能力转成稳定的日常服务。');
  const player = state.polities[state.playerPolityId];
  const values = state.quantities[`polity:${player.id}`] ?? {};
  const definitions = useMemo(() => {
    const byRole = (role: string): KernelId => Object.values(state.cities).find((city) => city.polityId === player.id && city.role === role)?.id ?? '';
    return unifiedNationOperationDefinitions({
      polityId: player.id,
      northCoreCityId: byRole('industrial'), northPortCityId: byRole('port'), centralCityId: byRole('administrative'),
      coastCoreCityId: byRole('research'), coastSatelliteCityId: byRole('logistics'),
    }).map((definition) => ({ definition, operation: state.operations[definition.id] })).filter((item) => item.operation != null);
  }, [state, player.id]);
  const completed = definitions.filter(({ operation }) => operation?.status === 'completed').length;
  const active = definitions.filter(({ operation }) => operation?.status === 'active').length;
  const cities = Object.values(state.cities).filter((city) => city.polityId === player.id);

  useEffect(() => {
    if (speed === 0) return undefined;
    const timer = window.setInterval(() => setState((previous) => advanceNationKernelDays(previous, 1)), BASE_DAY_INTERVAL_MS / speed);
    return () => window.clearInterval(timer);
  }, [speed]);

  function advance(days: number): void {
    setState((previous) => advanceNationKernelDays(previous, days));
    setNotice(`已推进 ${days} 日：设施、网络与已启动事项都已按日结算。`);
  }
  function begin(operationId: string): void {
    setState((previous) => {
      const next = startOperation(previous, operationId);
      if (next === previous) { setNotice('该事项仍有前置能力、设施、网络、建设物资或可调度人手未满足；先完成已可启动的上游事项。'); return previous; }
      setNotice('事项已纳入国家工作队列。技术会沉淀为能力，工程会留下设施或网络，政策只在执行期内持续影响社会运行。');
      return next;
    });
  }

  return <main className="text-idle-shell">
    <header className="text-idle-topbar">
      <div><span className="text-idle-kicker">同一战役 · 后期测试存档</span><h1>统一国家</h1></div>
      <div className="text-idle-status"><strong>余烬历 {state.calendar.year} 年 {state.calendar.month} 月</strong><span>{numberText(player.population.residents)} 人登记在册 · {cities.length} 座城市 · {Object.keys(state.networks).length} 条运行网络 · 可调度 {numberText(availableWorkforce(state, player.id))} 人</span></div>
      <div className="text-idle-speed" aria-label="时间速度">{([0, 1, 2, 4] as const).map((value) => <button key={value} className={speed === value ? 'active' : ''} onClick={() => setSpeed(value)}>{value === 0 ? '暂停' : `${value}×`}</button>)}<button onClick={() => advance(7)}>推进 7 日</button><button className="restart" onClick={() => { setState(fixtureState()); setNotice('测试存档已还原；首阶段试玩存档没有被读取或改写。'); }}>重置测试</button><button className="restart" onClick={onExit}>返回试玩</button></div>
    </header>

    <section className="text-idle-alert ready" aria-live="polite"><div><strong>从区域统合延续到统一国家</strong><span>{notice}</span><small>建设物资 {numberText(values['construction.ndu']?.current ?? 0)} NDU · 维护积压 {numberText(values['maintenance.backlog']?.current ?? 0)} · 运行设施 {Object.keys(state.facilities).length} 项</small></div><p><b>本阶段路线：</b>区域网络已提供节点与干线；国家能力通过技术、产业工程与服务制度逐层兑现。这里不是另一款游戏，也不提前接回星球空间画面。</p></section>
    <section className="focus-compact"><div className="focus-toggle"><strong>战役路线：</strong><span>稳定聚居 ✓ → 区域网络 ✓ → 区域统合 ✓ → 统一国家（{completed}/{definitions.length} 项国家事项完成，{active} 项进行中）</span></div></section>

    <section className="text-idle-grid national-grid">
      <article className="text-idle-card national-strength-card"><div className="card-heading"><div><span>国家实力</span><h2>能力必须落到日常生活</h2></div><small>不是抽象分数</small></div><div className="national-strength-list">{quantityLabels.map((item) => <section key={item.id}><div><strong>{item.label}</strong><b>{numberText(values[item.id]?.current ?? 0)}</b></div><span>{item.everyday}</span><i><em style={{ width: `${Math.min(100, values[item.id]?.current ?? 0)}%` }} /></i></section>)}</div></article>
      <article className="text-idle-card work-card national-operations"><div className="card-heading"><div><span>国家事项</span><h2>技术 → 产业 → 社会 → 政治</h2></div><small>{completed} / {definitions.length} 已完成</small></div><div className="choice-list">{definitions.map(({ definition, operation }) => operation == null ? null : <section key={definition.id} className="regional-operation"><div><strong>{kindName(definition.kind)} · {definition.title}</strong><small>{statusName(operation.status)}</small></div><p>{definition.summary}</p><em>落实到生活：{definition.outcome}</em>{operation.status === 'active' && <><div className="work-meter"><i style={{ width: `${operationProgress(operation)}%`, transitionDuration: `${speed === 0 ? 0 : Math.max(250, BASE_DAY_INTERVAL_MS / speed - 160)}ms` }} /></div><small>{operationProgress(operation)}% · 占用 {numberText(operation.staffRequired)} 人</small></>}{operation.status === 'planned' && <button onClick={() => begin(operation.id)}>启动{definition.kind === 'policy' ? '政策' : '事项'}</button>}</section>)}</div></article>
      <article className="text-idle-card national-city-card"><div className="card-heading"><div><span>公共服务</span><h2>城市不是背景板</h2></div><small>水、诊疗、教育</small></div><div className="national-city-list">{cities.map((city) => { const local = state.quantities[`city:${city.id}`] ?? {}; return <section key={city.id}><div><strong>{cityRoleName[city.role] ?? '城市节点'}</strong><small>{numberText(city.population)} 人常住</small></div><span>供水 {numberText(local['service.waterCoverage']?.current ?? 0)} · 诊疗 {numberText(local['service.healthCoverage']?.current ?? 0)} · 教育 {numberText(local['service.educationCoverage']?.current ?? 0)}</span></section>; })}</div></article>
      <article className="text-idle-card archive-card"><div className="card-heading"><div><span>延续中的国家事实</span><h2>工程和网络会留下来，成为下一轮选择的前置</h2></div><small>测试存档专用</small></div><div className="archive-columns"><section><strong>设施 · {Object.keys(state.facilities).length}</strong>{Object.values(state.facilities).slice(0, 5).map((facility) => <span key={facility.id}>{facility.moduleId} · 状况 {numberText(facility.lifecycle.condition)}</span>)}</section><section><strong>网络 · {Object.keys(state.networks).length}</strong>{Object.values(state.networks).map((network) => <span key={network.id}>{network.kind} · 容量 {numberText(network.capacity)} · 冗余 {numberText(network.redundancy)}</span>)}</section><section><strong>近期调度记录</strong>{state.ledger.length === 0 ? <span>启动事项或推进时间后，变化会被记录在这里。</span> : state.ledger.slice(-4).reverse().map((entry, index) => <span key={`${entry.day}-${entry.sourceId}-${index}`}>第 {entry.day} 日 · {entry.reasonKey}</span>)}</section></div></article>
    </section>
  </main>;
}
