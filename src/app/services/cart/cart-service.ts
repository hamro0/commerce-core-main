import { ICartItemDTO } from '@/src/app/models/cart';
import { IProductDTO } from '@/src/app/models/products/product-response-models';
import { api } from '@/src/app/lib/api'; 

export const CartService = {
  getCart: async (): Promise<ICartItemDTO[] | { items: ICartItemDTO[] } | null> => {
    return api.cart.get();
  },

  addItem: async (product: IProductDTO, quantity: number): Promise<unknown> => {
    return api.cart.add(product, quantity);
  },

  removeItem: async (productId: string): Promise<unknown> => {
    return api.cart.remove(productId);
  },

  updateQuantity: async (productId: string, quantity: number): Promise<unknown> => {
    return api.cart.update(productId, quantity);
  },

  clear: async (): Promise<unknown> => {
    return api.cart.clear();
  }
};