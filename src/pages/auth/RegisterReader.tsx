import { useState } from 'react';
import { BookOpen, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RegisterReader() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu');
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        username: username.trim() || email.split('@')[0] || 'reader',
        password,
        mail: email.trim(),
        fullName: name.trim() || undefined,
      });
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-6 py-12 bg-[#F3F4F6] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-tertiary-fixed rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md flex flex-col items-center">
        <header className="text-center mb-8 w-full">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary mb-10 shadow-2xl">
            <BookOpen className="text-white w-10 h-10" />
          </div>
          <h1 className="font-serif text-[44px] font-bold tracking-tight text-primary leading-tight">
            Welcome to Archive
          </h1>
          <p className="font-label text-xs uppercase tracking-[0.2em] text-on-surface-variant mt-4 opacity-70">
            Curate your literary journey.
          </p>

          <div className="flex p-1.5 bg-[#F0F1F2] rounded-2xl mt-12 w-full max-w-[340px] mx-auto">
            <button type="button" className="flex-1 py-3 px-4 rounded-xl text-[11px] font-label font-extrabold uppercase tracking-widest bg-primary text-white shadow-md transition-all">
              I am a Reader
            </button>
            <Link
              to="/register/partner"
              className="flex-1 py-3 px-4 rounded-xl text-[11px] font-label font-extrabold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-all text-center"
            >
              I am a Partner
            </Link>
          </div>
        </header>

        <section className="bg-white/90 backdrop-blur-md rounded-[48px] p-10 pt-12 shadow-[0_40px_100px_-20px_rgba(0,6,102,0.12)] border border-white/40 w-full">
          <form className="space-y-8" onSubmit={handleRegister}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>
            )}
            <div className="space-y-8">
              <div className="space-y-3 relative group">
                <label htmlFor="full_name" className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/80">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="full_name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g. Julian Barnes"
                  className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-[15px]"
                />
              </div>

              <div className="space-y-3 relative group">
                <label htmlFor="email" className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/80">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                  placeholder="curator@thearchive.com"
                  className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-[15px]"
                />
              </div>

              <div className="space-y-3 relative group">
                <label htmlFor="username" className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/80">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  placeholder="archivist_01"
                  className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-[15px]"
                />
              </div>

              <div className="space-y-3 relative group">
                <label htmlFor="password" className="block font-label text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant/80">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    minLength={6}
                    placeholder="••••••••"
                    className="w-full bg-transparent border-0 border-b border-outline-variant/50 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-[15px] tracking-widest"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-0 top-3 text-outline-variant/60 hover:text-primary transition-colors"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4 pt-4">
              <div className="pt-0.5">
                <input type="checkbox" id="terms" required className="w-5 h-5 rounded border-outline-variant text-primary" />
              </div>
              <label htmlFor="terms" className="font-body text-sm leading-relaxed text-on-surface-variant/90">
                Tôi đồng ý với điều khoản dịch vụ.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-primary text-white rounded-2xl font-label font-extrabold tracking-widest uppercase text-xs shadow-xl shadow-primary/20 active:scale-[0.98] transition-transform mt-4 disabled:opacity-60"
            >
              {loading ? 'Đang tạo…' : 'Tạo tài khoản'}
            </button>
          </form>
        </section>

        <footer className="mt-12 text-center">
          <p className="font-body text-[15px] text-on-surface-variant/80">
            Đã có tài khoản?
            <Link to="/login" className="text-primary font-extrabold ml-1">
              Đăng nhập
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
