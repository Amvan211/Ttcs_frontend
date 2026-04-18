import { useState } from 'react';
import { BookOpen, User, Eye } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { authResponseToUser } from '../../utils/authMap';

export default function Login() {
  const { setSession } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const auth = await authService.login({ username: username.trim(), password });
      const u = authResponseToUser(auth);
      setSession(auth.token, u);
      if (u.role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center px-6 py-12 bg-[#f4f5f7] overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[80%] h-[80%] bg-primary rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-tertiary-fixed rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <header className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-[1.5rem] bg-primary mb-6 shadow-xl">
            <BookOpen className="text-white w-10 h-10" />
          </div>
          <h1 className="font-serif text-[42px] font-bold tracking-tight text-primary leading-none">THE ARCHIVE</h1>
          <p className="font-label text-[11px] uppercase tracking-[0.3em] text-on-surface-variant mt-3 font-semibold">
            Curators of the Written Word
          </p>
        </header>

        <section className="bg-white rounded-[3rem] p-10 shadow-[0_32px_64px_-12px_rgba(0,6,102,0.06)] border border-white">
          <form className="space-y-8" onSubmit={handleLogin}>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-4 py-2 rounded-xl border border-red-100">{error}</p>
            )}
            <div className="space-y-2">
              <label htmlFor="identity" className="block font-label text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant ml-1">
                Username hoặc Email
              </label>
              <div className="relative group">
                <input
                  type="text"
                  id="identity"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  placeholder="Nhập tên đăng nhập hoặc email"
                  required
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-sm"
                />
                <div className="absolute right-0 top-3 text-outline-variant group-focus-within:text-primary transition-colors">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block font-label text-[10px] font-extrabold uppercase tracking-widest text-on-surface-variant ml-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  required
                  className="w-full bg-transparent border-0 border-b border-outline-variant/30 py-3 focus:ring-0 focus:border-primary transition-all placeholder:text-slate-300 font-body text-sm tracking-widest"
                />
                <div
                  className="absolute right-0 top-3 text-outline-variant group-focus-within:text-primary transition-colors cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                  onKeyDown={(e) => e.key === 'Enter' && setShowPassword(!showPassword)}
                  role="button"
                  tabIndex={0}
                >
                  <Eye className="w-5 h-5 hover:text-primary transition-colors" />
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-[1.25rem] font-label font-bold tracking-widest uppercase text-[11px] shadow-lg shadow-primary/20 active:scale-[0.97] transition-all disabled:opacity-60"
              >
                {loading ? 'Đang đăng nhập…' : 'Đăng nhập'}
              </button>
            </div>
          </form>
        </section>

        <footer className="mt-10 text-center space-y-6">
          <p className="font-body text-sm text-on-surface-variant">
            Chưa có tài khoản?
            <Link to="/register/reader" className="text-primary font-bold hover:underline underline-offset-4 ml-1">
              Đăng ký
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
