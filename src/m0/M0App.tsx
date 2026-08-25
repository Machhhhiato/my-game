import { useEffect, useMemo, useState, type ReactElement } from 'react';
import { clearM0State, loadM0State, saveM0State } from './save';
import { coverageDays, advanceOneDay, advanceRealTime, setProjectAutoResume, setRunning } from './simulation';
import {
  createInitialM0State,
  setDailyMode,
  setHeadquartersSalvageApproval,
  setSafetyDays,
} from './state';
import {
  RESOURCE_IDS,
  type DailyLineId,
  type M0State,
  type Project,
  type ProjectEvent,
  type WorkMode,
} from './types';
import './m0.css';

const labels = {
  water: '水',
  food: '食物',
  commonParts: '普通零件',
  engineeringComponents: '工程构件',
  alloy: '合金料',
  precisionParts: '精密部件',
} as const;

const lineLabels: Record<DailyLineId, string> = {
  water: '供水',
  food: '食物',
  maintenance: '维护与手工作坊',
  logistics: '总部短途物流',
};
const modes: WorkMode[] = ['minimum', 'standard', 'accelerated'];
const modeLabels: Record<WorkMode, string> = { minimum: '最低', standard: '标准', accelerated: '加速' };

function pauseReason(reason: Project['pausedReason']): string {
  if (reason === 'hard_floor') return '触及硬底线';
  if (reason === 'safety_line') return '触及安全线';
  if (reason === 'staffing_shortage') return '岗位不足';
  return '原因待确认';
}

function projectStatus(project: Project): string {
  if (project.status === 'active') return '进行中';
  if (project.status === 'complete') return '已完成';
  if (project.status === 'waiting_confirmation') return `等待确认：${pauseReason(project.pausedReason)}`;
  return `已暂停：${pauseReason(project.pausedReason)}`;
}

function projectEventText(event: ProjectEvent): string {
  if (event.status === 'active') return `${event.projectName}已自动恢复`;
  if (event.status === 'waiting_confirmation') return `${event.projectName}等待确认：${pauseReason(event.reason)}`;
  return `${event.projectName}已暂停：${pauseReason(event.reason)}`;
}

