// /app/admin/product/components/admin-product-category-url.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Category {
    slug: string;
    name: string;
    categoryList?: Category[];
}

interface Product {
    slug?: string;
    categories?: string[];
}

interface CategoryUrlProps {
    product: Product;
    roots: Category[];
    updateProduct: (updates: Partial<Product>) => void;
}

export default function AdminProductCategoryUrl({ product, roots, updateProduct }: CategoryUrlProps) {
    // 分类相关状态
    const [selectedRoot, setSelectedRoot] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [suffix, setSuffix] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // 解析现有slug
    const parseExistingSlug = useCallback((slug: string, categories: Category[]) => {
        if (!slug) return { root: '', category: '', suffix: '' };

        const cleanSlug = slug.replace(/^\/|\/$/g, '');
        const parts = cleanSlug.split('/');

        if (parts.length >= 2) {
            const rootSlug = parts[0];
            const categorySlug = parts[1];
            const fullCategorySlug = `${rootSlug}/${categorySlug}`;
            const productSuffix = parts.slice(2).join('/');

            const root = categories.find(r => r.slug === rootSlug);
            if (root) {
                const category = root.categoryList?.find(cat => cat.slug === fullCategorySlug);
                if (category) {
                    return {
                        root: root.slug,
                        category: category.slug,
                        suffix: productSuffix
                    };
                }
            }
        }

        return { root: '', category: '', suffix: '' };
    }, []);

    // 初始化解析
    useEffect(() => {
        if (roots.length > 0 && product.slug !== undefined && !isInitialized) {
            const parsed = parseExistingSlug(product.slug || '', roots);
            setSelectedRoot(parsed.root);
            setSelectedCategory(parsed.category);
            setSuffix(parsed.suffix);
            setIsInitialized(true);
        }
    }, [product.slug, roots, isInitialized, parseExistingSlug]);

    // 生成新slug
    const generateSlug = useCallback(() => {
        if (!isInitialized) return;

        let newSlug = '';

        if (selectedRoot && selectedCategory && suffix) {
            const categoryParts = selectedCategory.split('/');
            const categoryName = categoryParts[1] || categoryParts[0];
            newSlug = `/${selectedRoot}/${categoryName}/${suffix}`;
        } else if (selectedRoot && selectedCategory) {
            const categoryParts = selectedCategory.split('/');
            const categoryName = categoryParts[1] || categoryParts[0];
            newSlug = `/${selectedRoot}/${categoryName}`;
        } else if (suffix) {
            newSlug = `/${suffix}`;
        } else {
            newSlug = '';
        }

        newSlug = newSlug.toLowerCase().replace(/\/+/g, '/');

        if (newSlug !== product.slug) {
            updateProduct({ slug: newSlug });
        }
    }, [selectedRoot, selectedCategory, suffix, isInitialized, product.slug, updateProduct]);

    useEffect(() => {
        generateSlug();
    }, [generateSlug]);

    const handleRootChange = (rootSlug: string) => {
        setSelectedRoot(rootSlug);
        setSelectedCategory('');
    };

    const handleCategoryChange = (categorySlug: string) => {
        setSelectedCategory(categorySlug);
    };

    const handleSuffixChange = (newSuffix: string) => {
        const cleanSuffix = newSuffix.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-');
        setSuffix(cleanSuffix);
    };

    // 分类选择处理
    const handleCategorySelection = (categorySlug: string, checked: boolean) => {
        const currentCategories = product.categories || [];
        const newCategories = checked
            ? [...currentCategories, categorySlug]
            : currentCategories.filter((slug: string) => slug !== categorySlug);

        updateProduct({ categories: newCategories });
    };

    const currentRoot = roots.find(root => root.slug === selectedRoot);
    const availableCategories = currentRoot?.categoryList || [];

    const getCategoryDisplayName = (categorySlug: string) => {
        const parts = categorySlug.split('/');
        return parts[1] || parts[0] || categorySlug;
    };

    return (
        <div className="space-y-6">
            {/* URL Slug 设置 */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                        URL 路径设置
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">选择分类并输入产品标识，自动生成友好的URL路径</p>
                </div>

                <div className="p-6 space-y-6">
                    {/* 分类选择器 */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                选择产品分类
                                <span className="text-red-500 ml-1">*</span>
                            </label>

                            {/* 一级分类选择 */}
                            <div className="mb-4">
                                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                    一级分类
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {roots.map((root) => (
                                        <button
                                            key={root.slug}
                                            type="button"
                                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                                selectedRoot === root.slug
                                                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                    : 'border-gray-200 bg-white hover:border-gray-300'
                                            }`}
                                            onClick={() => handleRootChange(root.slug)}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                                    selectedRoot === root.slug
                                                        ? 'border-blue-500 bg-blue-500'
                                                        : 'border-gray-300'
                                                }`}></div>
                                                <span className="font-medium text-gray-800">{root.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 二级分类选择 */}
                            <div className={`transition-opacity duration-300 ${selectedRoot ? 'opacity-100' : 'opacity-50'}`}>
                                <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    二级分类
                                    {!selectedRoot && <span className="text-xs text-gray-400 ml-2">（请先选择一级分类）</span>}
                                </h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {availableCategories.map((category) => (
                                        <button
                                            key={category.slug}
                                            type="button"
                                            className={`p-3 rounded-lg border-2 transition-all duration-200 text-left ${
                                                selectedCategory === category.slug
                                                    ? 'border-green-500 bg-green-50 shadow-sm'
                                                    : selectedRoot
                                                    ? 'border-gray-200 bg-white hover:border-gray-300'
                                                    : 'border-gray-100 bg-gray-50 cursor-not-allowed'
                                            }`}
                                            onClick={() => selectedRoot && handleCategoryChange(category.slug)}
                                            disabled={!selectedRoot}
                                        >
                                            <div className="flex items-center">
                                                <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                                                    selectedCategory === category.slug
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300'
                                                }`}></div>
                                                <span className={`font-medium ${
                                                    selectedRoot ? 'text-gray-800' : 'text-gray-400'
                                                }`}>
                                                    {getCategoryDisplayName(category.slug)}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 产品标识输入 */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <label htmlFor="productSlugSuffix" className="block text-sm font-medium text-gray-700 mb-2">
                            产品唯一标识
                            <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="flex items-center space-x-3">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    id="productSlugSuffix"
                                    value={suffix}
                                    onChange={(e) => handleSuffixChange(e.target.value)}
                                    placeholder="输入产品唯一标识（英文字母、数字、连字符）"
                                />
                            </div>
                            <div className="text-sm text-gray-500 whitespace-nowrap">
                                将作为slug后缀
                            </div>
                        </div>
                    </div>

                    {/* 生成的Slug预览 */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-200">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                            Slug预览
                            <span className="text-red-500 ml-1">*</span>
                        </label>

                        <div className="flex items-center space-x-3 mb-3">
                            <div className="flex-1 bg-white rounded-lg border border-gray-300 p-4">
                                <div className="font-mono text-sm text-gray-800 break-all">
                                    {product.slug ? (
                                        <span className="flex items-center flex-wrap">
                                            <span className="text-gray-400">/</span>
                                            {selectedRoot && (
                                                <span className="text-blue-600 font-semibold">{selectedRoot}</span>
                                            )}
                                            {selectedCategory && (
                                                <>
                                                    <span className="mx-1 text-gray-400">/</span>
                                                    <span className="text-green-600 font-semibold">
                                                        {getCategoryDisplayName(selectedCategory)}
                                                    </span>
                                                </>
                                            )}
                                            {suffix && (
                                                <>
                                                    <span className="mx-1 text-gray-400">/</span>
                                                    <span className="text-purple-600">{suffix}</span>
                                                </>
                                            )}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">请选择分类并输入产品标识</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center mt-3 text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Slug格式：/一级分类/二级分类/产品标识
                        </div>
                    </div>
                </div>
            </div>

            {/* 筛选分类设置 */}
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">筛选分类设置</h3>
                    <p className="text-sm text-gray-600 mt-1">用于产品筛选和展示的分类（可多选）</p>
                </div>
                <div className="p-6">
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                        {roots.length > 0 ? (
                            roots.map((root) => (
                                <div key={root.slug} className="space-y-1">
                                    {/* 一级分类 */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`filter_category_${root.slug}`}
                                            checked={product.categories?.includes(root.slug) || false}
                                            onChange={(e) => handleCategorySelection(root.slug, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`filter_category_${root.slug}`}
                                            className="ml-2 text-sm font-medium text-gray-900"
                                        >
                                            {root.name}
                                        </label>
                                    </div>

                                    {/* 二级分类 */}
                                    {root.categoryList?.map((category: any) => (
                                        <div key={category.slug} className="flex items-center ml-6">
                                            <input
                                                type="checkbox"
                                                id={`filter_category_${category.slug}`}
                                                checked={product.categories?.includes(category.slug) || false}
                                                onChange={(e) => handleCategorySelection(category.slug, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={`filter_category_${category.slug}`}
                                                className="ml-2 text-sm text-gray-700"
                                            >
                                                {category.name}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-500 text-sm">暂无分类数据</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
