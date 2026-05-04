import UTCanvas from './components/UTCanvas';
import ControlPanel from './components/ControlPanel';
import ResultsTable from './components/ResultsTable';
import ReportPDF from './components/ReportPDF';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">UT-Vision Web</h1>
        <div className="flex flex-col xl:flex-row gap-6">
          <div className="flex-1 space-y-3">
            <UTCanvas />
            <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded">
              💡 <b>ЛКМ</b> — перемещение ПЭП | <b>Shift+ЛКМ</b> — панорамирование | <b>Колёсико</b> — масштаб
            </div>
          </div>
          <div className="w-full xl:w-96 space-y-4">
            <ControlPanel />
            <ResultsTable />
            <ReportPDF />
          </div>
        </div>
      </div>
    </div>
  );
}
