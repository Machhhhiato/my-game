import { lazy, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { V2App } from './v2/ui/V2App';
import { TextIdleApp } from './v2/ui/TextIdleApp';
import { CampaignGlobeApp } from './v2/ui/CampaignGlobeApp';
import { useV2, startV2Loop } from './v2/store';
import { saveGameV6 } from './v2/save';
import './v2/v2.css';

const root = createRoot(document.getElementById('root')!);
const NationKernelInspector = lazy(() => import('./v2/ui/NationKernelInspector').then((module) => ({ default: module.NationKernelInspector })));
const UnifiedNationCampaignApp = lazy(() => import('./v2/ui/UnifiedNationCampaignApp').then((module) => ({ default: module.UnifiedNationCampaignApp })));
const StrategicCabinetApp = lazy(() => import('./v2/ui/StrategicCabinetApp').then((module) => ({ default: module.StrategicCabinetApp })));
const query = new URLSearchParams(window.location.search);
const kernelFixture = query.get('kernel');
const kernelInspectorFixture = query.get('kernelInspector') ?? (kernelFixture === 'unified' ? null : kernelFixture);
const showMapPrototype = query.get('map') === '1';
const showGlobalUnificationPlaytest = query.get('playtest') === 'r37';
const showLegacyTextPlaytest = query.get('text') === '1';

if (showGlobalUnificationPlaytest) {
  root.render(<Suspense fallback={<main />}><StrategicCabinetApp onExit={() => window.location.assign(window.location.pathname)} /></Suspense>);
} else if (kernelInspectorFixture != null) {
  root.render(<Suspense fallback={<main /> }><NationKernelInspector initialFixture={kernelInspectorFixture} /></Suspense>);
} else if (kernelFixture === 'unified') {
  root.render(<Suspense fallback={<main /> }><UnifiedNationCampaignApp onExit={() => window.location.assign(window.location.pathname)} /></Suspense>);
} else if (showMapPrototype) {
  root.render(<V2App />);
  startV2Loop();
  window.addEventListener('beforeunload', () => saveGameV6(useV2.getState().state));
} else if (showLegacyTextPlaytest) {
  root.render(<TextIdleApp />);
} else {
  root.render(<CampaignGlobeApp />);
}

// R38 defaults to the shared 3D ground campaign; ?text=1 and ?map=1 retain legacy fixtures.
