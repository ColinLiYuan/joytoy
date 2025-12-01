// /app/admin/products/components/admin-product-specifications.tsx
'use client';

import { PRODUCT_SPECS } from '@/lib/constants/product-options';

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

        updateProduct({ specifications: newSpecs });
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
        <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold text-gray-900">产品规格</h3>
            </div>

            <div className="p-6 space-y-8">
                {/* 材质选择 */}
                <div>
                    <label className="block text-sm font-medium text-gray-900 mb-3">
                        材质 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-wrap gap-3">
                        {PRODUCT_SPECS.materials.map((material) => (
                            <label
                                key={material}
                                className={`inline-flex items-center px-4 py-2 rounded-lg border cursor-pointer transition-all ${
                                    isMaterialChecked(material)
                                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                                        : 'border-gray-200 bg-white hover:border-gray-300'
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    className="hidden"
                                    checked={isMaterialChecked(material)}
                                    onChange={(e) => handleMaterialChange(material, e.target.checked)}
                                />
                                <span className="text-sm font-medium">{material}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 尺寸输入 */}
                <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">物理尺寸</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {['Length', 'Width', 'Diameter', 'Weight'].map((label) => (
                            <div key={label}>
                                <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                    value={getSpecValue(label.toLowerCase())}
                                    onChange={(e) => handleSpecChange(label.toLowerCase(), e.target.value)}
                                    placeholder={label === 'Weight' ? 'e.g. 200g' : 'e.g. 15cm'}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* 功能特性 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">电源类型</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={getSpecValue('power_source')}
                            onChange={(e) => handleSpecChange('power_source', e.target.value)}
                        >
                            <option value="">请选择</option>
                            {PRODUCT_SPECS.powerSources.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">震动强度</label>
                        <select
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                            value={getSpecValue('intensity_level')}
                            onChange={(e) => handleSpecChange('intensity_level', e.target.value)}
                        >
                            <option value="">请选择</option>
                            {PRODUCT_SPECS.intensityLevels.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    );
}