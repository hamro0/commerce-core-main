'use client';

import { SimpleGrid } from '@mantine/core';
import { useProductsList } from '@/src/app/state-management/product/products-list-provider';
import { ProductCard } from '@/src/app/components/product/product-box/product-box';

export const ProductGridArea = () => {
    const { filteredProducts } = useProductsList();

    return (
        <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </SimpleGrid>
    );
};