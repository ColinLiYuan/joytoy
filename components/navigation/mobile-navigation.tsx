// components/navigation/mobile-navigation.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootResponse } from '@/types/category';
import { Z_INDEX } from '@/lib/constants/z-index';

interface MobileNavigationProps {
    isOpen: boolean;
    onClose: () => void;
    rootsData: RootResponse[];
    currentPanel: 'main' | 'sub';
    currentRootCategory: RootResponse | null;
    onBackToMain: () => void;
    onOpenSubCategory: (root: RootResponse) => void;
}

export default function MobileNavigation({
                                             isOpen,
                                             onClose,
                                             rootsData,
                                             currentPanel,
                                             currentRootCategory,
                                             onBackToMain,
                                             onOpenSubCategory,
                                         }: MobileNavigationProps) {
    const pathname = usePathname();

    // 改进的激活状态判断逻辑
    const getIsActive = (slug: string, isRootCategory: boolean = true) => {
        if (isRootCategory) {
            // 对于主分类，检查当前路径是否包含该主分类或其任何子分类
            const rootCategory = rootsData.find(root => root.slug === slug);
            if (rootCategory) {
                // 检查是否是主分类本身
                if (pathname.includes(`/collections/${slug}`)) {
                    return true;
                }
                // 检查是否是子分类
                if (rootCategory.categories) {
                    return rootCategory.categories.some(subCat =>
                        pathname.includes(`/collections/${subCat.slug}`)
                    );
                }
            }
        } else {
            // 对于子分类，直接检查路径
            return pathname.includes(`/collections/${slug}`);
        }
        return false;
    };

    return (
        <>
            {/* 遮罩层 */}
            <div
                className={`lg:hidden fixed inset-0 bg-black transition-all duration-300 ${
                    isOpen ? 'opacity-40 visible' : 'opacity-0 invisible'
                }`}
                style={{
                    zIndex: Z_INDEX.OVERLAY,
                    width: '100vw',
                    height: '100vh'
                }}
                onClick={onClose}
            />

            {/* 侧边栏容器 */}
            <div
                className={`lg:hidden fixed top-0 right-0 w-4/5 max-w-xs h-full transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } overflow-hidden`}
                style={{
                    zIndex: Z_INDEX.NAVIGATION,
                    maxWidth: '320px'
                }}
            >
                {/* 主面板 */}
                <div
                    className={`absolute inset-0 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                        currentPanel === 'main' ? 'translate-x-0' : '-translate-x-full'
                    } overflow-hidden`}
                >
                    {/* 头部 */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0 bg-white h-16">
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-gray-900 font-semibold text-lg no-underline hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                            onClick={onClose}
                        >
                            MythToy
                        </Link>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-y-auto">
                        <ul className="py-2">
                            {rootsData.map((root) => {
                                const categorySlug = root.slug;
                                const subCategories = root.categories || [];
                                const hasSubCategories = subCategories.length > 0;
                                const isActive = getIsActive(categorySlug, true);

                                return (
                                    <li key={root.name} className="border-b border-gray-100 last:border-b-0">
                                        {hasSubCategories ? (
                                            <button
                                                onClick={() => onOpenSubCategory(root)}
                                                className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
                                                    isActive
                                                        ? 'text-[var(--accent-color)] font-medium'
                                                        : 'text-gray-700 hover:text-[var(--accent-color)]'
                                                }`}
                                            >
                                                <span className="font-medium">{root.name}</span>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M9 18l6-6-6-6"/>
                                                </svg>
                                            </button>
                                        ) : (
                                            <Link
                                                href={`/collections/${categorySlug}`}
                                                className={`block px-5 py-4 no-underline transition-colors ${
                                                    isActive
                                                        ? 'text-[var(--accent-color)] font-medium'
                                                        : 'text-gray-700 hover:text-[var(--accent-color)]'
                                                }`}
                                                onClick={onClose}
                                            >
                                                <span className="font-medium">{root.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {/* 子分类面板 */}
                <div
                    className={`absolute inset-0 flex flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out ${
                        currentPanel === 'sub' ? 'translate-x-0' : 'translate-x-full'
                    } overflow-hidden`}
                >
                    {/* 头部 */}
                    <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0 bg-white h-16">
                        <button
                            onClick={onBackToMain}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                            aria-label="Back to main menu"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M15 18l-6-6 6-6"/>
                            </svg>
                            <span>Back</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="Close menu"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {/* 内容区域 */}
                    <div className="flex-1 overflow-y-auto">
                        {currentRootCategory && (
                            <ul className="py-2">
                                {(currentRootCategory.categories || []).map((subCategory) => {
                                    const isSubActive = getIsActive(subCategory.slug, false);

                                    return (
                                        <li key={subCategory.slug} className="border-b border-gray-100 last:border-b-0">
                                            <Link
                                                href={`/collections/${subCategory.slug}`}
                                                className={`block px-5 py-4 no-underline transition-colors ${
                                                    isSubActive
                                                        ? 'text-[var(--accent-color)] font-medium'
                                                        : 'text-gray-700 hover:text-[var(--accent-color)]'
                                                }`}
                                                onClick={onClose}
                                            >
                                                <span className="font-medium">{subCategory.name}</span>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}