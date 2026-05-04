import { useStore } from '../store/useStore';
import peps from '../data/peps.json';
import materials from '../data/materials.json';
import { useState } from 'react';

const GOST_PRESETS: Record<string, Record<number, Partial<typeof useStore.getState().weld>>> = {
  '16037': {
    8: { B1: 1, B2: 1, H1: 0, H2: 0, e: 1.5 },
    10: { B1: 1.5, B2: 1.5, H1: 0, H2: 0, e: 2 },
    12: { B1: 2, B2: 2, H1: 0, H2: 0, e: 2 },
    14: { B1: 2, B2: 2, H1: 0, H2: 0, e: 2.5 },
    16: { B1: 2, B2: 2, H1: 0, H2: 0, e: 2.5 },
    20: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3 },
    24: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3 },
    30: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3.5 },
    32: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3.5 },
  },
  '5264': {
    8: { B1: 2, B2: 1, H1: 0, H2: 0, e: 2 },
    10: { B1: 2, B2: 1.5, H1: 0, H2: 0, e: 2 },
    12: { B1: 2, B2: 2, H1: 0, H2: 0, e: 2.5 },
    16: { B1: 2, B2: 2, H1: 0, H2: 0, e: 2.5 },
    20: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3 },
    24: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3 },
    30: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3.5 },
    32: { B1: 2, B2: 2, H1: 0, H2: 0, e: 3.5 },
  }
};

export default function ControlPanel() {
  const { pep, material, weld, side, gost, setPep, setMaterial, setBounces, setSide, setGost, setWeld, setArrow, toggleScheme } = useStore();
  const [tab, setTab] = useState<'control' | 'weld' | 'act'>('control');

  const applyGost = (g: 'none' | '16037' | '5264') => {
    setGost(g);
    if (g === 'none') return;
    const thickness = Math.round(weld.H);
    const preset = GOST_PRESETS[g][thickness] || GOST_PRESETS[g][Object.keys(GOST_PRESETS[g]).map(Number).sort((a,b)=>Math.abs(a-thickness)-Math.abs(b-thickness))[0]];
    if (preset) setWeld(preset);
  };

  const inputClass = "w-full border p-1.5 rounded text-sm focus:ring-2 focus:ring-blue-400 outline-none";
  const labelClass = "block text-xs font-medium text-gray-600 mb-1";

  return (
    <div className="space-y-3 text-sm bg-white p-4 rounded-lg shadow">
      <div className="flex gap-2 border-b pb-2">
        <button onClick={()=>setTab('control')} className={`px-3 py-1 rounded ${tab==='control'?'bg-blue-600 text-white':'bg-gray-100'}`}>Контроль</button>
        <button onClick={()=>setTab('weld')} className={`px-3 py-1 rounded ${tab==='weld'?'bg-blue-600 text-white':'bg-gray-100'}`}>Шов</button>
        <button onClick={()=>setTab('act')} className={`px-3 py-1 rounded ${tab==='act'?'bg-blue-600 text-white':'bg-gray-100'}`}>Акт</button>
      </div>

      {tab === 'control' && (
        <div className="space-y-3">
          <div><label className={labelClass}>ПЭП</label><select className={inputClass} value={pep.id} onChange={e => setPep(peps.find(p=>p.id===e.target.value)!)}>{peps.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
          <div><label className={labelClass}>Материал</label><select className={inputClass} value={material.id} onChange={e => setMaterial(materials.find(m=>m.id===e.target.value)!)}>{materials.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={labelClass}>Стрела, мм</label><input type="number" value={pep.arrow} onChange={e=>setArrow(+e.target.value)} className={inputClass}/></div>
            <div><label className={labelClass}>Отражений</label><input type="number" min={0} max={5} value={pep.bounces} onChange={e => setBounces(+e.target.value)} className={inputClass}/></div>
          </div>
          <div className="flex gap-2">
            <button onClick={()=>setSide(1)} className={`flex-1 py-1 rounded ${side===1?'bg-blue-600 text-white':'bg-gray-200'}`}>Сторона 1</button>
            <button onClick={()=>setSide(2)} className={`flex-1 py-1 rounded ${side===2?'bg-blue-600 text-white':'bg-gray-200'}`}>Сторона 2</button>
          </div>
          <button onClick={toggleScheme} className="w-full py-1.5 bg-amber-100 text-amber-800 rounded hover:bg-amber-200 text-xs font-medium">📐 Показать Схема 1 / Схема 2</button>
        </div>
      )}

      {tab === 'weld' && (
        <div className="space-y-2">
          <div><label className={labelClass}>Пресет ГОСТ (С17)</label>
            <select className={inputClass} value={gost} onChange={e=>applyGost(e.target.value as any)}>
              <option value="none">Ручной ввод</option>
              <option value="16037">ГОСТ 16037-80</option>
              <option value="5264">ГОСТ 5264-80</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div><label className={labelClass}>H, мм</label><input type="number" value={weld.H} onChange={e=>setWeld({H:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>H1, мм</label><input type="number" value={weld.H1} onChange={e=>setWeld({H1:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>H2, мм</label><input type="number" value={weld.H2} onChange={e=>setWeld({H2:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>B1, мм</label><input type="number" value={weld.B1} onChange={e=>setWeld({B1:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>B2, мм</label><input type="number" value={weld.B2} onChange={e=>setWeld({B2:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>B3, мм</label><input type="number" value={weld.B3} onChange={e=>setWeld({B3:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>L1, мм</label><input type="number" value={weld.L1} onChange={e=>setWeld({L1:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>L2, мм</label><input type="number" value={weld.L2} onChange={e=>setWeld({L2:+e.target.value})} className={inputClass}/></div>
            <div><label className={labelClass}>e (валик), мм</label><input type="number" value={weld.e} onChange={e=>setWeld({e:+e.target.value})} className={inputClass}/></div>
          </div>
        </div>
      )}

      {tab === 'act' && (
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          <div><label className={labelClass}>№ акта</label><input className={inputClass} value={actData.actNumber} onChange={e=>setActData({actNumber:e.target.value})}/></div>
          <div><label className={labelClass}>Заказчик</label><input className={inputClass} value={actData.customer} onChange={e=>setActData({customer:e.target.value})}/></div>
          <div><label className={labelClass}>ТУ ОПО</label><input className={inputClass} value={actData.tuOpo} onChange={e=>setActData({tuOpo:e.target.value})}/></div>
          <div><label className={labelClass}>Сварщик / Клеймо</label><input className={inputClass} value={`${actData.welderName} / ${actData.welderStamp}`} onChange={e=>{const [n,s]=e.target.value.split('/'); setActData({welderName:n?.trim()||'', welderStamp:s?.trim()||''})}}/></div>
          <div><label className={labelClass}>Оборудование</label><input className={inputClass} value={actData.equipment} onChange={e=>setActData({equipment:e.target.value})}/></div>
          <div><label className={labelClass}>Поверка</label><input className={inputClass} value={actData.verificationCert} onChange={e=>setActData({verificationCert:e.target.value})}/></div>
          <div><label className={labelClass}>Оператор ФИО</label><input className={inputClass} value={actData.operatorName} onChange={e=>setActData({operatorName:e.target.value})}/></div>
        </div>
      )}
    </div>
  );
}
