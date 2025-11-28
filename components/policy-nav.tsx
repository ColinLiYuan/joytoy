// components/policy-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PolicyNav() {
    const pathname = usePathname();

    // 确保这里的 href 与你文件系统的路由结构一致
    const links = [
        { href: '/pages/privacy-policy', label: 'Privacy Policy' },
        { href: '/pages/terms-and-conditions', label: 'Terms of Service' },
        { href: '/pages/shipping-policy', label: 'Shipping' },
        { href: '/pages/return-refund', label: 'Returns' },
        { href: '/pages/cookie-policy', label: 'Cookies' },
        { href: '/pages/payment-policy', label: 'Payments' },
    ];

    return (
        <nav className="mb-8 border-b border-gray-200 overflow-x-auto">
            <div className="flex gap-6 min-w-max pb-1">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-sm font-medium transition-colors pb-3 border-b-2 ${
                                isActive
                                    ? 'text-black border-black'
                                    : 'text-gray-500 border-transparent hover:text-black hover:border-gray-300'
                            }`}
                        >
                            {link.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}