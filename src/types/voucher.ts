export interface ApiVoucher {
  id: number;
  code: string;
  description: string | null;
  discountType: 'FIXED_AMOUNT' | 'PERCENTAGE';
  discountValue: number;
  minOrderValue: number | null;
  maxDiscountAmount: number | null;
  startDate: string | null;
  endDate: string | null;
}
