// app/(site)/layout.tsx
import { categoryService } from '@/services/category-service';
import { RootResponse } from '@/types/category';
import Notice from '@/components/common/notice';
import Navigation from '@/components/navigation/navigation';
import Footer from '@/components/footer';
import GARouteTracker from '@/components/analytics/ga-route-tracker';
import Script from 'next/script';
import { Suspense } from 'react';
import { Playfair_Display, Inter } from 'next/font/google';

// 字体配置
const playfair = Playfair_Display({
    subsets: ['latin'],
    variable: '--font-playfair',
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export default async function SiteLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    let rootsData: RootResponse[] = [];
    try {
        const roots = await categoryService.getRoots();
        rootsData = Array.isArray(roots) ? roots : [];
    } catch (error) {
        console.error('Failed to load categories:', error);
        rootsData = [];
    }

    const gaId = process.env.NODE_ENV === 'production' ? 'G-X0CTZ0DD1Q' : '';

    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "MythToy",
        "url": "https://mythtoy.com",
        "logo": "https://mythtoy.com/logo.svg",
        "description": "Premium adult lifestyle products direct from source.",
        "foundingDate": "2024",
        "sameAs": [
            "https://www.instagram.com/colinliyuan",
            "https://www.facebook.com/profile.php?id=61581471022682",
        ],
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@mythtoy.com",
            "contactType": "customer service",
            "availableLanguage": ["English", "Chinese"]
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
            />

            {gaId && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                    />
                    <Script
                        id="google-analytics-init"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                                    window.dataLayer = window.dataLayer || [];
                                    function gtag(){dataLayer.push(arguments);}
                                    gtag('js', new Date());
                                    gtag('config', '${gaId}');
                                `,
                        }}
                    />
                </>
            )}

            {/* ✅ 确保这里没有 <html> 或 <body>，只用 div */}
            <div className={`${playfair.variable} ${inter.variable} relative flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-white font-sans antialiased text-[#1A1A1A]`}>
                <Suspense fallback={null}>
                    <GARouteTracker />
                </Suspense>

                <div className="w-full relative z-50">
                    <Navigation rootsData={rootsData} />
                    <Notice />
                </div>

                <main className="flex-grow w-full max-w-[100vw]">
                    {children}
                </main>

                <div className="w-full max-w-[100vw]">
                    <Footer />
                </div>
            </div>
        </>
    );
}