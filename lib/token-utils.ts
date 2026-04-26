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
 * 策略：Server端优先使用缓存，然后读Cookie；Client端优先Cookie，没有则读LocalStorage
 */
export const getToken = async (): Promise<string | undefined> => {
    // 服务端：优先使用缓存的token
    if (!isBrowser && serverTokenCache && serverTokenExpiry) {
        const now = Math.floor(Date.now() / 1000);
        if (now < serverTokenExpiry) {
            console.log('[TokenUtils] getToken - using server cached token');
            return serverTokenCache;
        } else {
            // 缓存过期，清除
            serverTokenCache = undefined;
            serverTokenExpiry = undefined;
            console.log('[TokenUtils] Server token cache expired, clearing');
        }
    }
    
    // 1. 尝试从 Cookie 获取 (支持 Server & Client)
    const cookieToken = await getCookie(ACCESS_TOKEN_KEY);
    console.log('[TokenUtils] getToken - cookieToken exists:', !!cookieToken);
    console.log('[TokenUtils] getToken - cookieToken length:', cookieToken?.length || 0);
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
    console.log('[TokenUtils] getRefreshToken - cookieToken exists:', !!cookieToken);
    console.log('[TokenUtils] getRefreshToken - cookieToken length:', cookieToken?.length || 0);
    console.log('[TokenUtils] getRefreshToken - cookieToken preview:', cookieToken ? cookieToken.substring(0, 40) + '...' : 'none');
    
    if (cookieToken) return cookieToken;

    if (isBrowser) {
        const storageToken = localStorage.getItem(REFRESH_TOKEN_KEY) || undefined;
        console.log('[TokenUtils] getRefreshToken - fallback to localStorage, exists:', !!storageToken);
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

    // 🔍 打印后端返回的过期时间
    console.log('[TokenUtils] setTokens - Backend response:', {
        expiresIn,
        refreshExpiresIn,
        expiresInDays: expiresIn ? expiresIn / 60 / 60 / 24 : 'default',
        refreshExpiresInDays: refreshExpiresIn ? refreshExpiresIn / 60 / 60 / 24 : 'default',
        currentTime: new Date().toISOString(),
        accessTokenLength: accessToken.length,
        refreshTokenLength: refreshToken.length
    });

    // 1. 写入 Cookie（使用后端返回的过期时间）
    // ✅ 修复：使用 Date 对象精确设置过期时间，避免 js-cookie 小数天数问题
    const accessExpiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : new Date(Date.now() + 30 * 60 * 1000); // 默认 30 分钟
    const refreshExpiresAt = refreshExpiresIn ? new Date(Date.now() + refreshExpiresIn * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 默认 7 天
    
    console.log('[TokenUtils] setTokens - Cookie expires calculated:', {
        accessExpiresAt: accessExpiresAt.toISOString(),
        refreshExpiresAt: refreshExpiresAt.toISOString(),
        expiresInSeconds: expiresIn,
        refreshExpiresInSeconds: refreshExpiresIn
    });
    
    // 1. 写入 Cookie (原生 document.cookie，确保兼容性)
    // ✅ 修复：绕过 js-cookie，直接设置 expires 属性，解决 Date 对象处理异常导致过期时间变 30 分钟的问题
    
    const accessExpiresUTC = accessExpiresAt.toUTCString();
    const refreshExpiresUTC = refreshExpiresAt.toUTCString();
    
    // 构建 Cookie 字符串
    const accessCookie = `${ACCESS_TOKEN_KEY}=${accessToken}; expires=${accessExpiresUTC}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    const refreshCookie = `${REFRESH_TOKEN_KEY}=${refreshToken}; expires=${refreshExpiresUTC}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
    
    document.cookie = accessCookie;
    document.cookie = refreshCookie;
    
    console.log('[TokenUtils] setTokens - Native cookies set:', {
        accessExpires: accessExpiresUTC,
        refreshExpires: refreshExpiresUTC
    });

    // 2. 写入 LocalStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    
    console.log('[TokenUtils] setTokens - Tokens saved successfully');
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

export const updateAccessToken = (newToken: string, expiresIn?: number): void => {
    if (!isBrowser) return;

    // 更新 localStorage
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken);

    // 更新 cookie（带过期时间，优先使用传入的 expiresIn，否则默认 30 分钟）
    const expiresAt = expiresIn ? new Date(Date.now() + expiresIn * 1000) : new Date(Date.now() + 30 * 60 * 1000);
    document.cookie = `${ACCESS_TOKEN_KEY}=${newToken}; expires=${expiresAt.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
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

    console.log('[TokenUtils] Token expired, attempting refresh...');

    // Token 已过期，尝试刷新
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.warn('[TokenUtils] No refresh token available');
        return undefined;
    }

    console.log('[TokenUtils] Refresh token exists, length:', refreshToken.length);
    console.log('[TokenUtils] Refresh token preview:', refreshToken.substring(0, 30) + '...');
    console.log('[TokenUtils] Calling backend refresh API...');

    try {
        const { BACKEND_CONFIG } = await import('@/lib/api-config');
        const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`;
        console.log('[TokenUtils] Refresh URL:', refreshUrl);
        
        const response = await fetch(refreshUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
        });

        console.log('[TokenUtils] Refresh response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.warn('[TokenUtils] Token refresh failed:', response.status, errorText);
            
            // 注意：在 Server Component 渲染期间不能修改 Cookie
            // 只记录日志，不删除 Cookie
            console.log('[TokenUtils] Will not clear cookies during Server Component render');
            
            return undefined;
        }

        const result = await response.json();
        console.log('[TokenUtils] Refresh response:', JSON.stringify(result, null, 2));
        
        if (result?.success && result?.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = result.data;

            // 服务端：缓存token到内存并更新cookie
            if (!isBrowser) {
                console.log('[TokenUtils] Caching token in server memory');
                serverTokenCache = accessToken;
                if (expiresIn) {
                    serverTokenExpiry = Math.floor(Date.now() / 1000) + (expiresIn - 300); // 提前5分钟过期
                }
                
                // 服务端：更新cookie
                try {
                    const { cookies } = await import('next/headers');
                    const cookieStore = await cookies();
                    console.log('[TokenUtils] Updating accessToken in server cookie');
                    cookieStore.set(ACCESS_TOKEN_KEY, accessToken, {
                        path: '/',
                        maxAge: expiresIn || 1800, // 30分钟
                    });
                    
                    if (newRefreshToken) {
                        console.log('[TokenUtils] Updating refreshToken in server cookie');
                        cookieStore.set(REFRESH_TOKEN_KEY, newRefreshToken, {
                            path: '/',
                            maxAge: refreshExpiresIn || 7 * 24 * 60 * 60, // 7天
                        });
                    }
                } catch (error) {
                    console.error('[TokenUtils] Failed to update server cookie:', error);
                }
            }

            // 客户端：更新localStorage和cookie
            if (isBrowser) {
                console.log('[TokenUtils] Updating tokens in localStorage');
                localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
                if (newRefreshToken) {
                    localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
                }
                
                // 客户端：更新cookie
                console.log('[TokenUtils] Updating tokens in client cookie');
                const clientAccessExpiresAt = new Date(Date.now() + (expiresIn || 1800) * 1000);
                const clientRefreshExpiresAt = new Date(Date.now() + (refreshExpiresIn || 7 * 24 * 60 * 60) * 1000);
                
                document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; expires=${clientAccessExpiresAt.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
                if (newRefreshToken) {
                    document.cookie = `${REFRESH_TOKEN_KEY}=${newRefreshToken}; expires=${clientRefreshExpiresAt.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
                }
            }

            console.log('[TokenUtils] Token refreshed successfully');
            return accessToken;
        }

        // 刷新失败，不更新 Cookie（Server Component 渲染期间不能修改）
        console.warn('[TokenUtils] Refresh response not success or no accessToken');
        console.log('[TokenUtils] Will not clear cookies during Server Component render');
        
        return undefined;
    } catch (error) {
        console.error('[TokenUtils] Token refresh error:', error);
        return undefined;
    }
};

/**
 * 客户端专用：检查 Token 是否快过期，如果是则主动刷新
 * 在调用需要登录的接口前调用此函数
 * @param advanceSeconds 提前多少秒刷新（默认 5 分钟 = 300 秒）
 * @returns 刷新后的 Token 或原 Token，如果未登录则返回 undefined
 */
export const ensureFreshToken = async (advanceSeconds: number = 300): Promise<string | undefined> => {
    // 只在客户端执行
    if (!isBrowser) return undefined;

    const token = await getToken();
    if (!token) return undefined;

    // 检查是否快过期（提前 5 分钟）
    if (!isTokenExpired(token, advanceSeconds)) {
        return token; // 还没快过期，直接返回
    }

    console.log('[TokenUtils] Token expiring soon, proactively refreshing...');

    // Token 快过期，主动刷新
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
            console.warn('[TokenUtils] Proactive refresh failed:', response.status);
            return undefined;
        }

        const result = await response.json();
        
        if (result?.success && result?.data?.accessToken) {
            const { accessToken, refreshToken: newRefreshToken, expiresIn, refreshExpiresIn } = result.data;

            // 更新 localStorage
            localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
            if (newRefreshToken) {
                localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
            }
            
            // 更新 Cookie (原生写入，确保兼容)
            const accessExpiresAt = new Date(Date.now() + (expiresIn || 1800) * 1000);
            const refreshExpiresAt = new Date(Date.now() + (refreshExpiresIn || 7 * 24 * 60 * 60) * 1000);
            
            document.cookie = `${ACCESS_TOKEN_KEY}=${accessToken}; expires=${accessExpiresAt.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
            if (newRefreshToken) {
                document.cookie = `${REFRESH_TOKEN_KEY}=${newRefreshToken}; expires=${refreshExpiresAt.toUTCString()}; path=/; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
            }

            console.log('[TokenUtils] Token proactively refreshed successfully');
            return accessToken;
        }

        return undefined;
    } catch (error) {
        console.error('[TokenUtils] Proactive refresh error:', error);
        return undefined;
    }
};