// services/authService.ts
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse,
    UserListResponse} from '@/types/auth';
import { SERVER_CONFIG, ADMIN_CONFIG, BACKEND_CONFIG } from '@/lib/api-config';
import { getToken } from '@/lib/token-utils';

// 辅助函数：检查响应是否为 JSON
function validateJsonResponse(response: Response, serviceName: string, url: string) {
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
        console.error(`[${serviceName}] Non-JSON response received:`, {
            url: url,
            status: response.status,
            statusText: response.statusText,
            contentType: contentType || 'null',
            ok: response.ok
        });
        throw new Error(`Invalid server response: Expected JSON but got ${contentType || 'no content-type'} (Status: ${response.status})`);
    }
}

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        // console.log('AuthService login start');
        const url = `${SERVER_CONFIG.apiRoutes.auth}/login`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        validateJsonResponse(response, 'AuthService', url);

        // console.log('AuthService login route response ');
        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Login failed. Please check your credentials.');
        }

        return apiResponse.data!;
    }

    async register(request: RegisterRequest): Promise<RegisterResponse> {
        const url = `${SERVER_CONFIG.apiRoutes.auth}/register`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        validateJsonResponse(response, 'AuthService', url);

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Registration failed.');
        }

        return apiResponse.data!;
    }

    async forgotPassword(email: string): Promise<void> {
        const url = `${SERVER_CONFIG.apiRoutes.auth}/forgot-password`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        validateJsonResponse(response, 'AuthService', url);

        const apiResponse = await response.json();
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to send reset email');
        }
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const url = `${SERVER_CONFIG.apiRoutes.auth}/reset-password`;
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });

        validateJsonResponse(response, 'AuthService', url);

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to update password.');
        }
    }

    async adminList(params: {
        page?: number;
        size?: number;
        keyword?: string;
        status?: string;
        sortBy?: string;
    } = {}): Promise<UserListResponse> {
        try {
            const {
                page = 0,
                size = 12,
                keyword = '',
                status = '',
                sortBy = 'createdAt'
            } = params;

            const queryParams = new URLSearchParams();
            queryParams.append('page', page.toString());
            queryParams.append('size', size.toString());
            queryParams.append('sortBy', sortBy);

            if (keyword) queryParams.append('keyword', keyword);
            if (status) queryParams.append('status', status);

            // 使用后端 AdminUserInterface 定义的路径
            const url = `${BACKEND_CONFIG.baseURL}${ADMIN_CONFIG.apiRoutes.user}/list?${queryParams.toString()}`;
            
            const token = await getToken();
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(url, {
                cache: 'no-store',
                headers,
            });

            if (!response.ok) throw new Error('Failed to fetch user list');

            validateJsonResponse(response, 'AuthService', url);

            const apiResponse = await response.json();

            if (!apiResponse.success) {
                throw new Error(apiResponse.message || 'Failed to fetch users');
            }

            return apiResponse.data; // 返回 PageResponse 结构
        } catch (error) {
            console.error('Error in Admin User List Service:', error);
            throw error;
        }
    }
}

export default new AuthService();