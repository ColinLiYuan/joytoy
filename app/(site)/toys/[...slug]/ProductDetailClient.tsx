// /toys/[slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductResponse, ProductSku } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import ProductGallery from './productGallery';
import { getProductImageUrl } from '@/lib/image-utils';
import ProductBreadcrumb from '@/components/product/product-breadcrumb'; // 导入新组件

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

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
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const { showToast } = useToast();
    const { isLoggedIn, openAuthModal, userInfo } = useAuth();

    // 使用 Zustand store
    const addItemToCart = useCartStore(state => state.addItemToCart);
    const loading = useCartStore(state => state.loading);

    // 初始化选中的 SKU
    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            // 如果有默认颜色，尝试找到对应的 SKU
            if (defaultColor) {
                const matchingSku = product.productSkus.find(sku =>
                    sku.color?.toLowerCase() === defaultColor.toLowerCase()
                );
                if (matchingSku) {
                    setSelectedSku(matchingSku);
                    return;
                }
            }
            // 否则选择第一个 SKU
            setSelectedSku(product.productSkus[0]);
        }
    }, [product.productSkus, defaultColor]);

    // 获取映射后的颜色值
    const getMappedColor = (color: string): string => {
        const normalizedColor = color.toLowerCase().trim();
        return colorMap[normalizedColor] || color;
    };

    // 获取可用库存
    const getAvailableStock = (sku: ProductSku): number => {
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    // 处理 SKU 选择
    const handleSkuSelect = (sku: ProductSku) => {
        setSelectedSku(sku);
    };

    // 添加到购物车函数
    const handleAddToCart = async () => {
        if (!product || !selectedSku) return;

        try {
            setAddingToCart(true);

            // 已登录，直接添加到购物车
            await executeAddToCart();

        } catch (error) {
            console.error('Failed to add product to cart:', error);
            showToast('error', 'Add Failed', 'Failed to add product to cart. Please try again.');
        } finally {
            setAddingToCart(false);
        }
    };

    const executeAddToCart = async () => {
        if (!product || !selectedSku) return;

        // 检查库存
        const availableStock = getAvailableStock(selectedSku);
        if (availableStock <= 0) {
            showToast('error', 'Out of Stock', 'This product is currently out of stock.');
            return;
        }

        // 构建符合后端要求的请求对象，使用 SKU 信息
        const addToCartRequest = {
            productId: product.id,
            productTitle: product.title,
            productSku: selectedSku.sku, // 使用选中的 SKU
            productImage: getProductImageUrl(product.baseUrl, product.image),
            unitPrice: product.currentPrice,
            quantity: 1,
            color: selectedSku.color,
            skuId: selectedSku.id
        };

        // 使用 Zustand store 添加商品
        await addItemToCart(addToCartRequest);

        // 显示成功提示
        const colorText = selectedSku.color ? ` (${selectedSku.color})` : '';
        showToast('success', 'Added to Cart', `${product.title}${colorText} has been added to your cart!`);
    };

    return (
        <div className="w-full max-w-7xl mx-auto overflow-x-hidden">
            {/* 使用独立的 ProductBreadcrumb 组件 */}
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
                        <div className="rounded-lg w-full product-detail-section">
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
                    <div className="flex flex-col gap-4 mb-6 p-4 sm:p-5 rounded-lg w-full product-detail-section">
                        <div className="flex items-center gap-3 mb-3">
                            <span className="text-2xl lg:text-3xl font-bold text-red-600 font-inter tracking-tight">
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
                            <div className="mb-4 p-4 rounded-lg border border-gray-200 product-detail-section">
                                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                                    Available Options
                                </h3>
                                <div className="flex flex-wrap gap-3 w-full">
                                    {product.productSkus.map((sku, index) => {
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
                                                onClick={() => !isOutOfStock && handleSkuSelect(sku)}
                                                title={isOutOfStock ? 'Out of stock' : `Select ${sku.color}`}
                                            >
                                                <div
                                                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-md transition-all duration-300"
                                                    style={{ backgroundColor: sku.color ? getMappedColor(sku.color) : '#ccc' }}
                                                    title={sku.color}
                                                />
                                                <span className="text-xs sm:text-sm font-medium text-gray-600 text-center max-w-16 sm:max-w-20 break-words">
                                                    {sku.color}
                                                </span>
                                                {isOutOfStock && (
                                                    <span className="text-xs text-red-500 font-medium">Out of Stock</span>
                                                )}
                                                {!isOutOfStock && (
                                                    <span className="text-xs text-green-600 font-medium">
                                                        Stock: {availableStock}
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedSku && (
                                    <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-700">
                                        <div className="flex flex-wrap gap-4">
                                            <div>
                                                Selected: <strong>{selectedSku.color}</strong>
                                            </div>
                                            <div>
                                                SKU: <strong>{selectedSku.sku}</strong>
                                            </div>
                                            <div>
                                                Available: <strong>{getAvailableStock(selectedSku)}</strong>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 添加到购物车按钮 */}
                        <div className="w-full">
                            <button
                                className="w-full product-detail-button text-white py-3 sm:py-4 px-6 rounded-lg font-semibold flex items-center justify-center gap-3 hover:shadow-lg shadow-blue-500/30 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none disabled:opacity-70"
                                onClick={handleAddToCart}
                                disabled={addingToCart || loading || !selectedSku || getAvailableStock(selectedSku) <= 0}
                            >
                                <FontAwesomeIcon icon={faCartPlus} />
                                {addingToCart || loading ? 'Adding...' :
                                    !selectedSku ? 'Select Option' :
                                        getAvailableStock(selectedSku) <= 0 ? 'Out of Stock' : 'Add to Cart'
                                }
                            </button>
                        </div>
                    </div>

                    {/* 规格表格 */}
                    {specifications.length > 0 && (
                        <div className="mb-6 p-4 sm:p-6 rounded-lg shadow-sm w-full specifications-container">
                            <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-100">
                                Specifications
                            </h3>
                            <div className="flex flex-col w-full rounded-lg overflow-hidden">
                                {specifications.map((spec, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col sm:flex-row sm:items-center p-3 sm:p-4 border-b border-gray-200 specification-item last:border-b-0"
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
                        <div className="p-4 sm:p-6 rounded-lg shadow-sm w-full product-detail-section">
                            <h3 className="mb-4 sm:mb-5 text-lg sm:text-xl font-semibold text-gray-900 pb-3 border-b-2 border-gray-100">
                                Product Features
                            </h3>
                            <div className="flex flex-col gap-3">
                                {features.map((feature, index) => (
                                    <div key={index} className="flex items-start gap-3 py-1 sm:py-2">
                                        <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0 feature-bullet" />
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