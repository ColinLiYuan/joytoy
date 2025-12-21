// /app/admin/page.tsx
'use client'

import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
} from 'lucide-react'

export default function AdminDashboard() {
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

    return (
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
    )
}