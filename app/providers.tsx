// providers.tsx
'use client';
import { ToastProvider } from '@/contexts/toastContext';
import { AuthProvider } from '@/contexts/authContext';
import { useEffect } from 'react';
import { useCartStore } from '@/stores/useCartStore';

export function Providers({ children }: { children: React.ReactNode }) {
    const getCart = useCartStore(state => state.getCart);

    useEffect(() => {
        getCart().catch(console.error);
    }, [getCart]);

    return (
        <ToastProvider>
            <AuthProvider>
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}