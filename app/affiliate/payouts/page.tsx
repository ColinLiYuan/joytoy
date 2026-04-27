'use client'

import { useEffect, useState } from 'react'
import { Wallet, DollarSign, Clock, CheckCircle, AlertCircle, ChevronLeft, ChevronRight, Loader2, ShieldCheck } from 'lucide-react'
import { affiliateService } from '@/services/affiliateService'
import { PayoutResponse } from '@/types/affiliate'
import { getUserId } from '@/lib/user-utils'
import { useAuth } from '@/contexts/authContext'
import { requestAffiliatePayout } from '@/app/actions/affiliate'

export default function AffiliatePayoutsPage() {
    const [payouts, setPayouts] = useState<PayoutResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [currentPage, setCurrentPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [totalElements, setTotalElements] = useState(0)
    const [showRequestModal, setShowRequestModal] = useState(false)
    const [requestAmount, setRequestAmount] = useState('')
    const [paypalEmail, setPaypalEmail] = useState('')
    const [submitting, setSubmitting] = useState(false)
    const [authError, setAuthError] = useState(false)
    const { isClient, openAuthModal } = useAuth()

    useEffect(() => {
        if (isClient) {
            fetchPayouts()
        }
    }, [currentPage, isClient])

    const fetchPayouts = async () => {
        // ✅ 先检查是否登录
        const userId = getUserId();
        if (!userId) {
            console.log('[Affiliate Payouts] User not logged in');
            setAuthError(true);
            setLoading(false);
            return;
        }

        try {
            setLoading(true)
            const data = await affiliateService.getMyPayouts(currentPage, 20)
            setPayouts(data.content || [])
            setTotalPages(data.totalPages || 1)
            setTotalElements(data.totalElements || 0)
        } catch (error) {
            console.error('Failed to fetch payouts:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleRequestPayout = async (e: React.FormEvent) => {
        e.preventDefault()
        
        const amount = parseFloat(requestAmount)
        if (!amount || amount < 50) {
            alert('Minimum withdrawal amount is $50.00')
            return
        }

        if (!paypalEmail) {
            alert('Please enter your PayPal email address')
            return
        }

        try {
            setSubmitting(true)
            await requestAffiliatePayout({
                amount,
                paypalEmail
            })
            
            alert('Payout request submitted successfully! Waiting for admin approval.')
            setShowRequestModal(false)
            setRequestAmount('')
            setPaypalEmail('')
            fetchPayouts() // Refresh the list
        } catch (error: any) {
            console.error('Payout failed:', error)
            
            // Extract error message from backend response
            let errorMsg = 'Payout request failed. Please try again later.'
            if (error?.message) {
                // 处理各种错误格式
                if (error.message.includes('insufficient') || error.message.includes('余额不足')) {
                    errorMsg = 'Insufficient balance. Your current balance is less than the requested amount.'
                } else if (error.message.includes('not logged in') || error.message.includes('未登录')) {
                    errorMsg = 'Please login first to request payout.'
                } else if (error.message.includes('affiliate member') || error.message.includes('联盟成员')) {
                    errorMsg = 'Your account is not an affiliate member. Cannot request payout.'
                } else if (error.message.includes('payout failed') || error.message.includes('提现失败')) {
                    // 提取后端返回的英文错误信息
                    errorMsg = error.message.replace('提现失败: ', '').replace('payout failed: ', '')
                } else {
                    errorMsg = error.message
                }
            }
            
            alert(errorMsg)
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'PENDING':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                        <Clock size={12} /> Pending
                    </span>
                )
            case 'PAID':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        <CheckCircle size={12} /> Paid
                    </span>
                )
            case 'REJECTED':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                        <AlertCircle size={12} /> Rejected
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
            {/* Not logged in state */}
            {authError && (
                <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-dashed border-gray-200 p-12">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                        <ShieldCheck className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">Please Login</h3>
                    <p className="text-gray-500 text-sm mb-6 text-center max-w-md">
                        You need to login as an affiliate to manage your payouts.
                    </p>
                    <button
                        onClick={() => openAuthModal('login', { 
                            onSuccess: () => window.location.reload() 
                        })}
                        className="inline-block bg-black text-white px-8 py-3 rounded-lg text-sm font-bold shadow-lg hover:bg-gray-800 transition-all hover:-translate-y-0.5"
                    >
                        Login to Continue
                    </button>
                </div>
            )}

            {!authError && (
            <>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900">Payout Management</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your withdrawal requests</p>
                </div>
                <button
                    onClick={() => setShowRequestModal(true)}
                    className="px-6 py-3 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
                >
                    <DollarSign size={16} /> Request Payout
                </button>
            </div>

            {/* Info Card */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Wallet className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                        <h3 className="text-sm font-bold text-blue-900">Payout Information</h3>
                        <ul className="mt-2 text-xs text-blue-700 space-y-1">
                            <li>• Minimum payout: $50</li>
                            <li>• Payment via PayPal</li>
                            <li>• 1-3 business days after approval</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Payout List */}
            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Wallet className="h-5 w-5 text-gray-400" />
                        <h3 className="font-bold text-gray-900">Payout History</h3>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                        Total: {totalElements} records
                    </span>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="animate-spin text-gray-400" size={24} />
                        </div>
                    ) : payouts.length === 0 ? (
                        <div className="py-12 text-center text-gray-400 text-sm">
                            No payout records found
                        </div>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {payouts.map((payout) => (
                                    <div key={payout.id} className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                                <Clock size={12} />
                                                {formatDate(payout.createdAt)}
                                            </div>
                                            {getStatusBadge(payout.status)}
                                        </div>

                                        <div className="flex items-center justify-between mb-2">
                                            <div>
                                                <span className="text-xs text-gray-500 font-medium">Amount: </span>
                                                <span className="text-lg font-black text-gray-900">${payout.amount.toFixed(2)}</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-xs text-gray-500 font-medium">PayPal: </span>
                                                <span className="text-xs font-mono text-gray-700">{payout.paypalEmail}</span>
                                            </div>
                                        </div>

                                        {payout.transactionId && (
                                            <div className="text-xs text-gray-500">
                                                <span className="font-medium">Transaction ID: </span>
                                                <span className="font-mono">{payout.transactionId}</span>
                                            </div>
                                        )}

                                        {payout.adminNote && (
                                            <div className="mt-2 pt-2 border-t border-gray-100">
                                                <p className="text-xs text-gray-500">
                                                    <span className="font-medium">Admin Note: </span>
                                                    {payout.adminNote}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-xs text-gray-500">
                                        Page {currentPage + 1} of {totalPages}
                                    </p>
                                    <div className="flex space-x-2">
                                        <button
                                            disabled={currentPage === 0}
                                            onClick={() => setCurrentPage(p => p - 1)}
                                            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            <ChevronLeft size={16} />
                                        </button>
                                        <button
                                            disabled={currentPage >= totalPages - 1}
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

            {/* Request Payout Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black text-gray-900">Request Payout</h2>
                            <button
                                onClick={() => setShowRequestModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <AlertCircle size={20} className="text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleRequestPayout} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    Payout Amount (USD)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="50"
                                        value={requestAmount}
                                        onChange={(e) => setRequestAmount(e.target.value)}
                                        placeholder="50.00"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                        required
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Minimum amount: $50.00</p>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">
                                    PayPal Email
                                </label>
                                <input
                                    type="email"
                                    value={paypalEmail}
                                    onChange={(e) => setPaypalEmail(e.target.value)}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    required
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-1 px-4 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        <>{'Submit Request'}</>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            </>
        )}
        </div>
    )
}
