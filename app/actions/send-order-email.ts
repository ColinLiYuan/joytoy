// app/actions/send-order-email.ts
'use server';

import { Resend } from 'resend';

// 确保在 .env.local 中配置了 RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

// 定义传入的订单数据结构 (简化版)
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

export async function sendOrderConfirmationEmail(order: OrderEmailData) {
    if (!order.email || !order.orderNumber) {
        return { success: false, error: 'Missing email or order number' };
    }

    try {
        // 1. 发送给用户 (精美 HTML)
        const sendToUser = resend.emails.send({
            from: 'MythToy Orders <support@mythtoy.com>', // 建议去 Resend 配置域名
            to: order.email,
            subject: `Order Confirmation #${order.orderNumber}`,
            html: generateUserEmailHtml(order),
        });

        // 2. 发送给管理员 (纯文本或简单 HTML)
        const sendToAdmin = resend.emails.send({
            from: 'MythToy System <system@mythtoy.com>',
            to: 'support@mythtoy.com', // 你的管理员邮箱
            subject: `[New Order] #${order.orderNumber} - $${order.totalAmount}`,
            html: generateAdminEmailHtml(order),
        });

        await Promise.all([sendToUser, sendToAdmin]);

        return { success: true };

    } catch (error) {
        console.error('Order Email Error:', error);
        // 即使邮件发送失败，也不应该阻断前端的支付成功流程，所以这里只 Log，不抛出异常
        return { success: false, error: 'Failed to send email' };
    }
}

// --- HTML Generators (内联样式，兼容邮件客户端) ---

function generateUserEmailHtml(order: OrderEmailData) {
    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0;">
                <div style="font-weight: bold;">${item.title}</div>
                <div style="font-size: 12px; color: #888;">SKU: ${item.sku || 'N/A'}</div>
            </td>
            <td style="padding: 10px 0; text-align: center;">x${item.quantity}</td>
            <td style="padding: 10px 0; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
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
                    <h3 style="margin-top: 0;">Hi ${order.firstName},</h3>
                    <p>We've received your order and are getting it ready for shipment. We will notify you once it's on its way.</p>
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
                            <td colspan="2" style="text-align: right; padding-top: 10px;">Shipping:</td>
                            <td style="text-align: right; padding-top: 10px;">$${order.shippingFee.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td colspan="2" style="text-align: right; font-weight: bold; padding-top: 5px;">Total:</td>
                            <td style="text-align: right; font-weight: bold; padding-top: 5px; font-size: 18px;">$${order.totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <div style="margin-bottom: 30px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px;">Shipping To</h3>
                    <p>
                        ${order.shippingAddress.addressLine1}<br>
                        ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}<br>
                        ${order.shippingAddress.country}
                    </p>
                </div>

                <div style="text-align: center; font-size: 12px; color: #999; margin-top: 50px;">
                    <p>© 2025 MythToy. All rights reserved.</p>
                    <p>This is a system generated email. Please do not reply directly.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}

function generateAdminEmailHtml(order: OrderEmailData) {
    return `
        <h3>New Order Received: #${order.orderNumber}</h3>
        <p><strong>Customer:</strong> ${order.firstName} (${order.email})</p>
        <p><strong>Amount:</strong> $${order.totalAmount}</p>
        <p><strong>Items:</strong></p>
        <ul>
            ${order.items.map(i => `<li>${i.title} (x${i.quantity})</li>`).join('')}
        </ul>
        <p><a href="https://mythtoy.com/admin/orders/${order.orderNumber}">View in Admin Panel</a></p>
    `;
}