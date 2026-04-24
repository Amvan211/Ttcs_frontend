import { useState } from 'react';
import { User, Lock, Settings, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ChangePassword() {
  const { user } = useAuth();
  const avatarSrc =
    user?.avatarUrl ||
    user?.avatar ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLQq6xANP9_bYDRsK_AJLaZNkZBH7msFY3v1s7fzZK4q9nXoN0IJKofuyFSd-h6Pj22bckro-FswYUnWJIueSvorj3-kLhlCCWQyFzSfV2pYpnCk4wXJfVW3xlYoO1Jb2My4fSdGyT7nrSt3IRXLgNeUfViPmFemVumnKQK09GLStx0CKXomclNNFDWWkqH8Xvg0AgJENLRBKl5OkSjm3LqP9wrM_Z2xykeo8cabOdyVJOmNoV763Z78lCm9cMgRdVcHlAppgQqE";
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  return (
    <div className="flex flex-1 pt-12 max-w-screen-2xl mx-auto w-full">
      {/* SideNavBar */}
      <aside className="md:col-span-4 lg:col-span-3 space-y-8 h-screen w-80 sticky top-20 flex flex-col py-8 px-8 bg-transparent">
        <div className="bg-surface-container-low rounded-xl p-8 text-center md:text-left overflow-hidden relative">
          <div className="w-32 h-32 rounded-full overflow-hidden mx-auto md:mx-0 mb-6 ring-4 ring-white shadow-lg">
            <img
              src={avatarSrc}
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
            <Link to="/profile/edit" className="px-4 py-3 flex items-center space-x-3 cursor-pointer text-slate-500 hover:text-primary transition-colors">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">Hồ sơ của tôi</span>
            </Link>
            <Link to="/profile/password" className="bg-surface-container rounded-full px-4 py-3 flex items-center space-x-3 cursor-pointer hover:bg-surface-container-highest transition-colors">
              <Lock className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold">Đổi mật khẩu</span>
            </Link>
            <div className="px-4 py-3 flex items-center space-x-3 cursor-pointer text-slate-500 hover:text-primary transition-colors">
              <Settings className="w-5 h-5" />
              <span className="text-sm font-medium">Cài đặt</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-surface py-12 px-12 md:px-24">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary tracking-tight mb-4">
            Đổi mật khẩu
          </h1>
          <p className="text-on-surface-variant font-body max-w-lg leading-relaxed">
            Để đảm bảo an toàn cho tài khoản, vui lòng không chia sẻ mật khẩu với người khác.
          </p>
        </header>

        <section className="max-w-xl">
          {/* Sophisticated Password Form Card */}
          <div className="bg-surface-container-low rounded-xl p-8 md:p-12 shadow-sm relative overflow-hidden">
            {/* Subtle editorial accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <form className="space-y-8 relative z-10">
              {/* Mật khẩu hiện tại */}
              <div className="group">
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Mật khẩu hiện tại
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showCurrent ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-outline/40"
                  />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-0 text-outline hover:text-primary transition-colors">
                    {showCurrent ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Mật khẩu mới */}
              <div className="group">
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showNew ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-outline/40"
                  />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-0 text-outline hover:text-primary transition-colors">
                    {showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Xác nhận mật khẩu mới */}
              <div className="group">
                <label className="block text-xs uppercase tracking-widest text-on-surface-variant font-bold mb-2">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b border-outline-variant py-3 focus:ring-0 focus:border-primary transition-all duration-300 placeholder:text-outline/40"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-0 text-outline hover:text-primary transition-colors">
                    {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button type="submit" className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-semibold shadow-lg hover:opacity-90 active:scale-[0.98] transition-all duration-300">
                  Xác nhận thay đổi
                </button>
              </div>
            </form>
          </div>

          {/* Security Tip Card (Editorial feel) */}
          <div className="mt-8 p-6 bg-tertiary-fixed rounded-xl flex items-start gap-4">
            <ShieldCheck className="text-on-tertiary-fixed-variant w-6 h-6" />
            <div>
              <h4 className="text-sm font-bold text-on-tertiary-fixed uppercase tracking-wider mb-1">Mẹo bảo mật</h4>
              <p className="text-xs text-on-tertiary-fixed-variant leading-relaxed">
                Mật khẩu mạnh nên bao gồm ít nhất 8 ký tự, kết hợp chữ cái, số và các ký tự đặc biệt như (!, @, #, $).
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
