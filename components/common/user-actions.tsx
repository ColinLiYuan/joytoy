'use client';

import Link from 'next/link';
import { User, ShoppingBag, Heart } from 'lucide-react'; // ✅ Lucide
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

    useEffect(() => setIsMounted(true), []);

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
        <div className="flex items-center gap-2 md:gap-4">
            {/* Wishlist */}
            <button
                className="w-10 h-10 flex items-center justify-center text-gray-800 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-200"
                onClick={isLoggedIn ? undefined : onWishlistClick}
                aria-label="Wishlist"
            >
                {isLoggedIn ? (
                    <Link href="/wishlist">
                        <Heart size={22} strokeWidth={1.5} />
                    </Link>
                ) : (
                    <Heart size={22} strokeWidth={1.5} />
                )}
            </button>

            {/* Cart */}
            <button
                className="relative w-10 h-10 flex items-center justify-center text-gray-800 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-200"
                onClick={onCartClick}
                aria-label="Shopping bag"
            >
                <ShoppingBag size={22} strokeWidth={1.5} />
                {isMounted && totalItems > 0 && (
                    <span className="absolute top-1.5 right-1.5 bg-black text-white text-[10px] font-bold h-4 min-w-[16px] px-1 flex items-center justify-center rounded-full ring-2 ring-white">
                        {totalItems > 99 ? '99+' : totalItems}
                    </span>
                )}
            </button>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
                <button
                    className="w-10 h-10 flex items-center justify-center text-gray-800 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-200"
                    onClick={isLoggedIn ? () => setIsUserMenuOpen(!isUserMenuOpen) : onAuthModalOpen}
                    aria-label="Account"
                >
                    <User size={22} strokeWidth={1.5} />
                </button>

                {/* Dropdown */}
                {isLoggedIn && (
                    <div className={`absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 origin-top-right ${
                        isUserMenuOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'
                    }`}>
                        <Link href="/orders" className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600">My Orders</Link>
                        <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600">Wishlist</Link>
                        <div className="h-px bg-gray-100 my-1"></div>
                        <button
                            className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:bg-pink-50 hover:text-pink-600"
                            onClick={onLogout}
                        >
                            Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}