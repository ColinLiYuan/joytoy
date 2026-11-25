// components/home/shop-by-need.tsx
// 首页「Shop by need」模块：按需求场景的图标卡片入口（4–6 个），展示上架集合。
// 集合 icon 在 admin「集合管理」中配置（lucide 图标名）；未配置用默认图标。
// 已在「Curated Collections」大图区块展示的集合（show_on_home）不在此重复出现。
import Link from 'next/link';
import {
    Sparkles,
    VolumeX,
    Heart,
    Users,
    Plane,
    Gift,
    Flame,
    Moon,
    Leaf,
    Zap,
    Crown,
    Gem,
    Droplets,
    Wand2,
    Feather,
    type LucideIcon
} from 'lucide-react';
import { CollectionResponse } from '@/types/collection';

const ICON_MAP: Record<string, LucideIcon> = {
    sparkles: Sparkles,
    'volume-x': VolumeX,
    heart: Heart,
    users: Users,
    plane: Plane,
    gift: Gift,
    flame: Flame,
    moon: Moon,
    leaf: Leaf,
    zap: Zap,
    crown: Crown,
    gem: Gem,
    droplet: Droplets,
    wand: Wand2,
    feather: Feather
};

const DEFAULT_ICON = Sparkles;

interface ShopByNeedProps {
    collections: CollectionResponse[];
}

export default function ShopByNeed({ collections }: ShopByNeedProps) {
    if (!collections || collections.length === 0) return null;

    return (
        <section id="shop-by-need" className="w-full bg-[#FAF8F5] py-20">
            <div className="container max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase block mb-3">
                        Find Your Fit
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                        Shop by need
                    </h2>
                </div>

                {/* Icon cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {collections.map(collection => {
                        const Icon = ICON_MAP[collection.icon || ''] || DEFAULT_ICON;
                        return (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="group flex flex-col items-center gap-4 rounded-2xl bg-white border border-gray-100 px-4 py-8
                                           transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <span className="w-14 h-14 rounded-full bg-[#FAF8F5] flex items-center justify-center
                                                 text-[#1A1A1A] transition-colors duration-300 group-hover:bg-[#C5A059] group-hover:text-white">
                                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                                </span>
                                <span className="text-sm font-medium text-[#1A1A1A] text-center leading-snug group-hover:text-[#C5A059] transition-colors duration-300">
                                    {collection.name}
                                </span>
                                {collection.productCount > 0 && (
                                    <span className="text-[11px] text-gray-400">
                                        {collection.productCount} products
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
