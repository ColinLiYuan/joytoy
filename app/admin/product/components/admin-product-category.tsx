// /app/admin/products/admin-product-basic-info.tsx

interface CategorySettingsProps {
    product: any;
    roots: any[];
    updateProduct: (updates: any) => void;
}

export default function AdminProductCategory({ product, roots, updateProduct }: CategorySettingsProps) {
    const handleCategoryChange = (categorySlug: string, checked: boolean) => {
        const currentCategories = product.categories || [];
        const newCategories = checked
            ? [...currentCategories, categorySlug]
            : currentCategories.filter((slug: string) => slug !== categorySlug);

        updateProduct({ categories: newCategories });
    };

    const handleBadgeChange = (badge: string) => {
        updateProduct({ badge });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">分类设置</h3>
            </div>
            <div className="p-6 space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">产品分类</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-4 bg-gray-50">
                        {roots.length > 0 ? (
                            roots.map((root) => (
                                <div key={root.slug} className="space-y-1">
                                    {/* 一级分类 */}
                                    <div className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`category_${root.slug}`}
                                            checked={product.categories?.includes(root.slug) || false}
                                            onChange={(e) => handleCategoryChange(root.slug, e.target.checked)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label
                                            htmlFor={`category_${root.slug}`}
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
                                                id={`category_${category.slug}`}
                                                checked={product.categories?.includes(category.slug) || false}
                                                onChange={(e) => handleCategoryChange(category.slug, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <label
                                                htmlFor={`category_${category.slug}`}
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

                <div>
                    <label htmlFor="badge" className="block text-sm font-medium text-gray-700 mb-1">
                        产品徽章
                    </label>
                    <select
                        id="badge"
                        value={product.badge || ''}
                        onChange={(e) => handleBadgeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                        <option value="">无徽章</option>
                        <option value="热销">热销</option>
                        <option value="新品">新品</option>
                        <option value="推荐">推荐</option>
                    </select>
                </div>
            </div>
        </div>
    );
}