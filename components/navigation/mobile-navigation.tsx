'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RootResponse } from '@/types/category';
import { X, ChevronRight, ArrowLeft, Sparkles, TrendingUp, LayoutGrid } from 'lucide-react'; // ✅ 引入新图标
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
                } ${isOpen ? 'visible' : 'invisible'}`}
                style={{ zIndex: Z_INDEX.DRAWER }}
            >
                <div className="w-full h-full relative overflow-hidden bg-white">

                    {/* === MAIN PANEL (主菜单) === */}
                    <div className="absolute inset-0 flex flex-col bg-white w-full h-full">
                        {/* 1. Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white shrink-0">
                            <span className="text-xl font-bold font-['Playfair_Display']">Menu</span>
                            <button onClick={onClose} className="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto custom-scrollbar">

                            {/* 2. Highlights Zone (高频营销入口) - 重点设计 */}
                            <div className="py-4 border-b border-gray-100">
                                <Link
                                    href="/collections/new-arrivals"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-900 hover:text-pink-600 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                                >
                                    <Sparkles size={18} className="text-pink-500" />
                                    New Arrivals
                                </Link>
                                <Link
                                    href="/collections/best-sellers"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-900 hover:text-pink-600 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                                >
                                    <TrendingUp size={18} className="text-purple-500" />
                                    Best Sellers
                                </Link>
                                <Link
                                    href="/collections/all"
                                    onClick={onClose}
                                    className="flex items-center gap-3 px-6 py-3 text-sm font-bold text-gray-900 hover:text-pink-600 hover:bg-gray-50 transition-colors uppercase tracking-wider"
                                >
                                    <LayoutGrid size={18} className="text-gray-400" />
                                    Shop All
                                </Link>
                            </div>

                            {/* 3. Categories Zone (物理分类) - 干净的列表 */}
                            <div className="py-2">
                                <div className="px-6 py-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    Categories
                                </div>
                                {rootsData.map((root) => {
                                    const hasSubs = root.categories && root.categories.length > 0;
                                    const active = isActive(`/collections/${root.slug}`);

                                    return (
                                        <div key={root.slug}>
                                            {hasSubs ? (
                                                <button
                                                    onClick={() => onOpenSubCategory(root)}
                                                    className={`w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50 transition-colors group ${
                                                        active ? 'text-pink-600 font-medium' : 'text-gray-800'
                                                    }`}
                                                >
                                                    <span className="text-base font-medium">{root.name}</span>
                                                    <ChevronRight size={18} className="text-gray-300 group-hover:text-gray-900" />
                                                </button>
                                            ) : (
                                                <Link
                                                    href={`/collections/${root.slug}`}
                                                    onClick={onClose}
                                                    className={`block px-6 py-3.5 hover:bg-gray-50 transition-colors ${
                                                        active ? 'text-pink-600 font-medium' : 'text-gray-800'
                                                    }`}
                                                >
                                                    <span className="text-base font-medium">{root.name}</span>
                                                </Link>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* 4. Utility Zone (品牌服务) - 底部灰底 */}
                            <div className="mt-4 pt-6 pb-10 px-6 bg-gray-50 border-t border-gray-100 space-y-4">
                                <Link href="/pages/about" onClick={onClose} className="block text-sm text-gray-500 hover:text-black font-medium">Our Story</Link>
                                <Link href="/blog" onClick={onClose} className="block text-sm text-gray-500 hover:text-black font-medium">Journal / Blog</Link>
                                <Link href="/pages/contact" onClick={onClose} className="block text-sm text-gray-500 hover:text-black font-medium">Contact Us</Link>
                                <Link href="/pages/wholesale" onClick={onClose} className="block text-sm text-gray-500 hover:text-black font-medium">Wholesale</Link>
                            </div>
                        </div>
                    </div>

                    {/* === SUB PANEL (子菜单 - 保持之前的逻辑) === */}
                    <div
                        className={`absolute inset-0 flex flex-col bg-white transition-transform duration-300 ease-in-out w-full h-full z-10 ${
                            currentPanel === 'sub' ? 'translate-x-0' : 'translate-x-full'
                        }`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-white">
                            <button
                                onClick={onBackToMain}
                                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition-colors"
                            >
                                <ArrowLeft size={18} />
                                Back
                            </button>
                            <span className="font-bold text-gray-900 truncate max-w-[150px]">{currentRootCategory?.name}</span>
                            <div className="w-6" />
                        </div>

                        {/* List */}
                        <div className="flex-1 overflow-y-auto py-2 bg-white custom-scrollbar">
                            {/* 这个 View All 还是需要的，因为这是进入“当前分类下所有商品”的唯一入口 */}
                            {currentRootCategory && (
                                <Link
                                    href={`/collections/${currentRootCategory.slug}`}
                                    onClick={onClose}
                                    className="block px-6 py-4 text-sm font-bold text-black bg-gray-50 border-b border-gray-100 hover:bg-gray-100 transition-colors"
                                >
                                    View All {currentRootCategory.name}
                                </Link>
                            )}

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
            </div>
        </>
    );
}