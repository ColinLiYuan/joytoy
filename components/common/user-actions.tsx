'use client';

import Link from 'next/link';
import { User, ShoppingBag, Heart, Search, LogOut, Package, Settings } from 'lucide-react'; // ✅ Lucide
import { useCartStore } from '@/stores/useCartStore';
import { useState, useEffect, useRef } from 'react';
import { Z_INDEX } from '@/lib/constants/z-index';
import SearchModal from '@/components/navigation/search-modal'; // ✅ 引入搜索

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
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const userMenuRef = useRef<HTMLDivElement>(null);
    const totalItems = useCartStore(state => state.totalItems);

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
        <div className="flex items-center gap-1 md:gap-3">

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

            {/* 4. User Menu (Dropdown) */}
            <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={() => setIsUserMenuOpen(true)}
                onMouseLeave={() => setIsUserMenuOpen(false)}
            >
                <button
                    className="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-all duration-200"
                    onClick={isLoggedIn ? undefined : onAuthModalOpen}
                    aria-label="Account"
                >
                    <User size={22} strokeWidth={1.5} />
                </button>

                {/* Dropdown Menu */}
                {isLoggedIn && (
                    <div
                        className={`absolute top-full right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 transition-all duration-200 origin-top-right ${
                            isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                        }`}
                        style={{ zIndex: Z_INDEX.DROPDOWN }} // ✅ 60，高于导航栏
                    >
                        {/* 小三角 */}
                        <div className="absolute -top-1.5 right-3.5 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>

                        <div className="relative bg-white rounded-xl overflow-hidden">
                            <div className="px-4 py-3 border-b border-gray-50 bg-gray-50/50">
                                <p className="text-xs text-gray-500">Signed in as</p>
                                <p className="text-sm font-bold text-gray-900 truncate">My Account</p>
                            </div>

                            <Link href="/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                                <Package size={16} /> My Orders
                            </Link>
                            <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-pink-600 transition-colors">
                                <Heart size={16} /> Wishlist
                            </Link>
                            <Link href="/pages/about" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-black transition-colors">
                                <Settings size={16} /> Support
                            </Link>

                            <div className="h-px bg-gray-100 my-1"></div>

                            <button
                                className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={onLogout}
                            >
                                <LogOut size={16} /> Log Out
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />
        </div>
    );
}