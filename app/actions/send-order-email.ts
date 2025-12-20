// app/actions/send-order-email.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface OrderEmailData {
    orderNumber: string;
    email: string;
    firstName: string;
    totalAmount: number;
    shippingFee: number;
    items: {
        title: string;
        quantity: number;
        price: number;
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

// ✅ 1. 新增：安全金额格式化函数
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

        // 管理员邮件可以简化，这里略去，重点修 User Email

        return { success: true };
    } catch (error) {
        console.error('Order Email Error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

function generateUserEmailHtml(order: OrderEmailData) {
    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">
                <div style="font-weight: bold;">${item.title}</div>
                <div style="font-size: 12px; color: #888;">SKU: ${item.sku || 'N/A'}</div>
            </td>
            <td style="padding: 10px 0; text-align: center;">x${item.quantity || 1}</td>
            <td style="padding: 10px 0; text-align: right;">$${formatMoney(item.price * item.quantity)}</td> 
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #000; margin-bottom: 10px;">Thank You for Your Order</h1>
                    <p style="color: #666;">Order #${order.orderNumber}</p>
                </div>

                <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                    <h3 style="margin-top: 0;">Hi ${order.firstName || 'Customer'},</h3>
                    <p>We've received your order and are getting it ready for shipment. You will receive another email with tracking info soon.</p>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #000;">
                            <th style="text-align: left; padding-bottom: 10px;">Item</th>
                            <th style="text-align: center; padding-bottom: 10px;">Qty</th>
                            <th style="text-align: right; padding-bottom: 10px;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="text-align: right; padding-top: 10px; color: #666;">Shipping:</td>
                            <td style="text-align: right; padding-top: 10px;">$${formatMoney(order.shippingFee)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right; font-weight: bold; padding-top: 5px;">Total:</td>
                            <td style="text-align: right; font-weight: bold; padding-top: 5px; font-size: 18px;">$${formatMoney(order.totalAmount)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-bottom: 40px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; font-size: 16px;">Shipping To</h3>
                    <p style="color: #555;">
                        ${order.shippingAddress.addressLine1 || ''}<br>
                        ${order.shippingAddress.city || ''}, ${order.shippingAddress.state || ''} ${order.shippingAddress.zip || ''}<br>
                        ${order.shippingAddress.country || ''}
                    </p>
                </div>

                <div style="background-color: #f5f5f5; padding: 15px; border-radius: 6px; text-align: center; font-size: 13px; color: #666; margin-bottom: 30px;">
                    <strong>Billing Descriptor:</strong> This charge will appear as "MT HOLDINGS" on your bank statement for your privacy.
                </div>

                <div style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                    <p>© 2025 MythToy. All rights reserved.</p>
                    <p>If you have any questions, reply to this email or contact support@mythtoy.com.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}