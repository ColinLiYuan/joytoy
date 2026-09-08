// types/payment.ts
export interface PaymentRequest {
    transactionId: string;
    // PAYPAL_APPLE_PAY / PAYPAL_GOOGLE_PAY：钱包渠道经 PayPal 收款，
    // 后端按 startsWith("PAYPAL") 路由到 PayPal capture，订单记录里区分具体渠道
    paymentMethod: 'PAYPAL' | 'PAYPAL_APPLE_PAY' | 'PAYPAL_GOOGLE_PAY' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER' | 'STRIPE';
    currency?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
}

export interface PaymentResponse {
    success: boolean;
    transactionId: string;
    orderId: number;
    paymentMethod: string;
    amount: number;
    paidAt?: string;
    message?: string;
}

export interface PayPalPaymentResponse {
    approvalUrl: string;
    paymentId: string;
    payerId?: string;
}

export interface PaymentStatusResponse {
    status: 'PENDING' | 'SUCCESS' | 'FAILED' | 'REFUNDED';
    transactionId: string;
    paymentMethod: string;
    amount: number;
    paidAt?: string;
    lastUpdated: string;
}