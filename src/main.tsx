import { createRoot } from 'react-dom/client';
import { V2App } from './v2/ui/V2App';
import { useV2, startV2Loop } from './v2/store';
import { saveGameV2 } from './v2/save';
import './v2/v2.css';

const root = createRoot(document.getElementById('root')!);
root.render(<V2App />);
startV2Loop();
window.addEventListener('beforeunload', () => saveGameV2(useV2.getState().state));

// 验收截图参数：
//   ?shot=far      默认远景完整星球（无浮窗）
//   ?shot=medium   翡翠河谷中景（三层均开，相机/图层由 PlanetCanvas 设置）
//   ?shot=close    河谷近景功能区群（三层均开）
//   ?shot=object   选中翡翠河谷外拓营，显示锚定对象浮窗
//   ?shot=ledger   点击精密备件，显示锚定资源账
const params = new URLSearchParams(window.location.search);
const mode = params.get('shot');
if (mode === 'object') {
  setTimeout(() => useV2.getState().selectNode('valley_outpost'), 900);
} else if (mode === 'ledger') {
  setTimeout(() => {
    const btn = document.querySelector<HTMLElement>('[data-res="precisionParts"]');
    btn?.click();
  }, 900);
}
