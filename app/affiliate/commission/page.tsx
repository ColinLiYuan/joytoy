'use client'

import React, { useEffect, useState } from 'react'
import {
    DollarSign,
    TrendingUp,
    Clock,
    ChevronLeft,
    ChevronRight,
    Loader2
} from 'lucide-react'
import { getAffiliateCommissionLogs, CommissionLogResponse, CommissionLogsPageResponse } from '@/app/actions/affiliate/commission-logs'

export default function CommissionHistoryPage() {
    // 佣金日志状态
    const [commissionLogs, setCommissionLogs] = useState<CommissionLogsPageResponse | null>(null);
    const [logsLoading, setLogsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    
    // 获取佣金日志
    useEffect(() => {
        const fetchCommissionLogs = async () => {
            setLogsLoading(true);
            try {
                const logs = await getAffiliateCommissionLogs(currentPage, 10);
                setCommissionLogs(logs);
            } catch (error) {
                console.error('Failed to load commission logs:', error);
            } finally {
                setLogsLoading(false);
            }
        };
        
        fetchCommissionLogs();
    }, [currentPage]);
    
    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Commission History</h1>
                <p className="text-sm text-gray-500 font-medium mt-1">Track all your commission earnings and refunds.</p>
            </div>
            
            {/* Commission Logs */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">All Records</h3>
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
                            No commission records yet.
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

/**
 * 佣金日志项组件
 */
function CommissionLogItem({ log }: { log: CommissionLogResponse }) {
    const isEarn = log.changeType === 'EARN';
    const isRefund = log.changeType === 'REFUND_DEDUCT';
    
    return (
        <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
            {/* 头部：时间和类型 */}
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
                    {isEarn ? 'Earned' : isRefund ? 'Refunded' : log.changeType}
                </span>
            </div>
            
            {/* 订单号 */}
            <div className="mb-3">
                <span className="text-xs text-gray-500 font-medium">Order: </span>
                <span className="text-xs font-mono font-bold text-gray-900">#{log.orderNumber}</span>
            </div>
            
            {/* 金额信息 */}
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
            
            {/* 余额和累计收益变化 */}
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
            
            {/* 描述 */}
            {log.description && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500">{log.description}</p>
                </div>
            )}
        </div>
    );
}
