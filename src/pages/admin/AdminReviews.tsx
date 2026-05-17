import { useEffect, useState } from 'react';
import { BarChart, Star, AlertCircle, Filter, MoreVertical, Trash2 } from 'lucide-react';

import { reviewService } from '../../services';
import type { AdminReviewRow } from '../../types/admin';

export default function AdminReviews() {
  const [reviews, setReviews] = useState<AdminReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // Filter and sort states
  const [selectedBook, setSelectedBook] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<string>('newest');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const list = await reviewService.getAdminReviews();
        if (!cancelled) setReviews(list);
      } catch (e) {
        if (!cancelled) setErr(e instanceof Error ? e.message : 'Không tải được đánh giá');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    try {
      const reviewId = Number(String(id).replace(/\D/g, ''));
      await reviewService.deleteAdminReview(reviewId);
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Xóa đánh giá thất bại');
    }
  };

  // Derive unique books list from loaded reviews
  const uniqueBooks = Array.from(new Set(reviews.map((r) => r.book))).filter(Boolean).sort();

  // Filter and sort the reviews dynamically
  const processedReviews = reviews.filter((r) => {
    if (selectedBook !== 'all' && r.book !== selectedBook) return false;
    if (selectedRating !== 'all' && r.rating !== Number(selectedRating)) return false;
    return true;
  });

  if (sortOrder === 'oldest') {
    processedReviews.reverse();
  }

  const avg =
    reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-serif font-black text-[#1e1b4b]">Review Management</h1>
          <p className="text-sm text-slate-500 mt-2 max-w-md">Dữ liệu đánh giá từ API admin.</p>
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Export Report
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-[#4f46e5] text-white rounded-lg text-sm font-semibold hover:bg-[#4338ca] transition-colors shadow-md"
          >
            Moderate All
          </button>
        </div>
      </div>

      {err && <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{err}</div>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Reviews</p>
            <p className="text-4xl font-black text-[#1e1b4b] mb-1">{loading ? '…' : reviews.length}</p>
          </div>
          <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center">
            <BarChart className="w-8 h-8 text-slate-300" />
          </div>
        </div>

        <div className="bg-[#fff1f2] p-6 rounded-2xl border border-red-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-red-400 uppercase tracking-wider mb-1">Filtered Count</p>
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-black text-red-600">{loading ? '…' : processedReviews.length}</p>
            </div>
          </div>
          <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
            <Filter className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Average Rating</p>
            <p className="text-4xl font-black text-[#1e1b4b] mb-1 flex items-center gap-2">
              {avg} <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </p>
            <p className="text-[10px] text-slate-500">Danh sách hiện tại</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between sm:items-center bg-slate-50/50">
          <h2 className="text-lg font-serif font-bold text-[#1e1b4b]">Recent Submissions</h2>
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filter by Book Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-xs text-slate-400 font-semibold">Sách:</span>
              <select
                value={selectedBook}
                onChange={(e) => setSelectedBook(e.target.value)}
                className="text-sm font-semibold text-slate-700 bg-transparent border-none p-0 focus:ring-0 cursor-pointer max-w-[150px] sm:max-w-[200px] truncate"
              >
                <option value="all">Tất cả sách</option>
                {uniqueBooks.map((book) => (
                  <option key={book} value={book}>
                    {book}
                  </option>
                ))}
              </select>
            </div>

            {/* Filter by Rating Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-xs text-slate-400 font-semibold">Đánh giá:</span>
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="text-sm font-semibold text-slate-700 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value="all">Tất cả sao</option>
                <option value="5">5 Sao</option>
                <option value="4">4 Sao</option>
                <option value="3">3 Sao</option>
                <option value="2">2 Sao</option>
                <option value="1">1 Sao</option>
              </select>
            </div>

            {/* Sort Order Dropdown */}
            <div className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm">
              <span className="text-xs text-slate-400 font-semibold">Sắp xếp:</span>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-sm font-semibold text-slate-700 bg-transparent border-none p-0 focus:ring-0 cursor-pointer"
              >
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Book Title</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Comment</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Đang tải…
                  </td>
                </tr>
              ) : processedReviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 text-sm">
                    Không tìm thấy đánh giá nào phù hợp.
                  </td>
                </tr>
              ) : (
                processedReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-xs font-bold text-slate-400">{review.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                          {review.avatar}
                        </div>
                        <span className="text-sm font-bold text-slate-900">{review.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700">{review.book}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                             key={i}
                             className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`}
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600 max-w-xs">
                      <p className={`truncate ${review.status === 'flagged' ? 'text-red-600 font-medium' : ''}`}>{review.comment}</p>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">{review.date}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        type="button" 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                        title="Xóa đánh giá"
                      >
                        <Trash2 className="w-4 h-4" />
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

