// components/common/user-actions.tsx
'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faUser,
    faShoppingCart,
    faHeart,
    faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { useCartStore } from '@/stores/useCartStore';
import { useState, useEffect } from 'react';

interface UserActionsProps {
    isLoggedIn: boolean;
    onCartClick: () => void;
    onWishlistClick: (e: React.MouseEvent) => void;
    onAuthModalOpen: () => void;
    onLogout: () => void;
}

export default function UserActions({
                                        isLoggedIn,
                                        onCartClick,
                                        onWishlistClick,
                                        onAuthModalOpen,
                                        onLogout
                                    }: UserActionsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const totalItems = useCartStore(state => state.totalItems);
    const isLoadingCart = useCartStore(state => state.loading);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 只在客户端计算徽章文本
    const badgeText = isMounted && totalItems > 0
        ? (totalItems > 99 ? '99+' : totalItems.toString())
        : '';

    return (
        <div className="flex items-center gap-1">
            {/* 愿望清单 */}
            {isLoggedIn ? (
                <Link
                    href="/wishlist"
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--danger-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors cursor-pointer"
                    aria-label="Wishlist"
                >
                    <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                </Link>
            ) : (
                <button
                    className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--danger-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors cursor-pointer"
                    aria-label="Wishlist"
                    onClick={onWishlistClick}
                    title="Login to view wishlist"
                >
                    <FontAwesomeIcon icon={faHeart} className="w-3.5 h-3.5" />
                </button>
            )}

            {/* 购物车 */}
            <button
                className="relative w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors disabled:opacity-50 cursor-pointer"
                onClick={onCartClick}
                aria-label="Shopping cart"
                disabled={isLoadingCart}
            >
                <FontAwesomeIcon icon={faShoppingCart} className="w-3.5 h-3.5" />
                {/* 徽章 - 只在有内容时渲染 */}
                {badgeText && (
                    <span
                        className="absolute -top-1 -right-1 bg-[var(--danger-color)] text-white text-xs rounded-full w-3.5 h-3.5 flex items-center justify-center font-semibold text-[9px]"
                    >
                        {badgeText}
                    </span>
                )}
            </button>

            {/* 用户账户 */}
            <div className="relative">
                {isLoggedIn ? (
                    <div className="group relative">
                        <button
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors cursor-pointer"
                            aria-label="User account"
                        >
                            <FontAwesomeIcon icon={faUserCircle} className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute top-full right-0 bg-white rounded-xl shadow-lg py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
                            <Link href="/account" className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm">
                                <FontAwesomeIcon icon={faUser} className="w-3 h-3" />
                                My Account
                            </Link>
                            <Link href="/orders" className="block px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm">
                                Orders
                            </Link>
                            <Link href="/wishlist" className="block px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm">
                                Wishlist
                            </Link>
                            <button
                                className="w-full text-left px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm border-t border-gray-100 mt-1"
                                onClick={onLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors cursor-pointer"
                        aria-label="Login"
                        onClick={onAuthModalOpen}
                    >
                        <FontAwesomeIcon icon={faUser} className="w-3.5 h-3.5" />
                    </button>
                )}
            </div>
        </div>
    );
}