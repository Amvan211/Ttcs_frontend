import type { Book } from '../types';
import type { ApiBook, ApiBookDetail } from '../types/api';

export function mapApiBookToBook(b: ApiBook): Book {
  const approval = (b.approvalStatus || '').toUpperCase();
  const status =
    approval === 'REJECTED'
      ? 'Ngừng kinh doanh'
      : approval === 'PENDING'
        ? 'Chờ duyệt'
        : (b.stock ?? 0) > 0
          ? 'Đang bán'
          : 'Hết hàng';
  return {
    id: String(b.id),
    title: b.title,
    author: b.author ?? '',
    price: b.price,
    coverImage: b.coverImage ?? '',
    category: b.category ?? '',
    stock: b.stock ?? undefined,
    status,
  };
}

export function mapApiBookDetailToBook(b: ApiBookDetail): Book {
  const stock = b.stockQuantity ?? b.stock ?? undefined;
  const approval = (b.approvalStatus || '').toUpperCase();
  const status =
    approval === 'REJECTED'
      ? 'Ngừng kinh doanh'
      : approval === 'PENDING'
        ? 'Chờ duyệt'
        : (stock ?? 0) > 0
          ? 'Đang bán'
          : 'Hết hàng';
  return {
    id: String(b.id),
    title: b.title,
    author: b.author ?? '',
    price: b.price,
    coverImage: b.coverImage ?? '',
    category: b.category ?? '',
    stock: stock ?? undefined,
    status,
  };
}
