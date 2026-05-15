'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    BookOpen,
    MessageSquare,
    TrendingUp,
    CreditCard,
    ChevronDown,
    History,
    Tag,
    Truck,
    Warehouse,
    Layers
} from 'lucide-react';

interface SidebarContentProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
}

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: SidebarContentProps) {
    return <SidebarContent sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

function SidebarContent({ sidebarOpen, setSidebarOpen }: SidebarContentProps) {
    const pathname = usePathname()

    // 导航配置（按业务逻辑分组）
    const navigation = [
        // 核心业务
        { name: '仪表盘', href: '/admin', icon: BarChart3 },
        { name: '商品管理', href: '/admin/product', icon: Package },
        { name: '套装管理', href: '/admin/bundle', icon: Layers },
        { name: '订单管理', href: '/admin/order', icon: ShoppingCart },
        { name: '用户管理', href: '/admin/user', icon: Users },
        { name: '购物车管理', href: '/admin/cart', icon: CreditCard },
        { name: '优惠券管理', href: '/admin/coupon', icon: Tag },
        
        // 库存与采购
        { 
            name: '库存管理', 
            href: '/admin/warehouse-inventory',
            icon: Warehouse,
            children: [
                { name: '仓库库存', href: '/admin/warehouse-inventory' },
                { name: '库存流水', href: '/admin/inventory-logs' }
            ]
        },
        { name: '采购管理', href: '/admin/purchase-records', icon: Truck },
        
        // 营销与推广
        { 
            name: '联盟管理', 
            href: '/admin/affiliate',
            icon: TrendingUp,
            children: [
                { name: '数据统计', href: '/admin/affiliate/stats' },
                { name: '成员列表', href: '/admin/affiliate' },
                { name: '提现管理', href: '/admin/affiliate/payouts' }
            ]
        },
        
        // 内容与互动
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
                        <SidebarNav navigation={navigation} pathname={pathname} />
                    </div>
                </div>
            )}

            {/* 桌面端固定侧边栏 */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 shadow-lg z-20">
                <SidebarNav navigation={navigation} pathname={pathname} />
            </div>
        </>
    );
}

function SidebarNav({ navigation, pathname }: { navigation: any[]; pathname: string }) {
    // 管理展开状态：key 是菜单名称，value 是是否展开
    const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
        // 初始化时，如果当前路径匹配某个有子菜单的项，自动展开
        const initialExpanded: Record<string, boolean> = {};
        navigation.forEach(item => {
            if (item.children && (pathname === item.href || pathname.startsWith(item.href))) {
                initialExpanded[item.name] = true;
            }
        });
        return initialExpanded;
    });

    const toggleMenu = (menuName: string) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuName]: !prev[menuName]
        }));
    };

    return (
        <div className="flex flex-col h-full bg-white border-r border-gray-200">
            <div className="flex items-center h-16 flex-shrink-0 px-6 bg-gray-900">
                <span className="text-xl font-bold text-white tracking-wider">管理后台</span>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.children && pathname.startsWith(item.href))
                        const isExpanded = expandedMenus[item.name] || false;
                        
                        if (item.children) {
                            // 有子菜单的项目 - 点击展开/收起
                            return (
                                <div key={item.name}>
                                    <button
                                        onClick={() => toggleMenu(item.name)}
                                        className={`w-full group flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                            isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                    >
                                        <div className="flex items-center">
                                            <item.icon className="mr-3 flex-shrink-0 h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                                            {item.name}
                                        </div>
                                        <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </button>
                                    <div className={`overflow-hidden transition-all duration-200 ${isExpanded ? 'max-h-96 mt-1' : 'max-h-0'}`}>
                                        <div className="ml-8 space-y-1">
                                            {item.children.map((child: any) => {
                                                const isChildActive = pathname === child.href
                                                return (
                                                    <Link
                                                        key={child.name}
                                                        href={child.href}
                                                        className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                                            isChildActive
                                                                ? 'bg-black text-white font-medium'
                                                                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                                        }`}
                                                    >
                                                        {child.name}
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        
                        // 没有子菜单的项目
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                    isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
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
