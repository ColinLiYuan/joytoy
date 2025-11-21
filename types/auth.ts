// types/auth.ts

export interface RegisterRequest {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    newsletterSubscribed?: boolean;
    marketingEmails?: boolean;
}

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
    token: string;
    status: string;
    emailVerified: boolean;
    cartId: number,
    lastLoginAt?: string;
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