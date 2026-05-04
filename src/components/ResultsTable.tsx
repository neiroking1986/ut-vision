import { useStore } from '../store/useStore';

export default function ResultsTable() {
  const { reflectors, addReflector, removeReflector, updateReflector } = useStore();
  const inputClass = "w-full border p-1 rounded text-xs";

  return (
    <div className="space-y-2 text-sm bg-white p-4 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-base">Отражатели</h2>
        <button onClick={addReflector} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs">+ Добавить</button>
      </div>
      {reflectors.map(r => (
        <div key={r.id} className="grid grid-cols-12 gap-1 items-center border p-2 rounded bg-gray-50">
          <input type="number" value={r.x} onChange={e=>updateReflector(r.id,{x:+e.target.value})} className={`${inputClass} col-span-2`} placeholder="X"/>
          <input type="number" value={r.y} onChange={e=>updateReflector(r.id,{y:+e.target.value})} className={`${inputClass} col-span-2`} placeholder="Y"/>
          <select value={r.binding} onChange={e=>updateReflector(r.id,{binding:e.target.value as any})} className={`${inputClass} col-span-3`}>
            <option value="axis">От оси шва</option>
            <option value="pep">От ПЭП</option>
          </select>
          <input placeholder="Шифр" value={r.weldCode} onChange={e=>updateReflector(r.id,{weldCode:e.target.value})} className={`${inputClass} col-span-2`}/>
          <button onClick={()=>updateReflector(r.id,{status: r.status==='ok'?'fail':'ok'})}
            className={`col-span-2 px-1 py-1 rounded text-white text-xs font-medium ${r.status==='ok'?'bg-green-600':'bg-red-600'}`}>
            {r.status==='ok'?'Годен':'Не годен'}
          </button>
          <button onClick={()=>removeReflector(r.id)} className="col-span-1 text-red-500 hover:text-red-700 font-bold text-center">✕</button>
          <input placeholder="Описание / примечание" value={r.desc} onChange={e=>updateReflector(r.id,{desc:e.target.value})} className={`${inputClass} col-span-12 mt-1`}/>
        </div>
      ))}
      <p className="text-xs text-gray-500 mt-1">X пересчитывается автоматически в зависимости от привязки.</p>
    </div>
  );
}
