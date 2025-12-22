// app/admin/layout.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation' // 用于判断当前路由
import {
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    Settings,
    BookOpen,
    Menu,
    X
} from 'lucide-react'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname() // 获取当前路径

    // 导航配置
    const navigation = [
        { name: '仪表盘', href: '/admin', icon: BarChart3 },
        { name: '商品管理', href: '/admin/product', icon: Package },
        { name: '订单管理', href: '/admin/order', icon: ShoppingCart },
        { name: '用户管理', href: '/admin/user', icon: Users }, // 修正了 href
        { name: '博客管理', href: '/admin/blog', icon: BookOpen },
        { name: '系统设置', href: '/admin/settings', icon: Settings }, // 修正了 href
    ]

    // 判断链接是否激活（完全匹配或子路径匹配，排除根路径重复匹配）
    const isLinkActive = (href: string) => {
        if (href === '/admin') {
            return pathname === '/admin';
        }
        return pathname.startsWith(href);
    };

    // 侧边栏内容组件
    const SidebarContent = () => (
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto bg-white border-r border-gray-200">
            <div className="flex-shrink-0 flex items-center px-4 mb-6">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">电商后台</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => {
                    const active = isLinkActive(item.href);
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`group flex items-center px-2 py-2 text-base font-medium rounded-md transition-colors ${
                                active
                                    ? 'bg-indigo-50 text-indigo-600 border-r-4 border-indigo-600'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            }`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon
                                className={`mr-4 flex-shrink-0 h-5 w-5 ${
                                    active ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                                }`}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100 font-sans">
            {/* --- 移动端侧边栏 (遮罩 + 抽屉) --- */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 md:hidden">
                    {/* 背景遮罩 */}
                    <div
                        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity"
                        onClick={() => setSidebarOpen(false)}
                    />

                    {/* 侧边栏面板 */}
                    <div className="fixed inset-y-0 left-0 flex flex-col z-40 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
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

            {/* --- 桌面端侧边栏 (固定) --- */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <SidebarContent />
            </div>

            {/* --- 主内容区域 --- */}
            <div className="md:pl-64 flex flex-col flex-1 w-0">
                {/* 顶部汉堡菜单按钮 (仅移动端显示) */}
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* 页面具体内容 (Page Component 会在这里渲染) */}
                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    {children}
                </main>
            </div>
        </div>
    )
}