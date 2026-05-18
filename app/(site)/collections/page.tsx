// app/(site)/collections/route.ts
import Link from 'next/link';
import Image from 'next/image'; // ✅ 恢复引用
import { RootResponse } from '@/types/category';
import { categoryService } from '@/services/categoryService';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Metadata } from 'next';
import { getProductImageUrl } from '@/lib/image-utils'; // ✅ 引入工具函数

// SEO Metadata
export const metadata: Metadata = {
    title: "Collections | MythToy - Premium Adult Pleasure",
    description: "Explore our curated collections of premium adult products. From intimate massagers to luxury lingerie, find exactly what you desire.",
    alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'}/collections`,
    },
    openGraph: {
        title: "Collections | MythToy",
        description: "Explore our curated collections of premium adult products.",
        type: "website",
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com'}/collections`,
        siteName: 'MythToy',
    },
};

const GRADIENTS = [
    "from-pink-100 to-rose-50",
    "from-purple-100 to-fuchsia-50",
    "from-blue-100 to-indigo-50",
    "from-orange-100 to-amber-50",
    "from-emerald-100 to-teal-50",
    "from-gray-100 to-slate-50",
];

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
        <div className="min-h-screen bg-white w-full overflow-x-hidden">

            {/* Hero Section */}
            <section className="relative py-20 md:py-28 bg-gray-50 w-full">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-white to-gray-50"></div>
                    <div className="absolute -right-20 -top-20 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl"></div>
                    <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl"></div>
                </div>

                <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold tracking-widest uppercase mb-6 border border-pink-100">
                        <Sparkles size={12} />
                        Curated Collections
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
                        Explore Your Desires
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Discover our comprehensive range of premium intimate products, designed for every body and every pleasure.
                    </p>
                </div>
            </section>

            {/* Categories Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {filteredRoots.map((rootCategory, rootIndex) => (
                    <section
                        key={rootCategory.slug}
                        className="mb-24 last:mb-0"
                    >
                        {/* Root Category Header */}
                        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-gray-100 pb-4">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display'] mb-2">
                                    {rootCategory.name}
                                </h2>
                                <p className="text-gray-500 max-w-xl">
                                    {rootCategory.description || `Browse our premium selection of ${rootCategory.name.toLowerCase()}.`}
                                </p>
                            </div>
                            <Link
                                href={`/collections/${rootCategory.slug}`}
                                className="hidden md:inline-flex items-center text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-pink-600 transition-colors group"
                            >
                                View All
                                <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Subcategories Grid */}
                        {rootCategory.categories && rootCategory.categories.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {rootCategory.categories.map((subcategory, subIndex) => {
                                    const gradientClass = GRADIENTS[(rootIndex + subIndex) % GRADIENTS.length];

                                    // ✅ 处理图片逻辑
                                    // 假设字段名为 subcategory.image
                                    const hasImage = !!subcategory.image;
                                    const imageUrl = getProductImageUrl(undefined, subcategory.image);

                                    return (
                                        <Link
                                            key={subcategory.slug}
                                            href={`/collections/${subcategory.slug}`}
                                            className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-pink-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                        >
                                            {/* Image Container */}
                                            <div className={`relative h-48 overflow-hidden bg-gradient-to-br ${gradientClass} flex items-center justify-center group-hover:opacity-90 transition-opacity`}>
                                                {/* ✅ 优先显示真实图片 */}
                                                {hasImage ? (
                                                    <Image
                                                        src={imageUrl}
                                                        alt={subcategory.name}
                                                        fill
                                                        sizes="(max-width: 768px) 100vw, 25vw"
                                                        className="object-contain p-4 transition-transform duration-700 group-hover:scale-105" // 👈 修改这里
                                                        priority={rootIndex < 2 && subIndex < 4} // 可选：优化加载
                                                    />
                                                ) : (
                                                    // ✅ 兜底显示首字母
                                                    <span className="text-6xl font-['Playfair_Display'] text-gray-900/10 font-bold select-none group-hover:scale-110 transition-transform duration-500">
                                                        {subcategory.name.charAt(0)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6 flex flex-col flex-grow">
                                                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-pink-600 transition-colors font-['Playfair_Display']">
                                                    {subcategory.name}
                                                </h3>
                                                <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-grow">
                                                    {subcategory.description || `Explore our ${subcategory.name} collection.`}
                                                </p>

                                                <div className="flex items-center text-xs font-bold uppercase tracking-wider text-gray-900 group-hover:text-pink-600 transition-colors mt-auto">
                                                    Shop Now
                                                    <ArrowRight className="w-3 h-3 ml-2" />
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                <div className="text-gray-300 mb-3">
                                    <Sparkles size={40} className="mx-auto" strokeWidth={1.5} />
                                </div>
                                <p className="text-gray-500">Coming soon - new products are on the way!</p>
                            </div>
                        )}

                        {/* Mobile View All Link */}
                        <div className="mt-6 md:hidden">
                            <Link
                                href={`/collections/${rootCategory.slug}`}
                                className="inline-flex items-center text-sm font-bold uppercase tracking-wider text-gray-900 hover:text-pink-600 transition-colors"
                            >
                                View All {rootCategory.name}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </div>
                    </section>
                ))}
            </div>

            {/* Footer CTA */}
            <section className="bg-gray-900 text-white py-20 px-4 relative overflow-hidden w-full">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
                </div>

                <div className="container mx-auto max-w-4xl text-center relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6 font-['Playfair_Display']">
                        Can't Find What You're Looking For?
                    </h3>
                    <p className="text-gray-300 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                        As a manufacturer, we have access to thousands of products not yet listed.
                        Tell us what you need, and we'll help you find it.
                    </p>
                    <Link
                        href="/pages/contact"
                        className="inline-flex items-center bg-white text-black hover:bg-pink-50 font-bold px-8 py-4 rounded-full transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        Contact Our Team
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                </div>
            </section>
        </div>
    );
}