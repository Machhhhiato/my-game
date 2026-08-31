import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type WheelEvent as ReactWheelEvent,
  type ReactElement,
  type RefObject,
} from 'react';
import { clearM0State, loadM0State, saveM0State } from './save';
import {
  advanceRealTime,
  availableAmount,
  approveOpeningProject,
  approveRecoveryProject,
  setGameSpeed,
  approveCapabilityProject,
  approveSurvey,
  completeDroneRecharge,
  contactExistingSettlement,
  integrateExistingSettlement,
  selectMapCell,
  moveProjectInQueue,
  removeResearchTarget,
  setProductionAllocation,
  setProjectPaused,
  setResearchTarget,
  setSurveyPaused,
  setRunning,
} from './simulation';
import {
  createInitialM0State,
  livingPopulation,
  setEventWindowPosition,
} from './state';
import {
  RESOURCE_IDS,
  type EventWindowPosition,
  type GameSpeed,
  type M0Event,
  type M0State,
  type OpeningProjectId,
  type Project,
  type ResourceId,
} from './types';
import {
  LOCATION_CELLS,
  REGION_MAP,
  intelStageName,
  normalizeRegionCamera,
  projectRegionMap,
  regionPoint,
  surveyConclusion,
  surveyPlanControlState,
  surveyVisibleFacts,
  visibleCellClass,
  visibleCellTitle,
  type RegionCamera,
} from './map';
import { technologies, technologyName } from './progression';
import { OPENING_PROJECT_RULES, RECOVERY_RULES, openingLoopEvidence } from './openingLoop';
import './m0.css';

const resourceLabels: Record<ResourceId, string> = {
  water: '水',
  food: '食物',
  commonParts: '普通零件',
  engineeringComponents: '工程构件',
  alloy: '合金料',
  precisionParts: '精密部件',
};

const resourceIcons: Record<ResourceId, string> = {
  water: '◒',
  food: '❧',
  commonParts: '⚙',
  engineeringComponents: '◇',
  alloy: '⬡',
  precisionParts: '✦',
};

const openingEvidenceLabels: Record<string, string> = {
  population_registered_served: '已登记且受服务人口',
  water_repeatable: '重复日供水',
  food_repeatable: '重复食物',
  critical_power: '关键供能',
  sanitation_medical: '卫生与基础医疗',
  repair_sustainment: '基础维修',
  basic_industry: '基础产业',
  mobile_workforce: '机动人力',
  idle_queue: '可挂机队列',
};

type SheetId = 'headquarters' | 'research' | 'exploration' | 'engineering' | 'production' | 'archives';

const sheetEntries: Array<{ id: SheetId; icon: string; label: string }> = [
  { id: 'headquarters', icon: '⌂', label: '总部' },
  { id: 'research', icon: '⌁', label: '科研' },
  { id: 'exploration', icon: '◎', label: '探索' },
  { id: 'engineering', icon: '▱', label: '工程' },
  { id: 'production', icon: '⚒', label: '生产' },
  { id: 'archives', icon: '▤', label: '日志' },
];

const numberFormatter = new Intl.NumberFormat('zh-CN', {
  maximumFractionDigits: 2,
});

function formatNumber(value: number): string {
  return numberFormatter.format(Math.abs(value) < 0.005 ? 0 : value);
}

function formatDate(date: M0State['calendar']): string {
  return `${date.year} 年 ${date.month} 月 ${date.day} 日`;
}

function displayedPopulation(state: M0State): number {
  return livingPopulation(state);
}

function formatProjectStatus(project: Project): string {
  if (project.status === 'active') return '正在进行';
  if (project.status === 'complete') return '已完成';
  if (project.status === 'waiting_confirmation') return '已停止，等待确认';
  return '已暂停';
}

function ResourceReadout({ state, resource }: { state: M0State; resource: ResourceId }): ReactElement {
  const account = state.monthly.resources[resource];
  const available = availableAmount(state, resource);
  const netChange = account.projectedClosingAmount - available;
  const remainingIncome = account.projectedRemainingInflow;
  const remainingExpense = account.projectedRemainingOutflow;
  const incomeSource = resource === 'water'
    ? '总部供水'
    : resource === 'food'
      ? '食物生产与转运'
      : resource === 'commonParts'
        && state.oldRepairableParts === 0
        && state.headquartersSalvage.approved
        && account.currentDailyInflow > 0
        ? '总部物件拆解'
        : resource === 'commonParts'
          ? '旧件修复'
          : '无收入';
  const expenseDestination = resource === 'water'
    ? '居民生活用水'
      : resource === 'food'
      ? '居民食物供应'
      : resource === 'commonParts'
        ? '总部设施维护'
        : remainingExpense > 0
          ? '工程投入'
          : '无支出';
  const tooltipId = `m0-resource-${resource}`;

  return <div className="m0-resource-readout">
    <button type="button" className="m0-resource-summary" aria-describedby={tooltipId}>
      <span className="m0-resource-icon" aria-hidden="true">{resourceIcons[resource]}</span>
      <span className="m0-resource-name">{resourceLabels[resource]}</span>
      <strong>{formatNumber(available)}</strong>
      <span className={`m0-resource-delta ${netChange === 0 ? 'is-empty' : ''}`}>
        {netChange > 0 ? `+${formatNumber(netChange)}` : netChange < 0 ? `-${formatNumber(Math.abs(netChange))}` : ''}
      </span>
    </button>
    <div className="m0-resource-detail" id={tooltipId} role="tooltip">
      <h2>{resourceLabels[resource]}</h2>
      <section className="m0-resource-flow">
        <div className="m0-resource-flow-total"><span>收入</span><strong>+{formatNumber(remainingIncome)}</strong></div>
        <div className="m0-resource-flow-line">
          <span>{remainingIncome > 0 ? incomeSource : '无收入'}</span>
          <span>{remainingIncome > 0 ? `+${formatNumber(remainingIncome)}` : ''}</span>
        </div>
      </section>
      <section className="m0-resource-flow">
        <div className="m0-resource-flow-total is-expense"><span>支出</span><strong>-{formatNumber(remainingExpense)}</strong></div>
        <div className="m0-resource-flow-line">
          <span>{remainingExpense > 0 ? expenseDestination : '无支出'}</span>
          <span>{remainingExpense > 0 ? `-${formatNumber(remainingExpense)}` : ''}</span>
        </div>
      </section>
    </div>
  </div>;
}

function TopBar({
  state,
  populationDelta,
  onPause,
  onSpeed,
}: {
  state: M0State;
  populationDelta: number | null;
  onPause: () => void;
  onSpeed: (speed: GameSpeed) => void;
}): ReactElement {
  return <header className="m0-topbar">
    <div className="m0-population" aria-label={`已登记人口 ${displayedPopulation(state)}`}>
      <span aria-hidden="true">♟</span>
      <span>人口</span>
      <strong>{displayedPopulation(state)}</strong>
      <span className={`m0-population-delta ${populationDelta === null ? 'is-empty' : ''}`} aria-live="polite">
        {populationDelta !== null && populationDelta > 0 ? `+${populationDelta}` : populationDelta}
      </span>
    </div>
    <div className="m0-resource-strip" aria-label="持续资源">
      {RESOURCE_IDS.map((resource) => <ResourceReadout key={resource} state={state} resource={resource} />)}
    </div>
    <div className="m0-time-controls">
      <time>{formatDate(state.calendar)}</time>
      <div className="m0-speed-buttons" aria-label="时间速度">
        <button
          type="button"
          className={!state.clock.running ? 'is-active' : ''}
          aria-label="暂停"
          title="暂停"
          onClick={onPause}
        >Ⅱ</button>
        {([1, 2, 4] as GameSpeed[]).map((speed) => <button
          type="button"
          className={state.clock.running && state.clock.speed === speed ? 'is-active' : ''}
          aria-label={`${speed} 倍速度`}
          title={`${speed} 倍速度`}
          key={speed}
          onClick={() => onSpeed(speed)}
        >{speed}x</button>)}
      </div>
    </div>
  </header>;
}

