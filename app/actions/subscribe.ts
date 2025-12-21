// app/actions/subscribe.ts

'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    try {
        await resend.emails.send({
            from: 'MythToy System <system@mythtoy.com>',

            to: 'support@mythtoy.com',

            subject: '[New Subscriber]',
            text: `New sub: ${email}`,
        });

        try {
            await resend.emails.send({
                from: 'MythToy <support@mythtoy.com>',

                to: email,

                subject: 'Welcome! Here is your 20% OFF Code',
                html: `
                    <h1>Welcome to the Club!</h1>
                    <p>Thanks for subscribing. As promised, here is your discount code:</p>
                    <h2 style="color: #d63031; font-size: 24px;">MYTH20</h2>
                    <p>Use this code at checkout to get 20% off your first order.</p>
                    <br/>
                    <a href="https://mythtoy.com/collections/all">Shop Now</a>
                `,
            });
        } catch (emailError) {
            console.log('无法发送给客户(可能是域名未验证):', emailError);
        }

        return { success: true, code: 'MYTH20' };
    } catch (error) {
        console.error('Subscribe error:', error);
        return { success: false, error: 'Failed to subscribe' };
    }
}