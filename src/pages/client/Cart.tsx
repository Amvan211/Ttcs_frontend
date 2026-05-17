import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

export default function Cart() {
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const handleIncrement = (id: string) => {
    const item = cartItems.find(i => i.book.id === id);
    if (item) updateQuantity(id, item.quantity + 1);
  };

  const handleDecrement = (id: string) => {
    const item = cartItems.find(i => i.book.id === id);
    if (item && item.quantity > 1) updateQuantity(id, item.quantity - 1);
  };

  const handleRemove = (id: string) => {
    removeFromCart(id);
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.book.price * item.quantity, 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const discount = subtotal > 0 ? 150000 : 0;
  const total = Math.max(0, subtotal - discount);

  if (!isLoggedIn) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-7xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-surface-container rounded-full flex items-center justify-center mb-6 shadow-inner">
          <ShoppingCart className="w-12 h-12 text-outline" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary tracking-tight mb-4">Giỏ hàng của bạn</h1>
        <p className="text-on-surface-variant font-medium tracking-wide mb-8 max-w-md mx-auto">
          Vui lòng đăng nhập để xem các tác phẩm trong giỏ hàng và tiếp tục quá trình thanh toán.
        </p>
        <Link to="/login" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-12 pb-24 px-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="mb-16">
        <h1 className="font-serif text-5xl font-bold text-primary tracking-tight mb-4">Giỏ hàng của bạn</h1>
        <p className="text-on-surface-variant font-medium tracking-wide">
          Bạn đang có <span className="text-primary font-bold">{totalItems} tác phẩm</span> trong bộ sưu tập chờ lưu trữ.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-8">
          {cartItems.length === 0 ? (
            <div className="text-center py-12 bg-surface-container-low rounded-xl">
              <p className="text-on-surface-variant mb-4">Giỏ hàng của bạn đang trống.</p>
              <Link to="/explore" className="text-primary font-bold hover:underline">Tiếp tục khám phá</Link>
            </div>
          ) : (
            cartItems.map((item) => (
              <div key={item.book.id} className="group flex flex-col md:flex-row gap-6 p-6 bg-surface-container-low rounded-xl transition-all duration-300 hover:bg-surface-container hover:shadow-2xl hover:shadow-on-surface/5">
                <div className="relative w-full md:w-40 aspect-[3/4] rounded-lg overflow-hidden flex-shrink-0 -mt-10 md:-mt-12 md:-ml-10 shadow-xl group-hover:scale-105 transition-transform duration-500">
                  <img
                    src={item.book.coverImage}
                    alt={item.book.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow py-2">
                  <div>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-2xl font-bold text-on-surface leading-tight mb-1">{item.book.title}</h3>
                        <p className="text-on-surface-variant text-sm font-medium uppercase tracking-widest mb-4">{item.book.author}</p>
                      </div>
                      <button 
                        onClick={() => handleRemove(item.book.id)}
                        className="text-outline hover:text-error transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    {item.book.status && (
                      <div className="flex items-center gap-2 text-tertiary font-bold mb-4">
                        <span className="text-xs uppercase tracking-tighter">{item.book.status}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-surface-container-highest rounded-full px-2 py-1">
                      <button 
                        onClick={() => handleDecrement(item.book.id)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container-low rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="px-4 font-bold text-primary">{item.quantity}</span>
                      <button 
                        onClick={() => handleIncrement(item.book.id)}
                        className="w-8 h-8 flex items-center justify-center text-on-surface hover:bg-surface-container-low rounded-full transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-right">
                      {item.book.originalPrice && (
                        <span className="block text-xs text-on-surface-variant line-through italic">
                          {(item.book.originalPrice * item.quantity).toLocaleString('vi-VN')}đ
                        </span>
                      )}
                      <span className="text-xl font-bold text-primary">
                        {(item.book.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Summary Sticky */}
        <aside className="lg:col-span-4 sticky top-32">
          <div className="bg-surface-container-high rounded-xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-primary mb-8 pb-4 border-b border-outline-variant/30">Tổng kết đơn hàng</h2>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-medium">Tạm tính ({totalItems} sản phẩm)</span>
                <span className="font-bold text-on-surface">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-on-surface-variant">
                <span className="font-medium">Phí vận chuyển</span>
                <span className="font-bold text-on-surface">Miễn phí</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-on-surface-variant">
                  <span className="font-medium">Giảm giá thành viên</span>
                  <span className="font-bold text-tertiary-container">- {discount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
            </div>
            <div className="pt-6 border-t border-outline-variant/30 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold">Tổng cộng</span>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-primary">{total.toLocaleString('vi-VN')}đ</span>
                  <span className="text-xs text-on-surface-variant tracking-wider">Đã bao gồm thuế VAT</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <button 
                onClick={() => navigate('/checkout')}
                disabled={cartItems.length === 0}
                className="w-full editorial-gradient text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Tiếp tục thanh toán
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link to="/explore" className="w-full border border-outline-variant py-4 rounded-full font-bold text-on-surface hover:bg-surface transition-all flex items-center justify-center">
                Tiếp tục mua sắm
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3 p-4 bg-tertiary-fixed/30 rounded-lg">
              <ShieldCheck className="text-tertiary w-6 h-6" />
              <p className="text-xs font-medium text-tertiary-fixed-variant leading-snug">
                Sách được đóng gói thủ công và bảo hiểm 100% trong quá trình vận chuyển.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
