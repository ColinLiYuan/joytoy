// stores/useCartStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartResponse, AddToCartRequest } from '@/types/cart';
import { getUserCart, addToCart as addToCartAction, removeFromCart as removeFromCartAction, updateCartItemQuantity as updateQuantityAction } from '@/app/actions/cart';
import { globalToast } from '@/contexts/toastContext';

interface CartStore {
    cart: CartResponse | null;
    loading: boolean;
    error: string | null;
    totalItems: number;
    totalPrice: number;

    // Actions
    getCart: () => Promise<CartResponse | undefined>;
    addItemToCart: (request: AddToCartRequest) => Promise<void>; // 改为 void，因为我们内部会刷新
    updateItemQuantity: (itemId: number, quantity: number) => Promise<void>;
    removeItemFromCart: (itemId: number) => Promise<void>;
    clearError: () => void;
    clearCart: () => void;
}

// 🛠️ 提取公共计算函数
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
                    const cartResponse = await getUserCart();
                    console.log('[Cart Store] Get cart response:', cartResponse)
                    const totals = calculateTotals(cartResponse);
                    console.log('[Cart Store] Calculated totals:', totals)

                    set({
                        cart: cartResponse,
                        loading: false,
                        ...totals
                    });
                    console.log('[Cart Store] State updated, cart items:', cartResponse.items?.length)
                    return cartResponse;
                } catch (err) {
                    console.error('getCart error:', err);
                    set({ loading: false, error: err instanceof Error ? err.message : 'Failed to fetch cart' });
                    throw err; // 重新抛出错误，让调用者知道失败了
                }
            },

            addItemToCart: async (request: AddToCartRequest) => {
                const previousTotal = get().totalItems;
                console.log('[Cart Store] Before add, totalItems:', previousTotal)
                set({
                    loading: true,
                    error: null,
                    totalItems: previousTotal + (request.quantity || 1)
                });

                try {
                    console.log('[Cart Store] Calling addToCartAction...')
                    await addToCartAction(request);
                    console.log('[Cart Store] addToCartAction success, now calling getCart...')
                    await get().getCart();
                    console.log('[Cart Store] getCart completed')
                    globalToast.success('Added to Bag', `${request.productTitle} is in your bag.`);
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to add item';
                    console.error('[Cart Store] Add item failed:', err)
                    set({
                        error: message,
                        loading: false,
                        totalItems: previousTotal
                    });
                    globalToast.error('Error', message);
                    throw err;
                }
            },

            updateItemQuantity: async (itemId: number, quantity: number) => {
                set({ loading: true, error: null });

                try {
                    await updateQuantityAction(itemId, quantity);
                    await get().getCart();
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to update quantity';
                    set({ error: message, loading: false });
                    globalToast.error('Update Failed', message);
                    await get().getCart();
                    throw err;
                }
            },

            removeItemFromCart: async (itemId: number) => {
                const currentCart = get().cart;
                if (currentCart && currentCart.items) {
                    const optimisticItems = currentCart.items.filter(i => i.itemId !== itemId);
                    const optimisticTotals = calculateTotals({ ...currentCart, items: optimisticItems });

                    set({
                        cart: { ...currentCart, items: optimisticItems },
                        ...optimisticTotals,
                        loading: true,
                        error: null
                    });
                }

                try {
                    await removeFromCartAction(itemId);
                    await get().getCart();
                    globalToast.success('Removed', 'Item removed from bag.');
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to remove item';
                    set({ error: message, loading: false });
                    globalToast.error('Removal Failed', message);
                    await get().getCart();
                    throw err;
                }
            },

            clearError: () => set({ error: null }),

            clearCart: () => {
                set({ cart: null, totalItems: 0, totalPrice: 0 });
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