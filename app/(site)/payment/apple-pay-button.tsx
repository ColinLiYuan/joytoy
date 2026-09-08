// app/(site)/payment/apple-pay-button.tsx
// Apple Pay 按钮（走 PayPal 渠道：paypal.Applepay()，v5 SDK）
// 参考：https://developer.paypal.com/docs/checkout/apm/apple-pay/
// 前提：PayPal 账户已开通 Apple Pay 且域名已注册验证
// （/.well-known/apple-developer-merchantid-domain-association）
'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

// <apple-pay-button> 自定义元素 TS 声明
declare module 'react' {
    namespace JSX {
        interface IntrinsicElements {
            'apple-pay-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                buttonstyle?: 'black' | 'white' | 'white-outline';
                type?: 'buy' | 'plain' | 'check-out';
                locale?: string;
            };
        }
    }
}

interface ApplePayButtonProps {
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

export default function ApplePayButton({
    amount,
    currency = 'USD',
    disabled,
    createOrder,
    captureOrder,
    onPaymentError,
}: ApplePayButtonProps) {
    const buttonRef = useRef<HTMLElement>(null);
    const [eligible, setEligible] = useState(false);

    // 商家资格检查：设备支持 Apple Pay 且 PayPal 账户对当前域名开通了 Apple Pay
    useEffect(() => {
        const ApplePaySessionAny = (window as any).ApplePaySession;
        const paypal = (window as any).paypal;
        if (!ApplePaySessionAny || !ApplePaySessionAny.canMakePayments() || !paypal?.Applepay) {
            return;
        }
        paypal.Applepay().config()
            .then((cfg: any) => setEligible(!!cfg?.isEligible))
            .catch(() => setEligible(false));
    }, []);

    const handleClick = async () => {
        const paypal = (window as any).paypal;
        const ApplePaySessionAny = (window as any).ApplePaySession;
        const applepay = paypal.Applepay();

        try {
            const applepayConfig = await applepay.config();

            const paymentRequest = {
                countryCode: applepayConfig.countryCode,
                merchantCapabilities: applepayConfig.merchantCapabilities,
                supportedNetworks: applepayConfig.supportedNetworks,
                currencyCode: currency,
                total: {
                    label: 'MythToy',
                    type: 'final',
                    amount,
                },
            };

            // ApplePaySession 必须在用户手势内创建
            const session = new ApplePaySessionAny(4, paymentRequest);

            // 商户验证（PayPal 桥接，域名验证文件在这里生效）
            session.onvalidatemerchant = (event: any) => {
                applepay
                    .validateMerchant({
                        validationUrl: event.validationURL,
                        displayName: 'MythToy',
                    })
                    .then((validateResult: any) => {
                        session.completeMerchantValidation(validateResult.merchantSession);
                    })
                    .catch(() => {
                        session.abort();
                        onPaymentError('Apple Pay merchant validation failed. Please use PayPal instead.');
                    });
            };

            // 用户授权后：创建 PayPal 订单 → confirmOrder → capture
            session.onpaymentauthorized = async (event: any) => {
                try {
                    const orderId = await createOrder();
                    await applepay.confirmOrder({
                        orderId,
                        token: event.payment.token,
                        billingContact: event.payment.billingContact,
                    });
                    session.completePayment(ApplePaySessionAny.STATUS_SUCCESS);
                    await captureOrder(orderId);
                } catch {
                    session.completePayment(ApplePaySessionAny.STATUS_FAILURE);
                    onPaymentError('Apple Pay payment failed. Please try again or use PayPal.');
                }
            };

            session.oncancel = () => { /* 用户主动取消，无需提示 */ };

            session.begin();
        } catch {
            onPaymentError('Apple Pay is unavailable on this device. Please use PayPal instead.');
        }
    };

    // 原生元素上挂原生 click 监听（Shadow DOM 事件不依赖 React 合成事件）
    // handlerRef 保证监听里永远调用最新闭包（props 变化不重建监听）
    const handlerRef = useRef(handleClick);
    handlerRef.current = handleClick;
    useEffect(() => {
        const el = buttonRef.current;
        if (!el) return;
        const onClick = () => handlerRef.current();
        el.addEventListener('click', onClick);
        return () => el.removeEventListener('click', onClick);
    }, [eligible]);

    if (!eligible) return null;

    return (
        <>
            {/* Apple Pay JS API（仅 eligible 时加载） */}
            <Script src="https://applepay.cdn-apple.com/jsapi/1.latest/apple-pay-sdk.js" strategy="lazyOnload" />
            <apple-pay-button
                ref={buttonRef as any}
                buttonstyle="black"
                type="buy"
                locale="en"
                style={disabled ? { opacity: 0.5, pointerEvents: 'none' } : undefined}
            />
        </>
    );
}
