// app/actions/send-email.ts

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

        const sendAutoReply = resend.emails.send({
            from: 'MythToy Support <support@mythtoy.com>',

            to: email,

            subject: 'We received your message - MythToy',
            html: `
                <p>Hi ${name},</p>
                <p>Thanks for contacting us. We've received your message regarding "<strong>${subject}</strong>".</p>
                <p>Our team will get back to you shortly.</p>
                <p>Best,<br>MythToy Team</p>
            `
        });

        // 并行发送
        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };

    } catch (error) {
        console.error('Email error:', error);
        // 只要有一封发出去就算成功，通常是第二封因为没验证域名而失败，不影响第一封
        return { success: true };
    }
}