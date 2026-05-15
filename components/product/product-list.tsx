// components/product/product-list.tsx
'use client';

import { ProductResponse } from '@/types/product';
import ProductCard from '@/components/product/product-card';
import Pagination from '@/components/common/pagination';
import ProductFilters from '@/components/product/product-filters';
import { useState, useEffect } from 'react';
import SortSelectModal from '@/components/product/sort-select-modal';
import { useRouter } from 'next/navigation';
import { Z_INDEX } from '@/lib/constants/z-index'; // ✅ 引入常量
import { SlidersHorizontal, X } from 'lucide-react'; // ✅ Lucide

interface ProductListProps {
    products: ProductResponse[];
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
    totalProducts?: number;
    showSortSelect?: boolean;
    showProductCount?: boolean;
    showPagination?: boolean;
    availableFilters?: {
        colors: string[];
        features: string[];
        materials: string[];
    };
    initialFilters?: {
        priceRange: [number, number] | null;
        colors: string[];
        features: string[];
        materials: string[];
    };
}

export default function ProductList({
                                        products = [],
                                        totalPages,
                                        currentPage,
                                        totalProducts = 0,
                                        showSortSelect = true,
                                        showProductCount = true,
                                        showPagination = true,
                                        availableFilters = {
                                            colors: [],
                                            features: [],
                                            materials: []
                                        },
                                        initialFilters = {
                                            priceRange: null,
                                            colors: [],
                                            features: [],
                                            materials: []
                                        }
                                    }: ProductListProps) {
    const [showFilters, setShowFilters] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(window.location.search);
        params.set('page', page.toString());
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    // 本地筛选状态
    const [localFilters, setLocalFilters] = useState({
        priceRange: initialFilters.priceRange,
        colors: initialFilters.colors,
        features: initialFilters.features,
        materials: initialFilters.materials
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setLocalFilters({
            priceRange: initialFilters.priceRange,
            colors: initialFilters.colors,
            features: initialFilters.features,
            materials: initialFilters.materials
        });
    }, [
        initialFilters.priceRange,
        initialFilters.colors?.join(','),
        initialFilters.features?.join(','),
        initialFilters.materials?.join(',')
    ]);

    useEffect(() => {
        if (showFilters && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        } else {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.position = 'static';
            document.body.style.width = 'auto';
        };
    }, [showFilters]);

    const handleCloseFilters = () => setShowFilters(false);
    const handleOpenFilters = () => setShowFilters(true);

    const activeFilterCount = [
        initialFilters.priceRange ? 1 : 0,
        initialFilters.colors.length,
        initialFilters.features.length,
        initialFilters.materials.length
    ].reduce((a, b) => a + b, 0);

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (localFilters.priceRange) params.set('priceRange', `${localFilters.priceRange[0]}-${localFilters.priceRange[1]}`);
        else params.delete('priceRange');

        if (localFilters.colors.length > 0) params.set('colors', localFilters.colors.join(','));
        if (localFilters.features.length > 0) params.set('features', localFilters.features.join(','));
        if (localFilters.materials.length > 0) params.set('materials', localFilters.materials.join(','));

        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            if (!['priceRange', 'colors', 'features', 'materials', 'page'].includes(key)) params.set(key, value);
        });

        params.delete('page');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
        setShowFilters(false);
    };

    const handleClearFilters = () => {
        const params = new URLSearchParams(window.location.search);
        ['priceRange', 'colors', 'features', 'materials'].forEach(param => params.delete(param));
        params.delete('page');
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
        setLocalFilters({ priceRange: null, colors: [], features: [], materials: [] });
        setShowFilters(false);
    };

    if (products.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col px-4 sm:px-6 lg:px-8 pt-6">
                <div className="text-center py-16 px-8 bg-slate-50 rounded-xl flex-1 flex flex-col justify-center items-center">
                    <div className="text-6xl mb-6 opacity-50">🔍</div>
                    <h3 className="text-2xl font-['Playfair_Display'] font-bold text-gray-900 mb-4">No products found</h3>
                    <p className="text-gray-500 mb-8 text-lg">We couldn't find any products matching your criteria.</p>
                    <button
                        onClick={handleClearFilters}
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg font-bold transition-all duration-300 hover:bg-gray-800"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[400px] flex flex-col relative w-full max-w-full">
            {/* Header & Grid (unchanged) */}
            <div className="flex flex-col">
                <div className="flex-1 min-w-0">
                    {products.length > 0 && (showProductCount || showSortSelect) && (
                        <div className="flex flex-wrap justify-between items-center mb-4 pt-4 pb-1 gap-2"> {/* ✅ 增加 flex-wrap 和 gap */}
                            {showProductCount && (
                                <span className="text-gray-500 font-normal text-sm whitespace-nowrap">
            {totalProducts} products
        </span>
                            )}

                            <div className="flex items-center gap-2 ml-auto"> {/* ✅ ml-auto 靠右对齐 */}
                                {showSortSelect && <SortSelectModal className="w-auto" />}

                                <button
                                    onClick={handleOpenFilters}
                                    className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:border-black hover:text-black transition-all duration-300 whitespace-nowrap" // ✅ 减小 padding，禁止换行
                                >
                                    <SlidersHorizontal size={16} />
                                    <span className="hidden sm:inline">Filters</span> {/* ✅ 超小屏幕隐藏文字 */}
                                    {activeFilterCount > 0 && (
                                        <span className="bg-black text-white text-[10px] px-1.5 py-0.5 rounded-full ml-1">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 flex-1">
                        {products.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>
                    {showPagination && <Pagination currentPage={currentPage} totalPages={totalPages} totalElements={totalProducts} onPageChange={handlePageChange} />}
                </div>
            </div>

            {/* ✅ Filters Panel - 修复了溢出问题 */}
            {isMounted && (
                <>
                    <div
                        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                            showFilters ? 'opacity-100 visible' : 'opacity-0 invisible'
                        }`}
                        style={{ zIndex: Z_INDEX.OVERLAY }}
                        onClick={handleCloseFilters}
                    />

                    <div
                        className={`fixed right-0 top-0 bottom-0 bg-white shadow-2xl w-full max-w-xs sm:max-w-sm transition-transform duration-300 ease-in-out flex flex-col ${
                            showFilters ? 'translate-x-0' : 'translate-x-full'
                        } ${
                            /* ✅ 关键修复：关闭时 invisible，防止水平溢出 */
                            showFilters ? 'visible' : 'invisible'
                        }`}
                        style={{ zIndex: Z_INDEX.DRAWER }}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-xl font-bold text-gray-900 font-['Playfair_Display']">Filters</h3>
                            <button onClick={handleCloseFilters} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                                <X size={24} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            <ProductFilters
                                filters={localFilters}
                                onFiltersChange={setLocalFilters}
                                availableFilters={availableFilters}
                            />
                        </div>

                        <div className="border-t border-gray-100 p-6 bg-gray-50/50">
                            <div className="flex gap-3">
                                <button onClick={handleApplyFilters} className="flex-1 bg-black text-white py-3.5 rounded-lg font-bold hover:bg-gray-800 transition-all shadow-lg">Show Results</button>
                                <button onClick={handleClearFilters} className="px-6 py-3.5 text-gray-600 font-medium bg-white border border-gray-200 rounded-lg hover:border-gray-400 hover:text-black transition-all">Clear</button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}