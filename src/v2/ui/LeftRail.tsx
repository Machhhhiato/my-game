import { useV2, type PanelId } from '../store';

const ENTRIES: { id: PanelId; glyph: string; name: string }[] = [
  { id: 'nation', glyph: '国', name: '国家' },
  { id: 'focus', glyph: '国', name: '国策' },
  { id: 'policy', glyph: '策', name: '当前政策' },
  { id: 'project', glyph: '工', name: '工程建设' },
  { id: 'research', glyph: '研', name: '研究' },
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
          className={`v2-rail-btn ${panel === e.id ? 'active' : ''}`}
          onClick={() => setPanel(panel === e.id ? null : e.id)}
          title={e.name}
        >
          <span className="v2-rail-glyph">{e.glyph}</span>
        </button>
      ))}
    </nav>
  );
}
