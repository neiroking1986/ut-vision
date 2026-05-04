import { useStore } from '../store/useStore';

export default function SchemeReference() {
  const { showScheme, toggleScheme } = useStore();
  if (!showScheme) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={toggleScheme}>
      <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e=>e.stopPropagation()}>
        <h2 className="text-lg font-bold mb-4">Справочные схемы (С17)</h2>
        <svg viewBox="0 0 600 300" className="w-full border rounded mb-4">
          {/* Металл */}
          <rect x="50" y="100" width="500" height="120" fill="#e2e8f0" stroke="#64748b"/>
          {/* Разделка */}
          <polygon points="200,100 240,100 260,160 340,160 360,100 400,100" fill="#cbd5e1" stroke="#475569"/>
          {/* Валик */}
          <path d="M 230 100 Q 300 70 370 100" fill="#94a3b8"/>
          {/* Размеры */}
          <line x1="200" y1="90" x2="400" y2="90" stroke="#000" markerEnd="url(#arrow)"/>
          <text x="300" y="85" textAnchor="middle" fontSize="12">B1 (зазор)</text>
          <line x1="240" y1="105" x2="360" y2="105" stroke="#000"/>
          <text x="300" y="100" textAnchor="middle" fontSize="10">B2</text>
          <line x1="260" y1="165" x2="340" y2="165" stroke="#000"/>
          <text x="300" y="180" textAnchor="middle" fontSize="10">B3</text>
          <line x1="180" y1="100" x2="180" y2="220" stroke="#000"/>
          <text x="170" y="160" textAnchor="middle" fontSize="12">H</text>
          <line x1="210" y1="100" x2="210" y2="160" stroke="#000"/>
          <text x="200" y="130" textAnchor="middle" fontSize="10">H1</text>
          <line x1="420" y1="100" x2="420" y2="140" stroke="#000"/>
          <text x="430" y="120" fontSize="10">H2</text>
          <line x1="50" y1="90" x2="200" y2="90" stroke="#000"/>
          <text x="125" y="85" textAnchor="middle" fontSize="10">L1</text>
          <line x1="400" y1="90" x2="550" y2="90" stroke="#000"/>
          <text x="475" y="85" textAnchor="middle" fontSize="10">L2</text>
          <text x="300" y="60" textAnchor="middle" fontSize="10">e (валик)</text>
          {/* ПЭП */}
          <rect x="80" y="92" width="40" height="8" fill="#0f172a"/>
          <circle cx="120" cy="100" r="3" fill="#dc2626"/>
          <line x1="80" y1="110" x2="120" y2="110" stroke="#000"/>
          <text x="100" y="125" textAnchor="middle" fontSize="10">Стрела</text>
        </svg>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><b>H</b> — толщина металла</div>
          <div><b>H1</b> — высота скоса кромки</div>
          <div><b>H2</b> — притупление</div>
          <div><b>B1</b> — зазор между кромками</div>
          <div><b>B2</b> — ширина разделки у поверхности</div>
          <div><b>B3</b> — ширина корня шва</div>
          <div><b>L1/L2</b> — околошовная зона</div>
          <div><b>e</b> — высота валика усиления</div>
          <div><b>Стрела</b> — расстояние от торца ПЭП до точки ввода луча</div>
          <div><b>Сторона 1/2</b> — направление прозвучивания (слева/справа)</div>
        </div>
        <button onClick={toggleScheme} className="mt-4 w-full py-2 bg-gray-200 rounded hover:bg-gray-300">Закрыть</button>
      </div>
    </div>
  );
}
