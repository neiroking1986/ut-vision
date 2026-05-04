import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { calcAcoustics, traceRay, calcBeamFan } from '../core/acoustics';

export default function UTCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pep, material, weld, pepX, setPepX, canvas, setCanvas, reflectors } = useStore();
  const isDragging = useRef(false);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const W = 800, H = 400;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2 + canvas.panX, 40 + canvas.panY);
    ctx.scale(canvas.scale, canvas.scale);

    // Шов
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-weld.L1, 0); ctx.lineTo(-weld.B1/2, 0);
    ctx.lineTo(-weld.B2/2, weld.H1); ctx.lineTo(-weld.B3/2, weld.H);
    ctx.lineTo(weld.B3/2, weld.H); ctx.lineTo(weld.B2/2, weld.H1);
    ctx.lineTo(weld.B1/2, 0); ctx.lineTo(weld.L2, 0);
    ctx.lineTo(weld.L2, weld.H); ctx.lineTo(-weld.L1, weld.H);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Ось шва
    ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([2, 2]); ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(0, weld.H + 5); ctx.stroke();
    ctx.setLineDash([]);

    // Акустика
    const ac = calcAcoustics(pep.freq, pep.diameter, material.cs);
    const xEntry = pepX + pep.arrow;
    const fan = calcBeamFan(xEntry, pep.angle, ac.theta6, ac.theta20, weld.H, pep.bounces);
    const centerRay = traceRay(xEntry, pep.angle, weld.H, pep.bounces);

    ctx.fillStyle = 'rgba(59,130,246,0.12)';
    ctx.beginPath();
    fan.left20.forEach(s => ctx.moveTo(s.x1, s.y1) || ctx.lineTo(s.x2, s.y2));
    fan.right20.reverse().forEach(s => ctx.lineTo(s.x2, s.y2));
    ctx.closePath(); ctx.fill();

    ctx.fillStyle = 'rgba(59,130,246,0.3)';
    ctx.beginPath();
    fan.left6.forEach(s => ctx.moveTo(s.x1, s.y1) || ctx.lineTo(s.x2, s.y2));
    fan.right6.reverse().forEach(s => ctx.lineTo(s.x2, s.y2));
    ctx.closePath(); ctx.fill();

    ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 1;
    ctx.beginPath(); centerRay.forEach(s => { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); }); ctx.stroke();

    // ПЭП
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pepX, -8, pep.dimsW, 8);
    ctx.fillStyle = '#fff'; ctx.font = '3px sans-serif';
    ctx.fillText(pep.name.split(' ')[0], pepX + 2, -3);

    // Отражатели
    reflectors.forEach(r => {
      const rx = r.binding === 'pep' ? pepX + pep.arrow + r.x : r.x;
      ctx.fillStyle = r.status === 'ok' ? '#16a34a' : '#dc2626';
      ctx.beginPath(); ctx.arc(rx, r.y, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.font = '2.5px sans-serif';
      ctx.fillText(`(${Math.round(rx)},${r.y})`, rx + 3, r.y - 2);
    });

    ctx.restore();
  }, [pep, material, weld, pepX, canvas, reflectors]);

  useEffect(() => { draw(); }, [draw]);

  const screenToWorld = (cx: number, cy: number) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: (cx - rect.left - rect.width/2 - canvas.panX) / canvas.scale,
      y: (cy - rect.top - 40 - canvas.panY) / canvas.scale
    };
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCanvas({ scale: Math.max(2, Math.min(15, canvas.scale * delta)) });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.shiftKey) { isPanning.current = true; lastPos.current = { x: e.clientX, y: e.clientY }; }
    else { isDragging.current = true; }
  };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning.current) {
      setCanvas({ panX: canvas.panX + e.clientX - lastPos.current.x, panY: canvas.panY + e.clientY - lastPos.current.y });
      lastPos.current = { x: e.clientX, y: e.clientY };
    } else if (isDragging.current) {
      const w = screenToWorld(e.clientX, e.clientY);
      setPepX(Math.round(w.x));
    }
  };
  const handleMouseUp = () => { isDragging.current = false; isPanning.current = false; };

  return (
    <canvas ref={canvasRef} width={800} height={400}
      className="border rounded bg-white cursor-grab active:cursor-grabbing shadow"
      onWheel={handleWheel} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
    />
  );
}
