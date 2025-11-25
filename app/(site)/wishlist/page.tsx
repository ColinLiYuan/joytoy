// app/wishlist/page.tsx
import Link from 'next/link';
import { WishlistResponse } from '@/types/wishlist';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react'; // ✅ Lucide
import { wishlistServiceServer } from '@/services/servers/wishlistServiceServer';
import ProductList from '@/components/product/product-list';
import { redirect } from 'next/navigation';

const convertToProductResponse = (wishlistItem: WishlistResponse): any => {
    return {
        id: wishlistItem.productId,
        title: wishlistItem.productTitle,
        image: wishlistItem.image,
        baseUrl: wishlistItem.baseUrl,
        currentPrice: wishlistItem.currentPrice,
        originalPrice: wishlistItem.currentPrice,
        slug: wishlistItem.slug,
        favorited: true,
    };
};

async function clearWishlistAction() {
    'use server';
    try {
        await wishlistServiceServer.clearWishlist();
        redirect('/wishlist');
    } catch (error) {
        console.error('Failed to clear wishlist:', error);
    }
}

export default async function WishlistPage() {
    let wishlistItems: WishlistResponse[] = [];
    let error = '';

    try {
        const items = await wishlistServiceServer.getWishlist();
        wishlistItems = Array.isArray(items) ? items : [];
    } catch (err) {
        console.error('Failed to load wishlist:', err);
        error = err instanceof Error ? err.message : 'Failed to load wishlist';
    }

    const products = wishlistItems.map(convertToProductResponse);

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="container mx-auto px-4 max-w-7xl">

                {/* Header */}
                <div className="mb-12">
                    <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-black transition-colors mb-6">
                        <ArrowLeft size={16} className="mr-2" />
                        Back to Home
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-pink-50 rounded-full text-pink-600">
                                    <Heart size={24} />
                                </div>
                                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-['Playfair_Display']">
                                    My Wishlist
                                </h1>
                            </div>
                            <p className="text-gray-500">Your favorite picks saved for later</p>
                        </div>

                        {/* 这里可以放 Clear 按钮，如果需要的话 */}
                    </div>
                </div>

                {/* Content */}
                {error ? (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl">
                        <p className="text-red-500 mb-4">{error}</p>
                        <Link href="/wishlist" className="underline text-gray-900 font-medium">Try refreshing</Link>
                    </div>
                ) : wishlistItems.length === 0 ? (
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
                    <ProductList
                        products={products}
                        itemsPerPage={12}
                        totalPages={1}
                        currentPage={0}
                        totalProducts={wishlistItems.length}
                        showSortSelect={false}
                        showPagination={false}
                    />
                )}
            </div>
        </div>
    );
}