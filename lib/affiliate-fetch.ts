// lib/affiliate-fetch.ts
import { NextRequest, NextResponse } from 'next/server';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { cookies } from 'next/headers';

/**
 * 通用的 Affiliate API 请求函数（带自动 Token 刷新）
 * 所有联盟客接口统一使用此函数，避免重复代码
 * 
 * @param request - Next.js Request 对象
 * @param backendEndpoint - 后端接口路径（如 /api/V1/affiliate/dashboard）
 * @param options - 请求选项
 * @returns NextResponse
 */
export async function affiliateFetch(
    request: NextRequest,
    backendEndpoint: string,
    options: {
        method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
        body?: any;
    } = {}
) {
    try {
        const { method = 'GET', body } = options;
        const cookieStore = await cookies();
        const token = cookieStore.get('accessToken')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: '未登录，请先登录'
            }, { status: 401 });
        }

        const backendUrl = `${BACKEND_CONFIG.baseURL}${backendEndpoint}`;
        
        const fetchOptions: RequestInit = {
            method,
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        };

        if (body) {
            fetchOptions.body = JSON.stringify(body);
        }
        
        const backendResponse = await fetch(backendUrl, fetchOptions);

        // 如果是 401，尝试刷新 Token
        if (backendResponse.status === 401) {
            const refreshToken = cookieStore.get('refreshToken')?.value;
            
            if (refreshToken) {
                const refreshUrl = `${BACKEND_CONFIG.baseURL}/api/V1/users/refresh`;
                const refreshResponse = await fetch(refreshUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ refreshToken })
                });
                
                if (refreshResponse.ok) {
                    const refreshData = await refreshResponse.json();
                    if (refreshData.success && refreshData.data?.accessToken) {
                        const newToken = refreshData.data.accessToken;
                        
                        // 更新 Cookie（Server 端使用 cookieStore.set）
                        cookieStore.set('accessToken', newToken, {
                            httpOnly: true,
                            secure: process.env.NODE_ENV === 'production',
                            sameSite: 'lax',
                            path: '/',
                            maxAge: 30 * 60
                        });
                        
                        // 用新 token 重试
                        const retryOptions: RequestInit = {
                            ...fetchOptions,
                            headers: {
                                ...fetchOptions.headers,
                                'Authorization': `Bearer ${newToken}`,
                            },
                        };
                        
                        const retryResponse = await fetch(backendUrl, retryOptions);
                        
                        if (retryResponse.ok) {
                            const result = await retryResponse.json();
                            return NextResponse.json(result);
                        }
                    }
                }
            }
            
            return NextResponse.json({
                success: false,
                message: '登录已过期，请重新登录'
            }, { status: 401 });
        }

        const result = await backendResponse.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error(`🔴 Affiliate API Error [${backendEndpoint}]:`, error);
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
