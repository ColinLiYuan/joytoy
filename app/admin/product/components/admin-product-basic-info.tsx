// /app/admin/products/components/admin-product-basic-info.tsx
'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic'; // 新增
import { VENDORS, COLOR_GROUPS_PRESET } from '@/lib/constants/product-options';
import { getMappedColor, getColorDisplayText } from '@/lib/constants/color-map';

// 动态导入 MD 编辑器，避免 SSR 问题
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
        // 清理颜色名称（去空格、标准化）
        const cleanColor = color.trim();

        const newColors = checked
            ? [...currentColors, cleanColor]
            : currentColors.filter((c: string) => c !== cleanColor);

        updateProduct({ colors: newColors });
    };

    const addCustomColor = () => {
        if (!customColor.trim()) return;

        const newColor = customColor.trim();
        // 首字母大写优化
        const formattedColor = newColor.charAt(0).toUpperCase() + newColor.slice(1);

        if (!product.colors?.includes(formattedColor)) {
            const newColors = [...(product.colors || []), formattedColor];
            updateProduct({ colors: newColors });
        }
        setCustomColor('');
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

                {/* 颜色选择区域 - 增强版 */}
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
                                className="px-2 py-1 text-sm border border-gray-300 rounded w-32"
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
                                        className="w-3 h-3 rounded-full mr-1.5 border border-black/10"
                                        style={{ backgroundColor: getMappedColor(color) }}
                                    ></span>
                                    {getColorDisplayText(color)}
                                    <button
                                        type="button"
                                        onClick={() => handleColorChange(color, false)}
                                        className="ml-1.5 text-blue-400 hover:text-blue-900"
                                    >×</button>
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                        {Object.entries(COLOR_GROUPS_PRESET).map(([groupName, colors]) => (
                            <div key={groupName}>
                                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{groupName}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {colors.map((color: string) => (
                                        <label
                                            key={color}
                                            className={`inline-flex items-center px-3 py-1.5 border rounded cursor-pointer transition-all select-none ${
                                                product.colors?.includes(color)
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={product.colors?.includes(color) || false}
                                                onChange={(e) => handleColorChange(color, e.target.checked)}
                                            />
                                            {/* 颜色预览圆点 */}
                                            <span
                                                className={`w-3 h-3 rounded-full mr-2 border ${
                                                    product.colors?.includes(color) ? 'border-white/50' : 'border-black/10'
                                                }`}
                                                style={{ backgroundColor: getMappedColor(color) }}
                                            ></span>
                                            <span className="text-xs font-medium">{color}</span>
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

                {/* 描述 - 替换为 MDEditor */}
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