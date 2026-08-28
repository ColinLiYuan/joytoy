// 分类落地页（/collections/{a}/{b}... catch-all）。
// 渲染逻辑已抽到 components/category/category-landing.tsx，
// 供 /collections/[slug]（集合落地页）在查无集合时回退共用。
import CategoryLanding from '@/components/category/category-landing';

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
