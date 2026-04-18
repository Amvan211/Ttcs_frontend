import { useEffect, useState } from 'react';
import { Download, Filter, MoreVertical, CheckCircle2, Clock, XCircle, Truck } from 'lucide-react';

import { orderService } from '../../services';
import type { AdminOrderRow } from '../../types/admin';

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await orderService.getAdminOrders();
        if (!cancelled) setOrders(list);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được đơn hàng');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const pendingCount = orders.filter((o) => o.status === 'processing').length;
  const monthTotalLabel = orders.length ? `${orders.length} đơn` : '—';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1e1b4b]">Quản lý đơn hàng</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">
            Theo dõi và quản lý toàn bộ các giao dịch từ độc giả và đối tác phân phối trong hệ thống lưu trữ.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </button>
          <button
            type="button"
            className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-lg text-sm font-semibold hover:bg-[#312e81] transition-colors shadow-md"
          >
            Tạo đơn mới
          </button>
        </div>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-slate-50 opacity-50">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 19h16v-7H4v7zm16-9c1.1 0 2 .9 2 2v7c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2v-7c0-1.1.9-2 2-2h1V8c0-2.76 2.24-5 5-5h4c2.76 0 5 2.24 5 5v2h1zM10 8c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2h-8V8z" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Tổng đơn (danh sách)</p>
            <p className="text-4xl font-black text-[#1e1b4b] mb-2">{loading ? '…' : orders.length}</p>
          </div>
        </div>

        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-red-100 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 text-red-100 opacity-50">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-2">Đang xử lý</p>
            <p className="text-4xl font-black text-red-600 mb-2">{loading ? '…' : pendingCount}</p>
          </div>
        </div>

        <div className="bg-[#1e1b4b] p-6 rounded-2xl shadow-sm relative overflow-hidden text-white">
          <div className="absolute -right-4 -bottom-4 text-white/5 opacity-50">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="currentColor">
              <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
            </svg>
          </div>
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-2">Tổng quan</p>
            <p className="text-2xl font-black text-white mb-2">{monthTotalLabel}</p>
            <p className="text-xs font-semibold text-blue-300 flex items-center gap-1">Dữ liệu từ API admin</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-serif font-bold text-[#1e1b4b]">Danh sách đơn hàng</h2>
          <div className="flex gap-2">
            <button type="button" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
              <Filter className="w-4 h-4" />
            </button>
            <button type="button" className="p-2 hover:bg-slate-200 rounded-lg transition-colors text-slate-500">
              <MoreVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">ID Đơn hàng</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4">Ghi chú</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-[#1e1b4b]">{order.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {order.customer.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{order.customer}</p>
                          <p className="text-[10px] text-slate-500">{order.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-[#1e1b4b]">{order.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          order.status === 'completed'
                            ? 'bg-green-50 text-green-600'
                            : order.status === 'processing'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {order.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                        {order.status === 'processing' && <Clock className="w-3 h-3" />}
                        {order.status === 'cancelled' && <XCircle className="w-3 h-3" />}
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 italic max-w-[200px] truncate">{order.note}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 flex justify-between items-center bg-slate-50/50">
          <span className="text-xs font-semibold text-slate-500">
            Hiển thị {orders.length} đơn{loading ? '' : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-lg font-serif font-bold text-[#1e1b4b] mb-2">Đồng bộ đối tác phân phối</h2>
          <p className="text-sm text-slate-500 mb-6">Dữ liệu đơn hàng lấy trực tiếp từ máy chủ.</p>
          <button type="button" className="text-sm font-bold text-[#4f46e5] hover:underline">
            Xem chi tiết quản lý đối tác →
          </button>
        </div>

        <div className="bg-[#1e1b4b] rounded-2xl p-6 text-white">
          <h2 className="text-lg font-serif font-bold mb-6 flex items-center gap-2">
            <Truck className="w-5 h-5 text-blue-300" />
            Lưu ý Vận hành
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-white/10 border border-white/5">
              <h4 className="text-xs font-bold text-blue-200 uppercase tracking-wider mb-1">Trạng thái</h4>
              <p className="text-sm text-slate-300">Theo dõi cột trạng thái để xử lý đơn đúng hạn.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
