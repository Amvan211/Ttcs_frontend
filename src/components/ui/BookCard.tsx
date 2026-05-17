import { ShoppingCart } from 'lucide-react';
import { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onClick?: () => void;
}

export default function BookCard({ book, onClick }: BookCardProps) {
  return (
    <div className="group cursor-pointer" onClick={onClick}>
      <div className="relative mb-6">
        <div className="aspect-[3/4] rounded-xl overflow-hidden bg-surface-container-low book-card-shadow transition-all duration-500">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <button className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white shadow-xl flex items-center justify-center text-primary translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <ShoppingCart className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-1">
        <p className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          {book.category}
        </p>
        <h4 className="font-serif text-xl font-bold leading-tight group-hover:text-primary transition-colors">
          {book.title}
        </h4>
        <p className="text-on-surface-variant text-sm">{book.author}</p>
        <p className="pt-2 font-bold text-lg">
          {book.price.toLocaleString('vi-VN')}đ
        </p>
      </div>
    </div>
  );
}
