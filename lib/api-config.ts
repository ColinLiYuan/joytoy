// lib/api-config.ts
export const BACKEND_CONFIG = {
    baseURL: process.env.BACKEND_BASE_URL,
    timeout: 30000,
    defaultHeaders: {
        'Content-Type': 'application/json',
        'Authorization': '', // 添加空字符串作为默认值
        'Cookie': '' // 添加空字符串作为默认值
    } as Record<string, string>, // 明确指定类型
};

export const SERVER_CONFIG = {
    baseURL: process.env.API_BASE_URL,

    // 前端 API 路由前缀
    apiRoutes: {
        product: '/api/site/product',
        review: '/api/site/review',
        category: '/api/site/category',
        filter: '/api/site/filter',
        order: '/api/site/order',
        auth: '/api/site/user',
        wishlist: '/api/site/wishlist',
        cart: '/api/site/cart',
        blog: '/api/site/blog',
    }
};

export const ADMIN_CONFIG = {
    apiRoutes: {
        order: '/api/admin/order',
        product: '/api/admin/product',
        category: '/api/admin/category',
        filter: '/api/admin/filter',
        blog: '/api/admin/blog',
    }
};