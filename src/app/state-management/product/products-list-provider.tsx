'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { IProductDTO } from '@/src/app/models/products/product-response-models';
import { ProductService } from '@/src/app/services/product/product-service';

interface IProductsListContext {
    products: IProductDTO[];
    loading: boolean;
    search: string;
    setSearch: (val: string) => void;
    sortBy: string | null;
    setSortBy: (val: string | null) => void;
    filteredProducts: IProductDTO[];
}


const ProductsListContext = createContext<IProductsListContext | null>(null);

export const ProductsListProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<IProductDTO[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [sortBy, setSortBy] = useState<string | null>('newest');

    useEffect(() => {
        ProductService.getAll()
            .then((data) => setProducts(data))
            .finally(() => setLoading(false));
    }, []);

    
    console.log("🚀 Provider is Rendering...");

    let filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(search.toLowerCase())
    );

    filteredProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
        return 0;
    });

    return (
        <ProductsListContext.Provider 
            value={{ 
                products, 
                loading, 
                search, 
                setSearch, 
                sortBy, 
                setSortBy, 
                filteredProducts 
            }}
        >
            {children}
        </ProductsListContext.Provider>
    );
};

export const useProductsList = () => {
    const context = useContext(ProductsListContext);
    if (!context) {
        throw new Error('useProductsList must be used within ProductsListProvider');
    }
    return context;
};