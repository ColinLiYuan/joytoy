// app/wishlist/route.tsx
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { WishlistResponse } from '@/types/wishlist';
import {
    faHeart,
    faArrowLeft,
} from '@fortawesome/free-solid-svg-icons';
import { wishlistServiceServer } from '@/services/servers/wishlistServiceServer';
import ProductList from '@/components/product/product-list';
import { redirect } from 'next/navigation';
import './wishlist.css';

// 将 WishlistResponse 转换为 ProductResponse 的辅助函数
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

// 清空愿望清单的操作
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
        // console.log('Fetched wishlist items:', items);

        wishlistItems = Array.isArray(items) ? items : [];
    } catch (err) {
        console.error('Failed to load wishlist:', err);
        error = err instanceof Error ? err.message : 'Failed to load wishlist';
    }

    const products = wishlistItems.map(convertToProductResponse);
    // console.log('Fetched wishlist items products:', products);

    if (error) {
        return (
            <div className="wishlist-container">
                <div className="container">
                    <div className="empty-wishlist">
                        <div className="empty-icon">
                            <FontAwesomeIcon icon={faHeart} />
                        </div>
                        <h2>Error loading wishlist</h2>
                        <p>{error}</p>
                        <form action={async () => {
                            'use server';
                            // 重新获取数据
                            return await Promise.resolve();
                        }}>
                            <button
                                type="submit"
                                className="continue-shopping-btn"
                                style={{ marginTop: '20px' }}
                            >
                                Try Again
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="wishlist-container">
            <div className="container">
                {/* 页面头部 */}
                <div className="wishlist-header">
                    <div className="breadcrumb">
                        <Link href="/" className="breadcrumb-link">
                            <FontAwesomeIcon icon={faArrowLeft} />
                            Back to Home
                        </Link>
                    </div>

                    <div className="wishlist-title-section">
                        <div className="title-with-icon">
                            <FontAwesomeIcon icon={faHeart} className="title-icon" />
                            <h1 className="wishlist-title">My Wishlist</h1>
                        </div>
                        <p className="wishlist-subtitle">
                            Your favorite products saved for later
                        </p>
                    </div>

                    {wishlistItems.length > 0 && (
                        <div className="wishlist-actions">
                            <form action={clearWishlistAction}>
                                {/*<button*/}
                                {/*    type="submit"*/}
                                {/*    className="clear-wishlist-btn"*/}
                                {/*>*/}
                                {/*    Clear All*/}
                                {/*</button>*/}
                            </form>
                        </div>
                    )}
                </div>

                {/* 使用 ProductList 组件显示愿望清单商品 */}
                <div className="wishlist-content">
                    {wishlistItems.length === 0 ? (
                        <div className="empty-wishlist">
                            <div className="empty-icon">
                                <FontAwesomeIcon icon={faHeart} />
                            </div>
                            <h2>Your wishlist is empty</h2>
                            <p>Start adding products you love to your wishlist</p>
                            <Link href="/collections" className="continue-shopping-btn">
                                Continue Shopping
                            </Link>
                        </div>
                    ) : (
                        <ProductList
                            products={products}
                            itemsPerPage={12}
                            totalPages={1}
                            currentPage={0}
                            totalProducts={wishlistItems.length}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}