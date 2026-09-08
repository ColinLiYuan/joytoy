// app/(site)/payment/google-pay-button.tsx
// Google Pay 按钮（走 PayPal 渠道：paypal.Googlepay()，v5 SDK）
// 参考：https://developer.paypal.com/v5/google-pay/integrate/
// 前提：PayPal 账户已开通 Google Pay（生产 onboarding 已完成）
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import { usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface GooglePayButtonProps {
    /** 订单金额（两位小数字符串，如 "59.99"） */
    amount: string;
    currency?: string;
    disabled?: boolean;
    /** 创建 PayPal Order，返回 orderId（复用现有 /paypal/create 流程） */
    createOrder: () => Promise<string>;
    /** 后端 capture + 订单状态更新（复用现有 payOrder 流程） */
    captureOrder: (orderId: string) => Promise<void>;
    /** 支付失败提示（回传 page.tsx 显示错误信息） */
    onPaymentError: (message: string) => void;
}

export default function GooglePayButton({
    amount,
    currency = 'USD',
    disabled,
    createOrder,
    captureOrder,
    onPaymentError,
}: GooglePayButtonProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [googlePayLoaded, setGooglePayLoaded] = useState(false);
    const [paypalReady, setPaypalReady] = useState(false);
    const [{ isResolved }] = usePayPalScriptReducer();

    // 最新 props 闭包：Google 的 onPaymentAuthorized 回调创建后不再重建，需经 ref 取最新函数
    const propsRef = useRef({ createOrder, captureOrder, onPaymentError, amount, currency });
    propsRef.current = { createOrder, captureOrder, onPaymentError, amount, currency };

    // PayPal SDK 就绪标记（components 里含 googlepay 时才有 paypal.Googlepay）
    useEffect(() => {
        if (isResolved && (window as any).paypal?.Googlepay) {
            setPaypalReady(true);
        }
    }, [isResolved]);

    // 两个 SDK（pay.js + PayPal）都就绪后：查资格 → 挂原生 Google Pay 按钮
    useEffect(() => {
        if (!paypalReady || !googlePayLoaded) return;
        const container = containerRef.current;
        if (!container || container.childElementCount > 0) return;

        const paypal = (window as any).paypal;
        const google = (window as any).google;

        (async () => {
            try {
                const config = await paypal.Googlepay().config();

                const paymentsClient = new google.payments.api.PaymentsClient({
                    environment: 'PRODUCTION',
                    paymentDataCallbacks: {
                        onPaymentAuthorized: (paymentData: any) =>
                            processPayment(paymentData, paymentsClient),
                    },
                });

                const isReady = await paymentsClient.isReadyToPay({
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: config.allowedPaymentMethods,
                });
                if (!isReady.result) return;

                const button = paymentsClient.createButton({
                    buttonColor: 'black',
                    buttonType: 'pay',
                    buttonLocale: 'en',
                    onClick: () => paymentsClient.loadPaymentData(buildPaymentDataRequest(config)),
                });
                container.appendChild(button);
            } catch {
                // 商家/设备不符合条件：静默不渲染按钮
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paypalReady, googlePayLoaded]);

    const buildPaymentDataRequest = (config: any) => {
        const { amount, currency } = propsRef.current;
        return {
            apiVersion: 2,
            apiVersionMinor: 0,
            allowedPaymentMethods: config.allowedPaymentMethods,
            merchantInfo: config.merchantInfo,
            transactionInfo: {
                currencyCode: currency,
                totalPriceStatus: 'FINAL',
                totalPrice: amount,
                totalPriceLabel: 'Total',
            },
            callbackIntents: ['PAYMENT_AUTHORIZATION'],
        };
    };

    // Google Pay 支付板授权后：创建 PayPal 订单 → confirmOrder → capture
    const processPayment = async (paymentData: any, paymentsClient: any) => {
        const paypal = (window as any).paypal;
        const { createOrder, captureOrder, onPaymentError } = propsRef.current;
        try {
            const orderId = await createOrder();
            const result = await paypal.Googlepay().confirmOrder({
                orderId,
                paymentMethodData: paymentData.paymentMethodData,
            });

            if (result.status === 'APPROVED') {
                await captureOrder(orderId);
                return { transactionState: 'SUCCESS' };
            }

            if (result.status === 'PAYER_ACTION_REQUIRED') {
                // 3DS 二次验证
                await paypal.Googlepay().initiatePayerAction({ orderId });
                await captureOrder(orderId);
                return { transactionState: 'SUCCESS' };
            }

            onPaymentError('Google Pay payment failed. Please try again or use PayPal.');
            return { transactionState: 'ERROR', error: { message: 'TRANSACTION FAILED' } };
        } catch {
            onPaymentError('Google Pay payment failed. Please try again or use PayPal.');
            return { transactionState: 'ERROR', error: { message: 'TRANSACTION FAILED' } };
        }
    };

    return (
        <>
            {/* Google Pay JS API（仅页面加载时挂一次，SDK 自带缓存） */}
            <Script
                src="https://pay.google.com/gp/p/js/pay.js"
                strategy="lazyOnload"
                onLoad={() => setGooglePayLoaded(true)}
            />
            <div
                ref={containerRef}
                style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
                className="w-full flex justify-center [&_iframe]:pointer-events-auto"
            />
        </>
    );
}
