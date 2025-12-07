// services/authService.ts
import {
    RegisterRequest,
    LoginRequest,
    LoginResponse,
    RegisterResponse } from '@/types/auth';
import { SERVER_CONFIG } from '@/lib/api-config';

class AuthService {

    async login(request: LoginRequest): Promise<LoginResponse> {
        // console.log('AuthService login start');
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        // console.log('AuthService login route response ');
        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Login failed. Please check your credentials.');
        }

        return result.data!;
    }

    async register(request: RegisterRequest): Promise<RegisterResponse> {
        const response = await fetch(`${SERVER_CONFIG.apiRoutes.auth}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(request),
        });

        const result = await response.json();

        if (!result.success) {
            throw new Error(result.message || 'Registration failed.');
        }

        return result.data!;
    }
}

export default new AuthService();