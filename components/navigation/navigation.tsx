// components/navigation/navigation.tsx (简化版本)
'use client';

import Link from 'next/link';
import MainCategory from '@/components/navigation/main-category';
import UserActions from '@/components/common/user-actions';
import Cart from '@/components/common/cart';
import MinimalNavigation from '@/components/navigation/minimal-navigation';
import MobileNavigation from '@/components/navigation/mobile-navigation';
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
        toggleCart();
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
                                <MainCategory rootsData={rootsData} />
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

                {/* 移动端导航侧边栏 */}
                {isMounted && (
                    <MobileNavigation
                        isOpen={isMobileNavOpen}
                        onClose={closeMobileNav}
                        rootsData={rootsData}
                        currentPanel={currentPanel}
                        currentRootCategory={currentRootCategory}
                        onBackToMain={backToMainPanel}
                        onOpenSubCategory={openSubCategoryPanel}
                        activeCategory={activeCategory}
                    />
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