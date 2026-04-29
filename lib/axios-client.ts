// lib/axios-client.ts
import axios from 'axios';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { setCookie, removeCookie } from '@/lib/cookie-utils';

// 🔧 Axios 客户端配置
// 浏览器环境：使用当前域名作为 baseURL，让相对路径能正确解析
// 服务端环境：使用空字符串走 Next.js rewrites
const getAxiosBaseURL = () => {
    if (typeof window !== 'undefined') {
        return window.location.origin;
    }
    return '';
};

// 创建 Axios 实例（不设置 baseURL，在拦截器中动态添加）
const axiosClient = axios.create({
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosClient.interceptors.request.use(
    (config) => {
        // 动态设置 baseURL
        if (!config.baseURL) {
            config.baseURL = getAxiosBaseURL();
        }
        
        console.log('[AxiosClient] Request:', {
            url: config.url,
            baseURL: config.baseURL,
        });
        
        // 从 Cookie 读取 Token 并添加到请求头
        if (typeof window !== 'undefined') {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('[AxiosClient] Token added to request');
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
            console.log('[AxiosClient] Found accessToken in cookie');
            return decodeURIComponent(value);
        }
    }
    
    // 2. 如果 Cookie 没有，尝试从 localStorage 读取
    try {
        const token = localStorage.getItem('accessToken');
        if (token) {
            console.log('[AxiosClient] Found accessToken in localStorage');
            return token;
        }
    } catch (e) {
        console.log('[AxiosClient] Failed to read localStorage:', e);
    }
    
    console.log('[AxiosClient] accessToken not found');
    return null;
};

const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    // 1. 先尝试从 Cookie 读取
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'refreshToken') {
            console.log('[AxiosClient] Found refreshToken in cookie');
            return decodeURIComponent(value);
        }
    }
    
    // 2. 如果 Cookie 没有，尝试从 localStorage 读取
    try {
        const token = localStorage.getItem('refreshToken');
        if (token) {
            console.log('[AxiosClient] Found refreshToken in localStorage');
            return token;
        }
    } catch (e) {
        console.log('[AxiosClient] Failed to read localStorage:', e);
    }
    
    console.log('[AxiosClient] refreshToken not found');
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
                    .then(() => {
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
                    console.log('[AxiosClient] No refresh token found, skipping refresh');
                    throw new Error('No refresh token');
                }

                console.log('[AxiosClient] Attempting to refresh token...');
                
                // ✅ 创建一个新的 axios 实例，避免触发拦截器造成死循环
                const refreshAxios = axios.create({
                    baseURL: getAxiosBaseURL(), // 使用相同的 baseURL
                    timeout: 30000,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                const refreshResponse = await refreshAxios.post('/api/V1/users/refresh', {
                    refreshToken,
                });

                console.log('[AxiosClient] Refresh response:', refreshResponse.data);

                if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
                    console.log('[AxiosClient] Token refreshed successfully');
                    
                    const newAccessToken = refreshResponse.data.data.accessToken;
                    const newRefreshToken = refreshResponse.data.data.refreshToken;
                    const expiresIn = refreshResponse.data.data.expiresIn;
                    const refreshExpiresIn = refreshResponse.data.data.refreshExpiresIn;
                    
                    console.log('[AxiosClient] Backend returned expiresIn:', expiresIn);
                    console.log('[AxiosClient] Backend returned refreshExpiresIn:', refreshExpiresIn);
                    
                    // ✅ 同时更新 localStorage 和 Cookie，确保 getAccessToken 能读取到新 Token
                    if (typeof window !== 'undefined') {
                        try {
                            localStorage.setItem('accessToken', newAccessToken);
                            if (newRefreshToken) {
                                localStorage.setItem('refreshToken', newRefreshToken);
                            }
                            console.log('[AxiosClient] Tokens updated in localStorage');
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
                        
                        console.log('[AxiosClient] Tokens updated in cookie');
                    }
                    
                    // ✅ 强制更新 originalRequest 的 Authorization header
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    
                    processQueue(null);
                    return axiosClient(originalRequest);
                } else {
                    console.log('[AxiosClient] Refresh response invalid:', refreshResponse.data);
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
                                
                    console.log('[AxiosClient] Tokens cleared, AuthGuard will handle login modal');
                }
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
