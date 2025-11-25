// components/product/product-breadcrumb.tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react'; // ✅ Lucide

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductBreadcrumbProps {
    breadcrumbs: Breadcrumb[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

export default function ProductBreadcrumb({ breadcrumbs }: ProductBreadcrumbProps) {
    const visibleBreadcrumbs = breadcrumbs.slice(0, -1);

    // JSON-LD Schema
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
        <nav className="flex items-center text-xs text-gray-500 pt-4" aria-label="Breadcrumb">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
            <div className="flex flex-wrap items-center gap-2">
                {visibleBreadcrumbs.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        {item.path ? (
                            <Link
                                href={item.path}
                                className="hover:text-black hover:underline underline-offset-2 transition-colors"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <span className="text-gray-900 font-medium">{item.name}</span>
                        )}
                        {index < visibleBreadcrumbs.length - 1 && (
                            <ChevronRight size={12} className="text-gray-300" />
                        )}
                    </div>
                ))}
            </div>
        </nav>
    );
}