'use client';

import { useState } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { Loader2, Lock } from 'lucide-react';
import { orderService } from '@/services/orderService';
import { sendOrderConfirmationEmail } from '@/app/actions/send-order-email';

// 这里传入父组件的方法，用于支付成功后的回调
interface StripePaymentFormProps {
    orderData: any;
    onSuccess: () => void;
    onError: (msg: string) => void;
}

export default function StripePaymentForm({ orderData, onSuccess, onError }: StripePaymentFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);

        try {
            // 1. 提交给 Stripe 确认支付
            const { error, paymentIntent } = await stripe.confirmPayment({
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/payment/success`, // Stripe 需要重定向，或者我们可以拦截
                },
                redirect: "if_required", // ✅ 关键：如果不需要3DS验证，就不跳转，留在当前页
            });

            if (error) {
                throw new Error(error.message);
            }

            if (paymentIntent && paymentIntent.status === "succeeded") {
                // 2. Stripe 扣款成功，通知后端更新订单状态
                await orderService.payOrder(orderData.orderNumber, {
                    transactionId: paymentIntent.id,
                    paymentMethod: 'STRIPE', // 标记为 Stripe
                    currency: 'USD'
                });

                // 3. 发邮件 (可以直接复用你现有的逻辑，或者在 onSuccess 里统一处理)
                // 这里为了保险，可以直接调用传入的 onSuccess
                onSuccess();
            }

        } catch (err: any) {
            onError(err.message || "Payment Failed");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <PaymentElement />
            </div>

            <button
                disabled={!stripe || isProcessing}
                type="submit"
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
                {isProcessing ? <Loader2 className="animate-spin" /> : <Lock size={18} />}
                {isProcessing ? 'Processing...' : `Pay $${Number(orderData.totalAmount).toFixed(2)}`}
            </button>
        </form>
    );
}