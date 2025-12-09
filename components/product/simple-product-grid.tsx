// components/product/simple-product-grid.tsx
'use client';

import { ProductResponse } from '@/types/product';
import ProductCard from '@/components/product/product-card';

interface SimpleProductGridProps {
    products: ProductResponse[];
    onWishlistUpdate?: () => void;
}

export default function SimpleProductGrid({ products, onWishlistUpdate }: SimpleProductGridProps) {
    if (!products || products.length === 0) {
        return null;
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 w-full">
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onWishlistUpdate={onWishlistUpdate}
                />
            ))}
        </div>
    );
}