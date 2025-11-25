// app/(site)/layout.tsx
import { categoryService } from '@/services/category-service';
import { RootResponse } from '@/types/category';
import Notice from '@/components/common/notice';
import Navigation from '@/components/navigation/navigation';
import Footer from '@/components/footer';
import GARouteTracker from '@/components/analytics/ga-route-tracker';
import Script from 'next/script';
import { Suspense } from 'react';

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

    // 环境判断
    const gaId = process.env.NODE_ENV === 'production' ? 'G-X0CTZ0DD1Q' : '';

    // Site Logo 结构化数据
    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "MythToy",
        "url": "https://mythtoy.com",
        "logo": "https://mythtoy.com/logo.png",
        "description": "Premium adult lifestyle products for exploration, pleasure, and wellness.",
        // "sameAs": [
        //     "https://www.facebook.com/yourpage",
        //     "https://www.instagram.com/yourprofile",
        //     "https://twitter.com/yourhandle"
        // ],
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@mythtoy.com",
            "contactType": "customer service"
        }
    };

    return (
        <div>
            {/* Site Logo 结构化数据 - 只需要在这里添加一次 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
            />

            {/* 只有生产环境加载GA脚本 */}
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

            {/* 用 Suspense 包装 GARouteTracker */}
            <Suspense fallback={null}>
                <GARouteTracker />
            </Suspense>

            <Navigation rootsData={rootsData} />
            <Notice />
            {children}
            <Footer />
        </div>
    );
}