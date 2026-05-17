import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, TrendingUp, Store, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Book } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { partnerService, categoryService } from '../../services';
import { mapApiBookToBook } from '../../utils/bookMapper';
import type { ApiCategory } from '../../types/api';

export default function StoreDashboard() {
  const { isLoggedIn, user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [stats, setStats] = useState<{ totalRevenue: number; orderCount: number } | null>(null);
  const [orderCount, setOrderCount] = useState(0);
  const [loadErr, setLoadErr] = useState<string | null>(null);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [activeKpiModal, setActiveKpiModal] = useState<'revenue' | 'books' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: 0,
    stock: 0,
    status: 'APPROVED',
    coverImage: '',
    categoryId: 0,
    description: '',
  });
  const [saveErr, setSaveErr] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    let cancelled = false;
    (async () => {
      setInventoryLoading(true);
      setLoadErr(null);
      try {
        const [inv, cats, st, ords] = await Promise.all([
          partnerService.getInventory(),
          categoryService.listCategories(),
          partnerService.getStats().catch(() => null),
          partnerService.getPartnerOrders().catch(() => []),
        ]);
        if (cancelled) return;
        setBooks(inv.map(mapApiBookToBook));
        setCategories(cats);
        if (st) setStats(st);
        setOrderCount(Array.isArray(ords) ? ords.length : 0);
      } catch (e) {
        if (!cancelled) setLoadErr(e instanceof Error ? e.message : 'Không tải được kho sách');
      } finally {
        if (!cancelled) setInventoryLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const defaultCategoryId = () => {
    const c = categories.find((x) => x.categoryId != null);
    return c?.categoryId ?? 0;
  };

  const handleOpenModal = (book?: Book) => {
    setSaveErr(null);
    const toApprovalStatus = (status?: string) => {
      if (status === 'Chờ duyệt') return 'PENDING';
      if (status === 'Ngừng kinh doanh') return 'REJECTED';
      return 'APPROVED';
    };
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        price: book.price,
        stock: book.stock || 0,
        status: toApprovalStatus(book.status),
        coverImage: book.coverImage || '',
        categoryId: defaultCategoryId(),
        description: book.description || '',
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: '',
        price: 0,
        stock: 0,
        status: 'APPROVED',
        coverImage: '',
        categoryId: defaultCategoryId(),
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (bookId: number | string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa sách này không?')) return;
    try {
      await partnerService.deleteBook(Number(bookId));
      alert('Xóa sách thành công');
      setBooks(prevBooks => prevBooks.filter(b => Number(b.id) !== Number(bookId)));
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Không xóa được sách');
    }
  };  

  const handleSaveBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveErr(null);
    if (!formData.categoryId) {
      setSaveErr('Vui lòng chọn danh mục (cần categoryId từ máy chủ).');
      return;
    }
    setSaveLoading(true);
    try {
      const payload = {
        title: formData.title.trim(),
        author: formData.author.trim() || undefined,
        price: Number(formData.price),
        stockQuantity: Math.max(0, Math.floor(Number(formData.stock))),
        coverImageUrl: formData.coverImage.trim() || undefined,
        description: formData.description.trim() || undefined,
        approvalStatus: formData.status as 'PENDING' | 'APPROVED' | 'REJECTED',
        categoryId: formData.categoryId,
      };
      if (editingBook) {
        await partnerService.updateBook(Number(editingBook.id), payload);
      } else {
        await partnerService.addBook(payload);
      }
      const inv = await partnerService.getInventory();
      setBooks(inv.map(mapApiBookToBook));
      setIsModalOpen(false);
    } catch (err) {
      setSaveErr(err instanceof Error ? err.message : 'Không thêm được sách');
    } finally {
      setSaveLoading(false);
    }
  };

  const activeBooksCount = books.filter(b => b.status === 'Đang bán').length;
  const outOfStockCount = books.filter(b => b.status === 'Hết hàng').length;

  const filteredBooks = books.filter(book => {
    const matchSearch = searchQuery 
      ? (book.title.toLowerCase().includes(searchQuery.toLowerCase()) || book.author.toLowerCase().includes(searchQuery.toLowerCase())) 
      : true;
    const matchStatus = filterStatus !== 'All' ? book.status === filterStatus : true;
    return matchSearch && matchStatus;
  });

  const [partnerRegData, setPartnerRegData] = useState({ storeName: '', address: '', description: '' });
  const [regLoading, setRegLoading] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    try {
      await partnerService.registerStore(partnerRegData);
      setRegSuccess(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Đăng ký thất bại');
    } finally {
      setRegLoading(false);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-inner">
          <Store className="w-12 h-12 text-outline" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary tracking-tight mb-4">Gian hàng của bạn</h1>
        <p className="text-on-surface-variant font-medium tracking-wide mb-8 max-w-md mx-auto">
          Vui lòng đăng nhập để quản lý gian hàng, xem báo cáo doanh thu và cập nhật sản phẩm của bạn.
        </p>
        <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  if (user?.role === 'CUSTOMER' || user?.role === 'READER') {
    return (
      <div className="pt-32 pb-24 px-8 max-w-2xl mx-auto min-h-[70vh]">
        <div className="bg-surface-container-low p-8 rounded-2xl shadow-sm border border-outline-variant/30">
          <h2 className="font-serif text-3xl font-bold text-primary mb-2">Đăng ký đối tác</h2>
          <p className="text-on-surface-variant mb-8">Trở thành đối tác bán sách để đăng và quản lý sách của bạn trên hệ thống The Archive.</p>
          {regSuccess ? (
            <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
              <p className="font-bold mb-1">Đăng ký thành công!</p>
              <p className="text-sm">Yêu cầu của bạn đã được gửi. Vui lòng đăng xuất và đăng nhập lại sau khi admin phê duyệt để có thể sử dụng gian hàng.</p>
            </div>
          ) : (
            <form onSubmit={handleRegisterPartner} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Tên cửa hàng</label>
                <input required type="text" value={partnerRegData.storeName} onChange={e => setPartnerRegData({...partnerRegData, storeName: e.target.value})} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Tên gian hàng của bạn" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Địa chỉ</label>
                <input type="text" value={partnerRegData.address} onChange={e => setPartnerRegData({...partnerRegData, address: e.target.value})} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Địa chỉ liên hệ (không bắt buộc)" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-on-surface-variant mb-2">Mô tả gian hàng</label>
                <textarea rows={3} value={partnerRegData.description} onChange={e => setPartnerRegData({...partnerRegData, description: e.target.value})} className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all" placeholder="Giới thiệu ngắn về cửa hàng của bạn" />
              </div>
              <button type="submit" disabled={regLoading} className="w-full py-4 bg-primary text-white font-bold rounded-xl mt-4 hover:opacity-90 disabled:opacity-50">
                {regLoading ? 'Đang gửi...' : 'Gửi yêu cầu đăng ký'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-8 pb-20 pt-12">
      {/* Dashboard Header */}
      <section className="mb-12">
        <h1 className="font-serif text-5xl font-bold tracking-tight mb-2 text-primary">Gian hàng của bạn</h1>
        <p className="text-on-surface-variant font-medium">
          Chào mừng trở lại{user?.name ? `, ${user.name}` : ''}. Đây là báo cáo tổng quan về hoạt động kinh doanh của bạn hôm nay.
        </p>
      </section>

      {loadErr && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{loadErr}</div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div 
          onClick={() => setActiveKpiModal('revenue')}
          className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between group hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer shadow-sm hover:shadow-xl"
        >
          <div>
            <span className="text-sm font-bold tracking-widest uppercase mb-4 block text-on-surface-variant group-hover:text-primary-fixed">TỔNG DOANH THU</span>
            <div className="text-4xl font-bold font-serif">
              {stats != null ? `${Math.round(stats.totalRevenue).toLocaleString('vi-VN')}đ` : inventoryLoading ? '…' : '—'}
            </div>
          </div>
        </div>
        <div 
          onClick={() => setActiveKpiModal('books')}
          className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md"
        >
          <div>
            <span className="text-sm font-bold tracking-widest uppercase mb-4 block text-on-surface-variant">SÁCH ĐANG BÁN</span>
            <div className="text-4xl font-bold font-serif">{activeBooksCount}</div>
          </div>
          <div className="mt-6 text-sm font-semibold text-outline">
            {outOfStockCount > 0 ? `${outOfStockCount} sách đã hết hàng` : 'Tất cả sách đều còn hàng'}
          </div>
        </div>
        <div className="bg-surface-container-low p-8 rounded-xl flex flex-col justify-between group hover:bg-surface-container-high transition-all duration-300 shadow-sm">
          <div>
            <span className="text-sm font-bold tracking-widest uppercase mb-4 block text-on-surface-variant">ĐƠN HÀNG (KHO)</span>
            <div className="text-4xl font-bold font-serif text-on-tertiary-container">{inventoryLoading ? '…' : orderCount}</div>
          </div>
          <div className="mt-6">
            <Link to="/store/orders" className="text-sm font-bold underline underline-offset-4 hover:text-primary transition-colors">Xem chi tiết đơn hàng</Link>
          </div>
        </div>
      </div>

      {/* Inventory Header */}
      <div className="flex flex-col mb-8 gap-4">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4 w-full">
          <div>
            <h2 className="font-serif text-3xl font-bold">Danh mục sản phẩm</h2>
            <div className="h-1 w-20 bg-tertiary-container mt-2"></div>
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-primary text-white px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-xl transition-all scale-95 hover:scale-100 whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Thêm sách mới
          </button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4 bg-surface-container-low p-4 rounded-xl mt-2 w-full border border-outline-variant/30">
          <div className="w-full md:flex-1 relative">
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên sách, tác giả..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-outline"
            />
          </div>
          <div className="w-full md:w-64">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface-container-lowest border border-outline-variant/50 rounded-lg text-sm font-bold focus:border-primary focus:ring-1 focus:ring-primary outline-none cursor-pointer transition-all"
            >
              <option value="All">Tất cả trạng thái</option>
              <option value="Đang bán">Đang bán</option>
              <option value="Hết hàng">Hết hàng</option>
              <option value="Chờ duyệt">Chờ duyệt</option>
              <option value="Ngừng kinh doanh">Ngừng kinh doanh</option>
            </select>
          </div>
        </div>
      </div>

      {/* Inventory List / Tables */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-separate border-spacing-y-3">
          <thead className="bg-surface-container-low text-on-surface-variant text-xs font-bold uppercase tracking-widest">
            <tr>
              <th className="px-6 py-4 rounded-l-md">Sản phẩm</th>
              <th className="px-6 py-4">Giá bán</th>
              <th className="px-6 py-4">Tồn kho</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 rounded-r-md text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {inventoryLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl">
                  Đang tải kho sách…
                </td>
              </tr>
            ) : filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-on-surface-variant bg-surface-container-lowest rounded-xl">
                  {books.length === 0 ? 'Chưa có sản phẩm nào. Hãy thêm sách mới!' : 'Không tìm thấy sản phẩm phù hợp với bộ lọc.'}
                </td>
              </tr>
            ) : (
              filteredBooks.map((book) => (
                <tr key={book.id} className="bg-surface-container-lowest hover:bg-surface-container transition-colors group relative">
                  <td className="px-6 py-4 rounded-l-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-16 bg-surface-container-high rounded-md overflow-hidden flex-shrink-0 -rotate-2 group-hover:rotate-0 transition-transform duration-300 shadow-sm">
                        <img src={book.coverImage} alt="Book Cover" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-base font-serif">{book.title}</div>
                        <div className="text-xs text-outline italic">{book.author}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold">{book.price.toLocaleString('vi-VN')}đ</td>
                  <td className="px-6 py-4">{book.stock} cuốn</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      book.status === 'Đang bán' 
                        ? 'bg-primary-fixed text-on-primary-fixed-variant' 
                        : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
                    }`}>
                      {book.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 rounded-r-xl text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => handleOpenModal(book)}
                        className="p-2 hover:bg-surface-container-highest rounded-full text-primary"
                        title="Chỉnh sửa sách"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBook(book.id)}
                        className="p-2 rounded-full text-on-surface-variant hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                        title="Xóa sách: liên hệ quản trị — API chưa có"
                      >
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
              <h3 className="font-serif text-2xl font-bold text-primary">
                {editingBook ? 'Chỉnh sửa sách' : 'Thêm sách mới'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSaveBook} className="p-6">
              {saveErr && <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-700 text-sm">{saveErr}</div>}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Danh mục</label>
                  <select
                    required
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    {categories
                      .filter((c) => c.categoryId != null)
                      .map((c) => (
                        <option key={c.id} value={c.categoryId!}>
                          {c.label}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tên sách</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tác giả</label>
                  <input 
                    required 
                    type="text" 
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Giá bán (VNĐ)</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Trạng thái sách</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  >
                    <option value="APPROVED">Đang bán</option>
                    <option value="PENDING">Chờ duyệt</option>
                    <option value="REJECTED">Ngừng kinh doanh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Tồn kho</label>
                  <input 
                    required 
                    type="number" 
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Mô tả sách</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                    placeholder="Giới thiệu nội dung sách..."
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Ảnh bìa (URL, tùy chọn)</label>
                  <input
                    type="url"
                    value={formData.coverImage}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-4 py-3 bg-surface-container-low border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4 pt-4 border-t border-surface-container-low">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 font-bold text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={saveLoading}
                  className="px-8 py-2.5 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-colors shadow-md disabled:opacity-60"
                >
                  {saveLoading ? 'Đang lưu…' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* KPI Modals */}
      {activeKpiModal === 'revenue' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
              <h3 className="font-serif text-2xl font-bold text-primary">
                Chi tiết doanh thu
              </h3>
              <button 
                onClick={() => setActiveKpiModal(null)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-surface-container-low rounded-xl">
                  <span className="font-bold text-on-surface">Doanh thu (API)</span>
                  <span className="font-bold text-primary">
                    {stats != null ? `${Math.round(stats.totalRevenue).toLocaleString('vi-VN')}đ` : '—'}
                  </span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-surface-container-low">
                <p className="text-sm text-on-surface-variant italic">
                  Doanh thu đã trừ các khoản phí nền tảng và thuế.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeKpiModal === 'books' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-surface-container-lowest rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-surface-container-low">
              <h3 className="font-serif text-2xl font-bold text-primary">
                Thống kê kho sách
              </h3>
              <button 
                onClick={() => setActiveKpiModal(null)}
                className="p-2 hover:bg-surface-container-low rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-primary/10 rounded-xl text-center">
                  <div className="text-3xl font-bold text-primary mb-1">{activeBooksCount}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-primary/80">Đang bán</div>
                </div>
                <div className="p-4 bg-error/10 rounded-xl text-center">
                  <div className="text-3xl font-bold text-error mb-1">{outOfStockCount}</div>
                  <div className="text-xs font-bold uppercase tracking-widest text-error/80">Hết hàng</div>
                </div>
              </div>
              
              {outOfStockCount > 0 && (
                <div>
                  <h4 className="font-bold text-sm mb-3 text-on-surface-variant uppercase tracking-wider">Sách cần nhập thêm</h4>
                  <div className="space-y-3 max-h-[200px] overflow-y-auto pr-2">
                    {books.filter(b => b.status === 'Hết hàng').map(book => (
                      <div key={book.id} className="flex items-center gap-3 p-3 border border-error/20 bg-error/5 rounded-lg">
                        <div className="w-10 h-14 bg-surface-container rounded overflow-hidden flex-shrink-0">
                          <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-bold text-sm text-on-surface line-clamp-1">{book.title}</div>
                          <div className="text-xs text-error mt-1">Tồn kho: 0</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
