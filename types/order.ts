// types/order.ts

export type OrderStatus =
    | 'PENDING'
    | 'PAID'
    | 'PROCESSING'
    | 'SHIPPED'
    | 'DELIVERED'
    | 'COMPLETED'
    | 'CANCELLED'
    | 'REFUNDED'
    | 'EXPIRED';

export interface OrderCreateRequest {
    userId?: number;        // 后端新增
    cartId?: number;        // 后端新增
    sessionId?: string;     // 游客购物车会话ID
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
    source?: string;
    campaign?: string;
    content?: string;
}

export interface OrderResponse {
    id: number;
    orderNumber: string;
    trackingNumber: string;
    labelUrl?: string;
    deviceType?: string;
    expenseShippingSynced?: boolean;
    expenseShippingId?: number;
    expenseRefundSynced?: boolean;
    expenseRefundId?: number;
    status: OrderStatus;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
    completedAt?: string;
    paymentMethod: string;
    shippingMethod: string;
    shippingAddress: AddressRequest;
    billingAddress: AddressRequest;
    affiliateCode?: string;
    affiliateId?: string;
    commissionAmount?: number;
    commissionRate?: number;
    affiliatePayoutStatus?: string;
    couponCode?: string;
    couponType?: 'PERCENTAGE' | 'FIXED';
    couponValue?: number;
    guestEmail?: string;
    items: OrderItemResponse[];
    logistics?: LogisticsInfo;
}

export interface OrderItemResponse {
    id: number;
    productName: string;
    productTitle: string;
    productImage?: string;
    color: string;
    unitPrice: number;
    quantity: number;
    price: number;
    productSku?: string;
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
    productName: string;
    productSku: string;  // SKU Code,后端会通过它查询完整的SKU信息
    productImage?: string;
    quantity: number;
    unitPrice: number;
    color: string;
    bundleId?: number;  // 套装ID，用于标记该商品属于哪个套装
}

export interface LogisticsCheckpoint {
    timestamp: string;
    message: string;
    location?: string;
    trackingStatus?: string;
}

export interface LogisticsInfo {
    trackingNumber: string;
    statusLevel: number; // 1-9 (对应燕文的 level1)
    originCountry?: string;
    destinationCountry?: string;
    checkpoints: LogisticsCheckpoint[];
}

export interface OrderPaymentResult {
    success: boolean;
    message: string;
    orderNumber: string;
}