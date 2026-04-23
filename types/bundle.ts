// types/bundle.ts

// 套装内商品简要信息（用于推荐列表）
export interface BundleItemSummary {
    productId: number;
    productName: string;
    productImage: string;  // 商品主图（相对路径）
    productPrice: number;
    quantity: number;
    skuId?: number;  // SKU ID
    skuCode?: string;  // SKU 编码
    color?: string;  // 颜色
}

// 套装简要信息（用于推荐列表）
export interface BundleSummary {
    id: number;
    bundleName: string;
    slug: string;
    subtitle?: string;
    coverImage: string;
    bundlePrice: number;
    originalPrice: number;
    discountRate: number;
    stock: number;
    isFeatured: boolean;
    tags?: string;
    items: BundleItemSummary[];
}

export interface ProductBundleItem {
    id?: number;
    productId: number;
    productName?: string;  // 后端返回的商品名称
    productTitle?: string;  // 兼容字段
    productSlug?: string;
    productImage?: string;  // 后端返回的商品图片（相对路径）
    productPrice?: number;  // 后端返回的商品单价
    quantity: number;
    unitPrice?: number;  // 兼容字段
    skuId?: number;
    isOptional?: boolean;
    sortOrder?: number;
}

export interface ProductBundle {
    id: number;
    bundleName: string;
    slug: string;
    subtitle?: string;
    description?: string;
    coverImage: string;
    images?: string; // JSON array
    bundlePrice: number;
    originalPrice: number;
    discountRate: number;
    stock: number;
    minStockWarning?: number; // 库存预警值
    isFeatured: boolean;
    isActive: boolean;
    sortOrder: number;
    tags?: string;
    giftWrapAvailable: boolean;
    privacyPackaging: boolean;
    items: ProductBundleItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface BundleListResponse {
    content: ProductBundle[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}
