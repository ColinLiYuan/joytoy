// stores/useCartStore.ts

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

    // Actions
    getCart: (cartId?: string) => Promise<CartResponse | undefined>;
    addItemToCart: (request: AddToCartRequest) => Promise<CartResponse | undefined>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<CartResponse | undefined>;
    removeItemFromCart: (itemId: number) => Promise<CartResponse | undefined>;
    clearError: () => void;
    clearCart: () => void;

    // Helper
    getCartId: () => string; // 确保返回 string，默认为 '0'
}

// 🛠️ 提取公共计算函数 (DRY原则)
const calculateTotals = (cart: CartResponse | null) => {
    if (!cart || !cart.items) return { totalItems: 0, totalPrice: 0 };
    return {
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cart.items.reduce((total, item) => total + item.totalPrice, 0),
    };
};

// 🛠️ 提取 LocalStorage 解析逻辑
const getStoredCartId = (): string => {
    if (typeof window === 'undefined') return '0';
    try {
        const userInfoStr = localStorage.getItem('userInfo');
        if (userInfoStr) {
            const userInfo = JSON.parse(userInfoStr);
            return userInfo.cartId?.toString() || '0';
        }
    } catch (error) {
        console.error('Failed to parse cartId from userInfo:', error);
    }
    return '0';
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: null,
            loading: false,
            error: null,
            totalItems: 0,
            totalPrice: 0,

            // 获取 CartId，如果没有则返回 '0'
            getCartId: () => getStoredCartId(),

            getCart: async (cartId?: string) => {
                const targetCartId = cartId || get().getCartId();

                set({ loading: true, error: null });
                try {
                    const cartResponse = await cartService.getCart(targetCartId);
                    const totals = calculateTotals(cartResponse);

                    set({
                        cart: cartResponse,
                        loading: false,
                        ...totals // 自动展开 totalItems, totalPrice
                    });
                    return cartResponse;
                } catch (err) {
                    console.error('getCart error:', err);
                    set({ loading: false });
                    // 获取失败不一定要清空，保留上次状态可能体验更好
                }
            },

            addItemToCart: async (request: AddToCartRequest) => {
                const cartId = get().getCartId();
                set({ loading: true, error: null });

                try {
                    const updatedCart = await cartService.addItemToCart(cartId, request);
                    const totals = calculateTotals(updatedCart);

                    set({
                        cart: updatedCart,
                        loading: false,
                        ...totals
                    });

                    globalToast.success('Added to Bag', `${request.productTitle} has been added.`);
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to add item';
                    set({ error: message, loading: false });
                    globalToast.error('Error', message);
                    throw err;
                }
            },

            updateItemQuantity: async (itemId: number, quantity: number) => {
                const cartId = get().getCartId();
                // 乐观更新 UI 还是等待服务器？为了准确性，这里选择等待服务器
                set({ loading: true, error: null });

                try {
                    const updatedCart = await cartService.updateItemQuantity(cartId, itemId, quantity);
                    const totals = calculateTotals(updatedCart);

                    set({
                        cart: updatedCart,
                        loading: false,
                        ...totals
                    });
                    return updatedCart;
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to update quantity';
                    set({ error: message, loading: false });
                    globalToast.error('Update Failed', message);
                    throw err;
                }
            },

            removeItemFromCart: async (itemId: number) => {
                const cartId = get().getCartId();
                set({ loading: true, error: null });

                try {
                    // 1. 先执行删除
                    await cartService.removeItemFromCart(cartId, itemId);

                    // 2. 重新获取最新购物车状态
                    // (优化点：如果后端 removeItem 接口直接返回了最新的 Cart 对象，这里就不用再调一次 getCart 了)
                    const updatedCart = await cartService.getCart(cartId);
                    const totals = calculateTotals(updatedCart);

                    set({
                        cart: updatedCart,
                        loading: false,
                        ...totals
                    });

                    globalToast.success('Removed', 'Item removed from bag.');
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
                // 注意：这里通常只清除 store 状态，不清除 localStorage 里的 'cart-storage'
                // 除非你是想彻底重置用户的所有本地缓存
            },
        }),
        {
            name: 'cart-storage', // LocalStorage key
            // 只持久化这些字段
            partialize: (state) => ({
                cart: state.cart,
                totalItems: state.totalItems,
                totalPrice: state.totalPrice
            }),
        }
    )
);