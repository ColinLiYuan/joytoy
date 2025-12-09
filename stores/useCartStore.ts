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
                // 防抖：如果已经在加载，就不重复请求 (除非为了强制刷新，可去掉此行)
                // if (get().loading) return;

                set({ loading: true, error: null });
                try {
                    const cartResponse = await cartService.getCart();
                    const totals = calculateTotals(cartResponse);

                    set({
                        cart: cartResponse,
                        loading: false,
                        ...totals
                    });
                    return cartResponse;
                } catch (err) {
                    console.error('getCart error:', err);
                    set({ loading: false });
                    // 即使失败，也不要轻易清空旧数据，除非是 401/403
                }
            },

            addItemToCart: async (request: AddToCartRequest) => {
                // 1. 🚀 乐观更新：先假设成功，立即更新数量，让右上角红点马上变
                // 这样用户体验极佳，不会觉得“点了没反应”
                const previousTotal = get().totalItems;
                set({
                    loading: true,
                    error: null,
                    totalItems: previousTotal + (request.quantity || 1) // 预先 +1
                });

                try {
                    // 2. 发送请求
                    await cartService.addItemToCart(request);

                    // 3. 🔄 强制同步：请求成功后，重新拉取整个购物车
                    // 这能确保 ID、价格、库存等所有信息绝对准确，解决 "数量少一个" 的问题
                    await get().getCart();

                    globalToast.success('Added to Bag', `${request.productTitle} is in your bag.`);
                } catch (err) {
                    // 4. ❌ 失败回滚：把刚才乐观加上的数量减回去
                    const message = err instanceof Error ? err.message : 'Failed to add item';
                    set({
                        error: message,
                        loading: false,
                        totalItems: previousTotal // 回滚
                    });
                    globalToast.error('Error', message);
                    throw err;
                }
            },

            updateItemQuantity: async (itemId: number, quantity: number) => {
                // 乐观更新逻辑略复杂，这里暂只做 Loading
                set({ loading: true, error: null });

                try {
                    await cartService.updateItemQuantity(itemId, quantity);
                    // 同样，操作完直接刷新全量数据
                    await get().getCart();
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to update quantity';
                    set({ error: message, loading: false });
                    globalToast.error('Update Failed', message);
                    // 失败时也刷新一次，确保数据回正
                    await get().getCart();
                    throw err;
                }
            },

            removeItemFromCart: async (itemId: number) => {
                // 1. 乐观更新：先在 UI 上把它踢掉
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
                    await cartService.removeItemFromCart(itemId);
                    // 2. 后端确认删除后，再次拉取以防万一
                    await get().getCart();
                    globalToast.success('Removed', 'Item removed from bag.');
                } catch (err) {
                    const message = err instanceof Error ? err.message : 'Failed to remove item';
                    set({ error: message, loading: false });
                    globalToast.error('Removal Failed', message);
                    // 失败了，把数据拉回来
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