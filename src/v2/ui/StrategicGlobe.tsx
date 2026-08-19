import { useEffect, useRef, useState } from 'react';
import { mapEntityLonLat, type MapBriefing, type MapEntity } from '../textIdle/strategicMapModel';

type Point = { x: number; y: number; visible: boolean };

function project(lon: number, lat: number, rotation: number, tilt: number, width: number, height: number): Point {
  const radius = Math.min(width, height) * 0.37;
  const lambda = (lon - rotation) * Math.PI / 180;
  const phi = lat * Math.PI / 180;
  const pitch = tilt * Math.PI / 180;
  const x = Math.cos(phi) * Math.sin(lambda);
  const y = Math.sin(phi) * Math.cos(pitch) - Math.cos(phi) * Math.cos(lambda) * Math.sin(pitch);
  const z = Math.sin(phi) * Math.sin(pitch) + Math.cos(phi) * Math.cos(lambda) * Math.cos(pitch);
  return { x: width / 2 + x * radius, y: height / 2 - y * radius, visible: z > 0.02 };
}

function colorFor(entity: MapEntity): string {
  if (entity.status === 'warning') return '#ee806d';
  if (entity.status === 'active') return '#ffe28a';
  if (entity.kind === 'settlement') return '#8fe2c4';
  if (entity.kind === 'site') return '#8bc6ff';
  if (entity.kind === 'facility') return '#e6b86f';
  if (entity.kind === 'population') return '#d9b7ff';
  if (entity.status === 'blocked') return '#6c7684';
  return '#c8d3aa';
}

