// types/adminProduct.ts

export interface Gallery {
    url: string;
    alt?: string;
}

export interface ProductSku {
    sku: string;
    color: string;
    stock: number;
    lockedStock?: number;
    availableStock?: number;
}

export interface ProductSpecification {
    id?: number;
    specKey: string;
    specValue: string;
}


export interface ReleaseProductRequest {
    id?: number;
    badge?: string;
    brand?: string;
    image?: string;
    alt?: string;
    slug?: string;
    sourceTitle?: string;
    sourceVendor?: string;
    title?: string;
    name?: string; // 商品名称
    description?: string;
    stock?: number;
    lockedStock?: number;
    status: string;
    purchasePrice?: number;
    currentPrice?: number;
    originalPrice?: number;
    minOrder?: string;
    boxContents?: string;
    highlightData?: string;

    galleries?: Gallery[];
    specifications?: ProductSpecification[];
    colors?: string[];
    categories?: string[];
    features?: string[];
    productSkus?: ProductSku[];
}

export interface AdminProductResponse {
    id?: number;
    badge?: string;
    brand?: string;
    image?: string;
    alt?: string;
    slug?: string;
    sourceTitle?: string;
    sourceVendor?: string;
    title?: string;
    name?: string; // 商品名称
    description?: string;
    stock?: number;
    lockedStock?: number;
    purchasePrice?: number;
    currentPrice?: number;
    originalPrice?: number;
    minOrder?: string;
    boxContents?: string;
    highlightData?: string;

    galleries?: Gallery[];
    specifications?: ProductSpecification[];
    colors?: string[];
    categories?: string[];
    features?: string[];
    productSkus?: ProductSku[];

    baseUrl: string;
    status: string;
}