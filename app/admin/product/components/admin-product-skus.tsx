// /app/admin/product/admin-product-skus.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductSku } from '@/types/admin/adminProduct';

interface ProductSkusProps {
    product: any;
    updateProduct: (updates: any) => void;
}

export default function ProductSkus({ product, updateProduct }: ProductSkusProps) {
    const [skus, setSkus] = useState<ProductSku[]>([]);

    // 初始化SKU数据
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            // 编辑模式：使用数据库中的SKU数据
            setSkus(product.productSkus);
        } else if (product.colors && product.colors.length > 0) {
            // 新建模式：根据颜色自动生成SKU
            const generatedSkus = generateSkusFromColors(product.colors, product);
            setSkus(generatedSkus);
            updateProduct({ productSkus: generatedSkus });
        }
    }, [product.productSkus, product.colors, product.title]);

    // 当颜色变化时，同步更新SKU
    useEffect(() => {
        if (!product.productSkus || product.productSkus.length === 0) {
            // 只有新建模式才自动生成SKU
            return;
        }

        const currentColors = product.colors || [];
        const currentSkus = product.productSkus || [];

        // 找出需要删除的SKU（颜色已被移除）
        const skusToRemove = currentSkus.filter((sku: ProductSku) => !currentColors.includes(sku.color));

        // 找出需要添加的SKU（新颜色）
        const colorsToAdd = currentColors.filter(
            (color: string) => !currentSkus.some((sku: ProductSku) => sku.color === color)
        );

        let updatedSkus = [...currentSkus];

        // 删除不存在的颜色对应的SKU
        if (skusToRemove.length > 0) {
            updatedSkus = updatedSkus.filter(sku =>
                !skusToRemove.some((removeSku: ProductSku) => removeSku.color === sku.color)
            );
        }

        // 为新颜色添加SKU
        if (colorsToAdd.length > 0) {
            colorsToAdd.forEach((color: string) => {
                updatedSkus.push({
                    sku: generateSkuCode(product, color),
                    color: color,
                    stock: 0 // 新颜色默认库存为0
                });
            });
        }

        setSkus(updatedSkus);
        updateProduct({ productSkus: updatedSkus });
    }, [product.colors]);

    // 根据颜色数组生成SKU
    const generateSkusFromColors = (colors: string[], productData: any): ProductSku[] => {
        return colors.map(color => ({
            sku: generateSkuCode(productData, color),
            color: color,
            stock: productData.stock ? Math.floor(productData.stock / colors.length) : 0
        }));
    };

    // 生成SKU编码
    const generateSkuCode = (productData: any, color: string): string => {
        // 如果有自定义SKU逻辑，可以在这里实现
        // 默认使用：产品标题前3字母 + 颜色前2字母 + 随机数
        const titlePrefix = productData.title
            ? productData.title.substring(0, 3).toUpperCase().replace(/\s/g, '')
            : 'PRO';
        const colorPrefix = color.substring(0, 2).toUpperCase();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${titlePrefix}-${colorPrefix}-${randomNum}`;
    };

    // 更新单个SKU的库存
    const updateSkuStock = (color: string, stock: number) => {
        const updatedSkus = skus.map(sku =>
            sku.color === color ? { ...sku, stock: Math.max(0, stock) } : sku
        );

        setSkus(updatedSkus);
        updateProduct({
            productSkus: updatedSkus,
            // 同时更新总库存
            stock: updatedSkus.reduce((sum, sku) => sum + (sku.stock || 0), 0)
        });
    };

    // 更新单个SKU的编码
    const updateSkuCode = (color: string, skuCode: string) => {
        const updatedSkus = skus.map(sku =>
            sku.color === color ? { ...sku, sku: skuCode } : sku
        );

        setSkus(updatedSkus);
        updateProduct({ productSkus: updatedSkus });
    };

    // 重新生成所有SKU编码
    const regenerateAllSkus = () => {
        const updatedSkus = skus.map(sku => ({
            ...sku,
            sku: generateSkuCode(product, sku.color)
        }));

        setSkus(updatedSkus);
        updateProduct({ productSkus: updatedSkus });
    };

    // 获取库存统计
    const getStockStats = () => {
        const totalStock = skus.reduce((sum, sku) => sum + (sku.stock || 0), 0);
        const inStockSkus = skus.filter(sku => (sku.stock || 0) > 0);
        const outOfStockSkus = skus.filter(sku => (sku.stock || 0) === 0);

        return {
            totalStock,
            inStockSkus,
            outOfStockSkus,
            inStockCount: inStockSkus.length,
            outOfStockCount: outOfStockSkus.length
        };
    };

    const stockStats = getStockStats();

    if (!product.colors || product.colors.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-sm border">
                <div className="px-6 py-4 border-b">
                    <h3 className="text-lg font-semibold">SKU管理</h3>
                </div>
                <div className="p-6">
                    <div className="text-center text-gray-500 py-8">
                        <p>请先在"基本信息"中选择颜色，系统会自动为每个颜色生成SKU</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold">SKU管理</h3>
                    <p className="text-sm text-gray-600 mt-1">
                        每个颜色对应一个SKU，系统自动管理
                    </p>
                </div>
                <button
                    type="button"
                    onClick={regenerateAllSkus}
                    className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                    重新生成SKU
                </button>
            </div>

            <div className="p-6">
                {/* 库存统计 */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-800">总库存</div>
                        <div className="text-2xl font-bold text-blue-900">{stockStats.totalStock}</div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-green-800">有库存</div>
                        <div className="text-2xl font-bold text-green-900">{stockStats.inStockCount}</div>
                        <div className="text-xs text-green-600 mt-1">
                            {stockStats.inStockSkus.map(sku => sku.color).join(', ')}
                        </div>
                    </div>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-red-800">无库存</div>
                        <div className="text-2xl font-bold text-red-900">{stockStats.outOfStockCount}</div>
                        <div className="text-xs text-red-600 mt-1">
                            {stockStats.outOfStockSkus.map(sku => sku.color).join(', ')}
                        </div>
                    </div>
                </div>

                {/* SKU列表 */}
                <div className="space-y-4">
                    {skus.map((sku) => (
                        <div key={sku.color} className={`border rounded-lg p-4 ${
                            (sku.stock || 0) === 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'
                        }`}>
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center space-x-3">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        (sku.stock || 0) === 0
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}>
                                        {sku.color}
                                    </span>
                                    <span className="text-sm text-gray-600">颜色变体</span>
                                </div>
                                <div className={`text-sm font-medium ${
                                    (sku.stock || 0) === 0 ? 'text-red-600' : 'text-green-600'
                                }`}>
                                    库存: {sku.stock || 0}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SKU编码
                                    </label>
                                    <input
                                        type="text"
                                        value={sku.sku}
                                        onChange={(e) => updateSkuCode(sku.color, e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                        placeholder="SKU编码"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        库存数量
                                    </label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={sku.stock || 0}
                                        onChange={(e) => updateSkuStock(sku.color, parseInt(e.target.value) || 0)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* 操作说明 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">使用说明</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• 系统自动为每个颜色生成唯一的SKU编码</li>
                        <li>• 修改颜色时，SKU会自动同步添加/删除</li>
                        <li>• 编辑单个SKU库存会自动更新总库存</li>
                        <li>• 红色背景表示该颜色缺货</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}