import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import type { Book } from '../../types';
import { ArrowLeft, MapPin, CreditCard, Truck, Wallet, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { orderService, voucherService } from '../../services';
import type { ApiVoucher } from '../../types/voucher';

const SHIPPING_FEE = 30000;

export default function Checkout() {
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuth();
  const { cartItems, clearCart } = useCart();
  const location = useLocation();
  const singleItem = location.state?.singleItem as Book | undefined;

  const checkoutItems = useMemo(() => {
    if (singleItem) {
      return [{ book: singleItem, quantity: 1 }];
    }
    return cartItems;
  }, [singleItem, cartItems]);

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState<number | null>(null);

  const [availableVouchers, setAvailableVouchers] = useState<ApiVoucher[]>([]);
  const [selectedVoucherId, setSelectedVoucherId] = useState<number | ''>('');
  const [manualVoucherCode, setManualVoucherCode] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      voucherService.getMyVouchers()
        .then(setAvailableVouchers)
        .catch(console.error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (user?.name) setFullName((n) => n || user.name);
    if (user?.email) setEmail((e) => e || user.email);
  }, [user]);

  const subtotal = useMemo(
    () => checkoutItems.reduce((sum, { book, quantity }) => sum + book.price * quantity, 0),
    [checkoutItems]
  );

  const discountAmount = useMemo(() => {
    if (!selectedVoucherId) return 0;
    const v = availableVouchers.find((v) => v.id === selectedVoucherId);
    if (!v) return 0;
    if (v.minOrderValue && subtotal < v.minOrderValue) return 0;
    
    if (v.discountType === 'PERCENTAGE') {
      let d = subtotal * (v.discountValue / 100);
      if (v.maxDiscountAmount && d > v.maxDiscountAmount) d = v.maxDiscountAmount;
      return d;
    }
    return v.discountValue;
  }, [selectedVoucherId, availableVouchers, subtotal]);

  const totalWithShipping = subtotal + SHIPPING_FEE - discountAmount;
  const momoTransferContent = `THEARCHIVE-${Date.now()}`;
  const momoQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(
    `MOMO|amount=${totalWithShipping}|content=${momoTransferContent}|merchant=THE_ARCHIVE`
  )}`;


  if (checkoutItems.length === 0 && !isSuccess) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center">
        <p className="text-on-surface-variant mb-6">Giỏ hàng của bạn đang trống.</p>
        <Link
          to="/explore"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all"
        >
          Khám phá sách
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const shippingBlock = [
        `Người nhận: ${fullName.trim()}`,
        `SĐT: ${phone.trim()}`,
        `Địa chỉ: ${address.trim()}`,
        `Thanh toán: ${paymentMethod === 'cod' ? 'COD' : paymentMethod === 'card' ? 'Thẻ' : 'Ví điện tử'}`,
        note.trim() ? `Ghi chú khách: ${note.trim()}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const order = await orderService.createOrder({
        note: shippingBlock,
        email: email.trim() || undefined,
        items: checkoutItems.map(({ book, quantity }) => ({
          bookId: Number(book.id),
          quantity,
        })),
        voucherId: selectedVoucherId ? Number(selectedVoucherId) : undefined,
        voucherCode: manualVoucherCode.trim() || undefined,
      });
      setPlacedOrderId(order.id);
      if (!singleItem) {
        clearCart();
      }
      setIsSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Đặt hàng thất bại');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="pt-32 pb-24 px-8 max-w-3xl mx-auto text-center min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-8 shadow-inner">
          <CheckCircle2 className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-4xl font-bold text-primary tracking-tight mb-4">Đặt hàng thành công!</h1>
        <p className="text-on-surface-variant font-medium tracking-wide mb-8 max-w-md mx-auto leading-relaxed">
          Cảm ơn bạn đã mua sắm tại The Archive. Đơn hàng{' '}
          <span className="font-bold text-primary">#{placedOrderId != null ? `ORD-${placedOrderId}` : '—'}</span> của bạn đang được xử lý.
          <br />
          <span className="text-primary font-bold text-sm block mt-3">
            Mã QR thanh toán và hóa đơn đã được gửi tới email <span className="underline">{email}</span>. Vui lòng kiểm tra hộp thư của bạn!
          </span>
        </p>
        <div className="flex gap-4">
          <Link
            to="/explore"
            className="inline-flex items-center justify-center px-8 py-3 border border-outline-variant text-on-surface font-bold rounded-full hover:bg-surface-container transition-all"
          >
            Tiếp tục mua sắm
          </Link>
          {isLoggedIn && (
            <Link
              to="/profile"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary/90 transition-all shadow-lg"
            >
              Xem đơn hàng
            </Link>
          )}
        </div>
      </div>
    );
  }

  const itemCount = checkoutItems.reduce((n, { quantity }) => n + quantity, 0);

  return (
    <div className="pt-12 pb-24 px-8 max-w-7xl mx-auto">
      <div className="mb-12">
        <button
          type="button"
          onClick={() => navigate('/cart')}
          className="inline-flex items-center text-sm font-bold text-outline hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại giỏ hàng
        </button>
        <h1 className="font-serif text-4xl font-bold text-primary tracking-tight">Thanh toán</h1>
      </div>

      {submitError && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-700 border border-red-100 text-sm">{submitError}</div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-surface-container-low p-8 rounded-2xl border border-surface-container">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <MapPin className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary">Thông tin giao hàng</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Họ và tên</label>
                <input
                  required
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Nhập họ và tên"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Số điện thoại</label>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Nhập số điện thoại"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Địa chỉ Email</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@gmail.com (Dùng để nhận hóa đơn và thông tin thanh toán)"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Địa chỉ chi tiết</label>
                <input
                  required
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">Ghi chú (Tùy chọn)</label>
                <textarea
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ghi chú thêm về đơn hàng..."
                  className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <section className="bg-surface-container-low p-8 rounded-2xl border border-surface-container">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="font-serif text-2xl font-bold text-primary">Phương thức thanh toán</h2>
            </div>

            <div className="space-y-4">
              <label
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-surface-container">
                    <Truck className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Thanh toán khi nhận hàng (COD)</p>
                    <p className="text-sm text-on-surface-variant">Thanh toán bằng tiền mặt khi giao hàng</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'card' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-surface-container">
                    <CreditCard className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Thẻ tín dụng / Ghi nợ</p>
                    <p className="text-sm text-on-surface-variant">Visa, Mastercard, JCB</p>
                  </div>
                </div>
              </label>

              <label
                className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${
                  paymentMethod === 'ewallet' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary/50'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value="ewallet"
                  checked={paymentMethod === 'ewallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-primary focus:ring-primary accent-primary"
                />
                <div className="ml-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm border border-surface-container">
                    <Wallet className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Ví điện tử</p>
                    <p className="text-sm text-on-surface-variant">Momo, ZaloPay, VNPay</p>
                  </div>
                </div>
              </label>
            </div>
          </section>
        </div>

        <aside className="lg:col-span-5 sticky top-32">
          <div className="bg-surface-container-high rounded-2xl p-8 shadow-sm">
            <h2 className="font-serif text-2xl font-bold text-primary mb-6 pb-4 border-b border-outline-variant/30">Đơn hàng của bạn</h2>

            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {checkoutItems.map(({ book, quantity }) => (
                <div key={book.id} className="flex gap-4">
                  <div className="w-16 h-20 bg-surface-container rounded overflow-hidden flex-shrink-0">
                    {book.coverImage ? (
                      <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-surface-dim" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm text-on-surface line-clamp-2">{book.title}</h4>
                    <p className="text-xs text-on-surface-variant mt-1">SL: {quantity}</p>
                    <p className="font-bold text-primary mt-1">{(book.price * quantity).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 mb-6 pt-4 border-t border-outline-variant/30">
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Tạm tính ({itemCount} sản phẩm)</span>
                <span className="font-bold text-on-surface">{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="flex justify-between text-sm text-on-surface-variant">
                <span>Phí vận chuyển (ước tính)</span>
                <span className="font-bold text-on-surface">{SHIPPING_FEE.toLocaleString('vi-VN')}đ</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Giảm giá (Voucher)</span>
                  <span>-{discountAmount.toLocaleString('vi-VN')}đ</span>
                </div>
              )}
              <p className="text-xs text-on-surface-variant">
                Tổng tiền sách được hệ thống ghi nhận theo giá niêm yết; phí ship có thể thu khi giao hàng theo chính sách hiện hành.
              </p>
            </div>

            {isLoggedIn && (
              <div className="pt-4 pb-6 border-b border-outline-variant/30 mb-6 space-y-4">
                <h3 className="font-bold text-sm text-primary uppercase tracking-wider">Mã giảm giá</h3>
                {availableVouchers.length > 0 && (
                  <select
                    value={selectedVoucherId}
                    onChange={(e) => {
                      setSelectedVoucherId(e.target.value === '' ? '' : Number(e.target.value));
                      setManualVoucherCode('');
                    }}
                    className="w-full px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  >
                    <option value="">-- Chọn voucher của bạn --</option>
                    {availableVouchers.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.code} - {v.description || (v.discountType === 'FIXED_AMOUNT' ? `Giảm ${v.discountValue.toLocaleString()}đ` : `Giảm ${v.discountValue}%`)}
                      </option>
                    ))}
                  </select>
                )}
                
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Hoặc nhập mã voucher..." 
                    value={manualVoucherCode}
                    onChange={(e) => {
                      setManualVoucherCode(e.target.value);
                      if (e.target.value) setSelectedVoucherId('');
                    }}
                    className="flex-1 px-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm uppercase"
                  />
                </div>
              </div>
            )}

            <div className="pt-2 border-t border-outline-variant/30 mb-8">
              <div className="flex justify-between items-baseline">
                <span className="font-serif text-lg font-bold">Tổng (ước tính)</span>
                <div className="text-right">
                  <span className="block text-3xl font-bold text-primary">{totalWithShipping.toLocaleString('vi-VN')}đ</span>
                  <span className="text-xs text-on-surface-variant tracking-wider">Đã bao gồm thuế VAT (nếu có)</span>
                </div>
              </div>
            </div>

            {paymentMethod === 'ewallet' && (
              <div className="mb-6 p-4 rounded-xl border border-primary/20 bg-primary/5">
                <p className="text-sm font-semibold text-primary mb-3">Quét QR MoMo để thanh toán</p>
                <div className="flex flex-col items-center gap-3">
                  <img src={momoQrUrl} alt="QR thanh toán MoMo" className="w-44 h-44 rounded-lg border border-white shadow-sm bg-white p-2" />
                  <p className="text-xs text-on-surface-variant text-center">
                    Nội dung chuyển khoản: <span className="font-bold text-on-surface">{momoTransferContent}</span>
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full editorial-gradient text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  Đang xử lý...
                </span>
              ) : (
                'Đặt hàng'
              )}
            </button>

            <div className="mt-6 flex items-start gap-3 p-4 bg-surface-container-lowest rounded-xl border border-surface-container">
              <ShieldCheck className="text-tertiary w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Thông tin giao hàng được gửi kèm đơn hàng. Nếu chọn ví điện tử, vui lòng thanh toán theo QR trước khi xác nhận đặt hàng.
              </p>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}
