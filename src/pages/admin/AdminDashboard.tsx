import { useEffect, useState } from 'react';
import {
  TrendingUp,
  ShoppingBag,
  BookOpen,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  MoreVertical,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import { statsService } from '../../services';
import type { AdminDashboardOverview, AdminOrderRow, AdminTopBook } from '../../types/admin';

function StatCard({
  title,
  value,
  trend,
  isPositive,
  icon: Icon,
}: {
  title: string;
  value: string;
  trend: string;
  isPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 bg-slate-50 rounded-xl">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className={`flex items-center gap-1 text-sm font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
          {trend}
        </div>
      </div>
      <div>
        <h3 className="text-sm font-bold text-outline mb-1">{title}</h3>
        <p className="text-2xl font-black text-primary">{value}</p>
      </div>
    </div>
  );
}

function statusLabel(status: string) {
  if (status === 'completed') return 'Hoàn thành';
  if (status === 'cancelled') return 'Đã hủy';
  return 'Đang xử lý';
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminDashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const o = await statsService.getAdminDashboardOverview();
        if (!cancelled) setData(o);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được dữ liệu');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const salesData = data?.salesByDay ?? [];
  const recentOrders: AdminOrderRow[] = data?.recentOrders ?? [];
  const topBooks: AdminTopBook[] = data?.topBooks ?? [];
  const totalRev = salesData.reduce((s, p) => s + p.total, 0);
  const booksSold = topBooks.reduce((s, b) => s + b.sales, 0);
  const uniqueCustomers = new Set(recentOrders.map((o) => o.customer)).size;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-primary">Tổng quan</h1>
          <p className="text-sm text-outline mt-1">Theo dõi hoạt động kinh doanh của cửa hàng</p>
        </div>
        <div className="flex gap-3">
          <select className="bg-white border border-slate-200 text-sm font-bold text-primary px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20">
            <option>7 ngày qua</option>
            <option>30 ngày qua</option>
            <option>Tháng này</option>
            <option>Năm nay</option>
          </select>
          <button
            type="button"
            className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
          >
            Tải báo cáo
          </button>
        </div>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng doanh thu (7 ngày)"
          value={`${Math.round(totalRev).toLocaleString('vi-VN')}đ`}
          trend="+12.5%"
          isPositive
          icon={TrendingUp}
        />
        <StatCard
          title="Đơn trên dashboard"
          value={String(recentOrders.length)}
          trend="+8.2%"
          isPositive
          icon={ShoppingBag}
        />
        <StatCard title="Sách bán (top)" value={String(booksSold)} trend="-2.4%" isPositive={false} icon={BookOpen} />
        <StatCard
          title="Khách (đơn gần đây)"
          value={String(uniqueCustomers)}
          trend="+15.3%"
          isPositive
          icon={Users}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">Doanh thu theo ngày</h2>
            <button type="button" className="p-2 hover:bg-slate-50 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-outline" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            {loading ? (
              <p className="text-outline text-sm py-24 text-center">Đang tải biểu đồ…</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1a1a1a" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#1a1a1a" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: number) => [`${value.toLocaleString('vi-VN')}đ`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="total" stroke="#1a1a1a" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-primary">Sách bán chạy</h2>
            <button type="button" className="text-sm font-bold text-primary hover:underline">
              Xem tất cả
            </button>
          </div>
          <div className="space-y-5">
            {loading ? (
              <p className="text-outline text-sm">Đang tải…</p>
            ) : topBooks.length === 0 ? (
              <p className="text-outline text-sm">Chưa có dữ liệu.</p>
            ) : (
              topBooks.map((book, index) => (
                <div key={book.id} className="flex items-center gap-4">
                  <span className="text-lg font-black text-slate-300 w-4">{index + 1}</span>
                  <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-slate-100 bg-slate-100">
                    {book.image ? (
                      <img src={book.image} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-primary truncate">{book.title}</h3>
                    <p className="text-xs text-outline truncate">{book.author}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs font-bold text-primary">{book.price}</span>
                      <span className="text-xs text-outline">{book.sales} đã bán</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-primary">Đơn hàng gần đây</h2>
          <button type="button" className="text-sm font-bold text-primary hover:underline">
            Xem tất cả
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold text-outline uppercase tracking-wider">
                <th className="px-6 py-4">Mã đơn</th>
                <th className="px-6 py-4">Khách hàng</th>
                <th className="px-6 py-4">Ngày đặt</th>
                <th className="px-6 py-4">Tổng tiền</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-outline text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-outline text-sm">
                    Chưa có đơn hàng.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold text-primary">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-primary">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-outline">{order.date}</td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">{order.total}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          order.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : order.status === 'processing'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {statusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" className="text-sm font-bold text-primary hover:underline">
                        Chi tiết
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
  );
}
