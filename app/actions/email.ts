// app/actions/email.ts
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
        pass: "Yuaikjn$jndjjj2255",
    },
});

/**
 * 联系表单邮件
 */
export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    if (!name || !email || !message) {
        return { success: false, error: 'Missing required fields' };
    }

    try {
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

        await Promise.all([sendToAdmin, sendAutoReply]);

        return { success: true };
    } catch (error) {
        console.error('Email error:', error);
        return { success: true };
    }
}

/**
 * Pioneer 申请邮件
 */
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

/**
 * 邮件订阅
 */
export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address' };
    }

    try {
        await transporter.sendMail({
            from: '"MythToy System" <system@mythtoy.com>',
            to: "support@mythtoy.com",
            subject: `[New Subscriber] ${email}`,
            text: `New sub: ${email}`,
            html: `<b>New user subscribed:</b> ${email}`,
        });

        try {
            await resend.emails.send({
                from: 'MythToy System <no-reply@mythtoy.com>',
                to: email,
                subject: 'Welcome! Here is your 15% OFF Code',
                html: `
                    <h1>Welcome to the Club!</h1>
                    <p>Thanks for subscribing. As promised, here is your discount code:</p>
                    <h2 style="color: #d63031; font-size: 24px;">MYTH15</h2>
                    <p>Use this code at checkout to get 15% off your first order.</p>
                    <br/>
                    <a href="https://mythtoy.com/collections/all">Shop Now</a>
                `,
            });
        } catch (emailError) {
            console.log('无法发送给客户 (可能是 Resend 侧问题):', emailError);
        }

        return { success: true, code: 'MYTH15' };
    } catch (error) {
        console.error('Subscribe error:', error);
        return { success: false, error: 'Failed to subscribe' };
    }
}

/**
 * 批发申请邮件
 */
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
