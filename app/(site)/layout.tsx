import { categoryService } from '@/services/category-service';
import { RootResponse } from '@/types/category';
import Notice from '@/components/common/notice';
import Navigation from '@/components/navigation/navigation';
import Footer from '@/components/footer';
import GARouteTracker from '@/components/analytics/ga-route-tracker';
import Script from 'next/script';
import { Suspense } from 'react';
import AffiliateTracker from '@/components/common/AffiliateTracker';
// ❌ 不需要再在这里引入 next/font 了

export default async function SiteLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    let rootsData: RootResponse[] = [];

    // ✅ 保持 API 请求的安全性
    try {
        // 建议：如果 categoryService 内部没有 timeout 机制，
        // 最好在这里或者 service 内部加上，防止 database 死锁导致前端卡死
        rootsData = await categoryService.getRoots() || [];
    } catch (error) {
        console.error('Failed to load categories in layout:', error);
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
            "https://www.instagram.com/myth.w.studio",
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
            {/* JSON-LD 结构化数据 */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
            />

            {/* Google Analytics */}
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

            {/* ✅ 这里的 div 不再需要字体变量，因为 RootLayout 已经给了 */}
            <div className="relative flex flex-col min-h-screen w-full">
                <Suspense fallback={null}>
                    <GARouteTracker />
                    <AffiliateTracker />
                </Suspense>

                <div className="w-full relative z-50">
                    <Navigation rootsData={rootsData} />
                    <Notice />
                </div>

                <main className="flex-grow w-full">
                    {children}
                </main>

                <div className="w-full">
                    <Footer />
                </div>
            </div>
        </>
    );
}