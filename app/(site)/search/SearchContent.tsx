'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { filterService } from '@/services/filterService';
import ProductList from '@/components/product/product-list';
import Breadcrumb from '@/components/common/breadcrumb';

const ITEMS_PER_PAGE = 12;

function parsePriceRange(priceRangeParam: string | string[] | undefined): [number, number] | null {
    if (!priceRangeParam) return null;
    try {
        const str = Array.isArray(priceRangeParam) ? priceRangeParam[0] : priceRangeParam;
        if (str.includes('-')) {
            const [min, max] = str.split('-').map(Number);
            return [min, max];
        }
    } catch (e) {}
    return null;
}

function extractFilterArray(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') return data;
    if (Array.isArray(data) && data.length > 0 && data[0]?.keyWord) return data.map(item => item.keyWord);
    return [];
}

export default function SearchContent() {
    const searchParams = useSearchParams();

    const [productsData, setProductsData] = useState<any>({
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0
    });
    const [availableFilters, setAvailableFilters] = useState({
        colors: [] as string[],
        features: [] as string[],
        materials: [] as string[]
    });
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const q = searchParams.get('q') || '';
                const page = parseInt(searchParams.get('page') || '0');
                const sortParam = searchParams.get('sort') || 'newest';
                const priceRangeParam = searchParams.get('priceRange');
                const priceRange = priceRangeParam ? parsePriceRange(priceRangeParam) : undefined;

                const filters = {
                    priceRange,
                    colors: searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [],
                    features: searchParams.get('features') ? searchParams.get('features')!.split(',') : [],
                    materials: searchParams.get('materials') ? searchParams.get('materials')!.split(',') : [],
                    sortBy: sortParam === 'price-low' ? 'currentPrice' : sortParam === 'price-high' ? 'currentPrice' : 'createdAt',
                    sortDirection: sortParam === 'price-low' ? 'ASC' : 'DESC'
                };

                setQuery(q);

                const [productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
                    productService.searchProducts(q, page, ITEMS_PER_PAGE, filters),
                    filterService.getFilters('colors'),
                    filterService.getFilters('features'),
                    filterService.getFilters('materials'),
                ]);

                const products = productsResult.status === 'fulfilled' ? productsResult.value : {
                    content: [],
                    totalPages: 0,
                    totalElements: 0,
                    currentPage: 0
                };

                setProductsData(products);
                setAvailableFilters({
                    colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
                    features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
                    materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
                });

                setError(null);
            } catch (err: any) {
                console.error('Error loading search page:', err);
                setError(err.message || 'Failed to load search results');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Search', path: null },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
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
        <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={true} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl py-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {query ? `Search Results for "${query}"` : 'Search Products'}
                </h1>
                <p className="text-gray-500">
                    {productsData.totalElements} products found
                </p>
            </div>

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                <ProductList
                    products={productsData.content}
                    itemsPerPage={ITEMS_PER_PAGE}
                    totalPages={productsData.totalPages}
                    currentPage={productsData.currentPage}
                    totalProducts={productsData.totalElements}
                    availableFilters={availableFilters}
                    initialFilters={{
                        priceRange: null,
                        colors: [],
                        features: [],
                        materials: []
                    }}
                />
            </div>
        </section>
    );
}
