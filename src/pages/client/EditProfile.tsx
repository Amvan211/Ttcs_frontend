import { User, Lock, Settings, ChevronRight, ShieldCheck, PenTool } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EditProfile() {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex-grow pt-12 pb-20 px-8 max-w-screen-2xl mx-auto w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
        {/* Sidebar / Profile Section */}
        <aside className="md:col-span-4 lg:col-span-3 space-y-8">
          <div className="bg-surface-container-low rounded-xl p-8 text-center md:text-left overflow-hidden relative">
            <div className="w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 mb-6 ring-4 ring-white shadow-lg">
              <img
                src={user?.avatar || "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLQq6xANP9_bYDRsK_AJLaZNkZBH7msFY3v1s7fzZK4q9nXoN0IJKofuyFSd-h6Pj22bckro-FswYUnWJIueSvorj3-kLhlCCWQyFzSfV2pYpnCk4wXJfVW3xlYoO1Jb2My4fSdGyT7nrSt3IRXLgNeUfViPmFemVumnKQK09GLStx0CKXomclNNFDWWkqH8Xvg0AgJENLRBKl5OkSjm3LqP9wrM_Z2xykeo8cabOdyVJOmNoV763Z78lCm9cMgRdVcHlAppgQqE"}
                alt={user?.name || "User Avatar"}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-2xl font-bold text-primary mb-1">{user?.name || 'Alexander'}</h2>
              <p className="font-sans text-sm tracking-widest uppercase text-on-surface-variant font-semibold mb-4">{user?.role === 'PARTNER' ? 'Partner' : 'Collector'}</p>
              <p className="text-slate-500 text-sm italic">{user?.email || 'alexander@archive.com'}</p>
            </div>
            <div className="mt-10 pt-8 space-y-4">
              <Link to="/profile/edit" className={`px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors rounded-full ${isActive('/profile/edit') ? 'bg-surface-container hover:bg-surface-container-highest text-primary font-bold' : 'text-slate-500 hover:text-primary hover:bg-surface-container-lowest font-medium'}`}>
                <User className="w-5 h-5" />
                <span className="text-sm">Hồ sơ của tôi</span>
              </Link>
              <Link to="/profile/password" className={`px-4 py-3 flex items-center space-x-3 cursor-pointer transition-colors rounded-full ${isActive('/profile/password') ? 'bg-surface-container hover:bg-surface-container-highest text-primary font-bold' : 'text-slate-500 hover:text-primary hover:bg-surface-container-lowest font-medium'}`}>
                <Lock className="w-5 h-5" />
                <span className="text-sm">Đổi mật khẩu</span>
              </Link>
              <div className="px-4 py-3 flex items-center space-x-3 cursor-pointer text-slate-500 hover:text-primary hover:bg-surface-container-lowest rounded-full transition-colors">
                <Settings className="w-5 h-5" />
                <span className="text-sm font-medium">Cài đặt</span>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Form Area */}
        <section className="md:col-span-8 lg:col-span-9">
          <div className="mb-12">
            <h1 className="font-serif text-4xl md:text-5xl font-bold text-primary tracking-tight mb-4">Chỉnh sửa hồ sơ</h1>
            <p className="text-on-surface-variant text-lg max-w-2xl leading-relaxed">
              Cập nhật thông tin định danh và chi tiết lưu trữ của bạn để duy trì tính xác thực trong thư viện The Archive.
            </p>
          </div>

          <div className="bg-surface-container-lowest rounded-xl p-0 md:p-4">
            <form className="space-y-10">
              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {/* Họ và Tên */}
                <div className="flex flex-col space-y-2 group">
                  <label className="text-xs font-sans uppercase tracking-[0.1em] text-on-surface-variant font-bold px-1">Họ và Tên</label>
                  <input
                    type="text"
                    defaultValue={user?.name || "Alexander"}
                    placeholder="Nhập họ và tên..."
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 focus:ring-0 focus:border-primary text-on-surface text-lg font-medium transition-all"
                  />
                </div>
                {/* Email */}
                <div className="flex flex-col space-y-2 group">
                  <label className="text-xs font-sans uppercase tracking-[0.1em] text-on-surface-variant font-bold px-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    defaultValue={user?.email || "alexander@archive.com"}
                    placeholder="name@example.com"
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 focus:ring-0 focus:border-primary text-on-surface text-lg font-medium transition-all"
                  />
                </div>
                {/* Tên cửa hàng */}
                <div className="flex flex-col space-y-2 group">
                  <label className="text-xs font-sans uppercase tracking-[0.1em] text-on-surface-variant font-bold px-1">Tên cửa hàng</label>
                  <input
                    type="text"
                    defaultValue="The Archive Partner"
                    placeholder="Tên đơn vị lưu trữ..."
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 focus:ring-0 focus:border-primary text-on-surface text-lg font-medium transition-all"
                  />
                </div>
                {/* Số tài khoản */}
                <div className="flex flex-col space-y-2 group">
                  <label className="text-xs font-sans uppercase tracking-[0.1em] text-on-surface-variant font-bold px-1">Số tài khoản</label>
                  <input
                    type="text"
                    defaultValue="123-456-789"
                    placeholder="xxx-xxx-xxx"
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 focus:ring-0 focus:border-primary text-on-surface text-lg font-medium transition-all"
                  />
                </div>
                {/* Địa chỉ (Full Width) */}
                <div className="flex flex-col space-y-2 group md:col-span-2">
                  <label className="text-xs font-sans uppercase tracking-[0.1em] text-on-surface-variant font-bold px-1">Địa chỉ</label>
                  <input
                    type="text"
                    defaultValue="123 Phố Sách, Hà Nội"
                    placeholder="Địa chỉ thường trú..."
                    className="bg-transparent border-0 border-b border-outline-variant py-3 px-1 focus:ring-0 focus:border-primary text-on-surface text-lg font-medium transition-all"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-surface-container">
                <p className="text-sm text-slate-500 italic max-w-sm">
                  Dữ liệu của bạn được mã hóa và bảo mật theo tiêu chuẩn thư viện quốc gia.
                </p>
                <div className="flex items-center space-x-4 w-full md:w-auto">
                  <button type="button" className="flex-1 md:flex-none px-8 py-3 rounded-full border border-outline-variant text-on-surface font-bold hover:bg-surface-container transition-all">
                    Hủy
                  </button>
                  <button type="submit" className="flex-1 md:flex-none px-10 py-3 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Decorative Section (Bento style hint) */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface-container-low rounded-xl p-8 flex flex-col justify-between min-h-[200px] overflow-hidden relative">
              <div>
                <ShieldCheck className="text-primary w-8 h-8 mb-4" />
                <h3 className="font-serif text-xl font-bold mb-2">Xác minh danh tính</h3>
                <p className="text-sm text-on-surface-variant">Tài khoản của bạn đã được xác minh làm Đối tác Lưu trữ Cấp cao.</p>
              </div>
              <a href="#" className="text-primary font-bold text-sm underline flex items-center group">
                Xem chứng chỉ
                <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
            <div className="bg-tertiary-fixed rounded-xl p-8 flex flex-col justify-between min-h-[200px]">
              <div>
                <PenTool className="text-on-tertiary-fixed-variant w-8 h-8 mb-4" />
                <h3 className="font-serif text-xl font-bold text-on-tertiary-fixed-variant mb-2">Lịch sử đóng góp</h3>
                <p className="text-sm text-on-tertiary-fixed-variant opacity-80">Bạn đã đóng góp 42 tài liệu quý hiếm vào kho lưu trữ cộng đồng.</p>
              </div>
              <div className="flex items-center space-x-1">
                <div className="h-2 w-full bg-white/30 rounded-full overflow-hidden">
                  <div className="h-full bg-on-tertiary-fixed-variant w-3/4 rounded-full"></div>
                </div>
                <span className="text-xs font-bold text-on-tertiary-fixed-variant ml-2">75%</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
