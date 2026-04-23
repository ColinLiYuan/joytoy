'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingCart, Wallet, Settings, LogOut, LinkIcon, Menu, X, ArrowLeft, DollarSign } from 'lucide-react'
import { useAuth } from '@/contexts/authContext'

export default function AffiliateLayoutClient({ children }: { children: React.ReactNode }) {
    const { userInfo, logout } = useAuth()
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const navItems = [
        { label: 'Dashboard', href: '/affiliate', icon: LayoutDashboard },
        { label: 'Orders', href: '/affiliate/order', icon: ShoppingCart },
        { label: 'Commission History', href: '/affiliate/commission', icon: DollarSign },
        { label: 'Payouts', href: '/affiliate/payouts', icon: Wallet },
        { label: 'Promote Links', href: '/affiliate/links', icon: LinkIcon },
    ]

    const handleLogout = () => {
        logout()
        router.push('/')
    }

    const affiliateId = (userInfo?.affiliateId || "PENDING").toUpperCase()

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 z-50">
                <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2">
                    <Menu className="h-5 w-5" />
                </button>
                <span className="text-lg font-black tracking-tighter italic">AFFILIATE HUB</span>
                <Link href="/" className="p-2 -mr-2 text-gray-500">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
            </div>

            {/* Overlay */}
            {sidebarOpen && (
                <div 
                    className="md:hidden fixed inset-0 bg-black/50 z-40" 
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed md:relative top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 flex flex-col z-50 transition-transform duration-200
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            `}>
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <span className="text-xl font-black tracking-tighter italic">AFFILIATE HUB</span>
                    <button onClick={() => setSidebarOpen(false)} className="md:hidden p-1">
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setSidebarOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-black transition-colors"
                        >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 w-full hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col pt-14 md:pt-0">
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                        <span>Welcome back,</span>
                        <span className="text-black font-bold">{affiliateId}</span>
                    </div>
                </header>
                <div className="p-8 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
