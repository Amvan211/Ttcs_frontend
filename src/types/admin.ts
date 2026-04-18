/** Khớp JSON từ AdminViewModels (back_end) */
export interface AdminSalesPoint {
  name: string;
  total: number;
}

export interface AdminOrderRow {
  id: string;
  customer: string;
  type: string;
  date: string;
  total: string;
  status: string;
  note: string;
}

export interface AdminReviewRow {
  id: string;
  user: string;
  avatar: string;
  book: string;
  rating: number;
  comment: string;
  date: string;
  status: string;
}

export interface AdminTopBook {
  id: number;
  title: string;
  author: string;
  sales: number;
  price: string;
  image: string;
}

export interface AdminDashboardOverview {
  salesByDay: AdminSalesPoint[];
  recentOrders: AdminOrderRow[];
  topBooks: AdminTopBook[];
}
