// 分类落地页（/collections/{a}/{b}... catch-all）。
// 渲染逻辑已抽到 components/category/category-landing.tsx，
// 供 /collections/[slug]（集合落地页）在查无集合时回退共用。
import type { Metadata } from 'next';
import { categoryService } from '@/services/categoryService';
import CategoryLanding from '@/components/category/category-landing';

export const revalidate = 3600;

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
    let description = '';
    try {
        const allCategories = await categoryService.getCategories();
        const found = allCategories.find(cat => cat.slug === fullSlug);
        if (found) {
            name = found.name || name;
            description = found.description || '';
        }
    } catch {
        // 分类树拉取失败时用 slug 兜底标题
    }

    return {
        title: fullSlug === 'all' ? 'All Products' : name,
        description: description || `Shop premium ${fullSlug === 'all' ? 'adult toys' : name.toLowerCase()} at MythToy. Body-safe materials, discreet shipping, 1-year warranty.`,
        alternates: { canonical: `${baseUrl}/collections/${fullSlug}` },
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
