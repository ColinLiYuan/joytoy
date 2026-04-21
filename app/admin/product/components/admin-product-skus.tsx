// /app/admin/product/components/admin-product-skus.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { ProductSku } from '@/types/admin/adminProduct';
import { COLOR_SYSTEM, getHexColor } from '@/lib/constants/color-config';

interface ProductSkusProps {
    product: any;
    updateProduct: (updates: any) => void;
}

// 扁平化所有颜色选项
const ALL_COLOR_OPTIONS: Array<{ name: string; hex: string; group: string }> = [];
Object.entries(COLOR_SYSTEM).forEach(([groupName, groupData]: [string, any]) => {
    Object.entries(groupData.variants).forEach(([variantName, hexVal]: [string, any]) => {
        ALL_COLOR_OPTIONS.push({ name: variantName, hex: hexVal, group: groupName });
    });
});

export default function ProductSkus({ product, updateProduct }: ProductSkusProps) {
    const [skus, setSkus] = useState<ProductSku[]>([]);
    const [searchColor, setSearchColor] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

    // 初始化SKU数据
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            setSkus(product.productSkus);
        } else if (product.colors && product.colors.length > 0) {
            const generatedSkus = generateSkusFromColors(product.colors, product);
            setSkus(generatedSkus);
            updateProduct({ productSkus: generatedSkus });
        }
    }, [product.productSkus, product.colors, product.title]);

    // 同步 colors 到 SKU
    useEffect(() => {
        if (!product.productSkus || product.productSkus.length === 0) return;

        const currentColors = product.colors || [];
        const currentSkus = product.productSkus || [];

        const skusToRemove = currentSkus.filter((sku: ProductSku) => !currentColors.includes(sku.color));
        const colorsToAdd = currentColors.filter(
            (color: string) => !currentSkus.some((sku: ProductSku) => sku.color === color)
        );

        let updatedSkus = [...currentSkus];

        if (skusToRemove.length > 0) {
            updatedSkus = updatedSkus.filter(sku =>
                !skusToRemove.some((removeSku: ProductSku) => removeSku.color === sku.color)
            );
        }

        if (colorsToAdd.length > 0) {
            colorsToAdd.forEach((color: string) => {
                updatedSkus.push({
                    sku: generateSkuCode(product, color),
                    color: color,
                    stock: 0,
                    lockedStock: 0
                });
            });
        }

        setSkus(updatedSkus);
        updateProduct({ productSkus: updatedSkus });
    }, [product.colors]);

    const generateSkusFromColors = (colors: string[], productData: any): ProductSku[] => {
        return colors.map(color => ({
            sku: generateSkuCode(productData, color),
            color: color,
            stock: productData.stock ? Math.floor(productData.stock / colors.length) : 0,
            lockedStock: 0
        }));
    };

    const generateSkuCode = (productData: any, color: string): string => {
        const titlePrefix = productData.title
            ? productData.title.substring(0, 3).toUpperCase().replace(/\s/g, '')
            : 'PRO';
        const colorPrefix = color.substring(0, 2).toUpperCase();
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        return `${titlePrefix}-${colorPrefix}-${randomNum}`;
    };

    // 添加颜色并创建SKU
    const addColorWithStock = (colorName: string, initialStock: number = 0) => {
        const existingColors = product.colors || [];
        if (existingColors.includes(colorName)) {
            alert(`颜色 "${colorName}" 已存在`);
            return;
        }

        const newColors = [...existingColors, colorName];
        const newSku: ProductSku = {
            sku: generateSkuCode(product, colorName),
            color: colorName,
            stock: initialStock,
            lockedStock: 0
        };
        const newSkus = [...skus, newSku];

        setSkus(newSkus);
        updateProduct({ colors: newColors, productSkus: newSkus });
        setShowColorPicker(false);
        setSearchColor('');
    };

    // 删除颜色/SKU
    const removeColor = (colorName: string) => {
        if (!confirm(`确定删除颜色 "${colorName}" 吗？`)) return;

        const newColors = (product.colors || []).filter((c: string) => c !== colorName);
        const newSkus = skus.filter(sku => sku.color !== colorName);

        setSkus(newSkus);
        updateProduct({ colors: newColors, productSkus: newSkus });
    };

    // 更新SKU库存
    const updateSkuStock = (color: string, stock: number) => {
        const updatedSkus = skus.map(sku =>
            sku.color === color ? { ...sku, stock: Math.max(0, stock) } : sku
        );

        setSkus(updatedSkus);
        updateProduct({
            productSkus: updatedSkus,
            stock: updatedSkus.reduce((sum, sku) => sum + (sku.stock || 0), 0)
        });
    };

    // 更新SKU编码
    const updateSkuCode = (color: string, skuCode: string) => {
        const updatedSkus = skus.map(sku =>
            sku.color === color ? { ...sku, sku: skuCode } : sku
        );
        setSkus(updatedSkus);
        updateProduct({ productSkus: updatedSkus });
    };

    // 库存统计
    const stockStats = useMemo(() => {
        const totalStock = skus.reduce((sum, sku) => sum + (sku.stock || 0), 0);
        const totalLocked = skus.reduce((sum, sku) => sum + (sku.lockedStock || 0), 0);
        const totalAvailable = totalStock - totalLocked;
        const inStockSkus = skus.filter(sku => ((sku.stock || 0) - (sku.lockedStock || 0)) > 0);
        const outOfStockSkus = skus.filter(sku => ((sku.stock || 0) - (sku.lockedStock || 0)) === 0);

        return { totalStock, totalLocked, totalAvailable, inStockCount: inStockSkus.length, outOfStockCount: outOfStockSkus.length };
    }, [skus]);

    // 过滤后的颜色选项
    const filteredColors = useMemo(() => {
        if (!searchColor) return ALL_COLOR_OPTIONS.slice(0, 50);
        return ALL_COLOR_OPTIONS.filter(c => c.name.toLowerCase().includes(searchColor.toLowerCase()));
    }, [searchColor]);

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">SKU管理</h3>
                <p className="text-sm text-gray-600 mt-1">
                    在这里直接添加颜色并设置库存，一步完成
                </p>
            </div>

            <div className="p-6">
                {/* 库存总览 */}
                <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-blue-800">总库存</div>
                        <div className="text-2xl font-bold text-blue-900">{stockStats.totalStock}</div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-emerald-800">可售库存</div>
                        <div className="text-2xl font-bold text-emerald-900">{stockStats.totalAvailable}</div>
                        <div className="text-xs text-emerald-600 mt-1">用户端看到的数量</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                        <div className="text-sm font-medium text-amber-800">已锁定</div>
                        <div className="text-2xl font-bold text-amber-900">{stockStats.totalLocked}</div>
                        <div className="text-xs text-amber-600 mt-1">购物车未付款</div>
                    </div>
                    <div className={`border rounded-lg p-4 ${stockStats.outOfStockCount > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                        <div className={`text-sm font-medium ${stockStats.outOfStockCount > 0 ? 'text-red-800' : 'text-green-800'}`}>缺货SKU</div>
                        <div className={`text-2xl font-bold ${stockStats.outOfStockCount > 0 ? 'text-red-900' : 'text-green-900'}`}>{stockStats.outOfStockCount}</div>
                    </div>
                </div>

                {/* 添加颜色按钮 */}
                <div className="mb-6 relative">
                    <button
                        type="button"
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <span className="text-lg">+</span>
                        添加颜色变体
                    </button>

                    {/* 颜色选择器弹窗 */}
                    {showColorPicker && (
                        <div className="absolute z-50 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-xl">
                            <div className="p-3 border-b">
                                <input
                                    type="text"
                                    placeholder="搜索颜色..."
                                    value={searchColor}
                                    onChange={(e) => setSearchColor(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    autoFocus
                                />
                            </div>
                            <div className="max-h-80 overflow-y-auto p-2">
                                {filteredColors.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => addColorWithStock(color.name)}
                                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-md transition-colors text-left"
                                    >
                                        <span
                                            className="w-5 h-5 rounded-full border border-gray-200 flex-shrink-0"
                                            style={{ backgroundColor: color.hex === 'transparent' ? '#F0F8FF' : color.hex }}
                                        ></span>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium text-gray-900 truncate">{color.name}</div>
                                            <div className="text-xs text-gray-500">{color.group}</div>
                                        </div>
                                    </button>
                                ))}
                                {filteredColors.length === 0 && (
                                    <div className="text-center text-gray-500 py-4 text-sm">未找到匹配的颜色</div>
                                )}
                            </div>
                            <div className="p-3 border-t bg-gray-50 rounded-b-lg">
                                <div className="text-xs text-gray-500 text-center">
                                    点击颜色直接添加（默认库存0），后续可编辑
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SKU列表 */}
                {skus.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <p className="text-lg mb-2">还没有SKU</p>
                        <p className="text-sm">点击上方"添加颜色变体"开始设置</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {skus.map((sku) => {
                            const available = (sku.stock || 0) - (sku.lockedStock || 0);
                            const isOutOfStock = available === 0;

                            return (
                                <div key={sku.color} className={`border rounded-lg p-4 ${isOutOfStock ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="w-6 h-6 rounded-full border border-gray-300"
                                                style={{ backgroundColor: getHexColor(sku.color) }}
                                            ></span>
                                            <span className="text-sm font-bold text-gray-900">{sku.color}</span>
                                            {isOutOfStock && (
                                                <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">售罄</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm">
                                            <span className="text-green-600 font-medium">可售: {available}</span>
                                            {(sku.lockedStock || 0) > 0 && (
                                                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">锁定: {sku.lockedStock}</span>
                                            )}
                                            <span className="text-gray-500">总: {sku.stock || 0}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">SKU编码</label>
                                            <input
                                                type="text"
                                                value={sku.sku}
                                                onChange={(e) => updateSkuCode(sku.color, e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-1">库存数量</label>
                                            <div className="flex gap-2">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={sku.stock || 0}
                                                    onChange={(e) => updateSkuStock(sku.color, parseInt(e.target.value) || 0)}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeColor(sku.color)}
                                                    className="px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-md text-sm transition-colors"
                                                    title="删除此颜色"
                                                >
                                                    删除
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* 使用说明 */}
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-800 mb-2">使用说明</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                        <li>• <strong>可售库存</strong> = 总库存 - 锁定库存（用户端看到的实际数量）</li>
                        <li>• <strong>锁定库存</strong> = 已加入购物车但未付款的库存</li>
                        <li>• 点击"添加颜色变体"搜索并选择颜色，一步完成添加</li>
                        <li>• 库存由SKU汇总，修改单个SKU库存会自动更新总库存</li>
                        <li>• 红色背景表示该颜色可售库存为0</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
