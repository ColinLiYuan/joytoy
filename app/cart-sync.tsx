// app/cart-sync.tsx
'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';

export function CartSync() {
    const getCart = useCartStore(state => state.getCart);
    const cart = useCartStore(state => state.cart);
    const { isLoggedIn, isClient } = useAuth();

    // ✅ 页面加载时初始化购物车（游客和登录用户都需要）
    useEffect(() => {
        if (!isClient) return;
        
        // 如果购物车还没有初始化，则获取（无论是游客还是登录用户）
        if (!cart?.id) {
            console.log('[CartSync] Cart not initialized, fetching...');
            getCart().catch(error => {
                console.error('[CartSync] Failed to fetch cart:', error);
            });
        }
    }, [isClient]);

    // ✅ 登录状态变化时，重新获取购物车（合并游客购物车）
    useEffect(() => {
        if (!isClient) return;
        
        // 用户登录后，需要刷新购物车以合并游客购物车
        if (isLoggedIn && cart?.id) {
            console.log('[CartSync] User logged in, refreshing cart to merge guest cart...');
            getCart().catch(error => {
                console.error('[CartSync] Failed to refresh cart after login:', error);
            });
        }
    }, [isLoggedIn, isClient]);

    return null; // 这个组件不渲染任何内容，只负责副作用
}
