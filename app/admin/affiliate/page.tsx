// app/admin/affiliate/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, MousePointerClick, DollarSign, TrendingUp, Calendar, Search, Filter, Wallet, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { getAdminAffiliateStats, getAdminAffiliateList } from '@/app/actions/admin'

interface AffiliateUser {
    id: number;
    affiliateId: string;
    userId: number | null;
    userEmail: string;
    userName: string;
    commissionRate: number | null;
    affiliateCodes: string[];  // Promo code list
    totalClicks: number;
    totalOrders: number;
    totalEarnings: number;      // Total accumulated earnings (settled)
    currentBalance: number;     // Current balance (pending payout)
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
    settledAmount: number;       // Settled amount (over 30 days)
    pendingAmount: number;       // Pending amount (within 30 days)
    currentBalance: number;      // Current total balance
    totalPaid: number;           // Total paid amount
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
            
            // Fetch stats data
            const statsData = await getAdminAffiliateStats();
            setStats(statsData);

            // Fetch affiliate member list
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
                <h1 className="text-2xl font-bold text-gray-900">Affiliate Marketing</h1>
                <p className="text-sm text-gray-500 mt-1">Manage and monitor all affiliate performance and commissions</p>
            </div>

            {/* Stats Cards */}
            {stats && (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatCard
                            title="Total Affiliates"
                            value={stats.totalAffiliates.toString()}
                            subtitle={`${stats.activeAffiliates} Active`}
                            icon={Users}
                            color="blue"
                        />
                        <StatCard
                            title="Total Clicks"
                            value={stats.totalClicks.toLocaleString()}
                            subtitle="Accumulated across all links"
                            icon={MousePointerClick}
                            color="purple"
                        />
                        <StatCard
                            title="Total Conversions"
                            value={stats.totalConversions.toString()}
                            subtitle={`Conversion Rate ${stats.conversionRate}%`}
                            icon={TrendingUp}
                            color="green"
                        />
                        <StatCard
                            title="Total Commission"
                            value={`$${stats.totalCommission.toFixed(2)}`}
                            subtitle="Accumulated Paid"
                            icon={DollarSign}
                            color="orange"
                        />
                    </div>

                    {/* Financial Overview */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-6">
                            <Wallet className="h-5 w-5 text-gray-400" />
                            <h3 className="font-bold text-gray-900">Financial Overview</h3>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Settled</span>
                                </div>
                                <div className="text-2xl font-black text-gray-900">
                                    ${stats.settledAmount?.toFixed(2) || '0.00'}
                                </div>
                                <div className="text-xs text-gray-400">Available for withdrawal</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-amber-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</span>
                                </div>
                                <div className="text-2xl font-black text-gray-900">
                                    ${stats.pendingAmount?.toFixed(2) || '0.00'}
                                </div>
                                <div className="text-xs text-gray-400">Cooling-off Period (30 days)</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Wallet className="h-4 w-4 text-blue-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Balance</span>
                                </div>
                                <div className="text-2xl font-black text-gray-900">
                                    ${stats.currentBalance?.toFixed(2) || '0.00'}
                                </div>
                                <div className="text-xs text-gray-400">Total for all affiliates</div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-purple-500" />
                                    <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Paid Out</span>
                                </div>
                                <div className="text-2xl font-black text-gray-900">
                                    ${stats.totalPaid?.toFixed(2) || '0.00'}
                                </div>
                                <div className="text-xs text-gray-400">Historical Total</div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search affiliate code, name or email..."
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
                        <option value="ALL">All Status</option>
                        <option value="ACTIVE">Active</option>
                        <option value="SUSPENDED">Suspended</option>
                        <option value="PENDING">Pending</option>
                    </select>
                </div>
            </div>

            {/* Affiliates Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Affiliate ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Promo Codes</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission Rate</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Settled</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PayPal</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                                                <span className="text-xs text-gray-400">None</span>
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
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {filteredAffiliates.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No matching affiliates found</p>
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
