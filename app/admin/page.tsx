// /app/admin/page.tsx
'use client'

import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    Ban,
    RotateCcw
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDashboardStats, getRecentOrders } from '@/app/actions/admin'

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    const [stats, setStats] = useState<any>(null)
    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                
                // ✅ 使用 Server Action 获取数据（避免 Token 竞态问题）
                const dashboardStats = await getDashboardStats()
                const recentOrdersData = await getRecentOrders(5)
                
                setStats(dashboardStats)
                setRecentOrders(recentOrdersData)
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                    <div className="animate-pulse space-y-8">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="bg-white shadow rounded-lg p-5">
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const displayStats = stats || {
        todaySales: 0,
        totalOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        cancelledOrders: 0,
        refundedOrders: 0,
        cancelledAmount: 0,
        refundedAmount: 0,
        salesChange: '+0%',
        ordersChange: '+0%',
        productsChange: '+0%',
        usersChange: '+0%'
    }

    const statCards = [
        {
            title: '今日销售额',
            value: `¥${displayStats.todaySales.toFixed(2)}`,
            change: displayStats.salesChange,
            trend: 'up',
            icon: DollarSign,
            color: 'text-green-600'
        },
        {
            title: '总订单数',
            value: displayStats.totalOrders.toString(),
            change: displayStats.ordersChange,
            trend: 'up',
            icon: ShoppingCart,
            color: 'text-blue-600'
        },
        {
            title: '商品数量',
            value: displayStats.totalProducts.toString(),
            change: displayStats.productsChange,
            trend: 'up',
            icon: Package,
            color: 'text-purple-600'
        },
        {
            title: '用户数量',
            value: displayStats.totalUsers.toString(),
            change: displayStats.usersChange,
            trend: 'up',
            icon: Users,
            color: 'text-orange-600'
        },
        {
            title: '已取消订单',
            value: displayStats.cancelledOrders.toString(),
            subValue: `金额: ¥${displayStats.cancelledAmount.toFixed(2)}`,
            icon: Ban,
            color: 'text-gray-600'
        },
        {
            title: '已退款订单',
            value: displayStats.refundedOrders.toString(),
            subValue: `金额: ¥${displayStats.refundedAmount.toFixed(2)}`,
            icon: RotateCcw,
            color: 'text-red-600'
        }
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED':
            case '已完成':
                return 'bg-green-100 text-green-800'
            case 'PROCESSING':
            case '处理中':
                return 'bg-yellow-100 text-yellow-800'
            case 'PENDING':
            case '待发货':
                return 'bg-blue-100 text-blue-800'
            case 'CANCELLED':
            case '已取消':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getStatusText = (status: string) => {
        const statusMap: Record<string, string> = {
            'PENDING': '待处理',
            'PROCESSING': '处理中',
            'SHIPPED': '已发货',
            'DELIVERED': '已送达',
            'COMPLETED': '已完成',
            'CANCELLED': '已取消',
            'REFUNDED': '已退款'
        }
        return statusMap[status] || status
    }

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 统计卡片 */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {statCards.map((stat) => (
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
                                                {stat.subValue && (
                                                    <div className="ml-2 text-xs text-gray-500">
                                                        {stat.subValue}
                                                    </div>
                                                )}
                                                {stat.change && (
                                                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                                                        <span className="ml-1">{stat.change}</span>
                                                    </div>
                                                )}
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
                            <p className="text-gray-500">销售图表组件区域（待集成）</p>
                        </div>
                    </div>

                    {/* 最近订单 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">最近订单</h3>
                            <a href="/admin/order" className="text-sm text-blue-600 hover:text-blue-800">查看全部</a>
                        </div>
                        <div className="overflow-hidden">
                            {recentOrders.length > 0 ? (
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
                                                ¥{order.amount.toFixed(2)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex px-2 text-xs font-semibold rounded-full ${
                                                    getStatusColor(order.status)
                                                }`}>
                                                    {getStatusText(order.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    暂无订单数据
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}