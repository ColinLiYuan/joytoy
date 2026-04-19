// providers.tsx
'use client';
import { ToastProvider } from '@/contexts/toastContext';
import { AuthProvider } from '@/contexts/authContext';
import { CartSync } from './cart-sync';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartSync />
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}