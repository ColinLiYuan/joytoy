// app/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WishlistResponse } from '@/types/wishlist';
import { Heart, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { wishlistService } from '@/services/wishlistService'; // ✅ 用客户端 Service
import SimpleProductGrid from '@/components/product/simple-product-grid'; // ✅ 用简单网格
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';

const convertToProductResponse = (wishlistItem: WishlistResponse): any => {
    return {
        id: wishlistItem.productId,
        title: wishlistItem.productTitle,
        image: wishlistItem.image,
        baseUrl: wishlistItem.baseUrl,
        currentPrice: wishlistItem.currentPrice,
        originalPrice: wishlistItem.currentPrice, // 假设原价一样，或者后端补充字段
        slug: wishlistItem.slug,
        favorited: true, // 既然在心愿单里，肯定是 true
        productSkus: [] // 心愿单列表不需要 SKU 选择
    };
};

export default function WishlistPage() {
    const [wishlistItems, setWishlistItems] = useState<WishlistResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const { isLoggedIn, isClient } = useAuth();
    const router = useRouter();

    const fetchWishlist = async () => {
        try {
            setIsLoading(true);
            const items = await wishlistService.getWishlist();
            setWishlistItems(Array.isArray(items) ? items : []);
        } catch (err: any) {
            console.error('Failed to load wishlist:', err);
            setError('Failed to load wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isClient) {
            if (!isLoggedIn) {
                // 如果没登录，可以在这里跳转登录，或者显示空状态
                setIsLoading(false);
                return;
            }
            fetchWishlist();
        }
    }, [isClient, isLoggedIn]);

    // 当用户在卡片上点击移除心愿单时，刷新列表
    const handleWishlistUpdate = () => {
        fetchWishlist();
    };

    if (!isClient) return null;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
            </div>
        );
    }

    const products = wishlistItems.map(convertToProductResponse);

    return (
        <div className="min-h-screen bg-white py-12 w-full overflow-x-hidden">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-12">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-6"
                    >
                        <ArrowLeft size={16} className="mr-2" />
                        Back
                    </button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-pink-50 rounded-full text-pink-600">
                                    <Heart size={24} fill="currentColor" />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display']">
                                    My Wishlist
                                </h1>
                            </div>
                            <p className="text-gray-500">
                                {products.length} {products.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-red-500 mb-4">{error}</p>
                        <button onClick={fetchWishlist} className="underline text-gray-900 font-medium">Try refreshing</button>
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-24 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                            <Heart className="w-10 h-10 text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-500 mb-8">Start adding products you love.</p>
                        <Link
                            href="/collections/all"
                            className="inline-flex items-center bg-black text-white px-8 py-3 rounded-full font-bold hover:bg-gray-900 transition-all hover:-translate-y-1 shadow-lg"
                        >
                            <ShoppingBag size={18} className="mr-2" />
                            Explore Collections
                        </Link>
                    </div>
                ) : (
                    /* ✅ 使用简单网格，传入刷新回调 */
                    <SimpleProductGrid
                        products={products}
                        onWishlistUpdate={handleWishlistUpdate}
                    />
                )}
            </div>
        </div>
    );
}