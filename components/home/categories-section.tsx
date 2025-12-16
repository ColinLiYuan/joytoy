// components/home/categories-section.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import { getProductImageUrl } from '@/lib/image-utils';

const categories = [
    {
        id: 'for-her',
        title: "For Her",
        description: "Curated pleasure & comfort.",
        link: "/collections/female-sex-toys",
        image: "swan.webp",
        alt: "Luxury adult toys for women",
    },
    {
        id: 'for-him',
        title: "For Him",
        description: "Performance & sensation.",
        link: "/collections/male-sex-toys",
        image: "titan.png",
        alt: "High-quality male adult toys",
    },
    {
        id: 'sex-toys',
        title: "Couples & Play",
        description: "Shared intimacy & exploration.",
        link: "/collections/sex-toys",
        image: "crystal-1.png",
        alt: "Adult sex toys for couples",
    },
    {
        id: 'lingerie',
        title: "Lingerie",
        description: "Confidence & romance.",
        link: "/collections/lingerie",
        image: "mesh.jpg",
        alt: "Elegant intimate apparel",
    }
];

export default function CategoriesSection() {
    return (
        <section id="categories" className="py-24 bg-white w-full">
            <div className="container max-w-7xl mx-auto px-6">

                {/* 1. Header: 极简风格 */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 space-y-4 md:space-y-0">
                    <div>
                        <span className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase block mb-2">
                            The Collections
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A]">
                            Curated Categories
                        </h2>
                    </div>
                    <div className="hidden md:block h-[1px] flex-1 bg-gray-100 mx-8 mb-2"></div>
                    <Link href="/collections/all" className="text-sm font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors">
                        View All
                    </Link>
                </div>

                {/* 2. Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className="group block relative w-full h-[500px] md:h-[600px] bg-[#F9F9F9] overflow-hidden hover:bg-[#F5F5F7] transition-colors duration-500"
                        >
                            {/* Image Area: 占据 70% 高度 */}
                            <div className="relative h-[70%] w-full flex items-center justify-center p-12">
                                <div className="relative w-full h-full">
                                    <Image
                                        src={getProductImageUrl('', cat.image)}
                                        alt={cat.alt}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-contain transition-transform duration-700 ease-out group-hover:scale-110 drop-shadow-sm mix-blend-multiply"
                                    />
                                </div>
                            </div>

                            {/* Text Area: 占据 30% 高度 */}
                            <div className="relative h-[30%] w-full flex flex-col justify-start items-center text-center px-8 pt-4">
                                <h3 className="text-3xl font-serif text-[#1A1A1A] mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-500 font-light text-sm md:text-base mb-6">
                                    {cat.description}
                                </p>

                                {/* 隐形 CTA: Hover 时稍微移动 */}
                                <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#1A1A1A] group-hover:text-[#C5A059] transition-all duration-300">
                                    Explore <MoveRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}