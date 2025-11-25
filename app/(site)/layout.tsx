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
        // ✅ 修复点：给最外层 div 加上 overflow-x-hidden 和 w-full
        <div className="relative w-full max-w-full overflow-x-hidden min-h-screen flex flex-col bg-white">

            {/* ... Scripts 保持不变 ... */}

            <Suspense fallback={null}>
                <GARouteTracker />
            </Suspense>

            <Navigation rootsData={rootsData} />
            <Notice />

            {/* ✅ 优化：给主内容区加上 flex-grow，确保 Footer 沉底 */}
            <main className="flex-grow w-full">
                {children}
            </main>

            <Footer />
        </div>
    );
}