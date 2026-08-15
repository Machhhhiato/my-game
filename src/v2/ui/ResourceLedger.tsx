import { useEffect } from 'react';
import { useV2 } from '../store';
import { RESOURCE_DEFS } from '../data';
import type { DangerLevel } from '../types';

const DANGER_COLOR: Record<DangerLevel, string> = {
  normal: '#d9e6ee',
  warn: '#efba74',
  danger: '#dc796f',
};

const PANEL_W = 320;

export function ResourceLedger() {
  const id = useV2(s => s.resourceLedger);
  const anchor = useV2(s => s.ledgerAnchor);
  const state = useV2(s => s.state);
  const openResource = useV2(s => s.openResource);

  useEffect(() => {
    if (!id) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') openResource(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [id, openResource]);

  if (!id) return null;
  const def = RESOURCE_DEFS[id];
  const lv = state.nation.resources[id];
  const col = DANGER_COLOR[lv.danger];

  // 锚定到被点击资源项下方；越界则靠右
  let left = 150, top = 56;
  if (anchor) {
    left = anchor.left;
    top = anchor.top;
    if (left + PANEL_W > window.innerWidth - 8) left = Math.max(8, window.innerWidth - PANEL_W - 8);
  }

  return (
    <div className="v2-ledger" style={{ left, top }} onClick={e => e.stopPropagation()}>
      <div className="v2-ledger-head">
        <span className="v2-ledger-title" style={{ color: col }}>{def.name}</span>
        <button className="v2-ledger-close" onClick={() => openResource(null)}>×</button>
      </div>
      <div className="v2-ledger-stock" style={{ color: col }}>
        {Math.round(lv.stock)}
        <span className="v2-ledger-unit">{lv.trend > 0 ? ' ↑' : lv.trend < 0 ? ' ↓' : ' →'}</span>
      </div>
      <div className="v2-ledger-rows">
        <div className="v2-ledger-row"><span>收入</span><b>{lv.income >= 0 ? '+' : ''}{lv.income}/期</b></div>
        <div className="v2-ledger-row"><span>需求</span><b>{lv.demand}/期</b></div>
        <div className="v2-ledger-row"><span>储备目标</span><b>{lv.reserveTarget}</b></div>
        <div className="v2-ledger-row"><span>净趋势</span><b style={{ color: col }}>{lv.income - lv.demand >= 0 ? '结余' : '缺口'}</b></div>
      </div>
      <div className="v2-ledger-section">
        <div className="v2-ledger-sub">主要来源</div>
        {lv.sources.map(s => <div className="v2-ledger-li" key={s}>· {s}</div>)}
      </div>
      <div className="v2-ledger-section">
        <div className="v2-ledger-sub" style={{ color: lv.danger === 'normal' ? '#9fb1c0' : '#dc796f' }}>主要缺口</div>
        {lv.gaps.map(s => <div className="v2-ledger-li" key={s}>· {s}</div>)}
      </div>
    </div>
  );
}
