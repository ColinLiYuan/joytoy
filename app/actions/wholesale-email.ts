// app/actions/wholesale-email.ts
'use server';

import { Resend } from 'resend';

// 确保你在 .env.local 中配置了 RESEND_API_KEY
const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitWholesaleForm(formData: FormData) {
    // 1. 提取批发表单特有的字段
    const contactName = formData.get('contactName') as string;
    const businessName = formData.get('businessName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const businessType = formData.get('businessType') as string;
    const volume = formData.get('volume') as string; // 预估销量
    const message = formData.get('message') as string;

    // 2. 基础验证
    if (!contactName || !email) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
        // 3. 发送通知邮件给你 (Admin)
        const sendToAdmin = resend.emails.send({
            // 使用 system 发送，避免被垃圾邮件拦截
            from: 'MythToy System <system@mythtoy.com>',

            to: 'wholesale@mythtoy.com',
            replyTo: email, // 直接点击回复即可回复客户

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

        // 4. 发送自动回复给客户 (建立专业形象)
        const sendAutoReply = resend.emails.send({
            // 发件人显示为 MythToy Wholesale
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

        // 并行发送，提高速度
        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };

    } catch (error) {
        console.error('Wholesale Email error:', error);
        // 即使 Resend 报错（比如域名验证问题），在前端也返回成功，
        // 防止让真正的 B2B 客户感到困惑，你可以在后台看日志排查。
        return { success: false, error: 'Failed to send email' };
    }
}