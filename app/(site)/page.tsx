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
import ProductCard from '@/components/product/product-card';
import Link from 'next/link';

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
          {/* Hero Section - b62337 修正版本 */}
          <section className="hero w-full relative overflow-hidden">

            {/* 背景色容器 - 只在容器内显示红色 */}
            <div className="w-full container mx-auto px-4 max-w-7xl relative overflow-hidden">

              {/* 红色背景只限制在容器内 */}
              <div className="bg-[#b62337] w-full relative overflow-hidden">

                {/* 深度渐变背景 - 增加层次感 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#b62337] via-[#a51e32] to-[#941a2d]"></div>

                {/* 中心柔和光晕 */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d12a42]/30 via-transparent to-transparent"></div>

                {/* 顶部柔和光源 */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent"></div>

                {/* 微妙的丝绸纹理 */}
                <div
                    className="absolute inset-0 opacity-[0.02]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                      backgroundSize: '300px 300px'
                    }}
                ></div>

                {/* 内容区域 */}
                <div className="hero-content w-full aspect-square sm:aspect-auto sm:min-h-[40vh] mx-auto flex items-center justify-center text-center py-8 sm:py-16 relative z-10">
                  <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
                    {/* 优惠码 - 突出但不刺眼 */}
                    <span className="text-white/90 text-sm font-medium tracking-wide">
                      USE CODE: <span className="font-bold text-white ml-1">MYTH20</span>
                    </span>

                    {/* 副标题 - 优雅吸引人 */}
                    <p className="text-base md:text-lg lg:text-xl text-white font-medium tracking-wider uppercase mb-1 md:mb-2 font-['Playfair_Display']">
                      Your First Order?
                    </p>

                    {/* 主标题 - 强烈吸引眼球 */}
                    <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 md:mb-4 leading-tight font-['Playfair_Display'] drop-shadow-lg">
                      20% OFF
                    </h1>

                    {/* 促销信息 - 清晰易读 */}
                    <p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-6 md:mb-8 font-['Playfair_Display']">
                      Free Shipping on $40+
                    </p>

                    {/* CTA 按钮 - 去掉白色边框 */}
                    <a
                        href="/collections/all"
                        className="inline-block bg-black hover:bg-gray-900 text-white font-bold py-3 md:py-4 px-10 md:px-12 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg relative overflow-hidden group text-base md:text-lg min-w-[160px] md:min-w-[180px] font-['Playfair_Display']"
                    >
                      <span className="relative z-10">SHOP NOW</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="bestsellers" className="bestsellers py-8 bg-white">
            <div className="container max-w-7xl mx-auto px-4">
              {/* 标题区域 - 左对齐设计 */}
              <div className="text-left mb-6">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">
                  Best Sellers
                </h2>
                <p className="text-gray-600 font-['Inter']">
                  Most loved products for ultimate pleasure
                </p>
              </div>

              {/* 产品网格 */}
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {bestSellers.length > 0 ? (
                    bestSellers
                        .filter(product => product?.id)
                        .map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))
                ) : (
                    <div className="col-span-4 text-center py-8">
                      <div className="text-gray-500">No products available</div>
                    </div>
                )}
              </div>
            </div>
          </section>

          {/* Error Display */}
          {error && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg text-center">
                {error}
              </div>
          )}

          {/* Categories Section */}
          <section id="categories" className="categories py-20 bg-gradient-to-br from-pink-50 to-pink-100 relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            <div className="container max-w-6xl mx-auto px-4 sm:px-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-purple-800 text-center mb-12 relative">
                Shop By Category
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mt-3"></div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* For Her */}
                <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                        src={'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/forHer.jpg'}
                        alt="Luxury adult toys for women, pastel colors, quiet motor, perfect for self-care and intimate moments"
                        className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                    />
                  </div>
                  <div className="category-content p-8 text-center">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">For Her</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">Curated Adult Toys for Women - Comfort, Discretion & Pleasure</p>
                    <a
                        href="/collections/female-sex-toys"
                        className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      Shop Women's Collection
                    </a>
                  </div>
                </div>

                {/* For Him */}
                <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                        src={'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/forHim.jpg'}
                        alt="High-quality male adult toys, including prostate massagers and masturbators, body-safe materials, realistic and silicone texture"
                        className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                    />
                  </div>
                  <div className="category-content p-8 text-center">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">For Him</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">His Pleasure Toys: Body-Safe Masturbators & Prostate Devices</p>
                    <a
                        href="/collections/male-sex-toys"
                        className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      Shop Men's Collection
                    </a>
                  </div>
                </div>

                {/* Sex Toys */}
                <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                        src={'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/sexToy.jpg'}
                        alt="Diverse collection of adult sex toys, body-safe silicone and ABS materials, suitable for couples and solo use"
                        className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                    />
                  </div>
                  <div className="category-content p-8 text-center">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Sex Toys</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">Premium Sex Toys Connection: For Couples & Solo Play</p>
                    <a
                        href="/collections/sex-toys"
                        className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      Shop Sex Toys Collection
                    </a>
                  </div>
                </div>

                {/* Lingerie */}
                <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                  <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img
                        src={'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev/lingerie.jpg'}
                        alt="Elegant intimate apparel, including babydolls and corsets, designed to enhance confidence and romance"
                        className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                        loading="lazy"
                    />
                  </div>
                  <div className="category-content p-8 text-center">
                    <h3 className="text-xl font-semibold text-purple-800 mb-4">Lingerie</h3>
                    <p className="text-gray-700 mb-6 leading-relaxed">Her Lingerie Collection: Babydolls, Corsets & Comfortable Silk Panties</p>
                    <a
                        href="/collections/lingerie"
                        className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      Shop Lingerie Collection
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

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