'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import { categoryService } from '@/services/categoryService';
import { filterService } from '@/services/filterService';
import ProductList from '@/components/product/product-list';
import Breadcrumb, { BreadcrumbItem } from '@/components/common/breadcrumb';
import CollectionHero from '@/components/collection/collection-hero';
import FAQSection from '@/components/common/faq-section';
import { ProductListResponse } from '@/types/product';
import { CategoryResponse, RootResponse } from '@/types/category';

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

export default function ProductListPage({ params }: { params: Promise<{ category: string | string[] }> }) {
    const [resolvedParams, setResolvedParams] = useState<{ category: string | string[] } | null>(null);
    const searchParams = useSearchParams();
    
    const [rootsData, setRootsData] = useState<RootResponse[]>([]);
    const [productsData, setProductsData] = useState<ProductListResponse>({
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0,
        pageSize: ITEMS_PER_PAGE,
        hasNext: false,
        hasPrevious: false
    });
    const [availableFilters, setAvailableFilters] = useState({
        colors: [] as string[],
        features: [] as string[],
        materials: [] as string[]
    });
    const [currentCategory, setCurrentCategory] = useState<CategoryResponse | RootResponse | null>(null);
    const [parentCategory, setParentCategory] = useState<RootResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 解析 params
    useEffect(() => {
        params.then(setResolvedParams);
    }, [params]);

    // 加载数据
    useEffect(() => {
        if (!resolvedParams) return;

        const fetchData = async () => {
            try {
                setLoading(true);
                
                const urlSegments = Array.isArray(resolvedParams.category)
                    ? resolvedParams.category
                    : [resolvedParams.category];
                
                const fullSlug = urlSegments.join('/');
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

                // 并行获取数据
                const [rootsResult, productsResult, colorsResult, featuresResult, materialsResult] = await Promise.allSettled([
                    categoryService.getRoots(),
                    productService.getProductsByCategory(fullSlug, page, ITEMS_PER_PAGE, filters),
                    filterService.getFilters('colors'),
                    filterService.getFilters('features'),
                    filterService.getFilters('materials'),
                ]);

                const roots = rootsResult.status === 'fulfilled' ? rootsResult.value : [];
                const products = productsResult.status === 'fulfilled' ? productsResult.value : {
                    content: [],
                    totalPages: 0,
                    totalElements: 0,
                    currentPage: 0,
                    pageSize: ITEMS_PER_PAGE,
                    hasNext: false,
                    hasPrevious: false
                };

                console.log('[ProductListPage] Products data:', products);
                if (products.content.length > 0) {
                    console.log('[ProductListPage] First product:', {
                        id: products.content[0].id,
                        name: products.content[0].name,
                        favorited: products.content[0].favorited,
                        isInWishlist: (products.content[0] as any).isInWishlist
                    });
                }

                setRootsData(roots);
                setProductsData(products);
                setAvailableFilters({
                    colors: extractFilterArray(colorsResult.status === 'fulfilled' ? colorsResult.value : []),
                    features: extractFilterArray(featuresResult.status === 'fulfilled' ? featuresResult.value : []),
                    materials: extractFilterArray(materialsResult.status === 'fulfilled' ? materialsResult.value : [])
                });

                // 查找当前分类
                let current: CategoryResponse | RootResponse | null = null;
                let parent: RootResponse | null = null;

                if (roots.length > 0) {
                    const rootSlug = urlSegments[0];
                    const rootMatch = roots.find(root => root.slug === rootSlug);

                    if (urlSegments.length === 1) {
                        current = rootMatch || null;
                    } else if (urlSegments.length >= 2 && rootMatch) {
                        parent = rootMatch;
                        const subSlug = urlSegments.slice(1).join('/');

                        if (rootMatch.categories && rootMatch.categories.length > 0) {
                            current = rootMatch.categories.find(sub => {
                                if (sub.slug === fullSlug) return true;
                                if (sub.slug.endsWith(`/${subSlug}`)) return true;
                                const lastSegment = urlSegments[urlSegments.length - 1];
                                if (sub.slug.endsWith(`/${lastSegment}`)) return true;
                                return false;
                            }) || null;
                        }
                    }
                }

                if (!current) {
                    const allCategories = await categoryService.getCategories();
                    current = allCategories.find(cat => cat.slug === fullSlug) || null;

                    if (current && (current as any).root) {
                        const rootSlug = (current as any).root;
                        parent = roots.find(root => root.slug === rootSlug) || null;
                    }
                }

                if (!current) {
                    const lastSegment = urlSegments[urlSegments.length - 1];
                    current = {
                        name: lastSegment.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
                        slug: fullSlug,
                        id: 0,
                    } as any;
                }

                setCurrentCategory(current);
                setParentCategory(parent);
                setError(null);
            } catch (err: any) {
                console.error('Error loading page:', err);
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [resolvedParams, searchParams]);

    if (loading || !resolvedParams) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="text-center">
                    <p className="text-red-500 mb-4">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // 构建面包屑
    const breadcrumbs: BreadcrumbItem[] = [{ name: 'Home', path: '/' }];
    
    if (parentCategory) {
        breadcrumbs.push({
            name: parentCategory.name,
            path: `/collections/${parentCategory.slug}`
        });
    }

    breadcrumbs.push({
        name: currentCategory?.name || 'Collection',
        path: null
    });

    const urlSegments = Array.isArray(resolvedParams.category)
        ? resolvedParams.category
        : [resolvedParams.category];
    const fullSlug = urlSegments.join('/');

    return (
        <section className="min-h-screen bg-white w-full max-w-full overflow-x-hidden">
            {/* 面包屑 */}
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pt-4 pb-4">
                <Breadcrumb items={breadcrumbs} showLastItem={true} />
            </div>

            {/* Hero */}
            <CollectionHero
                title={currentCategory?.name || 'Collection'}
                description={(currentCategory as any)?.description}
                imagePath={(currentCategory as any)?.image}
            />

            {/* 产品列表 */}
            <div className="container mx-auto px-4 sm:px-6 max-w-7xl pb-16">
                <div className="flex flex-col w-full">
                    <main className="flex-1 min-w-0 w-full">
                        <ProductList
                            products={productsData.content}
                            itemsPerPage={ITEMS_PER_PAGE}
                            totalPages={productsData.totalPages}
                            currentPage={productsData.currentPage}
                            totalProducts={productsData.totalElements}
                            initialFilters={{
                                priceRange: productsData.content.length > 0 ? null : null,
                                colors: [],
                                features: [],
                                materials: []
                            }}
                        />
                    </main>
                </div>
            </div>

            {/* FAQ */}
            <div className="container mx-auto px-4 sm:px-6">
                <div className="border-t border-gray-100 pt-16 pb-24 max-w-3xl mx-auto">
                    <FAQSection tag={currentCategory?.slug} />
                </div>
            </div>
        </section>
    );
}
