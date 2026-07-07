'use client'

import { useEffect, useState } from 'react'
import { Eye, TrendingUp, TrendingDown, Globe, Search, RotateCcw, Bot, User, ChevronLeft, ChevronRight } from 'lucide-react'
import { getAnalyticsOverview, AnalyticsOverview } from '@/app/actions/admin'
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer
} from 'recharts'

interface VisitRecord {
    page: string; ref: string; title: string; ip: string; country: string; isBot: boolean
    ua: string; ts: number; _date: string
}

export const dynamic = 'force-dynamic'

function computeGrowth(current: number, previous: number): { value: string; up: boolean } {
    if (previous === 0) return { value: current > 0 ? '+100%' : '+0%', up: current > 0 }
    const pct = ((current - previous) / previous) * 100
    return { value: `${pct >= 0 ? '+' : ''}${pct.toFixed(0)}%`, up: pct >= 0 }
}

function formatDate(d: Date): string {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
}

function todayStr(): string { return formatDate(new Date()) }

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<AnalyticsOverview | null>(null)
    const [loading, setLoading] = useState(true)

    // 访问记录状态
    const [startDate, setStartDate] = useState(todayStr())
    const [endDate, setEndDate] = useState(todayStr())
    const [country, setCountry] = useState('')
    const [ipFilter, setIpFilter] = useState('')
    const [isBotFilter, setIsBotFilter] = useState<boolean | null>(false) // null=全部, false=真实用户, true=爬虫
    const [records, setRecords] = useState<VisitRecord[]>([])
    const [countries, setCountries] = useState<string[]>([])
    const [recordPage, setRecordPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)
    const [totalElements, setTotalElements] = useState(0)
    const [recordsLoading, setRecordsLoading] = useState(false)

    useEffect(() => {
        const fetchData = async () => {
            try { setLoading(true); setData(await getAnalyticsOverview()) }
            catch (e) { console.error(e) }
            finally { setLoading(false) }
        }
        fetchData()
    }, [])

    // 切换日期后重新加载记录和国家列表
    useEffect(() => {
        fetchRecords()
        fetchCountries()
    }, [startDate, endDate, country, isBotFilter, ipFilter, recordPage])

    const fetchRecords = async () => {
        setRecordsLoading(true)
        try {
            const params = new URLSearchParams({ startDate, endDate, page: String(recordPage), size: '20' })
            if (country) params.append('country', country)
            if (isBotFilter !== null) params.append('isBot', String(isBotFilter))
            if (ipFilter) params.append('ip', ipFilter)
            const res = await fetch(`/api/V1/analytics/admin/records?${params}`)
            const json = await res.json()
            if (json.success) {
                setRecords(json.data.content || [])
                setTotalPages(json.data.totalPages || 0)
                setTotalElements(json.data.totalElements || 0)
            }
        } catch (e) { console.error(e) }
        finally { setRecordsLoading(false) }
    }

    const fetchCountries = async () => {
        try {
            const res = await fetch(`/api/V1/analytics/admin/countries?startDate=${startDate}&endDate=${endDate}`)
            const json = await res.json()
            if (json.success) setCountries(json.data || [])
        } catch (e) { console.error(e) }
    }

    const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setRecordPage(0); fetchRecords(); fetchCountries(); }
    const handleReset = () => {
        const t = todayStr()
        setStartDate(t); setEndDate(t); setCountry(''); setIpFilter(''); setIsBotFilter(false); setRecordPage(0)
    }

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
                <p className="text-sm text-gray-500 mt-1">实时数据来自 Redis，访问记录持久化到 MySQL</p>
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

                {/* ========== 访问记录明细 ========== */}
                <div className="mt-8 bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
                            <Search size={18} /> 访问记录明细
                            <span className="text-sm font-normal text-gray-400">({totalElements} 条)</span>
                        </h3>
                    </div>

                    {/* 筛选栏 */}
                    <div className="px-6 py-3 bg-gray-50/50 border-b border-gray-100 overflow-x-auto">
                        <div className="flex items-end gap-2 min-w-max">
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">开始</label>
                                <input type="date" value={startDate} onChange={e => { setStartDate(e.target.value); setRecordPage(0) }}
                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">结束</label>
                                <input type="date" value={endDate} onChange={e => { setEndDate(e.target.value); setRecordPage(0) }}
                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">IP</label>
                                <input type="text" value={ipFilter} onChange={e => { setIpFilter(e.target.value); setRecordPage(0) }}
                                    placeholder="203.190.1.133"
                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs w-32 font-mono" />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">国家</label>
                                <select value={country} onChange={e => { setCountry(e.target.value); setRecordPage(0) }}
                                    className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs min-w-[100px]">
                                    <option value="">全部</option>
                                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-500 mb-1">类型</label>
                                <div className="flex gap-0.5">
                                    <button type="button" onClick={() => { setIsBotFilter(false); setRecordPage(0) }}
                                        className={`px-2 py-1.5 rounded text-[11px] font-medium flex items-center gap-0.5 transition-colors ${
                                            isBotFilter === false ? 'bg-green-100 text-green-700 border border-green-300' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        <User size={10} /> 真人
                                    </button>
                                    <button type="button" onClick={() => { setIsBotFilter(true); setRecordPage(0) }}
                                        className={`px-2 py-1.5 rounded text-[11px] font-medium flex items-center gap-0.5 transition-colors ${
                                            isBotFilter === true ? 'bg-orange-100 text-orange-700 border border-orange-300' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        <Bot size={10} /> 爬虫
                                    </button>
                                    <button type="button" onClick={() => { setIsBotFilter(null); setRecordPage(0) }}
                                        className={`px-2 py-1.5 rounded text-[11px] font-medium transition-colors ${
                                            isBotFilter === null ? 'bg-gray-200 text-gray-700' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                        全部
                                    </button>
                                </div>
                            </div>
                            <button type="button" onClick={handleReset}
                                className="px-2 py-1.5 border border-gray-300 rounded text-xs text-gray-500 hover:bg-gray-50 flex items-center gap-1">
                                <RotateCcw size={12} /> 重置
                            </button>
                        </div>
                    </div>

                    {/* 记录表格 */}
                    <div className="overflow-x-auto">
                        {recordsLoading ? (
                            <div className="py-20 text-center text-gray-400">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                                <p className="mt-3">加载中...</p>
                            </div>
                        ) : records.length > 0 ? (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50 border-b border-gray-200">
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">时间</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">页面</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">来源</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">IP</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">国家</th>
                                        <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap">类型</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {records.map((r, i) => (
                                        <tr key={`${r.ts}-${i}`} className={`hover:bg-gray-50 ${r.isBot ? 'opacity-60' : ''}`}>
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap font-mono">
                                                {new Date(r.ts).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-900 max-w-[300px] truncate" title={r.page}>
                                                {r.page}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-400 max-w-[150px] truncate" title={r.ref || ''}>
                                                {r.ref ? (() => { try { return new URL(r.ref).hostname } catch { return r.ref } })() : '-'}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-400 font-mono whitespace-nowrap">{r.ip || '-'}</td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                {r.isBot ? <span className="text-gray-400">-</span>
                                                    : <span className="text-gray-700">{r.country || 'Unknown'}</span>}
                                            </td>
                                            <td className="px-4 py-3 text-xs whitespace-nowrap">
                                                {r.isBot
                                                    ? <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-orange-100 text-orange-700 font-medium"><Bot size={10} /> Bot</span>
                                                    : <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 font-medium"><User size={10} /> 真人</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="py-20 text-center text-gray-400">暂无访问记录</div>
                        )}
                    </div>

                    {/* 分页 */}
                    {totalPages > 1 && (
                        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-sm text-gray-500">共 {totalElements} 条，第 {recordPage + 1}/{totalPages} 页</span>
                            <div className="flex gap-1">
                                <button disabled={recordPage === 0} onClick={() => setRecordPage(p => p - 1)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                                    <ChevronLeft size={14} />
                                </button>
                                <button disabled={recordPage >= totalPages - 1} onClick={() => setRecordPage(p => p + 1)}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        </div>
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
