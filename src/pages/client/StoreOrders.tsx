import { useEffect, useState } from 'react';
import { ArrowLeft, Search, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { partnerService } from '../../services';
import type { ApiOrder } from '../../types/api';
import { formatOrderDate } from '../../utils/formatDate';

export default function StoreOrders() {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list = await partnerService.getPartnerOrders();
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

  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = q
      ? String(order.id).includes(q) || (order.customerName ?? '').toLowerCase().includes(q)
      : true;
    const matchStatus = filterStatus !== 'All' ? order.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  return (
    <div className="max-w-7xl mx-auto w-full px-8 pb-20 pt-12">
      <div className="mb-8">
        <Link
          to="/store"
          className="inline-flex items-center text-sm font-bold text-outline hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại gian hàng
        </Link>
        <h1 className="font-serif text-4xl font-bold tracking-tight mb-2 text-primary">Quản lý đơn hàng</h1>
        <p className="text-on-surface-variant font-medium">Theo dõi và xử lý các đơn hàng từ khách hàng của bạn.</p>
      </div>

      {err && <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, tên khách hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-surface-container-low border-none rounded-full focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <div className="flex w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full md:w-auto px-6 py-3 bg-surface-container-low border-none rounded-full font-bold focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
          >
            <option value="All">Tất cả trạng thái</option>
            <option value="Mới">Mới</option>
            <option value="Đang xử lý">Đang xử lý</option>
            <option value="Đang giao">Đang giao</option>
            <option value="Đã giao">Đã giao</option>
            <option value="Đã hủy">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-widest border-b border-surface-container">
              <tr>
                <th className="px-6 py-5">Mã đơn hàng</th>
                <th className="px-6 py-5">Khách hàng</th>
                <th className="px-6 py-5">Ngày đặt</th>
                <th className="px-6 py-5">Số lượng</th>
                <th className="px-6 py-5">Tổng tiền</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-6 py-5 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-surface-container-low">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-medium">
                    Đang tải…
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-on-surface-variant font-medium">
                    Không có đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const qty = order.items?.reduce((s, li) => s + li.quantity, 0) ?? 0;
                  return (
                    <tr key={order.id} className="hover:bg-surface-container-lowest/50 transition-colors group">
                      <td className="px-6 py-5 font-bold text-primary">#{order.id}</td>
                      <td className="px-6 py-5 font-medium">{order.customerName ?? '—'}</td>
                      <td className="px-6 py-5 text-outline">{formatOrderDate(order.orderDate ?? null)}</td>
                      <td className="px-6 py-5">{qty} sản phẩm</td>
                      <td className="px-6 py-5 font-bold">
                        {(order.totalAmount ?? 0).toLocaleString('vi-VN')}
                        đ
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase ${
                            order.status === 'Mới'
                              ? 'bg-primary-fixed text-on-primary-fixed-variant'
                              : order.status === 'Đang xử lý' || order.status === 'Đang giao'
                                ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                                : order.status === 'Đã giao'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-error-container text-error'
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          to={`/store/orders/${order.id}`}
                          className="inline-flex items-center justify-center p-2 text-outline hover:text-primary hover:bg-surface-container-highest rounded-full transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 border-t border-surface-container-low flex items-center justify-between">
          <span className="text-sm text-outline font-medium">Hiển thị {filteredOrders.length} đơn hàng</span>
        </div>
      </div>
    </div>
  );
}
