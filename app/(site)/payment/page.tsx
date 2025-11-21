// payment/route.tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faArrowLeft,
    faLock,
    faCreditCard,
    faShieldAlt,
    faCheckCircle,
    faExclamationTriangle,
    faUser,
    faEnvelope,
    faReceipt
} from '@fortawesome/free-solid-svg-icons';
import './payment.css';

interface PaymentData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    nameOnCard: string;
    saveCard: boolean;
}

interface OrderSummary {
    id: string;
    items: Array<{
        id: number;
        title: string;
        quantity: number;
        price: number;
        image?: string;
    }>;
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    customerName: string;
    customerEmail: string;
}

// 将主要内容提取到一个组件中，以便使用 useSearchParams
function PaymentContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    const [isProcessing, setIsProcessing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
    const [orderSummary, setOrderSummary] = useState<OrderSummary | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showPaymentNotice, setShowPaymentNotice] = useState(false);

    const [paymentData, setPaymentData] = useState<PaymentData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        nameOnCard: '',
        saveCard: false
    });

    // 显示支付功能暂不可用提示并跳转
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowPaymentNotice(true);

            // 2秒后跳转到订单页面
            const redirectTimer = setTimeout(() => {
                router.push('/orders');
            }, 2000);

            return () => clearTimeout(redirectTimer);
        }, 500); // 稍微延迟一下，确保页面加载完成

        return () => clearTimeout(timer);
    }, [router]);

    // 从后端获取订单数据
    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                setIsLoading(true);

                // 实际项目中这里应该是真实的 API 调用
                // 由于支付功能暂不可用，我们模拟一些数据
                const mockOrderData: OrderSummary = {
                    id: orderId || 'ORD-12345',
                    items: [
                        {
                            id: 1,
                            title: 'Premium Action Figure',
                            quantity: 2,
                            price: 29.99,
                            image: '/products/figure-1.jpg'
                        },
                        {
                            id: 2,
                            title: 'Collector\'s Edition Set',
                            quantity: 1,
                            price: 59.99,
                            image: '/products/set-1.jpg'
                        }
                    ],
                    subtotal: 119.97,
                    shipping: 9.99,
                    tax: 9.60,
                    total: 139.56,
                    customerName: 'John Doe',
                    customerEmail: 'john.doe@example.com'
                };

                // 模拟 API 调用延迟
                await new Promise(resolve => setTimeout(resolve, 1000));
                setOrderSummary(mockOrderData);

            } catch (error) {
                console.error('Failed to load order data:', error);
                setErrors({ general: 'Failed to load order information' });
            } finally {
                setIsLoading(false);
            }
        };

        if (orderId) {
            fetchOrderData();
        } else {
            setErrors({ general: 'Order ID is missing' });
            setIsLoading(false);
        }
    }, [orderId]);

    // 格式化卡号显示
    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches ? matches[0] : '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    // 格式化过期日期
    const formatExpiryDate = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return v.substring(0, 2) + (v.length > 2 ? '/' + v.substring(2, 4) : '');
        }
        return v;
    };

    const handleInputChange = (field: keyof PaymentData, value: string | boolean) => {
        setPaymentData(prev => ({
            ...prev,
            [field]: value
        }));

        // 清除该字段的错误
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (paymentMethod === 'card') {
            if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length !== 16) {
                newErrors.cardNumber = 'Please enter a valid 16-digit card number';
            }

            if (!paymentData.expiryDate || !/^\d{2}\/\d{2}$/.test(paymentData.expiryDate)) {
                newErrors.expiryDate = 'Please enter a valid expiry date (MM/YY)';
            }

            if (!paymentData.cvv || paymentData.cvv.length !== 3) {
                newErrors.cvv = 'Please enter a valid CVV';
            }

            if (!paymentData.nameOnCard.trim()) {
                newErrors.nameOnCard = 'Please enter the name on card';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // 阻止表单提交，因为支付功能暂不可用
        return;
    };

    const handlePayPalPayment = async () => {
        // 阻止 PayPal 支付，因为支付功能暂不可用
        return;
    };

    // 显示支付功能暂不可用提示
    if (showPaymentNotice) {
        return (
            <div className="payment-notice">
                <div className="notice-content">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="3x" />
                    <h2>Payment Feature Coming Soon</h2>
                    <p>The payment functionality is currently under development and will be available soon.</p>
                    <p>Redirecting to orders page...</p>
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="payment-loading">
                <div className="loading-spinner"></div>
                <p>Loading payment information...</p>
            </div>
        );
    }

    if (!orderSummary) {
        return (
            <div className="payment-error">
                <FontAwesomeIcon icon={faExclamationTriangle} />
                <h2>Order Not Found</h2>
                <p>Unable to load order information. Please check your order ID and try again.</p>
                <Link href="/cart" className="btn btn-primary">
                    Return to Cart
                </Link>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="container">
                <div className="payment-content">
                    <div className="payment-main">
                        {errors.general && (
                            <div className="error-message">
                                <FontAwesomeIcon icon={faExclamationTriangle} />
                                <span>{errors.general}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="payment-form">
                            {/* 支付方式选择 */}
                            <div className="payment-method-selection">
                                <h2>
                                    <FontAwesomeIcon icon={faCreditCard} />
                                    Select Payment Method
                                </h2>
                                <div className="method-tabs">
                                    <button
                                        type="button"
                                        className={`method-tab ${paymentMethod === 'card' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('card')}
                                    >
                                        <FontAwesomeIcon icon={faCreditCard} />
                                        Credit/Debit Card
                                    </button>
                                    <button
                                        type="button"
                                        className={`method-tab ${paymentMethod === 'paypal' ? 'active' : ''}`}
                                        onClick={() => setPaymentMethod('paypal')}
                                    >
                                        <div className="paypal-logo-placeholder">PayPal</div>
                                        PayPal
                                    </button>
                                </div>
                            </div>

                            {/* 信用卡支付表单 */}
                            {paymentMethod === 'card' && (
                                <div className="card-payment-form">
                                    <div className="form-section">
                                        <h3>Card Information</h3>

                                        <div className="form-group">
                                            <label htmlFor="cardNumber">Card Number *</label>
                                            <input
                                                type="text"
                                                id="cardNumber"
                                                value={paymentData.cardNumber}
                                                onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                                                placeholder="1234 5678 9012 3456"
                                                maxLength={19}
                                                className={errors.cardNumber ? 'error' : ''}
                                                disabled
                                            />
                                            {errors.cardNumber && (
                                                <span className="field-error">{errors.cardNumber}</span>
                                            )}
                                        </div>

                                        <div className="form-row">
                                            <div className="form-group">
                                                <label htmlFor="expiryDate">Expiry Date *</label>
                                                <input
                                                    type="text"
                                                    id="expiryDate"
                                                    value={paymentData.expiryDate}
                                                    onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                                                    placeholder="MM/YY"
                                                    maxLength={5}
                                                    className={errors.expiryDate ? 'error' : ''}
                                                    disabled
                                                />
                                                {errors.expiryDate && (
                                                    <span className="field-error">{errors.expiryDate}</span>
                                                )}
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="cvv">CVV *</label>
                                                <input
                                                    type="text"
                                                    id="cvv"
                                                    value={paymentData.cvv}
                                                    onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                                                    placeholder="123"
                                                    maxLength={3}
                                                    className={errors.cvv ? 'error' : ''}
                                                    disabled
                                                />
                                                {errors.cvv && (
                                                    <span className="field-error">{errors.cvv}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="form-group">
                                            <label htmlFor="nameOnCard">Name on Card *</label>
                                            <input
                                                type="text"
                                                id="nameOnCard"
                                                value={paymentData.nameOnCard}
                                                onChange={(e) => handleInputChange('nameOnCard', e.target.value)}
                                                placeholder="John Doe"
                                                className={errors.nameOnCard ? 'error' : ''}
                                                disabled
                                            />
                                            {errors.nameOnCard && (
                                                <span className="field-error">{errors.nameOnCard}</span>
                                            )}
                                        </div>

                                        <div className="form-group checkbox-group">
                                            <label className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={paymentData.saveCard}
                                                    onChange={(e) => handleInputChange('saveCard', e.target.checked)}
                                                    disabled
                                                />
                                                <span className="checkmark"></span>
                                                Save card for future purchases
                                            </label>
                                        </div>
                                    </div>

                                    {/* 账单地址 */}
                                    <div className="form-section">
                                        <h3>Billing Address</h3>
                                        <div className="billing-address-note">
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                            <span>Same as shipping address</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* PayPal 支付 */}
                            {paymentMethod === 'paypal' && (
                                <div className="paypal-payment-section">
                                    <div className="paypal-info">
                                        <h3>Pay with PayPal</h3>
                                        <p>You will be redirected to PayPal to complete your payment securely.</p>
                                        <div className="paypal-benefits">
                                            <div className="benefit">
                                                <FontAwesomeIcon icon={faShieldAlt} />
                                                <span>Buyer Protection Included</span>
                                            </div>
                                            <div className="benefit">
                                                <FontAwesomeIcon icon={faCreditCard} />
                                                <span>Pay with your balance or card</span>
                                            </div>
                                            <div className="benefit">
                                                <FontAwesomeIcon icon={faCheckCircle} />
                                                <span>Fast and Secure</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* 支付按钮 */}
                            <div className="payment-actions">
                                {paymentMethod === 'card' ? (
                                    <button
                                        type="submit"
                                        className="btn btn-primary pay-now-btn"
                                        disabled={true}
                                    >
                                        <FontAwesomeIcon icon={faLock} />
                                        Payment Coming Soon
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-paypal"
                                        onClick={handlePayPalPayment}
                                        disabled={true}
                                    >
                                        <div className="paypal-logo-placeholder">PayPal</div>
                                        Payment Coming Soon
                                    </button>
                                )}

                                <div className="payment-security">
                                    <FontAwesomeIcon icon={faLock} />
                                    <span>Payment functionality will be available soon</span>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* 订单摘要侧边栏 */}
                    <div className="order-summary-sidebar">
                        <div className="summary-card">
                            <h3>
                                <FontAwesomeIcon icon={faReceipt} />
                                Order Summary
                            </h3>

                            <div className="order-items">
                                {orderSummary.items.map(item => (
                                    <div key={item.id} className="order-item">
                                        <div className="item-image">
                                            {item.image ? (
                                                <img src={item.image} alt={item.title} />
                                            ) : (
                                                <div className="image-placeholder">
                                                    {item.title.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                        <div className="item-details">
                                            <h4>{item.title}</h4>
                                            <p>Qty: {item.quantity}</p>
                                        </div>
                                        <div className="item-price">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="order-totals">
                                <div className="total-row">
                                    <span>Subtotal</span>
                                    <span>${orderSummary.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Shipping</span>
                                    <span>${orderSummary.shipping.toFixed(2)}</span>
                                </div>
                                <div className="total-row">
                                    <span>Tax</span>
                                    <span>${orderSummary.tax.toFixed(2)}</span>
                                </div>
                                <div className="total-row grand-total">
                                    <span>Total</span>
                                    <span>${orderSummary.total.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="order-info">
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faUser} />
                                    <span>Customer: {orderSummary.customerName}</span>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    <span>Email: {orderSummary.customerEmail}</span>
                                </div>
                                <div className="info-item">
                                    <FontAwesomeIcon icon={faReceipt} />
                                    <span>Order: {orderSummary.id}</span>
                                </div>
                            </div>
                        </div>

                        <div className="security-guarantee">
                            <FontAwesomeIcon icon={faShieldAlt} />
                            <div className="guarantee-content">
                                <h4>Security Guarantee</h4>
                                <p>Your payment is protected with bank-level security and encryption.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// 加载组件
function PaymentLoading() {
    return (
        <div className="payment-loading">
            <div className="loading-spinner"></div>
            <p>Loading payment information...</p>
        </div>
    );
}

// 主页面组件
export default function PaymentPage() {
    return (
        <Suspense fallback={<PaymentLoading />}>
            <PaymentContent />
        </Suspense>
    );
}