import { IProductDTO } from '../../models/products/product-response-models';
import { api } from '@/src/app/lib/api'; 

export const ProductService = {
    getAll: async (): Promise<IProductDTO[]> => {
        return api.products.getAll();
    },

    getById: async (id: string): Promise<IProductDTO | null> => {
        return api.products.getById(id);
    }
};