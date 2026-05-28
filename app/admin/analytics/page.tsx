'use client'

import { useEffect, useState } from 'react'
import { Eye, TrendingUp, TrendingDown, Globe } from 'lucide-react'
import { getAnalyticsOverview, AnalyticsOverview } from '@/app/actions/admin'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'

export const dynamic = 'force-dynamic'

function computeGrowth(current: number, previous: number): { value: string; up: boolean } {
    if (previous === 0) return { value: current > 0 ? '+100%' : '+0%', up: current > 0 }
    const pct = ((current - previous) / previous) * 100
    return {
        value: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`,
        up: pct >= 0
    }
}

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsOverview | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const result = await getAnalyticsOverview()
                setData(result)
            } catch (error) {
                console.error('Failed to fetch analytics:', error)
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
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {[...Array(3)].map((_, i) => (
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

    const d = data || { todayPV: 0, yesterdayPV: 0, topPages: [], hourly: [] }
    const pvGrowth = computeGrowth(d.todayPV, d.yesterdayPV)

    const hourlyData = (d.hourly || []).map((count, hour) => ({
        hour: `${hour}:00`,
        count
    }))

    return (
        <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <h1 className="text-2xl font-semibold text-gray-900">访问统计</h1>
                <p className="text-sm text-gray-500 mt-1">数据存储在 Redis，保留最近 7 天</p>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {/* 统计卡片 */}
                <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-cyan-100 rounded-lg p-3">
                                <Eye className="h-6 w-6 text-cyan-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">今日访问 (PV)</p>
                                <div className="flex items-baseline gap-2">
                                    <p className="text-2xl font-semibold text-gray-900">{d.todayPV}</p>
                                    <span className={`flex items-center text-sm font-semibold ${pvGrowth.up ? 'text-green-600' : 'text-red-600'}`}>
                                        {pvGrowth.up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                                        <span className="ml-0.5">{pvGrowth.value}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-teal-100 rounded-lg p-3">
                                <Eye className="h-6 w-6 text-teal-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">昨日访问 (PV)</p>
                                <p className="text-2xl font-semibold text-gray-900">{d.yesterdayPV}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                                <Globe className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-500">热门页面数</p>
                                <p className="text-2xl font-semibold text-gray-900">{d.topPages.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 时段分布图表 */}
                <div className="mt-8 bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">今日访问时段分布</h3>
                    {hourlyData.some((d: any) => d.count > 0) ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={hourlyData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                                <XAxis dataKey="hour" tick={{ fontSize: 11 }} interval={2} />
                                <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
                                <Tooltip formatter={(value: any) => [value, '访问量']} />
                                <Bar dataKey="count" fill="#06B6D4" radius={[4, 4, 0, 0]} name="访问量" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-72 flex items-center justify-center text-gray-400">暂无数据</div>
                    )}
                </div>

                {/* 热门页面排行 */}
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-gray-900">今日热门页面 Top 10</h3>
                    </div>
                    {d.topPages.length > 0 ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">#</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase">页面路径</th>
                                    <th className="px-6 py-3 text-xs font-bold text-gray-500 uppercase text-right">访问量</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {d.topPages.map((item, i) => (
                                    <tr key={item.page} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm text-gray-500 font-mono">{i + 1}</td>
                                        <td className="px-6 py-3 text-sm text-gray-900 font-medium">{item.page}</td>
                                        <td className="px-6 py-3 text-sm text-gray-900 text-right font-semibold">{item.count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="py-20 text-center text-gray-400">暂无数据</div>
                    )}
                </div>
            </div>
        </div>
    )
}
