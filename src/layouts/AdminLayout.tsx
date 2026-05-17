import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Briefcase, BookOpen, Tags, ShoppingCart, Star, Settings, LogOut, Bell, Search, Plus } from 'lucide-react';

export default function AdminLayout() {
  const location = useLocation();
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: BookOpen, label: 'Books', path: '/admin/books' },
    { icon: Tags, label: 'Categories', path: '/admin/categories' },
    { icon: ShoppingCart, label: 'Orders', path: '/admin/orders' },
    { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex font-sans text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full z-10">
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div>
            <Link to="/" className="text-2xl font-serif font-black text-[#1e1b4b] tracking-tight block">
              The Archive
            </Link>
            <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Management Suite</span>
          </div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path + '/'));
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  isActive 
                    ? 'bg-[#f0f4ff] text-[#4f46e5] shadow-sm' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-[#4f46e5]' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-8 pb-4">
            <button className="flex items-center justify-center gap-2 w-full bg-[#1e1b4b] text-white py-3 rounded-xl text-sm font-semibold hover:bg-[#312e81] transition-colors shadow-md">
              <Plus className="w-4 h-4" />
              Add New Title
            </button>
          </div>
        </nav>
        <div className="p-4 border-t border-slate-100 space-y-1">
          <Link to="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
          <Link to="/" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
            <LogOut className="w-5 h-5 text-slate-400" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="relative w-[400px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search archives, books, or records..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#4f46e5] focus:ring-1 focus:ring-[#4f46e5] transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">Admin Profile</p>
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <img src="https://i.pravatar.cc/150?img=11" alt="Admin" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
