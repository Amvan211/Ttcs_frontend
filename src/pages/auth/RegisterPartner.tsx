import { useState } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { partnerService } from '../../services/partnerService';
import { authResponseToUser } from '../../utils/authMap';

export default function RegisterPartner() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setSession } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await authService.register({
        username: username.trim(),
        password,
        mail: email.trim(),
        fullName: name.trim() || undefined,
      });
      const first = await authService.login({ username: username.trim(), password });
      setSession(first.token, authResponseToUser(first));
      await partnerService.registerStore({
        storeName: storeName.trim(),
        address: address.trim() || undefined,
        description: '',
      });
      const refreshed = await authService.login({ username: username.trim(), password });
      setSession(refreshed.token, authResponseToUser(refreshed));
      navigate('/store');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký đối tác thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-[#F8F9FA] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/10 to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-8 shadow-[0_20px_40px_-10px_rgba(0,6,102,0.3)]">
            <BookOpen className="text-white w-10 h-10" />
          </div>
          <h1 className="font-serif text-[42px] font-bold tracking-tight text-[#000666] leading-none mb-3">
            Welcome to Archive
          </h1>
          <p className="font-label text-[13px] font-medium uppercase tracking-[0.25em] text-on-surface-variant/80">
            Đăng ký tài khoản & cửa hàng đối tác
          </p>

          <div className="flex p-1 bg-white rounded-2xl mt-12 max-w-[340px] mx-auto border border-outline-variant/20 shadow-sm relative z-10">
            <Link
              to="/register/reader"
              className="flex-1 py-3 px-4 rounded-xl text-[11px] font-label font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all"
            >
              I am a Reader
            </Link>
            <button type="button" className="flex-1 py-3 px-4 rounded-xl text-[11px] font-label font-bold uppercase tracking-widest bg-primary text-white shadow-lg transition-all">
              I am a Partner
            </button>
          </div>
        </header>

        <section className="bg-white rounded-[3rem] p-10 pt-12 shadow-[0_40px_80px_-20px_rgba(0,6,102,0.06)] border border-white">
          <form className="space-y-8" onSubmit={handleRegister}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>
            )}
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
              />
            </div>
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Tên cửa hàng
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                required
                placeholder="The Midnight Folio"
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
              />
            </div>
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
              />
            </div>
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Địa chỉ
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
              />
            </div>
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                required
                className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
              />
            </div>
            <div className="space-y-4">
              <label className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/70 ml-1">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  className="w-full bg-transparent border-0 border-b border-outline-variant/40 pb-3 focus:ring-0 focus:border-primary font-body text-base"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-0 bottom-3 text-outline-variant/60 hover:text-primary transition-colors"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4">
              <input type="checkbox" id="tos" required className="w-5 h-5 mt-1 rounded border-outline-variant" />
              <label htmlFor="tos" className="font-body text-sm text-on-surface-variant/90">
                Tôi đồng ý với điều khoản dịch vụ.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-[20px] font-label font-bold tracking-widest uppercase text-xs shadow-[0_15px_30px_-5px_rgba(0,6,102,0.3)] active:scale-[0.98] transition-all mt-4 disabled:opacity-60"
            >
              {loading ? 'Đang xử lý…' : 'Tạo tài khoản đối tác'}
            </button>
          </form>
        </section>

        <footer className="mt-12 text-center pb-8">
          <p className="font-body text-[15px] text-on-surface-variant/80">
            Đã có tài khoản?
            <Link to="/login" className="text-primary font-bold ml-1">
              Đăng nhập
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