export function M0App(): ReactElement {
  const [state, setState] = useState<M0State>(() => loadM0State());

  useEffect(() => {
    if (!state.clock.running) return undefined;
    const timer = window.setInterval(() => setState((current) => advanceRealTime(current, 1_000)), 1_000);
    return () => window.clearInterval(timer);
  }, [state.clock.running]);

  const latest = state.ledger.at(-1);
  const living = state.population.normal + state.population.unableToWork + state.population.critical;
  const workforceTotal = state.workforce.basicDuty
    + state.workforce.water
    + state.workforce.food
    + state.workforce.maintenance
    + state.workforce.logistics
    + state.workforce.development
    + state.workforce.standby
    + state.projects
      .filter((project) => project.staffing.source === 'development')
      .reduce((sum, project) => sum + project.staffing.actual, 0);
  const save = (): void => saveM0State(state);
  const fresh = (): void => setState(createInitialM0State());

  const protectedCoverage = useMemo(() => ({
    water: coverageDays(state, 'water'),
    food: coverageDays(state, 'food'),
    commonParts: coverageDays(state, 'commonParts'),
  }), [state]);

  return <main className="m0-app">
    <header className="m0-header">
      <div><h1>总部运行总览</h1><p>{state.day === 0 ? '开局' : `第 ${state.day} 日`} · {state.clock.running ? '运行中' : '已暂停'} · 20 秒/游戏日</p></div>
      <div className="m0-actions">
        <button onClick={() => setState((current) => setRunning(current, !current.clock.running))}>{state.clock.running ? '暂停时间' : '开始时间'}</button>
        <button onClick={() => setState((current) => advanceOneDay(current))}>结算 1 日</button>
        <button onClick={save}>保存</button>
        <button onClick={() => setState(loadM0State())}>读取</button>
        <button onClick={() => { clearM0State(); fresh(); }}>新档</button>
      </div>
    </header>

    <section className="m0-grid">
      <article><h2>人口与岗位</h2>
        <p>存活 {living}；正常 {state.population.normal}；无法工作 {state.population.unableToWork}；危急 {state.population.critical}；死亡 {state.population.deceased}</p>
        <p>连续供水缺口 {state.population.waterDebt} 日；连续食物缺口 {state.population.foodDebt} 日</p>
        <p>基本值守 {state.workforce.basicDuty}；供水 {state.workforce.water}；食物 {state.workforce.food}；维护 {state.workforce.maintenance}；物流 {state.workforce.logistics}；可调度 {state.workforce.development}；原地待命 {state.workforce.standby}</p>
        <p>已安排 {workforceTotal}/{state.workforce.workable} 名可工作人口</p>
        <p>{state.staffingShortage?.message ?? state.feedback ?? '当前岗位均已安排。'}</p>
      </article>
      <article><h2>日常调度</h2>
        {(Object.keys(lineLabels) as DailyLineId[]).map((line) => <label className="m0-control" key={line}>{lineLabels[line]}
          <select value={state.dailyModes[line]} onChange={(event) => setState((current) => setDailyMode(current, line, event.target.value as WorkMode))}>
            {modes.map((mode) => <option key={mode} value={mode}>{modeLabels[mode]}</option>)}
          </select>
        </label>)}
      </article>
      <article><h2>六种库存</h2>
        <table><thead><tr><th>库存</th><th>数量/容量</th><th>锁定</th><th>可用</th></tr></thead><tbody>
          {RESOURCE_IDS.map((resource) => <tr key={resource}><td>{labels[resource]}</td><td>{state.stocks[resource].amount}/{state.stocks[resource].capacity}</td><td>{state.stocks[resource].locked}</td><td>{Math.max(0, state.stocks[resource].amount - state.stocks[resource].locked - state.stocks[resource].reserved)}</td></tr>)}
        </tbody></table>
      </article>
      <article><h2>底线与预警</h2>
        {(['water', 'food', 'commonParts'] as const).map((resource) => <label className="m0-control" key={resource}>{labels[resource]} {protectedCoverage[resource].toFixed(1)} 日，硬底线 {state.safetyLines[resource].hardDays}
          <span>安全线 <input type="number" min={state.safetyLines[resource].hardDays} value={state.safetyLines[resource].safetyDays} onChange={(event) => setState((current) => setSafetyDays(current, resource, Number(event.target.value)))} /></span>
        </label>)}
        <p>{state.warnings.length ? state.warnings.join('；') : '当前没有新的预警'}</p>
      </article>
      <article><h2>维护与水务</h2>
        <p>维护积压 {state.maintenanceBacklog} 工作量；可修旧件 {state.oldRepairableParts}</p>
        <label>普通零件接近安全线时允许低效拆解 <input type="checkbox" checked={state.headquartersSalvage.approved} onChange={(event) => setState((current) => setHeadquartersSalvageApproval(current, event.target.checked))} /></label>
        <p>低效拆解已移除总部可用物件 {state.headquartersSalvage.dismantledItems} 件。</p>
        <p>总部水务恢复 {state.waterworks.workDone}/{state.waterworks.workRequired}，{state.waterworks.repaired ? '已恢复' : '降级运行'}</p>
        <p>主线工程已预留：普通零件 {state.stocks.commonParts.locked}、工程构件 {state.stocks.engineeringComponents.locked}、合金料 {state.stocks.alloy.locked}。预留物资尚未消耗。</p>
      </article>
      <article><h2>优先级与队列</h2>
        <div className="m0-project"><strong>P0 生存保障</strong><span>人口供给与最低值守</span></div>
        {state.projects.filter((project) => !project.testOnly).map((project) => <div className="m0-project" key={project.id}><strong>{project.priority} {project.name}</strong><span>{projectStatus(project)} · 占用 {project.staffing.actual}/{project.staffing.planned} 人</span>
          <label>自动恢复 <input type="checkbox" checked={project.autoResume} disabled={project.status === 'complete'} onChange={(event) => setState((current) => setProjectAutoResume(current, project.id, event.target.checked))} /></label>
        </div>)}
      </article>
      <article className="m0-wide"><h2>最近流水</h2>
        {latest ? <><p>第 {latest.day} 日：水 {latest.resources.water.start}+{latest.resources.water.inflow}-{latest.resources.water.outflow}={latest.resources.water.end}；食物 {latest.resources.food.start}+{latest.resources.food.inflow}-{latest.resources.food.outflow}={latest.resources.food.end}；普通零件 {latest.resources.commonParts.start}+{latest.resources.commonParts.inflow}-{latest.resources.commonParts.outflow}={latest.resources.commonParts.end}</p>
          <p>水务 {latest.waterworksWorkStart}→{latest.waterworksWorkEnd}；旧件 {latest.oldRepairablePartsStart}→{latest.oldRepairablePartsEnd}；拆解物件 {latest.headquartersSalvageStart}→{latest.headquartersSalvageEnd}；项目物流 {latest.logisticsProjectCapacity} 工作量；项目变化 {latest.projectEvents.map(projectEventText).join('、') || '无'}</p></> : <p>尚未结算。开局默认暂停。</p>}
      </article>
    </section>
  </main>;
}
