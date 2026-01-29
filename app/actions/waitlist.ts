// app/actions/waitlist.ts
'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function joinWaitlist(formData: FormData) {
    const email = formData.get('email') as string;
    const productTitle = formData.get('productTitle') as string;
    const skuColor = formData.get('skuColor') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    try {
        // 1. 发送通知给 Support 团队 (告知有人在等待这个产品)
        await resend.emails.send({
            from: 'MythToy System <system@mythtoy.com>',
            to: 'support@mythtoy.com',
            subject: `[Waitlist] New Request for ${productTitle}`,
            html: `
                <h2>New Waitlist Request</h2>
                <p><strong>User Email:</strong> ${email}</p>
                <p><strong>Product:</strong> ${productTitle}</p>
                <p><strong>Variant/Color:</strong> ${skuColor}</p>
                <p>Please restock soon!</p>
            `,
        });

        // 2. (可选) 发送确认邮件给用户
        try {
            await resend.emails.send({
                from: 'MythToy <support@mythtoy.com>',
                to: email,
                subject: 'You are on the list! - MythToy',
                html: `
                    <h1>You're on the list!</h1>
                    <p>Hi there,</p>
                    <p>We've noted that you are waiting for <strong>${productTitle} (${skuColor})</strong>.</p>
                    <p>We will email you the moment it becomes available again.</p>
                    <br/>
                    <p>Best,<br/>The MythToy Team</p>
                `,
            });
        } catch (clientError) {
            console.error('Failed to send confirmation to client:', clientError);
            // 不阻断流程，只要通知到管理员即可
        }

        return { success: true };
    } catch (error) {
        console.error('Waitlist error:', error);
        return { success: false, error: 'Failed to join waitlist' };
    }
}