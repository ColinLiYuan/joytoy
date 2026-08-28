// types/collection.ts
// 商品集合（后端 /api/V1/collections，营销聚合层，docs/design.md §14.4.3）
// 与分类分工：分类 = 树形站点结构；集合 = 跨分类人工排序的营销聚合，落地页 /collections/{slug}

import { PageResponse } from '@/types/api';
import { ProductResponse } from '@/types/product';

/** 集合元数据（CollectionResponse） */
export interface CollectionResponse {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    image?: string | null;
    isActive: boolean;
    showOnHome: boolean;
    sortOrder: number;
    metaTitle?: string | null;
    metaDescription?: string | null;
    productCount: number;
    createdAt?: string;
    updatedAt?: string;
}

/** 集合落地页详情（CollectionDetailResponse）：元数据 + 商品分页（按 product_ids 顺序） */
export interface CollectionDetailResponse extends CollectionResponse {
    products: PageResponse<ProductResponse>;
}

/** 首页集合卡片（CollectionCardResponse）：元数据 + 商品预览数组（≤8） */
export interface CollectionCardResponse extends CollectionResponse {
    products: ProductResponse[];
}

/** 首页聚合（GET /api/V1/home）：只返回 show_on_home 集合卡片（含预览商品）。
 * 商品级 isFeatured 已退役（后端不再输出 featuredProducts），
 * 首页商品区 = 集合的预览商品，位置 = 前端渲染位、内容 = 集合。 */
export interface HomeResponse {
    collections: CollectionCardResponse[];
}
