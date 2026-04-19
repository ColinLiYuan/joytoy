// types/product.ts

export interface ProductResponse {
    id: number;
    slug: string;
    title: string;
    name: string;
    sourceVendor?: string;
    colors?: string[];
    categories?: string[];
    originalPrice: number;
    currentPrice: number;
    minOrder: string;
    description: string;
    image: string;
    stock: number;
    galleries?: Array<{
        url: string;
        alt?: string;
        type?: 'image' | 'video';
        poster?: string;
    }>;
    // 更新规格类型
    specifications?: Array<{
        specKey: string;
        specValue: string;
    }>;
    boxContents?: string;
    highlightData?: string;
    features?: string[];
    favorited?: boolean;
    color?: string;
    // 新增 SKU 相关字段
    productSkus?: ProductSku[];
    sku?: string;
    badge?: string;
    brand?: string;
    alt?: string;
    rating?: number;
    reviewCount?: number;
    status?: string;
}

export interface ProductListResponse {
    content: ProductResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface ProductSku {
    id: number;
    sku: string;
    color: string;
    stock: number;
    lockedStock: number;
}

export interface HighlightData {
    title: string;
    body: string;
    image: string;
    imageBox: string;
    imageTail: string;
}