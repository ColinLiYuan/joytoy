// components/product/product-breadcrumb.tsx
'use client';

import Link from 'next/link';

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductBreadcrumbProps {
    breadcrumbs: Breadcrumb[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

export default function ProductBreadcrumb({
                                              breadcrumbs
                                          }: ProductBreadcrumbProps) {
    // 过滤掉最后一个面包屑（当前页面）
    const visibleBreadcrumbs = breadcrumbs.slice(0, -1);

    // 结构化数据（包含所有面包屑）
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': breadcrumb.name,
            'item': breadcrumb.path
                ? `${SITE_URL}${breadcrumb.path}`
                : `${SITE_URL}/products/${breadcrumb.name?.toLowerCase().replace(/\s+/g, '-')}`
        }))
    };

    return (
        <div className="flex flex-col gap-0 breadcrumb">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <div className="w-full">
                <nav
                    className="flex items-center flex-wrap gap-1 text-sm"
                    aria-label="Breadcrumb"
                >
                    {visibleBreadcrumbs.map((item, index) => (
                        <span key={index} className="flex items-center gap-1">
                            {item.path ? (
                                <Link
                                    href={item.path}
                                    className="rounded-md no-underline breadcrumb-link transition-all duration-200"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                <span
                                    className="rounded-md cursor-default breadcrumb-current"
                                    aria-current="page"
                                >
                                    {item.name}
                                </span>
                            )}
                            {index < visibleBreadcrumbs.length - 1 && (
                                <span className="breadcrumb-separator text-xs mx-1">/</span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>
        </div>
    );
}