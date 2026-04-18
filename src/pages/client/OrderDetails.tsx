import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { orderService } from '../../services';
import type { ApiOrder } from '../../types/api';
import { formatOrderDate } from '../../utils/formatDate';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=240&h=360';

function parseOrderId(raw: string | undefined): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isNaN(n) && n > 0) return n;
  const m = raw.match(/(\d+)/);
  return m ? Number(m[1]) : null;
}

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const orderId = useMemo(() => parseOrderId(id), [id]);
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId == null) {
      setLoading(false);
      setError('Mã đơn không hợp lệ');
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await orderService.getHistory();
        const found = list.find((o) => o.id === orderId) ?? null;
        if (!cancelled) {
          setOrder(found);
          if (!found) setError('Không tìm thấy đơn hàng');
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Không tải được đơn hàng');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center text-on-surface-variant">Đang tải…</div>
    );
  }

  if (error || !order) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto text-center">
        <p className="text-on-surface-variant mb-6">{error || 'Không có dữ liệu'}</p>
        <Link to="/profile" className="text-primary font-bold hover:underline">
          Quay lại hồ sơ
        </Link>
      </div>
    );
  }

  const subtotal = order.items?.reduce((s, li) => s + (li.lineTotal ?? li.unitPrice * li.quantity), 0) ?? order.totalAmount;

  return (
    <div className="pt-12 pb-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <Link to="/profile" className="inline-flex items-center text-primary font-bold hover:opacity-70 transition-all">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại danh sách đơn hàng
          </Link>
          <h2 className="text-5xl font-serif font-bold tracking-tight text-on-surface">Chi tiết đơn hàng</h2>
          <div className="flex flex-wrap gap-4 items-center">
            <span className="text-2xl font-body font-extrabold text-primary">#{order.id}</span>
            <span className="px-4 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant text-sm font-bold tracking-wide uppercase">
              {order.status}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-on-surface-variant text-sm font-label uppercase tracking-widest">Ngày đặt hàng</p>
          <p className="text-xl font-bold">{formatOrderDate(order.orderDate ?? null)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-low rounded-xl p-8">
            <h3 className="font-serif text-2xl mb-8">Danh sách sản phẩm</h3>
            <div className="space-y-8">
              {(order.items ?? []).map((line) => (
                <div key={`${line.bookId}-${line.quantity}`} className="flex flex-col sm:flex-row gap-6 p-4 rounded-xl book-card-hover transition-all">
                  <div className="relative w-32 h-44 flex-shrink-0 -mt-8 sm:mt-0 shadow-xl overflow-hidden rounded-lg bg-surface-dim">
                    <img src={PLACEHOLDER} alt={line.bookTitle} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between py-2">
                    <div>
                      <h4 className="font-serif text-xl font-bold text-on-surface">{line.bookTitle}</h4>
                      <div className="mt-4 flex items-center gap-4">
                        <span className="text-xs font-bold uppercase tracking-widest text-outline">Số lượng: {String(line.quantity).padStart(2, '0')}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {(line.lineTotal ?? line.unitPrice * line.quantity).toLocaleString('vi-VN')}đ
                      </span>
                      {line.quantity > 1 && (
                        <span className="text-sm text-on-surface-variant">({line.unitPrice.toLocaleString('vi-VN')}đ / cuốn)</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container rounded-xl p-8">
            <h3 className="font-serif text-2xl mb-6">Ghi chú &amp; giao hàng</h3>
            <div className="relative pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">
              <div className="relative flex items-start">
                <span className="absolute -left-8 w-6 h-6 bg-primary rounded-full flex items-center justify-center border-4 border-surface-container">
                  <Check className="w-3 h-3 text-white" />
                </span>
                <div>
                  <p className="font-bold text-on-surface">Đơn đã được ghi nhận</p>
                  <p className="text-sm text-on-surface-variant whitespace-pre-line mt-2">{order.note || 'Không có ghi chú thêm.'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside className="sticky top-28 space-y-6">
          <div className="bg-surface-container-high rounded-xl p-8 shadow-sm">
            <h3 className="font-serif text-2xl mb-6 border-b border-outline-variant pb-4">Tóm tắt thanh toán</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-on-surface-variant">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="pt-4 border-t border-outline-variant flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold">Tổng (hệ thống)</span>
                <span className="text-3xl font-extrabold text-primary">
                  {(order.totalAmount ?? subtotal).toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
