// app/actions/send-order-email.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
    orderNumber: string;
    email: string;
    firstName: string;
    finalAmount: number; // 最终支付金额（finalAmount）
    shippingFee: number;
    discountAmount?: number; // 折扣金额
    items: {
        title: string;
        quantity: number;
        price: number;    // 单价
        sku?: string;
    }[];
    shippingAddress: {
        addressLine1: string;
        city: string;
        state: string;
        zip: string;
        country: string;
    };
}

const formatMoney = (amount: any) => {
    const num = Number(amount);
    return isNaN(num) ? '0.00' : num.toFixed(2);
};

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
    if (!order.email || !order.orderNumber) {
        return { success: false, error: 'Missing email or order number' };
    }

    try {
        await resend.emails.send({
            from: 'MythToy Concierge <support@mythtoy.com>',
            to: order.email,
            subject: `Order Confirmation #${order.orderNumber}`,
            html: generateUserEmailHtml(order),
        });

        return { success: true };
    } catch (error) {
        console.error('Order Email Error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

function generateUserEmailHtml(order: OrderEmailData) {
    // ✅ 正确计算商品小计（从items数组计算）
    const subtotal = order.items.reduce((total, item) => {
        return total + (item.price * (item.quantity || 1));
    }, 0);

    // ✅ 验证金额计算（可选）
    const calculatedTotal = subtotal + (order.shippingFee || 0) - (order.discountAmount || 0);
    const isConsistent = Math.abs(calculatedTotal - order.finalAmount) < 0.01;

    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">
                <div style="font-weight: bold;">${item.title}</div>
                ${item.sku ? `<div style="font-size: 12px; color: #888;">SKU: ${item.sku}</div>` : ''}
            </td>
            <td style="padding: 10px 0; text-align: center;">
                ${item.quantity || 1}
                ${item.quantity > 1 ? `<div style="font-size: 11px; color: #888;">@ $${formatMoney(item.price)}</div>` : ''}
            </td>
            <td style="padding: 10px 0; text-align: right; font-weight: 500;">
                $${formatMoney(item.price * (item.quantity || 1))}
            </td>
        </tr>
    `).join('');

    // ✅ 动态生成 Discount 行
    const discountHtml = (order.discountAmount && order.discountAmount > 0) ? `
        <tr>
            <td colspan="2" style="text-align: right; padding-top: 10px; color: #16a34a; font-size: 14px;">
                <strong>Discount:</strong>
            </td>
            <td style="text-align: right; padding-top: 10px; color: #16a34a; font-size: 14px;">
                <strong>-$${formatMoney(order.discountAmount)}</strong>
            </td>
        </tr>
    ` : '';

    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Order Confirmation #${order.orderNumber}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; background-color: #f9f9f9;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
                
                <!-- Header -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="font-size: 24px; font-weight: bold; color: #000; margin-bottom: 5px;">MythToy</div>
                    <div style="font-size: 12px; color: #666; letter-spacing: 2px; text-transform: uppercase;">ORDER CONFIRMATION</div>
                </div>

                <!-- Thank You Section -->
                <div style="background: linear-gradient(to right, #f3f4f6, #ffffff); padding: 25px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
                    <h1 style="margin-top: 0; margin-bottom: 10px; color: #000; font-size: 28px;">Thank You!</h1>
                    <p style="color: #666; margin-bottom: 15px;">Hi <strong>${order.firstName || 'Customer'}</strong>,</p>
                    <p style="color: #666; margin: 0;">Your order has been confirmed and is being processed. You'll receive a shipping confirmation with tracking details soon.</p>
                </div>

                <!-- Order Summary -->
                <div style="margin-bottom: 30px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                        <div>
                            <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Order Number</div>
                            <div style="font-size: 22px; font-weight: bold; color: #000;">#${order.orderNumber}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Total Amount</div>
                            <div style="font-size: 28px; font-weight: bold; color: #000;">$${formatMoney(order.finalAmount)}</div>
                        </div>
                    </div>
                </div>

                <!-- Items Table -->
                <div style="margin-bottom: 35px;">
                    <h3 style="font-size: 16px; color: #000; margin-bottom: 15px; border-bottom: 2px solid #000; padding-bottom: 8px;">Order Items</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="text-align: left; padding-bottom: 10px; font-size: 13px; color: #888; font-weight: 600;">PRODUCT</th>
                                <th style="text-align: center; padding-bottom: 10px; font-size: 13px; color: #888; font-weight: 600;">QTY</th>
                                <th style="text-align: right; padding-bottom: 10px; font-size: 13px; color: #888; font-weight: 600;">PRICE</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                        <tfoot>
                            <!-- Subtotal -->
                            <tr>
                                <td colspan="2" style="text-align: right; padding-top: 15px; font-size: 14px; color: #666;">
                                    <strong>Subtotal (${order.items.length} items):</strong>
                                </td>
                                <td style="text-align: right; padding-top: 15px; font-size: 14px;">
                                    <strong>$${formatMoney(subtotal)}</strong>
                                </td>
                            </tr>
                            
                            <!-- Shipping -->
                            <tr>
                                <td colspan="2" style="text-align: right; padding-top: 8px; font-size: 14px; color: #666;">
                                    Shipping & Handling:
                                </td>
                                <td style="text-align: right; padding-top: 8px; font-size: 14px;">
                                    ${order.shippingFee > 0 ? `$${formatMoney(order.shippingFee)}` : '<span style="color: #16a34a;">FREE</span>'}
                                </td>
                            </tr>
                            
                            <!-- Discount (if any) -->
                            ${discountHtml}
                            
                            <!-- Total -->
                            <tr style="border-top: 2px solid #000; margin-top: 10px;">
                                <td colspan="2" style="text-align: right; padding-top: 15px; font-size: 16px; font-weight: bold; color: #000;">
                                    Total Paid:
                                </td>
                                <td style="text-align: right; padding-top: 15px; font-size: 20px; font-weight: bold; color: #000;">
                                    $${formatMoney(order.finalAmount)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    
                    ${!isConsistent ? `
                    <div style="margin-top: 10px; padding: 8px 12px; background-color: #fef3c7; border-left: 3px solid #f59e0b; font-size: 12px; color: #92400e;">
                        <strong>Note:</strong> Final amount includes adjustments made during checkout.
                    </div>
                    ` : ''}
                </div>

                <!-- Shipping Address -->
                <div style="margin-bottom: 35px; background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                    <h3 style="font-size: 16px; color: #000; margin-bottom: 15px;">Shipping To</h3>
                    <div style="font-size: 14px; color: #555; line-height: 1.8;">
                        <div><strong>${order.firstName || 'Customer'}</strong></div>
                        <div>${order.shippingAddress.addressLine1 || ''}</div>
                        ${order.shippingAddress.city ? `<div>${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zip || ''}</div>` : ''}
                        <div>${order.shippingAddress.country || ''}</div>
                    </div>
                </div>

                <!-- Privacy Notice -->
                <div style="background-color: #eff6ff; padding: 18px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #3b82f6;">
                    <div style="display: flex; align-items: start;">
                        <div style="font-size: 14px; color: #1e40af;">
                            <strong style="display: block; margin-bottom: 5px;">🔒 Billing Privacy</strong>
                            This charge will appear discreetly as "<strong>MT TECH</strong>" on your bank statement. No product details are listed for your privacy.
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div style="text-align: center; padding-top: 30px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af;">
                    <p style="margin: 0 0 10px 0;">
                        Need help? Reply to this email or contact <a href="mailto:support@mythtoy.com" style="color: #3b82f6; text-decoration: none;">support@mythtoy.com</a>
                    </p>
                    <p style="margin: 0;">
                        © ${new Date().getFullYear()} MythToy. All rights reserved.
                    </p>
                </div>

            </div>
        </body>
        </html>
    `;
}