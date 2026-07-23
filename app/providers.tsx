// providers.tsx
'use client';
import { Suspense } from 'react';
import { ToastProvider } from '@/contexts/toastContext';
import { AuthProvider } from '@/contexts/authContext';
import { CartSync } from './cart-sync';
import AutoLoginModal from '@/components/common/auto-login-modal';
import { useSearchParams, usePathname } from 'next/navigation';

function AutoLoginContent() {
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || null;

    return <AutoLoginModal redirectPath={redirectPath} />;
}

function AutoLoginWrapper() {
    return (
        <Suspense fallback={null}>
            <AutoLoginContent />
        </Suspense>
    );
}

function CartSyncWrapper() {
    const pathname = usePathname();
    
    // ✅ 只在非管理后台和非联盟后台的页面加载购物车同步
    const isAdminPage = pathname?.startsWith('/admin');
    const isAffiliatePage = pathname?.startsWith('/affiliate');
    
    if (isAdminPage || isAffiliatePage) {
        return null;
    }
    
    return <CartSync />;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <AuthProvider>
                <CartSyncWrapper />
                <AutoLoginWrapper />
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}