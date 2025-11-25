'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootResponse } from '@/types/category';
import { X, ChevronRight, ArrowLeft } from 'lucide-react';
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
    const isActive = (path: string) => pathname.includes(path);

    return (
        <>
            {/* 遮罩层 */}
            <div
                className={`lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            {/* 侧边栏容器 */}
            <div
                className={`lg:hidden fixed top-0 right-0 w-[85vw] max-w-[360px] h-full bg-white shadow-2xl transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } ${
                    /* ✅ 核心修复：当关闭时，加上 invisible。这能防止 fixed 元素撑开页面宽度 */
                    isOpen ? 'visible' : 'invisible'
                }`}
                style={{ zIndex: Z_INDEX.DRAWER }}
            >
                {/* MAIN PANEL */}
                <div
                    className={`absolute inset-0 flex flex-col bg-white transition-all duration-300 ${
                        currentPanel === 'main' ? 'translate-x-0 visible' : '-translate-x-full invisible'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                        <span className="text-lg font-bold font-['Playfair_Display']">Menu</span>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100">
                            <X size={24} />
                        </button>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-2 bg-white">
                        {rootsData.map((root) => {
                            const hasSubs = root.categories && root.categories.length > 0;
                            const active = isActive(`/collections/${root.slug}`);

                            return (
                                <div key={root.slug} className="border-b border-gray-50">
                                    {hasSubs ? (
                                        <button
                                            onClick={() => onOpenSubCategory(root)}
                                            className={`w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors ${
                                                active ? 'text-pink-600 font-medium' : 'text-gray-800'
                                            }`}
                                        >
                                            <span className="text-base">{root.name}</span>
                                            <ChevronRight size={18} className="text-gray-400" />
                                        </button>
                                    ) : (
                                        <Link
                                            href={`/collections/${root.slug}`}
                                            onClick={onClose}
                                            className={`block px-6 py-4 hover:bg-gray-50 transition-colors ${
                                                active ? 'text-pink-600 font-medium' : 'text-gray-800'
                                            }`}
                                        >
                                            {root.name}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}

                        {/* Mobile Footer Links */}
                        <div className="mt-4 pt-4 border-t border-gray-100 px-6 space-y-4 pb-10">
                            <Link href="/pages/about" onClick={onClose} className="block text-sm text-gray-500">Our Story</Link>
                            <Link href="/pages/contact" onClick={onClose} className="block text-sm text-gray-500">Contact</Link>
                            <Link href="/blog" onClick={onClose} className="block text-sm text-gray-500">Blog</Link>
                        </div>
                    </div>
                </div>

                {/* SUB PANEL */}
                <div
                    className={`absolute inset-0 flex flex-col bg-white transition-all duration-300 ${
                        currentPanel === 'sub' ? 'translate-x-0 visible' : 'translate-x-full invisible'
                    }`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                        <button
                            onClick={onBackToMain}
                            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                        <span className="font-bold text-gray-900 truncate max-w-[150px]">{currentRootCategory?.name}</span>
                        <div className="w-6" />
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto py-2 bg-white">
                        <Link
                            href={`/collections/${currentRootCategory?.slug}`}
                            onClick={onClose}
                            className="block px-6 py-4 text-sm font-bold text-black bg-gray-50 mb-2"
                        >
                            View All {currentRootCategory?.name}
                        </Link>
                        {currentRootCategory?.categories?.map((sub) => (
                            <Link
                                key={sub.slug}
                                href={`/collections/${sub.slug}`}
                                onClick={onClose}
                                className={`block px-6 py-4 border-b border-gray-50 text-sm text-gray-600 hover:text-pink-600 hover:bg-gray-50 transition-colors`}
                            >
                                {sub.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}