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

/**
 * 服务端专用：获取当前用户ID
 */
export const getServerUserId = async (): Promise<number | null> => {
    const userInfo = await getUserInfo();
    return userInfo?.id || null;
};