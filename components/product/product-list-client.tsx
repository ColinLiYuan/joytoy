'use client';

import { useState, useEffect } from 'react';
import ProductList from '@/components/product/product-list';
import { ProductResponse } from '@/types/product';

interface ProductListClientProps {
    slug: string;
    page: number;
    size: number;
    filters: {
        priceRange?: [number, number] | null;
        colors?: string[];
        features?: string[];
        materials?: string[];
        sortBy?: string;
        sortDirection?: string;
    };
}

export default function ProductListClient({ slug, page, size, filters }: ProductListClientProps) {
    const [products, setProducts] = useState<ProductResponse[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                // 构建查询参数
                const params = new URLSearchParams({
                    slug,
                    page: page.toString(),
                    size: size.toString(),
                    sortBy: filters.sortBy || 'createdAt',
                    sortDirection: filters.sortDirection || 'DESC',
                });
                
                const response = await fetch(`/api/product/list?${params}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }
                
                const data = await response.json();
                
                if (data.success && data.data) {
                    setProducts(data.data.content || []);
                    setTotalPages(data.data.totalPages || 0);
                    setTotalElements(data.data.totalElements || 0);
                } else {
                    setProducts([]);
                }
                
                setError(null);
            } catch (err: any) {
                console.error('Failed to fetch products:', err);
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, page, size, JSON.stringify(filters)]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()} 
                    className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <ProductList 
            products={products}
            itemsPerPage={size}
            totalPages={totalPages}
            currentPage={page}
            totalProducts={totalElements}
        />
    );
}
