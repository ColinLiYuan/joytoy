// components/home/shop-by-need.tsx
// 首页「Shop by need」模块：按需求场景的集合入口（4–6 个图标卡片，横向一行展示）。
// 位置：精选产品（Editor's Choice）下方。
// 图标优先级：集合 icon 图片 → 集合主图（封面图）→ 默认 ✨ 图标。
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { getProductImageUrl } from '@/lib/image-utils';
import { CollectionResponse } from '@/types/collection';

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
                        const iconSrc = collection.icon || collection.image || '';
                        return (
                            <Link
                                key={collection.id}
                                href={`/collections/${collection.slug}`}
                                className="group snap-start shrink-0 w-36 sm:w-40 flex flex-col items-center gap-3 rounded-2xl bg-white
                                           border border-gray-100 px-3 py-6 text-center
                                           transition-all duration-300 hover:border-[#C5A059]/60 hover:shadow-lg hover:-translate-y-0.5"
                            >
                                {iconSrc ? (
                                    <img
                                        src={getProductImageUrl(undefined, iconSrc)}
                                        alt={collection.name}
                                        className="w-14 h-14 rounded-full object-cover border border-gray-100"
                                    />
                                ) : (
                                    <span className="w-14 h-14 rounded-full bg-[#FAF8F5] flex items-center justify-center
                                                     text-[#1A1A1A] transition-colors duration-300 group-hover:bg-[#C5A059] group-hover:text-white">
                                        <Sparkles className="h-6 w-6" strokeWidth={1.5} />
                                    </span>
                                )}
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
