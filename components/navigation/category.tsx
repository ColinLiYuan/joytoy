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
    const [touchExpanded, setTouchExpanded] = useState<string | null>(null);

    const localRootsData = rootsData;

    const activeCategory = useMemo(() => {
        const pathSegments = pathname.split('/').filter(segment => segment);
        const currentSlug = pathSegments[pathSegments.length - 1];

        if (!localRootsData || localRootsData.length === 0) {
            return '';
        }

        for (const root of localRootsData) {
            if (root.slug === currentSlug) {
                return root.slug;
            }

            if (root.categories && root.categories.length > 0) {
                const subCategory = root.categories.find(cat => cat.slug === currentSlug);
                if (subCategory) {
                    return root.slug;
                }
            }
        }

        return '';
    }, [pathname, localRootsData]);

    // 移动端触摸处理
    const handleTouch = (categorySlug: string) => {
        if (touchExpanded === categorySlug) {
            setTouchExpanded(null);
        } else {
            setTouchExpanded(categorySlug);
        }
    };

    if (!localRootsData || localRootsData.length === 0) {
        return null;
    }

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
        <div className="max-w-7xl mx-auto px-4">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
            />

            <nav
                aria-label="Main product categories"
                role="navigation"
                itemScope
                itemType="https://schema.org/SiteNavigationElement"
                className="w-full"
            >
                <ul className="flex justify-center items-center m-0 p-0 list-none w-full nav-category">
                    {localRootsData.map((root) => {
                        const categorySlug = root.slug;
                        const isActive = activeCategory === categorySlug;
                        const isExpanded = expandedCategory === categorySlug;
                        const isTouchExpanded = touchExpanded === categorySlug;
                        const subCategories = root.categories || [];
                        const showDropdown = isExpanded || isTouchExpanded;

                        return (
                            <li
                                key={root.slug}
                                className={`relative m-0 group ${isActive ? 'active' : ''}`}
                                onMouseEnter={() => setExpandedCategory(categorySlug)}
                                onMouseLeave={() => setExpandedCategory(null)}
                                itemProp="name"
                            >
                                <div className="flex flex-col items-center">
                                    <Link
                                        href={`/collections/${categorySlug}`}
                                        className={`
                                            text-lg font-bold flex items-center justify-center px-4 py-3 
                                            no-underline transition-all duration-300 
                                            text-center relative whitespace-nowrap
                                            tracking-wide min-w-[120px]
                                            ${isActive ? 'active-link' : 'normal-link'}
                                        `}
                                        aria-current={isActive ? 'page' : undefined}
                                        aria-haspopup={subCategories.length > 0 ? 'true' : undefined}
                                        aria-expanded={showDropdown ? 'true' : 'false'}
                                        onTouchStart={(e) => {
                                            if (subCategories.length > 0) {
                                                e.preventDefault();
                                                handleTouch(categorySlug);
                                            }
                                        }}
                                        itemProp="url"
                                    >
                                        <span itemProp="name">{root.name}</span>
                                        {subCategories.length > 0 && (
                                            <span className="ml-1 text-xs" aria-hidden="true">
                                                ▼
                                            </span>
                                        )}
                                    </Link>

                                    {/* 子分类下拉菜单 */}
                                    {subCategories.length > 0 && (
                                        <div
                                            className={`
                                                absolute top-full left-1/2 transform -translate-x-1/2 w-52 bg-white rounded-lg 
                                                shadow-lg py-2 z-[10000] border border-gray-200
                                                transition-all duration-300
                                                ${showDropdown
                                                ? 'opacity-100 visible translate-y-0'
                                                : 'opacity-0 invisible -translate-y-2'
                                            }
                                            `}
                                            aria-hidden={!showDropdown}
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
                                                                        ? 'active-link bg-gray-50 border-[var(--accent-color)] font-medium'
                                                                        : 'normal-link hover:bg-gray-50 border-transparent'
                                                                }
                                                                `}
                                                                aria-current={isSubActive ? 'page' : undefined}
                                                                role="menuitem"
                                                                itemProp="url"
                                                                onTouchStart={() => setTouchExpanded(null)}
                                                            >
                                                                <span itemProp="name">{subCategory.name}</span>
                                                            </Link>
                                                        </li>
                                                    );
                                                })}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </div>
    );
}