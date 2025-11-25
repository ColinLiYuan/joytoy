// components/product/collection-bread.tsx
'use client';

import Link from 'next/link';
import { CategoryResponse } from '@/types/category';
import { ChevronRight } from 'lucide-react'; // 使用 Lucide

interface Breadcrumb {
    name: string;
    path: string | null;
}

interface ProductBreadProps {
    currentCategory?: CategoryResponse | null;
    pathname: string;
}

export default function CollectionBread({ currentCategory, pathname }: ProductBreadProps) {
    // ... 生成面包屑的逻辑保持不变 ...
    const generateBreadcrumbs = (): Breadcrumb[] => {
        if (!pathname || pathname === '/') return [{ name: 'Home', path: '/' }];
        const segments = pathname.split('/').filter(segment => segment);
        const breadcrumbs: Breadcrumb[] = [{ name: 'Home', path: '/' }];
        let currentPath = '';

        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            const isLast = index === segments.length - 1;
            if (segment === 'collections') {
                breadcrumbs.push({ name: 'Collections', path: isLast ? null : currentPath });
            } else if (isLast && currentCategory) {
                breadcrumbs.push({ name: currentCategory.name, path: null });
            } else {
                breadcrumbs.push({
                    name: segment.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
                    path: isLast ? null : currentPath
                });
            }
        });
        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <div className="flex flex-col gap-4 py-2 w-full">
            {/* JSON-LD 部分保持不变 */}

            {/* ✅ 修复：确保 flex-wrap，防止长路径撑开 */}
            <nav className="flex items-center flex-wrap gap-1.5 text-sm text-gray-500">
                {breadcrumbs.map((item, index) => (
                    <span key={index} className="flex items-center gap-1.5">
                        {item.path ? (
                            <Link href={item.path} className="hover:text-black transition-colors">
                                {item.name}
                            </Link>
                        ) : (
                            <span className="font-medium text-black line-clamp-1">
                                {item.name}
                            </span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                            <ChevronRight size={12} className="text-gray-300 flex-shrink-0" />
                        )}
                    </span>
                ))}
            </nav>

            {currentCategory && (
                <div className="w-full">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">
                        {currentCategory.name}
                    </h1>
                    {currentCategory.description && (
                        <p className="text-gray-500 text-sm md:text-base max-w-3xl leading-relaxed">
                            {currentCategory.description}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}