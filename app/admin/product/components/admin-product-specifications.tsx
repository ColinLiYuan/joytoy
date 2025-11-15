// /app/admin/products/admin-product-specifications.tsx
'use client';

interface ProductSpecification {
    id?: number;
    specKey: string;
    specValue: string;
}

interface Product {
    id?: number;
    specifications?: ProductSpecification[];
}

interface SpecificationsProps {
    product: Product;
    updateProduct: (updates: Partial<Product>) => void;
}

const PRODUCT_CONFIG = {
    materials: ["Body-Safe Silicone", "TPE", "ABS Plastic", "Stainless Steel", "Glass"],
    powerSources: ["Battery Powered", "USB Rechargeable", "Plug-in", "Manual", "Wireless Charging"],
    intensityLevels: ["Gentle", "Moderate", "Powerful", "Intense"]
};

export default function Specifications({ product, updateProduct }: SpecificationsProps) {
    const getSpecValue = (key: string): string => {
        if (!product.specifications) return '';
        const spec = product.specifications.find(s => s.specKey === key);
        return spec ? spec.specValue : '';
    };

    const handleSpecChange = (key: string, value: string) => {
        const currentSpecs = product.specifications || [];
        const existingIndex = currentSpecs.findIndex(s => s.specKey === key);

        let newSpecs: ProductSpecification[];

        if (existingIndex >= 0) {
            newSpecs = [...currentSpecs];
            newSpecs[existingIndex] = { ...newSpecs[existingIndex], specValue: value };
        } else {
            newSpecs = [...currentSpecs, { specKey: key, specValue: value }];
        }

        updateProduct({
            specifications: newSpecs
        });
    };

    const handleMaterialChange = (material: string, checked: boolean) => {
        const currentMaterials = getSpecValue('material').split(',').filter(Boolean);
        let newMaterials: string[];

        if (checked) {
            newMaterials = [...currentMaterials, material];
        } else {
            newMaterials = currentMaterials.filter(m => m !== material);
        }

        handleSpecChange('material', newMaterials.join(','));
    };

    const isMaterialChecked = (material: string): boolean => {
        const materials = getSpecValue('material').split(',').filter(Boolean);
        return materials.includes(material);
    };

    return (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    产品规格
                </h3>
            </div>

            <div className="p-6 space-y-8">
                {/* 材质选择 */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-900">
                        材质 <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {PRODUCT_CONFIG.materials.map((material) => (
                            <label
                                key={material}
                                className={`relative flex items-start p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                    isMaterialChecked(material)
                                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-center h-5">
                                    <input
                                        type="checkbox"
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        checked={isMaterialChecked(material)}
                                        onChange={(e) => handleMaterialChange(material, e.target.checked)}
                                    />
                                </div>
                                <span className="ml-3 text-sm font-medium text-gray-900">
                  {material}
                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 尺寸规格 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                        尺寸规格
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                            <label htmlFor="spec_length" className="block text-sm font-medium text-gray-700 mb-2">
                                长度
                            </label>
                            <input
                                type="text"
                                id="spec_length"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={getSpecValue('length')}
                                onChange={(e) => handleSpecChange('length', e.target.value)}
                                placeholder="6 inches"
                            />
                        </div>
                        <div>
                            <label htmlFor="spec_width" className="block text-sm font-medium text-gray-700 mb-2">
                                宽度
                            </label>
                            <input
                                type="text"
                                id="spec_width"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={getSpecValue('width')}
                                onChange={(e) => handleSpecChange('width', e.target.value)}
                                placeholder="1.5 inches"
                            />
                        </div>
                        <div>
                            <label htmlFor="spec_diameter" className="block text-sm font-medium text-gray-700 mb-2">
                                直径
                            </label>
                            <input
                                type="text"
                                id="spec_diameter"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={getSpecValue('diameter')}
                                onChange={(e) => handleSpecChange('diameter', e.target.value)}
                                placeholder="1.5 inches"
                            />
                        </div>
                        <div>
                            <label htmlFor="spec_weight" className="block text-sm font-medium text-gray-700 mb-2">
                                重量
                            </label>
                            <input
                                type="text"
                                id="spec_weight"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                value={getSpecValue('weight')}
                                onChange={(e) => handleSpecChange('weight', e.target.value)}
                                placeholder="0.5 lbs"
                            />
                        </div>
                    </div>
                </div>

                {/* 功能特性 */}
                <div className="space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        功能特性
                    </h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="spec_power" className="block text-sm font-medium text-gray-700 mb-2">
                                电源类型
                            </label>
                            <select
                                id="spec_power"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                value={getSpecValue('power_source')}
                                onChange={(e) => handleSpecChange('power_source', e.target.value)}
                            >
                                <option value="">选择电源类型</option>
                                {PRODUCT_CONFIG.powerSources.map((powerSource) => (
                                    <option key={powerSource} value={powerSource}>
                                        {powerSource}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="spec_intensity" className="block text-sm font-medium text-gray-700 mb-2">
                                强度级别
                            </label>
                            <select
                                id="spec_intensity"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                                value={getSpecValue('intensity_level')}
                                onChange={(e) => handleSpecChange('intensity_level', e.target.value)}
                            >
                                <option value="">选择强度级别</option>
                                {PRODUCT_CONFIG.intensityLevels.map((intensity) => (
                                    <option key={intensity} value={intensity}>
                                        {intensity}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}