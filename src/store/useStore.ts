import { create } from 'zustand';
import peps from '../data/peps.json';
import materials from '../data/materials.json';

export interface Reflector {
  id: number; x: number; y: number; desc: string; status: 'ok' | 'fail';
}

interface State {
  pep: typeof peps[0] & { bounces: number };
  material: typeof materials[0];
  weld: { L1: number; L2: number; H: number; H1: number; H2: number; B1: number; B2: number; B3: number };
  pepX: number;
  reflectors: Reflector[];
  setPep: (p: typeof peps[0]) => void;
  setMaterial: (m: typeof materials[0]) => void;
  setPepX: (x: number) => void;
  setBounces: (n: number) => void;
  addReflector: () => void;
  removeReflector: (id: number) => void;
  updateReflector: (id: number, data: Partial<Reflector>) => void;
}

export const useStore = create<State>((set) => ({
  pep: { ...peps[1], bounces: 2 },
  material: materials[0],
  weld: { L1: 100, L2: 100, H: 32, H1: 14, H2: 4, B1: 48, B2: 24, B3: 48 },
  pepX: -67,
  reflectors: [
    { id: 1, x: -19, y: 30, desc: '', status: 'ok' },
    { id: 2, x: 14, y: 10, desc: '', status: 'ok' }
  ],
  setPep: (p) => set({ pep: { ...p, bounces: 2 } }),
  setMaterial: (m) => set({ material: m }),
  setPepX: (x) => set({ pepX: x }),
  setBounces: (n) => set((s) => ({ pep: { ...s.pep, bounces: n } })),
  addReflector: () => set((s) => ({ reflectors: [...s.reflectors, { id: Date.now(), x: 0, y: 15, desc: '', status: 'ok' }] })),
  removeReflector: (id) => set((s) => ({ reflectors: s.reflectors.filter(r => r.id !== id) })),
  updateReflector: (id, data) => set((s) => ({
    reflectors: s.reflectors.map(r => r.id === id ? { ...r, ...data } : r)
  })),
}));
