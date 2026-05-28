'use client'

import {
    ShoppingCart,
    Users,
    Package,
    DollarSign,
    TrendingUp,
    TrendingDown,
    Clock,
    AlertTriangle,
    Eye
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getDashboardStats, DashboardStats, getAnalyticsOverview, AnalyticsOverview } from '@/app/actions/admin'
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

export const dynamic = 'force-dynamic'

const STATUS_COLORS: Record<string, string> = {
    'PENDING': '#FBBF24',
    'PAID': '#3B82F6',
    'PROCESSING': '#8B5CF6',
    'SHIPPED': '#EC4899',
    'DELIVERED': '#10B981',
    'COMPLETED': '#059669',
    'CANCELLED': '#6B7280',
    'REFUNDED': '#EF4444',
}

const STATUS_LABELS: Record<string, string> = {
    'PENDING': '待支付',
    'PAID': '已支付',
    'PROCESSING': '处理中',
    'SHIPPED': '已发货',
    'DELIVERED': '已签收',
    'COMPLETED': '已完成',
    'CANCELLED': '已取消',
    'REFUNDED': '已退款',
}

function computeGrowth(current: number, previous: number): { value: string; up: boolean } {
    if (previous === 0) return { value: current > 0 ? '+100%' : '+0%', up: current > 0 }
    const pct = ((current - previous) / previous) * 100
    return {
        value: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`,
        up: pct >= 0
    }
}

export default function AdminDashboard() {
    const router = useRouter()
    const [stats, setStats] = useState<DashboardStats | null>(null)
    const [analytics, setAnalytics] = useState<AnalyticsOverview | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const [data, overview] = await Promise.all([
                    getDashboardStats(),
                    getAnalyticsOverview()
                ])
                setStats(data)
                setAnalytics(overview)
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

    const s = stats || {
        todaySales: 0,
        todayOrders: 0,
        yesterdaySales: 0,
        yesterdayOrders: 0,
        pendingOrders: 0,
        totalProducts: 0,
        totalUsers: 0,
        inventoryAlerts: 0,
        ordersByStatus: {},
        salesTrend: []
    }

    const a = analytics || { todayPV: 0, yesterdayPV: 0, topPages: [], hourly: [] }

    const salesGrowth = computeGrowth(s.todaySales, s.yesterdaySales)
    const ordersGrowth = computeGrowth(s.todayOrders, s.yesterdayOrders)
    const pvGrowth = computeGrowth(a.todayPV, a.yesterdayPV)

    const statusPieData = Object.entries(s.ordersByStatus).map(([status, count]) => ({
        name: STATUS_LABELS[status] || status,
        value: count,
        color: STATUS_COLORS[status] || '#9CA3AF'
    }))

    const chartData = (s.salesTrend || []).map((d: any) => ({
        date: d.date?.slice(5) || d.date,
        amount: d.amount,
        orders: d.orders
    }))

    const hourlyData = (a.hourly || []).map((count, hour) => ({
        hour: `${hour}:00`,
        count
    }))

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">仪表盘</h1>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 统计卡片 */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="今日销售额"
                        value={`$${s.todaySales.toFixed(2)}`}
                        growth={salesGrowth}
                        icon={DollarSign}
                        iconColor="text-green-600"
                        iconBg="bg-green-100"
                    />
                    <StatCard
                        title="今日订单"
                        value={s.todayOrders.toString()}
                        growth={ordersGrowth}
                        icon={ShoppingCart}
                        iconColor="text-blue-600"
                        iconBg="bg-blue-100"
                    />
                    <StatCard
                        title="待处理订单"
                        value={s.pendingOrders.toString()}
                        icon={Clock}
                        iconColor="text-yellow-600"
                        iconBg="bg-yellow-100"
                        onClick={() => router.push('/admin/order?status=PAID')}
                    />
                    <StatCard
                        title="库存预警"
                        value={s.inventoryAlerts.toString()}
                        icon={AlertTriangle}
                        iconColor="text-red-600"
                        iconBg="bg-red-100"
                        onClick={() => router.push('/admin/product?stock=low')}
                    />
                </div>

                {/* 第二行卡片 */}
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                                <Package className="h-6 w-6 text-purple-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">商品总数</p>
                                <p className="text-2xl font-semibold text-gray-900">{s.totalProducts}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-orange-100 rounded-lg p-3">
                                <Users className="h-6 w-6 text-orange-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">用户总数</p>
                                <p className="text-2xl font-semibold text-gray-900">{s.totalUsers}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-gray-100 rounded-lg p-3">
                                <DollarSign className="h-6 w-6 text-gray-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">昨日销售额</p>
                                <p className="text-2xl font-semibold text-gray-900">${s.yesterdaySales.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>
                    <StatCard
                        title="今日访问(PV)"
                        value={a.todayPV.toString()}
                        growth={pvGrowth}
                        icon={Eye}
                        iconColor="text-cyan-600"
                        iconBg="bg-cyan-100"
                    />
                    <StatCard
                        title="昨日访问(PV)"
                        value={a.yesterdayPV.toString()}
                        icon={Eye}
                        iconColor="text-teal-600"
                        iconBg="bg-teal-100"
                    />
                </div>

                {/* 今日访问时段分布 */}
                {hourlyData.some((d: any) => d.count > 0) && (
                    <div className="mt-8 bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">今日访问时段分布</h3>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                <Tooltip formatter={(value: any) => [value, '访问量']} />
                                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} name="访问量" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}

                {/* 图表区域 */}
                <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* 销售趋势折线图 */}
                    <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">近30天销售趋势</h3>
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis yAxisId="left" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                                    <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} allowDecimals={false} />
                                    <Tooltip content={SalesTrendTooltip} />
                                    <Line name="销售额" type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={2}
                                        dot={false} yAxisId="left" />
                                    <Line name="订单数" type="monotone" dataKey="orders" stroke="#10B981" strokeWidth={2}
                                        dot={false} yAxisId="right" />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-gray-400">暂无销售数据</div>
                        )}
                    </div>

                    {/* 订单状态饼图 */}
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">订单状态分布</h3>
                        {statusPieData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={320}>
                                <PieChart>
                                    <Pie data={statusPieData} dataKey="value" nameKey="name"
                                        cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                        {statusPieData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-80 flex items-center justify-center text-gray-400">暂无订单数据</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function SalesTrendTooltip({ active, payload, label }: any) {
    if (!active || !payload || payload.length === 0) return null
    return (
        <div className="bg-white border border-gray-200 shadow-lg rounded-lg p-3">
            <p className="text-sm text-gray-500 mb-1">日期: {label}</p>
            {payload.map((entry: any, i: number) => (
                <p key={i} className="text-sm font-medium" style={{ color: entry.color }}>
                    {entry.name === '销售额'
                        ? `销售额: $${Number(entry.value).toFixed(2)}`
                        : `订单数: ${entry.value}`}
                </p>
            ))}
        </div>
    )
}

function StatCard({ title, value, growth, icon: Icon, iconColor, iconBg, onClick }: {
    title: string
    value: string
    growth?: { value: string; up: boolean }
    icon: any
    iconColor: string
    iconBg: string
    onClick?: () => void
}) {
    const clickable = !!onClick
    return (
        <div
            onClick={onClick}
            className={`bg-white overflow-hidden shadow rounded-lg transition-shadow ${clickable ? 'hover:shadow-md cursor-pointer' : 'hover:shadow-md'}`}
        >
            <div className="p-5">
                <div className="flex items-center">
                    <div className={`flex-shrink-0 ${iconBg} rounded-lg p-3`}>
                        <Icon className={`h-6 w-6 ${iconColor}`} />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                        <dl>
                            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                            <dd className="flex items-baseline">
                                <div className="text-2xl font-semibold text-gray-900">{value}</div>
                                {growth && (
                                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                                        growth.up ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {growth.up
                                            ? <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                                            : <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                                        }
                                        <span className="ml-1">{growth.value}</span>
                                    </div>
                                )}
                            </dd>
                        </dl>
                    </div>
                </div>
            </div>
        </div>
    )
}