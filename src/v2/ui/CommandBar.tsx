import { useV2, type PanelId } from '../store';
import { previewPlanPeriod } from '../simulation';

const CMD: { id: PanelId; label: string }[] = [
  { id: 'plan', label: '计划' },
  { id: 'direction', label: '方向' },
  { id: 'project', label: '工程' },
  { id: 'policy', label: '法令' },
  { id: 'report', label: '报告' },
];

function fmt(n: number): string {
  return `${n >= 0 ? '+' : ''}${n}`;
}

export function CommandBar() {
  const panel = useV2(s => s.panel);
  const setPanel = useV2(s => s.setPanel);
  const state = useV2(s => s.state);
  const pending = useV2(s => s.pending);
  const staged = useV2(s => s.staged);
  const resetStaging = useV2(s => s.resetStaging);
  const confirmSummaryOpen = useV2(s => s.confirmSummaryOpen);
  const setConfirmSummary = useV2(s => s.setConfirmSummary);
  const confirmPeriod = useV2(s => s.confirmPeriod);

  let count = 0;
  if (pending.primaryDirection !== state.player.primaryDirection) count++;
  if (pending.secondaryDirection !== state.player.secondaryDirection) count++;
  if (pending.flagshipProjectId !== state.player.flagshipProjectId) count++;
  if (pending.policyId !== state.player.policyId) count++;
  if (pending.securityPosture !== state.player.securityPosture) count++;

  return (
    <div className="v2-cmdbar-wrap">
      {confirmSummaryOpen && (() => {
        const preview = previewPlanPeriod(state, pending);
        return (
          <div className="v2-confirm-bar">
            <span className="v2-confirm-text">
              本期优先：{preview.flagshipProject}；
              最紧张：{preview.mostStressedResource ? `${preview.mostStressedResource.name} ${fmt(preview.mostStressedResource.delta)}` : '无'}；
              债务：{preview.largestDebtChange ? `${preview.largestDebtChange.name} ${fmt(preview.largestDebtChange.delta)}` : '无'}；
              {preview.event ? `预警：${preview.event.name}` : '无硬事件预警'}
            </span>
            <button className="v2-confirm-go" onClick={() => confirmPeriod()}>确认</button>
            <button className="v2-confirm-cancel" onClick={() => setConfirmSummary(false)}>取消</button>
          </div>
        );
      })()}
      <footer className="v2-cmdbar">
        <span className="v2-cmd-pending">
          待确认 {count}
          {count > 0 && staged && (
            <button className="v2-cmd-reset" onClick={resetStaging}>重置</button>
          )}
        </span>
        <div className="v2-cmd-btns">
          {CMD.map(c => (
            <button
              key={c.id}
              className={`v2-cmd-btn ${panel === c.id ? 'active' : ''}`}
              onClick={() => setPanel(panel === c.id ? null : c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
        <button className="v2-cmd-confirm" onClick={() => setConfirmSummary(true)}>确认本计划期</button>
      </footer>
    </div>
  );
}
