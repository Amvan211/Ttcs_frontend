import { Type, Image, Square, Layout } from 'lucide-react';

export default function SideBar() {
  return (
    <div className="w-64 bg-white border-r border-slate-200 h-full flex flex-col">
      <div className="p-4 border-b border-slate-100">
        <h2 className="text-sm font-bold text-slate-800">Elements</h2>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Type className="w-6 h-6 text-slate-600 mb-2" />
          <span className="text-xs font-semibold text-slate-700">Text</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Image className="w-6 h-6 text-slate-600 mb-2" />
          <span className="text-xs font-semibold text-slate-700">Image</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Square className="w-6 h-6 text-slate-600 mb-2" />
          <span className="text-xs font-semibold text-slate-700">Button</span>
        </button>
        <button className="flex flex-col items-center justify-center p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Layout className="w-6 h-6 text-slate-600 mb-2" />
          <span className="text-xs font-semibold text-slate-700">Container</span>
        </button>
      </div>
    </div>
  );
}
