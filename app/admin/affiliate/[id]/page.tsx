// app/admin/affiliate/[id]/page.tsx
'use client'

import { Suspense } from 'react'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MousePointerClick, ShoppingCart, DollarSign, TrendingUp } from 'lucide-react'

interface AffiliateDetail {
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

function AffiliateDetailContent() {
    const params = useParams();
    const router = useRouter();
    const affiliateId = params.id as string;

    const [detail, setDetail] = useState<AffiliateDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [affiliateId]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // 获取成员详情（从列表中找到对应的）
            const listResponse = await fetch(`/api/admin/affiliate/list?page=0&size=100`, {
                cache: 'no-store'
            });
            const listData = await listResponse.json();
            
            if (listData.success) {
                const member = listData.data.content.find((m: AffiliateDetail) => m.id.toString() === affiliateId);
                if (member) {
                    setDetail(member);
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
        return new Date(dateString).toLocaleString('zh-CN', {
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
                    title="总点击数"
                    value={detail.totalClicks.toLocaleString()}
                    icon={MousePointerClick}
                    color="blue"
                />
                <StatCard
                    title="总订单数"
                    value={detail.totalOrders.toString()}
                    icon={ShoppingCart}
                    color="green"
                />
                <StatCard
                    title="已结算金额"
                    value={`$${(detail.totalEarnings || 0).toFixed(2)}`}
                    icon={DollarSign}
                    color="purple"
                />
                <StatCard
                    title="待支付金额"
                    value={`$${(detail.currentBalance || 0).toFixed(2)}`}
                    icon={TrendingUp}
                    color="orange"
                />
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow label="用户ID" value={detail.userId?.toString() || '-'} />
                    <InfoRow label="邮箱" value={detail.userEmail} />
                    <InfoRow label="姓名" value={detail.userName} />
                    <InfoRow label="联盟代码" value={detail.affiliateId} />
                    <InfoRow label="佣金比例" value={`${((detail.commissionRate || 0) * 100).toFixed(0)}%`} />
                    <InfoRow label="PayPal邮箱" value={detail.userEmail} />
                    <InfoRow label="状态" value={detail.status} />
                    <InfoRow label="总点击数" value={detail.totalClicks.toLocaleString()} />
                    <InfoRow label="总订单数" value={detail.totalOrders.toString()} />
                    <InfoRow label="已结算金额" value={`$${(detail.totalEarnings || 0).toFixed(2)}`} />
                    <InfoRow label="待支付金额" value={`$${(detail.currentBalance || 0).toFixed(2)}`} />
                    <InfoRow label="注册时间" value={formatDate(detail.createdAt)} />
                    <InfoRow label="更新时间" value={formatDate(detail.updatedAt)} />
                </div>
            </div>

            {/* Affiliate Codes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">推广码 ({(detail.affiliateCodes || []).length})</h3>
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
                    <p className="text-sm text-gray-400">暂无推广码</p>
                )}
            </div>
        </div>
    );
}

function StatCard({ title, value, icon: Icon, color }: any) {
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
