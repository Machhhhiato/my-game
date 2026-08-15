import { useEffect } from 'react';
import { useV2, type PanelId } from '../store';
import {
  DIRECTIONS, PROJECTS, POLICIES, SECURITY_POSTURES,
  DIRECTION_ORDER, PROJECT_ORDER, POLICY_ORDER,
} from '../data';
import { RESOURCE_NAMES, DEBT_NAMES, RESOURCE_IDS, DEBT_IDS } from '../simulation';
import type { DirectionId, PolicyId, ProjectId, SecurityPostureId } from '../types';

function df(n: number): string {
  const r = Math.round(n * 10) / 10;
  return r > 0 ? `+${r}` : `${r}`;
}

const CAPACITY_LABELS: [string, string][] = [
  ['materialBase', '物质'], ['knowledgeBase', '知识'], ['coerciveCapacity', '强制'],
  ['integrationCapacity', '统合'], ['socialCapacity', '社会'], ['logisticsResilience', '后勤'],
];
const DEBT_LABELS: [string, string][] = [
  ['maintenance', '维护'], ['ecology', '生态'], ['housing', '住房'],
  ['trust', '信任'], ['military', '军事'], ['integration', '统合债'],
];

function Title({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="v2-panel-head">
      <span className="v2-panel-title">{children}</span>
      <button className="v2-panel-close" onClick={onClose}>×</button>
    </div>
  );
}

