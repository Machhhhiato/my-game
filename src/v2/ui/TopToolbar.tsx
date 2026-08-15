import { useState } from 'react';
import { useV2 } from '../store';
import { RESOURCE_DEFS, RESOURCE_ORDER } from '../data';
import { saveGameV3 } from '../save';
import type { DangerLevel } from '../types';

const DANGER_COLOR: Record<DangerLevel, string> = {
  normal: '#d9e6ee',
  warn: '#efba74',
  danger: '#dc796f',
};

function arrow(t: -1 | 0 | 1): string {
  return t > 0 ? '▲' : t < 0 ? '▼' : '—';
}

export function TopToolbar() {
  const state = useV2(s => s.state);
  const openResource = useV2(s => s.openResource);
  const setPanel = useV2(s => s.setPanel);
  const setSpeed = useV2(s => s.setSpeed);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const onSave = () => {
    saveGameV3(useV2.getState().state);
    setToast('已保存');
    setTimeout(() => setToast(null), 1600);
  };

  return (
    <header className="v2-topbar">
      <button className="v2-crest" onClick={() => setPanel('nation')} title="国家概览">
        <span className="v2-crest-emblem" />
        <span className="v2-crest-name">第 07 号</span>
        <span className="v2-crest-sub">河谷外拓</span>
      </button>

      <div className="v2-res-row">
        {RESOURCE_ORDER.map(id => {
          const def = RESOURCE_DEFS[id];
          const lv = state.nation.resources[id];
          const col = DANGER_COLOR[lv.danger];
          return (
            <button
              key={id}
              data-res={id}
              className="v2-res"
              title={`${def.name}：点击查看资源账`}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                openResource(id, { left: r.left, top: r.bottom + 4 });
              }}
            >
              <span className="v2-res-sym">{def.symbol}</span>
              <span className="v2-res-stock" style={{ color: col }}>{Math.round(lv.stock)}</span>
              <span className="v2-res-trend" style={{ color: col }}>{arrow(lv.trend)}</span>
            </button>
          );
        })}
      </div>

      <button className="v2-date" onClick={() => setPanel('plan')} title="计划期进度">
        余烬历 {state.clock.year} 年 · 第 {state.clock.period} 计划期
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
            <button disabled title="后续开放">导入 / 导出</button>
            <button disabled title="后续开放">无障碍</button>
          </div>
        )}
      </div>

      {toast && <div className="v2-toast">{toast}</div>}
    </header>
  );
}
