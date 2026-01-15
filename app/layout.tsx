import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google"; // ✅ 换成你实际用的字体
import "./globals.css";
import { Providers } from './providers';

// ✅ 1. 定义全局主字体 (Inter)
const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

// ✅ 2. 定义标题字体 (Playfair Display)
const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://mythtoy.com'),
    title: {
        default: 'MythToy - Premium Adult Lifestyle Products',
        template: '%s | MythToy',
    },
    description: 'Discover premium body-safe devices for wellness and intimacy. MythToy blends elegance with technology. Discreet shipping and secure checkout.',
    icons: {
        icon: '/icon.svg?v=2',
        shortcut: '/icon.svg?v=2',
        apple: '/apple-icon.png?v=2',
    },
    openGraph: {
        title: 'MythToy',
        description: 'Premium adult lifestyle products.',
        url: 'https://mythtoy.com',
        siteName: 'MythToy',
        locale: 'en_US',
        type: 'website',
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
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}