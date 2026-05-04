import { useStore } from '../store/useStore';

export default function ResultsTable() {
  const { reflectors, addReflector, removeReflector, updateReflector } = useStore();

  return (
    <div className="space-y-2 text-sm">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">Отражатели</h2>
        <button onClick={addReflector} className="px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">+ Добавить</button>
      </div>
      {reflectors.map(r => (
        <div key={r.id} className="flex gap-2 items-center border p-2 rounded bg-gray-50">
          <input type="number" value={r.x} onChange={e=>updateReflector(r.id,{x:+e.target.value})} className="w-14 border p-1 rounded" placeholder="X"/>
          <input type="number" value={r.y} onChange={e=>updateReflector(r.id,{y:+e.target.value})} className="w-14 border p-1 rounded" placeholder="Y"/>
          <input placeholder="Описание" value={r.desc} onChange={e=>updateReflector(r.id,{desc:e.target.value})} className="flex-1 border p-1 rounded"/>
          <button onClick={()=>updateReflector(r.id,{status: r.status==='ok'?'fail':'ok'})}
            className={`px-2 py-1 rounded text-white text-xs font-medium ${r.status==='ok'?'bg-green-600 hover:bg-green-700':'bg-red-600 hover:bg-red-700'}`}>
            {r.status==='ok'?'Годен':'Не годен'}
          </button>
          <button onClick={()=>removeReflector(r.id)} className="text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      ))}
    </div>
  );
}
