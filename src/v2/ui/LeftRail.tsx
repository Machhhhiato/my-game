import { useV2, type PanelId } from '../store';

const ENTRIES: { id: PanelId; glyph: string; name: string; locked?: string }[] = [
  { id: 'nation', glyph: '国', name: '国家' },
  { id: 'plan', glyph: '计', name: '计划' },
  { id: 'project', glyph: '工', name: '工程' },
  { id: 'policy', glyph: '令', name: '法令' },
  { id: 'research', glyph: '研', name: '科研', locked: '完整科技树后续开放' },
  { id: 'report', glyph: '报', name: '报告' },
];

export function LeftRail() {
  const panel = useV2(s => s.panel);
  const setPanel = useV2(s => s.setPanel);

  return (
    <nav className="v2-rail">
      {ENTRIES.map(e => (
        <button
          key={e.id}
          className={`v2-rail-btn ${panel === e.id ? 'active' : ''} ${e.locked ? 'locked' : ''}`}
          onClick={() => setPanel(panel === e.id ? null : e.id)}
          title={e.locked ? `${e.name}：${e.locked}` : e.name}
        >
          <span className="v2-rail-glyph">{e.glyph}</span>
        </button>
      ))}
    </nav>
  );
}
