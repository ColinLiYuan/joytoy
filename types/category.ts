// types/category.ts

export interface CategoryResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    root?: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
    // ✅ 统一：可选数组
    categories?: CategoryResponse[];
}

export interface RootResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    root?: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
    // ✅ 统一：改为可选数组 (防止 TS 报错说 CategoryResponse 不兼容)
    categories?: CategoryResponse[];
}

// 保持不变
export interface CategoryItem {
    slug: string;
    name: string;
    title: string;
    description: string;
    priority: number;
    changefreq: string;
    root?: string;
    categories?: CategoryItem[];
}

export interface CategoriesData {
    category: {
        roots: CategoryItem[];
    };
}