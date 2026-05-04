import UTCanvas from './components/UTCanvas';
import ControlPanel from './components/ControlPanel';
import ResultsTable from './components/ResultsTable';
import ReportPDF from './components/ReportPDF';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow p-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 border-b pb-2">UT-Vision Web Prototype</h1>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <UTCanvas />
            <div className="text-sm text-gray-600">
              💡 Перемещайте ПЭП мышью. Координаты и лучи пересчитываются мгновенно.
            </div>
          </div>
          <div className="w-full lg:w-80 space-y-6">
            <ControlPanel />
            <ResultsTable />
            <ReportPDF />
          </div>
        </div>
      </div>
    </div>
  );
}
