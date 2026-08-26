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
  setHeadquartersSalvageApproval,
  approveCapabilityProject,
  approveSurvey,
  configureSurvey,
  completeDroneRecharge,
  selectSurveyRoute,
  selectMapCell,
  setResearchDomainAutomatic,
  setResearchDomainOrder,
  setResearchMode,
  setResearchStaffing,
  setResearchTarget,
  setSurveyPaused,
  setProjectAutoResume,
  setRunning,
} from './simulation';
import {
  createInitialM0State,
  livingPopulation,
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
  type ResearchDomain,
  type ResourceId,
  type WorkMode,
} from './types';
import { futureFarmConclusion, intelStageName, projectSphericalLocalWindow, routeForTarget, surveyConclusion, surveyPlanControlState, surveyVisibleFacts, visibleCellClass, visibleCellTitle } from './map';
import { researchDomainName, technologyName } from './progression';
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

const lineLabels: Record<DailyLineId, string> = {
  water: '供水',
  food: '食物',
  maintenance: '维护与手工作坊',
  logistics: '总部短途物流',
};

const modes: WorkMode[] = ['minimum', 'standard', 'accelerated'];
const modeLabels: Record<WorkMode, string> = {
  minimum: '基本值守',
  standard: '常规运行',
  accelerated: '集中投入',
};

const commandDescriptions: Record<DailyLineId, string> = {
  water: '调配人员维持总部供水。',
  food: '组织食物生产并完成总部转运。',
  maintenance: '安排旧件修复与总部设施维护。',
  logistics: '维持总部短途运输与工程物流。',
};

type SheetId = 'headquarters' | 'research' | 'engineering' | 'assets' | 'locations' | 'maintenance' | 'archives';

const sheetEntries: Array<{ id: SheetId; icon: string; label: string }> = [
  { id: 'headquarters', icon: '⌂', label: '总部' },
  { id: 'research', icon: '⌁', label: '科研' },
  { id: 'engineering', icon: '▱', label: '工程' },
  { id: 'assets', icon: '◆', label: '资产' },
  { id: 'locations', icon: '◎', label: '地点' },
  { id: 'maintenance', icon: '⚒', label: '维修' },
  { id: 'archives', icon: '▤', label: '档案' },
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

function HeadquartersSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const workforce = state.workforce;
  const directResult = (line: DailyLineId): string => {
    if (line === 'water') {
      const account = state.monthly.resources.water;
      return `当前每日供水 ${formatNumber(account.currentDailyInflow)}，居民用水 ${formatNumber(account.currentDailyOutflow)}。`;
    }
    if (line === 'food') {
      const account = state.monthly.resources.food;
      return `当前每日生产与转运食物 ${formatNumber(account.currentDailyInflow)}，居民食物供应 ${formatNumber(account.currentDailyOutflow)}。`;
    }
    if (line === 'maintenance') {
      const account = state.monthly.resources.commonParts;
      return `当前每日修复普通零件 ${formatNumber(account.currentDailyInflow)}，总部设施维护使用 ${formatNumber(account.currentDailyOutflow)}。`;
    }
    if (state.workforce.logistics >= 5) return '当前优先保障工程运输。';
    if (state.workforce.logistics >= 3) return '当前可维持少量工程运输。';
    return '当前只维持总部必要运输，工程运输暂停。';
  };

  return <>
    <section>
      <h3>运行调度令</h3>
      <div className="m0-command-list">
        {(Object.keys(lineLabels) as DailyLineId[]).map((line) => <article className="m0-command-card" key={line}>
          <div className="m0-command-heading">
            <h4>{lineLabels[line]}调度令</h4>
            <span>当前占用 {state.workforce[line]} 人</span>
          </div>
          <p>{commandDescriptions[line]}</p>
          <label className="m0-command-control">
            <span>执行力度</span>
            <select
              aria-label={`${lineLabels[line]}调度令执行力度`}
              value={state.dailyModes[line]}
              onChange={(event) => updateState((current) => setDailyMode(current, line, event.target.value as WorkMode))}
            >
              {modes.map((mode) => <option key={mode} value={mode}>{modeLabels[mode]}</option>)}
            </select>
          </label>
          <p className="m0-command-result">{directResult(line)}</p>
        </article>)}
      </div>
    </section>
    <section>
      <h3>总部人力</h3>
      <dl className="m0-fact-list">
        <div><dt>可工作</dt><dd>{workforce.workable}</dd></div>
        <div><dt>基本值守</dt><dd>{workforce.basicDuty}</dd></div>
        <div><dt>供水</dt><dd>{workforce.water}</dd></div>
        <div><dt>食物</dt><dd>{workforce.food}</dd></div>
        <div><dt>维护</dt><dd>{workforce.maintenance}</dd></div>
        <div><dt>物流</dt><dd>{workforce.logistics}</dd></div>
        <div><dt>可调度</dt><dd>{workforce.development}</dd></div>
        <div><dt>待命</dt><dd>{workforce.standby}</dd></div>
      </dl>
      {state.staffingShortage ? <p className="m0-fact-note">{state.staffingShortage.message}</p> : null}
    </section>
  </>;
}

function EngineeringSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  const hiddenProjectIds = new Set(['restore-precision-manufacturing', 'adapt-survey-drone', 'survey-ruin-a', 'survey-ruin-b']);
  const projects = state.projects.filter((project) => !project.testOnly && !hiddenProjectIds.has(project.id));
  const completed = (id: string): boolean => state.projects.some((project) => project.id === id && project.status === 'complete');
  const exists = (id: string): boolean => state.projects.some((project) => project.id === id);

  return <div className="m0-project-list">
    {state.research.completed.includes('restore-precision-manufacturing') && !exists('repair-precision-workshop')
      ? <button type="button" onClick={() => updateState((current) => approveCapabilityProject(current, 'repair-precision-workshop'))}>批准修复精密工坊（9 人）</button>
      : null}
    {completed('repair-precision-workshop') && !exists('prototype-precision-parts')
      ? <button type="button" onClick={() => updateState((current) => approveCapabilityProject(current, 'prototype-precision-parts'))}>批准独立试制批（6 人）</button>
      : null}
    {projects.length === 0 ? <p className="m0-empty-state">目前没有已批准工程。</p> : null}
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
      <h4>已投入</h4>
      <dl className="m0-fact-list">
        {RESOURCE_IDS.filter((resource) => (project.investedResources[resource] ?? 0) > 0).map((resource) => <div key={resource}>
          <dt>{resourceLabels[resource]}</dt>
          <dd>{formatNumber(project.investedResources[resource] ?? 0)}</dd>
        </div>)}
      </dl>
      <label className="m0-check-row">
        <span>条件恢复后自动继续</span>
        <input
          type="checkbox"
          checked={project.autoResume}
          disabled={project.status === 'complete'}
          onChange={(event) => updateState((current) => setProjectAutoResume(current, project.id, event.target.checked))}
        />
      </label>
    </article>)}
  </div>;
}

function ResearchSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const completed = state.research.completed;
  const currentProject = state.research.currentProjectId
    ? state.projects.find((project) => project.id === state.research.currentProjectId)
    : null;
  const moveDomain = (domain: ResearchDomain, offset: -1 | 1): void => {
    const order = [...state.research.domainOrder];
    const index = order.indexOf(domain);
    const target = index + offset;
    if (target < 0 || target >= order.length) return;
    [order[index], order[target]] = [order[target], order[index]];
    updateState((current) => setResearchDomainOrder(current, order));
  };
  const blockedText = state.research.blockedReason === 'physical-prerequisite'
    ? '有科研项目等待精密工坊完成独立试制；系统不会跳过这项实体前置。'
    : state.research.blockedReason === 'manual-choice'
      ? '较高顺序领域仍有未完成的确定前置；系统只处理本轮内其他可执行内容。'
      : state.research.blockedReason === 'no-project' && state.research.automaticDomains.length > 0
        ? '参与自动科研的领域已经达到当前公开上限。'
        : null;
  return <div className="m0-project-list">
    <p className="m0-fact-note">一条科研工作线；只在白昼由实际调度人员推进。</p>
    <label className="m0-command-control"><span>科研人数</span><select value={state.research.workers} onChange={(event) => updateState((current) => setResearchStaffing(current, Number(event.target.value) as 2 | 4 | 6))}>
      <option value={2}>2 人</option><option value={4}>4 人</option><option value={6}>6 人</option>
    </select></label>
    <button type="button" disabled={completed.includes('restore-precision-manufacturing')} onClick={() => updateState((current) => setResearchTarget(current, 'restore-precision-manufacturing'))}>设为远期目标：恢复精密制造</button>
    <button type="button" disabled={completed.includes('adapt-survey-drone')} onClick={() => updateState((current) => setResearchTarget(current, 'adapt-survey-drone'))}>设为远期目标：适配勘测无人机</button>
    <h3>当前科研</h3>
    <p>{currentProject ? `${currentProject.name} · ${state.research.currentSource === 'manual' ? '指定队列' : '领域自动'} · ${formatNumber(currentProject.workDone)} / ${formatNumber(currentProject.workRequired)}` : blockedText ?? '科研工作线待命。'}</p>
    {currentProject && blockedText ? <p className="m0-fact-note">{blockedText}</p> : null}
    <h3>指定队列</h3><p>{state.research.manualQueue.length ? state.research.manualQueue.map(technologyName).join(' → ') : '尚未指定'}</p>
    <div className="m0-project-heading"><h3>领域自动顺序</h3><button type="button" onClick={() => updateState((current) => setResearchMode(current, 'automatic'))}>切换到领域自动</button></div>
    {state.research.domainOrder.map((domain, index) => <article className="m0-domain-row" key={domain}>
      <label><input type="checkbox" checked={state.research.automaticDomains.includes(domain)} onChange={(event) => updateState((current) => setResearchDomainAutomatic(current, domain, event.target.checked))} />{researchDomainName(domain)}</label>
      <span><button type="button" aria-label={`${researchDomainName(domain)}上移`} disabled={index === 0} onClick={() => moveDomain(domain, -1)}>↑</button><button type="button" aria-label={`${researchDomainName(domain)}下移`} disabled={index === state.research.domainOrder.length - 1} onClick={() => moveDomain(domain, 1)}>↓</button></span>
    </article>)}
    <p>自动科研先按顺序让参与领域进入下一阶段，再补当前公开的普通项目；系统会保留阻塞，不越过本轮进入更高阶段。</p>
  </div>;
}

function AssetSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const assembly = state.projects.find((project) => project.id === 'assemble-survey-drone');
  if (!state.drone) return <div className="m0-project-list">
    <p className="m0-empty-state">{assembly ? `首套无人机组装进度 ${formatNumber(assembly.workDone)} / ${formatNumber(assembly.workRequired)}，占用 ${assembly.staffing.actual} / 6 人。` : '尚无高级资产。'}</p>
    {!assembly ? <button type="button" disabled={!state.research.completed.includes('adapt-survey-drone') || availableAmount(state, 'precisionParts') < 2} onClick={() => updateState((current) => approveCapabilityProject(current, 'assemble-survey-drone'))}>批准首套无人机组装（6 人）</button> : null}
  </div>;
  const statusLabels = { 'needs-charge': '待补能', charging: '过夜补能中', available: '可用且已充电', assigned: '已分配' } as const;
  const rechargeLabels = { connection: '等待 2 人接入', overnight: '被动过夜补能', inspection: '等待 1 人检查', complete: '补能与检查完成' } as const;
  return <div className="m0-project-list"><h3>{state.drone.name}</h3>
    <p>位置：总部；状态：{statusLabels[state.drone.status]}</p>
    <p>当前任务：{state.drone.assignment === 'ruin-a' ? '工业废墟 A 勘测' : state.drone.assignment === 'ruin-b' ? '工业废墟 B 勘测' : '未分配'}</p>
    <p>维护与补能：{rechargeLabels[state.drone.recharge]}；接入 {state.drone.connectionWorkDone} / 2；检查 {state.drone.inspectionWorkDone} / 1。</p>
    <button type="button" disabled={state.drone.status !== 'needs-charge' || state.drone.rechargeApproved} onClick={() => updateState(completeDroneRecharge)}>{state.drone.rechargeApproved ? '补能流程已排入维护' : '安排补能流程'}</button>
  </div>;
}

