// app/edits/[slug]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductList from '@/components/product/product-list';
import { productServiceServer } from '@/services/servers/product-service-server';
import { Sparkles, VolumeX, Tag, HeartHandshake } from 'lucide-react';

// 1. 定义专题配置
const EDITS_CONFIG: Record<string, any> = {
    'quiet-toys': {
        title: "The Silent Collection",
        subtitle: "Whisper-quiet pleasure for peace of mind.",
        description: "Living with roommates or parents? We've curated our quietest toys (< 50dB) so you can enjoy without worry.",
        icon: VolumeX,
        filter: { features: ['Quiet', 'Whisper'] },
        heroColor: "bg-blue-50 text-blue-900"
    },
    'under-30': {
        title: "Budget Bliss",
        subtitle: "Premium pleasure, factory prices.",
        description: "You don't need to break the bank to feel good. Our top picks under $30.",
        icon: Tag,
        filter: { priceRange: [0, 30] },
        heroColor: "bg-green-50 text-green-900"
    },
    'beginners': {
        title: "First Time Favorites",
        subtitle: "Simple, non-intimidating, and easy to use.",
        description: "New to toys? Start here. We selected user-friendly options with simple controls and smooth shapes.",
        icon: Sparkles,
        filter: { features: ['Beginner Friendly'] },
        heroColor: "bg-purple-50 text-purple-900"
    },
    'couples-play': {
        title: "Better Together",
        subtitle: "Toys designed for two.",
        description: "Enhance your intimacy with toys that fit comfortably between partners.",
        icon: HeartHandshake,
        filter: { features: ['Remote Control', 'Couples'] },
        heroColor: "bg-pink-50 text-pink-900"
    }
};

// 2. 生成 Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const config = EDITS_CONFIG[resolvedParams.slug];
    if (!config) return { title: 'Collection Not Found' };

    return {
        title: `${config.title} | MythToy Curated`,
        description: config.description,
    };
}

// 3. 页面组件
export default async function EditsPage({ params, searchParams }: {
    params: Promise<{ slug: string }>;
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;
    const config = EDITS_CONFIG[slug];

    if (!config) return notFound();

    // 解析 searchParams
    const resolvedSearchParams = searchParams ? await searchParams : {};

    // 构造 Filters 对象
    const currentPage = parseInt((resolvedSearchParams.page as string) || '1');

    const filters = {
        ...config.filter, // 专题预设 (例如 priceRange: [0, 30])
        ...resolvedSearchParams, // URL 参数覆盖 (例如用户手动排序)
        page: currentPage,
        size: 12
    };

    // ✅ 调用刚刚在 Service 里新增的方法
    const productsData = await productServiceServer.getProductsByCategory(filters);

    const Icon = config.icon;

    return (
        <div className="min-h-screen bg-white">
            {/* 专题 Hero 区域 */}
            <section className={`py-16 px-4 text-center ${config.heroColor}`}>
                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex p-3 bg-white/50 rounded-full mb-4">
                        <Icon size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 font-['Playfair_Display']">
                        {config.title}
                    </h1>
                    <p className="text-lg font-medium opacity-90 mb-2">{config.subtitle}</p>
                    <p className="text-base opacity-75 max-w-xl mx-auto">{config.description}</p>
                </div>
            </section>

            {/* 产品列表 */}
            <div className="container mx-auto px-4 py-12 max-w-7xl">
                <ProductList
                    products={productsData.content}
                    itemsPerPage={12}
                    totalPages={productsData.totalPages}
                    currentPage={currentPage - 1} // ProductList 分页组件通常也是 0-based
                    totalProducts={productsData.totalElements}
                    // 传入 filter 状态，这样 ProductList 里的筛选器能显示正确的初始状态（例如价格滑块在 0-30）
                    initialFilters={{
                        priceRange: filters.priceRange || null,
                        colors: filters.colors ? (Array.isArray(filters.colors) ? filters.colors : filters.colors.split(',')) : [],
                        features: filters.features ? (Array.isArray(filters.features) ? filters.features : filters.features.split(',')) : [],
                        materials: []
                    }}
                />
            </div>
        </div>
    );
}