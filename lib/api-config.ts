// lib/api-config.ts

// 🔍 输出 API 配置（调试用）
console.log('\n📡 [API Config] Backend Configuration:');
console.log('  process.env.NEXT_PUBLIC_BACKEND_BASE_URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
console.log('  process.env.BACKEND_BASE_URL:', process.env.BACKEND_BASE_URL);
console.log('  Final baseURL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL || 'http://localhost:9356');
console.log('');

export const BACKEND_CONFIG = {
    // 客户端必须使用 NEXT_PUBLIC_ 前缀才能读取
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL || process.env.BACKEND_BASE_URL || 'http://localhost:9356',
    timeout: 30000,
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Authorization': '', // 添加空字符串作为默认值
        'Cookie': '' // 添加空字符串作为默认值
    } as Record<string, string>, // 明确指定类型
};

export const SERVER_CONFIG = {
    // 客户端必须使用 NEXT_PUBLIC_ 前缀，否则为空走相对路径
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || '',

    // 前端 API 路由前缀
    apiRoutes: {
        product: '/api/product',
        review: '/api/site/review',
        category: '/api/site/category',
        filter: '/api/site/filter',
        order: '/api/site/order',
        auth: '/api/site/auth',
        wishlist: '/api/site/wishlist',
        cart: '/api/site/cart',
        blog: '/api/site/blog',
        checkout: '/api/site/checkout',
        // affiliate 使用直连后端，不走前端 API Route
        affiliate: '/api/V1/affiliate',
    }
};

export const ADMIN_CONFIG = {
    baseURL: process.env.BACKEND_BASE_URL || 'http://localhost:9356',
    apiRoutes: {
        order: '/api/admin/order',
        product: '/api/admin/product',
        category: '/api/admin/category',
        filter: '/api/admin/filter',
        blog: '/api/admin/blog',
        review: '/api/admin/review',
        user: '/api/admin/user',
        cart: '/api/admin/V1/cart',
        // 后端真实路径
        V1_product: '/api/admin/V1/product',
        V1_order: '/api/admin/V1/order',
        V1_blog: '/api/admin/V1/blog',
        V1_review: '/api/admin/V1/review',
        V1_user: '/api/admin/V1/users',
        V1_cart: '/api/admin/V1/cart',
    }
};

// 后端通用 API 配置（非管理端）
export const BACKEND_API_ROUTES = {
    review: {
        list: '/api/V1/review/list',
        create: '/api/V1/review',
    },
    admin: {
        blog: {
            list: '/api/admin/V1/blog/list',
            detail: '/api/admin/V1/blog',
            release: '/api/admin/V1/blog/release',
            upload: '/api/admin/V1/upload/myth/blog/image',
        },
        user: {
            list: '/api/admin/V1/users/list',
        },
    }
};