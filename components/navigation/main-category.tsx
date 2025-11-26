// components/navigation/main-category.tsx
'use client';

import { useState, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { RootResponse } from '@/types/category';
import { Z_INDEX } from '@/lib/constants/z-index';

interface MainNaviCategoryProps {
    rootsData?: RootResponse[];
}

export default function MainCategory({ rootsData = [] }: MainNaviCategoryProps) {
    const pathname = usePathname();
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const activeCategory = useMemo(() => {
        const pathSegments = pathname.split('/').filter(segment => segment);
        const currentSlug = pathSegments[pathSegments.length - 1];
        if (!rootsData || rootsData.length === 0) return '';

        for (const root of rootsData) {
            if (root.slug === currentSlug) return root.slug;
            if (root.categories?.some(cat => cat.slug === currentSlug)) return root.slug;
        }
        return '';
    }, [pathname, rootsData]);

    if (!rootsData || rootsData.length === 0) return null;

    return (
        <nav className="w-full flex justify-center h-full relative z-[999]"> {/* 提升层级 */}
            <ul className="flex items-center gap-1 m-0 p-0 list-none h-full">
                {rootsData.map((root) => {
                    const isActive = activeCategory === root.slug;
                    const isHovered = expandedCategory === root.slug;
                    const subCategories = root.categories || [];

                    return (
                        <li
                            key={root.slug}
                            className="relative group h-full flex items-center"
                            onMouseEnter={() => setExpandedCategory(root.slug)}
                            onMouseLeave={() => setExpandedCategory(null)}
                        >
                            <Link
                                href={`/collections/${root.slug}`}
                                className={`
                                    relative block px-6 py-3 text-base font-medium tracking-wide transition-colors duration-200
                                    font-['Playfair_Display'] whitespace-nowrap
                                    ${isActive ? 'text-pink-600' : 'text-gray-800 hover:text-pink-600'}
                                `}
                            >
                                {root.name}
                                <span className={`absolute bottom-0 left-5 right-5 h-0.5 bg-pink-600 transform transition-transform duration-300 origin-center ${isActive || isHovered ? 'scale-x-100' : 'scale-x-0'}`} />
                            </Link>

                            {subCategories.length > 0 && (
                                <div
                                    className={`
                                        absolute top-full left-1/2 transform -translate-x-1/2 
                                        bg-white rounded-xl shadow-xl py-3 border border-gray-100
                                        transition-all duration-200 origin-top min-w-[14rem] w-max
                                        ${isHovered ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                                    `}
                                    style={{ zIndex: Z_INDEX.DROPDOWN }}
                                >
                                    {/* 小三角 */}
                                    <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                                    <ul className="relative bg-white rounded-xl overflow-hidden max-h-[60vh] overflow-y-auto custom-scrollbar">
                                        {subCategories.map((sub) => (
                                            <li key={sub.slug}>
                                                <Link
                                                    href={`/collections/${sub.slug}`}
                                                    className="block px-6 py-3 text-sm text-gray-600 hover:text-pink-600 hover:bg-pink-50/50 transition-colors font-['Inter'] whitespace-nowrap"
                                                >
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}