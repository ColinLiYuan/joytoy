// /app/admin/products/admin-product-basic-info.tsx

interface BasicInfoProps {
    product: any;
    updateProduct: (updates: any) => void;
}

export default function AdminProductBasicInfo({ product, updateProduct }: BasicInfoProps) {
    const handleInputChange = (field: string, value: any) => {
        updateProduct({ [field]: value });
    };

    const handleColorChange = (color: string, checked: boolean) => {
        const currentColors = product.colors || [];
        const newColors = checked
            ? [...currentColors, color]
            : currentColors.filter((c: string) => c !== color);

        updateProduct({ colors: newColors });
    };

    const vendors = [
        "东莞闺蜜情趣成人用品有限公司",
        "东莞市三只猫科技有限公司",
        "东莞市中同医疗器械科技有限公司",
        "沃色玩具有限公司",
        "东莞欢色工厂",
        "东莞建贸电子科技有限公司",
        "东莞市八分实业有限公司",
        "东莞市茶山中博瑞硅胶制品厂",
        "东莞市千尤成人玩具有限公司",
        "东莞市原始人实业有限公司",
        "东莞市中间医疗器械科技有限公司",
        "东莞沃色玩具有限公司",
        "揭阳市顺资电子实业有限公司",
        "连云港曼芭莎",
        "深圳想成科技有限公司"
    ];

    // 按色系分组颜色
    const colorGroups = {
        "肤色系列": ["Flesh"],
        "红色系列": ["Red", "Pink", "Rose"],
        "蓝色系列": ["Blue", "Sky Blue"],
        "绿色系列": ["Green"],
        "紫色系列": ["Purple"],
        "棕色系列": ["Brown", "Chocolate", "Coffee Light", "Coffee Dark"],
        "灰色/黑色系列": ["Black", "White", "Grey"],
        "金属色": ["Gold", "Silver"]
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">基本信息</h3>
            </div>
            <div className="p-6 space-y-6">
                {/* 第一行：供应商、源标题、标题 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label htmlFor="sourceVendor" className="block text-sm font-medium text-gray-700 mb-2">
                            供应商 <span className="text-red-500">*</span>
                        </label>
                        <select
                            id="sourceVendor"
                            value={product.sourceVendor || ''}
                            onChange={(e) => handleInputChange('sourceVendor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            required
                        >
                            <option value="">请选择供应商</option>
                            {vendors.map((vendor) => (
                                <option key={vendor} value={vendor}>
                                    {vendor}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-5">
                        <label htmlFor="sourceTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            源标题 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="sourceTitle"
                            value={product.sourceTitle || ''}
                            onChange={(e) => handleInputChange('sourceTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            required
                        />
                    </div>

                    <div className="md:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                            标题 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={product.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* 第二行：颜色选择 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">颜色选择</label>
                    <div className="space-y-4">
                        {Object.entries(colorGroups).map(([groupName, colors]) => (
                            <div key={groupName}>
                                <h4 className="text-sm font-medium text-gray-600 mb-2">{groupName}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color: string) => (
                                        <div key={color}>
                                            <input
                                                type="checkbox"
                                                id={`color_${color}`}
                                                checked={product.colors?.includes(color) || false}
                                                onChange={(e) => handleColorChange(color, e.target.checked)}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor={`color_${color}`}
                                                className={`inline-flex items-center px-3 py-1.5 text-xs font-medium border rounded-full cursor-pointer transition-all duration-200 ${
                                                    product.colors?.includes(color)
                                                        ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                                        : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100 hover:border-gray-400'
                                                }`}
                                            >
                                                {color}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 第三行：价格信息 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label htmlFor="purchasePrice" className="block text-sm font-medium text-gray-700 mb-2">
                            采购价格
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                            <input
                                type="number"
                                id="purchasePrice"
                                step="0.01"
                                min="0"
                                value={product.purchasePrice || ''}
                                onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value) || 0)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-2">
                            原始价格 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                            <input
                                type="number"
                                id="originalPrice"
                                step="0.01"
                                min="0"
                                value={product.originalPrice || ''}
                                onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
                            当前价格 <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">¥</span>
                            <input
                                type="number"
                                id="currentPrice"
                                step="0.01"
                                min="0"
                                value={product.currentPrice || ''}
                                onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value) || 0)}
                                className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-2">
                            库存 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            id="stock"
                            step="1"
                            min="0"
                            value={product.stock || ''}
                            onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                            required
                        />
                    </div>
                </div>

                {/* 第四行：其他设置 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="minOrder" className="block text-sm font-medium text-gray-700 mb-2">
                            最小起订量
                        </label>
                        <input
                            type="number"
                            id="minOrder"
                            min="1"
                            value={product.minOrder || 1}
                            onChange={(e) => handleInputChange('minOrder', parseInt(e.target.value) || 1)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        />
                    </div>

                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                            状态
                        </label>
                        <select
                            id="status"
                            value={product.status || 'DRAFT'}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors"
                        >
                            <option value="DRAFT">草稿</option>
                            <option value="ACTIVE">上架</option>
                            <option value="INACTIVE">下架</option>
                        </select>
                    </div>
                </div>

                {/* 产品描述 */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                        产品描述
                    </label>
                    <textarea
                        id="description"
                        rows={4}
                        value={product.description || ''}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors resize-vertical"
                        placeholder="请输入产品描述..."
                    />
                </div>
            </div>
        </div>
    );
}