function drawGlobe(ctx: CanvasRenderingContext2D, briefing: MapBriefing, rotation: number, tilt: number, selectedId: string | null, width: number, height: number): Map<string, Point> {
  const cx = width / 2, cy = height / 2, radius = Math.min(width, height) * 0.37;
  ctx.clearRect(0, 0, width, height);
  const background = ctx.createRadialGradient(cx * .75, cy * .2, 5, cx, cy, Math.max(width, height));
  background.addColorStop(0, '#1c2838'); background.addColorStop(.58, '#0b111b'); background.addColorStop(1, '#05080d');
  ctx.fillStyle = background; ctx.fillRect(0, 0, width, height);
  for (let index = 0; index < 72; index += 1) {
    const x = (index * 131 + 47) % width; const y = (index * 79 + 23) % height;
    const alpha = .08 + ((index * 19) % 10) / 100;
    ctx.fillStyle = `rgba(210,232,255,${alpha})`; ctx.fillRect(x, y, index % 4 === 0 ? 2 : 1, 1);
  }
  const ocean = ctx.createRadialGradient(cx - radius * .32, cy - radius * .38, radius * .1, cx, cy, radius * 1.15);
  ocean.addColorStop(0, '#355c68'); ocean.addColorStop(.57, '#18333c'); ocean.addColorStop(.9, '#0e2029'); ocean.addColorStop(1, '#07131b');
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.fillStyle = ocean; ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.clip();
  for (let latitude = -60; latitude <= 60; latitude += 30) {
    ctx.beginPath();
    for (let longitude = -180; longitude <= 180; longitude += 4) {
      const point = project(longitude, latitude, rotation, tilt, width, height);
      if (longitude === -180) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = 'rgba(177,220,211,.13)'; ctx.lineWidth = 1; ctx.stroke();
  }
  for (let longitude = -150; longitude < 180; longitude += 30) {
    ctx.beginPath();
    for (let latitude = -86; latitude <= 86; latitude += 4) {
      const point = project(longitude, latitude, rotation, tilt, width, height);
      if (latitude === -86) ctx.moveTo(point.x, point.y); else ctx.lineTo(point.x, point.y);
    }
    ctx.strokeStyle = 'rgba(177,220,211,.10)'; ctx.lineWidth = 1; ctx.stroke();
  }
  for (let continent = 0; continent < 7; continent += 1) {
    const lon = -145 + continent * 48 + Math.sin(rotation / 26 + continent) * 12;
    const lat = -42 + ((continent * 37) % 80);
    const p = project(lon, lat, rotation, tilt, width, height);
    if (!p.visible) continue;
    const size = radius * (.12 + (continent % 3) * .03);
    ctx.beginPath(); ctx.ellipse(p.x, p.y, size, size * .48, continent * .63, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(94,126,85,.30)'; ctx.fill();
  }
  ctx.restore();
  ctx.beginPath(); ctx.arc(cx, cy, radius, 0, Math.PI * 2); ctx.strokeStyle = 'rgba(176,225,229,.45)'; ctx.lineWidth = 1.4; ctx.stroke();
  const points = new Map<string, Point>();
  for (const entity of briefing.entities) points.set(entity.id, project(...mapEntityLonLat(entity), rotation, tilt, width, height));
  for (const route of briefing.routes) {
    const a = project(...mapEntityLonLat({ geoRef: route.from }), rotation, tilt, width, height);
    const b = project(...mapEntityLonLat({ geoRef: route.to }), rotation, tilt, width, height);
    if (!a.visible || !b.visible) continue;
    ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.quadraticCurveTo((a.x + b.x) / 2, (a.y + b.y) / 2 - radius * .08, b.x, b.y);
    ctx.strokeStyle = route.status === 'active' ? 'rgba(255,226,138,.85)' : route.status === 'known' ? 'rgba(143,226,196,.7)' : 'rgba(176,193,169,.27)';
    ctx.setLineDash(route.status === 'planned' ? [3, 6] : []); ctx.lineWidth = route.status === 'active' ? 2 : 1; ctx.stroke(); ctx.setLineDash([]);
  }
  for (const entity of briefing.entities) {
    const point = points.get(entity.id)!; if (!point.visible) continue;
    const selected = entity.id === selectedId;
    const radiusPx = entity.kind === 'settlement' ? 8 : selected ? 7 : 5;
    ctx.beginPath(); ctx.arc(point.x, point.y, radiusPx + (selected ? 5 : 0), 0, Math.PI * 2); ctx.fillStyle = selected ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.24)'; ctx.fill();
    ctx.beginPath(); ctx.arc(point.x, point.y, radiusPx, 0, Math.PI * 2); ctx.fillStyle = colorFor(entity); ctx.fill();
    ctx.strokeStyle = '#071018'; ctx.lineWidth = 1.5; ctx.stroke();
    if (selected || entity.status === 'active' || entity.kind === 'settlement') {
      ctx.font = '600 12px system-ui'; ctx.fillStyle = '#f1f7ed'; ctx.textAlign = 'center'; ctx.fillText(entity.label, point.x, point.y - radiusPx - 9);
    }
  }
  return points;
}

export function StrategicGlobe({ briefing, selectedId, onSelect }: { briefing: MapBriefing; selectedId: string | null; onSelect: (entity: MapEntity) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(22);
  const [tilt, setTilt] = useState(-18);
  const drag = useRef<{ x: number; y: number; rotation: number; tilt: number } | null>(null);
  const points = useRef<Map<string, Point>>(new Map());
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return undefined;
    const resize = () => {
      const rect = canvas.getBoundingClientRect(); const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(rect.width * dpr); canvas.height = Math.floor(rect.height * dpr);
      const ctx = canvas.getContext('2d')!; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points.current = drawGlobe(ctx, briefing, rotation, tilt, selectedId, rect.width, rect.height);
    };
    resize(); const observer = new ResizeObserver(resize); observer.observe(canvas); return () => observer.disconnect();
  }, [briefing, rotation, tilt, selectedId]);
  const pointerUp = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = event.currentTarget; const wasDrag = drag.current; drag.current = null; canvas.releasePointerCapture(event.pointerId);
    if (!wasDrag) return;
    const dx = Math.abs(event.clientX - wasDrag.x); const dy = Math.abs(event.clientY - wasDrag.y);
    if (dx + dy > 6) return;
    const rect = canvas.getBoundingClientRect(); let nearest: MapEntity | null = null; let distance = 22;
    for (const entity of briefing.entities) {
      const point = points.current.get(entity.id); if (!point?.visible) continue;
      const d = Math.hypot(point.x - (event.clientX - rect.left), point.y - (event.clientY - rect.top));
      if (d < distance) { distance = d; nearest = entity; }
    }
    if (nearest) onSelect(nearest);
  };
  return <canvas ref={canvasRef} className="campaign-globe-canvas" aria-label="可旋转的共同体星球地图" onPointerDown={(event) => { drag.current = { x: event.clientX, y: event.clientY, rotation, tilt }; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerMove={(event) => { const current = drag.current; if (!current) return; setRotation(current.rotation - (event.clientX - current.x) * .32); setTilt(Math.max(-58, Math.min(58, current.tilt + (event.clientY - current.y) * .22))); }} onPointerUp={pointerUp} />;
}
