// components/navigation/navigation.tsx (修复版本)
'use client';

import Link from 'next/link';
import Category from '@/components/navigation/category';
import UserActions from '@/components/common/user-actions';
import Cart from '@/components/common/cart';
import MinimalNavigation from '@/components/navigation/minimal-navigation';
import { useState, useEffect } from 'react';
import { usePathname } from "next/navigation";
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { RootResponse } from '@/types/category';
import { Z_INDEX } from '@/lib/constants/z-index';

interface NavigationProps {
    minimal?: boolean;
    rootsData?: RootResponse[];
}

export default function Navigation({ minimal = false, rootsData = [] }: NavigationProps) {
    const pathname = usePathname();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [currentPanel, setCurrentPanel] = useState<'main' | 'sub'>('main');
    const [currentRootCategory, setCurrentRootCategory] = useState<RootResponse | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const isCheckoutPage = pathname === '/checkout';

    // 使用 Zustand store 获取购物车方法
    const getCart = useCartStore(state => state.getCart);

    const {
        isLoggedIn,
        openAuthModal,
        logout,
    } = useAuth();

    // 标记客户端已加载
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isLoggedIn) {
            getCart();
        }
    }, [isLoggedIn, getCart]);

    // 处理 body 滚动
    useEffect(() => {
        if (isMobileNavOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileNavOpen]);

    const toggleCart = async () => {
        if (!isCartOpen && isLoggedIn) {
            await getCart();
        }
        setIsCartOpen(!isCartOpen);
    };

    const closeCart = () => setIsCartOpen(false);

    const toggleMobileNav = () => {
        setIsMobileNavOpen(!isMobileNavOpen);
        if (!isMobileNavOpen) {
            setCurrentPanel('main');
            setCurrentRootCategory(null);
        }
    };

    const closeMobileNav = () => {
        setIsMobileNavOpen(false);
        setTimeout(() => {
            setCurrentPanel('main');
            setCurrentRootCategory(null);
        }, 300);
    };

    const openSubCategoryPanel = (root: RootResponse) => {
        const subCategories = root.categories || [];
        if (subCategories.length > 0) {
            setCurrentRootCategory(root);
            setCurrentPanel('sub');
        } else {
            closeMobileNav();
        }
    };

    const backToMainPanel = () => {
        setCurrentPanel('main');
        setCurrentRootCategory(null);
    };

    const handleWishlistClick = (e: React.MouseEvent) => {
        if (!isLoggedIn) {
            e.preventDefault();
            openAuthModal('login', {
                onSuccess: () => {
                    window.location.href = '/wishlist';
                }
            });
        }
    };

    const handleCartClick = () => {
        if (!isLoggedIn) {
            openAuthModal('login', {
                onSuccess: () => {
                    toggleCart();
                }
            });
        } else {
            toggleCart();
        }
    };

    const handleLogout = () => {
        logout();
        setIsCartOpen(false);
    };

    const getActiveCategory = () => {
        const pathSegments = pathname.split('/').filter(segment => segment);
        return pathSegments[pathSegments.length - 1];
    };

    const activeCategory = getActiveCategory();

    if (minimal || isCheckoutPage) {
        return <MinimalNavigation />;
    }

    return (
        <>
            <div className="relative w-full" style={{ zIndex: Z_INDEX.NAVIGATION }}>
                <div className="bg-white py-3 relative border-b border-gray-200 w-full">
                    <div className="container mx-auto px-4 max-w-7xl">
                        <div className="flex justify-between items-center w-full">
                            {/* Logo - 固定在左边 */}
                            <Link href="/" className="flex items-center gap-1.5 flex-shrink-0">
                                <span className="text-base font-bold text-gray-900">MythToy</span>
                            </Link>

                            {/* 桌面版分类导航 */}
                            <div className="hidden lg:block flex-1 max-w-[600px] mx-5">
                                <Category rootsData={rootsData} />
                            </div>

                            {/* 右侧区域 - 用户操作和汉堡菜单紧凑排列 */}
                            <div className="flex items-center gap-0">
                                <UserActions
                                    isLoggedIn={isLoggedIn}
                                    onCartClick={handleCartClick}
                                    onWishlistClick={handleWishlistClick}
                                    onAuthModalOpen={() => openAuthModal('login')}
                                    onLogout={handleLogout}
                                />

                                <div className="lg:hidden flex justify-center items-center flex-shrink-0">
                                    <button
                                        onClick={toggleMobileNav}
                                        className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors"
                                        aria-label="Toggle menu"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M3 12h18M3 6h18M3 18h18"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 移动端导航侧边栏 - 只在客户端渲染 */}
                {isMounted && (
                    <>
                        {/* 遮罩层 */}
                        <div
                            className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
                                isMobileNavOpen ? 'opacity-40' : 'opacity-0 invisible'
                            }`}
                            style={{ zIndex: Z_INDEX.OVERLAY }}
                            onClick={closeMobileNav}
                        />

                        {/* 侧边栏容器 */}
                        <div
                            className={`lg:hidden fixed top-0 right-0 w-4/5 max-w-xs h-full transform transition-transform duration-300 ease-in-out ${
                                isMobileNavOpen ? 'translate-x-0' : 'translate-x-full'
                            } overflow-hidden max-h-screen`}
                            style={{ zIndex: Z_INDEX.NAVIGATION }}
                        >
                            {/* 主面板 */}
                            <div
                                className={`absolute inset-0 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                                    currentPanel === 'main' ? 'translate-x-0' : 'translate-x-full'
                                } overflow-hidden`}
                            >
                                {/* 头部 */}
                                <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0 bg-white h-16">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 text-gray-900 font-semibold text-lg no-underline hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors"
                                        onClick={closeMobileNav}
                                    >
                                        MythToy
                                    </Link>
                                    <button
                                        onClick={closeMobileNav}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* 内容区域 */}
                                <div className="flex-1 overflow-y-auto bg-white">
                                    <ul className="py-2">
                                        {rootsData.map((root) => {
                                            const categorySlug = root.slug;
                                            const subCategories = root.categories || [];
                                            const hasSubCategories = subCategories.length > 0;
                                            const isActive = activeCategory === categorySlug;

                                            return (
                                                <li key={root.name} className="border-b border-gray-100 last:border-b-0">
                                                    {hasSubCategories ? (
                                                        <button
                                                            onClick={() => openSubCategoryPanel(root)}
                                                            className={`w-full flex items-center justify-between px-5 py-4 text-left text-gray-700 hover:text-[var(--accent-color)] hover:bg-[color:var(--accent-color)]/10 transition-colors ${
                                                                isActive ? 'text-[var(--accent-color)] bg-[color:var(--accent-color)]/10 border-l-4 border-[var(--accent-color)]' : ''
                                                            }`}
                                                        >
                                                            <span className="font-medium">{root.name}</span>
                                                            {/* 右箭头 */}
                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path d="M9 18l6-6-6-6"/>
                                                            </svg>
                                                        </button>
                                                    ) : (
                                                        <Link
                                                            href={`/collections/${categorySlug}`}
                                                            className={`block px-5 py-4 text-gray-700 hover:text-[var(--accent-color)] hover:bg-[color:var(--accent-color)]/10 transition-colors no-underline ${
                                                                isActive ? 'text-[var(--accent-color)] bg-[color:var(--accent-color)]/10 border-l-4 border-[var(--accent-color)]' : ''
                                                            }`}
                                                            onClick={closeMobileNav}
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
                                className={`absolute inset-0 flex flex-col bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
                                    currentPanel === 'sub' ? 'translate-x-0' : 'translate-x-full'
                                } overflow-hidden`}
                            >
                                {/* 头部 */}
                                <div className="flex justify-between items-center p-5 border-b border-gray-200 flex-shrink-0 bg-white h-16">
                                    <button
                                        onClick={backToMainPanel}
                                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg transition-colors"
                                        aria-label="Back to main menu"
                                    >
                                        {/* 左箭头 */}
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 18l-6-6 6-6"/>
                                        </svg>
                                        Back
                                    </button>
                                    <button
                                        onClick={closeMobileNav}
                                        className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 6L6 18M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>

                                {/* 内容区域 */}
                                <div className="flex-1 overflow-y-auto bg-white">
                                    {currentRootCategory && (
                                        <ul className="py-2">
                                            {(currentRootCategory.categories || []).map((subCategory) => {
                                                const isSubActive = pathname.includes(subCategory.slug);

                                                return (
                                                    <li key={subCategory.slug} className="border-b border-gray-100 last:border-b-0">
                                                        <Link
                                                            href={`/collections/${subCategory.slug}`}
                                                            className={`block px-5 py-4 text-gray-700 hover:text-[var(--accent-color)] hover:bg-[color:var(--accent-color)]/10 transition-colors no-underline ${
                                                                isSubActive ? 'text-[var(--accent-color)] bg-[color:var(--accent-color)]/10 border-l-4 border-[var(--accent-color)]' : ''
                                                            }`}
                                                            onClick={closeMobileNav}
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
                )}

                {/* 购物车 */}
                <Cart
                    isOpen={isCartOpen}
                    onClose={closeCart}
                />
            </div>
        </>
    );
}