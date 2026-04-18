'use client';

import Link from 'next/link';
import { User, ShoppingBag, Heart, Search, LogOut, Package, Settings } from 'lucide-react';
import { useCartStore } from '@/stores/useCartStore';
import { useState, useEffect, useRef } from 'react';
import { Z_INDEX } from '@/lib/constants/z-index';
import SearchModal from '@/components/navigation/search-modal';
import { LoginResponse } from '@/types/auth';

interface UserActionsProps {
    isLoggedIn: boolean;
    userInfo: LoginResponse | null;
    onCartClick: () => void;
    onWishlistClick: (e: React.MouseEvent) => void;
    onAuthModalOpen: () => void;
    onLogout: () => void;
}

export default function UserActions({
                                        isLoggedIn,
                                        userInfo,
                                        onCartClick,
                                        onWishlistClick,
                                        onAuthModalOpen,
                                        onLogout
                                    }: UserActionsProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const userMenuRef = useRef<HTMLDivElement>(null);
    const totalItems = useCartStore(state => state.totalItems);

    // 获取用户首字母
    const getUserInitials = () => {
        if (!userInfo) return 'U';
        
        // 优先使用 displayName，其次使用 firstName + lastName
        if (userInfo.displayName) {
            return userInfo.displayName.charAt(0).toUpperCase();
        }
        
        const firstInitial = userInfo.firstName?.charAt(0) || '';
        const lastInitial = userInfo.lastName?.charAt(0) || '';
        
        return (firstInitial + lastInitial).toUpperCase() || 'U';
    };

    // 获取用户显示名称
    const getUserDisplayName = () => {
        if (!userInfo) return 'Account';
        
        if (userInfo.displayName) return userInfo.displayName;
        if (userInfo.firstName && userInfo.lastName) return `${userInfo.firstName} ${userInfo.lastName}`;
        if (userInfo.firstName) return userInfo.firstName;
        if (userInfo.lastName) return userInfo.lastName;
        
        // 如果都没有，显示邮箱前缀
        return userInfo.email?.split('@')[0] || 'Account';
    };

    useEffect(() => setIsMounted(true), []);

    // 点击外部关闭菜单
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex items-center gap-1 md:gap-3 relative z-50">

            {/* 1. Search Button */}
            <button
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={() => setIsSearchOpen(true)}
                aria-label="Search"
            >
                <Search size={22} strokeWidth={1.5} />
            </button>

            {/* 2. Wishlist Button */}
            <button
                className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-200"
                onClick={isLoggedIn ? undefined : onWishlistClick}
                aria-label="Wishlist"
            >
                {isLoggedIn ? (
                    <Link href="/wishlist" className="flex items-center justify-center w-full h-full">
                        <Heart size={22} strokeWidth={1.5} />
                    </Link>
                ) : (
                    <Heart size={22} strokeWidth={1.5} />
                )}
            </button>

            {/* 3. Cart Button */}
            <button
                className="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-all duration-200"
                onClick={onCartClick}
                aria-label="Shopping bag"
            >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {isMounted && totalItems > 0 && (
                    <span className="absolute top-1.5 right-1 bg-black text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full ring-2 ring-white">
                        {totalItems > 99 ? '99+' : totalItems}
                    </span>
                )}
            </button>

            {/* 4. User Menu Container (Relative Parent) */}
            <div className="relative" ref={userMenuRef}>
                {/* Avatar Button */}
                <button
                    className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border ${
                        isUserMenuOpen 
                            ? 'bg-black text-white border-black' 
                            : isLoggedIn 
                                ? 'bg-gradient-to-br from-[#C5A059] to-[#A08245] text-white border-[#C5A059] shadow-md hover:shadow-lg' 
                                : 'border-transparent text-gray-700 hover:text-black hover:bg-gray-100'
                    }`}
                    onClick={() => isLoggedIn ? setIsUserMenuOpen(!isUserMenuOpen) : onAuthModalOpen()}
                    aria-label="Account"
                >
                    {isLoggedIn ? (
                        <span className="text-sm font-bold">{getUserInitials()}</span>
                    ) : (
                        <User size={22} strokeWidth={1.5} />
                    )}
                </button>

                {/* Dropdown Menu (Absolute Position) */}
                {isLoggedIn && (
                    <div
                        className={`
                            absolute top-full right-0 mt-2 
                            /* ✅ 核心修复： */
                            /* !w-60: 强制宽度 240px */
                            /* !max-w-none: 强制解除父级宽度限制 */
                            !w-60 !max-w-none
                            bg-white rounded-xl shadow-xl border border-gray-100 py-2 
                            origin-top-right transition-all duration-200
                            ${isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}
                        `}
                        // ✅ Z-Index 60: 保证浮在导航栏(50)之上
                        style={{ zIndex: Z_INDEX.DROPDOWN }}
                    >
                        {/* 小三角 - 完美对齐头像中心 */}
                        <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                        <div className="relative bg-white rounded-xl overflow-hidden">
                            {/* 用户信息头部 */}
                            <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                                <div className="flex items-center gap-3">
                                    {/* 头像 */}
                                    <div className="w-10 h-10 bg-gradient-to-br from-[#C5A059] to-[#A08245] rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                                        <span className="text-sm font-bold text-white">{getUserInitials()}</span>
                                    </div>
                                    {/* 用户名和邮箱 */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-gray-900 truncate">
                                            {getUserDisplayName()}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">
                                            {userInfo?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                <Link
                                    href="/orders"
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors whitespace-nowrap"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Package size={18} strokeWidth={1.5} /> <span>My Orders</span>
                                </Link>
                                <Link
                                    href="/wishlist"
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors whitespace-nowrap"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Heart size={18} strokeWidth={1.5} /> <span>Wishlist</span>
                                </Link>
                                <Link
                                    href="/pages/about"
                                    className="flex items-center gap-3 px-5 py-3 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors whitespace-nowrap"
                                    onClick={() => setIsUserMenuOpen(false)}
                                >
                                    <Settings size={18} strokeWidth={1.5} /> <span>Support</span>
                                </Link>
                            </div>

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button
                                className="w-full text-left flex items-center gap-3 px-5 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors whitespace-nowrap"
                                onClick={() => {
                                    setIsUserMenuOpen(false);
                                    onLogout();
                                }}
                            >
                                <LogOut size={18} strokeWidth={1.5} /> <span>Log Out</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
}