function SystemRail({ activeSheet, onSelect }: {
  activeSheet: SheetId | null;
  onSelect: (sheet: SheetId) => void;
}): ReactElement {
  return <nav className="m0-system-rail" aria-label="系统入口">
    {sheetEntries.map((entry) => <button
      type="button"
      className={activeSheet === entry.id ? 'is-active' : ''}
      aria-label={entry.label}
      title={entry.label}
      aria-pressed={activeSheet === entry.id}
      key={entry.id}
      onClick={() => onSelect(entry.id)}
    ><span aria-hidden="true">{entry.icon}</span></button>)}
  </nav>;
}

function HeadquartersSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const workforce = state.workforce;
  const settlement = state.settlement;
  const evidence = openingLoopEvidence(state);
  const settlementStatus = settlement.status === 'uncontacted' ? '未接触'
    : settlement.status === 'contacted' ? '已接触'
      : settlement.status === 'services-approved' ? '接入项目进行中'
        : settlement.status === 'ready-to-integrate' ? '等待人口接入'
          : '已登记并受服务';
  const lineBuildings = [
    { line: 'water', name: '总部供水站', location: '总部' },
    { line: 'food', name: '食物保障点', location: '总部' },
    { line: 'maintenance', name: '维护手工作坊', location: '总部' },
    { line: 'logistics', name: '短途运输站', location: '总部' },
  ] as const;
  return <div className="m0-facility-list">
    <article className="m0-settlement-card">
      <div className="m0-project-heading"><h3>既存聚居点</h3><span>{settlementStatus}</span></div>
      <dl className="m0-workforce-summary">
        <div><dt>地点人口</dt><dd>{settlement.population}</dd></div>
        <div><dt>已登记受服务</dt><dd>{settlement.servedPopulation}</dd></div>
        <div><dt>可进入常规劳动</dt><dd>{settlement.workforceEligible}</dd></div>
        <div><dt>地方常规岗位</dt><dd>{settlement.workforceAssigned}</dd></div>
        <div><dt>机动人力</dt><dd>{settlement.workforceEligible - settlement.workforceAssigned}</dd></div>
      </dl>
      {settlement.status === 'uncontacted'
        ? <button type="button" onClick={() => updateState(contactExistingSettlement)}>接触既存聚居点</button>
        : null}
      {settlement.status === 'ready-to-integrate'
        ? <button type="button" onClick={() => updateState(integrateExistingSettlement)}>接入人口</button>
        : null}
    </article>
    <article className="m0-loop-evidence">
      <div className="m0-project-heading"><h3>千人自循环证据</h3><span>{evidence.passed ? '通过' : '未通过'} · {evidence.consecutiveMonths} / 3 月</span></div>
      <ul>{evidence.items.map((item) => <li className={item.status === 'pass' ? 'is-pass' : 'is-blocked'} key={item.id}>
        <strong>{openingEvidenceLabels[item.id]}</strong><span>{item.status === 'pass' ? '通过' : item.gap}</span>
      </li>)}</ul>
    </article>
    {lineBuildings.map(({ line, name, location }) => {
      const staffed = state.workforce[line];
      return <article className="m0-facility-row" key={line}>
        <div className="m0-facility-heading">
          <div><h3>{name}</h3><small>{location}</small></div>
          <strong>{staffed} 人在岗</strong>
        </div>
      </article>;
    })}
    {state.research.facilities.map((facility) => {
      return <article className="m0-facility-row" key={facility.id}>
        <div className="m0-facility-heading">
          <div><h3>{facility.name}</h3><small>总部避难所</small></div>
          <strong>{facility.enabled ? `${state.workforce.research} 人在岗` : '待命'}</strong>
        </div>
      </article>;
    })}
    <dl className="m0-workforce-summary">
      <div><dt>可工作</dt><dd>{workforce.workable}</dd></div>
      <div><dt>基本值守</dt><dd>{workforce.basicDuty}</dd></div>
      <div><dt>科研</dt><dd>{workforce.research}</dd></div>
      <div><dt>工程与探索</dt><dd>{workforce.workable - workforce.basicDuty - workforce.water - workforce.food - workforce.maintenance - workforce.logistics - workforce.research - workforce.standby - workforce.development}</dd></div>
      <div><dt>可调度</dt><dd>{workforce.development}</dd></div>
    </dl>
  </div>;
}

function EngineeringSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const [view, setView] = useState<'build' | 'active' | 'places'>('build');
  const hiddenProjectIds = new Set([
    'restore-precision-manufacturing',
    'adapt-survey-drone',
    'prototype-precision-parts',
    'assemble-survey-drone',
    'survey-ruin-a',
    'survey-ruin-b',
  ]);
  const projects = state.projects.filter((project) => !project.testOnly && project.status !== 'complete' && !hiddenProjectIds.has(project.id));
  const exists = (id: string): boolean => state.projects.some((project) => project.id === id);
  const selectedCell = state.map.cells.find((cell) => cell.id === state.map.selectedCellId);
  const workshopAvailable = state.research.completed.includes('restore-precision-manufacturing')
    && !exists('repair-precision-workshop');
  const workshopLocationSelected = selectedCell?.occupation === 'headquarters';
  const farmCell = state.map.cells.find((cell) => cell.resource === 'farmland-potential');
  const mineralCell = state.map.cells.find((cell) => cell.resource === 'mineral-sign');
  const shoreCell = state.map.cells.find((cell) => cell.resource === 'shore-potential');
  const openingProjectIds = Object.keys(OPENING_PROJECT_RULES) as OpeningProjectId[];
  const settlementProjectsOpen = state.settlement.status === 'contacted' || state.settlement.status === 'services-approved';
  const recoveryProjectIds = Object.keys(RECOVERY_RULES) as Array<keyof typeof RECOVERY_RULES>;

  return <div className="m0-project-list">
    <div className="m0-sheet-tabs" role="tablist" aria-label="工程分类">
      <button type="button" role="tab" aria-selected={view === 'build'} className={view === 'build' ? 'is-active' : ''} onClick={() => setView('build')}>建造</button>
      <button type="button" role="tab" aria-selected={view === 'active'} className={view === 'active' ? 'is-active' : ''} onClick={() => setView('active')}>建设中</button>
      <button type="button" role="tab" aria-selected={view === 'places'} className={view === 'places' ? 'is-active' : ''} onClick={() => setView('places')}>地块</button>
    </div>
    {view === 'build' && workshopAvailable ? <section className="m0-build-choice">
      <article className="m0-build-option">
        <div><h3>修复精密工坊</h3><small>只能设在总部现有工坊</small></div>
        <dl className="m0-compact-costs">
          <div><dt>普通零件</dt><dd>5</dd></div>
          <div><dt>工程构件</dt><dd>16</dd></div>
          <div><dt>合金料</dt><dd>8</dd></div>
          <div><dt>人员</dt><dd>9</dd></div>
        </dl>
        <div className="m0-build-location">
          <span>已选地块：{selectedCell ? visibleCellTitle(selectedCell) : '未选择'}</span>
          <button type="button" disabled={!workshopLocationSelected} onClick={() => updateState((current) => approveCapabilityProject(current, 'repair-precision-workshop'))}>开始建设</button>
        </div>
      </article>
    </section> : null}
    {view === 'build' ? <section className="m0-build-choice">
      <div className="m0-section-heading"><h3>聚居点接入计划</h3><span>{state.settlement.status === 'uncontacted' ? '等待接触' : '逐项批准'}</span></div>
      {openingProjectIds.map((id) => {
        const project = state.projects.find((candidate) => candidate.id === id);
        return <article className="m0-build-option" key={id}>
          <div className="m0-project-heading"><h3>{OPENING_PROJECT_RULES[id].label}</h3><span>{project ? formatProjectStatus(project) : '未批准'}</span></div>
          {project ? <div className="m0-progress" aria-label={`${OPENING_PROJECT_RULES[id].label}进度 ${project.workDone} / ${project.workRequired}`}><span style={{ width: `${Math.min(100, project.workDone / project.workRequired * 100)}%` }} /></div> : null}
          <button type="button" disabled={!settlementProjectsOpen || Boolean(project)} onClick={() => updateState((current) => approveOpeningProject(current, id))}>批准</button>
        </article>;
      })}
    </section> : null}
    {view === 'build' ? <section className="m0-build-choice">
      <div className="m0-section-heading"><h3>资源回收</h3><span>低于保底线时可批准</span></div>
      {recoveryProjectIds.map((id) => {
        const rule = RECOVERY_RULES[id];
        const project = state.projects.find((candidate) => candidate.id === id);
        const current = availableAmount(state, rule.resource);
        return <article className="m0-build-option" key={id}>
          <div className="m0-project-heading"><h3>{rule.label}</h3><span>{project ? formatProjectStatus(project) : `${formatNumber(current)} / ${rule.floor} 保底线`}</span></div>
          <p>完成流入 {rule.output} · 保底上限 {rule.cap}</p>
          {project ? <div className="m0-progress" aria-label={`${rule.label}进度 ${project.workDone} / ${project.workRequired}`}><span style={{ width: `${Math.min(100, project.workDone / project.workRequired * 100)}%` }} /></div> : null}
          <button type="button" disabled={Boolean(project) || current >= rule.floor} onClick={() => updateState((stateBeforeClick) => approveRecoveryProject(stateBeforeClick, id))}>批准</button>
        </article>;
      })}
    </section> : null}
    {view === 'active' ? <>
      {projects.length === 0 ? <p className="m0-empty-state">没有正在建设的工程。</p> : null}
      {projects.map((project) => <article className="m0-project-card" key={project.id}>
        <div className="m0-project-heading">
          <h3>{project.name}</h3>
          <span>{formatProjectStatus(project)}</span>
        </div>
        <p>进度 {formatNumber(project.workDone)} / {formatNumber(project.workRequired)}</p>
        <p>现场人员 {project.staffing.actual} / {project.staffing.planned}</p>
        <div className="m0-progress" aria-label={`工程进度 ${formatNumber(project.workDone)} / ${formatNumber(project.workRequired)}`}>
          <span style={{ width: `${project.workRequired > 0 ? Math.min(100, project.workDone / project.workRequired * 100) : 100}%` }} />
        </div>
        <dl className="m0-fact-list">
          {RESOURCE_IDS.filter((resource) => (project.investedResources[resource] ?? 0) > 0).map((resource) => <div key={resource}>
            <dt>{resourceLabels[resource]}</dt>
            <dd>{formatNumber(project.investedResources[resource] ?? 0)}</dd>
          </div>)}
        </dl>
        {!project.directRecovery ? <div className="m0-project-actions">
          <button type="button" onClick={() => updateState((current) => moveProjectInQueue(current, project.id, -1))}>提前</button>
          <button type="button" onClick={() => updateState((current) => moveProjectInQueue(current, project.id, 1))}>延后</button>
          <button type="button" onClick={() => updateState((current) => setProjectPaused(current, project.id, project.status === 'active'))}>{project.status === 'active' ? '暂停' : '继续'}</button>
        </div> : null}
      </article>)}
    </> : null}
    {view === 'places' ? <div className="m0-place-list">
      <article><div><h3>总部</h3><small>已建成</small></div><p>避难所、供水设施、基础研究室</p></article>
      {farmCell ? <article><div><h3>未来农田候选地</h3><small>已确认</small></div><p>平坦土壤，临近水源</p></article> : null}
      {mineralCell ? <article><div><h3>未来矿产坡地</h3><small>已确认</small></div><p>坡地与矿产迹象</p></article> : null}
      {shoreCell ? <article><div><h3>未来河岸候选地</h3><small>已确认</small></div><p>岸线与交通条件</p></article> : null}
    </div> : null}
  </div>;
}

function ResearchSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const currentProject = state.research.currentProjectId
    ? state.projects.find((project) => project.id === state.research.currentProjectId)
    : null;
  const effectText: Record<string, string> = {
    'restore-precision-manufacturing': '复杂零件可以稳定复制，旧精密工坊重新具备修复价值。',
    'adapt-survey-drone': '现有无人机可以安装多光谱设备，承担大范围勘测任务。',
  };
  const selectedId = state.research.manualQueue.at(-1)
    ?? state.research.currentProjectId
    ?? technologies.find((technology) => !state.research.completed.includes(technology.id))?.id
    ?? technologies.at(-1)?.id;
  const blockedText = state.research.blockedReason === 'physical-prerequisite' ? '等待：独立试制批' : null;

  return <div className="m0-research-view">
    <div className="m0-research-toolbar">
      <div className="m0-research-status">
        <strong>{currentProject ? currentProject.name : '科研待命'}</strong>
        <span>{currentProject ? `${formatNumber(currentProject.workDone)} / ${formatNumber(currentProject.workRequired)} · ${currentProject.staffing.actual} 人` : blockedText ?? ''}</span>
      </div>
    </div>
    {currentProject ? <div className="m0-progress" aria-label={`科研进度 ${formatNumber(currentProject.workDone)} / ${formatNumber(currentProject.workRequired)}`}>
      <span style={{ width: `${Math.min(100, currentProject.workDone / currentProject.workRequired * 100)}%` }} />
    </div> : null}
    <div className="m0-tech-tree" aria-label="科研技术关系">
      {technologies.map((technology, index) => {
        const complete = state.research.completed.includes(technology.id);
        const current = state.research.currentProjectId === technology.id;
        const queued = state.research.manualQueue.includes(technology.id);
        return <div className="m0-tech-step" key={technology.id}>
          {index > 0 ? <span className="m0-tech-connector" aria-hidden="true">→</span> : null}
          <button
            type="button"
            className={`${complete ? 'is-complete' : ''} ${current ? 'is-current' : ''} ${queued ? 'is-queued' : ''}`}
            disabled={complete}
            onClick={() => updateState((stateBeforeClick) => setResearchTarget(stateBeforeClick, technology.id))}
          >{technology.name}</button>
        </div>;
      })}
    </div>
    {selectedId ? <article className="m0-tech-detail">
      <h3>{technologyName(selectedId)}</h3>
      <p>{effectText[selectedId]}</p>
    </article> : null}
    <div className="m0-research-queue">
      <h3>科研队列</h3>
      {state.research.manualQueue.length
        ? <ol>{state.research.manualQueue.map((id) => <li key={id} onContextMenu={(event) => {
          event.preventDefault();
          updateState((current) => removeResearchTarget(current, id));
        }} title="右键移出科研队列">{technologyName(id)}</li>)}</ol>
        : <p className="m0-empty-state">等待命令。</p>}
    </div>
  </div>;
}

function ExplorationSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const records = state.map.surveys;
  const selectedCell = state.map.cells.find((cell) => cell.id === state.map.selectedCellId);
  const assembly = state.production.lines.find((line) => line.id === 'survey-drone');
  const statusLabels = { 'needs-charge': '待补能', charging: '过夜补能中', available: '可用', assigned: '执行任务' } as const;
  return <div className="m0-project-list">
    {state.drone ? <article className="m0-equipment-card">
      <div className="m0-project-heading"><h3>{state.drone.name}</h3><span>{statusLabels[state.drone.status]}</span></div>
      <p>{state.drone.assignment === 'ruin-a' ? '工业废墟 A 勘测' : state.drone.assignment === 'ruin-b' ? '工业废墟 B 勘测' : '总部待命'}</p>
      {state.drone.status === 'needs-charge' ? <button type="button" disabled={state.drone.rechargeApproved} onClick={() => updateState(completeDroneRecharge)}>{state.drone.rechargeApproved ? '补能已安排' : '安排补能'}</button> : null}
    </article> : assembly && assembly.progress > 0 ? <article className="m0-equipment-card"><div className="m0-project-heading"><h3>多光谱勘测无人机系统</h3><span>组装中</span></div><div className="m0-progress"><span style={{ width: `${Math.min(100, assembly.progress / assembly.workRequired * 100)}%` }} /></div></article> : null}
    <article className="m0-selected-place"><span>地图所选</span><strong>{selectedCell ? visibleCellTitle(selectedCell) : '未选择'}</strong></article>
    {records.map((record) => {
      const conclusion = surveyConclusion(record.targetId, record.stage);
      const controls = surveyPlanControlState(record);
      const surveyStatus = !record.approved ? '未开始'
        : record.stage === 'site' ? '完成'
          : record.pauseReason === 'player' ? '玩家暂停'
            : record.pauseReason !== null ? '系统暂停'
              : '勘测中';
      const systemPause = record.pauseReason !== null && record.pauseReason !== 'player';
      const pauseReason = record.pauseReason === 'staffing' ? '原因：可工作人口不足；恢复条件：岗位缺口消失'
        : record.pauseReason === 'safety' ? '原因：系统运行保障线；恢复条件：保障量恢复'
          : record.pauseReason === 'route-choice' ? '原因：通路条件未成立'
            : record.pauseReason === 'day-limit' ? '原因：勘测已到停止条件'
              : null;
      return <article className="m0-project-card" key={record.targetId}>
        <div className="m0-project-heading"><h3>{record.targetId === 'ruin-a' ? '工业废墟 A' : '工业废墟 B'}</h3><span>{surveyStatus} · {intelStageName(record.stage)}</span></div>
        {systemPause && pauseReason ? <p className="m0-system-reason">{pauseReason}</p> : null}
        {surveyVisibleFacts(record.targetId, record.stage).map((fact) => <p key={fact}>{fact}</p>)}
        {conclusion ? <p><strong>{conclusion.label}</strong>：{conclusion.reason}</p> : null}
        {controls.editable ? <>
          {controls.needsApproval
            ? <button type="button" onClick={() => updateState((current) => approveSurvey(current, record.targetId))}>开始勘测</button>
            : <>
              <p>进度：{record.workDone}</p>
              <button type="button" disabled={!controls.canTogglePause || systemPause} onClick={() => updateState((current) => setSurveyPaused(current, record.targetId, !record.paused))}>{record.paused ? '继续勘测' : '暂停勘测'}</button>
            </>}
        </> : null}
      </article>;
    })}
  </div>;
}

function ProductionSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const workshopComplete = state.projects.some((project) => project.id === 'repair-precision-workshop' && project.status === 'complete');
  const remanufacturing = state.production.lines.find((line) => line.id === 'common-parts-remanufacturing')!;
  const precision = state.production.lines.find((line) => line.id === 'precision-parts')!;
  const assembly = state.production.lines.find((line) => line.id === 'survey-drone')!;
  const allocated = state.production.lines.reduce((sum, line) => sum + line.allocatedFactories, 0);
  const statusText = (line: typeof precision): string => {
    if (line.blockedReason === 'facility-unavailable') return '等待工坊';
    if (line.blockedReason === 'technology-locked') return '等待科技';
    if (line.blockedReason === 'input-shortage') return '输入不足';
    if (line.blockedReason === 'asset-limit') return '目标已达';
    if (line.allocatedFactories === 0) return '等待命令';
    return `${formatNumber(line.progress)} / ${formatNumber(line.workRequired)}`;
  };
  const canAdd = (line: typeof precision): boolean => (line.id === 'common-parts-remanufacturing'
    ? state.settlement.basicProductionUnits > 0
    : workshopComplete)
    && allocated < state.production.totalFactories
    && line.allocatedFactories < state.production.totalFactories;

  return <div className="m0-production-list">
    <article className={`m0-production-line ${state.settlement.basicProductionUnits > 0 ? '' : 'is-locked'}`}>
      <div className="m0-production-heading"><div><h3>普通零件再制造</h3><small>既存聚居点基础生产场址 → 总部仓库</small></div><strong>3 / 批 / 单元</strong></div>
      <div className="m0-factory-allocation">
        <span>投入生产单元</span>
        <div className="m0-factory-stepper">
          <button type="button" aria-label="减少普通零件再制造生产单元" disabled={remanufacturing.allocatedFactories === 0} onClick={() => updateState((current) => setProductionAllocation(current, remanufacturing.id, remanufacturing.allocatedFactories - 1))}>−</button>
          <b>{remanufacturing.allocatedFactories} / {state.production.totalFactories} 个</b>
          <button type="button" aria-label="增加普通零件再制造生产单元" disabled={!canAdd(remanufacturing)} onClick={() => updateState((current) => setProductionAllocation(current, remanufacturing.id, remanufacturing.allocatedFactories + 1))}>+</button>
        </div>
        <em>{statusText(remanufacturing)}</em>
      </div>
      <dl className="m0-compact-costs"><div><dt>旧可修件</dt><dd>3 / 批 / 单元</dd></div><div><dt>普通零件</dt><dd>+3 / 批 / 单元</dd></div></dl>
    </article>
    <article className={`m0-production-line ${workshopComplete ? '' : 'is-locked'}`}>
      <div className="m0-production-heading"><div><h3>精密部件</h3><small>总部精密工坊 → 总部仓库</small></div><strong>4 / 批</strong></div>
      <div className="m0-factory-allocation">
        <span>投入工厂</span>
        <div className="m0-factory-stepper">
          <button type="button" aria-label="减少精密部件生产工厂" disabled={precision.allocatedFactories === 0} onClick={() => updateState((current) => setProductionAllocation(current, precision.id, precision.allocatedFactories - 1))}>−</button>
          <b>{precision.allocatedFactories} / {state.production.totalFactories} 座</b>
          <button type="button" aria-label="增加精密部件生产工厂" disabled={!canAdd(precision)} onClick={() => updateState((current) => setProductionAllocation(current, precision.id, precision.allocatedFactories + 1))}>+</button>
        </div>
        <em>{statusText(precision)}</em>
      </div>
      <dl className="m0-compact-costs"><div><dt>普通零件</dt><dd>2</dd></div><div><dt>工程构件</dt><dd>4</dd></div><div><dt>合金料</dt><dd>4</dd></div></dl>
    </article>
    <article className={`m0-production-line ${state.research.completed.includes('adapt-survey-drone') ? '' : 'is-locked'}`}>
      <div className="m0-production-heading"><div><h3>多光谱勘测无人机系统</h3><small>总部精密工坊 → 总部</small></div><strong>1 / 批</strong></div>
      <div className="m0-factory-allocation">
        <span>投入工厂</span>
        <div className="m0-factory-stepper">
          <button type="button" aria-label="减少无人机组装工厂" disabled={assembly.allocatedFactories === 0} onClick={() => updateState((current) => setProductionAllocation(current, assembly.id, assembly.allocatedFactories - 1))}>−</button>
          <b>{assembly.allocatedFactories} / {state.production.totalFactories} 座</b>
          <button type="button" aria-label="增加无人机组装工厂" disabled={!canAdd(assembly)} onClick={() => updateState((current) => setProductionAllocation(current, assembly.id, assembly.allocatedFactories + 1))}>+</button>
        </div>
        <em>{statusText(assembly)}</em>
      </div>
      <dl className="m0-compact-costs"><div><dt>普通零件</dt><dd>3</dd></div><div><dt>工程构件</dt><dd>10</dd></div><div><dt>合金料</dt><dd>8</dd></div><div><dt>精密部件</dt><dd>2</dd></div></dl>
    </article>
  </div>;
}

