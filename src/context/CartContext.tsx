import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book } from '../types';

interface CartItem {
  book: Book;
  quantity: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (book: Book, quantity?: number) => void;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (book: Book, quantity: number = 1) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.book.id === book.id);
      if (existingItem) {
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { book, quantity }];
    });
  };

  const removeFromCart = (bookId: string) => {
    setCartItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    setCartItems((prev) => prev.map((item) => (item.book.id === bookId ? { ...item, quantity } : item)));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
