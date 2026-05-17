import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import { reviewService, orderService } from '../../services';
import { useAuth } from '../../context/AuthContext';

interface BookReviewsProps {
  bookId: string;
}

export default function BookReviews({ bookId }: BookReviewsProps) {
  const { isLoggedIn } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [canReview, setCanReview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      setLoading(true);
      try {
        const id = Number(bookId);
        const fetchedReviews = await reviewService.getReviews(id);
        if (!cancelled) setReviews(fetchedReviews);

        if (isLoggedIn) {
          const { canReview } = await orderService.checkPurchase(id);
          if (!cancelled) setCanReview(canReview);
        }
      } catch (err) {
        console.error('Failed to load reviews', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => { cancelled = true; };
  }, [bookId, isLoggedIn]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const newReview = await reviewService.addReview(Number(bookId), rating, comment);
      setReviews(prev => [newReview, ...prev]);
      setCanReview(false); // Only allow one review
      setComment('');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi gửi đánh giá');
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating = reviews.length ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : 0;

  return (
    <div className="mt-8 border-t border-slate-200 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-serif text-2xl font-bold text-[#1e1b4b]">Đánh giá & Nhận xét</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            <span className="font-bold text-lg">{avgRating}</span>
            <span className="text-slate-500 text-sm">({reviews.length} đánh giá)</span>
          </div>
        )}
      </div>

      {canReview && (
        <form onSubmit={handleSubmit} className="mb-8 bg-surface-container-low p-6 rounded-2xl">
          <h4 className="font-bold text-sm mb-4">Viết đánh giá của bạn</h4>
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star className={`w-6 h-6 ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ cảm nghĩ của bạn về cuốn sách này..."
            className="w-full p-4 border border-slate-200 rounded-xl mb-4 focus:outline-none focus:border-primary resize-none h-24"
            required
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-primary text-white font-bold rounded-full hover:bg-primary/90 disabled:opacity-50"
          >
            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {loading ? (
          <p className="text-sm text-slate-500">Đang tải đánh giá...</p>
        ) : reviews.length === 0 ? (
          <p className="text-sm text-slate-500 italic">Chưa có đánh giá nào cho tác phẩm này.</p>
        ) : (
          reviews.map((review, idx) => (
            <div key={review.id || idx} className="border-b border-slate-100 pb-6 last:border-0">
              <div className="flex items-center gap-3 mb-2">
                {review.reviewerAvatar ? (
                  <img src={review.reviewerAvatar} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                    <User className="w-5 h-5 text-slate-500" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm">{review.reviewerFullName}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400">{review.reviewDate}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-700 mt-2">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
