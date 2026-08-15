import { TopToolbar } from './TopToolbar';
import { LeftRail } from './LeftRail';
import { PlanetCanvas } from './PlanetCanvas';
import { LayerToggles } from './LayerToggles';
import { EventLog } from './EventLog';
import { ObserverDrawer } from './ObserverDrawer';
import { CommandBar } from './CommandBar';
import { ResourceLedger } from './ResourceLedger';
import { OperationPanel } from './OperationPanel';
import { ObjectPanel } from './ObjectPanel';
import { RetirementNotice } from './RetirementNotice';
import { useV2 } from '../store';

export function V2App() {
  const resourceLedger = useV2(s => s.resourceLedger);
  const panel = useV2(s => s.panel);
  const openResource = useV2(s => s.openResource);
  const setPanel = useV2(s => s.setPanel);
  const hasFloat = resourceLedger !== null || panel !== null;

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
      {hasFloat && (
        <div
          className="v2-backdrop"
          onClick={() => { openResource(null); setPanel(null); }}
        />
      )}
      <ResourceLedger />
      <OperationPanel />
      <RetirementNotice />
    </div>
  );
}
