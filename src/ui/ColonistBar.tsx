import { useGame } from '../store/useGame';
import { STATE_EMOJI } from './meta';
import { maxHp } from '../content/colonists';
import type { Colonist } from '../core/types';

function moodColor(m: number): string {
  if (m >= 60) return '#4ac24a';
  if (m >= 40) return '#c2b84a';
  if (m >= 25) return '#e8a33a';
  return '#e04a3a';
}

export function ColonistBar() {
  const state = useGame(s => s.state);
  const sel = useGame(s => s.sel);
  const select = useGame(s => s.select);

  const click = (c: Colonist) => {
    select(sel.kind === 'colonist' && sel.id === c.id
      ? { kind: null, id: null }
      : { kind: 'colonist', id: c.id });
  };

  return (
    <div className="cbar">
      {state.colonists.map(c => {
        const dead = c.hp <= 0;
        const mhp = maxHp(c);
        const isSel = sel.kind === 'colonist' && sel.id === c.id;
        return (
          <button
            key={c.id}
            className={`cbar-card ${dead ? 'dead' : ''} ${isSel ? 'active' : ''}`}
            onClick={() => click(c)}
            title={`${c.name} · 心情 ${Math.round(c.mood)}`}
          >
            <span className="cbar-emoji">{STATE_EMOJI[c.state] ?? '😐'}</span>
            <span className="cbar-name">{c.name}</span>
            <span className="cbar-mood" style={{ background: moodColor(c.mood) }} />
            {!dead && c.hp < mhp && (
              <span className="cbar-hp" style={{ width: `${(c.hp / mhp) * 24}px` }} />
            )}
          </button>
        );
      })}
    </div>
  );
}
