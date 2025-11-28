// components/common/breadcrumb.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    name: string;
    path: string | null; // null 表示不可点击（通常是当前页）
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showLastItem?: boolean; // 控制是否显示最后一级（当前页标题）
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mythtoy.com';

export default function Breadcrumb({ items, showLastItem = false }: BreadcrumbProps) {
    // 1. 视觉上要显示的 items
    const visibleItems = showLastItem ? items : items.slice(0, -1);

    // 2. 完整的 Schema 数据 (SEO 必须包含完整的路径)
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.path ? `${SITE_URL}${item.path}` : undefined
        }))
    };

    return (
        <nav aria-label="Breadcrumb" className="w-full">
            {/* 注入 JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                {visibleItems.map((item, index) => {
                    const isLast = index === visibleItems.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {/* 第一项如果是 Home，可以加个小图标 */}
                            {index === 0 && <Home size={14} className="mb-0.5" />}

                            {item.path && !isLast ? (
                                <Link
                                    href={item.path}
                                    className="hover:text-black hover:underline underline-offset-4 transition-colors duration-200"
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                // 最后一项（当前页），颜色加深，不可点
                                <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px] md:max-w-none">
                                    {item.name}
                                </span>
                            )}

                            {/* 分隔符 */}
                            {!isLast && (
                                <ChevronRight size={14} className="text-gray-300 flex-shrink-0" />
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}