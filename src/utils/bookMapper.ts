import type { Book } from '../types';
import type { ApiBook, ApiBookDetail } from '../types/api';

export function mapApiBookToBook(b: ApiBook): Book {
  return {
    id: String(b.id),
    title: b.title,
    author: b.author ?? '',
    price: b.price,
    coverImage: b.coverImage ?? '',
    category: b.category ?? '',
    stock: b.stock ?? undefined,
    status: (b.stock ?? 0) > 0 ? 'Đang bán' : 'Hết hàng',
  };
}

export function mapApiBookDetailToBook(b: ApiBookDetail): Book {
  const stock = b.stockQuantity ?? b.stock ?? undefined;
  return {
    id: String(b.id),
    title: b.title,
    author: b.author ?? '',
    price: b.price,
    coverImage: b.coverImage ?? '',
    category: b.category ?? '',
    stock: stock ?? undefined,
    status: (stock ?? 0) > 0 ? 'Đang bán' : 'Hết hàng',
  };
}
