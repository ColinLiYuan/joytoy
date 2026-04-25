// providers.tsx
'use client';
import { ToastProvider } from '@/contexts/toastContext';
import { AuthProvider } from '@/contexts/authContext';
import { CartSync } from './cart-sync';
import AutoLoginModal from '@/components/common/auto-login-modal';
import { useSearchParams } from 'next/navigation';

function AutoLoginWrapper() {
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || null;
    
    return <AutoLoginModal redirectPath={redirectPath} />;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartSync />
                <AutoLoginWrapper />
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}