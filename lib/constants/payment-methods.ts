// 支付方式 → 展示文案的统一映射。
// 订单表里存的是后端返回的原始字符串（如 PAYPAL_APPLE_PAY），
// 列表/详情/确认页都走这里，避免各处拼出 "Paypal Apple Pay" 之类的结果。
const PAYMENT_METHOD_LABELS: Record<string, string> = {
    PAYPAL: 'PayPal',
    PAYPAL_APPLE_PAY: 'Apple Pay',
    PAYPAL_GOOGLE_PAY: 'Google Pay',
    CREDIT_CARD: 'Credit Card',
    DEBIT_CARD: 'Debit Card',
    BANK_TRANSFER: 'Bank Transfer',
    STRIPE: 'Card',
    COD: 'Cash on Delivery',
};

export function paymentMethodLabel(method?: string | null): string {
    if (!method) return 'Card';
    return PAYMENT_METHOD_LABELS[method.toUpperCase()]
        || method.replace(/_/g, ' ');
}
