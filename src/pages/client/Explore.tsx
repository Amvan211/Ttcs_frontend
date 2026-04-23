import { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  BookOpen,
  FlaskConical,
  ScrollText,
  Brain,
  Palette,
  X,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react';
import BookCard from '../../components/ui/BookCard';
import { Book } from '../../types';
import { useCart } from '../../context/CartContext';
import { bookService, categoryService } from '../../services';
import { mapApiBookToBook } from '../../utils/bookMapper';

const CATEGORY_ICONS: LucideIcon[] = [BookOpen, FlaskConical, ScrollText, Brain, Palette];

type ExploreCategory = { id: string; label: string; count: string; icon: LucideIcon };

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category');
  const searchQuery = searchParams.get('q') || '';
  const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategory || 'all');
  const [priceRange, setPriceRange] = useState<number>(2000000);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [sortBy, setSortBy] = useState<string>('Phổ biến nhất');
  const [books, setBooks] = useState<Book[]>([]);
  const [apiCategories, setApiCategories] = useState<ExploreCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { addToCart } = useCart();

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const [rawBooks, rawCats] = await Promise.all([
          bookService.searchBooks({
            category: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
            title: searchQuery || undefined,
          }),
          categoryService.listCategories(),
        ]);
        if (cancelled) return;
        setBooks(rawBooks.map(mapApiBookToBook));
        setApiCategories(
          rawCats.map((c, i) => ({
            id: c.id,
            label: c.label,
            count: c.count,
            icon: CATEGORY_ICONS[i % CATEGORY_ICONS.length],
          }))
        );
      } catch (e) {
        if (!cancelled) setLoadError(e instanceof Error ? e.message : 'Không tải được dữ liệu');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory, searchQuery]);

  
  const ALL_CATEGORY: ExploreCategory = useMemo(
    () => ({
      id: 'all',
      label: 'Tất cả',
      icon: BookOpen,
      count: `${books.length} Titles`,
    }),
    [books.length]
  );

  const displayCategories = [ALL_CATEGORY, ...apiCategories];

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const newParams = new URLSearchParams(searchParams);
    if (categoryId && categoryId !== 'all') newParams.set('category', categoryId);
    else newParams.delete('category');
    setSearchParams(newParams);
  };

  const filteredBooks = books
    .filter((book) => {
      const matchCategory =
        selectedCategory && selectedCategory !== 'all' ? book.category === selectedCategory : true;
      const matchPrice = book.price <= priceRange;
      const q = searchQuery.toLowerCase();
      const matchSearch = q
        ? book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
        : true;
      return matchCategory && matchPrice && matchSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'Giá: Thấp đến Cao':
          return a.price - b.price;
        case 'Giá: Cao đến Thấp':
          return b.price - a.price;
        case 'Mới nhất':
          return Number(b.id) - Number(a.id);
        default:
          return 0;
      }
    });

  return (
    <div className="max-w-7xl mx-auto px-8 pb-20 pt-12">
      <div className="mb-16">
        <h1 className="font-serif text-5xl md:text-6xl font-bold text-primary tracking-tight mb-4">
          Khám phá Kho lưu trữ
        </h1>
        <p className="text-on-surface-variant max-w-2xl text-lg">
          Hành trình qua những trang sách được tuyển chọn kỹ lưỡng, từ những triết lý cổ đại đến nghệ thuật đương đại.
        </p>
      </div>

      {loadError && (
        <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{loadError}</div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-16">
        {displayCategories.map((cat) => {
          const Icon = cat.icon;
          const isActive = selectedCategory === cat.id;
          return (
            <div
              key={cat.id}
              onClick={() => handleCategoryClick(cat.id)}
              className={`p-6 rounded-xl transition-all cursor-pointer group ${
                isActive
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-surface-container-low hover:bg-primary-fixed text-on-surface'
              }`}
            >
              <Icon className={`mb-4 w-6 h-6 ${isActive ? 'text-white' : 'text-primary'}`} />
              <span className="font-serif font-bold text-xl block">{cat.label}</span>
              <span
                className={`text-xs font-label uppercase tracking-widest mt-2 block ${
                  isActive ? 'text-on-primary-container' : 'text-on-surface-variant'
                }`}
              >
                {cat.count}
              </span>
            </div>
          );
        })}
      </div>

      <div className="asymmetric-grid">
        <aside className="space-y-10">
          <section>
            <h3 className="font-serif text-xl font-bold mb-6 flex items-center gap-2">Bộ lọc</h3>
            <div className="space-y-8">
              <div>
                <label className="font-label text-sm font-bold uppercase tracking-widest text-on-surface-variant mb-4 block">
                  Khoảng giá (VNĐ)
                </label>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="50000"
                    max="2000000"
                    step="50000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 bg-surface-container-high rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-xs font-medium text-on-surface-variant">
                    <span>50.000đ</span>
                    <span className="font-bold text-primary">{priceRange.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </aside>

        <section>
          <div className="flex justify-between items-center mb-8">
            <p className="text-on-surface-variant">
              Hiển thị <span className="font-bold text-on-surface">{loading ? '…' : filteredBooks.length}</span> tác
              phẩm
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-on-surface-variant">Sắp xếp theo:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent border-none text-sm font-bold focus:ring-0 cursor-pointer"
              >
                <option value="Phổ biến nhất">Phổ biến nhất</option>
                <option value="Mới nhất">Mới nhất</option>
                <option value="Giá: Thấp đến Cao">Giá: Thấp đến Cao</option>
                <option value="Giá: Cao đến Thấp">Giá: Cao đến Thấp</option>
              </select>
            </div>
          </div>
          {loading ? (
            <p className="text-on-surface-variant py-20 text-center">Đang tải sách…</p>
          ) : filteredBooks.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8">
              {filteredBooks.map((book) => (
                <BookCard key={book.id} book={book} onClick={() => setSelectedBook(book)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container-lowest rounded-xl border border-outline-variant/30">
              <p className="text-on-surface-variant text-lg">Không tìm thấy tác phẩm nào trong danh mục này.</p>
            </div>
          )}
        </section>
      </div>

      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative flex flex-col md:flex-row">
            <button
              type="button"
              onClick={() => setSelectedBook(null)}
              className="absolute top-4 right-4 p-2 bg-surface-container-high hover:bg-surface-container-highest rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5 text-on-surface" />
            </button>

            <div className="w-full md:w-2/5 bg-surface-container-low p-8 flex items-center justify-center">
              <div className="relative w-full max-w-[240px] aspect-[3/4] rounded-xl overflow-hidden shadow-2xl">
                <img src={selectedBook.coverImage} alt={selectedBook.title} className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center">
              <span className="text-xs font-label uppercase tracking-widest text-primary mb-3 block">
                {selectedBook.category}
              </span>
              <h2 className="font-serif text-4xl font-bold text-on-surface mb-2 leading-tight">{selectedBook.title}</h2>
              <p className="text-lg text-on-surface-variant italic mb-6">{selectedBook.author}</p>

              <div className="prose prose-sm text-on-surface-variant mb-8">
                <p>
                  Tác phẩm trong kho lưu trữ The Archive. {selectedBook.stock != null && `Còn ${selectedBook.stock} bản.`}
                </p>
              </div>

              <div className="flex items-end gap-4 mb-8">
                <span className="text-3xl font-bold text-primary">{selectedBook.price.toLocaleString('vi-VN')}đ</span>
                {selectedBook.originalPrice && (
                  <span className="text-lg text-outline line-through mb-1">
                    {selectedBook.originalPrice.toLocaleString('vi-VN')}đ
                  </span>
                )}
              </div>

              <div className="flex gap-4 mt-auto">
                <button
                  type="button"
                  onClick={() => {
                    addToCart(selectedBook);
                    alert(`Đã thêm "${selectedBook.title}" vào giỏ hàng!`);
                  }}
                  className="flex-1 bg-primary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-3"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ hàng
                </button>
                <Link
                  to="/checkout"
                  onClick={() => {
                    addToCart(selectedBook);
                    setSelectedBook(null);
                  }}
                  className="flex-1 border border-primary text-primary py-4 rounded-full font-bold text-lg hover:bg-primary/5 transition-all flex items-center justify-center"
                >
                  Đặt hàng ngay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
