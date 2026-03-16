'use client' // 👈 必须放在第一行，解决你截图中的报错

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/authContext' // 确保路径正确
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
    Loader2
} from 'lucide-react'

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()

    // 从鉴权上下文获取状态
    const { isLoggedIn, isClient, userInfo } = useAuth()

    // --- 鉴权守卫：未登录则重定向 ---
    useEffect(() => {
        if (isClient && isLoggedIn) {
            // 假设 LoginResponse 中包含 roles 数组
            const isAdmin = userInfo?.id === 2;

            if (!isAdmin) {
                router.push('/403'); // 无权访问页面
            }
        } else if (isClient && !isLoggedIn) {
            router.push('/login?redirect=/admin');
        }
    }, [isLoggedIn, isClient, userInfo, router]);

    // 导航配置
    const navigation = [
        { name: '仪表盘', href: '/admin', icon: BarChart3 },
        { name: '商品管理', href: '/admin/product', icon: Package },
        { name: '订单管理', href: '/admin/order', icon: ShoppingCart },
        { name: '用户管理', href: '/admin/user', icon: Users },
        { name: '评论管理', href: '/admin/review', icon: MessageSquare },
        { name: '博客管理', href: '/admin/blog', icon: BookOpen },
        { name: '系统设置', href: '/admin/settings', icon: Settings },
    ]

    // 如果还在加载中或未登录，显示加载动画，防止后台内容闪现
    if (!isClient || !isLoggedIn) {
        return (
            <div className="h-screen w-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="h-10 w-10 animate-spin text-gray-900" />
                <p className="mt-4 text-gray-500 font-medium">loading...</p>
            </div>
        )
    }

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