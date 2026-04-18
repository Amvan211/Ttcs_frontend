import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-100 bg-white mt-auto">
      <div className="flex flex-col md:flex-row justify-between items-center w-full px-12 py-10 gap-8 max-w-screen-2xl mx-auto">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-serif font-black text-primary">The Archive</span>
          <p className="font-body text-xs tracking-wide text-outline">© 2024 The Archive. The Digital Curator. All rights reserved.</p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          <Link to="#" className="font-body text-xs tracking-tight text-primary hover:underline border-b border-secondary-fixed">Về chúng tôi</Link>
          <Link to="#" className="font-body text-xs tracking-tight text-primary hover:underline border-b border-secondary-fixed">Chính sách bảo mật</Link>
          <Link to="#" className="font-body text-xs tracking-tight text-primary hover:underline border-b border-secondary-fixed">Điều khoản dịch vụ</Link>
          <Link to="#" className="font-body text-xs tracking-tight text-primary hover:underline border-b border-secondary-fixed">Liên hệ</Link>
        </nav>
      </div>
    </footer>
  );
}
