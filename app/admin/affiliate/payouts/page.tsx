'use client'

import { useEffect, useState } from 'react'
import { Wallet, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2, X, DollarSign } from 'lucide-react'
import { affiliateService } from '@/services/affiliateService'
import Pagination from '@/components/common/pagination'
import { approvePayout, rejectPayout } from '@/app/actions/admin'
import { PayoutResponse } from '@/types/affiliate'
import { getToken, ensureFreshToken } from '@/lib/token-utils'
import { BACKEND_CONFIG } from '@/lib/api-config'

export default function AdminPayoutsPage() {
    const [payouts, setPayouts] = useState<PayoutResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    
            // 审核弹窗状态
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [showManualModal, setShowManualModal] = useState(false)
    const [selectedPayout, setSelectedPayout] = useState<PayoutResponse | null>(null)
    const [transactionId, setTransactionId] = useState('')
    const [adminNote, setAdminNote] = useState('')
    const [submitting, setSubmitting] = useState(false)
    
    // 管理员主动提现状态
    const [manualAffiliateId, setManualAffiliateId] = useState('')
    const [manualAmount, setManualAmount] = useState('')
    const [manualPaypalEmail, setManualPaypalEmail] = useState('')
    const [manualTransactionId, setManualTransactionId] = useState('')
    const [manualAdminNote, setManualAdminNote] = useState('')
    const [manualSubmitting, setManualSubmitting] = useState(false)

    useEffect(() => {
        fetchPayouts()
    }, [currentPage])

    const fetchPayouts = async () => {
        try {
            setLoading(true)
            const data = await affiliateService.getAllPayouts(currentPage, 20)
            setPayouts(data.content || [])
            setTotalPages(data.totalPages || 1)
            setTotalElements(data.totalElements || 0)
        } catch (error) {
            console.error('Failed to fetch payouts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleManualPayout = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!manualAffiliateId.trim()) {
            alert('请输入联盟客ID')
            return
        }
        
        const amount = parseFloat(manualAmount)
        if (!amount || amount <= 0) {
            alert('请输入有效的提现金额')
            return
        }

        try {
            setManualSubmitting(true)
            
            // 确保 Token 是新鲜的（如果快过期会自动刷新）
            const token = await ensureFreshToken(300) // 提前 5 分钟刷新
            
            console.log('[Manual Payout] Token exists:', !!token)
            console.log('[Manual Payout] Token length:', token?.length || 0)
            console.log('[Manual Payout] Token preview:', token ? token.substring(0, 20) + '...' : 'none')
            
            if (!token) {
                alert('未登录或登录已过期')
                return
            }
            
            const url = `${BACKEND_CONFIG.baseURL}/api/admin/V1/affiliate/${manualAffiliateId.toUpperCase()}/manual-payout`
            console.log('[Manual Payout] Request URL:', url)
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount,
                    paypalEmail: manualPaypalEmail || undefined,
                    transactionId: manualTransactionId || undefined,
                    adminNote: manualAdminNote || undefined
                })
            })
            
            console.log('[Manual Payout] Response status:', response.status)
            
            const data = await response.json()
            console.log('[Manual Payout] Response data:', data)
            
            if (!data.success) {
                throw new Error(data.message || '手动提现失败')
            }
            
            alert('手动提现成功！')
            setShowManualModal(false)
            setManualAffiliateId('')
            setManualAmount('')
            setManualPaypalEmail('')
            setManualTransactionId('')
            setManualAdminNote('')
            fetchPayouts()
        } catch (error: any) {
            console.error('Manual payout failed:', error)
            alert('手动提现失败: ' + (error.message || '未知错误'))
        } finally {
            setManualSubmitting(false)
        }
    }

    const handleApprove = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPayout) return

        try {
            setSubmitting(true)
            await approvePayout(selectedPayout.id, transactionId || undefined, adminNote || undefined)
            
            alert('提现审批通过！')
            setShowApproveModal(false)
            setTransactionId('')
            setAdminNote('')
            setSelectedPayout(null)
            fetchPayouts()
        } catch (error: any) {
            console.error('Failed to approve payout:', error)
            alert(error.message || '审批提现失败')
        } finally {
            setSubmitting(false)
        }
    }

    const handleReject = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedPayout) return

        if (!adminNote.trim()) {
            alert('请提供拒绝原因')
            return
        }

        try {
            setSubmitting(true)
            await rejectPayout(selectedPayout.id, adminNote)
            
            alert('提现已拒绝！')
            setShowRejectModal(false)
            setAdminNote('')
            setSelectedPayout(null)
            fetchPayouts()
        } catch (error: any) {
            console.error('Failed to reject payout:', error)
            alert(error.message || '拒绝提现失败')
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock size={12} /> 待审批
                    </span>
                )
            case 'PAID':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle size={12} /> 已支付
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <AlertCircle size={12} /> 已拒绝
                    </span>
                )
            default:
                return <span className="text-xs text-gray-500">{status}</span>
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">提现管理</h1>
                    <p className="text-sm text-gray-500 mt-1">审核和处理联盟客提现申请</p>
                </div>
                <button
                    onClick={() => setShowManualModal(true)}
                    className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                    <DollarSign size={16} /> 管理员主动提现
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">待处理</span>
                        <Clock className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                        {payouts.filter(p => p.status === 'PENDING').length}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">已支付</span>
                        <CheckCircle className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                        {payouts.filter(p => p.status === 'PAID').length}
                    </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-500">已拒绝</span>
                        <AlertCircle className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-2xl font-black text-gray-900">
                        {payouts.filter(p => p.status === 'REJECTED').length}
                    </div>
                </div>
            </div>

            {/* Payout List */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">所有提现申请</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        共 {totalElements} 条记录
                    </span>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            暂无提现记录
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {payouts.map((payout) => (
                                    <div key={payout.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div>
                                                    <span className="text-xs text-gray-500 font-medium">联盟客：</span>
                                                    <span className="text-sm font-bold text-gray-900">{payout.affiliateId}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-gray-500 font-medium">姓名：</span>
                                                    <span className="text-sm text-gray-700">{payout.affiliateName || '-'}</span>
                                                </div>
                                            </div>
                                            {getStatusBadge(payout.status)}
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                                            <div>
                                                <span className="text-xs text-gray-500 font-medium">金额：</span>
                                                <span className="text-lg font-black text-gray-900">${payout.amount.toFixed(2)}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 font-medium">PayPal：</span>
                                                <span className="text-xs font-mono text-gray-700">{payout.paypalEmail}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 font-medium">日期：</span>
                                                <span className="text-xs text-gray-700">{formatDate(payout.createdAt)}</span>
                                            </div>
                                            <div>
                                                <span className="text-xs text-gray-500 font-medium">方式：</span>
                                                <span className="text-xs text-gray-700">{payout.paymentMethod}</span>
                                            </div>
                                        </div>

                                        {payout.transactionId && (
                                            <div className="text-xs text-gray-500 mb-2">
                                                <span className="font-medium">交易 ID：</span>
                                                <span className="font-mono">{payout.transactionId}</span>
                                            </div>
                                        )}

                                        {payout.adminNote && (
                                            <div className="text-xs text-gray-500 mb-3">
                                                <span className="font-medium">管理员备注：</span>
                                                {payout.adminNote}
                                            </div>
                                        )}

                                        {payout.status === 'PENDING' && (
                                            <div className="pt-3 border-t border-gray-100 flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayout(payout)
                                                        setShowApproveModal(true)
                                                    }}
                                                    className="px-4 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-1.5"
                                                >
                                                    <CheckCircle size={14} /> Approve
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedPayout(payout)
                                                        setShowRejectModal(true)
                                                    }}
                                                    className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1.5"
                                                >
                                                    <X size={14} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalElements={totalElements}
                                    onPageChange={setCurrentPage}
                                />
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Approve Modal */}
            {showApproveModal && selectedPayout && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">Approve Payout</h2>
                            <button
                                onClick={() => {
                                    setShowApproveModal(false)
                                    setTransactionId('')
                                    setAdminNote('')
                                    setSelectedPayout(null)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleApprove} className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Affiliate:</span>
                                    <span className="font-bold">{selectedPayout.affiliateId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-black text-green-600">${selectedPayout.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">PayPal:</span>
                                    <span className="font-mono text-xs">{selectedPayout.paypalEmail}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Transaction ID (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={transactionId}
                                    onChange={(e) => setTransactionId(e.target.value)}
                                    placeholder="PAYPAL_TXN_XXX"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Admin Note (Optional)
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Add any notes..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowApproveModal(false)
                                        setTransactionId('')
                                        setAdminNote('')
                                        setSelectedPayout(null)
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Approve & Pay'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Manual Payout Modal */}
            {showManualModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">管理员主动提现</h2>
                            <button
                                onClick={() => {
                                    setShowManualModal(false)
                                    setManualAffiliateId('')
                                    setManualAmount('')
                                    setManualPaypalEmail('')
                                    setManualTransactionId('')
                                    setManualAdminNote('')
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleManualPayout} className="space-y-4">
                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <p className="text-sm text-indigo-800">
                                    <span className="font-bold">提示：</span>此操作将直接打款，跳过审批流程。
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    联盟客ID <span className="text-red-600">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={manualAffiliateId}
                                    onChange={(e) => setManualAffiliateId(e.target.value.toUpperCase())}
                                    placeholder="AFFXXX"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    提现金额 (USD) <span className="text-red-600">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0.01"
                                        value={manualAmount}
                                        onChange={(e) => setManualAmount(e.target.value)}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    PayPal邮箱（可选）
                                </label>
                                <input
                                    type="email"
                                    value={manualPaypalEmail}
                                    onChange={(e) => setManualPaypalEmail(e.target.value)}
                                    placeholder="affiliate@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                />
                                <p className="text-xs text-gray-500 mt-1">不填则使用联盟客默认邮箱</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    交易ID（可选）
                                </label>
                                <input
                                    type="text"
                                    value={manualTransactionId}
                                    onChange={(e) => setManualTransactionId(e.target.value)}
                                    placeholder="PAYPAL_TXN_XXX"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    管理员备注（可选）
                                </label>
                                <textarea
                                    value={manualAdminNote}
                                    onChange={(e) => setManualAdminNote(e.target.value)}
                                    placeholder="添加备注..."
                                    rows={3}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowManualModal(false)
                                        setManualAffiliateId('')
                                        setManualAmount('')
                                        setManualPaypalEmail('')
                                        setManualTransactionId('')
                                        setManualAdminNote('')
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={manualSubmitting}
                                    className="flex-1 px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {manualSubmitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            处理中...
                                        </>
                                    ) : (
                                        '确认打款'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Reject Modal */}
            {showRejectModal && selectedPayout && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">Reject Payout</h2>
                            <button
                                onClick={() => {
                                    setShowRejectModal(false)
                                    setAdminNote('')
                                    setSelectedPayout(null)
                                }}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <X size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleReject} className="space-y-4">
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-800">
                                    <span className="font-bold">Warning:</span> This action cannot be undone.
                                </p>
                            </div>

                            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Affiliate:</span>
                                    <span className="font-bold">{selectedPayout.affiliateId}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Amount:</span>
                                    <span className="font-black text-gray-900">${selectedPayout.amount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Rejection Reason <span className="text-red-600">*</span>
                                </label>
                                <textarea
                                    value={adminNote}
                                    onChange={(e) => setAdminNote(e.target.value)}
                                    placeholder="Please explain why this payout is being rejected..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRejectModal(false)
                                        setAdminNote('')
                                        setSelectedPayout(null)
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Reject Payout'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
