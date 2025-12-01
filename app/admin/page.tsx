// /app/admin/page.tsx

'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    Menu,
    X,
    BarChart3,
    Settings,
    BookOpen // 新增图标
} from 'lucide-react'
export default function AdminDashboard() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [activeNav, setActiveNav] = useState('dashboard')
// 模拟数据
    const stats = [
        {
            title: '今日销售额',
            value: '¥12,426',
            change: '+12%',
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600'
        },
        {
            title: '总订单数',
            value: '1,248',
            change: '+8%',
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-blue-600'
        },
        {
            title: '商品数量',
            value: '856',
            change: '+3%',
            trend: 'up',
            icon: Package,
            color: 'text-purple-600'
        },
        {
            title: '用户数量',
            value: '12,846',
            change: '+5%',
            trend: 'up',
            icon: Users,
            color: 'text-orange-600'
        }
    ]

    const recentOrders = [
        { id: '#ORD-001', customer: '张三', amount: '¥299.00', status: '已完成', date: '2024-01-15' },
        { id: '#ORD-002', customer: '李四', amount: '¥156.00', status: '处理中', date: '2024-01-15' },
        { id: '#ORD-003', customer: '王五', amount: '¥499.00', status: '已完成', date: '2024-01-14' },
        { id: '#ORD-004', customer: '赵六', amount: '¥89.00', status: '待发货', date: '2024-01-14' },
        { id: '#ORD-005', customer: '钱七', amount: '¥234.00', status: '已完成', date: '2024-01-13' }
    ]

// 更新导航菜单，加入博客管理
    const navigation = [
        { name: '仪表盘', href: '/admin', icon: BarChart3, current: true },
        { name: '商品管理', href: '/admin/product', icon: Package, current: false },
        { name: '订单管理', href: '#', icon: ShoppingCart, current: false },
        { name: '用户管理', href: '#', icon: Users, current: false },
        { name: '博客管理', href: '/admin/blog', icon: BookOpen, current: false }, // 新增
        { name: '系统设置', href: '#', icon: Settings, current: false }
    ]

// 侧边栏内容组件 (复用)
    const SidebarContent = () => (
        <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
                <ShoppingCart className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold">电商管理后台</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                            item.current
                                ? 'bg-gray-100 text-gray-900'
                                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)} // 移动端点击后关闭侧边栏
                    >
                        <item.icon className="mr-4 flex-shrink-0 h-6 w-6" />
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 侧边栏 - 移动端 */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${sidebarOpen ? '' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
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

            {/* 侧边栏 - 桌面端 */}
            <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
                <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
                    <SidebarContent />
                </div>
            </div>

            {/* 主内容区域 */}
            <div className="md:pl-64 flex flex-col flex-1">
                {/* 顶部导航栏 (汉堡菜单) */}
                <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100">
                    <button
                        className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                <main className="flex-1">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
                        </div>

                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            {/* 统计卡片 */}
                            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                                {stats.map((stat) => (
                                    <div key={stat.title} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
                                        <div className="p-5">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                                </div>
                                                <div className="ml-5 w-0 flex-1">
                                                    <dl>
                                                        <dt className="text-sm font-medium text-gray-500 truncate">
                                                            {stat.title}
                                                        </dt>
                                                        <dd className="flex items-baseline">
                                                            <div className="text-2xl font-semibold text-gray-900">
                                                                {stat.value}
                                                            </div>
                                                            <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                                                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                            }`}>
                                                                <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                                                                <span className="ml-1">{stat.change}</span>
                                                            </div>
                                                        </dd>
                                                    </dl>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 图表和订单区域 */}
                            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
                                {/* 销售图表 */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">销售趋势</h3>
                                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border border-dashed border-gray-200">
                                        <p className="text-gray-500">销售图表组件区域</p>
                                    </div>
                                </div>

                                {/* 最近订单 */}
                                <div className="bg-white shadow rounded-lg p-6">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">最近订单</h3>
                                        <button className="text-sm text-blue-600 hover:text-blue-800">查看全部</button>
                                    </div>
                                    <div className="overflow-hidden">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    订单号
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    客户
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    金额
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    状态
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-200">
                                            {recentOrders.map((order) => (
                                                <tr key={order.id} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {order.customer}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                        {order.amount}
                                                    </td>
                                                    <td className="px-4 py-3 whitespace-nowrap">
                          <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                              order.status === '已完成'
                                  ? 'bg-green-100 text-green-800'
                                  : order.status === '处理中'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                          }`}>
                            {order.status}
                          </span>
                                                    </td>
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}