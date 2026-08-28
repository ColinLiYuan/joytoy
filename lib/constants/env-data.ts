// lib/constants/env-data.ts

// 🔍 运行时输出环境变量（调试用）
console.log('\n🌐 [Runtime] Environment Variables:');
console.log('  NEXT_PUBLIC_BACKEND_BASE_URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
console.log('  NEXT_PUBLIC_IMAGE_BASE_URL:', process.env.NEXT_PUBLIC_IMAGE_BASE_URL);
console.log('  NEXT_PUBLIC_IMAGE_UPLOAD_PATH:', process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH);
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('');

export const envData = {
    imageBaseUrl: process.env.NEXT_PUBLIC_IMAGE_BASE_URL || 'https://www.mythtoy.com',
    imageUploadPath: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH || 'https://pub-e5d14c6d386c4d90979458082617517a.r2.dev',
    isProduction: process.env.NODE_ENV === 'production',
} as const;