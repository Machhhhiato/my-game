import { useState } from 'react';
import { useV2 } from '../store';
import { MAP_LAYERS } from '../data';
import type { MapLayerId } from '../types';

const LEGEND: Record<MapLayerId, { label: string; swatch: string; style: string }[]> = {
  political: [
    { label: '中央直辖（翡翠河谷）', swatch: '#D4A848', style: 'solid' },
    { label: '统一协作区（旧渡口）', swatch: '#4F9CB7', style: 'hatch' },
    { label: '风险管制区（南部酸雨带）', swatch: '#B86158', style: 'dash' },
  ],
  population: [
    { label: '聚居灯火（外拓营）', swatch: '#D4A848', style: 'solid' },
    { label: '地下设施（第 07 号）', swatch: '#DCE5E2', style: 'solid' },
    { label: '临时灯火（旧渡口）', swatch: '#73CBE7', style: 'solid' },
  ],
  ecology: [
    { label: '河网/水网', swatch: '#73CBE7', style: 'solid' },
    { label: '河谷耕地', swatch: '#D9EBD1', style: 'hatch' },
    { label: '酸雨/污染带', swatch: '#B86158', style: 'dash' },
  ],
};

export function LayerToggles() {
  const activeLayers = useV2(s => s.state.activeLayers);
  const toggleLayer = useV2(s => s.toggleLayer);
  const [legendOpen, setLegendOpen] = useState(false);

  return (
    <div className="v2-layers">
      <div className="v2-layer-btns">
        {MAP_LAYERS.map(l => (
          <button
            key={l.id}
            className={`v2-layer-btn ${activeLayers.includes(l.id) ? 'active' : ''}`}
            onClick={() => toggleLayer(l.id)}
          >
            {l.name}
          </button>
        ))}
        <button className="v2-layer-btn legend" onClick={() => setLegendOpen(o => !o)} title="图例">图例</button>
      </div>
      {legendOpen && (
        <div className="v2-legend">
          {activeLayers.flatMap(id => LEGEND[id]).map((it, i) => (
            <div className="v2-legend-item" key={i}>
              <span className={`v2-legend-swatch ${it.style}`} style={{ background: it.swatch }} />
              <span className="v2-legend-label">{it.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
