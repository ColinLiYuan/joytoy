// app/admin/affiliate/[id]/page.tsx
'use client'

import { Suspense } from 'react'
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MousePointerClick, ShoppingCart, DollarSign, TrendingUp, Clock, ChevronLeft, ChevronRight, Loader2, Wallet, CheckCircle, AlertCircle, Plus, Trash2, Edit, ExternalLink } from 'lucide-react'
import { getAdminAffiliateCommissionLogs, AdminCommissionLogResponse, AdminCommissionLogsPageResponse, getAdminAffiliateList, getAdminAffiliateActivities, AffiliateActivityResponse, createAffiliateActivity, updateAffiliateActivity, deleteAffiliateActivity } from '@/app/actions/admin'

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
    
    // 活动列表状态
    const [activities, setActivities] = useState<AffiliateActivityResponse[]>([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [activityPage, setActivityPage] = useState(0);
    const [showActivityModal, setShowActivityModal] = useState(false);
    const [editingActivity, setEditingActivity] = useState<AffiliateActivityResponse | null>(null);

    useEffect(() => {
        fetchData();
    }, [affiliateId]);
    
    // 获取佣金日志
    useEffect(() => {
        if (detail) {
            fetchCommissionLogs();
            fetchActivities();
        }
    }, [detail, currentPage, activityPage]);
    
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
    
    // 获取活动列表
    const fetchActivities = async () => {
        setActivitiesLoading(true);
        try {
            const result = await getAdminAffiliateActivities(detail!.affiliateId, activityPage, 10);
            setActivities(result.content || []);
        } catch (error) {
            console.error('Failed to load activities:', error);
        } finally {
            setActivitiesLoading(false);
        }
    };
    
    // 创建活动
    const handleCreateActivity = async (activityData: any) => {
        try {
            await createAffiliateActivity(detail!.affiliateId, activityData);
            setShowActivityModal(false);
            fetchActivities();
        } catch (error) {
            console.error('Failed to create activity:', error);
            alert('创建活动失败');
        }
    };
    
    // 更新活动
    const handleUpdateActivity = async (activityId: number, activityData: any) => {
        try {
            await updateAffiliateActivity(activityId, activityData);
            setShowActivityModal(false);
            setEditingActivity(null);
            fetchActivities();
        } catch (error) {
            console.error('Failed to update activity:', error);
            alert('更新活动失败');
        }
    };
    
    // 删除活动
    const handleDeleteActivity = async (activityId: number) => {
        if (!confirm('确定要删除这个活动吗？')) return;
        try {
            await deleteAffiliateActivity(activityId);
            fetchActivities();
        } catch (error) {
            console.error('Failed to delete activity:', error);
            alert('删除活动失败');
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
                    setDetail(member as unknown as AffiliateDetail);
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
                <div className="text-gray-400 font-medium animate-pulse">加载中...</div>
            </div>
        );
    }

    if (!detail) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">未找到该分销客</p>
                <button
                    onClick={() => router.back()}
                    className="mt-4 text-blue-600 hover:text-blue-800"
                >
                    ← 返回列表
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
                        : detail.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                }`}>
                    {detail.status === 'ACTIVE' ? '活跃' : detail.status === 'PENDING' ? '待审核' : '已暂停'}
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
                    title="转化率"
                    value={`${((detail.totalOrders || 0) / (detail.totalClicks || 1) * 100).toFixed(2)}%`}
                    subtitle="点击到订单转化"
                    icon={TrendingUp}
                    color="purple"
                />
                <StatCard
                    title="累计收益"
                    value={`$${(detail.totalEarnings || 0).toFixed(2)}`}
                    subtitle="所有订单佣金总和"
                    icon={DollarSign}
                    color="orange"
                />
            </div>

            {/* Financial Overview */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <Wallet className="h-5 w-5 text-gray-400" />
                    <h3 className="font-bold text-gray-900">财务概览</h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-emerald-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">累计收益</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.totalEarnings || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">所有订单佣金总和</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-blue-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">当前余额</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.currentBalance || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">待提现金额</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-purple-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">已支付</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            ${(detail.totalPaid || 0).toFixed(2)}
                        </div>
                        <div className="text-xs text-gray-400">历史累计提现</div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-500" />
                            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">佣金比例</span>
                        </div>
                        <div className="text-2xl font-black text-gray-900">
                            {((detail.commissionRate || 0) * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-400">默认佣金比例</div>
                    </div>
                </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoRow label="用户 ID" value={detail.userId?.toString() || '-'} />
                    <InfoRow label="邮箱" value={detail.userEmail} />
                    <InfoRow label="姓名" value={detail.userName} />
                    <InfoRow label="分销客 ID" value={detail.affiliateId} />
                    <InfoRow label="佣金比例" value={`${((detail.commissionRate || 0) * 100).toFixed(0)}%`} />
                    <InfoRow label="PayPal 邮箱" value={detail.userEmail} />
                    <InfoRow label="状态" value={detail.status === 'ACTIVE' ? '活跃' : detail.status === 'PENDING' ? '待审核' : '已暂停'} />
                    <InfoRow label="总点击数" value={detail.totalClicks.toLocaleString()} />
                    <InfoRow label="总订单数" value={detail.totalOrders.toString()} />
                    <InfoRow label="转化率" value={`${((detail.totalOrders || 0) / (detail.totalClicks || 1) * 100).toFixed(2)}%`} />
                    <InfoRow label="累计收益" value={`$${(detail.totalEarnings || 0).toFixed(2)}`} />
                    <InfoRow label="当前余额" value={`$${(detail.currentBalance || 0).toFixed(2)}`} />
                    <InfoRow label="已支付总额" value={`$${(detail.totalPaid || 0).toFixed(2)}`} />
                    <InfoRow label="注册时间" value={formatDate(detail.createdAt)} />
                    <InfoRow label="更新时间" value={formatDate(detail.updatedAt)} />
                </div>
            </div>

            {/* Affiliate Codes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">推广码 ({(detail.affiliateCodes || []).length} 个)</h3>
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
            
            {/* Commission Logs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">佣金历史记录</h3>
                    </div>
                    {commissionLogs && (
                        <span className="text-xs text-gray-500 font-medium">
                            共 {commissionLogs.totalElements} 条记录
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
                            暂无佣金记录
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
                                        第 {commissionLogs.currentPage + 1} 页 / 共 {commissionLogs.totalPages} 页
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
            
            {/* Activities Management */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-gray-400" />
                        <h3 className="text-lg font-semibold text-gray-900">活动管理</h3>
                    </div>
                    <button
                        onClick={() => {
                            setEditingActivity(null);
                            setShowActivityModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                    >
                        <Plus size={16} />
                        添加活动
                    </button>
                </div>
                
                <div className="p-6">
                    {activitiesLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : activities.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            暂无活动记录
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {activities.map((activity) => (
                                <ActivityItem
                                    key={activity.id}
                                    activity={activity}
                                    onEdit={() => {
                                        setEditingActivity(activity);
                                        setShowActivityModal(true);
                                    }}
                                    onDelete={() => handleDeleteActivity(activity.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
            
            {/* Activity Modal */}
            {showActivityModal && (
                <ActivityModal
                    activity={editingActivity}
                    onClose={() => {
                        setShowActivityModal(false);
                        setEditingActivity(null);
                    }}
                    onSubmit={(data) => {
                        if (editingActivity) {
                            handleUpdateActivity(editingActivity.id, data);
                        } else {
                            handleCreateActivity(data);
                        }
                    }}
                />
            )}
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
                    {isEarn ? '获得佣金' : isRefund ? '退款扣除' : log.changeType}
                </span>
            </div>
            
            {/* Order Number */}
            <div className="mb-3">
                <span className="text-xs text-gray-500 font-medium">订单号: </span>
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
                    <span className="text-gray-400 font-medium">余额: </span>
                    <span className="font-bold text-gray-700">${log.balanceBefore.toFixed(2)}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-bold text-gray-900">${log.balanceAfter.toFixed(2)}</span>
                </div>
                <div>
                    <span className="text-gray-400 font-medium">累计收益: </span>
                    <span className="font-bold text-gray-700">${log.totalEarnedBefore.toFixed(2)}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-bold text-gray-900">${log.totalEarnedAfter.toFixed(2)}</span>
                </div>
            </div>
            
            {/* Payout Status Change */}
            {(log.payoutStatusBefore || log.payoutStatusAfter) && (
                <div className="mt-2 text-xs">
                    <span className="text-gray-400 font-medium">提现状态: </span>
                    <span className="font-medium text-gray-700">{log.payoutStatusBefore === 'PENDING' ? '待结算' : log.payoutStatusBefore === 'PAID' ? '已结算' : log.payoutStatusBefore || '-'}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-medium text-gray-900">{log.payoutStatusAfter === 'PENDING' ? '待结算' : log.payoutStatusAfter === 'PAID' ? '已结算' : log.payoutStatusAfter || '-'}</span>
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

/**
 * Activity Item Component
 */
function ActivityItem({ 
    activity, 
    onEdit, 
    onDelete 
}: { 
    activity: AffiliateActivityResponse
    onEdit: () => void
    onDelete: () => void
}) {
    return (
        <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700">
                        {activity.activityTypeName || activity.activityType}
                    </span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        activity.status === 'COMPLETED' ? 'bg-green-100 text-green-700'
                        : activity.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                        {activity.status}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onEdit}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    >
                        <Edit size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            
            {activity.description && (
                <p className="text-sm text-gray-700 mb-3">{activity.description}</p>
            )}
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {activity.platform && (
                    <div>
                        <span className="text-gray-400">平台: </span>
                        <span className="font-medium text-gray-700">{activity.platform}</span>
                    </div>
                )}
                {activity.followerCount && (
                    <div>
                        <span className="text-gray-400">粉丝数: </span>
                        <span className="font-medium text-gray-700">{activity.followerCount.toLocaleString()}</span>
                    </div>
                )}
                {activity.linkUrl && (
                    <div className="col-span-2">
                        <span className="text-gray-400">链接: </span>
                        <a href={activity.linkUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center gap-1">
                            查看 <ExternalLink size={12} />
                        </a>
                    </div>
                )}
            </div>
            
            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-1">
                <Clock size={12} />
                {new Date(activity.createdAt).toLocaleString('zh-CN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                })}
            </div>
        </div>
    );
}

/**
 * Activity Modal Component
 */
function ActivityModal({
    activity,
    onClose,
    onSubmit
}: {
    activity: AffiliateActivityResponse | null
    onClose: () => void
    onSubmit: (data: any) => void
}) {
    const [formData, setFormData] = useState({
        activityType: activity?.activityType || '',
        description: activity?.description || '',
        platform: activity?.platform || '',
        followerCount: activity?.followerCount || '',
        engagementRate: activity?.engagementRate || '',
        linkUrl: activity?.linkUrl || '',
        trackingNumber: activity?.trackingNumber || '',
        status: activity?.status || 'PENDING',
        adminNotes: activity?.adminNotes || ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">
                        {activity ? '编辑活动' : '添加活动'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        ✕
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            活动类型 <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.activityType}
                            onChange={(e) => setFormData({ ...formData, activityType: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            required
                        >
                            <option value="">请选择活动类型</option>
                            <option value="PRODUCT_SHIPMENT">产品发货</option>
                            <option value="SOCIAL_POST">社交媒体帖子</option>
                            <option value="BLOG_REVIEW">博客评论</option>
                            <option value="VIDEO_REVIEW">视频评测</option>
                            <option value="EMAIL_CAMPAIGN">邮件营销</option>
                            <option value="OTHER">其他</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">活动描述</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={3}
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">平台名称</label>
                            <input
                                type="text"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="e.g., TikTok, Instagram"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">粉丝数量</label>
                            <input
                                type="number"
                                value={formData.followerCount}
                                onChange={(e) => setFormData({ ...formData, followerCount: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">相关链接</label>
                        <input
                            type="url"
                            value={formData.linkUrl}
                            onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="https://..."
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">状态</label>
                        <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="PENDING">待处理</option>
                            <option value="IN_PROGRESS">进行中</option>
                            <option value="COMPLETED">已完成</option>
                            <option value="CANCELLED">已取消</option>
                        </select>
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">管理员备注</label>
                        <textarea
                            value={formData.adminNotes}
                            onChange={(e) => setFormData({ ...formData, adminNotes: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={2}
                        />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {activity ? '更新' : '创建'}
                        </button>
                    </div>
                </form>
            </div>
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