function ArchivesSheet({ state, status, onSave, onLoad, onNew }: {
  state: M0State;
  status: string | null;
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
}): ReactElement {
  return <>
    <div className="m0-log-list">
      {state.events.length === 0 ? <p className="m0-empty-state">目前没有事件记录。</p> : state.events.slice().reverse().map((event) => <article key={event.id}>
        <time>{formatDate(event.date)}</time>
        <p>{event.message}</p>
      </article>)}
    </div>
    <div className="m0-archive-actions">
      <button type="button" onClick={onSave}>保存</button>
      <button type="button" onClick={onLoad}>读取</button>
      <button type="button" onClick={onNew}>新档</button>
    </div>
    <p className="m0-save-status" aria-live="polite">{status ?? ''}</p>
  </>;
}

function SystemSheet({
  sheet,
  state,
  archiveStatus,
  updateState,
  onClose,
  onSave,
  onLoad,
  onNew,
}: {
  sheet: SheetId;
  state: M0State;
  archiveStatus: string | null;
  updateState: (updater: (current: M0State) => M0State) => void;
  onClose: () => void;
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
}): ReactElement {
  const title = sheetEntries.find((entry) => entry.id === sheet)?.label ?? '';
  return <aside className="m0-system-sheet" aria-label={`${title}面板`}>
    <header>
      <h2>{title}</h2>
      <button type="button" aria-label={`关闭${title}`} title={`关闭${title}`} onClick={onClose}>×</button>
    </header>
    <div className="m0-sheet-content">
      {sheet === 'headquarters' ? <HeadquartersSheet state={state} updateState={updateState} /> : null}
      {sheet === 'research' ? <ResearchSheet state={state} updateState={updateState} /> : null}
      {sheet === 'exploration' ? <ExplorationSheet state={state} updateState={updateState} /> : null}
      {sheet === 'engineering' ? <EngineeringSheet state={state} updateState={updateState} /> : null}
      {sheet === 'production' ? <ProductionSheet state={state} updateState={updateState} /> : null}
      {sheet === 'archives' ? <ArchivesSheet
        state={state}
        status={archiveStatus}
        onSave={onSave}
        onLoad={onLoad}
        onNew={onNew}
      /> : null}
    </div>
  </aside>;
}

interface DragState {
  pointerId: number;
  offsetX: number;
  offsetY: number;
}

interface PixelPosition {
  left: number;
  top: number;
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.max(minimum, Math.min(maximum, value));
}

function EventWindow({
  containerRef,
  events,
  savedPosition,
  onPositionCommit,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  events: M0Event[];
  savedPosition: EventWindowPosition;
  onPositionCommit: (position: EventWindowPosition) => void;
}): ReactElement {
  const panelRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const cleanupDragRef = useRef<(() => void) | null>(null);
  const pendingPositionRef = useRef<PixelPosition | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const [position, setPosition] = useState<PixelPosition>({ left: 0, top: 0 });

  const bounds = (): { maxLeft: number; maxTop: number } => {
    const container = containerRef.current;
    const panel = panelRef.current;
    return {
      maxLeft: Math.max(0, (container?.clientWidth ?? 0) - (panel?.offsetWidth ?? 0) - 8),
      maxTop: Math.max(0, (container?.clientHeight ?? 0) - (panel?.offsetHeight ?? 0) - 8),
    };
  };

  const fromRatio = (): PixelPosition => {
    const { maxLeft, maxTop } = bounds();
    return {
      left: savedPosition.xRatio * maxLeft,
      top: savedPosition.yRatio * maxTop,
    };
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;
    let resizeTimer: number | null = null;
    const synchronizePosition = (): void => {
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => setPosition(fromRatio()), 50);
    };
    const observer = new ResizeObserver(synchronizePosition);
    observer.observe(container);
    if (panelRef.current) observer.observe(panelRef.current);
    setPosition(fromRatio());
    return () => {
      observer.disconnect();
      if (resizeTimer !== null) window.clearTimeout(resizeTimer);
    };
  }, [containerRef, savedPosition.xRatio, savedPosition.yRatio]);

  useEffect(() => () => {
    cleanupDragRef.current?.();
    if (animationFrameRef.current !== null) window.cancelAnimationFrame(animationFrameRef.current);
  }, []);

  const pointFromClient = (clientX: number, clientY: number): PixelPosition => {
    const container = containerRef.current;
    const drag = dragRef.current;
    if (!container || !drag) return position;
    const rectangle = container.getBoundingClientRect();
    const { maxLeft, maxTop } = bounds();
    return {
      left: clamp(clientX - rectangle.left - drag.offsetX, 0, maxLeft),
      top: clamp(clientY - rectangle.top - drag.offsetY, 0, maxTop),
    };
  };

  const onPointerDown = (event: ReactPointerEvent<HTMLElement>): void => {
    const panel = panelRef.current;
    if (!panel) return;
    cleanupDragRef.current?.();
    const rectangle = panel.getBoundingClientRect();
    dragRef.current = {
      pointerId: event.pointerId,
      offsetX: event.clientX - rectangle.left,
      offsetY: event.clientY - rectangle.top,
    };

    const removeWindowListeners = (): void => {
      window.removeEventListener('pointermove', moveDrag, true);
      window.removeEventListener('pointerup', finishDrag, true);
      window.removeEventListener('pointercancel', finishDrag, true);
      cleanupDragRef.current = null;
    };
    const moveDrag = (moveEvent: PointerEvent): void => {
      if (dragRef.current?.pointerId !== moveEvent.pointerId) return;
      pendingPositionRef.current = pointFromClient(moveEvent.clientX, moveEvent.clientY);
      if (animationFrameRef.current !== null) return;
      animationFrameRef.current = window.requestAnimationFrame(() => {
        animationFrameRef.current = null;
        if (pendingPositionRef.current) setPosition(pendingPositionRef.current);
      });
    };
    const finishDrag = (finishEvent: PointerEvent): void => {
      if (dragRef.current?.pointerId !== finishEvent.pointerId) return;
      const finalPosition = pointFromClient(finishEvent.clientX, finishEvent.clientY);
      dragRef.current = null;
      pendingPositionRef.current = null;
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setPosition(finalPosition);
      const { maxLeft, maxTop } = bounds();
      onPositionCommit({
        xRatio: maxLeft > 0 ? finalPosition.left / maxLeft : 0,
        yRatio: maxTop > 0 ? finalPosition.top / maxTop : 0,
      });
      removeWindowListeners();
    };

    cleanupDragRef.current = removeWindowListeners;
    window.addEventListener('pointermove', moveDrag, true);
    window.addEventListener('pointerup', finishDrag, true);
    window.addEventListener('pointercancel', finishDrag, true);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLElement>): void => {
    const step = 0.04;
    let next = savedPosition;
    if (event.key === 'ArrowLeft') next = { ...savedPosition, xRatio: savedPosition.xRatio - step };
    else if (event.key === 'ArrowRight') next = { ...savedPosition, xRatio: savedPosition.xRatio + step };
    else if (event.key === 'ArrowUp') next = { ...savedPosition, yRatio: savedPosition.yRatio - step };
    else if (event.key === 'ArrowDown') next = { ...savedPosition, yRatio: savedPosition.yRatio + step };
    else return;

    event.preventDefault();
    onPositionCommit({
      xRatio: clamp(next.xRatio, 0, 1),
      yRatio: clamp(next.yRatio, 0, 1),
    });
  };

  const style: CSSProperties = {
    transform: `translate3d(${position.left}px, ${position.top}px, 0)`,
  };

  return <aside className="m0-event-window" ref={panelRef} style={style} aria-label="事件">
    <header
      className="m0-event-handle"
      role="button"
      tabIndex={0}
      aria-label="移动事件窗，使用方向键调整位置"
      title="拖动或使用方向键移动事件窗"
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
    >
      <h2>事件</h2>
      <span aria-hidden="true">⠿</span>
    </header>
    <div className="m0-event-list">
      {events.length === 0 ? <p className="m0-empty-state">目前没有已记录事件。</p> : events.slice().reverse().map((event) => <article key={event.id}>
        <time>{formatDate(event.date)}</time>
        <p>{event.message}</p>
      </article>)}
    </div>
  </aside>;
}

