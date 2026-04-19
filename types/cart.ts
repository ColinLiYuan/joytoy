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
}
