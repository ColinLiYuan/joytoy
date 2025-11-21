// /components/product/product-filters.tsx
'use client';

import { useState } from 'react';

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
        setExpandedGroups(prev => ({
            ...prev,
            [group]: !prev[group]
        }));
    };

    // 处理价格范围选择
    const handlePriceRangeChange = (range: typeof PRICE_RANGES[0]) => {
        const newPriceRange = filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max
            ? null
            : [range.min, range.max] as [number, number];

        onFiltersChange({
            ...filters,
            priceRange: newPriceRange
        });
    };

    // 处理多选筛选条件
    const handleMultiSelectChange = (type: 'colors' | 'features' | 'materials', value: string) => {
        const currentArray = filters[type];
        const newArray = currentArray.includes(value)
            ? currentArray.filter(item => item !== value)
            : [...currentArray, value];

        onFiltersChange({
            ...filters,
            [type]: newArray
        });
    };

    // 箭头图标组件
    const CollapseIcon = ({ isExpanded }: { isExpanded: boolean }) => (
        <span className="flex items-center justify-center w-6 h-6 text-slate-500 transition-all duration-200 group-hover:text-slate-700">
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-0' : 'rotate-180'}`}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        </span>
    );

    return (
        <div className="flex flex-col gap-0 product-filters">
            {/* 价格范围 */}
            <div className="pb-0 mb-0 border-b border-gray-200 last:border-b-0">
                <div
                    className="flex justify-between items-center cursor-pointer py-1.5 mb-2 select-none transition-colors duration-200 rounded group hover:bg-gray-50 px-1"
                    onClick={() => toggleGroup('price')}
                    aria-expanded={expandedGroups.price}
                >
                    <h4 className="flex items-center gap-2 m-0 text-base font-semibold text-gray-800 filter-group-header">
                        Price Range
                    </h4>
                    <CollapseIcon isExpanded={expandedGroups.price} />
                </div>
                {expandedGroups.price && (
                    <div className="flex flex-col gap-1 animate-slideDown">
                        {PRICE_RANGES.map(range => (
                            <div key={range.label} className="flex items-center gap-2 cursor-pointer py-0.5 px-1.5 transition-colors duration-200 rounded hover:bg-slate-50 filter-option">
                                <input
                                    type="radio"
                                    name="priceRange"
                                    value={range.label}
                                    id={`price-${range.label}`}
                                    checked={filters.priceRange?.[0] === range.min && filters.priceRange?.[1] === range.max}
                                    onChange={() => handlePriceRangeChange(range)}
                                    className="w-4 h-4 rounded cursor-pointer transition-all duration-200"
                                />
                                <label
                                    htmlFor={`price-${range.label}`}
                                    className="text-sm text-gray-700 cursor-pointer select-none flex-1"
                                >
                                    ${range.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 特性 */}
            <div className="pb-0 mb-0 border-b border-gray-200 last:border-b-0">
                <div
                    className="flex justify-between items-center cursor-pointer py-1.5 mb-2 select-none transition-colors duration-200 rounded group hover:bg-gray-50 px-1"
                    onClick={() => toggleGroup('features')}
                    aria-expanded={expandedGroups.features}
                >
                    <h4 className="flex items-center gap-2 m-0 text-base font-semibold text-gray-800 filter-group-header">
                        Features
                    </h4>
                    <CollapseIcon isExpanded={expandedGroups.features} />
                </div>
                {expandedGroups.features && (
                    <div className="flex flex-col gap-1 animate-slideDown">
                        {availableFilters.features.map(feature => (
                            <div key={feature} className="flex items-center gap-2 cursor-pointer py-0.5 px-1.5 transition-colors duration-200 rounded hover:bg-slate-50 filter-option">
                                <input
                                    type="checkbox"
                                    name="features"
                                    value={feature}
                                    id={`features-${feature}`}
                                    checked={filters.features.includes(feature)}
                                    onChange={() => handleMultiSelectChange('features', feature)}
                                    className="w-4 h-4 rounded cursor-pointer transition-all duration-200"
                                />
                                <label
                                    htmlFor={`features-${feature}`}
                                    className="text-sm text-gray-700 cursor-pointer select-none flex-1"
                                >
                                    {feature}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 材质 */}
            <div className="pb-0 mb-0 border-b border-gray-200 last:border-b-0">
                <div
                    className="flex justify-between items-center cursor-pointer py-1.5 mb-2 select-none transition-colors duration-200 rounded group hover:bg-gray-50 px-1"
                    onClick={() => toggleGroup('materials')}
                    aria-expanded={expandedGroups.materials}
                >
                    <h4 className="flex items-center gap-2 m-0 text-base font-semibold text-gray-800 filter-group-header">
                        Materials
                    </h4>
                    <CollapseIcon isExpanded={expandedGroups.materials} />
                </div>
                {expandedGroups.materials && (
                    <div className="flex flex-col gap-1 animate-slideDown">
                        {availableFilters.materials.map(material => (
                            <div key={material} className="flex items-center gap-2 cursor-pointer py-0.5 px-1.5 transition-colors duration-200 rounded hover:bg-slate-50 filter-option">
                                <input
                                    type="checkbox"
                                    name="materials"
                                    value={material}
                                    id={`materials-${material}`}
                                    checked={filters.materials.includes(material)}
                                    onChange={() => handleMultiSelectChange('materials', material)}
                                    className="w-4 h-4 rounded cursor-pointer transition-all duration-200"
                                />
                                <label
                                    htmlFor={`materials-${material}`}
                                    className="text-sm text-gray-700 cursor-pointer select-none flex-1"
                                >
                                    {material}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 颜色 */}
            <div className="pb-0 mb-0 border-b border-gray-200 last:border-b-0">
                <div
                    className="flex justify-between items-center cursor-pointer py-1.5 mb-2 select-none transition-colors duration-200 rounded group hover:bg-gray-50 px-1"
                    onClick={() => toggleGroup('colors')}
                    aria-expanded={expandedGroups.colors}
                >
                    <h4 className="flex items-center gap-2 m-0 text-base font-semibold text-gray-800 filter-group-header">
                        Colors
                    </h4>
                    <CollapseIcon isExpanded={expandedGroups.colors} />
                </div>
                {expandedGroups.colors && (
                    <div className="flex flex-col gap-1 animate-slideDown">
                        {availableFilters.colors.map(color => (
                            <div key={color} className="flex items-center gap-2 cursor-pointer py-0.5 px-1.5 transition-colors duration-200 rounded hover:bg-slate-50 filter-option">
                                <input
                                    type="checkbox"
                                    name="colors"
                                    value={color}
                                    id={`colors-${color}`}
                                    checked={filters.colors.includes(color)}
                                    onChange={() => handleMultiSelectChange('colors', color)}
                                    className="w-4 h-4 rounded cursor-pointer transition-all duration-200"
                                />
                                <label
                                    htmlFor={`colors-${color}`}
                                    className="text-sm text-gray-700 cursor-pointer select-none flex-1"
                                >
                                    {color}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}