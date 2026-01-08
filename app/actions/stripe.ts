'use server';

import Stripe from 'stripe';

// 初始化 Stripe (记得在 .env 加上 STRIPE_SECRET_KEY)
// ⚠️ 注意：使用环境变量名 STRIPE_SECRET_KEY，不是 NEXT_PUBLIC_STRIPE_SECRET_KEY
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-12-15.clover', // 使用最新的 API 版本
});

export async function createStripePaymentIntent(amount: number, currency: string = 'usd') {
    try {
        // Stripe 金额单位是 cent (分)，所以要 * 100
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: currency.toLowerCase(),
            automatic_payment_methods: { enabled: true }, // 支持卡和其他本地支付
        });

        // 确保 client_secret 存在
        if (!paymentIntent.client_secret) {
            throw new Error('No client secret generated');
        }

        return { clientSecret: paymentIntent.client_secret };
    } catch (error: any) {
        console.error('Stripe Intent Error:', error);
        throw new Error(error.message || 'Failed to create payment intent');
    }
}