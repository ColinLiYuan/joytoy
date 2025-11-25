// components/home/categories-section.tsx
import Link from 'next/link';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';

const categories = [
    {
        id: 'for-her',
        title: "For Her",
        description: "Curated pleasure & comfort",
        link: "/collections/female-sex-toys",
        image: "forHer.jpg",
        alt: "Luxury adult toys for women",
        gradient: "from-pink-100 to-rose-50"
    },
    {
        id: 'for-him',
        title: "For Him",
        description: "Performance & sensation",
        link: "/collections/male-sex-toys",
        image: "forHim.jpg",
        alt: "High-quality male adult toys",
        gradient: "from-blue-50 to-indigo-50"
    },
    {
        id: 'sex-toys',
        title: "Couples & Toys",
        description: "Shared intimacy & fun",
        link: "/collections/sex-toys",
        image: "sexToy.jpg",
        alt: "Adult sex toys for couples",
        gradient: "from-purple-50 to-fuchsia-50"
    },
    {
        id: 'lingerie',
        title: "Lingerie",
        description: "Confidence & romance",
        link: "/collections/lingerie",
        image: "lingerie.jpg",
        alt: "Elegant intimate apparel",
        gradient: "from-red-50 to-orange-50"
    }
];

export default function CategoriesSection() {
    return (
        <section id="categories" className="py-20 md:py-28 bg-white relative overflow-hidden">
            {/* 柔和的背景光晕 */}
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-pink-100/40 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100/40 rounded-full blur-3xl translate-y-1/3 translate-x-1/3 pointer-events-none"></div>

            <div className="container max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
                {/* 标题区域 */}
                <div className="text-center mb-16">
                    <span className="text-pink-600 font-medium tracking-widest uppercase text-xs mb-3 block">
                        Explore Our Collections
                    </span>
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
                        Find Your Pleasure
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
                </div>

                {/* 网格布局 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className="group relative flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
                        >
                            {/* 图片区域 - 占据一半或更多 */}
                            <div className={`w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden bg-gradient-to-br ${cat.gradient} flex items-center justify-center p-6`}>
                                <div className="relative w-full h-full transition-transform duration-700 ease-in-out group-hover:scale-110">
                                    <Image
                                        src={getProductImageUrl('', cat.image)}
                                        alt={cat.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain drop-shadow-md"
                                        loading="lazy"
                                    />
                                </div>
                            </div>

                            {/* 内容区域 */}
                            <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center items-start">
                                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-['Playfair_Display'] group-hover:text-pink-700 transition-colors">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-500 mb-8 leading-relaxed">
                                    {cat.description}
                                </p>

                                <span className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-gray-900 border-b-2 border-transparent group-hover:border-pink-500 transition-all duration-300 pb-1">
                                    Shop Now
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform transition-transform group-hover:translate-x-1">
                                        <path d="M5 12h14"></path>
                                        <path d="m12 5 7 7-7 7"></path>
                                    </svg>
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}