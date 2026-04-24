import { useEffect, useState } from 'react';
import { ChevronRight, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { orderService } from '../../services';
import type { ApiOrder } from '../../types/api';
import { formatOrderDate } from '../../utils/formatDate';

const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=280';

function orderToTableRows(orders: ApiOrder[]) {
  return orders.map((order) => {
    const first = order.items?.[0];
    const extra = (order.items?.length ?? 0) > 1 ? ` +${(order.items?.length ?? 0) - 1} sản phẩm` : '';
    return {
      id: order.id,
      title: first?.bookTitle ?? 'Đơn hàng',
      author: extra || ' ',
      date: formatOrderDate(order.orderDate ?? null),
      status: order.status ?? '—',
      coverImage: PLACEHOLDER_COVER,
    };
  });
}

export default function Profile() {
  const { user } = useAuth();
  const avatarSrc = user?.avatarUrl || user?.avatar;
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<ApiOrder | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const list = await orderService.getHistory();
        if (!cancelled) setOrders(list);
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không tải được đơn hàng');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const rows = orderToTableRows(orders);

  return (
    <div className="pt-12 pb-20 px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <aside className="lg:col-span-4 space-y-8">
          <div className="bg-surface-container-low p-8 rounded-xl relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden mb-6 ring-4 ring-white shadow-xl bg-surface-dim flex items-center justify-center text-4xl font-serif font-bold text-primary">
                {avatarSrc ? (
                  <img src={avatarSrc} alt={user?.name || 'User'} className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.name || user?.email || '?').charAt(0).toUpperCase()}</span>
                )}
              </div>
              <h1 className="text-3xl font-bold text-on-surface mb-1">{user?.name || 'Khách'}</h1>
              <p className="text-sm font-label uppercase tracking-widest text-on-surface-variant mb-6">
                {user?.role === 'PARTNER' ? 'Partner' : user?.role === 'ADMIN' ? 'Admin' : 'Collector'}
              </p>

              <div className="w-full space-y-4 text-left border-t border-outline-variant/30 pt-6">
                <div>
                  <span className="text-xs font-label uppercase tracking-wider text-outline">Email</span>
                  <p className="text-on-surface font-medium">{user?.email || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-label uppercase tracking-wider text-outline">Membership</span>
                  <p className="text-on-surface font-medium italic font-serif">The First Edition Circle</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-8 w-full py-3 bg-gradient-to-r from-primary to-primary-container text-white rounded-full font-medium transition-transform active:scale-95 shadow-lg shadow-primary/20"
              >
                Xem hồ sơ công khai
              </button>
            </div>
          </div>

          <div className="bg-surface-container-low p-8 rounded-xl">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">Cài đặt tài khoản</h3>
            <nav className="flex flex-col gap-2">
              <Link
                to="/profile/edit"
                className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-highest transition-all group"
              >
                <span className="font-medium text-on-surface-variant group-hover:text-primary">Chỉnh sửa hồ sơ</span>
                <ChevronRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/profile/password"
                className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-highest transition-all group"
              >
                <span className="font-medium text-on-surface-variant group-hover:text-primary">Đổi mật khẩu</span>
                <ChevronRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="#"
                className="flex items-center justify-between p-4 rounded-lg hover:bg-surface-container-highest transition-all group"
              >
                <span className="font-medium text-on-surface-variant group-hover:text-primary">Phương thức thanh toán</span>
                <ChevronRight className="w-5 h-5 text-outline group-hover:translate-x-1 transition-transform" />
              </Link>
            </nav>
          </div>
        </aside>

        <section className="lg:col-span-8 space-y-12">
          <div>
            <div className="flex justify-between items-end mb-8">
              <h2 className="text-4xl font-bold tracking-tight font-serif">Đơn hàng gần đây</h2>
              <Link
                to="/explore"
                className="text-sm font-label uppercase tracking-widest text-primary hover:underline underline-offset-4 transition-all"
              >
                Xem kho lưu trữ
              </Link>
            </div>

            {loadError && (
              <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{loadError}</div>
            )}

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low text-left">
                      <th className="px-6 py-4 font-label text-xs uppercase tracking-widest text-outline">Tác phẩm</th>
                      <th className="px-6 py-4 font-label text-xs uppercase tracking-widest text-outline">Ngày mua</th>
                      <th className="px-6 py-4 font-label text-xs uppercase tracking-widest text-outline">Trạng thái</th>
                      <th className="px-6 py-4 font-label text-xs uppercase tracking-widest text-outline text-right">Chi tiết</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-container">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                          Đang tải đơn hàng…
                        </td>
                      </tr>
                    ) : rows.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                          Chưa có đơn hàng nào.
                        </td>
                      </tr>
                    ) : (
                      rows.map((order) => (
                        <tr key={order.id} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-16 bg-surface-dim rounded overflow-hidden flex-shrink-0 shadow-sm">
                                <img src={order.coverImage} alt={order.title} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <p className="font-bold text-on-surface font-serif text-lg leading-tight">{order.title}</p>
                                <p className="text-sm text-outline">{order.author}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-on-surface-variant font-medium">{order.date}</td>
                          <td className="px-6 py-6">
                            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-xs font-bold uppercase tracking-wider">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-6 text-right">
                            <button
                              type="button"
                              onClick={() => {
                                const found = orders.find((o) => o.id === order.id) ?? null;
                                setSelectedOrder(found);
                              }}
                              className="p-2 hover:bg-surface-container-high rounded-full transition-colors inline-block"
                            >
                              <ArrowRight className="w-5 h-5 text-on-surface-variant -rotate-45" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-primary text-white p-10 rounded-xl relative overflow-hidden group">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/natural-paper.png')]"></div>
              <h3 className="text-2xl font-bold mb-4 font-serif italic relative z-10">Gợi ý cho bạn</h3>
              <p className="text-on-primary-container text-sm leading-relaxed mb-6 relative z-10">
                Dựa trên lịch sử mua hàng, chúng tôi sẽ sớm gợi ý tác phẩm phù hợp hơn trong phiên bản tiếp theo.
              </p>
              <Link
                to="/explore"
                className="inline-flex items-center gap-2 font-bold text-tertiary-fixed-dim hover:text-white transition-colors relative z-10 group"
              >
                Khám phá bộ sưu tập
                <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>

            <div className="bg-tertiary-container text-tertiary-fixed p-10 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-4 font-serif">Trạng thái thành viên</h3>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-5 h-5 text-tertiary-fixed-dim" />
                  <span className="font-label uppercase tracking-widest text-xs">Hạng Bạch Kim</span>
                </div>
              </div>
              <p className="text-tertiary-fixed-dim text-sm italic font-serif">
                Cảm ơn bạn đã đồng hành cùng The Archive.
              </p>
            </div>
          </div>
        </section>
      </div>
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-2xl font-bold">Chi tiết đơn hàng #{selectedOrder.id}</h3>
              <button type="button" className="text-sm font-semibold text-primary" onClick={() => setSelectedOrder(null)}>
                Đóng
              </button>
            </div>
            <p className="text-sm text-on-surface-variant mb-4">
              Ngày đặt: {formatOrderDate(selectedOrder.orderDate ?? null)} - Trạng thái: {selectedOrder.status}
            </p>
            <div className="space-y-3">
              {(selectedOrder.items ?? []).map((line) => (
                <div key={`${line.bookId}-${line.quantity}`} className="p-4 rounded-xl bg-surface-container-low flex items-center justify-between gap-4">
                  <div>
                    <p className="font-semibold">{line.bookTitle}</p>
                    <p className="text-sm text-on-surface-variant">SL: {line.quantity}</p>
                  </div>
                  <p className="font-bold">{(line.lineTotal ?? line.unitPrice * line.quantity).toLocaleString('vi-VN')}đ</p>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-outline-variant/30 text-right">
              <p className="text-sm text-on-surface-variant">Tổng đơn</p>
              <p className="text-2xl font-bold text-primary">{selectedOrder.totalAmount.toLocaleString('vi-VN')}đ</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
