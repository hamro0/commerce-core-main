'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { IProductDTO } from '@/src/app/models/products/product-response-models';
import { ICartItemDTO } from '@/src/app/models/cart';
import { CartService } from '@/src/app/services/cart/cart-service';

interface ICartContext {
  cartItems: ICartItemDTO[];
  loading: boolean;
  totalItems: number;
  totalPrice: number;
  addToCart: (product: IProductDTO, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<ICartContext | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItemDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    CartService.getCart()
      .then((data) => {
        const response = data as { items?: ICartItemDTO[] } | ICartItemDTO[] | null;
        const items = Array.isArray(response) ? response : response?.items || [];
        setCartItems(items);
      })
      .catch((err) => console.error('Failed to load cart', err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (product: IProductDTO, quantity: number = 1) => {
    const targetId = product.id.toString();

    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === targetId || item.id === targetId);
      
      if (exists) {
        return prev.map((item) =>
          (item.id === targetId || item.id === targetId)
            ? { ...item, quantity: item.quantity + quantity, itemTotal: item.price * (item.quantity + quantity) }
            : item
        );
      }
      
      const newItem: ICartItemDTO = {
        ...product,
        id: targetId,
        productId: targetId,
        quantity,
        itemTotal: product.price * quantity
      } as unknown as ICartItemDTO;
      
      return [...prev, newItem];
    });

    try {
      await CartService.addItem(product, quantity);
    } catch (err) {
      console.error('Error adding item', err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return;
    const targetId = productId.toString();

    setCartItems((prev) =>
      prev.map((item) =>
        (item.id === targetId || item.id === targetId)
          ? { ...item, quantity, itemTotal: item.price * quantity }
          : item
      )
    );

    try {
      await CartService.updateQuantity(targetId, quantity);
    } catch (err) {
      console.error('Error updating quantity', err);
    }
  };

  const removeFromCart = async (productId: string) => {
    const targetId = productId.toString();

    setCartItems((prev) => prev.filter((item) => item.id !== targetId && item.id !== targetId));

    try {
      await CartService.removeItem(targetId);
    } catch (err) {
      console.error('Error removing item', err);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    try {
      await CartService.clear();
    } catch (err) {
      console.error('Error clearing cart', err);
    }
  };

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      cartItems,
      loading,
      totalItems,
      totalPrice,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};