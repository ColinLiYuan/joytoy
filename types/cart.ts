export interface AddToCartRequest {
    productId: number;
    productSlug: string;
    productTitle: string;     // 新增字段
    productName: string;
    skuId?: number;
    productSku: string;       // 新增字段
    productImage: string;     // 新增字段
    unitPrice: number;        // 改为 unitPrice
    quantity: number;
    color: string;        // 新增可选字段
    length?: string;           // 新增可选字段
    width?: string;
    weight?: string;         // 新增可选字段
}

export interface CartResponse {
    id: number;  // Cart的主键
    cartToken?: string;
    userId?: number | null;
    userName?: string;  // 新增：用户名
    userEmail?: string;  // 新增：用户邮箱
    itemCount?: number;  // 新增：商品数量（去重后的SKU数）
    sessionId?: string | null;
    status?: string;
    totalItems: number;
    subtotalAmount?: number;
    totalAmount: number;
    discountAmount?: number;
    currency?: string;
    items: CartItem[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CartItem {
    itemId: number;
    productId: number;
    bundleId?: number; // 所属套装ID标记
    bundleItems?: string; // 套装商品快照（JSON数组）
    productSlug: string;
    productTitle: string;
    productName: string;
    productSku: string;
    skuId?: number;  // SKU表ID,用于订单创建
    productImage: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    material?: string;
    length?: string;
    width?: string;
    weight?: string;
    color?: string;
    addedAt?: string;
    
    // ✅ 新增：商品类型标识（用于判断是套装还是单品）
    isBundle?: boolean; // 是否为套装商品
}

// 套装商品快照接口
export interface BundleItemSnapshot {
    productId: number;
    productName: string;
    productImage: string;
    productSku: string;
    color?: string;
    quantity: number;
}
