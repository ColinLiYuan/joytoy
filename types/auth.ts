// types/auth.ts

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    displayName?: string;
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    refreshExpiresIn: number;
    status: string;
    emailVerified: boolean;
    cartId: number;
    lastLoginAt?: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    newsletterSubscribed?: boolean;
    marketingEmails?: boolean;
}

export interface RegisterResponse {
    id: number;
    uuid: string;
    email: string;
    firstName: string;
    lastName: string;
    status: string;
    emailVerified: boolean;
}