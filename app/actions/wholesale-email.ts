// app/actions/wholesale-email.ts
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
        pass: "Yuaikjn$jndjjj2255", // 建议使用阿里后台生成的授权码
    },
});

export async function submitWholesaleForm(formData: FormData) {
    const contactName = formData.get('contactName') as string;
    const businessName = formData.get('businessName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const businessType = formData.get('businessType') as string;
    const volume = formData.get('volume') as string;
    const message = formData.get('message') as string;

    if (!contactName || !email) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // --- 1. 使用阿里 SMTP 发送询盘通知给自己 ---
        // 这样可以彻底绕过 Resend 在阿里端的拦截
        const sendToAdmin = transporter.sendMail({
            from: '"MythToy System" <system@mythtoy.com>',
            to: 'wholesale@mythtoy.com',
            replyTo: email,
            subject: `[Wholesale Inquiry] ${businessName || contactName} - ${businessType}`,
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <h2 style="border-bottom: 2px solid #000; padding-bottom: 10px;">New Wholesale Application</h2>
                    <div style="background:#f9f9f9; padding:20px; border-radius:8px; margin-bottom: 20px;">
                        <h3 style="margin-top: 0;">Contact Details</h3>
                        <p><strong>Name:</strong> ${contactName}</p>
                        <p><strong>Business Name:</strong> ${businessName || 'N/A'}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone/WhatsApp:</strong> ${phone || 'N/A'}</p>
                    </div>
                    <div style="background:#f0fdf4; padding:20px; border-radius:8px; border: 1px solid #bbf7d0;">
                        <h3 style="margin-top: 0;">Business Profile</h3>
                        <p><strong>Type:</strong> ${businessType}</p>
                        <p><strong>Est. Monthly Volume:</strong> ${volume}</p>
                    </div>
                    <div style="margin-top: 20px;">
                        <h3>Message / Requirements:</h3>
                        <div style="background:#fff; padding:15px; border:1px solid #ddd; border-radius:5px;">
                            ${message ? message.replace(/\n/g, '<br>') : 'No specific message.'}
                        </div>
                    </div>
                </div>
            `
        });

        // --- 2. 使用 Resend 发送自动回复给客户 ---
        // 客户通常使用 Gmail/Outlook，Resend 的送达表现更好
        const sendAutoReply = resend.emails.send({
            from: 'MythToy Wholesale <wholesale@mythtoy.com>',
            to: email,
            subject: 'We received your wholesale inquiry - MythToy',
            html: `
                <div style="font-family: sans-serif; color: #333;">
                    <p>Hi ${contactName},</p>
                    <p>Thank you for your interest in partnering with <strong>MythToy</strong>.</p>
                    <p>We have received your inquiry regarding wholesale opportunities for <strong>${businessName || 'your business'}</strong>.</p>
                    <p>Our sales team is currently reviewing your details. You can expect to receive our <strong>Product Catalog and Wholesale Price List</strong> within the next 24 hours.</p>
                    <p>In the meantime, feel free to browse our retail collection at <a href="https://mythtoy.com">mythtoy.com</a>.</p>
                    <br>
                    <p>Best Regards,</p>
                    <p><strong>Colin Li</strong><br>Sales Manager | MythToy</p>
                </div>
            `
        });

        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };

    } catch (error) {
        console.error('Wholesale Email error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}