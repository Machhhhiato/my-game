import { TopToolbar } from './TopToolbar';
import { LeftRail } from './LeftRail';
import { PlanetCanvas } from './PlanetCanvas';
import { LayerToggles } from './LayerToggles';
import { EventLog } from './EventLog';
import { ObserverDrawer } from './ObserverDrawer';
import { CommandBar } from './CommandBar';
import { OperationPanel } from './OperationPanel';
import { ObjectPanel } from './ObjectPanel';
import { RetirementNotice } from './RetirementNotice';
import { useV2 } from '../store';

export function V2App() {
  const panel = useV2(s => s.panel);
  const setPanel = useV2(s => s.setPanel);

  return (
    <div className="v2-app">
      <TopToolbar />
      <div className="v2-mid">
        <LeftRail />
        <main className="v2-map">
          <PlanetCanvas />
          <LayerToggles />
          <EventLog />
          <ObjectPanel />
          <ObserverDrawer />
        </main>
      </div>
      <CommandBar />
      {panel !== null && (
        <div className="v2-backdrop" onClick={() => setPanel(null)} />
      )}
      <OperationPanel />
      <RetirementNotice />
    </div>
  );
}
