// components/home/shop-by-need.tsx
// 首页「Shop by need」模块：按需求场景的集合入口（4–6 个图标卡片，横向一行展示）。
// 位置：精选产品（Editor's Choice）下方。集合 icon 在 admin「集合管理」中配置
// （lucide 图标名）；未配置用默认图标。已在「Curated Collections」大图区块展示的
// 集合（show_on_home）不在此重复出现。
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
        <section id="shop-by-need" className="w-full bg-[#FAF8F5] py-14">
            <div className="container max-w-7xl mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-2">
                    <div>
                        <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase block mb-2">
                            Find Your Fit
                        </span>
                        <h2 className="text-2xl md:text-3xl font-serif text-[#1A1A1A]">
                            Shop by need
                        </h2>
                    </div>
                </div>

                {/* 横向一行卡片（窄屏可横向滑动） */}
                <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory scrollbar-thin">
                    {collections.map(collection => {
                        const Icon = ICON_MAP[collection.icon || ''] || DEFAULT_ICON;
                        return (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="group snap-start shrink-0 w-36 sm:w-40 flex flex-col items-center gap-3 rounded-2xl bg-white
                                           border border-gray-100 px-3 py-6 text-center
                                           transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                <span className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center
                                                 text-[#1A1A1A] transition-colors duration-300 group-hover:bg-[#C5A059] group-hover:text-white">
                                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                                </span>
                                <span className="text-sm font-medium text-[#1A1A1A] leading-snug group-hover:text-[#C5A059] transition-colors duration-300">
                                    {collection.name}
                                </span>
                                {collection.productCount > 0 && (
                                    <span className="text-[11px] text-gray-400 -mt-1">
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
