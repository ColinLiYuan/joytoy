// /app/admin/products/components/admin-product-basic-info.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { VENDORS } from '@/lib/constants/product-options';
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
                {/* 第一行：供应商、源标题、标题 */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-3">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            供应商 <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={product.sourceVendor || ''}
                            onChange={(e) => handleInputChange('sourceVendor', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">请选择供应商</option>
                            {VENDORS.map((vendor) => (
                                <option key={vendor} value={vendor}>{vendor}</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            源标题 (内部参考)
                        </label>
                        <input
                            type="text"
                            value={product.sourceTitle || ''}
                            onChange={(e) => handleInputChange('sourceTitle', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="工厂原始标题..."
                        />
                    </div>

                    <div className="md:col-span-5">
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

                {/* 第二行：产品名称 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            产品名称 (中文/自定义名称)
                        </label>
                        <input
                            type="text"
                            value={product.name || ''}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="输入产品的中文名称或自定义名称..."
                        />
                        <p className="text-xs text-gray-500 mt-1">用于内部管理或显示在特定位置的产品名称</p>
                    </div>
                </div>

                {/* 颜色选择区域 - 升级版 (使用 COLOR_SYSTEM) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-medium text-gray-700">颜色变体</label>

                        {/* 自定义颜色添加器 */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={customColor}
                                onChange={(e) => setCustomColor(e.target.value)}
                                placeholder="输入特殊颜色..."
                                className="px-2 py-1 text-sm border border-gray-300 rounded w-32 focus:outline-none focus:border-blue-500"
                                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomColor())}
                            />
                            <button
                                type="button"
                                onClick={addCustomColor}
                                className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs rounded hover:bg-gray-100"
                            >
                                添加
                            </button>
                        </div>
                    </div>

                    {/* 已选颜色预览 */}
                    {product.colors && product.colors.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white rounded border border-gray-100">
                            {product.colors.map((color: string) => (
                                <span key={color} className="inline-flex items-center px-2 py-1 rounded-full text-xs border bg-blue-50 text-blue-700 border-blue-200">
                                    <span
                                        className="w-3 h-3 rounded-full mr-1.5 border border-black/10 shadow-sm"
                                        style={{ backgroundColor: getPreviewHex(color) }}
                                    ></span>
                                    {color}
                                    <button
                                        type="button"
                                        onClick={() => handleColorChange(color, false)}
                                        className="ml-1.5 text-blue-400 hover:text-blue-900 font-bold"
                                    >×</button>
                                </span>
                            ))}
                        </div>
                    )}

                    {/* 颜色分组选择器 */}
                    <div className="space-y-5 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {Object.entries(COLOR_SYSTEM).map(([groupName, groupData]) => (
                            <div key={groupName} className="border-b border-gray-200 pb-3 last:border-0 last:pb-0">
                                {/* 分组标题 */}
                                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full border border-gray-300 shadow-sm"
                                        style={{backgroundColor: groupData.hex}}
                                    ></span>
                                    {groupName} 系
                                </h4>

                                {/* 变体选项 */}
                                <div className="flex flex-wrap gap-2 ml-1">
                                    {Object.entries(groupData.variants).map(([variantName, hexVal]) => (
                                        <label
                                            key={variantName}
                                            className={`inline-flex items-center px-3 py-1.5 border rounded-full cursor-pointer transition-all select-none text-xs ${
                                                product.colors?.includes(variantName)
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                                                    : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={product.colors?.includes(variantName) || false}
                                                onChange={(e) => handleColorChange(variantName, e.target.checked)}
                                            />
                                            {/* 颜色预览圆点 */}
                                            <span
                                                className={`w-2.5 h-2.5 rounded-full mr-1.5 border ${
                                                    product.colors?.includes(variantName) ? 'border-white/50' : 'border-black/10'
                                                }`}
                                                style={{ backgroundColor: hexVal }}
                                            ></span>
                                            <span className="font-medium">{variantName}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 价格与库存 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">采购价 (CNY)</label>
                        <input
                            type="number"
                            step="0.01"
                            value={product.purchasePrice || ''}
                            onChange={(e) => handleInputChange('purchasePrice', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">原价 (USD) <span className="text-red-500">*</span></label>
                        <input
                            type="number"
                            step="0.01"
                            value={product.originalPrice || ''}
                            onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
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