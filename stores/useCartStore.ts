import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartResponse, AddToCartRequest } from '@/types/cart';
import { cartService } from '@/services/cartService';
import { globalToast } from '@/contexts/toastContext';

interface CartStore {
    cart: CartResponse | null;
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalPrice: number;
    getCart: (cartId?: string) => Promise<CartResponse | undefined>;
    addItemToCart: (request: AddToCartRequest) => Promise<CartResponse | undefined>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<CartResponse | undefined>;
    removeItemFromCart: (itemId: number) => Promise<CartResponse | undefined>;
    clearError: () => void;
    clearCart: () => void;
    getCartId: () => string | undefined;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: null,
            loading: false,
            error: null,
            totalItems: 0,
            totalPrice: 0,

            getCartId: (): string | undefined => {
                // 仅在客户端执行
                if (typeof window === 'undefined') return undefined;

                const userInfoStr = localStorage.getItem('userInfo');
                if (userInfoStr) {
                    try {
                        const userInfo = JSON.parse(userInfoStr);
                        return userInfo.cartId?.toString();
                    } catch (error) {
                        console.error('Failed to parse user info:', error);
                    }
                }
                return undefined;
            },

            getCart: async (cartId?: string) => {
                // 如果传入了 cartId 就用传入的，否则尝试获取本地存储的，如果都没有则默认为 '0'
                const targetCartId = cartId || get().getCartId() || '0';

                // 如果是 '0' 且没有传入特定的 ID，通常意味着用户未登录且没有临时购物车，可以选择不请求
                // 但为了保险起见，还是允许请求空购物车

                set({ loading: true, error: null });
                try {
                    const cartResponse = await cartService.getCart(targetCartId);

                    const totalItems = cartResponse.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = cartResponse.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({ cart: cartResponse, loading: false, totalItems, totalPrice });
                    return cartResponse;
                } catch (err) {
                    console.error('getCart error:', err);
                    set({ loading: false });
                }
            },

            addItemToCart: async (request: AddToCartRequest) => {
                // ✅ 修复：如果 getCartId 返回 undefined，则默认为 '0'
                const cartId = get().getCartId() || '0';

                set({ loading: true, error: null });
                try {
                    const updatedCart = await cartService.addItemToCart(cartId, request);

                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({ cart: updatedCart, loading: false, totalItems, totalPrice });
                    globalToast.success('Added to Bag', `${request.productTitle} has been added.`);
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to add item';
                    console.error('addItemToCart - error:', err);
                    set({ error: message, loading: false });
                    globalToast.error('Error', message);
                    throw err;
                }
            },

            updateItemQuantity: async (itemId: number, quantity: number) => {
                // ✅ 修复：默认为 '0'
                const cartId = get().getCartId() || '0';

                set({ loading: true, error: null });
                try {
                    const updatedCart = await cartService.updateItemQuantity(cartId, itemId, quantity);

                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({ cart: updatedCart, loading: false, totalItems, totalPrice });
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to update quantity';
                    set({ error: message, loading: false });
                    globalToast.error('Update Failed', message);
                    throw err;
                }
            },

            removeItemFromCart: async (itemId: number) => {
                // ✅ 修复：默认为 '0'
                const cartId = get().getCartId() || '0';

                set({ loading: true, error: null });
                try {
                    await cartService.removeItemFromCart(cartId, itemId);
                    // 删除后重新获取购物车最新状态
                    const updatedCart = await cartService.getCart(cartId);

                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({ cart: updatedCart, loading: false, totalItems, totalPrice });
                    globalToast.success('Item Removed', 'The item has been removed from your bag.');
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to remove item';
                    set({ error: message, loading: false });
                    globalToast.error('Removal Failed', message);
                    throw err;
                }
            },

            clearError: () => set({ error: null }),

            clearCart: () => {
                set({ cart: null, totalItems: 0, totalPrice: 0 });
                localStorage.removeItem('cart-storage');
            },
        }),
        {
            name: 'cart-storage',
            partialize: (state) => ({
                cart: state.cart,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice
            }),
        }
    )
);