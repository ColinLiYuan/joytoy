// /toys/[slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ProductResponse, ProductSku } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { getProductImageUrl } from '@/lib/image-utils';
import ProductBreadcrumb from '@/components/product/product-breadcrumb';

// 动态加载重量级组件
const ProductGallery = dynamic(() => import('./ProductGallery'), {
    loading: () => (
        <div className="aspect-[1/1] bg-gray-100 rounded-lg animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Loading images...</div>
        </div>
    ),
    ssr: false
});

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductDetailClientProps {
    product: ProductResponse;
    breadcrumbs: Breadcrumb[];
    galleryImages: any[];
    specifications: any[];
    features: string[];
    description: string;
    defaultColor: string | null;
    colorMap: { [key: string]: string };
}

// 购物车按钮组件 - 独立出来避免重复渲染
const AddToCartButton = ({
                             product,
                             selectedSku,
                             onAddToCart,
                             loading
                         }: {
    product: ProductResponse;
    selectedSku: ProductSku | null;
    onAddToCart: () => void;
    loading: boolean;
}) => {
    const getAvailableStock = (sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    const buttonText = useMemo(() => {
        if (loading) return 'Adding...';
        if (!selectedSku) return 'Select Option';
        if (getAvailableStock(selectedSku) <= 0) return 'Out of Stock';
        return 'Add to Cart';
    }, [loading, selectedSku]);

    const isDisabled = loading || !selectedSku || (selectedSku && getAvailableStock(selectedSku) <= 0);

    return (
        <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 transition-all duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-70"
            onClick={onAddToCart}
            disabled={isDisabled}
        >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3z"/>
            </svg>
            {buttonText}
        </button>
    );
};

// SKU 选择器组件
const SkuSelector = ({
                         productSkus,
                         selectedSku,
                         onSkuSelect,
                         colorMap
                     }: {
    productSkus: ProductSku[];
    selectedSku: ProductSku | null;
    onSkuSelect: (sku: ProductSku) => void;
    colorMap: { [key: string]: string };
}) => {
    const getAvailableStock = (sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    const getMappedColor = (color: string): string => {
        const normalizedColor = color.toLowerCase().trim();
        return colorMap[normalizedColor] || color;
    };

    return (
        <div className="mb-4 p-4 rounded-lg border border-gray-200">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Available Options
            </h3>
            <div className="flex flex-wrap gap-3 w-full">
                {productSkus.map((sku) => {
                    const availableStock = getAvailableStock(sku);
                    const isSelected = selectedSku?.id === sku.id;
                    const isOutOfStock = availableStock <= 0;

                    return (
                        <div
                            key={sku.id}
                            className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                                isSelected
                                    ? 'border-blue-500 bg-blue-50'
                                    : isOutOfStock
                                    ? 'border-gray-300 bg-gray-100 cursor-not-allowed opacity-50'
                                    : 'border-transparent hover:bg-gray-50'
                            }`}
                            onClick={() => !isOutOfStock && onSkuSelect(sku)}
                            title={isOutOfStock ? 'Out of stock' : `Select ${sku.color}`}
                        >
                            <div
                                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md"
                                style={{ backgroundColor: sku.color ? getMappedColor(sku.color) : '#ccc' }}
                                title={sku.color}
                            />
                            <span className="text-xs sm:text-sm font-medium text-gray-600 text-center max-w-16 sm:max-w-20 break-words">
                {sku.color}
              </span>
                            {isOutOfStock ? (
                                <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                            ) : (
                                <span className="text-xs text-green-600 font-medium">
                  Stock: {availableStock}
                </span>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default function ProductDetailClient({
                                                product,
                                                breadcrumbs,
                                                galleryImages,
                                                specifications,
                                                features,
                                                description,
                                                defaultColor,
                                                colorMap
                                            }: ProductDetailClientProps) {
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const { showToast } = useToast();
    const { isLoggedIn, openAuthModal } = useAuth();
    const addItemToCart = useCartStore(state => state.addItemToCart);
    const loading = useCartStore(state => state.loading);

    // 初始化选中的 SKU - 使用 useMemo 优化
    const initialSku = useMemo(() => {
        if (!product.productSkus || product.productSkus.length === 0) return null;

        if (defaultColor) {
            const matchingSku = product.productSkus.find(sku =>
                sku.color?.toLowerCase() === defaultColor.toLowerCase()
            );
            if (matchingSku) return matchingSku;
        }

        return product.productSkus[0];
    }, [product.productSkus, defaultColor]);

    useEffect(() => {
        setSelectedSku(initialSku);
    }, [initialSku]);

    // 处理 SKU 选择
    const handleSkuSelect = (sku: ProductSku) => {
        setSelectedSku(sku);
    };

    // 添加到购物车函数
    const handleAddToCart = async () => {
        if (!product || !selectedSku) return;

        try {
            if (!isLoggedIn) {
                openAuthModal('login', {
                    onSuccess: () => executeAddToCart()
                });
                return;
            }

            await executeAddToCart();
        } catch (error) {
            console.error('Failed to add product to cart:', error);
            showToast('error', 'Add Failed', 'Failed to add product to cart. Please try again.');
        }
    };

    const executeAddToCart = async () => {
        if (!product || !selectedSku) return;

        const availableStock = (selectedSku.stock || 0) - (selectedSku.lockedStock || 0);
        if (availableStock <= 0) {
            showToast('error', 'Out of Stock', 'This product is currently out of stock.');
            return;
        }

        const addToCartRequest = {
            productId: product.id,
            productTitle: product.title,
            productSku: selectedSku.sku,
            productImage: getProductImageUrl(product.baseUrl, product.image),
            unitPrice: product.currentPrice,
            quantity: 1,
            color: selectedSku.color,
            skuId: selectedSku.id
        };

        await addItemToCart(addToCartRequest);

        const colorText = selectedSku.color ? ` (${selectedSku.color})` : '';
        showToast('success', 'Added to Cart', `${product.title}${colorText} has been added to your cart!`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto overflow-x-hidden">
            {/* 面包屑 */}
            <ProductBreadcrumb breadcrumbs={breadcrumbs} />

            {/* 主要内容区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 lg:mb-16 rounded-xl overflow-hidden">
                {/* 相册区域 */}
                <div className="flex flex-col gap-6 w-full overflow-hidden py-6 sm:py-4">
                    <ProductGallery
                        images={galleryImages}
                        productTitle={product.title}
                        baseUrl={product.baseUrl}
                    />

                    {/* 产品描述 */}
                    {description && (
                        <div className="rounded-lg w-full">
                            <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-100">
                                Description
                            </h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line break-words w-full">
                                {description.split('\n').map((paragraph, index) => (
                                    <p key={index} className="mb-3 sm:mb-4 last:mb-0">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* 产品信息区域 */}
                <div className="p-4 sm:p-6 lg:p-8 w-full">
                    {/* 产品标题 */}
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 break-words">
                        {product.title}
                    </h1>

                    {/* 价格区域 */}
                    <div className="flex flex-col gap-4 mb-6 p-4 sm:p-5 rounded-lg w-full">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl lg:text-3xl font-bold text-red-600">
                                ${product.currentPrice}
                            </span>
                            {product.originalPrice > product.currentPrice && (
                                <span className="text-xl text-gray-400 line-through font-normal">
                                    ${product.originalPrice}
                                </span>
                            )}
                        </div>

                        {/* SKU 选择区域 */}
                        {product.productSkus && product.productSkus.length > 0 && (
                            <SkuSelector
                                productSkus={product.productSkus}
                                selectedSku={selectedSku}
                                onSkuSelect={handleSkuSelect}
                                colorMap={colorMap}
                            />
                        )}

                        {/* 添加到购物车按钮 */}
                        <AddToCartButton
                            product={product}
                            selectedSku={selectedSku}
                            onAddToCart={handleAddToCart}
                            loading={loading}
                        />
                    </div>

                    {/* 规格表格 */}
                    {specifications.length > 0 && (
                        <div className="mb-6 p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-100">
                                Specifications
                            </h3>
                            <div className="flex flex-col w-full rounded-lg overflow-hidden">
                                {specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border-b border-gray-200 last:border-b-0"
                                    >
                                        <div className="font-semibold text-gray-700 capitalize break-words flex-shrink-0 w-full sm:w-40 sm:pr-4 mb-1 sm:mb-0">
                                            {spec.specKey?.replace(/_/g, ' ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                                        </div>
                                        <div className="text-gray-900 font-medium break-words flex-1 min-w-0">
                                            {String(spec.specValue || '')}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 产品特性展示 */}
                    {features.length > 0 && (
                        <div className="p-4 sm:p-6 rounded-lg border border-gray-200">
                            <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-100">
                                Product Features
                            </h3>
                            <div className="flex flex-col gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3 py-1 sm:py-2">
                                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 bg-blue-500" />
                                        <span className="text-gray-700 leading-relaxed break-words">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}