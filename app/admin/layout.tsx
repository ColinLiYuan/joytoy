'use client' // 👈 必须放在第一行，解决你截图中的报错

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    Settings,
    BookOpen,
    Menu,
    X,
    MessageSquare,
    TrendingUp
} from 'lucide-react'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    // ✅ 简化：不再需要鉴权逻辑，由中间件保护
    // 如果用户能访问到这里，说明已经有管理员权限了

    // 导航配置
    const navigation = [
        { name: '仪表盘', href: '/admin', icon: BarChart3 },
        { name: '商品管理', href: '/admin/product', icon: Package },
        { name: '订单管理', href: '/admin/order', icon: ShoppingCart },
        { name: '联盟管理', href: '/admin/affiliate', icon: TrendingUp },
        { name: '用户管理', href: '/admin/user', icon: Users },
        { name: '评论管理', href: '/admin/review', icon: MessageSquare },
        { name: '博客管理', href: '/admin/blog', icon: BookOpen },
        { name: '系统设置', href: '/admin/settings', icon: Settings },
    ]

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gray-900">
                <span className="text-xl font-bold text-white tracking-wider">管理后台</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gray-900 text-white shadow-md'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                            >
                                <item.icon
                                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                                        isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-500'
                                    }`}
                                />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-gray-100 flex overflow-hidden">
            {/* 移动端抽屉菜单 */}
            {sidebarOpen && (
                <div className="fixed inset-0 flex z-40 md:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                    <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white focus:outline-none">
                        <div className="absolute top-0 right-0 -mr-12 pt-2">
                            <button
                                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                                onClick={() => setSidebarOpen(false)}
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>
                        </div>
                        <SidebarContent />
                    </div>
                </div>
            )}

            {/* 桌面端固定侧边栏 */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-lg z-20">
                <SidebarContent />
            </div>

            <div className="md:pl-64 flex flex-col flex-1 w-0">
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100/80 backdrop-blur-md">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                    <div className="py-6 px-4 sm:px-6 md:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}