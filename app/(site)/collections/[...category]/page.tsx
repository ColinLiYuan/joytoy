// 分类落地页（/collections/{a}/{b}... catch-all）。
// 渲染逻辑已抽到 components/category/category-landing.tsx，
// 供 /collections/[slug]（集合落地页）在查无集合时回退共用。
import type { Metadata } from 'next';
import { categoryService } from '@/services/categoryService';
import CategoryLanding from '@/components/category/category-landing';
import { isHiddenCategory } from '@/lib/constants/hidden-categories';

export const revalidate = 86400;

function titleFromSlug(slug: string): string {
    return slug.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ category: string | string[] }>;
}): Promise<Metadata> {
    const resolvedParams = await params;
    const urlSegments = Array.isArray(resolvedParams.category)
        ? resolvedParams.category
        : [resolvedParams.category];
    const fullSlug = urlSegments.join('/');
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';

    let name = titleFromSlug(urlSegments[urlSegments.length - 1]);
    let categoryTitle = '';
    let description = '';
    try {
        const allCategories = await categoryService.getCategories();
        const found = allCategories.find(cat => cat.slug === fullSlug);
        if (found) {
            name = found.name || name;
            // <title> 用 title 字段；为空回退 name + " | MythToy"
            categoryTitle = found.title || `${name} | MythToy`;
            description = found.description || '';
        }
    } catch {
        // 分类树拉取失败时用 slug 兜底标题
    }

    return {
        // <title>：用 title 字段；为空回退 name + " | MythToy"（H1 继续用 name，保持不变）
        title: fullSlug === 'all' ? 'All Products' : (categoryTitle || `${name} | MythToy`),
        // meta description：用 description 字段（无值时不输出）
        description: description || undefined,
        alternates: { canonical: `${baseUrl}/collections/${fullSlug}` },
        // 隐藏分类（realistic / torso，含子分类路径）：不让 Google 收录
        robots: isHiddenCategory([fullSlug]) ? { index: false } : undefined,
    };
}

export default async function ProductListPage({
    params,
}: {
    params: Promise<{ category: string | string[] }>;
}) {
    const resolvedParams = await params;
    const urlSegments = Array.isArray(resolvedParams.category)
        ? resolvedParams.category
        : [resolvedParams.category];

    return <CategoryLanding urlSegments={urlSegments} />;
}
