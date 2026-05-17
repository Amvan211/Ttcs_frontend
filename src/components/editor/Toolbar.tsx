import { Undo, Redo, Monitor, Smartphone, Play, Save } from 'lucide-react';

export default function Toolbar() {
  return (
    <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Undo className="w-4 h-4" />
        </button>
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Redo className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
        <button className="p-1.5 bg-white text-slate-800 rounded shadow-sm">
          <Monitor className="w-4 h-4" />
        </button>
        <button className="p-1.5 text-slate-500 hover:text-slate-800 rounded">
          <Smartphone className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
          <Play className="w-4 h-4" />
          Preview
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </div>
  );
}
