// app/route.tsx - 服务端组件
import { ProductResponse } from '@/types/product';
import { productServiceServer } from '@/services/servers/product-service-server';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWhatsapp,
  faFacebookF,
  faInstagram
} from '@fortawesome/free-brands-svg-icons';
import {
  faLock,
  faCertificate,
  faShieldAlt,
  faUserMd
} from '@fortawesome/free-solid-svg-icons';
import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';

// 生成页面元数据
export async function generateMetadata() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';
  const ogImageUrl = `${siteUrl}/og-image.jpg`;

  return {
    title: "MythToy - Premium Adult Lifestyle Products",
    description: "Discover premium, body-safe adult toys and lingerie for exploration, pleasure, and wellness. Discreet shipping and secure checkout.",
    keywords: "adult toys, lingerie, body-safe, discreet shipping, MythToy",

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
    // process.stderr.write("Home page fetched products: ${products}");

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
        {/* 结构化数据 */}
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* 客户端年龄验证组件 */}
        <ClientAgeVerification />

        {/* 主内容 - 服务端渲染 */}
        <div id="main-content">
          {/* Hero Section */}
          <HeroSection />

          {/* Best Sellers Section */}
          <BestSellersSection bestSellers={bestSellers} error={error} />

          {/* Categories Section */}
          <CategoriesSection />

          {/* Trust Signals Section */}
          <section id="trust" className="trust-signals py-20 bg-gradient-to-br from-pink-50 to-pink-100 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-purple-800 text-center mb-12 relative">
                Why Choose MythToy
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mt-3"></div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Discreet Shipping */}
                <div className="trust-item bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <FontAwesomeIcon
                      icon={faLock}
                      className="text-5xl mb-6 bg-gradient-to-br from-pink-600 to-purple-700 bg-clip-text text-transparent"
                      aria-label="Discreet Shipping"
                  />
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Discreet Shipping</h3>
                  <p className="text-gray-700 leading-relaxed">Plain packaging with no indication of contents</p>
                </div>

                {/* Body-Safe Materials */}
                <div className="trust-item bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <FontAwesomeIcon
                      icon={faCertificate}
                      className="text-5xl mb-6 bg-gradient-to-br from-pink-600 to-purple-700 bg-clip-text text-transparent"
                      aria-label="Body-Safe Materials Certification"
                  />
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Body-Safe Materials</h3>
                  <p className="text-gray-700 leading-relaxed">All products made from premium, non-toxic materials</p>
                </div>

                {/* Secure Checkout */}
                <div className="trust-item bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <FontAwesomeIcon
                      icon={faShieldAlt}
                      className="text-5xl mb-6 bg-gradient-to-br from-pink-600 to-purple-700 bg-clip-text text-transparent"
                      aria-label="Secure Checkout Protection"
                  />
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Secure Checkout</h3>
                  <p className="text-gray-700 leading-relaxed">Your privacy and data security are our priority</p>
                </div>

                {/* Expert Approved */}
                <div className="trust-item bg-white p-10 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <FontAwesomeIcon
                      icon={faUserMd}
                      className="text-5xl mb-6 bg-gradient-to-br from-pink-600 to-purple-700 bg-clip-text text-transparent"
                      aria-label="Expert Approved Products"
                  />
                  <h3 className="text-xl font-semibold text-purple-800 mb-4">Expert Approved</h3>
                  <p className="text-gray-700 leading-relaxed">Products recommended by intimacy experts</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
  );
}