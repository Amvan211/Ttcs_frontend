import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, AlignLeft, CheckCircle2 } from 'lucide-react';
import { partnerService } from '../../services';

export default function PartnerRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    storeName: '',
    address: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.storeName.trim()) {
      setErr('Vui lòng nhập tên cửa hàng');
      return;
    }
    setLoading(true);
    setErr(null);
    try {
      await partnerService.registerStore({
        storeName: formData.storeName.trim(),
        address: formData.address.trim(),
        description: formData.description.trim(),
      });
      setSuccess(true);
    } catch (error) {
      setErr(error instanceof Error ? error.message : 'Đăng ký thất bại. Bạn có thể đã gửi yêu cầu rồi.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-green-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-serif font-black text-[#1e1b4b] mb-4">Gửi yêu cầu thành công!</h2>
          <p className="text-slate-600 mb-8 max-w-md mx-auto leading-relaxed">
            Hệ thống đã ghi nhận yêu cầu đăng ký mở gian hàng của bạn. Ban quản trị sẽ kiểm duyệt và phản hồi lại sớm nhất.
            Vui lòng chờ xác nhận để có thể truy cập trang Quản lý gian hàng.
          </p>
          <button
            onClick={() => navigate('/profile')}
            className="px-8 py-3 bg-[#1e1b4b] text-white rounded-xl font-bold hover:bg-[#312e81] transition-colors shadow-lg shadow-[#1e1b4b]/20"
          >
            Quay lại trang cá nhân
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="bg-[#1e1b4b] p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
          <h1 className="text-3xl font-serif font-black relative z-10 mb-2">Đăng ký bán hàng</h1>
          <p className="text-blue-100/80 relative z-10">
            Trở thành đối tác của The Archive và đưa những cuốn sách của bạn đến với hàng ngàn độc giả.
          </p>
        </div>

        <div className="p-8">
          {err && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium">
              {err}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-[#1e1b4b] mb-2 flex items-center gap-2">
                <Store className="w-4 h-4 text-slate-400" /> Tên cửa hàng / Gian hàng *
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Tiệm sách nhà Nhím"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1e1b4b] mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Địa chỉ giao dịch
              </label>
              <input
                type="text"
                placeholder="Địa chỉ kho hàng hoặc cửa hàng vật lý của bạn"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#1e1b4b] mb-2 flex items-center gap-2">
                <AlignLeft className="w-4 h-4 text-slate-400" /> Mô tả gian hàng
              </label>
              <textarea
                rows={4}
                placeholder="Giới thiệu ngắn về cửa hàng của bạn, các thể loại sách bạn chuyên bán..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all placeholder:text-slate-400 resize-none"
              />
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="px-6 py-3 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Hủy bỏ
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-[#1e1b4b] text-white rounded-xl text-sm font-bold hover:bg-[#312e81] transition-colors shadow-lg shadow-[#1e1b4b]/20 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? 'Đang gửi...' : 'Gửi yêu cầu đăng ký'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
