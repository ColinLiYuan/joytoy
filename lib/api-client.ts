// lib/api-client.ts
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getToken, getRefreshToken, setTokens, clearTokens } from '@/lib/token-utils';
import { SERVER_CONFIG } from '@/lib/api-config'; // 假设你有这个配置

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

// 是否正在刷新 Token 的标记
let isRefreshing = false;
// 重试队列 (当正在刷新时，后续进来的请求先暂存到这里)
let failedQueue: any[] = [];

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

// 1. 请求拦截器：自动带上 Access Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 2. 响应拦截器：处理 401 并自动刷新
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // 如果没有 response (网络错误) 或不是 401，直接抛出
        if (!error.response || error.response.status !== 401) {
            return Promise.reject(error);
        }

        // 如果这个请求已经重试过了，说明刷新也没用，直接抛出（防止死循环）
        if (originalRequest._retry) {
            return Promise.reject(error);
        }

        // --- 进入刷新逻辑 ---

        // 情况 A: 已经有其他请求在刷新了，将当前请求加入队列等待
        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                    }
                    return apiClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        // 情况 B: 我是第一个 401，开始刷新
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = getRefreshToken();

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }

            // 调用后端刷新接口 (注意：这里不要用 apiClient，防止死循环，用原生 axios 或 fetch)
            const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/site/auth/refresh`, {
                refreshToken: refreshToken
            });

            // 假设后端返回结构: { success: true, data: { accessToken: "...", refreshToken: "..." } }
            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // 1. 保存新 Token
            setTokens(accessToken, newRefreshToken);

            // 2. 更新 Axios 默认头 (可选)
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

            // 3. 处理队列中的请求
            processQueue(null, accessToken);

            // 4. 重发当前请求
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return apiClient(originalRequest);

        } catch (refreshError) {
            // 刷新失败 (Refresh Token 也过期了，或者被篡改)
            processQueue(refreshError, null);
            clearTokens();
            // 强制跳转登录页 (使用 window.location 确保彻底重置)
            window.location.href = '/?login=expired';
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;