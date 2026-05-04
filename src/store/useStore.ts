import { create } from 'zustand';
import peps from '../data/peps.json';
import materials from '../data/materials.json';

export interface Reflector {
  id: number; x: number; y: number; desc: string; status: 'ok' | 'fail';
  binding: 'axis' | 'pep'; weldCode: string; weldDate: string; partType: string;
}

interface ActData {
  actNumber: string; certificateNumber: string; customer: string;
  tuOpo: string; programNumber: string; weldingMethod: string;
  welderName: string; welderStamp: string; methodology: string;
  equipment: string; verificationCert: string; standard: string;
  criteria: string; operatorName: string; labHeadName: string; commissionMember: string;
}

interface State {
  pep: typeof peps[0] & { bounces: number };
  material: typeof materials[0];
  weld: { L1: number; L2: number; H: number; H1: number; H2: number; B1: number; B2: number; B3: number };
  pepX: number;
  canvas: { scale: number; panX: number; panY: number };
  reflectors: Reflector[];
  actData: ActData;
  setPep: (p: typeof peps[0]) => void;
  setMaterial: (m: typeof materials[0]) => void;
  setPepX: (x: number) => void;
  setBounces: (n: number) => void;
  setWeld: (w: Partial<State['weld']>) => void;
  setCanvas: (c: Partial<State['canvas']>) => void;
  addReflector: () => void;
  removeReflector: (id: number) => void;
  updateReflector: (id: number, data: Partial<Reflector>) => void;
  setActData: (data: Partial<ActData>) => void;
}

export const useStore = create<State>((set) => ({
  pep: { ...peps[1], bounces: 2 },
  material: materials[0],
  weld: { L1: 100, L2: 100, H: 32, H1: 14, H2: 4, B1: 48, B2: 24, B3: 48 },
  pepX: -67,
  canvas: { scale: 5, panX: 0, panY: 0 },
  reflectors: [
    { id: 1, x: -19, y: 30, desc: '', status: 'ok', binding: 'axis', weldCode: 'КСС-1', weldDate: '', partType: '' },
    { id: 2, x: 14, y: 10, desc: '', status: 'ok', binding: 'axis', weldCode: 'КСС-2', weldDate: '', partType: '' }
  ],
  actData: {
    actNumber: '001', certificateNumber: '______', customer: '',
    tuOpo: '', programNumber: '', weldingMethod: 'РД',
    welderName: '', welderStamp: '', methodology: 'СТО/РД/ГОСТ',
    equipment: 'УД А1212 МАСТЕР', verificationCert: '№ ПОВ-XXX/123456/ДД-ММ-ГГГГ до ДД-ММ-ГГГГ',
    standard: 'ГОСТ Р 55724-2013', criteria: 'По НД',
    operatorName: '', labHeadName: '', commissionMember: ''
  },
  setPep: (p) => set({ pep: { ...p, bounces: 2 } }),
  setMaterial: (m) => set({ material: m }),
  setPepX: (x) => set({ pepX: x }),
  setBounces: (n) => set((s) => ({ pep: { ...s.pep, bounces: n } })),
  setWeld: (w) => set((s) => ({ weld: { ...s.weld, ...w } })),
  setCanvas: (c) => set((s) => ({ canvas: { ...s.canvas, ...c } })),
  addReflector: () => set((s) => ({ reflectors: [...s.reflectors, { id: Date.now(), x: 0, y: 15, desc: '', status: 'ok', binding: 'axis', weldCode: `КСС-${s.reflectors.length+1}`, weldDate: '', partType: '' }] })),
  removeReflector: (id) => set((s) => ({ reflectors: s.reflectors.filter(r => r.id !== id) })),
  updateReflector: (id, data) => set((s) => ({ reflectors: s.reflectors.map(r => r.id === id ? { ...r, ...data } : r) })),
  setActData: (data) => set((s) => ({ actData: { ...s.actData, ...data } })),
}));
