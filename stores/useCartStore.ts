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
    getCart: () => Promise<CartResponse | undefined>;
    addItemToCart: (request: AddToCartRequest) => Promise<CartResponse | undefined>;
    updateItemQuantity: (itemId: number, quantity: number) => Promise<CartResponse | undefined>;
    removeItemFromCart: (itemId: number) => Promise<CartResponse | undefined>;
    clearError: () => void;
    clearCart: () => void;
}

// 🛠️ 提取公共计算函数 (DRY原则)
const calculateTotals = (cart: CartResponse | null) => {
    if (!cart || !cart.items) return { totalItems: 0, totalPrice: 0 };
    return {
        totalItems: cart.items.reduce((total, item) => total + item.quantity, 0),
        totalPrice: cart.items.reduce((total, item) => total + item.totalPrice, 0),
    };
};

export const useCartStore = create<CartStore>()(
    persist(
        (set, get) => ({
            cart: null,
            loading: false,
            error: null,
            totalItems: 0,
            totalPrice: 0,

            getCart: async () => {
                set({ loading: true, error: null });
                try {
                    const cartResponse = await cartService.getCart();
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
                set({ loading: true, error: null });

                try {
                    const updatedCart = await cartService.addItemToCart(request);
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
                set({ loading: true, error: null });

                try {
                    const updatedCart = await cartService.updateItemQuantity(itemId, quantity);
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
                set({ loading: true, error: null });

                try {
                    // 1. 先执行删除
                    await cartService.removeItemFromCart(itemId);

                    // 2. 重新获取最新购物车状态
                    const updatedCart = await cartService.getCart();
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