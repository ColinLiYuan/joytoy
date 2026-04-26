// components/home/categories-section.tsx
import Link from 'next/link';
import Image from 'next/image';
import { MoveRight } from 'lucide-react';
import { getProductImageUrl } from '@/lib/image-utils';

const categories = [
    {
        id: 'for-her',
        title: "For Her",
        description: "Discreet pleasure objects disguised as everyday beauty essentials.",
        link: "/collections/female-sex-toys",
        image: "home-banner-for-her.png?v=1",
        alt: "Luxury discreet vibrator for women",
    },
    {
        id: 'for-him',
        title: "For Him",
        description: "High-tech wellness gadgets designed for performance and relief.",
        link: "/collections/male-sex-toys",
        image: "home-banner-for-him.png",
        alt: "High-tech male pleasure gadget",
    },
    {
        id: 'sex-toys',
        title: "Couples",
        description: "Hypoallergenic glass and sensory tools for shared intimacy.",
        link: "/collections/sex-toys",
        image: "home-banner-couples.png?v=2",
        alt: "Crystal glass pleasure wand",
    },
    {
        id: 'lingerie',
        title: "Sensory & Lingerie",
        description: "Soft touches, silk textures, and confidence in every layer.",
        link: "/collections/lingerie",
        image: "home-banner-lingerie.png?v=1",
        alt: "Sensory feather tickler on silk",
    }
];

export default function CategoriesSection() {
    return (
        <section id="categories" className="py-24 bg-white w-full">
            <div className="container max-w-7xl mx-auto px-6">

                {/* 1. Header: 极简风格 */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
                    <div>
                        <span className="text-[#C5A059] text-xs font-bold tracking-[0.2em] uppercase block mb-3">
                            The Collections
                        </span>
                        <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A]">
                            Curated Categories
                        </h2>
                    </div>
                    <div className="hidden md:block h-[1px] flex-1 bg-gray-100 mx-10 mb-2"></div>
                    <Link href="/collections/all" className="text-sm font-bold uppercase tracking-widest hover:text-[#C5A059] transition-colors border-b border-transparent hover:border-[#C5A059] pb-1">
                        View All
                    </Link>
                </div>

                {/* 2. Grid Layout - Editorial Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-16">
                    {categories.map((cat) => (
                        <Link
                            key={cat.id}
                            href={cat.link}
                            className="group block" // 这里的 block 只是一个 wrapper，不负责高度
                        >
                            {/* --- Image Area (The Mask) --- */}
                            {/*
                                1. relative + overflow-hidden: 这是一个遮罩，确保图片放大时不溢出
                                2. aspect-[3/4]: 强制纵横比 (时尚杂志常用比例)，如果是横图产品可以改 aspect-[4/3]
                                3. bg-[#F5F5F7]: 图片加载前的占位底色
                            */}
                            <div className="relative w-full aspect-[4/5] bg-[#F5F5F7] overflow-hidden">
                                <Image
                                    src={getProductImageUrl(undefined, cat.image)}
                                    alt={cat.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    // object-cover: 铺满容器，实现 Full Bleed 效果 (不再是 object-contain)
                                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                />

                                {/* 可选：微弱的遮罩，增加质感 */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                            </div>

                            {/* --- Text Area (Below the image) --- */}
                            <div className="mt-6 text-center md:text-left">
                                <h3 className="text-2xl font-serif text-[#1A1A1A] mb-2 group-hover:text-[#C5A059] transition-colors duration-300">
                                    {cat.title}
                                </h3>
                                <p className="text-gray-500 font-light text-sm mb-4 max-w-sm">
                                    {cat.description}
                                </p>

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