function MapStage({
  state,
  events,
  eventWindow,
  activeSheet,
  onPositionCommit,
  onSelectCell,
}: {
  state: M0State;
  events: M0Event[];
  eventWindow: EventWindowPosition;
  activeSheet: SheetId | null;
  onPositionCommit: (position: EventWindowPosition) => void;
  onSelectCell: (cellId: string) => void;
}): ReactElement {
  const mapRef = useRef<HTMLDivElement>(null);
  const [camera, setCamera] = useState<RegionCamera>({ x: 0, y: 0, zoom: 1 });
  const dragRef = useRef<{ pointerId: number; x: number; y: number; camera: RegionCamera; moved: boolean } | null>(null);
  const suppressCellClickRef = useRef(false);
  const pendingCameraRef = useRef<RegionCamera | null>(null);
  const cameraTimerRef = useRef<number | null>(null);
  const projectedCells = projectRegionMap(state.map.cells);
  const projected = new Map(projectedCells.map((cell) => [cell.id, cell]));
  const taskGridVisible = activeSheet === 'exploration' || activeSheet === 'engineering';
  const workshopComplete = state.projects.some((project) => project.id === 'repair-precision-workshop' && project.status === 'complete');
  const basicIndustryComplete = state.projects.some((project) => project.id === 'opening-basic-industry' && project.status === 'complete');
  const settlementServed = state.settlement.status === 'served';
  const mapTransform = `translate(${REGION_MAP.worldWidth / 2 + camera.x} ${REGION_MAP.worldHeight / 2 + camera.y}) scale(${camera.zoom}) translate(${-REGION_MAP.worldWidth / 2} ${-REGION_MAP.worldHeight / 2})`;

  const pointFor = (cellId: string): { x: number; y: number } => {
    const cell = state.map.cells.find((candidate) => candidate.id === cellId);
    return cell ? regionPoint(cell.q, cell.r) : { x: REGION_MAP.worldWidth / 2, y: REGION_MAP.worldHeight / 2 };
  };
  const axialDistance = (leftId: string, rightId: string): number => {
    const left = state.map.cells.find((cell) => cell.id === leftId);
    const right = state.map.cells.find((cell) => cell.id === rightId);
    if (!left || !right) return Number.POSITIVE_INFINITY;
    return Math.max(Math.abs(left.q - right.q), Math.abs(left.r - right.r), Math.abs((left.q + left.r) - (right.q + right.r)));
  };
  const gridRelevant = (cellId: string): boolean => {
    if (activeSheet === 'exploration') {
      return axialDistance(cellId, LOCATION_CELLS.ruinA) <= 3
        || axialDistance(cellId, LOCATION_CELLS.ruinB) <= 3
        || state.map.routes.some((route) => route.cellIds.includes(cellId));
    }
    if (activeSheet === 'engineering') {
      const anchor = state.map.selectedCellId ?? LOCATION_CELLS.headquarters;
      return axialDistance(cellId, anchor) <= 4;
    }
    return false;
  };

  useEffect(() => () => {
    if (cameraTimerRef.current !== null) window.clearTimeout(cameraTimerRef.current);
  }, []);

  const flushCamera = (): void => {
    if (cameraTimerRef.current !== null) window.clearTimeout(cameraTimerRef.current);
    cameraTimerRef.current = null;
    const next = pendingCameraRef.current;
    pendingCameraRef.current = null;
    if (next) setCamera(normalizeRegionCamera(next));
  };

  const scheduleCamera = (next: RegionCamera): void => {
    pendingCameraRef.current = normalizeRegionCamera(next);
    if (cameraTimerRef.current !== null) return;
    cameraTimerRef.current = window.setTimeout(flushCamera, 50);
  };

  const onMapPointerDown = (event: ReactPointerEvent<SVGSVGElement>): void => {
    if (event.button !== 0) return;
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      camera: { ...camera },
      moved: false,
    };
  };

  const onMapPointerMove = (event: ReactPointerEvent<SVGSVGElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (!drag.moved && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 3) {
      drag.moved = true;
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    const bounds = event.currentTarget.getBoundingClientRect();
    scheduleCamera({
      ...drag.camera,
      x: drag.camera.x + (event.clientX - drag.x) * REGION_MAP.worldWidth / bounds.width,
      y: drag.camera.y + (event.clientY - drag.y) * REGION_MAP.worldHeight / bounds.height,
    });
  };

  const onMapPointerEnd = (event: ReactPointerEvent<SVGSVGElement>): void => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    suppressCellClickRef.current = drag.moved;
    dragRef.current = null;
    flushCamera();
    window.setTimeout(() => { suppressCellClickRef.current = false; }, 0);
  };

  const onMapWheel = (event: ReactWheelEvent<SVGSVGElement>): void => {
    event.preventDefault();
    const bounds = event.currentTarget.getBoundingClientRect();
    const localX = (event.clientX - bounds.left) * REGION_MAP.worldWidth / bounds.width;
    const localY = (event.clientY - bounds.top) * REGION_MAP.worldHeight / bounds.height;
    const nextZoom = Math.max(1, Math.min(2.6, camera.zoom * (event.deltaY < 0 ? 1.12 : 0.89)));
    const centerX = REGION_MAP.worldWidth / 2;
    const centerY = REGION_MAP.worldHeight / 2;
    const worldX = (localX - centerX - camera.x) / camera.zoom + centerX;
    const worldY = (localY - centerY - camera.y) / camera.zoom + centerY;
    scheduleCamera({
      zoom: nextZoom,
      x: localX - centerX - (worldX - centerX) * nextZoom,
      y: localY - centerY - (worldY - centerY) * nextZoom,
    });
  };

  const onMapKeyDown = (event: ReactKeyboardEvent<SVGSVGElement>): void => {
    const step = 34;
    const next = event.key === 'ArrowLeft' ? { ...camera, x: camera.x + step }
      : event.key === 'ArrowRight' ? { ...camera, x: camera.x - step }
        : event.key === 'ArrowUp' ? { ...camera, y: camera.y + step }
          : event.key === 'ArrowDown' ? { ...camera, y: camera.y - step }
            : event.key === '+' || event.key === '=' ? { ...camera, zoom: camera.zoom * 1.12 }
              : event.key === '-' ? { ...camera, zoom: camera.zoom * 0.89 }
                : event.key === 'Home' ? { x: 0, y: 0, zoom: 1 } : null;
    if (!next) return;
    event.preventDefault();
    scheduleCamera(next);
  };

  return <section className="m0-map-stage" ref={mapRef} aria-label="地图">
    <div className="m0-region-frame">
      <svg
        className="m0-region-map"
        viewBox={`0 0 ${REGION_MAP.worldWidth} ${REGION_MAP.worldHeight}`}
        aria-label="地图"
        tabIndex={0}
        onPointerDown={onMapPointerDown}
        onPointerMove={onMapPointerMove}
        onPointerUp={onMapPointerEnd}
        onPointerCancel={onMapPointerEnd}
        onWheel={onMapWheel}
        onKeyDown={onMapKeyDown}
      >
        <defs>
          <linearGradient id="m0-ground" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#64735d" /><stop offset="0.52" stopColor="#596a55" /><stop offset="1" stopColor="#4e5d4f" /></linearGradient>
          <linearGradient id="m0-highland" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#68715f" /><stop offset="1" stopColor="#3f4a43" /></linearGradient>
          <pattern id="m0-fields" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(14)"><rect width="22" height="22" fill="#7d8253" /><path d="M0 5H22M0 15H22" stroke="#a09963" strokeWidth="3" opacity="0.45" /></pattern>
          <filter id="m0-soft"><feGaussianBlur stdDeviation="8" /></filter>
        </defs>
        <g className="m0-region-world" transform={mapTransform}>
          <rect width={REGION_MAP.worldWidth} height={REGION_MAP.worldHeight} fill="url(#m0-ground)" />
          <path className="m0-terrain-highland" d="M0 0H1200V120C1060 154 968 116 828 174C710 224 652 185 552 142C408 80 304 173 190 205C105 229 46 195 0 171Z" fill="url(#m0-highland)" />
          <path className="m0-terrain-ridge" d="M0 83C170 125 228 76 370 101S613 219 766 151S996 78 1200 126" />
          <path className="m0-terrain-forest" d="M55 212C181 162 298 199 355 284C287 331 178 343 74 304Z" />
          <path className="m0-terrain-forest is-east" d="M911 178C1021 132 1137 168 1200 238V366C1100 341 984 312 911 178Z" />
          <path className="m0-field-area" d="M290 432C385 388 475 420 505 507C442 558 338 568 260 511Z" fill="url(#m0-fields)" />
          <path className="m0-river-bank" d="M42 586C202 524 292 566 414 505S632 393 742 423S929 532 1169 446" />
          <path className="m0-river" d="M42 586C202 524 292 566 414 505S632 393 742 423S929 532 1169 446" />
          <path className="m0-road is-external" d="M89 463C252 447 367 416 526 379S851 320 1178 286" />
          <path className="m0-road" d="M478 380C535 413 579 436 643 438S768 398 866 320" />
          <path className="m0-water-line" d="M507 363C474 394 445 433 418 497" />
          <path className="m0-control-area" d="M362 287C483 225 667 246 749 354C809 433 752 528 633 557C486 592 341 509 324 410C315 357 326 313 362 287Z" />
          <g className="m0-unknown-regions" aria-hidden="true">
            <path d="M0 0H1200V138C1051 165 994 136 864 181C724 230 642 193 548 153C394 87 270 183 155 203C88 215 36 190 0 172Z" />
            <path d="M0 0V760H247C219 647 222 548 264 454C320 330 264 234 155 203C88 183 38 151 0 116Z" />
            <path d="M1200 0V760H957C1018 651 1005 560 944 482C876 393 882 281 963 214C1038 153 1124 168 1200 137Z" />
            <path d="M0 760H1200V625C1040 599 929 622 819 651C661 692 510 641 357 635C211 629 111 661 0 697Z" />
          </g>
          {taskGridVisible ? <g className="m0-task-grid" data-task-grid={activeSheet ?? undefined}>
            {state.map.cells.filter((cell) => gridRelevant(cell.id)).map((cell) => {
              const position = projected.get(cell.id);
              if (!position) return null;
              return <polygon
                key={cell.id}
                className={`m0-task-cell is-${visibleCellClass(cell)} ${state.map.selectedCellId === cell.id ? 'is-selected' : ''}`}
                points={position.points}
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (suppressCellClickRef.current) return;
                  onSelectCell(cell.id);
                }}
                onKeyDown={(event) => {
                  if (event.key !== 'Enter' && event.key !== ' ') return;
                  event.preventDefault();
                  onSelectCell(cell.id);
                }}
                aria-label={visibleCellTitle(cell)}
              ><title>{visibleCellTitle(cell)}</title></polygon>;
            })}
          </g> : null}
          <g className="m0-settlement-area" transform={`translate(${pointFor(LOCATION_CELLS.openingSettlement).x} ${pointFor(LOCATION_CELLS.openingSettlement).y})`}>
            <ellipse rx="78" ry="52" />
            {[-44, -20, 4, 28, 48].map((x, index) => <path key={x} d={`M${x - 9} ${index % 2 === 0 ? -12 : 12}h18v13h-18z`} />)}
          </g>
          <g className={`m0-site is-settlement ${state.map.selectedCellId === LOCATION_CELLS.openingSettlement ? 'is-selected' : ''}`} data-site-id="opening-settlement-01" transform={`translate(${pointFor(LOCATION_CELLS.openingSettlement).x} ${pointFor(LOCATION_CELLS.openingSettlement).y})`} onPointerUp={() => onSelectCell(LOCATION_CELLS.openingSettlement)}>
            <circle r="7" /><text x="0" y="-62">既存聚居点</text>
          </g>
          <g className={`m0-site is-headquarters ${state.map.selectedCellId === LOCATION_CELLS.headquarters ? 'is-selected' : ''}`} data-site-id="headquarters" transform={`translate(${pointFor(LOCATION_CELLS.headquarters).x} ${pointFor(LOCATION_CELLS.headquarters).y})`} onPointerUp={() => onSelectCell(LOCATION_CELLS.headquarters)}>
            <path d="M-21 12V-4L-12-16H12L21-4V12Z" /><path className="m0-site-detail" d="M-8 12V1H8V12M-14-6H14" /><text x="18" y="-30">总部</text>
          </g>
          <g className={`m0-site is-water ${state.map.selectedCellId === LOCATION_CELLS.waterworks ? 'is-selected' : ''}`} data-site-id="waterworks" transform={`translate(${pointFor(LOCATION_CELLS.waterworks).x} ${pointFor(LOCATION_CELLS.waterworks).y})`} onPointerUp={() => onSelectCell(LOCATION_CELLS.waterworks)}>
            <circle r="12" /><path d="M0-8C8 1 9 5 0 10C-9 5-8 1 0-8Z" /><text x="-46" y="-26">水源与旧供水设施</text>
          </g>
          <g className={`m0-site is-food ${state.map.selectedCellId === LOCATION_CELLS.foodSite ? 'is-selected' : ''}`} data-site-id="food-site" transform={`translate(${pointFor(LOCATION_CELLS.foodSite).x} ${pointFor(LOCATION_CELLS.foodSite).y})`} onPointerUp={() => onSelectCell(LOCATION_CELLS.foodSite)}>
            <path d="M-14 9C-9-10 2-14 14-8C10 7 1 13-14 9Z" /><path className="m0-site-detail" d="M-8 7L9-7" /><text x="-22" y="31">附近食物点</text>
          </g>
          <g className="m0-site is-storage" data-site-id="headquarters-storage" transform={`translate(${pointFor(LOCATION_CELLS.headquarters).x + 42} ${pointFor(LOCATION_CELLS.headquarters).y + 32})`}>
            <path d="M-15 11V-7L0-14L15-7V11Z" /><text x="30" y="29">总部仓库</text>
          </g>
          <g className={`m0-site is-workshop ${workshopComplete ? 'is-active' : 'is-inactive'}`} data-site-id="precision-workshop" transform={`translate(${pointFor(LOCATION_CELLS.headquarters).x - 45} ${pointFor(LOCATION_CELLS.headquarters).y + 34})`}>
            <path d="M-17 11V-9L-5-2L4-9L17-2V11Z" /><text x="-28" y="31">总部精密工坊</text>
          </g>
          <g className={`m0-site is-industry ${basicIndustryComplete ? 'is-active' : 'is-inactive'}`} data-site-id="opening-basic-industry" transform={`translate(${pointFor(LOCATION_CELLS.openingSettlement).x + 67} ${pointFor(LOCATION_CELLS.openingSettlement).y + 37})`}>
            <path d="M-15 10V-7L-5-1L4-7L15-1V10Z" />
          </g>
          {[['ruin-a', LOCATION_CELLS.ruinA, '工业废墟 A'], ['ruin-b', LOCATION_CELLS.ruinB, '工业废墟 B']].map(([id, cellId, label]) => {
            const point = pointFor(cellId);
            const cell = state.map.cells.find((candidate) => candidate.id === cellId);
            return <g key={id} className={`m0-site is-ruin ${cell?.intel === 'unknown' ? 'is-unknown' : ''} ${state.map.selectedCellId === cellId ? 'is-selected' : ''}`} data-site-id={id} transform={`translate(${point.x} ${point.y})`} onPointerUp={() => onSelectCell(cellId)}>
              <path d="M-20 12V-8L-10-14L-3-6L7-17L20-7V12Z" /><path className="m0-site-detail" d="M-14-2L14 7M-4-9L10 12" /><text x="0" y="-24">{label}</text>
            </g>;
          })}
          <path className="m0-external-gate" d="M1137 271L1175 286L1137 301" />
          <text className="m0-road-label" x="1085" y="270">旧路</text>
        </g>
      </svg>
      <div className="m0-map-controls">
        <button type="button" aria-label="缩小" onClick={() => scheduleCamera({ ...camera, zoom: camera.zoom * 0.89 })}>−</button>
        <button type="button" aria-label="放大" onClick={() => scheduleCamera({ ...camera, zoom: camera.zoom * 1.12 })}>+</button>
        <button type="button" className="m0-map-reset" onClick={() => scheduleCamera({ x: 0, y: 0, zoom: 1 })}>恢复总部视角</button>
      </div>
    </div>
    <EventWindow
      containerRef={mapRef}
      events={events}
      savedPosition={eventWindow}
      onPositionCommit={onPositionCommit}
    />
  </section>;
}

