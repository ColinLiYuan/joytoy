'use client'

import React from 'react'
import {
    MousePointerClick,
    DollarSign,
    TrendingUp,
    Link as LinkIcon,
    BarChart3,
    Target
} from 'lucide-react'
// 导入上面定义的类型
import { AffiliateDashboardData, PathStat } from '@/types/affiliate'

// 模拟后端返回的数据
const mockData: AffiliateDashboardData = {
    summary: {
        totalClicks: 1240,
        totalEarnings: 158.40,
        conversionRate: 3.2,
        activeLinks: 5
    },
    sourceStats: [
        { name: 'tiktok', clicks: 840, conversions: 24, revenue: 80.50 },
        { name: 'instagram', clicks: 310, conversions: 12, revenue: 52.10 },
        { name: 'email_newsletter', clicks: 90, conversions: 3, revenue: 25.80 },
    ],
    campaignStats: [
        { name: 'summer_sale_2026', clicks: 500, conversions: 15, revenue: 45.00 },
        { name: 'new_arrival_v2', clicks: 200, conversions: 5, revenue: 12.50 },
    ],
    dailyTrends: [] // 暂不展示图表
}

export default function AffiliateDashboard() {
    return (
        <div className="space-y-8">
            {/* 1. Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500 font-medium">Real-time performance tracking and link analytics.</p>
            </div>

            {/* 2. Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Clicks"
                    value={mockData.summary.totalClicks.toLocaleString()}
                    icon={MousePointerClick}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Earnings"
                    value={`$${mockData.summary.totalEarnings.toFixed(2)}`}
                    icon={DollarSign}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatCard
                    label="Conv. Rate"
                    value={`${mockData.summary.conversionRate}%`}
                    icon={TrendingUp}
                    color="text-indigo-600"
                    bg="bg-indigo-50"
                />
                <StatCard
                    label="Active Links"
                    value={mockData.summary.activeLinks.toString()}
                    icon={LinkIcon}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
            </div>

            {/* 3. Detailed Stats - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Source Traffic Analytics */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900 text-lg">Traffic by Source</h3>
                    </div>
                    <div className="space-y-5">
                        {mockData.sourceStats.map((item) => (
                            <ProgressBarRow key={item.name} item={item} total={mockData.summary.totalClicks} />
                        ))}
                    </div>
                </section>

                {/* Campaign Analytics */}
                <section className="bg-white border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Target className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900 text-lg">Active Campaigns</h3>
                    </div>
                    <div className="space-y-5">
                        {mockData.campaignStats.length > 0 ? (
                            mockData.campaignStats.map((item) => (
                                <ProgressBarRow key={item.name} item={item} total={mockData.summary.totalClicks} color="bg-indigo-500" />
                            ))
                        ) : (
                            <p className="text-sm text-gray-400 italic">No campaign data yet.</p>
                        )}
                    </div>
                </section>

            </div>
        </div>
    )
}

/**
 * 进度条行组件
 */
function ProgressBarRow({ item, total, color = "bg-black" }: { item: PathStat, total: number, color?: string }) {
    const percentage = Math.min((item.clicks / total) * 100, 100);

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-900">{item.clicks} clicks</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div
                    className={`${color} h-full transition-all duration-700 ease-out`}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
                <span>CONV: {(item.conversions / item.clicks * 100 || 0).toFixed(1)}%</span>
                <span>EARNED: ${item.revenue.toFixed(2)}</span>
            </div>
        </div>
    );
}

/**
 * 统计卡片组件
 */
function StatCard({ label, value, icon: Icon, color, bg }: any) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm transition-hover hover:border-gray-300">
            <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center mb-4`}>
                <Icon className="h-5 w-5" />
            </div>
            <div className="text-2xl font-black text-gray-900 leading-none mb-1">{value}</div>
            <div className="text-xs text-gray-400 uppercase font-bold tracking-wider">{label}</div>
        </div>
    )
}