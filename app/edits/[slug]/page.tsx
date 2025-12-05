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
        filter: { features: ['Quiet', 'Whisper'] }, // 假设你的后端支持按 feature 筛选
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
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const config = EDITS_CONFIG[params.slug];
    if (!config) return { title: 'Collection Not Found' };

    return {
        title: `${config.title} | MythToy Curated`,
        description: config.description,
    };
}

// 3. 页面组件
export default async function EditsPage({ params, searchParams }: any) {
    const slug = params.slug;
    const config = EDITS_CONFIG[slug];

    if (!config) return notFound();

    // 合并 URL 参数和专题预设参数
    // 例如：专题限定了价格<30，用户依然可以在此基础上筛选颜色
    const searchParamsVal = await searchParams;
    const filters = {
        ...config.filter, // 预设筛选
        ...searchParamsVal, // 用户筛选覆盖
        page: parseInt(searchParamsVal.page || '0'),
    };

    // 获取产品 (这里假设你的 getProducts 支持传入任意 filters)
    // 你可能需要调整 productServiceServer.getProductsByCategory 或者是新建一个 getProductsByFilter
    // 这里仅作逻辑演示
    const productsData = await productServiceServer.getProductsByFilter(filters);

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
                    currentPage={filters.page}
                    totalProducts={productsData.totalElements}
                    // 传入预设 filters 确保 ProductList 的筛选器状态正确
                    initialFilters={filters}
                />
            </div>
        </div>
    );
}