export interface WishlistRequest {
    productId: number;
    slug?: string;
    productTitle?: string;
    originalPrice?: number;
    currentPrice?: number;
    image?: string;
    category?: string;
    quantity?: number;
    badge?: string;
}

export interface WishlistResponse {
    productId: number;
    slug: string;
    productTitle: string;
    originalPrice?: number;
    currentPrice?: number;
    image: string;
    category?: string;
    quantity?: number;
    badge?: string;
}