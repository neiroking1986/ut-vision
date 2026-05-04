export interface RaySegment { x1: number; y1: number; x2: number; y2: number; length: number; }
export interface BeamFan { left6: RaySegment[]; right6: RaySegment[]; left20: RaySegment[]; right20: RaySegment[]; }

const DEG = Math.PI / 180;

export function calcAcoustics(freqMHz: number, diameterMM: number, csMS: number) {
  const lambda = (csMS / (freqMHz * 1e6)) * 1e3;
  const theta6 = Math.asin(0.51 * lambda / diameterMM) / DEG;
  const theta20 = Math.asin(0.87 * lambda / diameterMM) / DEG;
  return { lambda, theta6, theta20 };
}

export function traceRay(x0: number, angleDeg: number, thickness: number, maxBounces: number, side: 1 | 2): RaySegment[] {
  const segments: RaySegment[] = [];
  let x = x0, y = 0;
  const rad = angleDeg * DEG;
  let dirX = side === 1 ? Math.sin(rad) : -Math.sin(rad);
  let dirY = Math.cos(rad);
  
  for (let i = 0; i <= maxBounces; i++) {
    const nextY = dirY > 0 ? thickness : 0;
    const dt = (nextY - y) / dirY;
    const nextX = x + dirX * dt;
    const len = Math.sqrt((nextX - x) ** 2 + (nextY - y) ** 2);
    segments.push({ x1: x, y1: y, x2: nextX, y2: nextY, length: len });
    x = nextX; y = nextY; dirY = -dirY;
  }
  return segments;
}

export function calcBeamFan(x0: number, beta: number, theta6: number, theta20: number, H: number, N: number, side: 1 | 2): BeamFan {
  return {
    left6: traceRay(x0, beta - theta6, H, N, side),
    right6: traceRay(x0, beta + theta6, H, N, side),
    left20: traceRay(x0, beta - theta20, H, N, side),
    right20: traceRay(x0, beta + theta20, H, N, side),
  };
}

// Расчёт акустического пути S до глубины Z
export function calcSoundPath(Z: number, H: number, betaDeg: number, side: 1 | 2): number {
  const rad = betaDeg * DEG;
  const cosB = Math.cos(rad);
  if (cosB === 0) return Infinity;
  
  // Определяем номер прохода
  const passes = Math.floor(Z / H);
  const remainder = Z % H;
  const verticalDist = passes * H + (passes % 2 === 0 ? remainder : H - remainder);
  return verticalDist / cosB;
}

// Граница валика усиления
export function getReinforcementLimit(B1: number, e: number): number {
  return B1 / 2 + e + 2; // +2 мм запас на скругление
}
