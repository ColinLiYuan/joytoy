'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { filterService } from '@/services/filterService';
import ProductList from '@/components/product/product-list';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import CollectionHero from '@/components/collection/collection-hero';
import FAQSection from '@/components/common/faq-section';
import { ProductListResponse } from '@/types/product';
import { CategoryResponse, RootResponse } from '@/types/category';

const ITEMS_PER_PAGE = 12;

interface CategoryPageInitialData {
    rootsData: RootResponse[];
    productsData: ProductListResponse;
    availableFilters: {
        colors: string[];
        features: string[];
        materials: string[];
    };
    currentCategory: CategoryResponse | RootResponse | null;
    parentCategory: RootResponse | null;
    urlSegments: string[];
    fullSlug: string;
}

function parsePriceRange(priceRangeParam: string | string[] | undefined): [number, number] | null {
    if (!priceRangeParam) return null;
    try {
        const str = Array.isArray(priceRangeParam) ? priceRangeParam[0] : priceRangeParam;
        if (str.includes('-')) {
            const [min, max] = str.split('-').map(Number);
            return [min, max];
        }
    } catch {}
    return null;
}

function extractFilterArray(data: any): string[] {
    if (!data) return [];
    if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'string') return data;
    if (Array.isArray(data) && data.length > 0 && data[0]?.keyWord) return data.map((item: any) => item.keyWord);
    return [];
}

function buildInitialFilters(searchParams: URLSearchParams) {
    const priceRangeParam = searchParams.get('priceRange');
    return {
        priceRange: priceRangeParam ? parsePriceRange(priceRangeParam) : null,
        colors: searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [],
        features: searchParams.get('features') ? searchParams.get('features')!.split(',') : [],
        materials: searchParams.get('materials') ? searchParams.get('materials')!.split(',') : [],
    };
}

export default function CategoryPageClient({ initialData }: { initialData: CategoryPageInitialData }) {
    const searchParams = useSearchParams();
    const isInitialMount = useRef(true);

    // Seed state from server-rendered data
    const [rootsData] = useState<RootResponse[]>(initialData.rootsData);
    const [productsData, setProductsData] = useState<ProductListResponse>(initialData.productsData);
    const [availableFilters, setAvailableFilters] = useState(initialData.availableFilters);
    const [currentCategory] = useState<CategoryResponse | RootResponse | null>(initialData.currentCategory);
    const [parentCategory] = useState<RootResponse | null>(initialData.parentCategory);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams(window.location.search);
            const page = parseInt(params.get('page') || '0');
            const sortParam = params.get('sort') || 'newest';
            const priceRangeParam = params.get('priceRange');
            const priceRange = priceRangeParam ? parsePriceRange(priceRangeParam) : undefined;

            const filters = {
                priceRange,
                colors: params.get('colors') ? params.get('colors')!.split(',') : [],
                features: params.get('features') ? params.get('features')!.split(',') : [],
                materials: params.get('materials') ? params.get('materials')!.split(',') : [],
                sortBy: (sortParam === 'price-low' ? 'currentPrice' : sortParam === 'price-high' ? 'currentPrice' : 'createdAt') as string,
                sortDirection: (sortParam === 'price-low' ? 'ASC' : 'DESC') as string,
            };

            const [productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
                productService.getProductsByCategory(initialData.fullSlug, page, ITEMS_PER_PAGE, filters),
                filterService.getFilters('colors'),
                filterService.getFilters('features'),
                filterService.getFilters('materials'),
            ]);

            const products = productsResult.status === 'fulfilled' ? productsResult.value : {
                content: [],
                totalPages: 0,
                totalElements: 0,
                currentPage: 0,
                pageSize: ITEMS_PER_PAGE,
                hasNext: false,
                hasPrevious: false
            };

            setProductsData(products);
            setAvailableFilters({
                colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
                features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
                materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : []),
            });
        } catch (err: any) {
            setError(err.message || 'Failed to load products');
        } finally {
            setLoading(false);
        }
    }, [initialData.fullSlug]);

    // Fetch on searchParams change. On initial mount, skip if server provided products;
    // otherwise re-fetch (covers the case where server-side auth wasn't available).
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            if (initialData.productsData.content.length === 0) {
                // Server rendered empty — likely auth wasn't available server-side,
                // so fetch client-side where axios interceptor attaches the token.
                fetchData();
            }
            return;
        }
        fetchData();
    }, [fetchData, searchParams, initialData.productsData.content.length]);

    if (error) {
        return (
            <section className="min-h-[400px] bg-white flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </section>
        );
    }

    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];

    if (parentCategory) {
        breadcrumbs.push({
            name: parentCategory.name,
            path: `/collections/${parentCategory.slug}`,
        });
    }

    breadcrumbs.push({
        name: currentCategory?.name || 'Collection',
        path: null,
    });

    const faqTag = initialData.fullSlug;

    // Build current filter state from URL for ProductList
    const currentParams = new URLSearchParams(searchParams?.toString() || '');
    const currentFilters = buildInitialFilters(currentParams);

    return (
        <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={true} />
            </div>

            <CollectionHero
                title={currentCategory?.name || 'Collection'}
                description={(currentCategory as any)?.description}
                imagePath={(currentCategory as any)?.image}
            />

            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                <div className="flex flex-col w-full">
                    <main className="flex-1 min-w-0 w-full">
                        {loading && productsData.content.length === 0 ? (
                            <div className="min-h-[400px] flex justify-center items-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                            </div>
                        ) : (
                            <ProductList
                                products={productsData.content}
                                itemsPerPage={ITEMS_PER_PAGE}
                                totalPages={productsData.totalPages}
                                currentPage={productsData.currentPage}
                                totalProducts={productsData.totalElements}
                                initialFilters={{
                                    priceRange: currentFilters.priceRange,
                                    colors: currentFilters.colors,
                                    features: currentFilters.features,
                                    materials: currentFilters.materials,
                                }}
                            />
                        )}
                    </main>
                </div>
            </div>

            <div className="container mx-auto px-4 sm:px-6">
                <div className="border-t border-gray-100 pt-16 pb-24 max-w-3xl mx-auto">
                    <FAQSection tag={faqTag} />
                </div>
            </div>
        </section>
    );
}
