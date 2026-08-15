import { createRoot } from 'react-dom/client';
import App from './App';
import WidgetStandalone from './ui/WidgetMode';
import { startGameLoop } from './store/useGame';
import { E } from './engine';
import './styles.css';

const params = new URLSearchParams(window.location.search);
const root = createRoot(document.getElementById('root')!);

if (params.has('widget')) {
  document.body.classList.add('widget-body-mode');
  root.render(<WidgetStandalone />);
} else {
  root.render(<App />);
  startGameLoop();
  window.addEventListener('beforeunload', () => E.save());
}
