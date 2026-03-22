// app/actions/contact-email.ts
'use server';

import { Resend } from 'resend';
import nodemailer from 'nodemailer';

const resend = new Resend(process.env.RESEND_API_KEY);

// 配置阿里 SMTP 用于发送通知给管理员 (内部通知)
const transporter = nodemailer.createTransport({
    host: "smtp.qiye.aliyun.com",
    port: 465,
    secure: true,
    auth: {
        user: "system@mythtoy.com",
        pass: "Yuaikjn$jndjjj2255", // 记得在阿里后台生成的那个专门的授权码
    },
});

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // --- 1. 使用阿里 SMTP 发送询盘通知给自己 ---
        // 阿里服务器识别到是内部发信，会直接投递到 support@mythtoy.com 的收件箱
        const sendToAdmin = transporter.sendMail({
            from: '"MythToy System" <system@mythtoy.com>',
            to: 'support@mythtoy.com',
            replyTo: email,
            subject: `[New Inquiry] ${subject}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h3 style="border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Message from ${name}</h3>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Subject:</strong> ${subject}</p>
                    <div style="background:#f4f4f4; padding:15px; border-radius:5px; margin-top: 10px;">
                        <strong>Message:</strong><br>
                        ${message.replace(/\n/g, '<br>')}
                    </div>
                </div>
            `
        });

        // --- 2. 使用 Resend 发送自动回复给客户 ---
        // 客户侧对 Resend 的 SPF/DMARC 验证已经通过了，可以放心发送
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
                        </ul>
                    </div>
                    <p>Warmly,<br><strong>The MythToy Team</strong></p>
                </div>
            `
        });

        // 并行发送
        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };

    } catch (error) {
        console.error('Email error:', error);
        // 这里的逻辑保持你原来的：即使报错也返回 success，防止前端显示错误影响用户体验
        return { success: true };
    }
}