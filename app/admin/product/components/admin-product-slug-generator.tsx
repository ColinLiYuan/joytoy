// /app/admin/products/admin-product-slug-generator.tsx
'use client';

import { useState, useEffect, useCallback } from 'react';

interface Product {
    slug?: string;
}

interface Category {
    slug: string; // 二级分类的完整slug，如 "female-sex-toys/clit-vibrators"
    name: string;
    categoryList?: Category[];
}

interface SlugGeneratorProps {
    product: Product;
    roots: Category[];
    updateProduct: (updates: Partial<Product>) => void;
}

export default function SlugGenerator({ product, roots, updateProduct }: SlugGeneratorProps) {
    const [selectedRoot, setSelectedRoot] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [suffix, setSuffix] = useState<string>('');
    const [isInitialized, setIsInitialized] = useState<boolean>(false);

    // 解析现有slug - 修复版
    const parseExistingSlug = useCallback((slug: string, categories: Category[]) => {
        if (!slug) return { root: '', category: '', suffix: '' };

        console.log('解析slug:', slug);

        // 移除开头和结尾的斜杠
        const cleanSlug = slug.replace(/^\/|\/$/g, '');
        const parts = cleanSlug.split('/');

        console.log('分割结果:', parts);

        // 预期的slug格式: /一级分类/二级分类/产品标识
        // 比如: /female-sex-toys/clit-vibrators/123
        if (parts.length >= 2) {
            const rootSlug = parts[0]; // 一级分类slug
            const categorySlug = parts[1]; // 二级分类slug（不包含一级）
            const fullCategorySlug = `${rootSlug}/${categorySlug}`; // 完整的二级分类slug
            const productSuffix = parts.slice(2).join('/'); // 产品标识

            console.log('查找分类:', { rootSlug, categorySlug, fullCategorySlug });

            // 查找匹配的一级分类
            const root = categories.find(r => r.slug === rootSlug);
            if (root) {
                // 在该一级分类下查找二级分类
                const category = root.categoryList?.find(cat => {
                    // 二级分类的slug是完整路径，如 "female-sex-toys/clit-vibrators"
                    return cat.slug === fullCategorySlug;
                });

                if (category) {
                    console.log('找到匹配的分类:', {
                        root: root.slug,
                        category: category.slug,
                        suffix: productSuffix
                    });
                    return {
                        root: root.slug,
                        category: category.slug, // 完整的二级分类slug
                        suffix: productSuffix
                    };
                }
            }
        }

        console.log('解析失败，返回空');
        return { root: '', category: '', suffix: '' };
    }, []);

    // 初始化解析
    useEffect(() => {
        if (roots.length > 0 && product.slug !== undefined && !isInitialized) {
            console.log('可用的分类数据:', roots.map(root => ({
                name: root.name,
                slug: root.slug,
                subcategories: root.categoryList?.map(cat => ({
                    name: cat.name,
                    slug: cat.slug
                }))
            })));

            const parsed = parseExistingSlug(product.slug || '', roots);

            console.log('解析结果:', {
                original: product.slug,
                parsed
            });

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

        // 格式: /一级分类/二级分类名称/产品标识
        if (selectedRoot && selectedCategory && suffix) {
            // 从完整的二级分类slug中提取二级分类名称
            const categoryParts = selectedCategory.split('/');
            const categoryName = categoryParts[1] || categoryParts[0]; // 取第二部分或整个
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

        // 转换为小写并清理
        newSlug = newSlug.toLowerCase().replace(/\/+/g, '/');

        console.log('生成新slug:', {
            selectedRoot,
            selectedCategory,
            suffix,
            newSlug
        });

        // 只有当slug确实改变时才更新
        if (newSlug !== product.slug) {
            updateProduct({ slug: newSlug });
        }
    }, [selectedRoot, selectedCategory, suffix, isInitialized, product.slug, updateProduct]);

    // 当选择变化时重新生成slug
    useEffect(() => {
        generateSlug();
    }, [generateSlug]);

    const handleRootChange = (rootSlug: string) => {
        console.log('选择一级分类:', rootSlug);
        setSelectedRoot(rootSlug);
        setSelectedCategory(''); // 重置二级分类
    };

    const handleCategoryChange = (categorySlug: string) => {
        console.log('选择二级分类:', categorySlug);
        setSelectedCategory(categorySlug);
    };

    const handleSuffixChange = (newSuffix: string) => {
        // 清理输入，只允许字母、数字、连字符
        const cleanSuffix = newSuffix.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-');
        setSuffix(cleanSuffix);
    };

    // 获取当前选中的一级分类下的二级分类
    const currentRoot = roots.find(root => root.slug === selectedRoot);
    const availableCategories = currentRoot?.categoryList || [];

    // 从完整的二级分类slug中提取显示名称
    const getCategoryDisplayName = (categorySlug: string) => {
        const parts = categorySlug.split('/');
        return parts[1] || parts[0] || categorySlug;
    };

    return (
        <div className="slug-generator bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                    </svg>
                    URL Slug生成器
                </h3>
                <p className="text-sm text-gray-600 mt-1">选择分类并输入产品标识，自动生成友好的URL路径</p>

                {/* 调试信息 */}
                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-2 p-2 bg-yellow-100 rounded text-xs">
                        <div>Debug: 初始化: {isInitialized ? '是' : '否'}</div>
                        <div>当前Slug: {product.slug || '空'}</div>
                        <div>解析结果: 一级={selectedRoot || '空'}, 二级={selectedCategory || '空'}, 后缀={suffix || '空'}</div>
                    </div>
                )}
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
                        Slug预览和编辑
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
    );
}