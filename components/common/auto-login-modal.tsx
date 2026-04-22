'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';

interface AutoLoginModalProps {
    redirectPath: string | null;
}

/**
 * 自动登录触发器组件
 * 当 URL 包含 redirect 参数时，自动打开 authContext 的全局登录框
 * 登录成功后由 authContext 自动跳转，不需要在这里处理
 * 
 * 这个组件不渲染任何 UI，只负责触发 authContext 的登录框
 */
export default function AutoLoginModal({ redirectPath }: AutoLoginModalProps) {
    const { isLoggedIn, isClient, openAuthModal } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // 等待客户端初始化完成
        if (!isClient) return;
        
        // 如果有 redirect 参数且用户未登录，自动打开 authContext 的全局登录框
        if (redirectPath && !isLoggedIn) {
            console.log('[AutoLoginTrigger] Redirect detected:', redirectPath, '- opening login modal');
            openAuthModal('login');
        }
    }, [redirectPath, isLoggedIn, isClient, openAuthModal]);

    // 如果用户已经登录了，清除 URL 中的 redirect 参数
    useEffect(() => {
        if (isLoggedIn && redirectPath) {
            console.log('[AutoLoginTrigger] User already logged in, clearing redirect param');
            router.replace('/');
        }
    }, [isLoggedIn, redirectPath, router]);

    // 这个组件不渲染任何内容
    return null;
}
