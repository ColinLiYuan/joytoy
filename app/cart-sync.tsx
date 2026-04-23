// app/cart-sync.tsx
'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';

export function CartSync() {
    const getCart = useCartStore(state => state.getCart);
    const cart = useCartStore(state => state.cart);
    const { isLoggedIn } = useAuth();

    // ✅ 页面加载时初始化购物车，登录后也会重新获取
    useEffect(() => {
        console.log('[CartSync] useEffect triggered', { isLoggedIn, hasCartId: !!cart?.id });
        
        // 如果购物车还没有初始化，则获取
        if (!cart?.id) {
            console.log('[CartSync] Cart not initialized, fetching...');
            getCart()
                .then(result => {
                    console.log('[CartSync] Cart fetched successfully:', result);
                })
                .catch(error => {
                    console.error('[CartSync] Failed to fetch cart:', error);
                });
        } else {
            console.log('[CartSync] Cart already initialized, skipping');
        }
    }, [getCart, isLoggedIn]);

    return null; // 这个组件不渲染任何内容，只负责副作用
}
