// components/product/product-breadcrumb.tsx
'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductBreadcrumbProps {
    breadcrumbs: Breadcrumb[];
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

export default function ProductBreadcrumb({ breadcrumbs }: ProductBreadcrumbProps) {
    // 这里的 breadcrumbs 是从 page.tsx 生成的
    // 确保 logic 也是 Home > Category > Product

    // JSON-LD 保持不变 ...
    const structuredData = { /* ... */ };

    return (
        // ✅ 统一：使用 text-sm 和 mb-6 (与分类页一致)
        <nav className="flex items-center text-sm text-gray-500 pt-4 mb-6" aria-label="Breadcrumb">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />

            <div className="flex flex-wrap items-center gap-2">
                {breadcrumbs.map((item, index) => {
                    const isLast = index === breadcrumbs.length - 1;

                    return (
                        <div key={index} className="flex items-center gap-2">
                            {item.path && !isLast ? (
                                <Link
                                    href={item.path}
                                    className="hover:text-black hover:underline underline-offset-2 transition-colors"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                // 最后一项 (产品名)，显示为灰色或黑色，不可点
                                <span className={`font-medium ${isLast ? 'text-gray-900 cursor-default' : 'text-gray-500'}`}>
                                    {item.name}
                                </span>
                            )}

                            {!isLast && (
                                <ChevronRight size={14} className="text-gray-300" />
                            )}
                        </div>
                    );
                })}
            </div>
        </nav>
    );
}