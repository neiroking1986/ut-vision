export interface RaySegment { x1: number; y1: number; x2: number; y2: number }
export interface BeamFan {
  left6: RaySegment[]; right6: RaySegment[];
  left20: RaySegment[]; right20: RaySegment[];
}

const DEG = Math.PI / 180;

export function calcAcoustics(freqMHz: number, diameterMM: number, csMS: number) {
  const lambda = (csMS / (freqMHz * 1e6)) * 1e3;
  const theta6 = Math.asin(0.51 * lambda / diameterMM) / DEG;
  const theta20 = Math.asin(0.87 * lambda / diameterMM) / DEG;
  return { lambda, theta6, theta20 };
}

export function traceRay(x0: number, angleDeg: number, thickness: number, maxBounces: number): RaySegment[] {
  const segments: RaySegment[] = [];
  let x = x0, y = 0;
  let dirX = Math.sin(angleDeg * DEG);
  let dirY = Math.cos(angleDeg * DEG);
  
  for (let i = 0; i <= maxBounces; i++) {
    const nextY = dirY > 0 ? thickness : 0;
    const dt = (nextY - y) / dirY;
    const nextX = x + dirX * dt;
    segments.push({ x1: x, y1: y, x2: nextX, y2: nextY });
    x = nextX; y = nextY; dirY = -dirY;
  }
  return segments;
}

export function calcBeamFan(x0: number, beta: number, theta6: number, theta20: number, H: number, N: number): BeamFan {
  return {
    left6: traceRay(x0, beta - theta6, H, N),
    right6: traceRay(x0, beta + theta6, H, N),
    left20: traceRay(x0, beta - theta20, H, N),
    right20: traceRay(x0, beta + theta20, H, N),
  };
}
