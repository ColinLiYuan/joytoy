// components/product/product-list.tsx
'use client';

import { ProductResponse } from '@/types/product';
import ProductCard from '@/components/product/product-card';
import Pagination from '@/components/common/pagination';
import ProductFilters from '@/components/product/product-filters';
import { useState, useEffect } from 'react';
import SortSelectModal from '@/components/product/sort-select-modal';

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

    // 添加本地筛选状态
    const [localFilters, setLocalFilters] = useState({
        priceRange: initialFilters.priceRange,
        colors: initialFilters.colors,
        features: initialFilters.features,
        materials: initialFilters.materials
    });

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 处理背景滚动 - 只在移动端禁用滚动
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

    const handleCloseFilters = () => {
        setShowFilters(false);
    };

    const handleOpenFilters = () => {
        setShowFilters(true);
    };

    // 计算活动过滤器数量
    const activeFilterCount = [
        initialFilters.priceRange ? 1 : 0,
        initialFilters.colors.length,
        initialFilters.features.length,
        initialFilters.materials.length
    ].reduce((a, b) => a + b, 0);

    const handleApplyFilters = () => {
        // 构建查询参数
        const params = new URLSearchParams();

        // 添加价格范围
        if (localFilters.priceRange) {
            params.set('priceRange', `${localFilters.priceRange[0]}-${localFilters.priceRange[1]}`);
        }

        // 添加其他筛选条件
        if (localFilters.colors.length > 0) {
            params.set('colors', localFilters.colors.join(','));
        }
        if (localFilters.features.length > 0) {
            params.set('features', localFilters.features.join(','));
        }
        if (localFilters.materials.length > 0) {
            params.set('materials', localFilters.materials.join(','));
        }

        // 保留其他现有参数（如分页）
        const currentParams = new URLSearchParams(window.location.search);
        currentParams.forEach((value, key) => {
            if (!['priceRange', 'colors', 'features', 'materials'].includes(key)) {
                params.set(key, value);
            }
        });

        // 跳转到新的 URL
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    };

    const handleClearFilters = () => {
        // 清除所有筛选条件并刷新页面
        const params = new URLSearchParams(window.location.search);

        // 移除所有筛选相关的参数
        ['priceRange', 'colors', 'features', 'materials'].forEach(param => {
            params.delete(param);
        });

        // 跳转到清除筛选后的 URL
        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.location.href = newUrl;
    };

    if (products.length === 0) {
        return (
            <div className="min-h-[400px] flex flex-col px-4 sm:px-6 lg:px-8 pt-6">
                <div className="text-center py-16 px-8 bg-slate-100 rounded-xl flex-1 flex flex-col justify-center items-center">
                    <div className="text-6xl mb-6">😔</div>
                    <h3 className="text-2xl text-gray-800 mb-4">No products found</h3>
                    <p className="text-slate-500 mb-8 text-lg">We couldn't find any products matching your criteria.</p>
                    <button
                        onClick={handleClearFilters}
                        className="inline-block bg-[var(--primary-color)] text-white px-7 py-3 rounded-lg no-underline font-semibold transition-all duration-300 hover:bg-[var(--primary-color)]/90 hover:transform hover:-translate-y-0.5 text-sm cursor-pointer"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[400px] flex flex-col relative">
            <div className="flex flex-col">
                <div className="flex-1 min-w-0">
                    {products.length > 0 && (showProductCount || showSortSelect) && (
                        <div className="flex justify-between items-center mb-1 pt-4 pb-1">
                            {showProductCount && (
                                <span className="text-slate-500 font-normal">{totalProducts} products</span>
                            )}
                            <div className="flex items-center gap-3">
                                {showSortSelect && <SortSelectModal className="w-auto" />}
                                <button
                                    onClick={handleOpenFilters}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm cursor-pointer"
                                >
                                    <svg
                                        className="w-4 h-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                        />
                                    </svg>
                                    Filters
                                    {activeFilterCount > 0 && (
                                        <span className="bg-[var(--primary-color)]/10 text-[var(--primary-color)] text-xs px-2 py-1 rounded-full min-w-[20px]">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* 产品网格 */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10 flex-1">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* 分页 */}
                    {showPagination && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                        />
                    )}
                </div>
            </div>

            {/* Filters Slide-out Panel - 从右侧滑出 */}
            {isMounted && showFilters && (
                <>
                    <div
                        className="fixed inset-0 z-[10000] bg-black opacity-0 animate-opacityIn"
                        onClick={handleCloseFilters}
                    />

                    <div
                        className="fixed right-0 top-0 bottom-0 z-[10001] bg-white shadow-2xl w-full max-w-sm lg:max-w-md animate-slideInRight"
                    >
                        <div className="flex flex-col h-full">
                            {/* Header */}
                            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
                                    <p className="text-sm text-gray-500 mt-1">Refine your product selection</p>
                                </div>
                                {/* 右上角关闭按钮 */}
                                <button
                                    onClick={handleCloseFilters}
                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 cursor-pointer"
                                    aria-label="Close filters"
                                >
                                    <svg
                                        className="w-6 h-6 text-gray-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Filters Content */}
                            <div className="flex-1 overflow-y-auto">
                                <div className="p-6">
                                    <ProductFilters
                                        filters={localFilters}
                                        onFiltersChange={setLocalFilters}
                                        availableFilters={availableFilters}
                                    />
                                </div>
                            </div>

                            <div className="border-t border-gray-200 p-6 bg-white">
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleApplyFilters}
                                        className="flex-1 bg-[var(--primary-color)] text-white py-3 rounded-lg font-semibold hover:bg-[var(--primary-color)]/90 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
                                    >
                                        Apply Filters
                                    </button>

                                    <button
                                        onClick={handleClearFilters}
                                        className="px-6 py-3 text-gray-600 rounded-lg font-medium hover:text-gray-800 transition-all duration-300 border border-gray-300 hover:border-gray-400 whitespace-nowrap cursor-pointer"
                                    >
                                        Clear
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}