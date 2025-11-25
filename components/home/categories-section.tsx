// components/home/categories-section.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';

// 分类图片配置
const categoryImages = {
    forHer: {
        src: 'forHer.jpg',
        alt: "Luxury adult toys for women, pastel colors, quiet motor, perfect for self-care and intimate moments"
    },
    forHim: {
        src: 'forHim.jpg',
        alt: "High-quality male adult toys, including prostate massagers and masturbators, body-safe materials, realistic and silicone texture"
    },
    sexToy: {
        src: 'sexToy.jpg',
        alt: "Diverse collection of adult sex toys, body-safe silicone and ABS materials, suitable for couples and solo use"
    },
    lingerie: {
        src: 'lingerie.jpg',
        alt: "Elegant intimate apparel, including babydolls and corsets, designed to enhance confidence and romance"
    }
};

export default function CategoriesSection() {
    return (
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
                            <Image
                                src={getProductImageUrl('', categoryImages.forHer.src)}
                                alt={categoryImages.forHer.alt}
                                width={400}
                                height={256}
                                className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="category-content p-8 text-center">
                            <h3 className="text-xl font-semibold text-purple-800 mb-4">For Her</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">Curated Adult Toys for Women - Comfort, Discretion & Pleasure</p>
                            <Link
                                href="/collections/female-sex-toys"
                                className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                Shop Women's Collection
                            </Link>
                        </div>
                    </div>

                    {/* For Him */}
                    <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                        <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                                src={getProductImageUrl('', categoryImages.forHim.src)}
                                alt={categoryImages.forHim.alt}
                                width={400}
                                height={256}
                                className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="category-content p-8 text-center">
                            <h3 className="text-xl font-semibold text-purple-800 mb-4">For Him</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">His Pleasure Toys: Body-Safe Masturbators & Prostate Devices</p>
                            <Link
                                href="/collections/male-sex-toys"
                                className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                Shop Men's Collection
                            </Link>
                        </div>
                    </div>

                    {/* Sex Toys */}
                    <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                        <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                                src={getProductImageUrl('', categoryImages.sexToy.src)}
                                alt={categoryImages.sexToy.alt}
                                width={400}
                                height={256}
                                className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="category-content p-8 text-center">
                            <h3 className="text-xl font-semibold text-purple-800 mb-4">Sex Toys</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">Premium Sex Toys Connection: For Couples & Solo Play</p>
                            <Link
                                href="/collections/sex-toys"
                                className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                Shop Sex Toys Collection
                            </Link>
                        </div>
                    </div>

                    {/* Lingerie */}
                    <div className="category-card bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 relative group">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600"></div>
                        <div className="category-img-container h-64 bg-gray-50 flex items-center justify-center overflow-hidden">
                            <Image
                                src={getProductImageUrl('', categoryImages.lingerie.src)}
                                alt={categoryImages.lingerie.alt}
                                width={400}
                                height={256}
                                className="category-img w-full h-full object-contain transition-transform duration-400 group-hover:scale-110"
                                loading="lazy"
                            />
                        </div>
                        <div className="category-content p-8 text-center">
                            <h3 className="text-xl font-semibold text-purple-800 mb-4">Lingerie</h3>
                            <p className="text-gray-700 mb-6 leading-relaxed">Her Lingerie Collection: Babydolls, Corsets & Comfortable Silk Panties</p>
                            <Link
                                href="/collections/lingerie"
                                className="btn inline-block bg-gradient-to-br from-pink-600 to-purple-700 hover:from-pink-700 hover:to-purple-800 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                Shop Lingerie Collection
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}