function LocationsSheet({ state, updateState }: { state: M0State; updateState: (updater: (current: M0State) => M0State) => void }): ReactElement {
  const records = state.map.surveys;
  const selectedCell = state.map.cells.find((cell) => cell.id === state.map.selectedCellId);
  const farmCell = state.map.cells.find((cell) => cell.resource === 'farmland-potential');
  const farmConclusion = futureFarmConclusion(farmCell?.intel === 'site' ? 'site' : 'area');
  return <div className="m0-project-list">
    <article className="m0-project-card"><h3>当前选中格</h3><p>{selectedCell ? visibleCellTitle(selectedCell) : '尚未选择。'}</p></article>
    {records.map((record) => {
      const conclusion = surveyConclusion(record.targetId, record.stage);
      const route = routeForTarget(state.map, record.targetId);
      const controls = surveyPlanControlState(record);
      return <article className="m0-project-card" key={record.targetId}>
        <h3>{record.targetId === 'ruin-a' ? '工业废墟 A 方向' : '工业废墟 B 方向'}</h3>
        <p>当前情报：{intelStageName(record.stage)}</p>
        {surveyVisibleFacts(record.targetId, record.stage).map((fact) => <p key={fact}>{fact}</p>)}
        {conclusion ? <p><strong>{conclusion.label}</strong>：{conclusion.reason}</p> : <p>回收前哨结论：尚未判断。</p>}
        {controls.editable ? <>
          <label className="m0-command-control"><span>勘测人数</span><select value={record.workers} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { workers: Number(event.target.value) as 2 | 4 | 6 }))}><option value={2}>2 人</option><option value={4}>4 人</option><option value={6}>6 人</option></select></label>
          <label className="m0-command-control"><span>优先级</span><select value={record.priority} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { priority: event.target.value as 'P1' | 'P2' | 'P3' }))}><option value="P1">P1</option><option value="P2">P2</option><option value="P3">P3</option></select></label>
          <label className="m0-command-control"><span>最多投入白昼</span><input type="number" min={1} value={record.maximumDays ?? ''} placeholder="不限" onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { maximumDays: event.target.value === '' ? null : Number(event.target.value) }))} /></label>
          <label className="m0-check-row"><span>允许调用无人机</span><input type="checkbox" checked={record.useDrone} onChange={(event) => updateState((current) => configureSurvey(current, record.targetId, { useDrone: event.target.checked }))} /></label>
          {controls.needsApproval
            ? <button type="button" onClick={() => updateState((current) => approveSurvey(current, record.targetId, record.workers, record.priority, record.maximumDays, record.useDrone))}>批准一次完整勘测计划</button>
            : <>
              <p>投入进度：{record.workDone}；已投入 {record.daysWorked}{record.maximumDays === null ? '' : ` / ${record.maximumDays}`} 个白昼。</p>
              {record.pauseReason === 'day-limit' ? <p className="m0-fact-note">已达到投入上限；增加或清空上限后会从已有进度继续。</p> : null}
              {record.stage === 'area' && record.selectedRouteId === null ? <button type="button" onClick={() => updateState((current) => selectSurveyRoute(current, record.targetId, route.id))}>确认使用已发现路线</button> : null}
              <button type="button" disabled={!controls.canTogglePause} onClick={() => updateState((current) => setSurveyPaused(current, record.targetId, !record.paused))}>{record.paused ? '继续勘测' : '暂停勘测'}</button>
            </>}
        </> : null}
      </article>;
    })}
    <article className="m0-project-card"><h3>未来农田候选地</h3><p>已确认事实：平坦土壤，临近水源，没有可供回收的工业废墟。</p><p>{farmConclusion ? <><strong>{farmConclusion.label}</strong>：{farmConclusion.reason}</> : '回收前哨结论：尚未判断。'}</p></article>
    <article className="m0-project-card"><h3>未来矿产坡地</h3><p>已知潜力：坡地与矿产迹象；本批不开放建设。</p></article>
    <article className="m0-project-card"><h3>未来河岸候选地</h3><p>已知潜力：岸线与交通条件；本批不开放建设。</p></article>
  </div>;
}

