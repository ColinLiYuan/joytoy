export interface WishlistRequest {
    userId: number;
    productId: number;
    slug?: string;
    productTitle?: string;
    currentPrice?: number;
    image?: string;
    category?: string;
    quantity?: number;
}

export interface WishlistResponse {
    productId: number;
    slug: string;
    productTitle: string;
    originalPrice: number;
    currentPrice: number;
    image: string;
    category?: string;
    quantity?: number;
    baseUrl: string;
}