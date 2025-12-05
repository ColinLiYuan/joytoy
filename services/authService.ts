// services/authService.ts
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse } from '@/types/auth';
import { SERVER_CONFIG } from '@/lib/api-config';

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        try {
            // console.log('AuthService login start');
            const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            // console.log('AuthService login route response ');

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Login failed');
            }

            const apiResponse = await response.json();

            const loginResponse: LoginResponse = apiResponse.data;
            // console.log('get loginResponse')

            // 5. 返回业务数据
            return loginResponse;
        } catch (error) {
            console.error('Login service error:', error);
            throw error;
        }
    }

    async register(request: RegisterRequest): Promise<RegisterResponse> {
        try {
            const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(request),
            });

            if (!response.ok) {
                // 错误时提取错误信息
                const errorData = await response.json();
                throw new Error(errorData.error || 'Registration failed');
            }

            const apiResponse = await response.json();
            const registerData: RegisterResponse = apiResponse.data;

            return registerData;
        } catch (error) {
            console.error('Register service error:', error);
            throw error;
        }
    }
}

export default new AuthService();