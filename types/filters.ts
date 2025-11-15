// /types/filters.ts

export interface FilterResponse {
    keyWord: string;
    marketingWords?: string[];
}

export interface FilterState {
    priceRange: [number, number];
    priceRanges: string[];
    colors: string[];
    features: string[];
    materials: string[];
}