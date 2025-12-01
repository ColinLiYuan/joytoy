// /app/admin/product/components/admin-product-features.tsx
'use client';

import { useState, useEffect } from 'react';

interface Product {
    features?: string[];
}

interface ProductFeature {
    keyWord: string;
    marketingWords: string[];
}

interface FeaturesProps {
    product: Product;
    updateProduct: (updates: Partial<Product>) => void;
}

// 产品特点常量（层级结构）
const PRODUCT_FEATURES: ProductFeature[] = [
    {
        keyWord: "Quiet",
        marketingWords: [
            "Whisper-Quiet Operation",
            "Discreet & Silent Pleasure",
            "Undisturbed Privacy",
            "Library-Quiet Technology"
        ]
    },
    {
        keyWord: "Vibrating",
        marketingWords: [
            "Powerful Rumbling Vibration",
            "Multiple Vibration Modes",
            "Sonic-Pulse Technology",
            "Deep, Rippling Waves"
        ]
    },
    {
        keyWord: "Waterproof",
        marketingWords: [
            "Fully Waterproof Design",
            "Enjoy in the Shower or Bath",
            "Easy-Clean & Waterproof",
            "Unleash Wet & Wild Adventures"
        ]
    },
    {
        keyWord: "Thrusting",
        marketingWords: [
            "Realistic Thrusting Motion",
            "Deep, Penetrating Pulsations",
            "Come-Hither Thrusting",
            "Rhythmic Thrusting Patterns"
        ]
    },
    {
        keyWord: "Suction",
        marketingWords: [
            "Award-Winning Suction Sensation",
            "Pleasure Air Pulse Technology",
            "Gentle yet Intense Suction",
            "Wave-Like Sucking Motions"
        ]
    },
    {
        keyWord: "Licking",
        marketingWords: [
            "Tongue-Like Flickering Licks",
            "Teasing & Tantalizing Flicks",
            "Soothing Licking Sensation",
            "Rapid-Fire Licking Motions"
        ]
    },
    {
        keyWord: "Tapping",
        marketingWords: [
            "Rhythmic Tapping Pleasure",
            "Gentle Pulsating Taps",
            "Targeted Percussion Therapy",
            "Stimulating Patting Motions"
        ]
    },
    {
        keyWord: "Body-Safe",
        marketingWords: [
            "Premium Body-Safe Silicone",
            "Hypoallergenic & Safe",
            "Your Safety, Our Priority",
            "Certified Skin-Safe Material"
        ]
    },
    {
        keyWord: "Hands-Free",
        marketingWords: [
            "Explore Hands-Free Ecstasy",
            "True Hands-Free Freedom",
            "Wearable & Hands-Free Design",
            "Let the Toy Do All the Work"
        ]
    },
    {
        keyWord: "Realistic",
        marketingWords: [
            "Incredibly Realistic Feel",
            "Life-Like Textured Design",
            "Ergonomic & Realistic Shape",
            "Authentic Skin-Like Material"
        ]
    }
];

