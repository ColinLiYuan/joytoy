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
}

export default new AuthService();