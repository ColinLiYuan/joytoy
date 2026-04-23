// app/admin/affiliate/[id]/page.tsx
'use client'

import { Suspense } from 'react'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MousePointerClick, ShoppingCart, DollarSign, TrendingUp, Clock, ChevronLeft, ChevronRight, Loader2, Wallet, CheckCircle, AlertCircle } from 'lucide-react'
import { getAdminAffiliateCommissionLogs, AdminCommissionLogResponse, AdminCommissionLogsPageResponse, getAdminAffiliateList } from '@/app/actions/admin'

interface AffiliateDetail {
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
    settledAmount: number;      // Settled amount (over 30 days)
    pendingAmount: number;      // Pending amount (within 30 days)
    totalPaid: number;          // Total paid/payout amount
    status: 'ACTIVE' | 'SUSPENDED' | 'PENDING';
    createdAt: string | null;
    updatedAt: string | null;
}

function AffiliateDetailContent() {
    const params = useParams();
    const router = useRouter();
    const affiliateId = params.id as string;

    const [detail, setDetail] = useState<AffiliateDetail | null>(null);
    const [loading, setLoading] = useState(true);
    
    // 佣金日志状态
    const [commissionLogs, setCommissionLogs] = useState<AdminCommissionLogsPageResponse | null>(null);
    const [logsLoading, setLogsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);

    useEffect(() => {
        fetchData();
    }, [affiliateId]);
    
    // 获取佣金日志
    useEffect(() => {
        if (detail) {
            fetchCommissionLogs();
        }
    }, [detail, currentPage]);
    
    const fetchCommissionLogs = async () => {
        setLogsLoading(true);
        try {
            const logs = await getAdminAffiliateCommissionLogs(detail!.affiliateId, currentPage, 10);
            setCommissionLogs(logs);
        } catch (error) {
            console.error('Failed to load commission logs:', error);
        } finally {
            setLogsLoading(false);
        }
    };

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch member detail (find from list)
            const listData = await getAdminAffiliateList({ page: 0, size: 100 });
            
            if (listData.content) {
                const member = listData.content.find((m) => m.id.toString() === affiliateId);
                if (member) {
                    // 将 AffiliateUser 转换为 AffiliateDetail
                    setDetail({
                        ...member,
                        settledAmount: 0,  // 默认值，实际应该从后端获取
                        pendingAmount: 0,  // 默认值
                        totalPaid: 0       // 默认值
                    } as AffiliateDetail);
                }
            }
        } catch (error) {
            console.error('Failed to fetch affiliate detail:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-gray-400 font-medium animate-pulse">Loading...</div>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Member not found</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    ← Back to list
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{detail.userName}</h1>
                        <p className="text-sm text-gray-500">{detail.userEmail}</p>
                    </div>
                </div>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full border ${
                    detail.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800 border-green-200' 
                        : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                    {detail.status}
                </span>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard
                    title="Total Clicks"
                    value={detail.totalClicks.toLocaleString()}
                    icon={MousePointerClick}
                    color="blue"
                />
                <StatCard
                    title="Total Orders"
                    value={detail.totalOrders.toString()}
                    icon={ShoppingCart}
                    color="green"
                />
                <StatCard
                    title="Settled Amount"
                    value={`$${(detail.settledAmount || 0).toFixed(2)}`}
                    subtitle="Available for withdrawal"
                    icon={DollarSign}
                    color="purple"
                />
                <StatCard
                    title="Pending Amount"
                    value={`$${(detail.pendingAmount || 0).toFixed(2)}`}
                    subtitle="Cooling-off Period"
                    icon={TrendingUp}
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
                            ${(detail.settledAmount || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">Available for withdrawal</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Pending</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.pendingAmount || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">Cooling-off Period (30 days)</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Current Balance</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.currentBalance || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">Pending payout</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">Paid Out</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.totalPaid || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">Historical Total</div>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow label="User ID" value={detail.userId?.toString() || '-'} />
                    <InfoRow label="Email" value={detail.userEmail} />
                    <InfoRow label="Name" value={detail.userName} />
                    <InfoRow label="Affiliate ID" value={detail.affiliateId} />
                    <InfoRow label="Commission Rate" value={`${((detail.commissionRate || 0) * 100).toFixed(0)}%`} />
                    <InfoRow label="PayPal Email" value={detail.userEmail} />
                    <InfoRow label="Status" value={detail.status} />
                    <InfoRow label="Total Clicks" value={detail.totalClicks.toLocaleString()} />
                    <InfoRow label="Total Orders" value={detail.totalOrders.toString()} />
                    <InfoRow label="Total Earnings" value={`$${(detail.totalEarnings || 0).toFixed(2)}`} />
                    <InfoRow label="Settled Amount" value={`$${(detail.settledAmount || 0).toFixed(2)}`} />
                    <InfoRow label="Pending Amount" value={`$${(detail.pendingAmount || 0).toFixed(2)}`} />
                    <InfoRow label="Current Balance" value={`$${(detail.currentBalance || 0).toFixed(2)}`} />
                    <InfoRow label="Total Paid" value={`$${(detail.totalPaid || 0).toFixed(2)}`} />
                    <InfoRow label="Registered At" value={formatDate(detail.createdAt)} />
                    <InfoRow label="Updated At" value={formatDate(detail.updatedAt)} />
                </div>
            </div>

            {/* Affiliate Codes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Promo Codes ({(detail.affiliateCodes || []).length})</h3>
                {detail.affiliateCodes && detail.affiliateCodes.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                        {detail.affiliateCodes.map((code, index) => (
                            <div key={index} className="flex items-center gap-2 px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
                                <span className="text-sm font-mono font-bold text-purple-900">{code}</span>
                                <span className="text-xs text-purple-600">({((detail.commissionRate || 0) * 100).toFixed(0)}%)</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-400">No promo codes yet</p>
                )}
            </div>
            
            {/* Commission Logs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">Commission History</h3>
                    </div>
                    {commissionLogs && (
                        <span className="text-xs text-gray-500 font-medium">
                            Total: {commissionLogs.totalElements} records
                        </span>
                    )}
                </div>
                
                <div className="p-6">
                    {logsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : !commissionLogs || commissionLogs.content.length === 0 ? (
                            <div className="py-12 text-center text-gray-400 text-sm">
                            No commission records found
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {commissionLogs.content.map((log) => (
                                    <CommissionLogItem key={log.id} log={log} />
                                ))}
                            </div>
                            
                            {/* Pagination */}
                            {commissionLogs.totalPages > 1 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <p className="text-xs text-gray-500">
                                        Page {commissionLogs.currentPage + 1} of {commissionLogs.totalPages}
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            disabled={!commissionLogs.hasPrevious}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            disabled={!commissionLogs.hasNext}
                                            onClick={() => setCurrentPage(p => p + 1)}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronRight size={16} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, subtitle, icon: Icon, color }: any) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        orange: 'bg-orange-50 text-orange-600'
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-500">{title}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
                    <Icon className="h-5 w-5" />
                </div>
            </div>
        </div>
    );
}

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs font-medium text-gray-500 uppercase">{label}</p>
            <p className="text-sm text-gray-900 mt-1">{value}</p>
        </div>
    );
}

