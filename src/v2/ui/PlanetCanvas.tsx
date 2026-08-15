import { useEffect, useRef } from 'react';
import { useV2 } from '../store';
import {
  drawPlanetMap, hitNode, focusCamera, lonLatToScreen, PLANE_ZOOM, type MapCamera, type MapViewport,
} from '../render/planetMap';

export function PlanetCanvas() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vpRef = useRef<MapViewport>({ width: 800, height: 600 });

  const shot = new URLSearchParams(window.location.search).get('shot');
  const focus = focusCamera(41.5, 16.0);
  const camRef = useRef<MapCamera>({
    zoom: shot === 'medium' ? 3.2 : shot === 'close' ? 7.0 : 1.5,
    rot: focus.rot,
    pitch: shot === 'close' ? focusCamera(40.6, 16.4).pitch : focus.pitch,
  });
  const dragRef = useRef<{ sx: number; sy: number; rot: number; pitch: number } | null>(null);
  const draggedRef = useRef(false);
  const interactingRef = useRef(false);
  const dirtyRef = useRef(true);
  const hoverRef = useRef<string | null>(null);
  const lastInputRef = useRef(performance.now());
  const lastSpinRef = useRef(0);
  const lastFocusSeqRef = useRef(0);
  const lastSelRef = useRef<string | null>(null);
  const lastLayersRef = useRef<string>('');

  useEffect(() => {
    if (shot === 'medium' || shot === 'close') {
      useV2.getState().setActiveLayers(['political', 'population', 'ecology']);
    }
  }, [shot]);

  // 全幅画布：测量容器尺寸，作为逻辑视口
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      vpRef.current = { width: Math.max(320, r.width), height: Math.max(240, r.height) };
      useV2.getState().setMapSize(r.width, r.height);
      dirtyRef.current = true;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const updateAnchor = () => {
    const snap = useV2.getState();
    const id = snap.selectedNodeId;
    if (!id) {
      if (snap.selectedAnchor) snap.setSelectedAnchor(null);
      return;
    }
    const node = snap.state.nodes.find(n => n.id === id);
    if (!node) return;
    const p = lonLatToScreen(node.lon, node.lat, camRef.current, vpRef.current);
    const prev = snap.selectedAnchor;
    if (!prev || Math.abs(prev.x - p.x) > 3 || Math.abs(prev.y - p.y) > 3 || prev.visible !== p.visible) {
      snap.setSelectedAnchor({ x: p.x, y: p.y, visible: p.visible });
    }
  };

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last);
      last = now;
      const cam = camRef.current;
      const snap = useV2.getState();
      const vp = vpRef.current;
      let needDraw = false;

      if (now - lastInputRef.current > 8000 && cam.zoom < PLANE_ZOOM && !interactingRef.current) {
        if (now - lastSpinRef.current > 100) {
          lastSpinRef.current = now;
          cam.rot += 0.00005 * (dt / 16.7);
          needDraw = true;
        }
      }

      if (snap.focusSeq !== lastFocusSeqRef.current) {
        lastFocusSeqRef.current = snap.focusSeq;
        const node = snap.state.nodes.find(n => n.id === snap.focusNodeId);
        if (node) {
          const f = focusCamera(node.lon, node.lat);
          cam.rot = f.rot;
          cam.pitch = f.pitch;
          cam.zoom = Math.max(cam.zoom, 4.0);
          lastInputRef.current = performance.now();
        }
        needDraw = true;
      }

      const layerKey = snap.state.activeLayers.join(',');
      if (snap.selectedNodeId !== lastSelRef.current || layerKey !== lastLayersRef.current) {
        lastSelRef.current = snap.selectedNodeId;
        lastLayersRef.current = layerKey;
        needDraw = true;
      }

      if (dirtyRef.current || needDraw) {
        dirtyRef.current = false;
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext('2d');
          if (ctx) {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            const bw = Math.round(vp.width * dpr), bh = Math.round(vp.height * dpr);
            if (canvas.width !== bw || canvas.height !== bh) {
              canvas.width = bw;
              canvas.height = bh;
            }
            drawPlanetMap(ctx, snap.state, cam, snap.state.activeLayers, snap.selectedNodeId, hoverRef.current, interactingRef.current, vp);
          }
        }
        updateAnchor();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const toPx = (e: { clientX: number; clientY: number; currentTarget: HTMLCanvasElement }) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    dragRef.current = { sx: p.x, sy: p.y, rot: camRef.current.rot, pitch: camRef.current.pitch };
    draggedRef.current = false;
    interactingRef.current = true;
    lastInputRef.current = performance.now();
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    const vp = vpRef.current;
    if (dragRef.current) {
      const dx = p.x - dragRef.current.sx;
      const dy = p.y - dragRef.current.sy;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) draggedRef.current = true;
      if (camRef.current.zoom >= PLANE_ZOOM) {
        const ppd = 22 * camRef.current.zoom;
        const c = { lon: (((camRef.current.rot + 0.5) % 1) + 1) % 1 * 360, lat: -camRef.current.pitch / (Math.PI / 180) };
        camRef.current.rot = ((c.lon - dx / ppd) / 360 - 0.5 + 1) % 1;
        camRef.current.pitch = Math.max(-1.2, Math.min(1.2, -(c.lat + dy / ppd) * (Math.PI / 180)));
      } else {
        camRef.current.rot = dragRef.current.rot - dx * 0.006;
        camRef.current.pitch = Math.max(-1.2, Math.min(1.2, dragRef.current.pitch + dy * 0.004));
      }
      dirtyRef.current = true;
      e.currentTarget.style.cursor = 'grabbing';
      return;
    }
    const s = useV2.getState();
    const id = hitNode(s.state, p.x, p.y, camRef.current, vp);
    e.currentTarget.style.cursor = id ? 'pointer' : 'grab';
    if (id !== hoverRef.current) {
      hoverRef.current = id;
      dirtyRef.current = true;
    }
  };

  const onPointerUp = () => {
    dragRef.current = null;
    interactingRef.current = false;
    dirtyRef.current = true;
  };

  const onWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    lastInputRef.current = performance.now();
    const cam = camRef.current;
    cam.zoom = Math.max(1, Math.min(10, cam.zoom * (e.deltaY < 0 ? 1.15 : 0.87)));
    dirtyRef.current = true;
  };

  const onClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggedRef.current) return;
    const p = toPx(e);
    const s = useV2.getState();
    const id = hitNode(s.state, p.x, p.y, camRef.current, vpRef.current);
    if (id) {
      s.selectNode(s.selectedNodeId === id ? null : id);
    } else {
      s.selectNode(null);
    }
    dirtyRef.current = true;
  };

  const onDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const p = toPx(e);
    const s = useV2.getState();
    const id = hitNode(s.state, p.x, p.y, camRef.current, vpRef.current);
    if (id) {
      const node = s.state.nodes.find(n => n.id === id);
      if (node) {
        const f = focusCamera(node.lon, node.lat);
        camRef.current.rot = f.rot;
        camRef.current.pitch = f.pitch;
        camRef.current.zoom = Math.min(10, Math.max(camRef.current.zoom, 5.0));
        lastInputRef.current = performance.now();
        dirtyRef.current = true;
      }
    }
  };

  return (
    <div className="v2-canvas-box" ref={wrapRef}>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={() => { dragRef.current = null; interactingRef.current = false; hoverRef.current = null; dirtyRef.current = true; }}
        onClick={onClick}
        onDoubleClick={onDoubleClick}
        onWheel={onWheel}
      />
    </div>
  );
}
