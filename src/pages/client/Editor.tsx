import SideBar from '../../components/editor/SideBar';
import Toolbar from '../../components/editor/Toolbar';
import Canvas from '../../components/editor/Canvas';
import Properties from '../../components/editor/Properties';

export default function Editor() {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-slate-50 font-sans text-slate-900">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">
        <SideBar />
        <Canvas />
        <Properties />
      </div>
    </div>
  );
}
