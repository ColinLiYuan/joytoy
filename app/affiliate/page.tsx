'use client'

import React, { useEffect, useState } from 'react'
import {
    MousePointerClick,
    DollarSign,
    TrendingUp,
    Link as LinkIcon,
    BarChart3,
    Target
} from 'lucide-react'
// 导入定义的类型
import { AffDashboardResponse } from '@/types/affiliate'
import { affiliateService } from '@/services/affiliateService'

export default function AffiliateDashboard() {
    const [data, setData] = useState<AffDashboardResponse | null>(null);
    const [loading, setLoading] = useState(true);

    // 接入后端数据
    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await affiliateService.getDashboardData();
                setData(response);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    // 加载状态
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400 font-medium animate-pulse">Loading performance data...</div>
            </div>
        );
    }

    // 错误处理或空状态
    if (!data) {
        return (
            <div className="p-8 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-medium">
                Error: Could not retrieve dashboard statistics. Please try again later.
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Area */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 font-medium">Real-time tracking of your referral performance.</p>
                </div>
                <div className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    Last 30 Days
                </div>
            </div>

            {/* 1. Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    label="Total Clicks"
                    value={data.summary.totalClicks.toLocaleString()}
                    icon={MousePointerClick}
                    color="text-blue-600"
                    bg="bg-blue-50"
                />
                <StatCard
                    label="Total Earnings"
                    value={`$${data.summary.totalEarnings.toFixed(2)}`}
                    icon={DollarSign}
                    color="text-green-600"
                    bg="bg-green-50"
                />
                <StatCard
                    label="Active Paths"
                    value={data.summary.activeLinks}
                    icon={Target}
                    color="text-purple-600"
                    bg="bg-purple-50"
                />
                <StatCard
                    label="Conv. Rate"
                    value={`${data.summary.conversionRate}%`}
                    icon={TrendingUp}
                    color="text-orange-600"
                    bg="bg-orange-50"
                />
            </div>

            {/* 2. Path Stats Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Traffic by Source */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <BarChart3 className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Clicks by Traffic Source</h3>
                    </div>
                    <div className="space-y-6">
                        {data.sourceStats.length > 0 ? (
                            data.sourceStats.map((item) => (
                                <ProgressRow
                                    key={item.name}
                                    item={item}
                                    totalClicks={data.summary.totalClicks}
                                    color="bg-black"
                                />
                            ))
                        ) : (
                            <div className="py-10 text-center text-gray-400 text-xs italic">No source data recorded.</div>
                        )}
                    </div>
                </div>

                {/* Campaign Analytics */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-6">
                        <LinkIcon className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Campaign Performance</h3>
                    </div>
                    <div className="space-y-6">
                        {data.campaignStats && data.campaignStats.length > 0 ? (
                            data.campaignStats.map((item) => (
                                <ProgressRow
                                    key={item.name}
                                    item={item}
                                    totalClicks={data.summary.totalClicks}
                                    color="bg-indigo-600"
                                />
                            ))
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center py-10">
                                <div className="text-gray-300 mb-2 font-black text-xs uppercase tracking-widest">No Campaigns Detected</div>
                                <p className="text-[10px] text-gray-400 text-center max-w-[200px]">
                                    Use <code className="text-blue-500 font-bold">?campaign=xxx</code> in your links to track campaigns here.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * 进度条组件：展示具体路径统计
 */
function ProgressRow({ item, totalClicks, color }: { item: any, totalClicks: number, color: string }) {
    const percentage = totalClicks > 0 ? (item.clicks / totalClicks) * 100 : 0;

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
                <span className="font-bold">CONV: {item.clicks > 0 ? (item.conversions / item.clicks * 100).toFixed(1) : 0}%</span>
                <span className="font-bold uppercase tracking-wider">Earned: ${item.revenue.toFixed(2)}</span>
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
            <div className="text-2xl font-black text-gray-900 mb-1 leading-none">{value}</div>
            <div className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{label}</div>
        </div>
    );
}