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
          <section
              className="hero bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 bg-fixed bg-cover bg-center min-h-screen flex items-center relative"
              style={{
                backgroundImage: 'linear-gradient(rgba(76, 29, 149, 0.85), rgba(91, 33, 182, 0.9)), url(https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80)'
              }}
          >
            {/* 修复 SVG 背景 - 使用更简单的方式 */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none' stroke='white' stroke-opacity='0.3' stroke-width='0.5'%3E%3Ccircle cx='50' cy='50' r='1'/%3E%3C/svg%3E")`,
                  backgroundSize: '50px 50px'
                }}
            ></div>
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
              <div className="hero-content max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
                  Elevate Your Intimate Experience
                </h1>
                <p className="text-xl md:text-2xl text-gray-100 mb-10 drop-shadow-md font-medium">
                  Discover premium, body-safe products designed for exploration, pleasure, and wellness.
                </p>
                <a
                    href="/collections"
                    className="inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg relative overflow-hidden group"
                >
                  <span className="relative z-10">Explore Collections</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </a>
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

          {/* Best Sellers Section */}
          <section id="bestsellers" className="bestsellers-products py-20 bg-white relative">
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-pink-500 to-transparent"></div>
            <div className="container max-w-6xl mx-auto px-4 sm:px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-semibold text-purple-800 text-center mb-12 relative">
                Best Sellers
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mt-3"></div>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {bestSellers.length > 0 ? (
                    bestSellers
                        .filter(product => product?.id)
                        .map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))
                ) : (
                    <div className="col-span-2 text-gray-500">No products available</div>
                )}
              </div>

              <a href="/collections/best-sellers" className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg">
                View All Best Sellers
              </a>
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

// 产品卡片组件
function ProductCard({ product }: { product: ProductResponse }) {
  const productDetailPath = `/toys${product.slug || ''}`;

  return (
      <div className="product-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-pink-50 group">
        <a href={productDetailPath} className="product-link block h-full">
          <div className="product-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
            <img
                src={`${product.baseUrl}/${product.image}`}
                alt={product.title}
                className="product-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-105"
                loading="lazy"
            />
          </div>
          <div className="product-info p-6">
            <h3 className="text-lg font-semibold text-purple-800 mb-3 line-clamp-2">{product.title}</h3>
            <div className="price-container flex items-center gap-2">
              <span className="current-price font-bold text-xl text-red-600 font-inter tracking-tight">${product.currentPrice}</span>
              {product.originalPrice > product.currentPrice && (
                  <span className="original-price text-base text-gray-400 line-through font-normal">${product.originalPrice}</span>
              )}
            </div>
          </div>
        </a>
      </div>
  );
}