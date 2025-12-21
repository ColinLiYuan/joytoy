'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ShippingEmailData {
    orderNumber: string;
    email: string;
    firstName: string;
    carrier: string;       // e.g. "YunExpress", "DHL"
    trackingNumber: string; // e.g. "YT12345678"
    trackingUrl?: string;   // 可选，如果没有，前端生成通用的
    shippingAddress: {
        addressLine1: string;
        city: string;
        country: string;
    };
    items: {
        title: string;
        quantity: number;
        image?: string; // 可选：展示发货商品的图片
    }[];
}

export async function sendShippingConfirmationEmail(data: ShippingEmailData) {
    if (!data.email || !data.orderNumber || !data.trackingNumber) {
        return { success: false, error: 'Missing required shipping info' };
    }

    try {
        await resend.emails.send({
            from: 'MythToy Shipping <support@mythtoy.com>',
            to: data.email,
            subject: `Your Order #${data.orderNumber} is on the way! 🚚`,
            html: generateShippingEmailHtml(data),
        });

        return { success: true };
    } catch (error) {
        console.error('Shipping Email Error:', error);
        return { success: false, error: 'Failed to send shipping email' };
    }
}

function generateShippingEmailHtml(data: ShippingEmailData) {
    // 默认使用 17Track 如果没有提供 URL
    const trackLink = data.trackingUrl || `https://t.17track.net/en#nums=${data.trackingNumber}`;

    const itemsHtml = data.items.map(item => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px 0; display: flex; align-items: center; gap: 10px;">
                ${item.image ? `<img src="${item.image}" width="50" height="50" style="border-radius: 4px; object-fit: cover;" />` : ''}
                <div style="font-weight: bold; font-size: 14px;">${item.title}</div>
            </td>
            <td style="padding: 10px 0; text-align: center;">x${item.quantity}</td>
        </tr>
    `).join('');

    return `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                
                <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #000; margin-bottom: 10px; font-size: 24px;">Good News!</h1>
                    <p style="color: #666; font-size: 16px;">Your order #${data.orderNumber} has been shipped.</p>
                </div>

                <div style="background-color: #f9f9f9; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
                    <p style="margin: 0 0 10px; font-size: 14px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Tracking Number</p>
                    <p style="margin: 0 0 20px; font-size: 20px; font-weight: bold; letter-spacing: 2px; color: #000;">${data.trackingNumber}</p>
                    
                    <a href="${trackLink}" target="_blank" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: bold; font-size: 14px;">Track Your Package</a>
                    
                    <p style="margin-top: 15px; font-size: 12px; color: #999;">Carrier: ${data.carrier}</p>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="border-bottom: 2px solid #000; padding-bottom: 10px; font-size: 16px;">Items in this Shipment</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>
                </div>

                <div style="margin-bottom: 30px;">
                    <h3 style="font-size: 16px; margin-bottom: 5px;">Shipping To:</h3>
                    <p style="color: #555; margin: 0;">
                        ${data.firstName}<br>
                        ${data.shippingAddress.addressLine1}<br>
                        ${data.shippingAddress.city}, ${data.shippingAddress.country}
                    </p>
                </div>

                <div style="text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px;">
                    <p>Please note: Tracking updates may take 24-48 hours to appear.</p>
                    <p>© 2025 MythToy. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
}