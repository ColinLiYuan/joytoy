// lib/token-utils.ts
import { getCookie, setCookie, removeCookie } from '@/lib/cookie-utils';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';
const IS_LOGGED_IN_KEY = 'isLoggedIn';

const isBrowser = typeof window !== 'undefined';

/**
 * 获取 Access Token
 * 策略：Server端只读Cookie；Client端优先Cookie，没有则读LocalStorage
 */
export const getToken = async (): Promise<string | undefined> => {
    // 1. 尝试从 Cookie 获取 (支持 Server & Client)
    const cookieToken = await getCookie(ACCESS_TOKEN_KEY);
    if (cookieToken) return cookieToken;
    // console.log('getToken cookieToken: ', cookieToken)
    // console.log('getToken storage: ', localStorage.getItem(ACCESS_TOKEN_KEY))
    // 2. 如果是客户端，尝试从 LocalStorage 兜底
    if (isBrowser) {
        return localStorage.getItem(ACCESS_TOKEN_KEY) || undefined;
    }

    return undefined;
};

/**
 * 获取 Refresh Token
 */
export const getRefreshToken = async (): Promise<string | undefined> => {
    const cookieToken = await getCookie(REFRESH_TOKEN_KEY);
    if (cookieToken) return cookieToken;

    if (isBrowser) {
        return localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
    }
    return undefined;
};

/**
 * 获取用户信息对象
 */
export const getUserInfo = async (): Promise<any | null> => {
    // 优先从 LocalStorage 取，因为 Cookie 里存 JSON 字符串可能会被编码导致解析麻烦
    if (isBrowser) {
        const localStr = localStorage.getItem(USER_INFO_KEY);
        if (localStr) {
            try { return JSON.parse(localStr); } catch (e) {}
        }
    }

    // 其次尝试 Cookie
    const cookieStr = await getCookie(USER_INFO_KEY);
    if (cookieStr) {
        try { return JSON.parse(decodeURIComponent(cookieStr)); } catch (e) {}
    }

    return null;
};

/**
 * ✅ 核心：双写 Token (Cookie + Storage)
 * 仅在客户端调用 (Login/Register 成功后)
 */
export const setTokens = (accessToken: string, refreshToken: string) => {
    if (!isBrowser) return;

    // 1. 写入 Cookie
    setCookie(ACCESS_TOKEN_KEY, accessToken);
    setCookie(REFRESH_TOKEN_KEY, refreshToken);

    // 2. 写入 LocalStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * 保存用户 Session 信息 (双写)
 */
export const setUserSession = (userInfo: any) => {
    if (!isBrowser) return;

    const userInfoStr = JSON.stringify(userInfo);

    // Cookie
    setCookie(USER_INFO_KEY, userInfoStr);
    setCookie(IS_LOGGED_IN_KEY, 'true');

    // Storage
    localStorage.setItem(USER_INFO_KEY, userInfoStr);
    localStorage.setItem(IS_LOGGED_IN_KEY, 'true');
};

/**
 * 🧹 清除所有 (登出时调用)
 */
export const clearTokens = async () => {
    if (!isBrowser) return;

    // 清除 Cookie
    removeCookie(ACCESS_TOKEN_KEY);
    removeCookie(REFRESH_TOKEN_KEY);
    removeCookie(USER_INFO_KEY);
    removeCookie(IS_LOGGED_IN_KEY);

    // 清除 Storage
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_INFO_KEY);
    localStorage.removeItem(IS_LOGGED_IN_KEY);

    // 触发事件通知其他 Tab
    window.dispatchEvent(new Event('storage'));
};

export const updateAccessToken = (newToken: string): void => {
    if (!isBrowser) return;

    // 更新 localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken);

    // 更新 cookie（带过期时间）
    setCookie(ACCESS_TOKEN_KEY, newToken, {
        expires: 30 / 60 / 24, // 30分钟
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
};

/**
 * 服务端专用：获取当前用户ID
 */
export const getServerUserId = async (): Promise<number | null> => {
    const userInfo = await getUserInfo();
    return userInfo?.id || null;
};

/**
 * 解析 Token 检查是否过期
 * @param token JWT Token
 * @param advanceSeconds 提前多少秒判定为过期（默认 30 秒）
 * @returns true 表示已过期或即将过期，false 表示有效
 */
export const isTokenExpired = (token: string, advanceSeconds: number = 30): boolean => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );

        const { exp } = JSON.parse(jsonPayload);
        if (!exp) return true;

        // 检查是否已过期或即将过期
        const now = Math.floor(Date.now() / 1000);
        return now >= (exp - advanceSeconds);
    } catch (error) {
        console.error('[TokenUtils] Failed to parse token:', error);
        return true; // 解析失败视为过期
    }
};

/**
 * 服务端 Token 刷新
 * 当 Token 过期时，使用 Refresh Token 获取新的 Access Token
 */
export const refreshTokenIfNeeded = async (): Promise<string | undefined> => {
    const token = await getToken();
    if (!token) return undefined;

    // 检查是否过期
    if (!isTokenExpired(token)) {
        return token; // 未过期，直接返回
    }

    // Token 已过期，尝试刷新
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.warn('[TokenUtils] No refresh token available');
        return undefined;
    }

    try {
        const { BACKEND_CONFIG } = await import('@/lib/api-config');
        const response = await fetch(`${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            console.warn('[TokenUtils] Token refresh failed:', response.status);
            return undefined;
        }

        const result = await response.json();
        if (result?.success && result?.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken } = result.data;

            // 更新 Token（服务端只更新 Cookie）
            if (typeof window === 'undefined') {
                const { setCookie } = await import('@/lib/cookie-utils');
                setCookie(ACCESS_TOKEN_KEY, accessToken);
                if (newRefreshToken) {
                    setCookie(REFRESH_TOKEN_KEY, newRefreshToken);
                }
            }

            console.log('[TokenUtils] Token refreshed successfully');
            return accessToken;
        }

        return undefined;
    } catch (error) {
        console.error('[TokenUtils] Token refresh error:', error);
        return undefined;
    }
};