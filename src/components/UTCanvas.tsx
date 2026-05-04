import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { calcAcoustics, traceRay, calcBeamFan, getReinforcementLimit } from '../core/acoustics';

export default function UTCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pep, material, weld, side, pepFrontX, setPepFrontX, canvas, setCanvas, reflectors } = useStore();
  const isDragging = useRef(false);
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  const limit = getReinforcementLimit(weld.B1, weld.e);

  const draw = useCallback(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const W = 800, H = 400;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2 + canvas.panX, 40 + canvas.panY);
    ctx.scale(canvas.scale, canvas.scale);

    // Основной металл
    ctx.fillStyle = '#e2e8f0'; ctx.strokeStyle = '#64748b'; ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-weld.L1, 0); ctx.lineTo(-weld.B1/2, 0);
    ctx.lineTo(-weld.B2/2, weld.H1); ctx.lineTo(-weld.B3/2, weld.H);
    ctx.lineTo(weld.B3/2, weld.H); ctx.lineTo(weld.B2/2, weld.H1);
    ctx.lineTo(weld.B1/2, 0); ctx.lineTo(weld.L2, 0);
    ctx.lineTo(weld.L2, weld.H); ctx.lineTo(-weld.L1, weld.H);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Валик усиления (верх)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(-weld.B1/2 - 2, 0);
    ctx.quadraticCurveTo(0, -weld.e, weld.B1/2 + 2, 0);
    ctx.fill();

    // Ось шва
    ctx.strokeStyle = '#94a3b8'; ctx.setLineDash([2, 2]); ctx.lineWidth = 0.3;
    ctx.beginPath(); ctx.moveTo(0, -weld.e - 2); ctx.lineTo(0, weld.H + 5); ctx.stroke();
    ctx.setLineDash([]);

    // Точка ввода
    const xEntry = side === 1 ? pepFrontX + pep.arrow : pepFrontX - pep.arrow;
    
    // Акустика
    const ac = calcAcoustics(pep.freq, pep.diameter, material.cs);
    const fan = calcBeamFan(xEntry, pep.angle, ac.theta6, ac.theta20, weld.H, pep.bounces, side);
    const centerRay = traceRay(xEntry, pep.angle, weld.H, pep.bounces, side);

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
    if (side === 1) {
      ctx.fillRect(pepFrontX - pep.dimsW, -8, pep.dimsW, 8);
      ctx.fillStyle = '#fff'; ctx.font = '3px sans-serif';
      ctx.fillText(pep.name.split(' ')[0], pepFrontX - pep.dimsW + 2, -3);
    } else {
      ctx.fillRect(pepFrontX, -8, pep.dimsW, 8);
      ctx.fillStyle = '#fff'; ctx.font = '3px sans-serif';
      ctx.fillText(pep.name.split(' ')[0], pepFrontX + 2, -3);
    }

    // Точка ввода (маркер)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath(); ctx.arc(xEntry, 0, 1.5, 0, Math.PI*2); ctx.fill();

    // Отражатели
    reflectors.forEach(r => {
      const rx = r.binding === 'pep' ? (side === 1 ? pepFrontX + r.x : pepFrontX - r.x) : r.x;
      ctx.fillStyle = r.status === 'ok' ? '#16a34a' : '#dc2626';
      ctx.beginPath(); ctx.arc(rx, r.y, 2, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = '#000'; ctx.font = '2.5px sans-serif';
      ctx.fillText(`Z=${r.y} X=${Math.round(r.X)} S=${Math.round(r.S)}`, rx + 3, r.y - 2);
    });

    ctx.restore();
  }, [pep, material, weld, side, pepFrontX, canvas, reflectors]);

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
      let newX = Math.round(w.x);
      // Коллизия с валиком
      if (side === 1) newX = Math.min(newX, -limit);
      else newX = Math.max(newX, limit);
      setPepFrontX(newX);
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
