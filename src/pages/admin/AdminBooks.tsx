import { useEffect, useState } from 'react';
import { Search, Filter, Download, MoreVertical, AlertTriangle, Clock, Package, Plus, Edit3, Trash2 } from 'lucide-react';

import { bookService } from '../../services';
import type { ApiBook } from '../../types/api';

export default function AdminBooks() {
  const [books, setBooks] = useState<ApiBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await bookService.getAdminBooks();
        if (!cancelled) setBooks(list);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được sách chờ duyệt');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = books.filter((b) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (b.title?.toLowerCase().includes(s) ?? false) || (b.author?.toLowerCase().includes(s) ?? false);
  });

  const totalStock = books.reduce((s, b) => s + (b.stock ?? 0), 0);

  const handleCreate = () => {
    const run = async () => {
      const title = window.prompt('Tên sách mới');
      if (!title?.trim()) return;
      const author = window.prompt('Tác giả', 'Chưa cập nhật') || 'Chưa cập nhật';
      const price = Number(window.prompt('Giá', '0'));
      const stockQuantity = Number(window.prompt('Tồn kho', '0'));
      const categoryIdRaw = window.prompt('Nhập categoryId', '1');
      const categoryId = Number(categoryIdRaw);
      if (!Number.isFinite(categoryId)) return;
      const created = await bookService.createAdminBook({
        title: title.trim(),
        author: author.trim(),
        price: Number.isFinite(price) ? price : 0,
        stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
        categoryId,
        approvalStatus: 'APPROVED',
      });
      setBooks((prev) => [created, ...prev]);
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Tạo sách thất bại'));
  };

  const handleEdit = (id: number) => {
    const run = async () => {
      const row = books.find((b) => b.id === id);
      if (!row) return;
      const title = window.prompt('Cập nhật tên sách', row.title);
      if (!title?.trim()) return;
      const approvalStatus = window.prompt(
        'Trạng thái duyệt (PENDING/APPROVED/REJECTED)',
        row.approvalStatus || 'APPROVED'
      );
      const updated = await bookService.updateAdminBook(id, {
        title: title.trim(),
        approvalStatus: (approvalStatus || 'APPROVED').toUpperCase(),
      });
      setBooks((prev) => prev.map((b) => (b.id === id ? updated : b)));
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Cập nhật sách thất bại'));
  };

  const handleDelete = (id: number) => {
    const run = async () => {
      if (!window.confirm('Xóa sách này khỏi danh sách?')) return;
      await bookService.deleteAdminBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Xóa sách thất bại'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1e1b4b]">Quản lý Kho Sách</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">CRUD sách theo dữ liệu thực tế từ API admin.</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng đầu sách</p>
            <p className="text-3xl font-black text-[#4f46e5]">{loading ? '…' : books.length}</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng tồn (bản)</p>
            <p className="text-3xl font-black text-[#4f46e5]">{loading ? '…' : totalStock}</p>
          </div>
        </div>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2 flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="search"
              placeholder="Tìm theo tên / tác giả…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="flex-1 text-sm border-none bg-transparent focus:ring-0 outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-lg text-sm font-semibold hover:bg-[#312e81] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Thêm sách
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <Download className="w-4 h-4" />
              Xuất báo cáo
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Bìa & Thông tin sách</th>
                <th className="px-6 py-4">Danh mục</th>
                <th className="px-6 py-4">Giá niêm yết</th>
                <th className="px-6 py-4">Tồn kho</th>
                <th className="px-6 py-4">Đối tác</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không có sách.
                  </td>
                </tr>
              ) : (
                filtered.map((book) => {
                  const stock = book.stock ?? 0;
                  const lowStock = stock < 10;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-xs font-bold text-slate-500">{book.id}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 border border-slate-100 shadow-sm bg-slate-100">
                            {book.coverImage ? (
                              <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-sm font-bold text-[#1e1b4b]">{book.title}</h3>
                            <p className="text-xs text-slate-500">{book.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold tracking-wider">
                          {book.category ?? '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-bold text-[#1e1b4b]">
                        {book.price != null ? `${Math.round(book.price).toLocaleString('vi-VN')}đ` : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                            lowStock ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${lowStock ? 'bg-red-500' : 'bg-green-500'}`} />
                          {stock} bản
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-slate-700">—</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button type="button" onClick={() => handleEdit(book.id)} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-slate-400">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button type="button" onClick={() => handleDelete(book.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-400">
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1e1b4b] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#312e81] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <h2 className="text-2xl font-serif font-black mb-3">Duyệt sách</h2>
            <p className="text-blue-100/80 text-sm max-w-md mb-8 leading-relaxed">
              Phê duyệt sách có thể được bổ sung qua API <code className="text-xs bg-white/10 px-1 rounded">PUT /api/admin/books/&#123;id&#125;/approve</code> trong phiên bản tiếp theo của giao diện này.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-sm font-bold text-red-600 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Thông báo
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                <Clock className="w-4 h-4 text-orange-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Hàng chờ</h4>
                <p className="text-xs text-slate-500 mt-1">Ưu tiên xử lý các đầu sách có tồn kho thấp sau khi duyệt.</p>
              </div>
            </div>
            <div className="flex gap-4 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Đồng bộ</h4>
                <p className="text-xs text-slate-500 mt-1">Danh sách lấy từ máy chủ theo thời gian thực.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
