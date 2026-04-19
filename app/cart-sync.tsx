// app/cart-sync.tsx
'use client';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';
import { useAuth } from '@/contexts/authContext';

export function CartSync() {
    const getCart = useCartStore(state => state.getCart);
    const { isLoggedIn } = useAuth();

    // ✅ 只在用户登录时才获取购物车
    useEffect(() => {
        if (isLoggedIn) {
            getCart().catch(console.error);
        }
    }, [getCart, isLoggedIn]);

    return null; // 这个组件不渲染任何内容，只负责副作用
}
