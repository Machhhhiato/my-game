import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type RefObject,
} from 'react';
import { clearM0State, loadM0State, saveM0State } from './save';
import {
  advanceRealTime,
  availableAmount,
  setDailyMode,
  setGameSpeed,
  approveCapabilityProject,
  approveSurvey,
  configureSurvey,
  completeDroneRecharge,
  selectSurveyRoute,
  selectMapCell,
  setResearchDomainAutomatic,
  setResearchFacilityEnabled,
  setResearchFacilityOpenPositions,
  setResearchMode,
  setResearchTarget,
  setSurveyPaused,
  setRunning,
} from './simulation';
import {
  createInitialM0State,
  livingPopulation,
  MODE_STAFF,
  setEventWindowPosition,
  setMapRotation,
} from './state';
import {
  RESOURCE_IDS,
  type DailyLineId,
  type EventWindowPosition,
  type GameSpeed,
  type MapRotation,
  type M0Event,
  type M0State,
  type Project,
  type ResourceId,
  type WorkMode,
} from './types';
import { intelStageName, projectSphericalLocalWindow, routeForTarget, surveyConclusion, surveyPlanControlState, surveyVisibleFacts, visibleCellClass, visibleCellTitle } from './map';
import { technologies, technologyName } from './progression';
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

const modes: WorkMode[] = ['minimum', 'standard', 'accelerated'];

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
    <div className="m0-population" aria-label={`存活人口 ${livingPopulation(state)}`}>
      <span aria-hidden="true">♟</span>
      <span>人口</span>
      <strong>{livingPopulation(state)}</strong>
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

function WorkerSlots({ open, staffed, maximum }: { open: number; staffed: number; maximum: number }): ReactElement {
  return <div className="m0-worker-slots" aria-label={`${staffed} 人到岗，开放 ${open} 个岗位，上限 ${maximum}`}>
    {Array.from({ length: maximum }, (_, index) => <span
      className={`m0-worker-slot ${index < staffed ? 'is-staffed' : ''} ${index >= open ? 'is-closed' : ''}`}
      aria-hidden="true"
      key={index}
    />)}
  </div>;
}

function HeadquartersSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const workforce = state.workforce;
  const lineBuildings: Array<{ line: DailyLineId; name: string; location: string }> = [
    { line: 'water', name: '总部供水站', location: '总部' },
    { line: 'food', name: '食物保障点', location: '总部' },
    { line: 'maintenance', name: '维护手工作坊', location: '总部' },
    { line: 'logistics', name: '短途运输站', location: '总部' },
  ];
  const changeLinePositions = (line: DailyLineId, direction: -1 | 1): void => {
    const currentIndex = modes.indexOf(state.dailyModes[line]);
    const nextMode = modes[Math.max(0, Math.min(modes.length - 1, currentIndex + direction))];
    updateState((current) => setDailyMode(current, line, nextMode));
  };
  const currentResearch = state.research.currentProjectId
    ? state.projects.find((project) => project.id === state.research.currentProjectId)
    : null;
  let unassignedResearchers = currentResearch?.staffing.actual ?? 0;

  return <div className="m0-facility-list">
    {lineBuildings.map(({ line, name, location }) => {
      const open = MODE_STAFF[line][state.dailyModes[line]];
      const maximum = MODE_STAFF[line].accelerated;
      const staffed = state.workforce[line];
      return <article className="m0-facility-row" key={line}>
        <div className="m0-facility-heading">
          <div><h3>{name}</h3><small>{location}</small></div>
          <div className="m0-position-stepper">
            <button type="button" aria-label={`减少${name}岗位`} disabled={state.dailyModes[line] === 'minimum'} onClick={() => changeLinePositions(line, -1)}>−</button>
            <strong>{staffed} / {open}</strong>
            <button type="button" aria-label={`增加${name}岗位`} disabled={state.dailyModes[line] === 'accelerated'} onClick={() => changeLinePositions(line, 1)}>+</button>
          </div>
        </div>
        <WorkerSlots open={open} staffed={staffed} maximum={maximum} />
      </article>;
    })}
    {state.research.facilities.map((facility) => {
      const staffed = facility.enabled ? Math.min(facility.openPositions, unassignedResearchers) : 0;
      unassignedResearchers -= staffed;
      return <article className={`m0-facility-row ${facility.enabled ? '' : 'is-disabled'}`} key={facility.id}>
        <div className="m0-facility-heading">
          <div><h3>{facility.name}</h3><small>总部避难所</small></div>
          <div className="m0-position-stepper">
            <button
              type="button"
              className={facility.enabled ? 'm0-power is-active' : 'm0-power'}
              aria-label={facility.enabled ? `停用${facility.name}` : `启用${facility.name}`}
              aria-pressed={facility.enabled}
              onClick={() => updateState((current) => setResearchFacilityEnabled(current, facility.id, !facility.enabled))}
            >⏻</button>
            <button type="button" aria-label={`减少${facility.name}岗位`} disabled={facility.openPositions === 0} onClick={() => updateState((current) => setResearchFacilityOpenPositions(current, facility.id, facility.openPositions - 1))}>−</button>
            <strong>{staffed} / {facility.openPositions}</strong>
            <button type="button" aria-label={`增加${facility.name}岗位`} disabled={facility.openPositions === facility.capacity} onClick={() => updateState((current) => setResearchFacilityOpenPositions(current, facility.id, facility.openPositions + 1))}>+</button>
          </div>
        </div>
        <WorkerSlots open={facility.openPositions} staffed={staffed} maximum={facility.capacity} />
      </article>;
    })}
    <dl className="m0-workforce-summary">
      <div><dt>可工作</dt><dd>{workforce.workable}</dd></div>
      <div><dt>基本值守</dt><dd>{workforce.basicDuty}</dd></div>
      <div><dt>工程与科研</dt><dd>{workforce.workable - workforce.basicDuty - workforce.water - workforce.food - workforce.maintenance - workforce.logistics - workforce.standby - workforce.development}</dd></div>
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
    {view === 'build' && !workshopAvailable ? <p className="m0-empty-state">没有新的工程可建。</p> : null}
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
  const enableAutomaticResearch = (): void => updateState((current) => {
    let next = current;
    for (const domain of ['manufacturing', 'surveying', 'engineering'] as const) {
      next = setResearchDomainAutomatic(next, domain, true);
    }
    return setResearchMode(next, 'automatic');
  });
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
      <button type="button" className={state.research.mode === 'automatic' ? 'is-active' : ''} aria-pressed={state.research.mode === 'automatic'} onClick={enableAutomaticResearch}>自动</button>
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
        ? <ol>{state.research.manualQueue.map((id) => <li key={id}>{technologyName(id)}</li>)}</ol>
        : <p className="m0-empty-state">队列为空。</p>}
    </div>
  </div>;
}

function ExplorationSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const records = state.map.surveys;
  const selectedCell = state.map.cells.find((cell) => cell.id === state.map.selectedCellId);
  const assembly = state.projects.find((project) => project.id === 'assemble-survey-drone' && project.status !== 'complete');
  const statusLabels = { 'needs-charge': '待补能', charging: '过夜补能中', available: '可用', assigned: '执行任务' } as const;
  return <div className="m0-project-list">
    {state.drone ? <article className="m0-equipment-card">
      <div className="m0-project-heading"><h3>{state.drone.name}</h3><span>{statusLabels[state.drone.status]}</span></div>
      <p>{state.drone.assignment === 'ruin-a' ? '工业废墟 A 勘测' : state.drone.assignment === 'ruin-b' ? '工业废墟 B 勘测' : '总部待命'}</p>
      {state.drone.status === 'needs-charge' ? <button type="button" disabled={state.drone.rechargeApproved} onClick={() => updateState(completeDroneRecharge)}>{state.drone.rechargeApproved ? '补能已安排' : '安排补能'}</button> : null}
    </article> : assembly ? <article className="m0-equipment-card"><div className="m0-project-heading"><h3>多光谱勘测无人机系统</h3><span>组装中</span></div><div className="m0-progress"><span style={{ width: `${Math.min(100, assembly.workDone / assembly.workRequired * 100)}%` }} /></div></article> : null}
    <article className="m0-selected-place"><span>地图所选</span><strong>{selectedCell ? visibleCellTitle(selectedCell) : '未选择'}</strong></article>
    {records.map((record) => {
      const conclusion = surveyConclusion(record.targetId, record.stage);
      const route = routeForTarget(state.map, record.targetId);
      const controls = surveyPlanControlState(record);
      return <article className="m0-project-card" key={record.targetId}>
        <div className="m0-project-heading"><h3>{record.targetId === 'ruin-a' ? '工业废墟 A' : '工业废墟 B'}</h3><span>{intelStageName(record.stage)}</span></div>
        {surveyVisibleFacts(record.targetId, record.stage).map((fact) => <p key={fact}>{fact}</p>)}
        {conclusion ? <p><strong>{conclusion.label}</strong>：{conclusion.reason}</p> : null}
        {controls.editable ? <>
          <label className="m0-command-control"><span>勘测人数</span><select value={record.workers} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { workers: Number(event.target.value) as 2 | 4 | 6 }))}><option value={2}>2 人</option><option value={4}>4 人</option><option value={6}>6 人</option></select></label>
          <label className="m0-command-control"><span>优先级</span><select value={record.priority} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { priority: event.target.value as 'P1' | 'P2' | 'P3' }))}><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option></select></label>
          <label className="m0-command-control"><span>最多投入白昼</span><input type="number" min={1} value={record.maximumDays ?? ''} placeholder="不限" onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { maximumDays: event.target.value === '' ? null : Number(event.target.value) }))} /></label>
          <label className="m0-check-row"><span>允许调用无人机</span><input type="checkbox" checked={record.useDrone} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { useDrone: event.target.checked }))} /></label>
          {controls.needsApproval
            ? <button type="button" onClick={() => updateState((current) => approveSurvey(current, record.targetId, record.workers, record.priority, record.maximumDays, record.useDrone))}>开始勘测</button>
            : <>
              <p>投入进度：{record.workDone}；已投入 {record.daysWorked}{record.maximumDays === null ? '' : ` / ${record.maximumDays}`} 个白昼。</p>
              {record.pauseReason === 'day-limit' ? <p className="m0-fact-note">已达到投入上限；增加或清空上限后会从已有进度继续。</p> : null}
              {record.stage === 'area' && record.selectedRouteId === null ? <button type="button" onClick={() => updateState((current) => selectSurveyRoute(current, record.targetId, route.id))}>确认使用已发现路线</button> : null}
              <button type="button" disabled={!controls.canTogglePause} onClick={() => updateState((current) => setSurveyPaused(current, record.targetId, !record.paused))}>{record.paused ? '继续勘测' : '暂停勘测'}</button>
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
  const prototype = state.projects.find((project) => project.id === 'prototype-precision-parts');
  const assembly = state.projects.find((project) => project.id === 'assemble-survey-drone');
  const prototypeCanStart = workshopComplete && !prototype;
  const assemblyCanStart = workshopComplete
    && state.research.completed.includes('adapt-survey-drone')
    && availableAmount(state, 'precisionParts') >= 2
    && !assembly
    && !state.drone;

  const lineStatus = (project: Project | undefined, completeLabel: string): string => {
    if (!project) return '待生产';
    if (project.status === 'complete') return completeLabel;
    return `${formatNumber(project.workDone)} / ${formatNumber(project.workRequired)}`;
  };

  return <div className="m0-production-list">
    <article className={`m0-production-line ${workshopComplete ? '' : 'is-locked'}`}>
      <div className="m0-production-heading"><div><h3>精密部件</h3><small>总部精密工坊 → 总部仓库</small></div><strong>4 / 批</strong></div>
      <div className="m0-factory-allocation"><span className={prototype && prototype.status !== 'complete' ? 'is-assigned' : ''} aria-hidden="true" /><b>{prototype && prototype.status !== 'complete' ? '1 / 1 座' : '0 / 1 座'}</b><em>{lineStatus(prototype, '本批完成')}</em></div>
      <dl className="m0-compact-costs"><div><dt>普通零件</dt><dd>2</dd></div><div><dt>工程构件</dt><dd>4</dd></div><div><dt>合金料</dt><dd>4</dd></div></dl>
      <button type="button" disabled={!prototypeCanStart} onClick={() => updateState((current) => approveCapabilityProject(current, 'prototype-precision-parts'))}>开始生产</button>
    </article>
    <article className={`m0-production-line ${state.research.completed.includes('adapt-survey-drone') ? '' : 'is-locked'}`}>
      <div className="m0-production-heading"><div><h3>多光谱勘测无人机系统</h3><small>总部精密工坊 → 总部</small></div><strong>1 / 批</strong></div>
      <div className="m0-factory-allocation"><span className={assembly && assembly.status !== 'complete' ? 'is-assigned' : ''} aria-hidden="true" /><b>{assembly && assembly.status !== 'complete' ? '1 / 1 座' : '0 / 1 座'}</b><em>{state.drone ? '已交付' : lineStatus(assembly, '已交付')}</em></div>
      <dl className="m0-compact-costs"><div><dt>普通零件</dt><dd>3</dd></div><div><dt>工程构件</dt><dd>10</dd></div><div><dt>合金料</dt><dd>8</dd></div><div><dt>精密部件</dt><dd>2</dd></div></dl>
      <button type="button" disabled={!assemblyCanStart} onClick={() => updateState((current) => approveCapabilityProject(current, 'assemble-survey-drone'))}>开始组装</button>
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
  onPositionCommit,
  onSelectCell,
  onRotationChange,
}: {
  state: M0State;
  events: M0Event[];
  eventWindow: EventWindowPosition;
  onPositionCommit: (position: EventWindowPosition) => void;
  onSelectCell: (cellId: string) => void;
  onRotationChange: (rotation: MapRotation) => void;
}): ReactElement {
  const mapRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ pointerId: number; x: number; y: number; rotation: MapRotation; moved: boolean } | null>(null);
  const suppressCellClickRef = useRef(false);
  const pendingRotationRef = useRef<MapRotation | null>(null);
  const rotationTimerRef = useRef<number | null>(null);
  const projectedCells = projectSphericalLocalWindow(state.map.cells, state.ui.mapRotation);
  const projected = new Map(projectedCells.map((cell) => [cell.id, cell]));

  useEffect(() => () => {
    if (rotationTimerRef.current !== null) window.clearTimeout(rotationTimerRef.current);
  }, []);

  const flushRotation = (): void => {
    if (rotationTimerRef.current !== null) window.clearTimeout(rotationTimerRef.current);
    rotationTimerRef.current = null;
    const rotation = pendingRotationRef.current;
    pendingRotationRef.current = null;
    if (rotation) onRotationChange(rotation);
  };

  const scheduleRotation = (rotation: MapRotation): void => {
    pendingRotationRef.current = rotation;
    if (rotationTimerRef.current !== null) return;
    rotationTimerRef.current = window.setTimeout(flushRotation, 50);
  };

  const onSpherePointerDown = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotation: { ...state.ui.mapRotation },
      moved: false,
    };
  };

  const onSpherePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    if (Math.hypot(event.clientX - drag.x, event.clientY - drag.y) > 3) drag.moved = true;
    scheduleRotation({
      yaw: drag.rotation.yaw + (event.clientX - drag.x) * 0.005,
      pitch: drag.rotation.pitch - (event.clientY - drag.y) * 0.005,
    });
  };

  const onSpherePointerEnd = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (drag?.pointerId !== event.pointerId) return;
    suppressCellClickRef.current = drag.moved;
    dragRef.current = null;
    flushRotation();
    window.setTimeout(() => { suppressCellClickRef.current = false; }, 0);
  };

  const onSphereKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>): void => {
    const step = 0.1;
    const current = state.ui.mapRotation;
    const rotation = event.key === 'ArrowLeft' ? { ...current, yaw: current.yaw - step }
      : event.key === 'ArrowRight' ? { ...current, yaw: current.yaw + step }
        : event.key === 'ArrowUp' ? { ...current, pitch: current.pitch + step }
          : event.key === 'ArrowDown' ? { ...current, pitch: current.pitch - step }
            : event.key === 'Home' ? { yaw: 0, pitch: 0 } : null;
    if (!rotation) return;
    event.preventDefault();
    onRotationChange(rotation);
  };

  return <section className="m0-map-stage" ref={mapRef} aria-label="地图">
    <div className="m0-planet-frame">
      <div
        className="m0-local-map m0-planet-shell"
        aria-label="可旋转球体；当前只制作总部周围三圈 37 格"
        aria-describedby="m0-planet-help"
        tabIndex={0}
        onPointerDown={onSpherePointerDown}
        onPointerMove={onSpherePointerMove}
        onPointerUp={onSpherePointerEnd}
        onPointerCancel={onSpherePointerEnd}
        onKeyDown={onSphereKeyDown}
      >
        <svg className="m0-map-grid" viewBox="0 0 100 100" role="group" aria-label="总部周围地表网格">
        {state.map.cells
          .slice()
          .sort((left, right) => (projected.get(left.id)?.depth ?? 0) - (projected.get(right.id)?.depth ?? 0))
          .map((cell) => {
          const position = projected.get(cell.id);
          if (!position?.visible) return null;
          const points = position.corners.map((corner) => `${corner.xPercent},${corner.yPercent}`).join(' ');
          return <polygon
            key={cell.id}
            className={`m0-map-cell is-${visibleCellClass(cell)} ${state.map.selectedCellId === cell.id ? 'is-selected' : ''}`}
            points={points}
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
        </svg>
      </div>
      <p id="m0-planet-help" className="m0-planet-help">拖动球面或使用方向键有限旋转；Home 恢复总部视角。球壳外未制作地点内容。</p>
      <button type="button" className="m0-map-reset" onClick={() => onRotationChange({ yaw: 0, pitch: 0 })}>恢复总部视角</button>
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
  const previousPopulationRef = useRef(livingPopulation(state));

  useEffect(() => {
    if (!state.clock.running) return undefined;
    const timer = window.setInterval(() => {
      setState((current) => advanceRealTime(current, 1_000));
    }, 1_000);
    return () => window.clearInterval(timer);
  }, [state.clock.running]);

  const living = livingPopulation(state);
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
    previousPopulationRef.current = livingPopulation(next);
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
        onPositionCommit={commitEventPosition}
        onSelectCell={(cellId) => updateState((current) => selectMapCell(current, cellId))}
        onRotationChange={(rotation) => updateState((current) => setMapRotation(current, rotation))}
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
