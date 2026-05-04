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

// Расчёт пути S и координаты X для конкретного колена (leg)
export function calcPathAndCoords(Z: number, H: number, betaDeg: number, leg: number, arrow: number) {
  const rad = betaDeg * DEG;
  const cosB = Math.cos(rad);
  const sinB = Math.sin(rad);
  if (cosB === 0 || Z < 0 || Z > H) return { S: 0, X: 0 };

  // Вертикальный путь до глубины Z на заданном колене
  let verticalPath: number;
  if (leg % 2 === 0) {
    // Чётное колено (0, 2, 4...) → луч идёт вниз
    verticalPath = leg * H + Z;
  } else {
    // Нечётное колено (1, 3, 5...) → луч идёт вверх после отражения от дна
    verticalPath = leg * H + (H - Z);
  }

  const S = verticalPath / cosB;
  const X_from_entry = S * sinB;
  const X_from_front = X_from_entry - arrow; // Расстояние от переднего торца ПЭП
  return { S: Math.round(S), X: Math.round(X_from_front) };
}
