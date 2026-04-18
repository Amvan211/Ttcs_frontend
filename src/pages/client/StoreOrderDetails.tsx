import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Package, Truck, CheckCircle2, AlertCircle, Printer } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { partnerService } from '../../services';
import type { ApiOrder } from '../../types/api';
import { formatOrderDate } from '../../utils/formatDate';

const COVER_PLACEHOLDER =
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=200&h=280';

function parseId(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n > 0 ? n : null;
}

const STATUS_OPTIONS = ['Mới', 'Đang xử lý', 'Đang giao', 'Đã giao', 'Đã hủy'];

export default function StoreOrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orderId = useMemo(() => parseId(id), [id]);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);

  useEffect(() => {
    if (orderId == null) {
      setLoading(false);
      setErr('Mã đơn không hợp lệ');
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const list = await partnerService.getPartnerOrders();
        const found = list.find((o) => o.id === orderId) ?? null;
        if (!cancelled) {
          setOrder(found);
          setNewStatus(found?.status ?? '');
          if (!found) setErr('Không tìm thấy đơn hàng');
        }
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được đơn hàng');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  const subtotal = order?.items?.reduce((s, li) => s + (li.lineTotal ?? li.unitPrice * li.quantity), 0) ?? order?.totalAmount ?? 0;

  const handleUpdateStatus = async () => {
    if (!order || !newStatus.trim()) return;
    setSaveErr(null);
    setSaving(true);
    try {
      const updated = await partnerService.updateOrderStatus(order.id, newStatus.trim());
      setOrder(updated);
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : 'Cập nhật thất bại');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full px-8 pb-20 pt-12 text-center text-on-surface-variant">Đang tải…</div>
    );
  }

  if (err || !order) {
    return (
      <div className="max-w-7xl mx-auto w-full px-8 pb-20 pt-12 text-center">
        <p className="text-on-surface-variant mb-4">{err || 'Không có dữ liệu'}</p>
        <Link to="/store/orders" className="text-primary font-bold hover:underline">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-8 pb-20 pt-12">
      <div className="mb-8">
        <Link
          to="/store/orders"
          className="inline-flex items-center text-sm font-bold text-outline hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách đơn hàng
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-serif text-4xl font-bold tracking-tight mb-2 text-primary">Chi tiết đơn hàng #{order.id}</h1>
            <p className="text-on-surface-variant font-medium">Đặt lúc: {formatOrderDate(order.orderDate ?? null)}</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-surface-container-low text-primary font-bold rounded-lg hover:bg-surface-container transition-colors"
            >
              <Printer className="w-4 h-4" />
              In hóa đơn
            </button>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="px-4 py-2 bg-surface-container-low rounded-lg font-bold text-sm border border-outline-variant/30"
            >
              {[...new Set([...STATUS_OPTIONS, order.status].filter(Boolean))].map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleUpdateStatus}
              disabled={saving || newStatus === order.status}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-50"
            >
              <Truck className="w-4 h-4" />
              {saving ? 'Đang lưu…' : 'Cập nhật trạng thái'}
            </button>
          </div>
        </div>
        {saveErr && <p className="mt-4 text-sm text-red-600">{saveErr}</p>}
      </div>

      <div className="bg-surface-container-lowest p-8 rounded-2xl shadow-sm border border-surface-container-low mb-8">
        <h2 className="text-lg font-bold text-primary mb-6">Trạng thái đơn hàng</h2>
        <p className="text-on-surface-variant text-sm mb-4">Hiện tại: {order.status}</p>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative gap-6">
          <div className="flex flex-col items-center relative z-10 bg-surface-container-lowest px-4">
            <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center mb-2 shadow-sm">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-primary">Đơn hàng</span>
          </div>
          <div className="flex flex-col items-center relative z-10 bg-surface-container-lowest px-4">
            <div className="w-10 h-10 rounded-full bg-tertiary text-white flex items-center justify-center mb-2 shadow-sm">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-tertiary">Xử lý</span>
          </div>
          <div className="flex flex-col items-center relative z-10 bg-surface-container-lowest px-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center mb-2">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-outline">Giao hàng</span>
          </div>
          <div className="flex flex-col items-center relative z-10 bg-surface-container-lowest px-4">
            <div className="w-10 h-10 rounded-full bg-surface-container-high text-outline flex items-center justify-center mb-2">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-bold text-outline">Hoàn thành</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low overflow-hidden">
            <div className="p-6 border-b border-surface-container-low">
              <h2 className="text-lg font-bold text-primary">Sản phẩm ({order.items?.length ?? 0})</h2>
            </div>
            <div className="divide-y divide-surface-container-low">
              {(order.items ?? []).map((item) => (
                <div key={`${item.bookId}-${item.quantity}`} className="p-6 flex items-center gap-6">
                  <div className="w-20 h-28 bg-surface-container-high rounded-md overflow-hidden flex-shrink-0 shadow-sm">
                    <img src={COVER_PLACEHOLDER} alt={item.bookTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg font-bold text-primary mb-1">{item.bookTitle}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-primary">
                        {item.unitPrice.toLocaleString('vi-VN')}đ x {item.quantity}
                      </span>
                      <span className="font-bold text-lg text-primary">
                        {(item.lineTotal ?? item.unitPrice * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-low">
            <h2 className="text-lg font-bold text-primary mb-6">Tổng thanh toán</h2>
            <div className="space-y-4">
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính</span>
                <span className="font-semibold">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="pt-4 border-t border-surface-container-low flex justify-between items-center">
                <span className="font-bold text-lg text-primary">Tổng cộng</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {(order.totalAmount ?? subtotal).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-low">
            <h2 className="text-lg font-bold text-primary mb-6">Thông tin khách hàng</h2>
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold text-outline uppercase tracking-wider block mb-1">Họ và tên</span>
                <p className="font-medium text-primary">{order.customerName ?? '—'}</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-surface-container-low">
            <h2 className="text-lg font-bold text-primary mb-6">Ghi chú / Giao hàng</h2>
            <p className="font-medium text-primary leading-relaxed whitespace-pre-line">{order.note || '—'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
