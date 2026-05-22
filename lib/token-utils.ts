// lib/token-utils.ts
import { getCookie, setCookie, removeCookie } from '@/lib/cookie-utils';

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_INFO_KEY = 'userInfo';
const IS_LOGGED_IN_KEY = 'isLoggedIn';

const isBrowser = typeof window !== 'undefined';

// 服务端内存缓存，用于存储刷新后的token
export let serverTokenCache: string | undefined;
export let serverTokenExpiry: number | undefined;

/**
 * 获取 Access Token
 * 策略：Server端优先使用缓存，缓存过期则尝试刷新；Client端优先Cookie，没有则读LocalStorage
 */
export const getToken = async (): Promise<string | undefined> => {
    // 服务端：优先使用缓存的token
    if (!isBrowser && serverTokenCache && serverTokenExpiry) {
        const now = Math.floor(Date.now() / 1000);
        if (now < serverTokenExpiry) {
            return serverTokenCache;
        } else {
            // 缓存过期，清除
            serverTokenCache = undefined;
            serverTokenExpiry = undefined;
        }
    }
    
    // 服务端：缓存过期，尝试刷新token
    if (!isBrowser && !serverTokenCache) {
        const newToken = await refreshTokenIfNeeded();
        if (newToken) {
            return newToken;
        }
    }
    
    // 1. 尝试从 Cookie 获取 (支持 Server & Client)
    const cookieToken = await getCookie(ACCESS_TOKEN_KEY);
    if (cookieToken) {
        // 检查是否即将过期（提前30秒）
        if (!isTokenExpired(cookieToken, 30)) {
            return cookieToken;
        }
        // Token即将过期，尝试刷新
        const refreshedToken = await refreshTokenIfNeeded();
        return refreshedToken;
    }
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
        const storageToken = localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
        return storageToken;
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
 * @param accessToken - Access Token
 * @param refreshToken - Refresh Token
 * @param expiresIn - Access Token 过期时间（秒）
 * @param refreshExpiresIn - Refresh Token 过期时间（秒）
 */
export const setTokens = (
    accessToken: string, 
    refreshToken: string,
    expiresIn?: number,
    refreshExpiresIn?: number
) => {
    if (!isBrowser) return;

    // 1. 写入 Cookie（使用后端返回的过期时间）
    const accessExpires = expiresIn ? expiresIn / 60 / 60 / 24 : 1 / 60 / 24; // 默认 1 分钟
    const refreshExpires = refreshExpiresIn ? refreshExpiresIn / 60 / 60 / 24 : 7; // 默认 7 天
    
    setCookie(ACCESS_TOKEN_KEY, accessToken, {
        expires: accessExpires,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });
    setCookie(REFRESH_TOKEN_KEY, refreshToken, {
        expires: refreshExpires,
        path: '/',
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
    });

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
 * 确保 Token 是新鲜的（提前指定时间刷新）
 * 用于关键操作前的预检查，如产品列表、支付等
 * @param advanceSeconds 提前多少秒刷新（默认 30 秒）
 * @returns 有效的 Access Token 或 undefined
 */
export const ensureFreshToken = async (advanceSeconds: number = 30): Promise<string | undefined> => {
    const token = await getToken();
    if (!token) return undefined;

    // 检查是否即将过期（提前指定时间）
    if (isTokenExpired(token, advanceSeconds)) {
        // 需要刷新
        return refreshTokenIfNeeded();
    }

    // 不需要刷新，直接返回
    return token;
};

/**
 * 服务端 Token 刷新
 * 当 Token 过期时，使用 Refresh Token 获取新的 Access Token
 */
export const refreshTokenIfNeeded = async (): Promise<string | undefined> => {
    // ✅ 直接获取 refresh token，不再调用 getToken 避免递归
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.warn('[TokenUtils] No refresh token available');
        return undefined;
    }

    try {
        const { BACKEND_CONFIG } = await import('@/lib/api-config');
        const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`;

        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('[TokenUtils] Token refresh failed:', response.status, errorText);
            return undefined;
        }

        const result = await response.json();
        
        if (result?.success && result?.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = result.data;

            // 服务端：缓存token到内存（不写cookie，Next.js 16 Server Component 不允许修改 cookie）
            if (!isBrowser) {
                serverTokenCache = accessToken;
                if (expiresIn) {
                    serverTokenExpiry = Math.floor(Date.now() / 1000) + (expiresIn - 300); // 提前5分钟过期
                }
                // Cookie 的写入由 Server Action / Route Handler 负责，这里只做内存缓存
            }

            // 客户端：更新localStorage和cookie
            if (isBrowser) {
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                if (newRefreshToken) {
                    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }

                // 客户端：更新cookie
                setCookie(ACCESS_TOKEN_KEY, accessToken, {
                    expires: (expiresIn || 1800) / 60 / 60 / 24, // 转换为天
                    path: '/',
                    sameSite: 'lax',
                    secure: process.env.NODE_ENV === 'production',
                });
                if (newRefreshToken) {
                    setCookie(REFRESH_TOKEN_KEY, newRefreshToken, {
                        expires: (refreshExpiresIn || 7 * 24 * 60 * 60) / 60 / 60 / 24, // 转换为天
                        path: '/',
                        sameSite: 'lax',
                        secure: process.env.NODE_ENV === 'production',
                    });
                }
            }

            return accessToken;
        }

        // 刷新失败，不更新 Cookie（Server Component 渲染期间不能修改）
        console.warn('[TokenUtils] Refresh response not success or no accessToken');

        return undefined;
    } catch (error) {
        console.error('[TokenUtils] Token refresh error:', error);
        return undefined;
    }
};