import { useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { calcAcoustics, traceRay, calcBeamFan } from '../core/acoustics';

export default function UTCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { pep, material, weld, pepX, setPepX } = useStore();
  const isDragging = useRef(false);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;
    const W = 800, H = 400, scale = 5, offsetY = 40;
    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.translate(W / 2, offsetY);
    ctx.scale(scale, scale);

    // Шов
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(-weld.L1, 0); ctx.lineTo(-weld.B1/2, 0);
    ctx.lineTo(-weld.B2/2, weld.H1); ctx.lineTo(-weld.B3/2, weld.H);
    ctx.lineTo(weld.B3/2, weld.H); ctx.lineTo(weld.B2/2, weld.H1);
    ctx.lineTo(weld.B1/2, 0); ctx.lineTo(weld.L2, 0);
    ctx.lineTo(weld.L2, weld.H); ctx.lineTo(-weld.L1, weld.H);
    ctx.closePath(); ctx.fill(); ctx.stroke();

    // Акустика
    const ac = calcAcoustics(pep.freq, pep.diameter, material.cs);
    const xEntry = pepX + pep.arrow;
    const fan = calcBeamFan(xEntry, pep.angle, ac.theta6, ac.theta20, weld.H, pep.bounces);
    const centerRay = traceRay(xEntry, pep.angle, weld.H, pep.bounces);

    // Веер -20 дБ
    ctx.fillStyle = 'rgba(59,130,246,0.15)';
    ctx.beginPath();
    fan.left20.forEach(s => ctx.moveTo(s.x1, s.y1) || ctx.lineTo(s.x2, s.y2));
    fan.right20.reverse().forEach(s => ctx.lineTo(s.x2, s.y2));
    ctx.closePath(); ctx.fill();

    // Веер -6 дБ
    ctx.fillStyle = 'rgba(59,130,246,0.35)';
    ctx.beginPath();
    fan.left6.forEach(s => ctx.moveTo(s.x1, s.y1) || ctx.lineTo(s.x2, s.y2));
    fan.right6.reverse().forEach(s => ctx.lineTo(s.x2, s.y2));
    ctx.closePath(); ctx.fill();

    // Центральный луч
    ctx.strokeStyle = '#1d4ed8'; ctx.lineWidth = 1;
    ctx.beginPath();
    centerRay.forEach(s => { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); });
    ctx.stroke();

    // ПЭП
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pepX, -8, pep.dimsW, 8);
    ctx.fillStyle = '#fff'; ctx.font = '3px sans-serif';
    ctx.fillText(pep.name.split(' ')[0], pepX + 2, -3);

    ctx.restore();
  }, [pep, material, weld, pepX]);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width/2) / 5;
    setPepX(Math.round(x));
  };
  const handleMouseUp = () => { isDragging.current = false; };

  return (
    <canvas ref={canvasRef} width={800} height={400}
      className="border rounded bg-white cursor-grab active:cursor-grabbing shadow"
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}
    />
  );
}
