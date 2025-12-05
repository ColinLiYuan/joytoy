// contexts/authContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { LoginResponse, LoginRequest, RegisterRequest, RegisterResponse } from '@/types/auth';
import authService from '@/services/authService';
import AuthModal from '@/components/common/auth-modal';
import { useCartStore } from '@/stores/useCartStore';

interface AuthContextType {
    isAuthModalOpen: boolean;
    openAuthModal: (mode?: 'login' | 'register', options?: { onSuccess?: () => void }) => void;
    closeAuthModal: () => void;
    isLoggedIn: boolean;
    userInfo: LoginResponse | null;
    login: (loginRequest: LoginRequest) => Promise<LoginResponse>;
    logout: () => void;
    register: (registerRequest: RegisterRequest) => Promise<RegisterResponse>;
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

    const logout = useCallback(() => {
        // console.log('Logging out...');
        setIsLoggedIn(false);
        setUserInfo(null);

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userInfo');

        const { clearCart } = useCartStore.getState();
        clearCart();

        showToast('success', 'Logged Out', 'You have been successfully logged out');

        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    }, [showToast]);

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

    const login = useCallback(async (loginRequest: LoginRequest): Promise<LoginResponse> => {
        try {
            // console.log('Starting login process...');
            const loginResponse: LoginResponse = await authService.login(loginRequest);

            // console.log('LoginResponse...', loginResponse);

            setIsLoggedIn(true);
            setUserInfo(loginResponse);

            // 保存到 localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userInfo', JSON.stringify(loginResponse));

            showToast('success', 'Welcome Back', 'Successfully logged in');

            if (onSuccessCallbackRef.current) {
                // console.log('Executing onSuccessCallback');
                onSuccessCallbackRef.current();
                onSuccessCallbackRef.current = null;
            }

            closeAuthModal();

            return loginResponse;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }, [showToast, closeAuthModal]);

    const register = useCallback(async (registerRequest: RegisterRequest): Promise<RegisterResponse> => {
        const registerResponse: RegisterResponse = await authService.register(registerRequest);
        showToast('success', 'Registration Successful', 'Please login to continue');
        setAuthModalMode('login');
        return registerResponse;
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