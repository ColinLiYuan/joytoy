// services/authService.ts
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse } from '@/types/auth';
import { SERVER_CONFIG } from '@/lib/api-config';
import apiClient from '@/lib/api-client';

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        // console.log('AuthService login start');
        const response = await apiClient.post('${SERVER_CONFIG.apiRoutes.auth}/login', request);

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
}

export default new AuthService();