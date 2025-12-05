// app/layout.tsx
import { categoryService } from '@/services/category-service';
import { RootResponse } from '@/types/category';
import Notice from '@/components/common/notice';
import Navigation from '@/components/navigation/navigation';
import Footer from '@/components/footer';
import GARouteTracker from '@/components/analytics/ga-route-tracker';
import Script from 'next/script';
import { Suspense } from 'react';
import { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    metadataBase: new URL('https://mythtoy.com'),
    title: {
        default: 'MythToy - Curated Adult Pleasure | Discreet & Premium',
        template: '%s | MythToy',
    },
    description: 'Source factory direct adult toys. We curate the highest quality, body-safe silicone products with 100% discreet global shipping.',
    icons: {
        icon: '/icon.svg',
        apple: '/icon.svg',
    },
    manifest: '/site.webmanifest',
};

export const viewport: Viewport = {
    themeColor: 'black',
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
};

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
        <div className="relative flex flex-col min-h-screen w-full max-w-[100vw] overflow-x-clip bg-white">
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

            <Suspense fallback={null}>
                <GARouteTracker />
            </Suspense>

            <div className="w-full relative z-50">
                <Navigation rootsData={rootsData} />
                <Notice />
            </div>

            <main className="flex-grow w-full max-w-[100vw] overflow-x-clip">
                {children}
            </main>

            <div className="w-full max-w-[100vw] overflow-x-clip">
                <Footer />
            </div>
        </div>
    );
}