'use client';

import Link from 'next/link';
import Image from 'next/image'; // ✅ 引入 Image
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
import { Menu } from 'lucide-react';
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
    const getCart = useCartStore(state => state.getCart);
    const cartOpenRequest = useCartStore(state => state.cartOpenRequest);
    const clearCartOpenRequest = useCartStore(state => state.clearCartOpenRequest);
    const { isLoggedIn, userInfo, openAuthModal, logout } = useAuth();

    useEffect(() => setIsMounted(true), []);

    // ✅ 加购成功后自动弹出购物车抽屉（一次性事件，消费后立即清除，避免路由切换时再次弹出）
    useEffect(() => {
        if (cartOpenRequest) {
            setIsCartOpen(true);
            clearCartOpenRequest();
        }
    }, [cartOpenRequest, clearCartOpenRequest]);

    // ✅ 购物车获取由 cart-sync.tsx 统一管理，这里不再重复调用
    // useEffect(() => {
    //     if (isLoggedIn) {
    //         getCart().catch(console.error);
    //     }
    // }, [isLoggedIn, getCart]);

    useEffect(() => {
        document.body.style.overflow = isMobileNavOpen ? 'hidden' : 'unset';
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobileNavOpen]);

    const toggleCart = async () => {
        // ✅ 打开购物车时始终刷新数据（确保最新）
        if (!isCartOpen) {
            await getCart().catch(console.error);
        }
        setIsCartOpen(!isCartOpen);
    };

    const closeMobileNav = () => {
        setIsMobileNavOpen(false);
        setTimeout(() => {
            setCurrentPanel('main');
            setCurrentRootCategory(null);
        }, 300);
    };

    const openSubCategoryPanel = (root: RootResponse) => {
        if (root.categories && root.categories.length > 0) {
            setCurrentRootCategory(root);
            setCurrentPanel('sub');
        } else {
            closeMobileNav();
        }
    };

    if (minimal || isCheckoutPage) {
        return <MinimalNavigation />;
    }

    return (
        <>
            <div
                className="relative w-full bg-white border-b border-gray-100 shadow-sm"
                style={{ zIndex: Z_INDEX.NAVIGATION }}
            >
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex justify-between items-center h-16 lg:h-20">

                        {/* Logo 区域 */}
                        <Link href="/" className="flex-shrink-0 group relative flex items-center">
                            {/* ✅ 替换文字为图片 */}
                            {/* w-36 h-8 控制显示大小，根据你 SVG 的长宽比微调 */}
                            <div className="relative w-28 h-7 sm:w-36 sm:h-8 lg:w-40 lg:h-10">
                                <Image
                                    src="/logo.svg"
                                    alt="MythToy Logo"
                                    fill
                                    className="object-contain object-left"
                                    priority // 优先加载 LCP
                                />
                            </div>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex flex-1 justify-center px-4">
                            <MainCategory rootsData={rootsData} />
                        </div>

                        {/* Right Actions */}
                        <div className="flex items-center gap-1 sm:gap-2">
                            <UserActions
                                isLoggedIn={isLoggedIn}
                                userInfo={userInfo}
                                onCartClick={toggleCart}
                                onWishlistClick={(e) => {
                                    e.preventDefault();
                                    if (!isLoggedIn) openAuthModal('login', { onSuccess: () => window.location.href = '/wishlist' });
                                    else window.location.href = '/wishlist';
                                }}
                                onAuthModalOpen={() => openAuthModal('login')}
                                onLogout={() => { logout(); setIsCartOpen(false); }}
                            />

                            {/* Mobile Hamburger */}
                            <div className="lg:hidden ml-2">
                                <button
                                    onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                                    className="p-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors"
                                    aria-label="Toggle menu"
                                >
                                    <Menu size={24} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Components */}
                {isMounted && (
                    <MobileNavigation
                        isOpen={isMobileNavOpen}
                        onClose={closeMobileNav}
                        rootsData={rootsData}
                        currentPanel={currentPanel}
                        currentRootCategory={currentRootCategory}
                        onBackToMain={() => { setCurrentPanel('main'); setCurrentRootCategory(null); }}
                        onOpenSubCategory={openSubCategoryPanel}
                    />
                )}

                <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            </div>
        </>
    );
}