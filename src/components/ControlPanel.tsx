import { useStore } from '../store/useStore';
import peps from '../data/peps.json';
import materials from '../data/materials.json';

export default function ControlPanel() {
  const { pep, material, weld, setPep, setMaterial, setBounces } = useStore();

  return (
    <div className="space-y-3 text-sm">
      <h2 className="font-bold text-lg">Параметры</h2>
      <div>
        <label className="block font-medium">ПЭП</label>
        <select className="w-full border p-1 rounded" value={pep.id} onChange={e => setPep(peps.find(p=>p.id===e.target.value)!)}>
          {peps.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Материал</label>
        <select className="w-full border p-1 rounded" value={material.id} onChange={e => setMaterial(materials.find(m=>m.id===e.target.value)!)}>
          {materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium">Отражений луча</label>
        <input type="number" min={0} max={5} value={pep.bounces} onChange={e => setBounces(+e.target.value)} className="w-full border p-1 rounded"/>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div><label className="block text-xs">H, мм</label><input type="number" value={weld.H} readOnly className="w-full border p-1 bg-gray-50 rounded"/></div>
        <div><label className="block text-xs">B1, мм</label><input type="number" value={weld.B1} readOnly className="w-full border p-1 bg-gray-50 rounded"/></div>
      </div>
      <p className="text-xs text-gray-500">Геометрия шва пока фиксирована. Drag & Drop ПЭП по схеме.</p>
    </div>
  );
}
