// /components/product/product-filters.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react'; // ✅ Lucide

// ... (Interfaces and PRICE_RANGES keep same)
// 为了节省篇幅，这里只展示修改后的 render 部分，逻辑保持不变

// Predefined price ranges with actual min/max values
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

    // ... Handlers keep same ...
    const handlePriceRangeChange = (range: typeof PRICE_RANGES[0]) => {
        const newPriceRange = filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max
            ? null
            : [range.min, range.max] as [number, number];
        onFiltersChange({ ...filters, priceRange: newPriceRange });
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
            {/* 价格范围 */}
            <div className="border-b border-gray-100 pb-4 mb-2">
                <button
                    className="w-full flex justify-between items-center py-2 group"
                    onClick={() => toggleGroup('price')}
                >
                    <h4 className="font-bold text-gray-900 text-sm">Price Range</h4>
                    <CollapseIcon isExpanded={expandedGroups.price} />
                </button>
                {expandedGroups.price && (
                    <div className="flex flex-col gap-2 mt-2 animate-slideDown">
                        {PRICE_RANGES.map(range => (
                            <label key={range.label} className="flex items-center gap-3 cursor-pointer group">
                                <div className="relative flex items-center">
                                    <input
                                        type="radio"
                                        name="priceRange"
                                        checked={filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max}
                                        onChange={() => handlePriceRangeChange(range)}
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

            {/* 特性 (Features) */}
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

            {/* Materials & Colors (Similar structure) */}
            {/* ... Repeated logic for Materials and Colors using the same styling above ... */}
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