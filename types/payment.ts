// types/payment.ts
export interface PaymentRequest {
    transactionId: string;
    paymentMethod: 'PAYPAL' | 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_TRANSFER';
    currency?: string;
    cardNumber?: string;
    expiryDate?: string;
    cvv?: string;
    amount: number;
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