export default function Features({ product, updateProduct }: FeaturesProps) {
    const [selectedFeatures, setSelectedFeatures] = useState<Set<string>>(new Set());
    const [indeterminateStates, setIndeterminateStates] = useState<Map<string, boolean>>(new Map());

    useEffect(() => {
        // 初始化已选择的特点
        if (product.features) {
            setSelectedFeatures(new Set(product.features));
        }
    }, [product.features]);

    useEffect(() => {
        // 更新 indeterminate 状态
        const newIndeterminateStates = new Map<string, boolean>();

        PRODUCT_FEATURES.forEach(feature => {
            const childFeatures = feature.marketingWords;
            const selectedChildren = childFeatures.filter(child => selectedFeatures.has(child));

            if (selectedChildren.length > 0 && selectedChildren.length < childFeatures.length) {
                newIndeterminateStates.set(feature.keyWord, true);
            } else {
                newIndeterminateStates.set(feature.keyWord, false);
            }
        });

        setIndeterminateStates(newIndeterminateStates);
    }, [selectedFeatures]);

    const updateSelectedFeatures = (newFeatures: Set<string>) => {
        setSelectedFeatures(newFeatures);
        updateProduct({ features: Array.from(newFeatures) });
    };

    const handleRootFeatureChange = (featureRoot: ProductFeature, checked: boolean) => {
        const newFeatures = new Set(selectedFeatures);

        if (checked) {
            // 选择根节点时，添加所有子节点
            newFeatures.add(featureRoot.keyWord);
            featureRoot.marketingWords.forEach(child => newFeatures.add(child));
        } else {
            // 取消选择根节点时，移除所有子节点
            newFeatures.delete(featureRoot.keyWord);
            featureRoot.marketingWords.forEach(child => newFeatures.delete(child));
        }

        updateSelectedFeatures(newFeatures);
    };

    const handleChildFeatureChange = (featureRoot: ProductFeature, childFeature: string, checked: boolean) => {
        const newFeatures = new Set(selectedFeatures);

        if (checked) {
            newFeatures.add(childFeature);
        } else {
            newFeatures.delete(childFeature);
        }

        // 更新根节点状态
        const allChildrenSelected = featureRoot.marketingWords.every(child => newFeatures.has(child));
        const someChildrenSelected = featureRoot.marketingWords.some(child => newFeatures.has(child));

        if (allChildrenSelected) {
            newFeatures.add(featureRoot.keyWord);
        } else {
            newFeatures.delete(featureRoot.keyWord);
        }

        updateSelectedFeatures(newFeatures);
    };

    const removeFeature = (feature: string) => {
        const newFeatures = new Set(selectedFeatures);
        newFeatures.delete(feature);

        // 如果是子节点被移除，需要检查根节点状态
        PRODUCT_FEATURES.forEach(featureRoot => {
            if (featureRoot.marketingWords.includes(feature)) {
                const remainingChildren = featureRoot.marketingWords.filter(child => newFeatures.has(child));
                if (remainingChildren.length === 0) {
                    newFeatures.delete(featureRoot.keyWord);
                }
            }
        });

        updateSelectedFeatures(newFeatures);
    };

    const isRootChecked = (featureRoot: ProductFeature): boolean => {
        return selectedFeatures.has(featureRoot.keyWord);
    };

    const isChildChecked = (childFeature: string): boolean => {
        return selectedFeatures.has(childFeature);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">产品特点</h3>
            </div>
            <div className="p-6 space-y-6">
                {/* 特点选择区域 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        选择产品特点
                    </label>
                    <div className="max-h-80 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50 space-y-4">
                        {PRODUCT_FEATURES.map((featureRoot) => (
                            <div key={featureRoot.keyWord} className="space-y-2">
                                {/* 根节点 */}
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`root_${featureRoot.keyWord}`}
                                        checked={isRootChecked(featureRoot)}
                                        ref={(el) => {
                                            if (el) {
                                                el.indeterminate = indeterminateStates.get(featureRoot.keyWord) || false;
                                            }
                                        }}
                                        onChange={(e) => handleRootFeatureChange(featureRoot, e.target.checked)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label
                                        htmlFor={`root_${featureRoot.keyWord}`}
                                        className="ml-2 text-sm font-medium text-gray-900 cursor-pointer select-none"
                                    >
                                        {featureRoot.keyWord}
                                    </label>
                                </div>

                                {/* 子节点 */}
                                <div className="ml-6 space-y-1">
                                    {featureRoot.marketingWords.map((childFeature) => (
                                        <div key={childFeature} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id={`child_${childFeature}`}
                                                checked={isChildChecked(childFeature)}
                                                onChange={(e) => handleChildFeatureChange(featureRoot, childFeature, e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label
                                                htmlFor={`child_${childFeature}`}
                                                className="ml-2 text-sm text-gray-700 cursor-pointer select-none"
                                            >
                                                {childFeature}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 已选择的特点 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        已选择的特点 ({selectedFeatures.size})
                    </label>
                    <div className="min-h-24 max-h-48 overflow-y-auto p-4 border border-gray-200 rounded-lg bg-gray-50">
                        {selectedFeatures.size === 0 ? (
                            <div className="text-gray-500 text-sm text-center py-4">
                                暂无选择的特点
                            </div>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {Array.from(selectedFeatures).map((feature) => (
                                    <div
                                        key={feature}
                                        className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-sm border border-blue-200"
                                    >
                                        <span>{feature}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(feature)}
                                            className="w-4 h-4 rounded-full bg-blue-200 hover:bg-blue-300 text-blue-700 flex items-center justify-center text-xs transition-colors"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}