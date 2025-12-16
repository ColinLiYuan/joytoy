// types/category.ts

export interface CategoryResponse {
    slug: string;
    name: string;
    title: string;
    image?: string;
    description: string;
    root?: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
    categories?: CategoryResponse[];
}

export interface RootResponse {
    slug: string;
    name: string;
    title: string;
    image?: string;
    description: string;
    root?: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
    categories?: CategoryResponse[];
}

// 保持不变
export interface CategoryItem {
    slug: string;
    name: string;
    title: string;
    image?: string;
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