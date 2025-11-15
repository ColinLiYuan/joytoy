// category.ts

export interface RootResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    priority?: number;
    changeFreq?: string;
    lastModified?: string;
    categories: CategoryResponse[];
}


export interface CategoryResponse {
    slug: string;
    name: string;
    title: string;
    description: string;
    root: string;
    priority?: number;
    changeFreq?: string;
    lastModified?: string;
}

