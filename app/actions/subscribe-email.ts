// app/actions/subscribe-email.ts

'use server';

import nodemailer from 'nodemailer';
import { Resend } from 'resend';

// 保持 Resend 用于发送给客户（因为发给 Outlook/Gmail 没问题）
const resend = new Resend(process.env.RESEND_API_KEY);

// 配置阿里 SMTP 用于发送通知给自己
const transporter = nodemailer.createTransport({
    host: "smtp.qiye.aliyun.com",
    port: 465,
    secure: true, // 使用 SSL
    auth: {
        user: "system@mythtoy.com",
        // 注意：建议在阿里邮箱设置中开启“三方客户端安全密码”或使用登录密码
        pass: "Yuaikjn$jndjjj2255",
    },
});

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    try {
        // --- 1. 使用阿里 SMTP 发送通知给自己 ---
        // 阿里发给阿里，属于内部信任，100% 不会被拦截
        await transporter.sendMail({
            from: '"MythToy System" <system@mythtoy.com>',
            to: "support@mythtoy.com",
            subject: `[New Subscriber] ${email}`,
            text: `New sub: ${email}`,
            html: `<b>New user subscribed:</b> ${email}`,
        });

        // --- 2. 使用 Resend 发送欢迎邮件给客户 ---
        // 之前测试显示 Resend 发给外部邮箱（如 Outlook）是正常的
        try {
            await resend.emails.send({
                from: 'MythToy System <no-reply@mythtoy.com>',
                to: email,
                subject: 'Welcome! Here is your 10% OFF Code',
                html: `
                    <h1>Welcome to the Club!</h1>
                    <p>Thanks for subscribing. As promised, here is your discount code:</p>
                    <h2 style="color: #d63031; font-size: 24px;">MYTH10</h2>
                    <p>Use this code at checkout to get 10% off your first order.</p>
                    <br/>
                    <a href="https://mythtoy.com/collections/all">Shop Now</a>
                `,
            });
        } catch (emailError) {
            console.log('无法发送给客户 (可能是 Resend 侧问题):', emailError);
        }

        return { success: true, code: 'MYTH10' };
    } catch (error) {
        console.error('Subscribe error:', error);
        return { success: false, error: 'Failed to subscribe' };
    }
}