'use client';

import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function MinimalNavigation() {
    return (
        <header className="bg-white border-b border-gray-100 py-4">
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors text-sm font-medium">
                    <ChevronLeft size={16} />
                    Back to Home
                </Link>

                <Link href="/" className="text-xl font-bold text-gray-900 font-['Playfair_Display'] absolute left-1/2 -translate-x-1/2">
                    MythToy
                </Link>

                <div className="w-20" /> {/* Spacer */}
            </div>
        </header>
    );
}