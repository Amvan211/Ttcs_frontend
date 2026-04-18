import { Settings2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function Properties() {
  return (
    <div className="w-72 bg-white border-l border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <Settings2 className="w-4 h-4 text-slate-500" />
        <h2 className="text-sm font-bold text-slate-800">Properties</h2>
      </div>
      <div className="p-4 space-y-6 overflow-y-auto">
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Typography</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Font Size</span>
              <input type="number" className="w-16 px-2 py-1 text-sm border border-slate-200 rounded" defaultValue={16} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Weight</span>
              <select className="w-24 px-2 py-1 text-sm border border-slate-200 rounded">
                <option>Regular</option>
                <option>Medium</option>
                <option>Bold</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Alignment</label>
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button className="flex-1 p-1.5 flex justify-center bg-white rounded shadow-sm text-slate-800">
              <AlignLeft className="w-4 h-4" />
            </button>
            <button className="flex-1 p-1.5 flex justify-center text-slate-500 hover:text-slate-800">
              <AlignCenter className="w-4 h-4" />
            </button>
            <button className="flex-1 p-1.5 flex justify-center text-slate-500 hover:text-slate-800">
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Spacing</label>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="text-xs text-slate-500 mb-1 block">Margin</span>
              <input type="text" className="w-full px-2 py-1 text-sm border border-slate-200 rounded" placeholder="0px" />
            </div>
            <div>
              <span className="text-xs text-slate-500 mb-1 block">Padding</span>
              <input type="text" className="w-full px-2 py-1 text-sm border border-slate-200 rounded" placeholder="0px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
