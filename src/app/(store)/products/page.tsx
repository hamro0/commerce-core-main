import { ProductsListProvider } from '@/src/app/state-management/product/products-list-provider';
import { ProductGridSection } from '@/src/app/sections/product-grid-section/product-grid-section';

export default function Page() {
    return (
        <ProductsListProvider>
            <ProductGridSection />
        </ProductsListProvider>
    );
}