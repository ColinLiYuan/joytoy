// app/wishlist/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { WishlistResponse } from '@/types/wishlist';
import { Heart, ArrowLeft, ShoppingBag, Loader2 } from 'lucide-react';
import { wishlistService } from '@/services/wishlistService';
import SimpleProductGrid from '@/components/product/simple-product-grid';
import { useAuth } from '@/contexts/authContext';
import { useRouter } from 'next/navigation';
import { ProductResponse } from '@/types/product';

// ✅ 修复：更精确的数据映射
const convertToProductResponse = (wishlistItem: WishlistResponse): ProductResponse => {
    return {
        id: wishlistItem.productId,
        title: wishlistItem.productTitle,
        name: wishlistItem.productTitle,
        image: wishlistItem.image,
        currentPrice: wishlistItem.currentPrice ?? 0,
        originalPrice: wishlistItem.originalPrice ?? 0, // ✅ 恢复原价，触发 Sale 徽章
        slug: wishlistItem.slug,
        badge: wishlistItem.badge ?? '', // ✅ 恢复 Badge (HOT/NEW)
        minOrder: '1',  // 必需字段
        description: '', // 必需字段
        stock: 0,       // 必需字段
        favorited: true,
        // ✅ 关键：构造一个有库存的 SKU，但用特殊颜色标记
        productSkus: [
            {
                id: 0,
                stock: 999, // 保证有货
                lockedStock: 0,
                // 使用特殊标记，告诉 Card 组件不要渲染这个颜色圆点
                color: '__generic__',
                sku: 'wishlist-item'
            }
        ]
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
                setIsLoading(false);
                return;
            }
            fetchWishlist();
        }
    }, [isClient, isLoggedIn]);

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

    // 转换数据
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
                    <SimpleProductGrid
                        products={products}
                        onWishlistUpdate={handleWishlistUpdate}
                    />
                )}
            </div>
        </div>
    );
}