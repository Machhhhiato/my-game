import { useGame } from './store/useGame';
import { TopBar } from './ui/TopBar';
import { NavPanel } from './ui/NavPanel';
import { BuildMenu } from './ui/BuildMenu';
import { ColonyView } from './ui/ColonyView';
import { WorldView } from './ui/WorldView';
import { SolarView } from './ui/SolarView';
import { GalaxyView } from './ui/GalaxyView';
import { ColonistBar } from './ui/ColonistBar';
import { DetailsPanel } from './ui/DetailsPanel';
import { TargetPanel } from './ui/TargetPanel';
import { EventLog } from './ui/EventLog';
import { TimeControls } from './ui/TimeControls';
import { ResearchPanel } from './ui/ResearchPanel';
import { SpacePanel } from './ui/SpacePanel';
import { LogPanel } from './ui/LogPanel';
import { SettingsPanel } from './ui/SettingsPanel';
import { Overlays } from './ui/Overlays';
import { MiniPanel } from './ui/WidgetMode';
import { isTauri } from './lib/tauri';

export default function App() {
  const view = useGame(s => s.view);
  const showBuildMenu = useGame(s => s.showBuildMenu);
  const miniOpen = useGame(s => s.miniOpen);
  const era = useGame(s => s.state.era);

  return (
    <div className="app">
      <TopBar />
      <div className="mid">
        <NavPanel />
        <main className="center">
          {view === 'colony' && (era === 'colony' ? <WorldView /> : era === 'solar' ? <SolarView /> : <GalaxyView />)}
          {view === 'ground' && <ColonyView />}
          {view === 'research' && <ResearchPanel />}
          {view === 'space' && <SpacePanel />}
          {view === 'log' && <LogPanel />}
          {view === 'settings' && <SettingsPanel />}
        </main>
        <aside className="log-rail">
          <EventLog />
        </aside>
        <aside className="info-rail">
          <DetailsPanel />
          <TargetPanel />
        </aside>
      </div>
      <div className="bottom">
        <ColonistBar />
        <TimeControls />
      </div>
      {showBuildMenu && view === 'colony' && <BuildMenu />}
      <Overlays />
      {miniOpen && !isTauri && <MiniPanel />}
    </div>
  );
}
