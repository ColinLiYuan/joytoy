// app/admin/affiliate/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, MousePointerClick, DollarSign, TrendingUp, Calendar, Search, Filter } from 'lucide-react'
import { getAdminAffiliateStats, getAdminAffiliateList } from '@/app/actions/admin/affiliate'

interface AffiliateUser {
    id: number;
    affiliateId: string;
    userId: number | null;
    userEmail: string;
    userName: string;
    commissionRate: number | null;
    affiliateCodes: string[];  // 推广码列表
    totalClicks: number;
    totalOrders: number;
    totalEarnings: number;      // 累计总收益（已结算）
    currentBalance: number;     // 当前余额（待支付）
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
    createdAt: string | null;
    updatedAt: string | null;
}

interface AffiliateStats {
    totalAffiliates: number;
    activeAffiliates: number;
    totalClicks: number;
    totalConversions: number;
    totalCommission: number;
    conversionRate: number;
}

export default function AdminAffiliatePage() {
    const [stats, setStats] = useState<AffiliateStats | null>(null);
    const [affiliates, setAffiliates] = useState<AffiliateUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // 获取统计数据
            const statsData = await getAdminAffiliateStats();
            setStats(statsData);

            // 获取联盟成员列表
            const listData = await getAdminAffiliateList({ page: 0, size: 100 });
            setAffiliates(listData.content || []);
        } catch (error) {
            console.error('Failed to fetch affiliate data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
            case 'SUSPENDED': return 'bg-red-100 text-red-800 border-red-200';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const filteredAffiliates = affiliates.filter(affiliate => {
        const matchesSearch = 
            affiliate.affiliateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            affiliate.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'ALL' || affiliate.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400 font-medium animate-pulse">Loading affiliate data...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">联盟营销管理</h1>
                <p className="text-sm text-gray-500 mt-1">管理和监控所有联盟成员的业绩与佣金</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="总联盟成员"
                        value={stats.totalAffiliates.toString()}
                        subtitle={`${stats.activeAffiliates} 活跃`}
                        icon={Users}
                        color="blue"
                    />
                    <StatCard
                        title="总点击数"
                        value={stats.totalClicks.toLocaleString()}
                        subtitle="所有链接累计"
                        icon={MousePointerClick}
                        color="purple"
                    />
                    <StatCard
                        title="总转化订单"
                        value={stats.totalConversions.toString()}
                        subtitle={`转化率 ${stats.conversionRate}%`}
                        icon={TrendingUp}
                        color="green"
                    />
                    <StatCard
                        title="总佣金支出"
                        value={`$${stats.totalCommission.toFixed(2)}`}
                        subtitle="累计支付"
                        icon={DollarSign}
                        color="orange"
                    />
                </div>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="搜索联盟代码、姓名或邮箱..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                        />
                        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="ALL">全部状态</option>
                        <option value="ACTIVE">活跃</option>
                        <option value="SUSPENDED">已暂停</option>
                        <option value="PENDING">待审核</option>
                    </select>
                </div>
            </div>

            {/* Affiliates Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联盟成员</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">联盟代码</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">推广码</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">佣金比例</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">点击数</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">订单数</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">已结算</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">待支付</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PayPal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredAffiliates.map((affiliate) => (
                                <tr key={affiliate.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{affiliate.userName}</div>
                                            <div className="text-sm text-gray-500">{affiliate.userEmail}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                                            {affiliate.affiliateId}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-wrap gap-1 max-w-[200px]">
                                            {affiliate.affiliateCodes && affiliate.affiliateCodes.length > 0 ? (
                                                affiliate.affiliateCodes.map((code, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                        {code}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-xs text-gray-400">无</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {((affiliate.commissionRate || 0) * 100).toFixed(0)}%
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {affiliate.totalClicks.toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {affiliate.totalOrders}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                        ${(affiliate.totalEarnings || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-orange-600">
                                        ${(affiliate.currentBalance || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-[200px]" title={affiliate.userEmail}>
                                        {affiliate.userEmail}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(affiliate.status)}`}>
                                            {affiliate.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link 
                                            href={`/admin/affiliate/${affiliate.id}`}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            查看详情
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredAffiliates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">没有找到匹配的联盟成员</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        purple: 'bg-purple-50 text-purple-600',
        green: 'bg-green-50 text-green-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="h-6 w-6" />
                </div>
            </div>
        </div>
    );
}
export const dynamic = 'force-dynamic'; 
