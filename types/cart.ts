export interface AddToCartRequest {
    productId: number;
    productTitle: string;     // 新增字段
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
    cartId: number;
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
    productTitle: string;
    productSku: string;
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
