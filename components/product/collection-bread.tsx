// components/product/collection-bread.tsx
'use client';

import Link from 'next/link';
import { CategoryResponse } from '@/types/category';

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductBreadProps {
    currentCategory?: CategoryResponse | null;
    pathname: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

export default function CollectionBread({
                                            currentCategory,
                                            pathname
                                        }: ProductBreadProps) {
    const generateBreadcrumbs = (): Breadcrumb[] => {
        if (!pathname || pathname === '/') {
            return [{ name: 'Home', path: '/' }];
        }

        const breadcrumbs: Breadcrumb[] = [{ name: 'Home', path: '/' }];
        const segments = pathname.split('/').filter(segment => segment);

        let currentPath = '';

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;

            if (segment === 'collections') {
                breadcrumbs.push({
                    name: 'Collections',
                    path: isLast ? null : currentPath
                });
                return;
            }

            if (isLast && currentCategory) {
                breadcrumbs.push({
                    name: currentCategory.name,
                    path: null
                });
            } else {
                breadcrumbs.push({
                    name: formatSegmentName(segment),
                    path: isLast ? null : currentPath
                });
            }
        });

        return breadcrumbs;
    };

    const formatSegmentName = (segment: string): string => {
        return segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const breadcrumbs = generateBreadcrumbs();

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((breadcrumb, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': breadcrumb.name,
            'item': breadcrumb.path
                ? `${SITE_URL}${breadcrumb.path}`
                : `${SITE_URL}${pathname}`
        }))
    };

    return (
        <div className="flex flex-col gap-2 py-4 md:py-3 breadcrumb">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                key={`breadcrumb-${pathname}`}
            />

            <div className="w-full">
                <nav
                    className="flex items-center flex-wrap gap-1 text-sm"
                    aria-label="Breadcrumb"
                    itemScope
                    itemType="https://schema.org/BreadcrumbList"
                >
                    {breadcrumbs.map((item, index) => (
                        <span
                            key={index}
                            className="flex items-center gap-1"
                            itemProp="itemListElement"
                            itemScope
                            itemType="https://schema.org/ListItem"
                        >
                            {item.path ? (
                                <Link
                                    href={item.path}
                                    className="px-1.5 py-0.5 rounded-md no-underline breadcrumb-link transition-all duration-200"
                                    itemProp="item"
                                >
                                    <span itemProp="name">{item.name}</span>
                                </Link>
                            ) : (
                                <span
                                    className="px-1.5 py-0.5 rounded-md cursor-default breadcrumb-current"
                                    aria-current="page"
                                    itemProp="name"
                                >
                                    {item.name}
                                </span>
                            )}
                            <meta itemProp="position" content={`${index + 1}`} />
                            {index < breadcrumbs.length - 1 && (
                                <span className="breadcrumb-separator text-xs mx-1">/</span>
                            )}
                        </span>
                    ))}
                </nav>
            </div>

            {currentCategory && (
                <div className="w-full text-left min-w-0 pt-1">
                    <h1
                        className="text-2xl md:text-xl font-medium mb-3 md:mb-1 leading-tight breadcrumb-title"
                        itemProp="name"
                    >
                        {currentCategory.name}
                    </h1>
                    {currentCategory.description && (
                        <p className="text-base md:text-sm leading-relaxed m-0 pt-0.5 breadcrumb-description">
                            {currentCategory.description}
                        </p>
                    )}
                    <script
                        type="application/ld+json"
                        dangerouslySetInnerHTML={{
                            __html: JSON.stringify({
                                '@context': 'https://schema.org',
                                '@type': 'CollectionPage',
                                'name': currentCategory.name,
                                'description': currentCategory.description || `Browse ${currentCategory.name} collection`,
                                'url': `${SITE_URL}${pathname}`
                            })
                        }}
                    />
                </div>
            )}
        </div>
    );
}