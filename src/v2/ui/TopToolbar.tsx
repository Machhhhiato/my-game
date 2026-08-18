import { useState } from 'react';
import { useV2 } from '../store';
import { saveGameV6 } from '../save';
import { METRIC_ORDER } from '../content/metrics';
import { METRIC_DEFS } from '../nation';
import { yearOf } from '../simulation';

export function TopToolbar() {
  const state = useV2(s => s.state);
  const setSpeed = useV2(s => s.setSpeed);
  const setPanel = useV2(s => s.setPanel);
  const restartCampaign = useV2(s => s.restartCampaign);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const onSave = () => {
    saveGameV6(useV2.getState().state);
    setToast('已保存');
    setTimeout(() => setToast(null), 1600);
  };
  const onRestart = () => {
    if (!window.confirm('开始新的河谷战役？当前进度会先归档，随后从元年第一日重新开始。')) return;
    restartCampaign();
    setSettingsOpen(false);
    setToast('新的河谷战役已开始；原进度已归档');
    setTimeout(() => setToast(null), 2400);
  };

  const trans = state.nationalPolicy.transitionDaysRemaining > 0 ? `调度交接 ${state.nationalPolicy.transitionDaysRemaining} 日` : null;

  return (
    <header className="v2-topbar">
      <button className="v2-crest" onClick={() => setPanel('nation')} title="国家概览">
        <span className="v2-crest-emblem" />
        <span className="v2-crest-name">第 07 号</span>
        <span className="v2-crest-sub">河谷外拓</span>
      </button>

      <div className="v2-res-row">
        <span className="v2-res" title="人口：决定总需求和潜在人手">
          <span className="v2-res-sym">口</span>
          <span className="v2-res-stock">{state.population}</span>
        </span>
        {METRIC_ORDER.map(id => (
          <span className="v2-res" key={id} title={`${METRIC_DEFS[id].name}：${METRIC_DEFS[id].bottleneck}`}>
            <span className="v2-res-sym">{METRIC_DEFS[id].name.slice(0, 1)}</span>
            <span className="v2-res-stock">{Math.round(state.metrics[id].value)}</span>
          </span>
        ))}
      </div>

      <button className="v2-date" onClick={() => setPanel('nation')} title="国家概览">
        余烬历 {yearOf(state.day)} 年 · 第 {state.day} 日{trans ? ` · ${trans}` : ''}
      </button>

      <div className="v2-speed">
        {([0, 1, 2, 4] as const).map(v => (
          <button
            key={v}
            className={`v2-speed-btn ${state.clock.speed === v ? 'active' : ''}`}
            onClick={() => setSpeed(v)}
          >
            {v === 0 ? '暂停' : `${v}×`}
          </button>
        ))}
      </div>

      <div className="v2-settings">
        <button className="v2-settings-btn" onClick={() => setSettingsOpen(o => !o)} title="设置">设置</button>
        {settingsOpen && (
          <div className="v2-settings-pop">
            <button onClick={onSave}>立即保存</button>
            <button onClick={onRestart}>开始新的战役</button>
            <button disabled title="后续开放">导入 / 导出</button>
            <button disabled title="后续开放">无障碍</button>
          </div>
        )}
      </div>

      {toast && <div className="v2-toast">{toast}</div>}
    </header>
  );
}
