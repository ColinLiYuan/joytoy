// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from './providers';

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
    display: 'swap',
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
    display: 'swap',
});

// 🚀 配置视口
export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
};

// 🚀 全局 SEO 默认配置
export const metadata: Metadata = {
    metadataBase: new URL('https://mythtoy.com'),
    title: {
        default: 'MythToy - Premium Adult Lifestyle Products',
        template: '%s | MythToy',
    },
    description: 'Find the best toys, figures and collectibles at MythToy. Discreet shipping and secure checkout.',
    icons: {
        icon: '/icon.svg',
        shortcut: '/icon.svg',
        apple: '/icon.svg',
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    );
}