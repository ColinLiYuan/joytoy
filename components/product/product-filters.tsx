// components/product/product-filters.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

// ... (Interface 和 PRICE_RANGES 保持不变) ...
export interface FilterState {
    priceRange: [number, number] | null;
    priceRanges: string[];
    colors: string[];
    features: string[];
    materials: string[];
}

interface ProductFiltersProps {
    filters: {
        priceRange: [number, number] | null;
        colors: string[];
        features: string[];
        materials: string[];
    };
    onFiltersChange: (filters: any) => void;
    availableFilters: {
        colors: string[];
        features: string[];
        materials: string[];
    };
}

const PRICE_RANGES = [
    { label: '0-19.99', min: 0, max: 19.99 },
    { label: '20-39.99', min: 20, max: 39.99 },
    { label: '40-59.99', min: 40, max: 59.99 },
    { label: '60-79.99', min: 60, max: 79.99 },
    { label: '80 And Up', min: 80, max: 10000 }
];

export default function ProductFilters({ filters, onFiltersChange, availableFilters }: ProductFiltersProps) {
    const [expandedGroups, setExpandedGroups] = useState({
        price: true,
        features: true,
        materials: false,
        colors: false
    });

    const toggleGroup = (group: keyof typeof expandedGroups) => {
        setExpandedGroups(prev => ({ ...prev, [group]: !prev[group] }));
    };

    // ✅ 修复：逻辑保持不变，用来判断是否反选
    const handlePriceRangeChange = (range: typeof PRICE_RANGES[0]) => {
        const isSelected = filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max;

        onFiltersChange({
            ...filters,
            // 如果已经是选中的，这就设为 null (取消)，否则设为新值
            priceRange: isSelected ? null : [range.min, range.max]
        });
    };

    const handleMultiSelectChange = (type: 'colors' | 'features' | 'materials', value: string) => {
        const currentArray = filters[type];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];
        onFiltersChange({ ...filters, [type]: newArray });
    };

    const CollapseIcon = ({ isExpanded }: { isExpanded: boolean }) => (
        <span className={`text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
            <ChevronDown size={18} />
        </span>
    );

    return (
        <div className="flex flex-col gap-2 product-filters">
            {/* Price Range */}
            <div className="border-b border-gray-100 pb-4 mb-2">
                <button className="w-full flex justify-between items-center py-2 group" onClick={() => toggleGroup('price')}>
                    <h4 className="font-bold text-gray-900 text-sm">Price Range</h4>
                    <CollapseIcon isExpanded={expandedGroups.price} />
                </button>
                {expandedGroups.price && (
                    <div className="flex flex-col gap-2 mt-2 animate-slideDown">
                        {PRICE_RANGES.map(range => (
                            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    {/* ✅ 关键修改：使用 onClick 替代 onChange */}
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        checked={filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max}
                                        onClick={() => handlePriceRangeChange(range)}
                                        onChange={() => {}} // 必须加个空的 onChange 以避免 React 警告
                                        className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-black checked:bg-black transition-all"
                                    />
                                    <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                                        <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                    </div>
                                </div>
                                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">${range.label}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Features (Checkbox 逻辑本来就是对的，保持不变) */}
            <div className="border-b border-gray-100 pb-4 mb-2">
                <button className="w-full flex justify-between items-center py-2 group" onClick={() => toggleGroup('features')}>
                    <h4 className="font-bold text-gray-900 text-sm">Features</h4>
                    <CollapseIcon isExpanded={expandedGroups.features} />
                </button>
                {expandedGroups.features && (
                    <div className="flex flex-col gap-2 mt-2 animate-slideDown">
                        {availableFilters.features.map(feature => (
                            <label key={feature} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.features.includes(feature)}
                                    onChange={() => handleMultiSelectChange('features', feature)}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{feature}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Materials */}
            <div className="border-b border-gray-100 pb-4 mb-2">
                <button className="w-full flex justify-between items-center py-2 group" onClick={() => toggleGroup('materials')}>
                    <h4 className="font-bold text-gray-900 text-sm">Materials</h4>
                    <CollapseIcon isExpanded={expandedGroups.materials} />
                </button>
                {expandedGroups.materials && (
                    <div className="flex flex-col gap-2 mt-2 animate-slideDown">
                        {availableFilters.materials.map(material => (
                            <label key={material} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.materials.includes(material)}
                                    onChange={() => handleMultiSelectChange('materials', material)}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{material}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Colors */}
            <div className="border-b border-gray-100 pb-4 mb-2">
                <button className="w-full flex justify-between items-center py-2 group" onClick={() => toggleGroup('colors')}>
                    <h4 className="font-bold text-gray-900 text-sm">Colors</h4>
                    <CollapseIcon isExpanded={expandedGroups.colors} />
                </button>
                {expandedGroups.colors && (
                    <div className="flex flex-col gap-2 mt-2 animate-slideDown">
                        {availableFilters.colors.map(color => (
                            <label key={color} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.colors.includes(color)}
                                    onChange={() => handleMultiSelectChange('colors', color)}
                                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-black focus:ring-black"
                                />
                                <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{color}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}