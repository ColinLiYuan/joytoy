// components/navigation/category.tsx
'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RootResponse } from '@/types/category';

interface MainNaviCategoryProps {
    rootsData?: RootResponse[];
}

export default function Category({ rootsData = [] }: MainNaviCategoryProps) {
    const pathname = usePathname();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const localRootsData = rootsData;

    const activeCategory = useMemo(() => {
        const pathSegments = pathname.split('/').filter(segment => segment);
        const currentSlug = pathSegments[pathSegments.length - 1];

        if (!localRootsData || localRootsData.length === 0) {
            return '';
        }

        for (const root of localRootsData) {
            // 检查主分类是否匹配
            if (root.slug === currentSlug) {
                return root.slug;
            }

            // 检查子分类是否匹配
            if (root.categories && root.categories.length > 0) {
                const subCategory = root.categories.find(cat => cat.slug === currentSlug);
                if (subCategory) {
                    return root.slug;
                }
            }
        }

        return '';
    }, [pathname, localRootsData]);

    // 如果没有数据，不渲染任何内容
    if (!localRootsData || localRootsData.length === 0) {
        return null;
    }

    // 生成网站导航的结构化数据
    const websiteStructuredData = useMemo(() => {
        return {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            'name': 'Myth Toy',
            'url': 'https://mythtoy.com/',
            'potentialAction': {
                '@type': 'SearchAction',
                'target': 'https://mythtoy.com/search?q={search_term_string}',
                'query-input': 'required name=search_term_string'
            }
        };
    }, []);

    return (
        <div className="">
            <div className="max-w-7xl mx-auto px-4">
                {/* 网站导航的结构化数据 */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
                />

                {/* 主导航 */}
                <nav
                    aria-label="Main product categories"
                    role="navigation"
                    itemScope
                    itemType="https://schema.org/SiteNavigationElement"
                    className="w-full"
                >
                    <ul className="flex justify-center items-center gap-0 m-0 p-0 list-none w-full">
                        {localRootsData.map((root) => {
                            const categorySlug = root.slug;
                            const isActive = activeCategory === categorySlug;
                            const isExpanded = expandedCategory === categorySlug;
                            const subCategories = root.categories || [];

                            return (
                                <li
                                    key={root.slug}
                                    className={`relative m-0 flex-1 max-w-[200px] min-w-[120px] ${
                                        isActive ? 'active' : ''
                                    }`}
                                    onMouseEnter={() => setExpandedCategory(categorySlug)}
                                    onMouseLeave={() => setExpandedCategory(null)}
                                    itemProp="name"
                                >
                                    <Link
                                        href={`/collections/${categorySlug}`}
                                        className={`
                                            text-lg font-bold flex items-center justify-center px-4 py-3 
                                            no-underline transition-all duration-300 
                                            text-center relative bg-transparent whitespace-nowrap
                                            ${isActive ? 'text-[var(--primary-color)]' : 'text-gray-700 hover:text-[var(--primary-color)]'}
                                        `}
                                        aria-current={isActive ? 'page' : undefined}
                                        aria-haspopup={subCategories.length > 0 ? 'true' : undefined}
                                        aria-expanded={isExpanded ? 'true' : 'false'}
                                        itemProp="url"
                                    >
                                        <span itemProp="name">{root.name}</span>
                                        {subCategories.length > 0 && (
                                            <span className="hidden" aria-hidden="true">
                                                ▼
                                            </span>
                                        )}
                                    </Link>

                                    {/* 激活状态的下划线 */}
                                    {isActive && (
                                        <div className="absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-[var(--primary-color)] rounded"></div>
                                    )}

                                    {/* 悬停状态的下划线 */}
                                    <div className={`
                                        absolute bottom-0 left-1/4 w-1/2 h-0.5 bg-[var(--primary-color)] rounded 
                                        transition-all duration-300 opacity-0
                                        ${isActive ? 'opacity-100' : 'group-hover:opacity-100'}
                                    `}></div>

                                    {/* 子分类下拉菜单 */}
                                    {subCategories.length > 0 && (
                                        <div
                                            className={`
                                                absolute top-full left-0 w-52 bg-white rounded-lg 
                                                shadow-lg py-2 z-[10000] 
                                                transition-all duration-300
                                                ${isExpanded
                                                ? 'opacity-100 visible translate-y-0'
                                                : 'opacity-0 invisible -translate-y-2'
                                            }
                                            `}
                                            aria-hidden={!isExpanded}
                                            role="menu"
                                        >
                                            <ul className="list-none p-0 m-0">
                                                {subCategories.map((subCategory) => {
                                                    if (!subCategory) return null;

                                                    const isSubActive = pathname.includes(subCategory.slug);

                                                    return (
                                                        <li key={subCategory.slug} className="m-0" role="none">
                                                            <Link
                                                                href={`/collections/${subCategory.slug}`}
                                                                className={`
                                                                    block px-4 py-2 text-sm no-underline 
                                                                    transition-all duration-200 border-l-3
                                                                    ${
                                                                    isSubActive
                                                                        ? 'text-[var(--primary-color)] bg-[color:var(--primary-color)]/10 border-[var(--primary-color)] font-medium'
                                                                        : 'text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color:var(--primary-color)]/10 border-transparent'
                                                                }
                                                                `}
                                                                aria-current={isSubActive ? 'page' : undefined}
                                                                role="menuitem"
                                                                itemProp="url"
                                                            >
                                                                <span itemProp="name">{subCategory.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </div>
        </div>
    );
}