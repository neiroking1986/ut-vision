import { create } from 'zustand';
import peps from '../data/peps.json';
import materials from '../data/materials.json';

export interface Reflector {
  id: number; x: number; y: number; desc: string; status: 'ok' | 'fail';
  binding: 'axis' | 'pep'; weldCode: string; weldDate: string; partType: string;
  leg: number; // Номер колена (0=прямой, 1=однократно отражённый и т.д.)
  Z: number; X: number; S: number;
}

interface ActData {
  actNumber: string; certificateNumber: string; customer: string;
  tuOpo: string; programNumber: string; weldingMethod: string;
  welderName: string; welderStamp: string; methodology: string;
  equipment: string; verificationCert: string; standard: string;
  criteria: string; operatorName: string; labHeadName: string; commissionMember: string;
}

interface State {
  pep: typeof peps[0] & { bounces: number; arrow: number };
  material: typeof materials[0];
  weld: { L1: number; L2: number; H: number; H1: number; H2: number; B1: number; B2: number; B3: number; e: number };
  side: 1 | 2;
  gost: 'none' | '16037' | '5264';
  pepFrontX: number;
  canvas: { scale: number; panX: number; panY: number };
  reflectors: Reflector[];
  actData: ActData;
  showScheme: boolean;
  setPep: (p: typeof peps[0]) => void;
  setMaterial: (m: typeof materials[0]) => void;
  setPepFrontX: (x: number) => void;
  setArrow: (a: number) => void;
  setBounces: (n: number) => void;
  setSide: (s: 1 | 2) => void;
  setGost: (g: State['gost']) => void;
  setWeld: (w: Partial<State['weld']>) => void;
  setCanvas: (c: Partial<State['canvas']>) => void;
  addReflector: () => void;
  removeReflector: (id: number) => void;
  updateReflector: (id: number, data: Partial<Reflector>) => void;
  setActData: (d: Partial<ActData>) => void;
  toggleScheme: () => void;
}

export const useStore = create<State>((set) => ({
  pep: { ...peps[1], bounces: 2, arrow: 15 },
  material: materials[0],
  weld: { L1: 100, L2: 100, H: 32, H1: 14, H2: 4, B1: 48, B2: 24, B3: 48, e: 3 },
  side: 1,
  gost: 'none',
  pepFrontX: -67,
  canvas: { scale: 5, panX: 0, panY: 0 },
  reflectors: [
    { id: 1, x: -19, y: 30, desc: '', status: 'ok', binding: 'axis', weldCode: 'КСС-1', weldDate: '', partType: '', leg: 0, Z: 30, X: 0, S: 0 },
    { id: 2, x: 14, y: 10, desc: '', status: 'ok', binding: 'axis', weldCode: 'КСС-2', weldDate: '', partType: '', leg: 1, Z: 10, X: 0, S: 0 }
  ],
  actData: {
    actNumber: '001', certificateNumber: '______', customer: '',
    tuOpo: '', programNumber: '', weldingMethod: 'РД',
    welderName: '', welderStamp: '', methodology: 'СТО/РД/ГОСТ',
    equipment: 'УД А1212 МАСТЕР', verificationCert: '№ ПОВ-XXX/123456/ДД-ММ-ГГГГ до ДД-ММ-ГГГГ',
    standard: 'ГОСТ Р 55724-2013', criteria: 'По НД',
    operatorName: '', labHeadName: '', commissionMember: ''
  },
  showScheme: false,
  setPep: (p) => set({ pep: { ...p, bounces: 2, arrow: p.arrow || 15 } }),
  setMaterial: (m) => set({ material: m }),
  setPepFrontX: (x) => set({ pepFrontX: x }),
  setArrow: (a) => set((s) => ({ pep: { ...s.pep, arrow: a } })),
  setBounces: (n) => set((s) => ({ pep: { ...s.pep, bounces: n } })),
  setSide: (s) => set({ side: s }),
  setGost: (g) => set({ gost: g }),
  setWeld: (w) => set((s) => ({ weld: { ...s.weld, ...w } })),
  setCanvas: (c) => set((s) => ({ canvas: { ...s.canvas, ...c } })),
  addReflector: () => set((s) => ({ reflectors: [...s.reflectors, { id: Date.now(), x: 0, y: 15, desc: '', status: 'ok', binding: 'axis', weldCode: `КСС-${s.reflectors.length+1}`, weldDate: '', partType: '', leg: 0, Z: 15, X: 0, S: 0 }] })),
  removeReflector: (id) => set((s) => ({ reflectors: s.reflectors.filter(r => r.id !== id) })),
  updateReflector: (id, data) => set((s) => ({ reflectors: s.reflectors.map(r => r.id === id ? { ...r, ...data } : r) })),
  setActData: (d) => set((s) => ({ actData: { ...s.actData, ...d } })),
  toggleScheme: () => set((s) => ({ showScheme: !s.showScheme })),
}));
