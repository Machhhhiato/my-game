import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { V2App } from './v2/ui/V2App';
import { TextIdleApp } from './v2/ui/TextIdleApp';
import { useV2, startV2Loop } from './v2/store';
import { saveGameV6 } from './v2/save';
import './v2/v2.css';

const root = createRoot(document.getElementById('root')!);
const NationKernelInspector = lazy(() => import('./v2/ui/NationKernelInspector').then((module) => ({ default: module.NationKernelInspector })));
const UnifiedNationCampaignApp = lazy(() => import('./v2/ui/UnifiedNationCampaignApp').then((module) => ({ default: module.UnifiedNationCampaignApp })));
const query = new URLSearchParams(window.location.search);
const kernelFixture = query.get('kernel');
const kernelInspectorFixture = query.get('kernelInspector') ?? (kernelFixture === 'unified' ? null : kernelFixture);
const showMapPrototype = query.get('map') === '1';

if (kernelInspectorFixture != null) {
  root.render(<Suspense fallback={<main /> }><NationKernelInspector initialFixture={kernelInspectorFixture} /></Suspense>);
} else if (kernelFixture === 'unified') {
  root.render(<Suspense fallback={<main /> }><UnifiedNationCampaignApp onExit={() => window.location.assign(window.location.pathname)} /></Suspense>);
} else if (showMapPrototype) {
  root.render(<V2App />);
  startV2Loop();
  window.addEventListener('beforeunload', () => saveGameV6(useV2.getState().state));
} else {
  root.render(<TextIdleApp />);
}

// 默认是 R10 文字挂机验证层；保留 ?map=1 进入既有地图原型。
