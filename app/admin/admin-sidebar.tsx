'use client';

import Link from 'next/link';
import {
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    BookOpen,
    MessageSquare,
    TrendingUp
} from 'lucide-react';

interface SidebarContentProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: SidebarContentProps) {
    return <SidebarContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

function SidebarContent({ sidebarOpen, setSidebarOpen }: SidebarContentProps) {

    // 导航配置
    const navigation = [
        { name: '仪表盘', href: '/admin', icon: BarChart3 },
        { name: '商品管理', href: '/admin/product', icon: Package },
        { name: '订单管理', href: '/admin/order', icon: ShoppingCart },
        { name: '联盟管理', href: '/admin/affiliate', icon: TrendingUp },
        { name: '用户管理', href: '/admin/user', icon: Users },
        { name: '评论管理', href: '/admin/review', icon: MessageSquare },
        { name: '博客管理', href: '/admin/blog', icon: BookOpen },
    ];

    return (
        <>
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
                                <span className="sr-only">Close sidebar</span>
                                <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <SidebarNav navigation={navigation} />
                    </div>
                </div>
            )}

            {/* 桌面端固定侧边栏 */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-lg z-20">
                <SidebarNav navigation={navigation} />
            </div>
        </>
    );
}

function SidebarNav({ navigation }: { navigation: any[] }) {
    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gray-900">
                <span className="text-xl font-bold text-white tracking-wider">管理后台</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navigation.map((item) => {
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                            >
                                <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </div>
    );
}
