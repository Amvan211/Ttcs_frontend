import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Store } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();
  console.log("Dữ liệu User hiện tại:", user);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update search input if URL changes
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q) {
      setSearchQuery(q);
    } else if (location.pathname !== '/explore') {
      setSearchQuery('');
    }
  }, [location]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path: string) => {
    return isActive(path)
      ? "text-primary font-bold border-b-2 border-primary pb-1 font-body text-sm tracking-tight transition-all duration-300"
      : "text-outline hover:text-primary transition-colors font-body text-sm tracking-tight";
  };

  return (
    <header className="fixed top-0 w-full z-50 bg-white border-b border-slate-100">
      <div className="flex justify-between items-center w-full px-8 py-3 max-w-screen-2xl mx-auto">
        <div className="flex items-center gap-12">
          <Link to="/" className="text-2xl font-serif font-black text-primary tracking-tighter">
            The Archive
          </Link>
          <nav className="hidden lg:flex items-center gap-8">
            <Link to="/" className={getLinkClass('/')}>
              Trang chủ
            </Link>
            <Link to="/explore" className={getLinkClass('/explore')}>
              Khám phá
            </Link>
            <Link to="/cart" className={getLinkClass('/cart')}>
              Giỏ hàng
            </Link>
            <Link to="/store" className={getLinkClass('/store')}>
              Gian hàng của bạn
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm tựa sách, tác giả..."
              className="pl-10 pr-4 py-1.5 bg-surface-container border border-slate-200 focus:border-primary focus:ring-0 transition-all text-xs w-64 rounded-lg"
            />
          </form>
          <div className="flex items-center gap-4">
            <Link to="/cart" className={`p-2 hover:bg-slate-50 transition-all duration-300 rounded-full flex items-center justify-center ${isActive('/cart') ? 'text-primary bg-slate-50' : 'text-outline hover:text-primary'}`}>
              <ShoppingCart className="w-5 h-5" />
            </Link>
            <div className="relative group" ref={dropdownRef}>
              {isLoggedIn ? (
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 transition-all duration-300 rounded-full border ${isDropdownOpen || isActive('/profile') ? 'border-slate-200 bg-slate-50' : 'border-transparent hover:border-slate-100'}`}
                >
                  <span className="text-xs font-bold text-primary font-body">{user?.name || 'User'}</span>
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/10">
                    <img
                      src={user?.avatar || "https://cdn2.tuoitre.vn/zoom/700_390/471584752817336320/2026/4/14/rectanglelargetype2ef9e108e607f9d112d29071d2b746c6f-1776140413918800777816-0-0-667-1273-crop-1776140442101536784573.jpg"}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="text-sm font-bold text-primary hover:text-primary/80 transition-colors px-2">
                    Đăng nhập
                  </Link>
                  <Link to="/register/reader" className="text-sm font-bold bg-primary text-white px-5 py-2 rounded-full hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                    Đăng ký
                  </Link>
                </div>
              )}

              {isDropdownOpen && isLoggedIn && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-[60]">
                  <div className="py-2">
                    <Link
                      to="/profile"
                      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${isActive('/profile') ? 'text-primary bg-slate-50' : 'text-outline hover:text-primary hover:bg-slate-50'}`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Trang cá nhân
                    </Link>
                    <Link
                      to="/cart"
                      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider border-t border-slate-50 transition-colors ${isActive('/cart') ? 'text-primary bg-slate-50' : 'text-outline hover:text-primary hover:bg-slate-50'}`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Giỏ hàng
                    </Link>
                    <Link
                      to="/store"
                      className={`flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider border-t border-slate-50 transition-colors ${isActive('/store') ? 'text-primary bg-slate-50' : 'text-outline hover:text-primary hover:bg-slate-50'}`}
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <Store className="w-4 h-4" />
                      Gian hàng của bạn
                    </Link>
                    <hr className="border-slate-50" />
                    <button
                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-error hover:bg-error-container/20 transition-colors uppercase tracking-wider"
                      onClick={() => {
                        setIsDropdownOpen(false);
                        logout();
                        navigate('/login', { replace: true });
                      }}
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
