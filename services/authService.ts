// services/authService.ts
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse,
    UserListResponse} from '@/types/auth';
import { SERVER_CONFIG, ADMIN_CONFIG } from '@/lib/api-config';
import { getToken } from '@/lib/token-utils';

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        // console.log('AuthService login start');
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        // console.log('AuthService login route response ');
        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Login failed. Please check your credentials.');
        }

        return apiResponse.data!;
    }

    async register(request: RegisterRequest): Promise<RegisterResponse> {
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        const apiResponse = await response.json();

        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Registration failed.');
        }

        return apiResponse.data!;
    }

    async forgotPassword(email: string): Promise<void> {
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const apiResponse = await response.json();
        if (!apiResponse.success) {
            throw new Error(apiResponse.message || 'Failed to send reset email');
        }
    }

    async resetPassword(token: string, password: string): Promise<void> {
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ token, password }),
        });

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
            const url = `${ADMIN_CONFIG.apiRoutes.user}/list?${queryParams.toString()}`;
            
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