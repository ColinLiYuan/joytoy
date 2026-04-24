'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { productService } from '@/services/productService';
import ProductList from '@/components/product/product-list';
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

export default function EditsPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const slug = params.slug as string;
    
    const config = EDITS_CONFIG[slug];

    const [productsData, setProductsData] = useState<any>({
        content: [],
        totalPages: 0,
        totalElements: 0,
        currentPage: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!config) {
            setError('Collection not found');
            setLoading(false);
            return;
        }

        const fetchProducts = async () => {
            try {
                setLoading(true);
                
                const page = parseInt(searchParams.get('page') || '0');
                
                // 构造 Filters 对象
                const filters = {
                    ...config.filter,
                    colors: searchParams.get('colors') ? searchParams.get('colors')!.split(',') : [],
                    features: searchParams.get('features') ? searchParams.get('features')!.split(',') : (config.filter.features || []),
                    materials: searchParams.get('materials') ? searchParams.get('materials')!.split(',') : [],
                    priceRange: config.filter.priceRange || null,
                    sortBy: searchParams.get('sortBy') || 'createdAt',
                    sortDirection: searchParams.get('sortDirection') || 'DESC'
                };

                // 使用 getProductsByCategory，传入空 slug 和 filters
                const data = await productService.getProductsByCategory('', page, 12, filters);
                setProductsData(data);
                setError(null);
            } catch (err: any) {
                console.error('Error fetching products:', err);
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [slug, searchParams, config]);

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
                    <p className="text-gray-500">The requested collection does not exist.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center p-8">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Error</h2>
                    <p>{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const Icon = config.icon;
    const currentPage = productsData.currentPage;

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
                    currentPage={currentPage}
                    totalProducts={productsData.totalElements}
                    initialFilters={{
                        priceRange: config.filter.priceRange || null,
                        colors: [],
                        features: config.filter.features || [],
                        materials: []
                    }}
                />
            </div>
        </div>
    );
}
