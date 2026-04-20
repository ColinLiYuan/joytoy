// contexts/authContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse } from '@/types/auth';
import authService from '@/services/authService';
import AuthModal from '@/components/common/auth-modal';
import { useCartStore } from '@/stores/useCartStore';
import { setTokens, clearTokens } from '@/lib/token-utils';

interface AuthContextType {
    isAuthModalOpen: boolean;
    openAuthModal: (mode?: 'login' | 'register', options?: { onSuccess?: () => void }) => void;
    closeAuthModal: () => void;
    isLoggedIn: boolean;
    userInfo: LoginResponse | null;
    login: (loginRequest: LoginRequest) => Promise<LoginResponse>;
    logout: () => void;
    register: (registerRequest: RegisterRequest) => Promise<RegisterResponse>;
    forgotPassword: (email: string) => Promise<void>;
    authModalMode: 'login' | 'register';
    isClient: boolean; // 添加客户端状态
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 安全的 Toast hook
const useSafeToast = () => {
    const getToast = useCallback(() => {
        try {
            const { useToast } = require('@/contexts/toastContext');
            return useToast;
        } catch (error) {
            return () => ({
                showToast: (type: string, title: string, message: string) => {
                    console.log(`[Toast] ${type}: ${title} - ${message}`);
                }
            });
        }
    }, []);

    const toastHook = getToast();
    return toastHook();
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

    // 状态初始化
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState<LoginResponse | null>(null);
    const [isClient, setIsClient] = useState(false); // 客户端状态

    const onSuccessCallbackRef = useRef<(() => void) | null>(null);
    const { showToast } = useSafeToast();

    // ✅ 定义 openAuthModal 在使用它之前
    const openAuthModal = useCallback((mode: 'login' | 'register' = 'login', options?: { onSuccess?: () => void }) => {
        setAuthModalMode(mode);
        setIsAuthModalOpen(true);
        if (options?.onSuccess) {
            onSuccessCallbackRef.current = options.onSuccess;
        }
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsAuthModalOpen(false);
        onSuccessCallbackRef.current = null;
    }, []);

    // 在客户端初始化认证状态
    useEffect(() => {
        setIsClient(true);
        const savedLoginState = localStorage.getItem('isLoggedIn');
        const userInfoStr = localStorage.getItem('userInfo');

        // console.log('AuthContext client init:', { savedLoginState, userInfoStr });

        if (savedLoginState === 'true' && userInfoStr) {
            try {
                setIsLoggedIn(true);
                setUserInfo(JSON.parse(userInfoStr));
                // console.log('AuthContext: User is logged in');
            } catch (error) {
                console.error('Failed to parse user info:', error);
                // 清除损坏的数据
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userInfo');

                const { clearCart } = useCartStore.getState();
                clearCart();
            }
        }
    }, []);

    // ✅ 全局监听 token 过期事件，自动弹出登录框
    useEffect(() => {
        const handleTokenExpired = (event: CustomEvent<{ message: string }>) => {
            console.log('Token expired event received:', event.detail.message);
            
            // 直接设置状态
            setAuthModalMode('login');
            setIsAuthModalOpen(true);
        };

        if (typeof window !== 'undefined') {
            window.addEventListener('auth:tokenExpired', handleTokenExpired as EventListener);
        }

        return () => {
            if (typeof window !== 'undefined') {
                window.removeEventListener('auth:tokenExpired', handleTokenExpired as EventListener);
            }
        };
    }, []);

    const logout = useCallback(() => {
        clearTokens();
        setIsLoggedIn(false);
        setUserInfo(null);

        const { clearCart } = useCartStore.getState();
        clearCart();

        showToast('success', 'Logged Out', 'You have been successfully logged out');

        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }, [showToast]);

    const login = useCallback(async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        try {
            // authService.login 现在会返回 LoginResponse (用户数据)，或者抛出 Error
            const loginResponse = await authService.login(loginRequest);
            // console.log('login callback result: ', loginResponse)

            setTokens(loginResponse.accessToken, loginResponse.refreshToken);
            setIsLoggedIn(true);
            setUserInfo(loginResponse);

            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(loginResponse));

            showToast('success', 'Welcome Back', 'Successfully logged in');

            // ✅ 优先检查 URL 中的 redirect 参数
            if (typeof window !== 'undefined') {
                const urlParams = new URLSearchParams(window.location.search);
                const redirect = urlParams.get('redirect');
                
                if (redirect) {
                    // 有 redirect 参数，等待 Cookie 写入后跳转到目标页面
                    setTimeout(() => {
                        window.location.href = redirect;
                    }, 100); // 等待 100ms 确保 Cookie 写入
                    return loginResponse;
                }
            }

            if (loginResponse.affiliateId) {
                // 如果有联盟ID，直接跳转到联盟专用看板
                setTimeout(() => {
                    window.location.href = '/affiliate';
                }, 100);
            } else {
                // 普通用户流程 - 先执行成功回调，然后关闭模态框
                if (onSuccessCallbackRef.current) {
                    onSuccessCallbackRef.current();
                    onSuccessCallbackRef.current = null;
                }
                closeAuthModal();
            }

            return loginResponse;
        } catch (error: any) {
            console.error('Login failed in Context:', error);
            throw error;
        }
    }, [showToast, closeAuthModal]);

    const register = useCallback(async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
        try {
            const registerResponse = await authService.register(registerRequest);

            showToast('success', 'Registration Successful', 'Please login to continue');
            setAuthModalMode('login');
            return registerResponse;
        } catch (error: any) {
            console.error('Register failed in Context:', error);
            throw error;
        }
    }, [showToast]);

    const forgotPassword = useCallback(async (email: string) => {
        try {
            await authService.forgotPassword(email);
            showToast('success', 'Email Sent', 'Password reset instructions have been sent to your inbox.');
        } catch (error: any) {
            console.error('Forgot password failed:', error);
            throw error;
        }
    }, [showToast]);

    const value = useMemo(() => ({
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isLoggedIn: isClient ? isLoggedIn : false,
        userInfo: isClient ? userInfo : null,
        login,
        logout,
        register,
        authModalMode,
        isClient,
        forgotPassword,
    }), [
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        isLoggedIn,
        userInfo,
        login,
        logout,
        register,
        authModalMode,
        isClient
    ]);

    // console.log('AuthProvider rendering:', { isClient, isLoggedIn, userInfo });

    return (
        <AuthContext.Provider value={value}>
            {children}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={closeAuthModal}
            />
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}