// lib/axios-client.ts
import axios from 'axios';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { setCookie, removeCookie } from '@/lib/cookie-utils';

// 🔧 客户端必须使用相对路径，让请求通过 Next.js 代理（解决 Mixed Content 问题）
// 服务端可以使用环境变量直连后端
const axiosBaseURL = typeof window === 'undefined' 
    ? (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || 'http://localhost:9356')
    : ''; // 客户端使用空字符串，走相对路径 /api/V1/...

// 创建 Axios 实例
const axiosClient = axios.create({
    baseURL: axiosBaseURL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosClient.interceptors.request.use(
    (config) => {
        // 显式声明站点（后端按 X-Site-Id 隔离多站数据；不传时后端才按默认站点兜底）
        const siteId = process.env.NEXT_PUBLIC_SITE_ID;
        if (siteId) {
            config.headers['X-Site-Id'] = siteId;
        }

        // 从 Cookie 读取 Token 并添加到请求头
        if (typeof window !== 'undefined') {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理 Token 刷新
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 获取 Token（从 Cookie 或 LocalStorage）
const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // 1. 先尝试从 Cookie 读取
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
            return decodeURIComponent(value);
        }
    }

    // 2. 如果 Cookie 没有，尝试从 localStorage 读取
    try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            return token;
        }
    } catch (e) {
        // ignore
    }

    return null;
};

const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // 1. 先尝试从 Cookie 读取
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'refreshToken') {
            return decodeURIComponent(value);
        }
    }

    // 2. 如果 Cookie 没有，尝试从 localStorage 读取
    try {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            return token;
        }
    } catch (e) {
        // ignore
    }

    return null;
};

axiosClient.interceptors.response.use(
    (response) => {
        // 检查业务逻辑错误（HTTP 200 但 success: false）
        if (response.data?.success === false) {
            const errorMsg = response.data.message?.toLowerCase() || '';
            const isAuthError = errorMsg.includes('session') || 
                               errorMsg.includes('login') || 
                               errorMsg.includes('auth') || 
                               errorMsg.includes('unauthorized') ||
                               errorMsg.includes('登录') ||
                               errorMsg.includes('expired');
            
            if (isAuthError) {
                // 抛出特殊错误，让业务层处理
                const error: any = new Error(response.data.message);
                error.isAuthError = true;
                error.response = { status: 401 };
                return Promise.reject(error);
            }
        }
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // 401 且未重试过
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // 正在刷新，将请求加入队列
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        // 刷新成功后，标记为已重试，避免再次触发 401 流程
                        originalRequest._retry = true;
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 尝试刷新 Token
                const refreshToken = getRefreshToken();
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                // ✅ 创建一个新的 axios 实例，避免触发拦截器造成死循环
                const refreshAxios = axios.create({
                    baseURL: axiosBaseURL,
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const refreshResponse = await refreshAxios.post('/api/V1/users/refresh', {
                    refreshToken,
                });

                if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
                    const newAccessToken = refreshResponse.data.data.accessToken;
                    const newRefreshToken = refreshResponse.data.data.refreshToken;
                    const expiresIn = refreshResponse.data.data.expiresIn;
                    const refreshExpiresIn = refreshResponse.data.data.refreshExpiresIn;

                    // ✅ 同时更新 localStorage 和 Cookie，确保 getAccessToken 能读取到新 Token
                    if (typeof window !== 'undefined') {
                        try {
                            localStorage.setItem('accessToken', newAccessToken);
                            if (newRefreshToken) {
                                localStorage.setItem('refreshToken', newRefreshToken);
                            }
                        } catch (e) {
                            console.error('[AxiosClient] Failed to update localStorage:', e);
                        }
                        
                        // 同时写入 Cookie（使用后端返回的过期时间）
                        const accessExpires = expiresIn ? expiresIn / 60 / 60 / 24 : 1 / 60 / 24;
                        const refreshExpires = refreshExpiresIn ? refreshExpiresIn / 60 / 60 / 24 : 7;
                        
                        setCookie('accessToken', newAccessToken, {
                            expires: accessExpires,
                            path: '/',
                            sameSite: 'lax',
                            secure: window.location.protocol === 'https:',
                        });
                        
                        if (newRefreshToken) {
                            setCookie('refreshToken', newRefreshToken, {
                                expires: refreshExpires,
                                path: '/',
                                sameSite: 'lax',
                                secure: window.location.protocol === 'https:',
                            });
                        }
                        
                    }

                    // ✅ 强制更新 originalRequest 的 Authorization header
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    processQueue(null);
                    return axiosClient(originalRequest);
                } else {
                    throw new Error('Invalid refresh response');
                }
            } catch (refreshError: any) {
                // 区分“没有 Refresh Token”和“刷新失败”两种情况
                // ✅ 静默处理，不打印日志（这是正常的用户未登录状态）

                processQueue(refreshError, null);

                // 清除本地 Token（不触发登录框，让 AuthGuard 统一处理）
                if (typeof window !== 'undefined') {
                    removeCookie('accessToken');
                    removeCookie('refreshToken');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');

                    // ✅ 通知 AuthContext 弹出“会话已过期，请重新登录”（与 api-utils 旧链路行为一致）
                    window.dispatchEvent(new CustomEvent('auth:tokenExpired', {
                        detail: { message: 'Your session has expired. Please login again.' }
                    }));
                }
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
