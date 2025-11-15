// stores/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartResponse, AddToCartRequest } from '@/types/cart';
import { cartService } from '@/services/cartService';

interface CartStore {
    // 状态
    cart: CartResponse | null;
    loading: boolean;
    error: string | null;

    // 响应式计算属性
    totalItems: number;
    totalPrice: number;

    // 操作方法
    getCart: (cartId?: string) => Promise<CartResponse | undefined>;
    addItemToCart: (request: AddToCartRequest) => Promise<CartResponse | undefined>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<CartResponse | undefined>;
    removeItemFromCart: (itemId: number) => Promise<CartResponse | undefined>;
    clearError: () => void;
    clearCart: () => void;

    // 辅助方法
    getCartId: () => string | undefined;
}

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            // 初始状态
            cart: null,
            loading: false,
            error: null,
            totalItems: 0,
            totalPrice: 0,

            // 获取购物车ID的辅助方法
            getCartId: (): string | undefined => {
                // 优先从用户信息获取
                const userInfoStr = localStorage.getItem('userInfo');
                if (userInfoStr) {
                    try {
                        const userInfo = JSON.parse(userInfoStr);
                        if (userInfo.cartId) {
                            return userInfo.cartId.toString();
                        }
                    } catch (error) {
                        console.error('Failed to parse user info:', error);
                    }
                }
            },

            // 获取购物车
            getCart: async (cartId?: string) => {
                let targetCartId = cartId || get().getCartId();

                if (!targetCartId) {
                    set({ error: 'Cart ID not found' });
                    return;
                }

                set({ loading: true, error: null });
                try {
                    const cartResponse = await cartService.getCart(targetCartId);

                    // 更新购物车同时更新计算属性
                    const totalItems = cartResponse.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = cartResponse.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({
                        cart: cartResponse,
                        loading: false,
                        totalItems,
                        totalPrice
                    });
                    return cartResponse;
                } catch (err) {
                    const message = err instanceof Error ? err.message : '获取购物车失败';
                    console.error('getCart - error:', err);
                    set({ error: message, loading: false });
                    throw err;
                }
            },

            // 更新商品数量
            updateItemQuantity: async (itemId: number, quantity: number) => {
                const cartId = get().getCartId();

                if (!cartId) {
                    const error = 'Cart ID not found';
                    set({ error });
                    throw new Error(error);
                }

                set({ loading: true, error: null });
                try {
                    const updatedCart = await cartService.updateItemQuantity(cartId, itemId, quantity);

                    // 更新计算属性
                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({
                        cart: updatedCart,
                        loading: false,
                        totalItems,
                        totalPrice
                    });
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : '更新商品数量失败';
                    console.error('updateItemQuantity - error:', err);
                    set({ error: message, loading: false });
                    throw err;
                }
            },

            // 从购物车移除商品
            removeItemFromCart: async (itemId: number) => {
                const cartId = get().getCartId();

                if (!cartId) {
                    const error = 'Cart ID not found';
                    set({ error });
                    throw new Error(error);
                }

                set({ loading: true, error: null });
                try {
                    await cartService.removeItemFromCart(cartId, itemId);
                    const updatedCart = await cartService.getCart(cartId);

                    // 更新计算属性
                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({
                        cart: updatedCart,
                        loading: false,
                        totalItems,
                        totalPrice
                    });
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : '移除商品失败';
                    console.error('removeItemFromCart - error:', err);
                    set({ error: message, loading: false });
                    throw err;
                }
            },

            // 添加商品到购物车
            addItemToCart: async (request: AddToCartRequest) => {
                const cartId = get().getCartId();

                if (!cartId) {
                    set({ error: 'Cart ID not found' });
                    throw new Error('Cart ID not found');
                }

                set({ loading: true, error: null });
                try {
                    const updatedCart = await cartService.addItemToCart(cartId, request);

                    // 更新计算属性
                    const totalItems = updatedCart.items?.reduce((total, item) => total + item.quantity, 0) || 0;
                    const totalPrice = updatedCart.items?.reduce((total, item) => total + item.totalPrice, 0) || 0;

                    set({
                        cart: updatedCart,
                        loading: false,
                        totalItems,
                        totalPrice
                    });
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : '添加商品失败';
                    console.error('addItemToCart - error:', err);
                    set({ error: message, loading: false });
                    throw err;
                }
            },

            // 清除错误信息
            clearError: () => {
                set({ error: null });
            },

            // 清空购物车
            clearCart: () => {
                set({
                    cart: null,
                    totalItems: 0,
                    totalPrice: 0
                });
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