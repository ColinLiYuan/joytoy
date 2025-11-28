// category.ts

export interface RootResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
    categories: CategoryResponse[];
}


export interface CategoryResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    root?: string;
    priority?: number;
    changefreq?: string;
    lastModified?: string;
}

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