export function OperationPanel() {
  const panel = useV2(s => s.panel);
  const state = useV2(s => s.state);
  const pending = useV2(s => s.pending);
  const setPanel = useV2(s => s.setPanel);
  const stageCommand = useV2(s => s.stageCommand);

  useEffect(() => {
    if (!panel) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPanel(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [panel, setPanel]);

  if (!panel) return null;
  const close = () => setPanel(null);

  return (
    <div className="v2-opanel" onClick={e => e.stopPropagation()}>
      {panel === 'nation' && (
        <>
          <Title onClose={close}>国家概览</Title>
          <div className="v2-nation-name">{state.nation.name}</div>
          <div className="v2-nation-stage">{state.nation.stage === 'shelter_outreach' ? '避难所外拓阶段' : state.nation.stage}</div>
          <div className="v2-section">
            <div className="v2-sub">人口</div>
            <div className="v2-kv"><span>登记</span><b>{state.nation.population.registered}</b></div>
            <div className="v2-kv"><span>儿童</span><b>{state.nation.population.children}</b></div>
            <div className="v2-kv"><span>照护负担</span><b>{state.nation.population.careDependents}</b></div>
            <div className="v2-kv"><span>健康有效劳力</span><b>{state.nation.population.healthyWorkforce}</b></div>
          </div>
          <div className="v2-section">
            <div className="v2-sub">六项国家能力</div>
            {CAPACITY_LABELS.map(([k, label]) => {
              const v = (state.nation.capacities as unknown as Record<string, { value: number }>)[k].value;
              return <div className="v2-kv" key={k}><span>{label}</span><b>{v}</b></div>;
            })}
          </div>
          <div className="v2-section">
            <div className="v2-sub">债务</div>
            {DEBT_LABELS.map(([k, label]) => {
              const v = (state.nation.debts as unknown as Record<string, { value: number }>)[k].value;
              return <div className="v2-kv" key={k}><span>{label}</span><b style={{ color: v >= 30 ? '#efba74' : '#9fb1c0' }}>{v}</b></div>;
            })}
          </div>
        </>
      )}

      {panel === 'plan' && (
        <>
          <Title onClose={close}>本期计划</Title>
          <div className="v2-kv"><span>主方向</span><b>{DIRECTIONS[pending.primaryDirection].name}</b></div>
          <div className="v2-kv"><span>辅方向</span><b>{pending.secondaryDirection ? DIRECTIONS[pending.secondaryDirection].name : '无'}</b></div>
          <div className="v2-kv"><span>旗舰工程</span><b>{PROJECTS[pending.flagshipProjectId ?? 'water_life'].name}</b></div>
          <div className="v2-kv"><span>法令</span><b>{POLICIES[pending.policyId].name}</b></div>
          <div className="v2-kv"><span>安全姿态</span><b>{SECURITY_POSTURES.find(s => s.id === pending.securityPosture)!.name}</b></div>
          <div className="v2-note">以上为待确认命令；在底部「确认本计划期」提交。</div>
        </>
      )}

      {panel === 'direction' && (
        <>
          <Title onClose={close}>方向</Title>
          <div className="v2-sub">主方向</div>
          <div className="v2-grid">
            {DIRECTION_ORDER.map(id => (
              <button
                key={id}
                className={`v2-opt ${pending.primaryDirection === id ? 'active' : ''}`}
                onClick={() => stageCommand({ primaryDirection: id as DirectionId })}
              >
                {DIRECTIONS[id].name}
              </button>
            ))}
          </div>
          <div className="v2-sub">辅方向（可无）</div>
          <div className="v2-grid">
            <button className={`v2-opt ${pending.secondaryDirection === null ? 'active' : ''}`} onClick={() => stageCommand({ secondaryDirection: null })}>无</button>
            {DIRECTION_ORDER.map(id => (
              <button
                key={id}
                className={`v2-opt ${pending.secondaryDirection === id ? 'active' : ''}`}
                onClick={() => stageCommand({ secondaryDirection: id as DirectionId })}
              >
                {DIRECTIONS[id].name}
              </button>
            ))}
          </div>
        </>
      )}

      {panel === 'project' && (
        <>
          <Title onClose={close}>旗舰工程</Title>
          {PROJECT_ORDER.map(id => {
            const p = PROJECTS[id];
            const active = pending.flagshipProjectId === id;
            return (
              <button key={id} className={`v2-proj ${active ? 'active' : ''}`} onClick={() => stageCommand({ flagshipProjectId: id as ProjectId })}>
                <div className="v2-proj-name">{p.name}</div>
                <div className="v2-proj-line"><span>收益</span>{p.benefit}</div>
                <div className="v2-proj-line"><span>挤占</span>{p.cost}</div>
                <div className="v2-proj-line"><span>风险</span>{p.risk}</div>
              </button>
            );
          })}
        </>
      )}

      {panel === 'policy' && (
        <>
          <Title onClose={close}>法令</Title>
          {POLICY_ORDER.map(id => {
            const p = POLICIES[id];
            const active = pending.policyId === id;
            return (
              <button key={id} className={`v2-opt wide ${active ? 'active' : ''}`} onClick={() => stageCommand({ policyId: id as PolicyId })}>
                <b>{p.name}</b>
                <span className="v2-opt-desc">{p.desc}</span>
              </button>
            );
          })}
          <div className="v2-sub">安全姿态</div>
          <div className="v2-grid">
            {SECURITY_POSTURES.map(s => (
              <button
                key={s.id}
                className={`v2-opt ${pending.securityPosture === s.id ? 'active' : ''}`}
                onClick={() => stageCommand({ securityPosture: s.id as SecurityPostureId })}
                title={s.desc}
              >
                {s.name}
              </button>
            ))}
          </div>
        </>
      )}

      {panel === 'research' && (
        <>
          <Title onClose={close}>科研</Title>
          <div className="v2-note">完整科技树尚未开放。当前年代仅有净水膜、抗污染种源、量具与标准件、短波通信四项能力包，其成熟度结算将在后续接入。</div>
        </>
      )}

      {panel === 'report' && (() => {
        const latest = state.reports[state.reports.length - 1];
        if (!latest) {
          return (
            <>
              <Title onClose={close}>地区执行报告</Title>
              <div className="v2-note">尚未结算计划期。</div>
            </>
          );
        }
        return (
          <>
            <Title onClose={close}>地区执行报告</Title>
            <div className="v2-report-title">第 {latest.year} 年第 {latest.period} 期 · 河谷统合报告</div>
            <div className="v2-section">
              <div className="v2-sub">命令</div>
              <div className="v2-kv"><span>主方向</span><b>{DIRECTIONS[latest.command.primaryDirection].name}</b></div>
              <div className="v2-kv"><span>旗舰工程</span><b>{latest.command.flagshipProjectId ? PROJECTS[latest.command.flagshipProjectId].name : '无'}</b></div>
              <div className="v2-kv"><span>法令</span><b>{POLICIES[latest.command.policyId].name}</b></div>
              <div className="v2-kv"><span>安全姿态</span><b>{SECURITY_POSTURES.find(s => s.id === latest.command.securityPosture)!.name}</b></div>
            </div>
            {latest.project && (
              <div className="v2-section">
                <div className="v2-sub">工程进度</div>
                <div className="v2-kv">
                  <span>{latest.project.name}</span>
                  <b>{latest.project.progressFrom} → {latest.project.progressTo}（+{latest.project.progressTo - latest.project.progressFrom}；效率 {Math.round(latest.project.efficiency * 100)}%）</b>
                </div>
              </div>
            )}
            <div className="v2-section">
              <div className="v2-sub">资源变化</div>
              {RESOURCE_IDS.filter(id => latest.resourceDelta[id] !== 0).map(id => (
                <div className="v2-kv" key={id}>
                  <span>{RESOURCE_NAMES[id]}</span>
                  <b style={{ color: latest.resourceDelta[id] < 0 ? '#B86158' : '#D9EBD1' }}>{df(latest.resourceDelta[id])}</b>
                </div>
              ))}
            </div>
            <div className="v2-section">
              <div className="v2-sub">债务变化</div>
              {DEBT_IDS.filter(id => latest.debtDelta[id] !== 0).map(id => (
                <div className="v2-kv" key={id}>
                  <span>{DEBT_NAMES[id]}</span>
                  <b>{df(latest.debtDelta[id])}</b>
                </div>
              ))}
            </div>
            <div className="v2-section">
              <div className="v2-sub">事件 / 风险</div>
              <div className="v2-note">{latest.event ? `${latest.event.name}：${latest.event.summary}` : '本期无新增硬事件；风险继续积累'}</div>
            </div>
            <div className="v2-section">
              <div className="v2-sub">原因</div>
              {latest.reasons.map((r, i) => <div className="v2-note" key={i}>{i + 1}. {r}</div>)}
            </div>
          </>
        );
      })()}
    </div>
  );
}
