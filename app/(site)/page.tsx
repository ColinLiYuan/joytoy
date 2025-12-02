// app/route.tsx - 服务端组件
import { ProductResponse } from '@/types/product';
import { productServiceServer } from '@/services/servers/product-service-server';
import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';
import TrustSignals from '@/components/home/trust-signals';

// 生成页面元数据
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  return {
    title: "MythToy - Premium Adult Lifestyle Products",
    description: "Discover premium, body-safe adult toys and lingerie for exploration, pleasure, and wellness. Discreet shipping and secure checkout.",
    keywords: "adult toys, lingerie, body-safe, discreet shipping, MythToy",

    alternates: {
      canonical: siteUrl,
    },

    // Open Graph
    openGraph: {
      title: "MythToy - Premium Adult Lifestyle Products",
      description: "Discover premium, body-safe adult toys and lingerie for exploration, pleasure, and wellness.",
      type: "website",
      url: siteUrl,
      siteName: "MythToy",
      locale: "en_US",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: 'MythToy - Premium Adult Lifestyle Products',
          type: 'image/jpeg',
        },
      ],
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: "MythToy - Premium Adult Lifestyle Products",
      description: "Discover premium, body-safe adult toys and lingerie for exploration, pleasure, and wellness.",
      images: [ogImageUrl],
      creator: '@mythtoy',
    },

    robots: {
      index: true,
      follow: true,
    },
    other: {
      'rating': 'adult',
      'age-verified': 'true'
    }
  };
}

// 结构化数据
const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "MythToy",
  "url": "https://mythtoy.com",
  "description": "Premium adult lifestyle products for exploration, pleasure, and wellness.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://mythtoy.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default async function HomePage() {
    // 服务端获取数据
    let bestSellers: ProductResponse[] = [];
    let error: string | null = null;

    try {
        const products = await productServiceServer.getHeroProducts();
        if (Array.isArray(products)) {
            bestSellers = products;
        } else {
            throw new Error('Invalid products data format');
        }
    } catch (err) {
        console.error('Error fetching products:', err);
        error = 'Failed to load products';
        bestSellers = [];
    }

    return (
        <>
            {/* ... scripts ... */}
            <ClientAgeVerification />

            {/* ✅ 修复：移除 id="main-content" 上可能存在的任何 width/padding 类 */}
            {/* 直接作为一个纯净的容器，或者干脆去掉这个 div，用 Fragment 包裹 */}
            <div className="w-full max-w-full overflow-x-hidden">
                <HeroSection />
                <BestSellersSection bestSellers={bestSellers} error={error} />
                <CategoriesSection />
                <TrustSignals />
            </div>
        </>
    );
}