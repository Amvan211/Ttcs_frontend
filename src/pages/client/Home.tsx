import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { categoryService, bookService } from '../../services';
import type { ApiCategory, ApiBook } from '../../types/api';
import BookCard from '../../components/ui/BookCard';
import { useAuth } from '../../context/AuthContext';

const CATEGORY_IMAGES = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBzVeCeoneS95w1y7jHbGGEJCzbqWCcS1qzBhqpYBn5idFxMfqzA35ozgnqdl6nXa7hwZ-fz_ixsq63A3eC_rFx5wrhdI80nDOWfp_BCabRdpYq4DTW8L8u3dkQXcu3MRcnW9AnrSJlDcoHyw72q0MkIArDSRGOY8HaBR8oMzZhFO2jhJhG9Sgveu0QS9PTIslhHeCunPxXR7YIx9us6pf2hNfRUDc-6QgfgYMIg-IaAa9sGhtlGEoeEzE7Clyr9OsdBP1omoyN7bk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBbk71PJZgMedhD63Ml11OfyIkYCyAmCbMQ61JososGNnMkMrcqSFeLcHm-EniYn5BM2N6eqlht17SihfPq25DooCwvLqaVE_I4Gm3SMTpslTo_krydbE-s-m-sKn7WepEyMxsEuU3tPLLuQYzUOJmYwBZ6YoxUO_s5_NBQhkhwQESuI_hptDBd7rCNuNJbKdQDxdeL8qxqLQjjhVkGYH2dEYwnZuBkpS82JPOccVnIdbfh8wyECFDDwuG-Z144-mz69s8QepfaGpk',
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTBcrqQfldBlS1Qbgmx7mg_3d5pygMmM8ZBAN2twx9PaFt6XupAIhOMRNXCKxhWdkJ07wQCZWKvNvxNUY7reYVVRHhSnxnJoOae8EAFamSqAg4Mt15kxNMocYOq4JzI7utdfx3CYPjgsRbUCw5_Zbv3aJTmcJg_g1n-l89zWNxAoeJ42Pcz48nhAu0papsNlu3idgexGqnQA8iHOvxlgDWC505qzqaoxil0Iw2w-Ft9e1yBq4XedNEvT6tUehFsXr2vMNdHgVTqZk',
];

export default function Home() {
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [recommendations, setRecommendations] = useState<ApiBook[]>([]);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await categoryService.listCategories();
        if (!cancelled) setCategories(data);
      } catch {
        if (!cancelled) setCategories([]);
      }
    })();
    
    if (isLoggedIn) {
      (async () => {
        try {
          const recData = await bookService.getRecommendations();
          if (!cancelled) setRecommendations(recData);
        } catch {
          if (!cancelled) setRecommendations([]);
        }
      })();
    }
    
    return () => {
      cancelled = true;
    };
  }, [isLoggedIn]);

  const selectedCategories = useMemo(() => categories.slice(0, 3), [categories]);

  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section className="px-8 max-w-screen-2xl mx-auto mb-20 pt-8">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary text-on-primary h-[600px] flex items-center">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-primary-container opacity-90 z-10"></div>
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC7zWLtpaaONLrOxQbSBU2qh-pTv935E4pAVAGBU3m3A5fSOfqmOeJ_SH2fBQsUFM5w_ykGA_vWM-RzD48Wk95DTmphv8740Ai1zZZh8FJ8uRAMuCTVodYXlwbBfR2pJfvUKZRn-VweMO6-W_d9N1CEVBwpoIg0E7_D2eczgVQZOPkgJoh1kIlR27pphrZ1HOeziPCzWuki_RJvyvU8eOG4d67Eg5W2q7LNQA0w4b5zUWWzPxtna3ogThw88_-BbnyZoAKQMlT2GlU"
            alt="Library"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="relative z-20 px-16 lg:px-24 max-w-4xl">
            <h4 className="font-label uppercase tracking-[0.2em] text-on-primary-container mb-6 text-sm font-semibold">
              Exclusively Selected
            </h4>
            <h1 className="font-serif text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
              Curated for the Inquisitive Mind
            </h1>
            <p className="font-body text-xl text-on-primary/80 max-w-lg mb-10 leading-relaxed">
              Discover a world where every volume is a masterpiece. We bring you a digital archive of literature, science, and history for the modern intellectual.
            </p>
            <div className="flex gap-4">
              <Link to="/explore" className="bg-tertiary-fixed text-on-tertiary-fixed px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-xl inline-block">
                Bắt đầu khám phá
              </Link>
              <Link to="/cart" className="bg-white/10 backdrop-blur-md text-white px-10 py-4 rounded-full font-bold text-lg border border-white/20 hover:bg-white/20 transition-all">
                Bộ sưu tập
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bento Grid */}
      <section className="px-8 max-w-screen-2xl mx-auto mb-24">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-5xl font-black text-primary tracking-tighter">Danh mục tuyển chọn</h2>
            <p className="text-outline mt-2 text-lg">Khám phá các lĩnh vực tri thức tinh hoa.</p>
          </div>
        </div>
        {selectedCategories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-[600px]">
            {selectedCategories.map((category, index) => (
              <Link
                key={category.id}
                to={`/explore?category=${encodeURIComponent(category.id)}`}
                className={`${index === 0 ? 'md:col-span-2 md:row-span-2' : 'md:col-span-2'} group relative overflow-hidden rounded-3xl bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer block`}
              >
                <img
                  src={CATEGORY_IMAGES[index % CATEGORY_IMAGES.length]}
                  alt={category.label}
                  className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-8 left-8">
                  <span className="font-label text-xs uppercase tracking-widest text-on-primary-container mb-2 block">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className={`font-serif font-bold text-white mb-2 ${index === 0 ? 'text-4xl' : 'text-3xl'}`}>
                    {category.label}
                  </h3>
                  <p className="text-white/70 max-w-xs">{category.count}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="h-60 rounded-3xl bg-surface-container-low flex items-center justify-center text-on-surface-variant">
            Chưa có dữ liệu danh mục từ hệ thống.
          </div>
        )}
      </section>

      {/* Recommendations Section */}
      {isLoggedIn && recommendations.length > 0 && (
        <section className="px-8 max-w-screen-2xl mx-auto mb-24">
          <div className="flex items-end justify-between mb-12">
            <div>
              <h2 className="font-serif text-5xl font-black text-primary tracking-tighter">Đề xuất cho bạn</h2>
              <p className="text-outline mt-2 text-lg">Dựa trên sở thích và hành vi của bạn.</p>
            </div>
            <Link to="/explore" className="text-primary font-bold uppercase tracking-widest text-sm hover:text-primary-container transition-colors">
              Xem tất cả
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {recommendations.slice(0, 5).map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
