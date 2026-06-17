// components/common/breadcrumb.tsx
'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
    name: string;
    path: string | null;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
    showLastItem?: boolean;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';

export default function Breadcrumb({ items, showLastItem = false }: BreadcrumbProps) {
    const visibleItems = showLastItem ? items : items.slice(0, -1);

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
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <ol className="flex items-center flex-wrap gap-2 text-sm text-gray-500">
                {visibleItems.map((item, index) => {
                    const isLast = index === visibleItems.length - 1;

                    return (
                        <li key={index} className="flex items-center gap-2">
                            {index === 0 && <Home size={14} className="mb-0.5" />}

                            {/* ✅ 修改逻辑：只要 item.path 存在，就渲染为 Link，不管是不是最后一项 */}
                            {item.path ? (
                                <Link
                                    href={item.path}
                                    className={`transition-colors duration-200 ${
                                        isLast
                                            // 如果是当前页(最后一项)：加粗、黑色，表明状态
                                            ? 'font-medium text-gray-900 hover:text-black'
                                            // 如果是父级页：灰色，悬停变黑加下划线
                                            : 'text-gray-500 hover:text-black hover:underline underline-offset-4'
                                    }`}
                                    aria-current={isLast ? 'page' : undefined}
                                >
                                    {item.name}
                                </Link>
                            ) : (
                                // 只有 path 为 null 时才渲染为纯文本
                                <span className="font-medium text-gray-900 line-clamp-1 max-w-[200px] md:max-w-none">
                                    {item.name}
                                </span>
                            )}

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