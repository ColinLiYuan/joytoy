// components/policy-nav.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PolicyNav() {
    const pathname = usePathname();

    const links = [
        { href: '/pages/privacy-policy', label: 'Privacy Policy' },
        { href: '/pages/terms-and-conditions', label: 'Terms of Service' },
        { href: '/pages/shipping-policy', label: 'Shipping' },
        { href: '/pages/return-refund', label: 'Returns' },
        { href: '/pages/cookie-policy', label: 'Cookies' },
        { href: '/pages/payment-policy', label: 'Payments' },
        { href: '/pages/affiliate', label: 'Affiliate' }, // 新增联盟入口
    ];

    return (
        <nav className="mb-12 border-b border-gray-100 flex justify-center">
            <div className="flex gap-8 overflow-x-auto no-scrollbar pb-0">
                {links.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={`text-[13px] font-medium transition-all pb-4 border-b-2 tracking-wide ${
                                isActive
                                    ? 'text-black border-black'
                                    : 'text-gray-400 border-transparent hover:text-black'
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