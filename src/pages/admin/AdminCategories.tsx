import { useEffect, useState } from 'react';
import { Filter, Download, Plus, Edit3, Trash2, Library, TrendingUp, Layers, Activity, Sparkles, BookOpen, X } from 'lucide-react';

import { categoryService } from '../../services';
import type { ApiCategory } from '../../types/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await categoryService.getAdminCategories();
      setCategories(list);
      setErr(null);
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Không tải được danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalBooksHint = categories.reduce((s, c) => {
    const m = c.count?.match(/(\d+)/);
    return s + (m ? Number(m[1]) : 0);
  }, 0);

  const handleCreate = () => {
    setEditingId(null);
    setFormData({ name: '' });
    setIsModalOpen(true);
  };

  const handleEdit = (id: string) => {
    const current = categories.find((c) => c.id === id);
    if (!current) return;
    setEditingId(current.categoryId ?? Number(current.id));
    setFormData({ name: current.label });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    try {
      if (editingId) {
        await categoryService.updateAdminCategory(editingId, { name: formData.name.trim() });
      } else {
        await categoryService.createAdminCategory({ name: formData.name.trim() });
      }
      setIsModalOpen(false);
      await loadData();
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Lưu danh mục thất bại');
    }
  };

  const handleDelete = (id: string) => {
    const run = async () => {
      if (!window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;
      const current = categories.find((c) => c.id === id);
      if (!current) return;
      const categoryId = current.categoryId ?? Number(current.id);
      await categoryService.deleteAdminCategory(categoryId);
      await loadData();
    };
    run().catch((e) => setErr(e instanceof Error ? e.message : 'Xóa danh mục thất bại'));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1e1b4b]">Quản lý danh mục</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">Danh mục hiển thị theo API khám phá (đọc công khai).</p>
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Tổng danh mục</p>
            <p className="text-3xl font-black text-[#4f46e5]">{loading ? '…' : categories.length}</p>
          </div>
          <div className="w-px h-12 bg-slate-200" />
          <div className="text-right bg-[#1e1b4b] text-white px-6 py-2 rounded-xl shadow-md">
            <p className="text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1">Sách (ước lượng)</p>
            <p className="text-3xl font-black">{loading ? '…' : totalBooksHint}</p>
          </div>
        </div>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 className="text-lg font-serif font-bold text-[#1e1b4b]">Danh sách danh mục</h2>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCreate}
              className="flex items-center gap-2 px-4 py-2 bg-[#1e1b4b] text-white rounded-lg text-sm font-semibold hover:bg-[#312e81] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Thêm mới
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
                <th className="px-6 py-4">Tên danh mục</th>
                <th className="px-6 py-4">Số lượng sách</th>
                <th className="px-6 py-4">Ngày tạo</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không có danh mục.
                  </td>
                </tr>
              ) : (
                categories.map((category) => (
                  <tr key={category.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{category.categoryId ?? category.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-[#1e1b4b]">{category.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                        {category.count}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">—</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(category.id)} className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors text-slate-400">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(category.id)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors text-slate-400">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <h2 className="text-lg font-serif font-bold text-[#1e1b4b] mb-6">Archive Insights</h2>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Library className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Taxonomy</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Danh mục đồng bộ từ máy chủ.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Inventory Balance</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Số lượng sách theo từng danh mục.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Growth</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Theo dõi mở rộng danh mục theo thời gian.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-1">Collection Health</h4>
                <p className="text-xs text-slate-500 leading-relaxed">Dữ liệu trực tiếp từ API.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#1e1b4b] rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-[#312e81] rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-200 mb-4 tracking-wider">
              <Sparkles className="w-3 h-3 text-blue-400" />
              AI Curator Tool
            </div>
            <p className="text-sm text-blue-100/90 mb-8 leading-relaxed">
              Gợi ý phân loại có thể được mở rộng khi backend cung cấp thêm metadata.
            </p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-xl font-serif font-bold text-[#1e1b4b]">
                {editingId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="p-6">
              <form id="category-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">Tên danh mục *</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#4f46e5]/20 focus:border-[#4f46e5] outline-none transition-all" 
                    placeholder="Nhập tên danh mục..."
                  />
                </div>
              </form>
            </div>
            
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Hủy
              </button>
              <button 
                type="submit" 
                form="category-form"
                className="px-6 py-2.5 bg-[#1e1b4b] text-white rounded-xl text-sm font-bold hover:bg-[#312e81] transition-colors shadow-lg"
              >
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
