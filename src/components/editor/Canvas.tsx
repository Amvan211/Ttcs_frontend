export default function Canvas() {
  return (
    <div className="flex-1 bg-slate-100 overflow-auto p-8 flex justify-center">
      <div className="w-[800px] min-h-[600px] bg-white shadow-sm border border-slate-200 rounded-lg p-8">
        <div className="border-2 border-dashed border-slate-200 rounded-lg h-full flex items-center justify-center text-slate-400">
          Drag and drop elements here
        </div>
      </div>
    </div>
  );
}