/**
 * Commission Log Item Component
 */
function CommissionLogItem({ log }: { log: AdminCommissionLogResponse }) {
    const isEarn = log.changeType === 'EARN';
    const isRefund = log.changeType === 'REFUND_DEDUCT';
    
    return (
        <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            {/* Header: Time and Type */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Clock size={12} />
                    {new Date(log.createdAt).toLocaleString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                    isEarn 
                        ? 'bg-green-100 text-green-700' 
                        : isRefund
                            ? 'bg-red-100 text-red-700'
                            : 'bg-gray-100 text-gray-600'
                }`}>
                    {isEarn ? 'Commission Earned' : isRefund ? 'Refund Deduction' : log.changeType}
                </span>
            </div>
            
            {/* Order Number */}
            <div className="mb-3">
                <span className="text-xs text-gray-500 font-medium">Order: </span>
                <span className="text-xs font-mono font-bold text-gray-900">#{log.orderNumber}</span>
            </div>
            
            {/* Amount Information */}
            <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5">
                    <TrendingUp size={14} className={isEarn ? 'text-green-600' : 'text-red-600'} />
                    <span className={`text-sm font-black ${
                        isEarn ? 'text-green-600' : 'text-red-600'
                    }`}>
                        {isEarn ? '+' : '-'}${Math.abs(log.commissionAmount).toFixed(2)}
                    </span>
                </div>
            </div>
            
            {/* Balance and Total Earnings Changes */}
            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <span className="text-gray-400 font-medium">Balance: </span>
                    <span className="font-bold text-gray-700">${log.balanceBefore.toFixed(2)}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-bold text-gray-900">${log.balanceAfter.toFixed(2)}</span>
                </div>
                <div>
                    <span className="text-gray-400 font-medium">Total Earned: </span>
                    <span className="font-bold text-gray-700">${log.totalEarnedBefore.toFixed(2)}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-bold text-gray-900">${log.totalEarnedAfter.toFixed(2)}</span>
                </div>
            </div>
            
            {/* Payout Status Change */}
            {(log.payoutStatusBefore || log.payoutStatusAfter) && (
                <div className="mt-2 text-xs">
                    <span className="text-gray-400 font-medium">Payout Status: </span>
                    <span className="font-medium text-gray-700">{log.payoutStatusBefore || '-'}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-medium text-gray-900">{log.payoutStatusAfter || '-'}</span>
                </div>
            )}
            
            {/* Description */}
            {log.description && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">{log.description}</p>
                </div>
            )}
        </div>
    );
}

export default function AffiliateDetailPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <AffiliateDetailContent />
        </Suspense>
    );
}
