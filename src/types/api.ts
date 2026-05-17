/** Phản hồi đăng nhập / đăng ký — khớp back_end AuthResponse */
export interface AuthResponse {
  token: string;
  tokenType: string;
  userId: number;
  username: string;
  roleName: string;
  fullName?: string | null;
  mail?: string | null;
  avatarUrl?: string | null;
}

export interface RegisterPayload {
  username: string;
  password: string;
  mail: string;
  fullName?: string;
  phone?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

/** Sách từ API (BookDTO) */
export interface ApiBook {
  id: number;
  title: string;
  author: string;
  price: number;
  coverImage?: string | null;
  category?: string | null;
  stock?: number | null;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | string | null;
}

export interface ApiBookDetail extends ApiBook {
  stockQuantity?: number | null;
  description?: string | null;
  partnerStoreName?: string | null;
  reviews?: ApiReview[];
}

export interface ApiReview {
  id: number;
  rating: number;
  comment?: string | null;
  reviewDate?: string | null;
  reviewerUsername?: string | null;
}

export interface ApiCategory {
  /** Khóa danh mục trong DB — dùng khi partner thêm sách */
  categoryId?: number | null;
  id: string;
  label: string;
  count: string;
}

export interface AdminCategoryPayload {
  name: string;
}

export interface CreateOrderPayload {
  note?: string;
  items: { bookId: number; quantity: number }[];
}

export interface ApiOrder {
  id: number;
  orderDate?: string | null;
  totalAmount: number;
  status: string;
  note?: string | null;
  customerName?: string | null;
  items: ApiOrderLine[];
}

export interface ApiOrderLine {
  bookId: number;
  bookTitle: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface AdminOrderPayload {
  userId: number;
  status?: string;
  note?: string;
  items: { bookId: number; quantity: number }[];
}

export interface ApiUser {
  id: number;
  username: string;
  fullName?: string | null;
  mail?: string | null;
  phone?: string | null;
  status: string;
  roleName: string;
  avatarUrl?: string | null;
}

export interface AdminUserPayload {
  username: string;
  password?: string;
  fullName?: string;
  mail?: string;
  phone?: string;
  status?: string;
  roleName?: string;
  avatarUrl?: string;
}

export interface AdminBookPayload {
  title: string;
  author?: string;
  price: number;
  stockQuantity?: number;
  description?: string;
  coverImageUrl?: string;
  categoryId: number;
  partnerId?: number;
  approvalStatus?: string;
}

export interface PartnerRegisterPayload {
  storeName: string;
  address?: string;
  description?: string;
}

export interface PartnerBookRequest {
  title: string;
  author?: string;
  price: number;
  stockQuantity: number;
  description?: string;
  coverImageUrl?: string;
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export interface ApiPartner {
  id: number;
  storeName: string;
  address: string;
  description: string;
  status: string;
  username?: string;
  fullName?: string;
  email?: string;
}