export function M0App(): ReactElement {
  const [state, setState] = useState<M0State>(() => loadM0State());
  const [activeSheet, setActiveSheet] = useState<SheetId | null>(null);
  const [populationDelta, setPopulationDelta] = useState<number | null>(null);
  const [archiveStatus, setArchiveStatus] = useState<string | null>(null);
  const previousPopulationRef = useRef(displayedPopulation(state));

  useEffect(() => {
    if (!state.clock.running) return undefined;
    const timer = window.setInterval(() => {
      setState((current) => advanceRealTime(current, 1_000));
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [state.clock.running]);

  const living = displayedPopulation(state);
  useEffect(() => {
    const difference = living - previousPopulationRef.current;
    previousPopulationRef.current = living;
    if (difference !== 0) setPopulationDelta(difference);
  }, [living]);

  useEffect(() => {
    if (populationDelta === null) return undefined;
    const timer = window.setTimeout(() => setPopulationDelta(null), 3_000);
    return () => window.clearTimeout(timer);
  }, [populationDelta]);

  const updateState = (updater: (current: M0State) => M0State): void => {
    setArchiveStatus(null);
    setState(updater);
  };

  const replaceStateWithoutPopulationPulse = (next: M0State): void => {
    previousPopulationRef.current = displayedPopulation(next);
    setPopulationDelta(null);
    setArchiveStatus(null);
    setState(next);
  };

  const save = (): void => {
    saveM0State(state);
    setArchiveStatus('已保存。');
  };

  const load = (): void => {
    replaceStateWithoutPopulationPulse(loadM0State());
    setArchiveStatus('已读取。');
  };

  const fresh = (): void => {
    clearM0State();
    replaceStateWithoutPopulationPulse(createInitialM0State());
    setArchiveStatus('已建立新档。');
  };

  const commitEventPosition = (position: EventWindowPosition): void => {
    setState((current) => {
      const next = setEventWindowPosition(current, position);
      saveM0State(next);
      return next;
    });
  };

  return <main className="m0-app">
    <TopBar
      state={state}
      populationDelta={populationDelta}
      onPause={() => updateState((current) => setRunning(current, false))}
      onSpeed={(speed) => updateState((current) => setRunning(setGameSpeed(current, speed), true))}
    />
    <div className="m0-workspace">
      <SystemRail
        activeSheet={activeSheet}
        onSelect={(sheet) => setActiveSheet((current) => current === sheet ? null : sheet)}
      />
      <MapStage
        state={state}
        events={state.events}
        eventWindow={state.ui.eventWindow}
        activeSheet={activeSheet}
        onPositionCommit={commitEventPosition}
        onSelectCell={(cellId) => updateState((current) => selectMapCell(current, cellId))}
      />
      {activeSheet ? <SystemSheet
        sheet={activeSheet}
        state={state}
        archiveStatus={archiveStatus}
        updateState={updateState}
        onClose={() => setActiveSheet(null)}
        onSave={save}
        onLoad={load}
        onNew={fresh}
      /> : null}
    </div>
  </main>;
}
