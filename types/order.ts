// types/order.ts

export interface OrderCreateRequest {
    userId?: number;        // 后端新增
    cartId?: number;        // 后端新增
    guestEmail?: string;
    items: OrderItemRequest[];
    shippingAddress: AddressRequest;
    billingAddress: AddressRequest; // 后端新增
    paymentMethod: string;
    shippingMethod: string;
    customerNote?: string;
    shippingFee: number;   // BigDecimal 对应 number
    discountAmount: number; // BigDecimal 对应 number
    affiliateCode?: string;
    couponCode?: string;
}

export interface OrderResponse {
    id: number;
    orderNumber: string;
    trackingNumber: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
    paymentMethod: string;
    shippingMethod: string;
    items: any[];
    shippingAddress: AddressRequest;

    // ✅ 新增：联盟字段
    affiliateCode?: string;
    affiliateId?: string;
    commissionAmount?: number;
    commissionRate?: number;
    affiliatePayoutStatus?: string;

    // ✅ 新增：折扣码信息字段
    couponCode?: string;
    couponType?: 'PERCENTAGE' | 'FIXED';
    couponValue?: number;
}

export interface OrderListResponse {
    content: OrderResponse[];
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
}

export interface AddressRequest {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: string;
    province: string;
    city: string;
    addressLine1: string;
    addressLine2?: string;
    zipCode: string;
    company?: string;      // 后端新增字段
    useAsBilling?: boolean; // 前端辅助字段
}

export interface OrderItemRequest {
    productId: number;
    productTitle: string;
    productSku: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    color: string;
    skuId?: number;
    // ✅ 新增：产品名称字段（用于联盟和折扣验证）
    productName?: string;
}