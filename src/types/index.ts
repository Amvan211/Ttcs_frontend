export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  originalPrice?: number;
  coverImage: string;
  category: string;
  tags?: string[];
  stock?: number;
  status?: 'Đang bán' | 'Hết hàng' | 'Chờ duyệt' | 'Ngừng kinh doanh' | 'Bản in giới hạn' | 'Bản in đặc biệt';
}

export interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: OrderItem[];
}

export interface OrderItem {
  book: Book;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}
