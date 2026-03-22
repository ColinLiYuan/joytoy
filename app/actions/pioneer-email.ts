'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function submitPioneerApplication(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const social = formData.get('social') as string;
    const country = formData.get('country') as string;
    const pitch = formData.get('pitch') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Please provide a valid email.' };
    }

    try {
        // 1. 发送通知邮件给你自己
        await resend.emails.send({
            from: 'MythToy System <system@mythtoy.com>',

            to: 'support@mythtoy.com',

            subject: `[New Beta Applicant] ${name} from ${country}`,
            html: `
                <h2>New Pioneer Program Application</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Social:</strong> ${social}</p>
                <p><strong>Country:</strong> ${country}</p>
                <p><strong>Pitch:</strong></p>
                <p>${pitch}</p>
            `,
        });

        // 2. 发送确认邮件给申请者
        await resend.emails.send({
            from: 'MythToy <support@mythtoy.com>',
            to: email,
            subject: 'Application Received: The MythToy Pioneer Program',
            html: `
                <div style="background-color: #000; color: #fff; padding: 40px; font-family: serif;">
                    <h1 style="color: #D4AF37;">Into the Darkness.</h1>
                    <p>Hello ${name},</p>
                    <p>We've received your application for the Pioneer Program. Our team is reviewing your profile to see if it aligns with the 'Black Gold' collection's aesthetic.</p>
                    <p><strong>What's next?</strong></p>
                    <p>If selected, you'll receive a 100% OFF code for 'The Onyx' within 48 hours.</p>
                    <p>Stay elegant,</p>
                    <p>MythToy Team</p>
                </div>
            `,
        });

        return { success: true };
    } catch (error) {
        console.error('Pioneer submission error:', error);
        return { success: false, error: 'Submission failed. Please try again.' };
    }
}