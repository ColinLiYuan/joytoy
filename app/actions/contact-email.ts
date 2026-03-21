// app/actions/contact-email.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // 1. 发给管理员 (保持不变)
        const sendToAdmin = resend.emails.send({
            from: 'MythToy System <system@mythtoy.com>',
            to: 'support@mythtoy.com',
            replyTo: email,
            subject: `[New Inquiry] ${subject}`,
            html: `
                <h3>New Message from ${name}</h3>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Subject:</strong> ${subject}</p>
                <div style="background:#f4f4f4; padding:10px; border-radius:5px;">
                    ${message.replace(/\n/g, '<br>')}
                </div>
            `
        });

        // 2. ✅ 发给客户 (自动回复 - 内容更新)
        const sendAutoReply = resend.emails.send({
            from: 'MythToy Support <support@mythtoy.com>',
            to: email,
            subject: 'We received your message - MythToy',
            html: `
                <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px;">
                    <p>Hi ${name},</p>
                    
                    <p>Thanks for reaching out to MythToy. We have received your message and our team is reviewing it.</p>
                    
                    <p>Since we are a curated boutique team, we personally read and respond to every inquiry. Please allow us 12-24 hours to get back to you.</p>
                    
                    <div style="background-color: #f9f9f9; border-left: 4px solid #000; padding: 15px; margin: 20px 0; border-radius: 4px;">
                        <h4 style="margin-top: 0; margin-bottom: 10px;">In a hurry?</h4>
                        <ul style="list-style-type: none; padding-left: 0; margin: 0;">
                            <li style="margin-bottom: 8px;">
                                📦 <strong>Where is my order?</strong> <a href="https://mythtoy.com/pages/order-tracking" style="color: #E11D48; text-decoration: none;">Track Your Package Here</a>
                            </li>
                            <li style="margin-bottom: 8px;">
                                🚚 <strong>Shipping Times?</strong> <a href="https://mythtoy.com/pages/shipping-policy" style="color: #E11D48; text-decoration: none;">Read Shipping Policy</a>
                            </li>
                            <li>
                                🔒 <strong>Privacy Question?</strong> All orders are shipped in plain, unbranded packaging.
                            </li>
                        </ul>
                    </div>

                    <p>We appreciate your patience and will be in touch soon.</p>
                    
                    <p>Warmly,<br><strong>The MythToy Team</strong></p>
                </div>
            `
        });

        // 并行发送
        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };

    } catch (error) {
        console.error('Email error:', error);
        return { success: true };
    }
}