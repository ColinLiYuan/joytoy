// /app/admin/products/components/admin-product-basic-info.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { COLOR_SYSTEM } from '@/lib/constants/color-config';

// 动态导入 MD 编辑器
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface BasicInfoProps {
    product: any;
    updateProduct: (updates: any) => void;
}

export default function AdminProductBasicInfo({ product, updateProduct }: BasicInfoProps) {
    const [customColor, setCustomColor] = useState('');


    const handleInputChange = (field: string, value: any) => {
        updateProduct({ [field]: value });
    };

    const handleColorChange = (color: string, checked: boolean) => {
        const currentColors = product.colors || [];
        const cleanColor = color.trim();

        const newColors = checked
            ? [...currentColors, cleanColor]
            : currentColors.filter((c: string) => c !== cleanColor);

        updateProduct({ colors: newColors });
    };

    const addCustomColor = () => {
        if (!customColor.trim()) return;

        const newColor = customColor.trim();
        // 简单的首字母大写格式化
        const formattedColor = newColor.charAt(0).toUpperCase() + newColor.slice(1);

        if (!product.colors?.includes(formattedColor)) {
            const newColors = [...(product.colors || []), formattedColor];
            updateProduct({ colors: newColors });
        }
        setCustomColor('');
    };

    // 辅助函数：根据颜色名查找对应的 HEX 值用于预览
    const getPreviewHex = (colorName: string) => {
        for (const group of Object.values(COLOR_SYSTEM)) {
            // @ts-ignore - 忽略类型检查以便快速查找
            if (group.variants[colorName]) {
                // @ts-ignore
                return group.variants[colorName];
            }
            // 尝试不区分大小写查找
            const key = Object.keys(group.variants).find(k => k.toLowerCase() === colorName.toLowerCase());
            if (key) {
                // @ts-ignore
                return group.variants[key];
            }
        }
        return '#CCCCCC'; // 默认灰色
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">基本信息</h3>
            </div>
            <div className="p-6 space-y-6">
                {/* 第一行：标题 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-12">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            展示标题 <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={product.title || ''}
                            onChange={(e) => handleInputChange('title', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 font-semibold"
                            placeholder="商城显示的英文标题..."
                        />
                    </div>
                </div>

                {/* 第二行：产品名称、品牌 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            产品名称 (中文/自定义名称)
                        </label>
                        <input
                            type="text"
                            value={product.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="中文名称..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">品牌</label>
                        <input
                            type="text"
                            value={product.brand || ''}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="品牌名称"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">标签/徽章</label>
                        <select
                            value={product.badge || ''}
                            onChange={(e) => handleInputChange('badge', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">无徽章</option>
                            <option value="HOT">🔥 热销</option>
                            <option value="NEW">✨ 新品</option>
                            <option value="STAFF_PICK">⭐ 推荐</option>
                        </select>
                        <p className="text-xs text-gray-500 mt-1">显示在产品卡片上的标签</p>
                    </div>
                </div>

                {/* 价格与库存 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">原价 (USD) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            value={product.originalPrice || ''}
                            onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            placeholder="输入原价"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">现价 (USD) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            value={product.currentPrice || ''}
                            onChange={(e) => handleInputChange('currentPrice', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-semibold text-blue-600"
                            placeholder="输入现价"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">总库存</label>
                        <input
                            type="number"
                            value={product.stock || ''}
                            onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
                            readOnly
                            title="请在SKU管理中修改库存"
                        />
                        <p className="text-xs text-gray-500 mt-1">由SKU库存汇总</p>
                    </div>
                </div>

                {/* 描述 - MDEditor */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">产品描述</label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <div data-color-mode="light">
                            <MDEditor
                                value={product.description || ''}
                                onChange={(value) => handleInputChange('description', value || '')}
                                height={400}
                                preview="edit"
                                textareaProps={{
                                    placeholder: '请输入产品详细描述...'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}