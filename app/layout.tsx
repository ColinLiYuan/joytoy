import type { Metadata, Viewport } from "next";
// import { Playfair_Display, Inter } from "next/font/google"; // ❌ 注释掉，避免 Turbopack 网络问题
import { Suspense } from "react";
import "./globals.css";
import { Providers } from './providers';
import AffiliateRedirectHandler from '@/components/common/affiliate-redirect-handler';

// ✅ 使用系统字体替代 Google Fonts（避免 Turbopack 构建时的网络问题）
const inter = {
    variable: '--font-inter',
    className: 'font-sans',
};

const playfair = {
    variable: '--font-playfair',
    className: 'font-serif',
};

export const viewport: Viewport = {
    themeColor: [
        { media: '(prefers-color-scheme: dark)', color: 'black' },
        { media: '(prefers-color-scheme: light)', color: 'white' },
    ],
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'),
    title: {
        default: 'MythToy - Premium Adult Lifestyle Products',
        template: '%s | MythToy',
    },
    description: 'Discover premium body-safe devices for wellness and intimacy. MythToy blends elegance with technology. Discreet shipping and secure checkout.',
    keywords: [
        'adult toys',
        'premium vibrators',
        'body-safe products',
        'discreet shipping',
        'wellness products',
        'intimate accessories',
        'luxury adult lifestyle'
    ],
    authors: [{ name: 'MythToy Team' }],
    creator: 'MythToy',
    publisher: 'MythToy',
    formatDetection: {
        email: false,
        address: false,
        telephone: false,
    },
    icons: {
        icon: '/icon_v2.png?v=3',
        shortcut: '/icon_v2.png?v=3',
        apple: '/apple-icon.png?v=2',
    },
    manifest: '/site.webmanifest',
    openGraph: {
        title: 'MythToy - Premium Adult Lifestyle Products',
        description: 'Discover premium body-safe devices for wellness and intimacy. Elegant design meets cutting-edge technology.',
        url: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com',
        siteName: 'MythToy',
        locale: 'en_US',
        type: 'website',
        images: [
            {
                url: '/opengraph-image',
                width: 1200,
                height: 630,
                alt: 'MythToy - Premium Adult Lifestyle Products',
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'MythToy - Premium Adult Lifestyle Products',
        description: 'Discover premium body-safe devices for wellness and intimacy.',
        images: ['/opengraph-image'],
        creator: '@mythtoy',
    },
    alternates: {
        canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    other: {
        rating: 'adult',
    },
    verification: {
        // 添加 Google Search Console 验证（需要时取消注释）
        // google: 'your-google-verification-code',
        // bing: 'your-bing-verification-code',
    },
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
        {/* ✅ 将字体变量注入 Body，全局生效，无需在子 Layout 重复定义 */}
        <body className={`${inter.variable} ${playfair.variable} font-sans antialiased w-full max-w-[100vw] overflow-x-hidden bg-white text-[#1A1A1A]`} suppressHydrationWarning>
        <Suspense fallback={null}>
            <AffiliateRedirectHandler />
        </Suspense>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}