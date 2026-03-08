'use client'

import { LayoutDashboard, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

export default function AffiliateDashboard() {
    // 模拟数据，实际应从后端获取
    const stats = [
        { label: 'Total Earnings', value: '$0', icon: DollarSign, color: 'text-green-600' },
        { label: 'Referral Orders', value: '42', icon: ShoppingCart, color: 'text-blue-600' },
        { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'text-indigo-600' },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-sm text-gray-500">Welcome back! Here is what's happening with your referrals today.</p>
            </div>

            {/* Stats Grid */}
            {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6">*/}
            {/*    {stats.map((stat) => (*/}
            {/*        <div key={stat.label} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">*/}
            {/*            <div className="flex items-center justify-between mb-4">*/}
            {/*                <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>*/}
            {/*                    <stat.icon className="h-6 w-6" />*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*            <div className="text-2xl font-black text-gray-900">{stat.value}</div>*/}
            {/*            <div className="text-sm text-gray-500 font-medium">{stat.label}</div>*/}
            {/*        </div>*/}
            {/*    ))}*/}
            {/*</div>*/}

            {/* Quick Actions / Link Builder */}
            <div className="bg-black text-white p-8 rounded-2xl shadow-lg relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-xl font-bold mb-2">Your Referral Link</h2>
                    <p className="text-gray-400 text-sm mb-6">Share this link to earn 10% commission on every sale.</p>
                    <div className="flex gap-2">
                        <input
                            readOnly
                            value="https://mythtoy.com?aff=SENSAVITE"
                            className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-white"
                        />
                        <button className="bg-white text-black px-6 py-2 rounded-lg text-sm font-bold hover:bg-gray-100 transition-colors">
                            Copy Link
                        </button>
                    </div>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <LayoutDashboard size={200} />
                </div>
            </div>
        </div>
    )
}