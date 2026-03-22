// app/affiliate/layout.tsx
import Link from 'next/link'
import { LayoutDashboard, ShoppingCart, Wallet, Settings, LogOut, LinkIcon } from 'lucide-react'

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
    const navItems = [
        // { label: 'Dashboard', href: '/affiliate', icon: LayoutDashboard },
        { label: 'Orders', href: '/affiliate/order', icon: ShoppingCart },
        { label: 'Promote Links', href: '/affiliate/links', icon: LinkIcon },
        // { label: 'Payouts', href: '/affiliate/payout', icon: Wallet },
        // { label: 'Settings', href: '/affiliate/settings', icon: Settings },
    ]

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-200">
                    <span className="text-xl font-black tracking-tighter italic">AFFILIATE HUB</span>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                {/*<div className="p-4 border-t border-gray-200">*/}
                {/*    <button className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 w-full hover:bg-red-50 rounded-lg">*/}
                {/*        <LogOut className="h-4 w-4" /> Sign Out*/}
                {/*    </button>*/}
                {/*</div>*/}
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="text-sm font-medium text-gray-500">Welcome back, <span className="text-black">XX</span></div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs text-gray-400 uppercase font-bold">Balance</div>
                            <div className="text-sm font-black text-green-600">$0</div>
                        </div>
                    </div>
                </header>
                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}