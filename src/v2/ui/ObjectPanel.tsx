import { useEffect } from 'react';
import { useV2 } from '../store';

const KIND_LABEL: Record<string, string> = {
  shelter: '深层存续设施',
  outpost: '外拓营',
  waypoint: '行旅营',
};
const STATUS_LABEL: Record<string, string> = {
  direct: '直接管辖',
  compact: '协作契约',
  contested: '争议/风险',
};

const PANEL_W = 320;
const PANEL_H_EST = 380;

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

export function ObjectPanel() {
  const selectedNodeId = useV2(s => s.selectedNodeId);
  const state = useV2(s => s.state);
  const anchor = useV2(s => s.selectedAnchor);
  const mapSize = useV2(s => s.mapSize);
  const selectNode = useV2(s => s.selectNode);
  const setPanel = useV2(s => s.setPanel);

  useEffect(() => {
    if (!selectedNodeId) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') selectNode(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedNodeId, selectNode]);

  const node = state.nodes.find(n => n.id === selectedNodeId);
  if (!node) return null;

  // 锚定定位：优先节点旁；越界/不可见才退回左下日志上方
  let style: React.CSSProperties = { left: 12, top: 'auto', bottom: 196 };
  if (anchor && anchor.visible && mapSize.w > 0 && mapSize.h > PANEL_H_EST + 16) {
    let left = anchor.x + 18;
    if (left + PANEL_W > mapSize.w - 8) left = anchor.x - 18 - PANEL_W;
    if (left >= 8) {
      const top = clamp(anchor.y - PANEL_H_EST / 2, 8, mapSize.h - PANEL_H_EST - 8);
      style = { left, top, bottom: 'auto' };
    }
  }

  const onAction = (a: string) => {
    if (a.includes('旗舰工程') || a.includes('净水续命')) setPanel('project');
    else if (a.includes('接纳政策')) setPanel('policy');
  };

  return (
    <div className="v2-objpanel" style={style} onClick={e => e.stopPropagation()}>
      <div className="v2-objpanel-head">
        <span className="v2-objpanel-title">{node.name}</span>
        <button className="v2-objpanel-close" onClick={() => selectNode(null)}>×</button>
      </div>
      <div className="v2-objpanel-meta">
        {KIND_LABEL[node.kind]} · <span className="v2-obj-status">{STATUS_LABEL[node.politicalStatus]}</span>
      </div>
      <div className="v2-objpanel-status">{node.statusLine}</div>
      <div className="v2-objpanel-facts">
        {node.facts.map((f, i) => <div className="v2-objpanel-fact" key={i}>· {f}</div>)}
      </div>
      <div className="v2-objpanel-block">
        <div className="v2-objpanel-label">当前瓶颈</div>
        <div className="v2-objpanel-val">{node.bottleneck}</div>
      </div>
      <div className="v2-objpanel-block">
        <div className="v2-objpanel-label">下一风险</div>
        <div className="v2-objpanel-val danger">{node.nextRisk}</div>
      </div>
      <div className="v2-objpanel-actions">
        {node.actions.map((a, i) => (
          <button key={i} className="v2-objpanel-action" onClick={() => onAction(a)} title="战略级行动">
            {a}
          </button>
        ))}
      </div>
    </div>
  );
}
