// lib/cookie-utils.ts
import Cookies from 'js-cookie';

const isBrowser = typeof window !== 'undefined';

// 统一的 Cookie 配置
const DEFAULT_OPTIONS = {
    expires: 7, // 7天
    path: '/',
    sameSite: 'lax' as const,
    // 只有在 https 协议下才开启 secure
    secure: isBrowser && window.location.protocol === 'https:'
};

/**
 * 获取 Cookie (自动识别服务端/客户端)
 */
export async function getCookie(name: string): Promise<string | undefined> {
    if (isBrowser) {
        // 🌐 客户端：使用 js-cookie
        return Cookies.get(name);
    } else {
        // 🖥️ 服务端：动态导入 next/headers
        try {
            const { cookies } = await import('next/headers');
            const cookieStore = await cookies();
            return cookieStore.get(name)?.value;
        } catch (error) {
            console.error(`Failed to get cookie ${name} on server:`, error);
            return undefined;
        }
    }
}

/**
 * 设置 Cookie (仅客户端有效)
 * 服务端组件无法直接 Set-Cookie，通常在 Route Handler 中处理
 */
export function setCookie(name: string, value: string, options = {}) {
    if (!isBrowser) return;
    Cookies.set(name, value, { ...DEFAULT_OPTIONS, ...options });
}

/**
 * 删除 Cookie (仅客户端有效)
 */
export function removeCookie(name: string) {
    if (!isBrowser) return;
    Cookies.remove(name, { path: '/' });
}