// app/(site)/collections/page.tsx
import Link from 'next/link';
import { RootResponse } from '@/types/category';
import { categoryService } from '@/services/category-service';

// 子分类图片映射 - 使用网上真实的成人用品图片
const subcategoryImages: Record<string, string> = {
    // For Her 子分类
    "Clit Vibrators": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",
    "Nipple Stimulator": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "G-Spot Vibrators": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",
    "Bullet Vibrators": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Rabbit Vibrators": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",
    "Wand Vibrators": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Dildos": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",

    // For Him 子分类
    "Male Masturbators": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Pussy & Ass Masturbators": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",
    "Prostate Massagers": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Sex Dolls": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",

    // Sex Toys 子分类
    "Anal Beads": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",
    "Butt Plugs": "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop",
    "Tail Toys": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop",

    // Lingerie 子分类
    "Schoolgirl Lingerie": "https://images.unsplash.com/photo-1595950755472-9d5d28441d06?w=400&h=300&fit=crop"
};

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1594736797933-d0c1381d7c45?w=400&h=300&fit=crop";

export default async function CollectionPage() {
    let rootsData: RootResponse[] = [];

    try {
        const roots = await categoryService.getRoots();
        rootsData = Array.isArray(roots) ? roots : [];
    } catch (error) {
        console.error('Failed to load categories:', error);
        rootsData = [];
    }

    // 过滤掉 best-sellers
    const filteredRoots = rootsData.filter(root => root.slug !== 'best-sellers');

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Categories Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {filteredRoots.map((rootCategory, index) => (
                    <section
                        key={rootCategory.slug}
                        className={`mb-16 ${index % 2 === 1 ? 'bg-white rounded-2xl p-8' : ''}`}
                    >
                        {/* Root Category Header */}
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                {rootCategory.name}
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
                                {rootCategory.description}
                            </p>
                            <Link
                                href={`/collections/${rootCategory.slug}`}
                                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                View All {rootCategory.name}
                                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        </div>

                        {/* Subcategories Grid - 直接从 rootCategory.categories 获取 */}
                        {rootCategory.categories && rootCategory.categories.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {rootCategory.categories.map((subcategory) => (
                                    <Link
                                        key={subcategory.slug}
                                        href={`/collections/${subcategory.slug}`}
                                        className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-gray-200"
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={subcategoryImages[subcategory.name] || DEFAULT_IMAGE}
                                                alt={subcategory.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                loading="lazy"
                                            />
                                            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 text-lg mb-2 group-hover:text-blue-600 transition-colors">
                                                {subcategory.name}
                                            </h3>
                                            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                                                {subcategory.description}
                                            </p>
                                            <div className="flex items-center text-blue-600 font-medium text-sm group-hover:text-blue-700 transition-colors">
                                                Shop Now
                                                <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                            <div className="text-gray-400 text-6xl mb-4">🛍️</div>
                            <p className="text-gray-500 text-lg">Coming soon - new products are on the way!</p>
                            </div>
                            )}
                    </section>
                ))}
            </div>

            {/* Footer CTA */}
            <div className="bg-gray-900 text-white py-16 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-4">
                        Can't Find What You're Looking For?
                    </h3>
                    <p className="text-gray-300 text-lg mb-6 max-w-2xl mx-auto">
                        We continuously update our collections to bring you the finest selection of adult products
                    </p>
                    <Link
                        href="/contact"
                        className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
                    >
                        Contact Us for Custom Requests
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}

// SEO Metadata
export async function generateMetadata() {
    return {
        title: "Adult Products Collections | Premium Sex Toys & Lingerie",
        description: "Explore our premium collection of adult products including sex toys, lingerie, and intimate accessories. Discreet shipping and premium quality guaranteed.",
        keywords: "sex toys, adult products, lingerie, vibrators, dildos, masturbators, adult store",
        openGraph: {
            title: "Adult Products Collections | Premium Sex Toys & Lingerie",
            description: "Explore our premium collection of adult products including sex toys, lingerie, and intimate accessories.",
            type: "website",
            url: "/collections",
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}