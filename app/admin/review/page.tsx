// app/admin/review/route.ts
'use client'

import { useEffect, useState } from 'react'
import { reviewService } from '@/services/reviewService'
import { Review, ReviewStatus } from '@/types/review' // 确保 ReviewStatus 枚举值是 'PENDING', 'APPROVED', 'REJECTED'
import {
    CheckCircle,
    XCircle,
    AlertCircle, // 这个图标似乎没有用到，可以移除
    Star,
    Loader2
} from 'lucide-react'

export default function AdminReviewPage() {
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    // ✅ 修正：确保 initial state 是 'ALL'，并且类型正确
    const [currentStatus, setCurrentStatus] = useState<'ALL' | ReviewStatus>('ALL')
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    // 数据加载
    const fetchReviews = async () => {
        setLoading(true)
        try {
            // 如果是 ALL，传 undefined 给 service，否则传当前状态
            const statusFilter = currentStatus === 'ALL' ? undefined : currentStatus;
            const data = await reviewService.getAdminReviews(page, 10, statusFilter);
            setReviews(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Failed to load reviews:', error)
            alert('加载评论失败')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [page, currentStatus]) // 依赖项正确

    // 审核操作
    const handleAudit = async (reviewId: string | number, status: 'APPROVED' | 'REJECTED') => {
        const actionText = status === 'APPROVED' ? '通过' : '拒绝';

        // 1. 确认框
        if (!window.confirm(`确认要【${actionText}】这条评论吗？`)) {
            return;
        }

        try {
            // 2. 调用接口
            await reviewService.auditReview(reviewId, status);
            // 3. 刷新列表
            fetchReviews();
        } catch (error: any) {
            console.error(error);
            alert(`操作失败: ${error.message}`);
        }
    }

    // 渲染星级
    const renderStars = (rating: number) => {
        return (
            <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`}
                    />
                ))}
            </div>
        )
    }

    // 状态标签渲染 (已优化)
    const getStatusBadge = (status: ReviewStatus) => {
        let text = '';
        let bgColor = '';
        let textColor = '';

        switch (status) {
            case 'APPROVED':
                text = '已通过';
                bgColor = 'bg-green-100';
                textColor = 'text-green-700';
                break;
            case 'REJECTED':
                text = '已拒绝';
                bgColor = 'bg-red-100';
                textColor = 'text-red-700';
                break;
            case 'PENDING': // 假设你的后端枚举是 PENDING
            default:
                text = '待审核';
                bgColor = 'bg-yellow-100';
                textColor = 'text-yellow-700';
                break;
        }
        return <span className={`px-2 py-1 text-xs font-semibold rounded-full ${bgColor} ${textColor}`}>{text}</span>
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">评论管理</h1>
            </div>

            {/* 状态筛选 Tabs */}
            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    {/* ✅ 修正 Map 的 key */}
                    {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => {
                                setCurrentStatus(tab)
                                setPage(0) // 切换Tab重置页码
                            }}
                            className={`
                                whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm
                                ${currentStatus === tab
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
                            `}
                        >
                            {tab === 'ALL' && '全部'}
                            {tab === 'PENDING' && '待审核'}
                            {tab === 'APPROVED' && '已通过'}
                            {tab === 'REJECTED' && '已拒绝'}
                        </button>
                    ))}
                </nav>
            </div>

            {/* 表格区域 */}
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                {loading ? (
                    <div className="p-10 flex justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">商品 / 用户</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">评分 / 内容</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">时间</th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">操作</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {reviews?.length === 0 ? (
                            <tr>
                                {/* ✅ 修正 colspan 为 5 */}
                                <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                    暂无评论数据
                                </td>
                            </tr>
                        ) : (
                            reviews?.map((review) => (
                                <tr key={review.id}>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                                <span className="text-sm font-medium text-gray-900">
                                                    ID: {review.id}
                                                </span>
                                            <span className="text-sm text-indigo-600 truncate max-w-[150px]">
                                                    {review.productName || `Product #${review.productId}`}
                                                </span>
                                            <div className="mt-1 text-xs text-gray-500">
                                                {review.authorName} <br/>
                                                {review.email && <span className="text-gray-400">({review.email})</span>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="mb-1">{renderStars(review.rating)}</div>
                                        <div className="text-sm font-bold text-gray-800">{review.title}</div>
                                        <div className="text-sm text-gray-600 line-clamp-2 max-w-md" title={review.content}>
                                            {review.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {getStatusBadge(review.status)} {/* 使用 getStatusBadge */}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </td>

                                    {/* ✅ 操作列：只保留一个，逻辑统一 */}
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* 仅待审核时显示操作按钮 */}
                                        {review.status === 'PENDING' && (
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    onClick={() => handleAudit(review.id, 'APPROVED')}
                                                    className="text-green-600 hover:text-green-900 inline-flex items-center gap-1"
                                                    title="通过审核"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span className="hidden sm:inline">通过</span>
                                                </button>
                                                <button
                                                    onClick={() => handleAudit(review.id, 'REJECTED')}
                                                    className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                                                    title="拒绝评论"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                    <span className="hidden sm:inline">拒绝</span>
                                                </button>
                                            </div>
                                        )}
                                        {/* 非待审核状态，显示“已审核”或“不可操作” */}
                                        {review.status !== 'PENDING' && (
                                            <span className="text-gray-400">
                                                {review.status === 'APPROVED' ? '已通过' : '已拒绝'}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                )}

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:justify-end">
                            <button
                                onClick={() => setPage(p => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                上一页
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                disabled={page >= totalPages - 1}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                            >
                                下一页
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}