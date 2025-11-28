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

    const gaId = process.env.NODE_ENV === 'production' ? 'G-X0CTZ0DD1Q' : '';

    const organizationStructuredData = {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "MythToy",
        "url": "https://mythtoy.com",
        "logo": "https://mythtoy.com/logo.png",
        "description": "Premium adult lifestyle products.",
        "contactPoint": {
            "@type": "ContactPoint",
            "email": "support@mythtoy.com",
            "contactType": "customer service"
        }
    };

    return (
        // ✅ 核心修复：
        // 1. max-w-[100vw]: 强制最大宽度为视口宽度
        // 2. overflow-x-clip: 比 hidden 更强硬的裁剪属性 (Tailwind class)
        // 3. position: relative: 确保内部绝对定位元素以它为边界
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

            {/* 导航栏区域 */}
            <div className="w-full relative z-50">
                <Navigation rootsData={rootsData} />
                <Notice />
            </div>

            {/* 主内容区域 - 再次加固 */}
            <main className="flex-grow w-full max-w-[100vw] overflow-x-clip">
                {children}
            </main>

            {/* Footer */}
            <div className="w-full max-w-[100vw] overflow-x-clip">
                <Footer />
            </div>
        </div>
    );
}