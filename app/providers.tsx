// providers.tsx
'use client';
import dynamic from 'next/dynamic';
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

// ✅ SSR 时完全跳过，避免 useSearchParams 导致静态页面预渲染失败
const LazyAutoLoginContent = dynamic(() => Promise.resolve({ default: AutoLoginContent }), {
    ssr: false,
});

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
                <LazyAutoLoginContent />
                {children}
            </AuthProvider>
        </ToastProvider>
    );
}
