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
import { useState, useEffect, useRef } from 'react';

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
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const totalItems = useCartStore(state => state.totalItems);
    const isLoadingCart = useCartStore(state => state.loading);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 点击外部关闭用户菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 只在客户端计算徽章文本
    const badgeText = isMounted && totalItems > 0
        ? (totalItems > 99 ? '99+' : totalItems.toString())
        : '';

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const handleUserMenuOpen = () => {
        setIsUserMenuOpen(true);
    };

    const handleUserMenuClose = () => {
        setIsUserMenuOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        setIsUserMenuOpen(false);
    };

    const handleMenuLinkClick = () => {
        setIsUserMenuOpen(false);
    };

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
            <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={handleUserMenuOpen}
                onMouseLeave={handleUserMenuClose}
            >
                {isLoggedIn ? (
                    <div className="relative">
                        <button
                            className="w-8 h-8 flex items-center justify-center text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] rounded-full transition-colors cursor-pointer"
                            aria-label="User account"
                            onClick={handleUserMenuToggle}
                        >
                            <FontAwesomeIcon icon={faUserCircle} className="w-3.5 h-3.5" />
                        </button>
                        <div className={`absolute top-full right-0 bg-white rounded-xl shadow-lg py-2 min-w-[160px] z-50 ${
                            isUserMenuOpen
                                ? 'opacity-100 visible translate-y-0'
                                : 'opacity-0 invisible -translate-y-2'
                        } transition-all duration-300`}>
                            <Link
                                href="/orders"
                                className="block px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm"
                                onClick={handleMenuLinkClick}
                            >
                                Orders
                            </Link>
                            <Link
                                href="/wishlist"
                                className="block px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm"
                                onClick={handleMenuLinkClick}
                            >
                                Wishlist
                            </Link>
                            <button
                                className="w-full text-left px-3 py-2 text-gray-700 hover:text-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color)_10%,transparent)] transition-colors text-sm border-t border-gray-100 mt-1"
                                onClick={handleLogout}
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