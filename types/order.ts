// types/order.ts
export interface OrderCreateRequest {
    userId: number;
    cartId: number;
    items: OrderItemRequest[];
    shippingAddress: AddressRequest;
    shippingFee?: number;
    discountAmount?: number;
    paymentMethod: string;
    shippingMethod: string;
    customerNote?: string;
}

export interface OrderItemRequest {
    productId: number;
    productSku: string;
    quantity: number;
    productTitle: string;
    unitPrice: number;
    color: string;
    productImage?: string;
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
}

export interface OrderResponse {
    id: number;
    orderNumber: string;
    status: string;
    totalAmount: number;
    shippingFee: number;
    discountAmount: number;
    finalAmount: number;
    createdAt: string;
    paymentMethod: string;
    shippingMethod: string;
    items: OrderItemResponse[];
}

export interface OrderItemResponse {
    id: number;
    productId: number;
    productTitle: string;
    productSku: string;
    color: string
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    productImage: string;
    productDetailUrl?: string;
    stockStatus?: string;
    returnable?: boolean;
}

export interface OrderSummary {
    id: number;
    orderNumber: string;
    status: string;
    finalAmount: number;
    itemCount: number;
    createdAt: string;
    paymentMethod: string;
    shippingMethod: string;
}