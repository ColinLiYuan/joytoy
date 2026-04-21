// lib/axios-client.ts
import axios from 'axios';
import { BACKEND_CONFIG } from '@/lib/api-config';

// 创建 Axios 实例 - 直接调用后端 API
const axiosClient = axios.create({
    baseURL: BACKEND_CONFIG.baseURL, // 直接指向后端
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
axiosClient.interceptors.request.use(
    (config) => {
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

// 获取 Token（从 Cookie）
const getAccessToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'accessToken') {
            console.log('[AxiosClient] Found accessToken in cookie');
            return decodeURIComponent(value);
        }
    }
    
    console.log('[AxiosClient] accessToken not found in cookie');
    return null;
};

const getRefreshToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
        const [name, value] = cookie.trim().split('=');
        if (name === 'refreshToken') {
            console.log('[AxiosClient] Found refreshToken in cookie');
            return decodeURIComponent(value);
        }
    }
    
    console.log('[AxiosClient] refreshToken not found in cookie');
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
                    throw new Error('No refresh token');
                }

                const refreshResponse = await axios.post(`${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`, {
                    refreshToken,
                });

                if (refreshResponse.data?.success && refreshResponse.data?.data?.accessToken) {
                    console.log('[AxiosClient] Token refreshed successfully');
                    
                    // 更新 Cookie 中的 accessToken
                    if (typeof window !== 'undefined') {
                        const newAccessToken = refreshResponse.data.data.accessToken;
                        document.cookie = `accessToken=${encodeURIComponent(newAccessToken)}; path=/; max-age=1800`;
                    }
                    
                    processQueue(null);
                    return axiosClient(originalRequest);
                }
            } catch (refreshError) {
                console.log('[AxiosClient] Token refresh failed');
                processQueue(refreshError, null);
                
                // 清除本地 Token
                if (typeof window !== 'undefined') {
                    document.cookie = 'accessToken=; path=/; max-age=0';
                    document.cookie = 'refreshToken=; path=/; max-age=0';
                }
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;