function MaintenanceSheet({ state, updateState }: {
  state: M0State;
  updateState: (updater: (current: M0State) => M0State) => void;
}): ReactElement {
  return <>
    <dl className="m0-fact-list">
      <div><dt>维护积压</dt><dd>{formatNumber(state.maintenanceBacklog)}</dd></div>
      <div><dt>可修旧件</dt><dd>{formatNumber(state.oldRepairableParts)}</dd></div>
      <div><dt>已拆解物件</dt><dd>{state.headquartersSalvage.dismantledItems}</dd></div>
    </dl>
    <label className="m0-check-row">
      <span>普通零件不足时允许低效拆解</span>
      <input
        type="checkbox"
        checked={state.headquartersSalvage.approved}
        onChange={(event) => updateState((current) => setHeadquartersSalvageApproval(current, event.target.checked))}
      />
    </label>
  </>;
}

function ArchivesSheet({ state, status, onSave, onLoad, onNew }: {
  state: M0State;
  status: string | null;
  onSave: () => void;
  onLoad: () => void;
  onNew: () => void;
}): ReactElement {
  return <>
    <dl className="m0-fact-list">
      <div><dt>当前日期</dt><dd>{formatDate(state.calendar)}</dd></div>
      <div><dt>已记录事件</dt><dd>{state.events.length}</dd></div>
    </dl>
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
      {sheet === 'engineering' ? <EngineeringSheet state={state} updateState={updateState} /> : null}
      {sheet === 'assets' ? <AssetSheet state={state} updateState={updateState} /> : null}
      {sheet === 'locations' ? <LocationsSheet state={state} updateState={updateState} /> : null}
      {sheet === 'maintenance' ? <MaintenanceSheet state={state} updateState={updateState} /> : null}
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
  const dragRef = useRef<{ pointerId: number; x: number; y: number; rotation: MapRotation } | null>(null);
  const pendingRotationRef = useRef<MapRotation | null>(null);
  const rotationTimerRef = useRef<number | null>(null);
  const projected = new Map(projectSphericalLocalWindow(state.map.cells, state.ui.mapRotation).map((cell) => [cell.id, cell]));

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
    if (event.target !== event.currentTarget) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      rotation: { ...state.ui.mapRotation },
    };
  };

  const onSpherePointerMove = (event: ReactPointerEvent<HTMLDivElement>): void => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    scheduleRotation({
      yaw: drag.rotation.yaw + (event.clientX - drag.x) * 0.005,
      pitch: drag.rotation.pitch - (event.clientY - drag.y) * 0.005,
    });
  };

  const onSpherePointerEnd = (event: ReactPointerEvent<HTMLDivElement>): void => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    flushRotation();
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
        {state.map.cells.map((cell) => {
          const position = projected.get(cell.id);
          if (!position?.visible) return null;
          return <button
            type="button"
            key={cell.id}
            className={`m0-map-cell is-${visibleCellClass(cell)} ${state.map.selectedCellId === cell.id ? 'is-selected' : ''}`}
            style={{
              '--map-x': `${position.xPercent}%`,
              '--map-y': `${position.yPercent}%`,
              '--map-scale': position.scale,
              zIndex: Math.round((position.depth + 1) * 100),
            } as CSSProperties}
            onClick={() => onSelectCell(cell.id)}
            aria-label={visibleCellTitle(cell)}
            title={visibleCellTitle(cell)}
          />;
        })}
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
