import { useV2, type PanelId } from '../store';

const CMD: { id: PanelId; label: string }[] = [
  { id: 'focus', label: '国策' },
  { id: 'policy', label: '当前政策' },
  { id: 'project', label: '工程建设' },
  { id: 'research', label: '研究' },
  { id: 'report', label: '报告' },
];

export function CommandBar() {
  const panel = useV2(s => s.panel);
  const setPanel = useV2(s => s.setPanel);

  return (
    <footer className="v2-cmdbar">
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
    </footer>
  );
}
