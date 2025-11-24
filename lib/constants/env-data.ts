// lib/constants/env-data.ts
export const envData = {
    imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://mythtoy.com',
    imageUploadPath: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH || 'https://pub-c128c2f5caa744afbeb49b9904451478.r2.dev',
    isProduction: process.env.NODE_ENV === 'production',
} as const;