'use client';

import { useState, useEffect, useCallback } from 'react';
import { Star, CheckCircle2, ThumbsUp, PenLine, Loader2, AlertCircle } from 'lucide-react';
import { Review, ReviewStats } from '@/types/review';
import { reviewService } from '@/services/reviewService';
import { createReview, createReviewAsGuest } from '@/app/actions/review'; // 使用 Server Action
import { useAuth } from '@/contexts/authContext'; // 假设你有这个 hook
import { useToast } from '@/contexts/toastContext';

interface ProductReviewsProps {
    productId: number;
}

// 默认空统计数据
const INITIAL_STATS: ReviewStats = {
    averageRating: 0,
    totalReviews: 0,
    distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
};

export default function ProductReviews({ productId }: ProductReviewsProps) {
    // State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<ReviewStats>(INITIAL_STATS);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // UI State
    const [isLoading, setIsLoading] = useState(true);
    const [isWriting, setIsWriting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hooks
    const { isLoggedIn, userInfo } = useAuth(); // 获取用户信息
    const { showToast } = useToast();

    // 加载评论数据
    const fetchReviews = useCallback(async (pageNum: number) => {
        try {
            setIsLoading(true);
            const data = await reviewService.getReviews(productId, pageNum, 5);

            // 如果是第0页，直接覆盖；如果是加载更多，追加
            if (pageNum === 0) {
                setReviews(data.content || []);
            } else {
                setReviews(prev => [...prev, ...(data.content || [])]);
            }

            setTotalPages(data.totalPages || 0);

            // 如果后端返回了统计数据，更新统计
            if (data.stats) {
                setStats(data.stats);
            }
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    // 初始化加载
    useEffect(() => {
        fetchReviews(0);
    }, [fetchReviews]);

    // 提交评论
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
    
        const formData = new FormData(e.currentTarget);
        
        // 根据登录状态调用不同的接口
        if (isLoggedIn) {
            // 登录用户: 调用 authenticated 接口
            const requestData = {
                productId,
                rating: Number(formData.get('rating')),
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                authorName: formData.get('authorName') as string || 'Anonymous',
            };
    
            try {
                const success = await createReview(requestData);
                if (success) {
                    showToast('success', 'Submitted', 'Your review has been submitted for moderation.');
                    setIsWriting(false);
                    (e.target as HTMLFormElement).reset();
                    await fetchReviews(0);
                } else {
                    showToast('error', 'Session Expired', 'Please login again to submit a review.');
                }
            } catch (error: any) {
                showToast('error', 'Error', error.message || 'Failed to submit review');
            } finally {
                setIsSubmitting(false);
            }
        } else {
            // 游客: 调用 guest 接口
            const requestData = {
                productId,
                rating: Number(formData.get('rating')),
                title: formData.get('title') as string,
                content: formData.get('content') as string,
                authorName: formData.get('authorName') as string || 'Anonymous',
                email: formData.get('email') as string,
            };
    
            try {
                const success = await createReviewAsGuest(requestData);
                if (success) {
                    showToast('success', 'Submitted', 'Your review has been submitted for moderation.');
                    setIsWriting(false);
                    (e.target as HTMLFormElement).reset();
                    await fetchReviews(0);
                } else {
                    showToast('error', 'Error', 'Failed to submit review. Please try again.');
                }
            } catch (error: any) {
                showToast('error', 'Error', error.message || 'Failed to submit review');
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    // 渲染星星
    const renderStars = (rating: number, size = 16) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    size={size}
                    className={`${star <= rating ? 'fill-[#E11D48] text-[#E11D48]' : 'fill-gray-200 text-gray-200'}`}
                />
            ))}
        </div>
    );

    return (
        <section className="bg-white py-16 lg:py-24 border-t border-gray-100" id="reviews">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* 1. Header & Summary Grid */}
                <div className="grid md:grid-cols-12 gap-12 mb-16">
                    {/* Left: Summary */}
                    <div className="md:col-span-4 text-center md:text-left">
                        <h2 className="text-3xl font-bold font-['Playfair_Display'] text-gray-900 mb-4">Reviews</h2>
                        {stats.totalReviews > 0 ? (
                            <div className="flex flex-col items-center md:items-start">
                                <div className="text-6xl font-bold text-gray-900 font-['Playfair_Display'] mb-2">
                                    {stats.averageRating.toFixed(1)}
                                </div>
                                <div className="mb-2">{renderStars(Math.round(stats.averageRating), 20)}</div>
                                {/*<p className="text-gray-500 text-sm">Based on {stats.totalReviews} reviews</p>*/}
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-4">No reviews yet. Be the first to share your experience.</p>
                        )}

                        <button
                            onClick={() => setIsWriting(!isWriting)}
                            className="mt-8 w-full md:w-auto px-6 py-3 bg-black text-white rounded-full text-sm font-bold uppercase tracking-widest hover:bg-[#E11D48] transition-colors flex items-center justify-center gap-2"
                        >
                            <PenLine size={16} /> Write a Review
                        </button>
                    </div>

                    {/* Right: Distribution Bars */}
                    <div className="md:col-span-8 flex flex-col justify-center space-y-3">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = stats.distribution[star as keyof typeof stats.distribution] || 0;
                            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                            return (
                                <div key={star} className="flex items-center gap-4 text-sm">
                                    <div className="w-8 font-bold text-gray-900">{star} ★</div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-black rounded-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
                                    </div>
                                    <div className="w-8 text-right text-gray-400 text-xs">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Write Review Form */}
                {isWriting && (
                    <div className="mb-16 p-8 bg-[#F9FAFB] rounded-2xl animate-in fade-in slide-in-from-top-4 border border-gray-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-['Playfair_Display']">Write your review</h3>
                            <button onClick={() => setIsWriting(false)} className="text-gray-400 hover:text-black transition-colors">Cancel</button>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
                                    <input
                                        name="authorName"
                                        type="text"
                                        placeholder="e.g. Secret Admirer"
                                        defaultValue={userInfo?.displayName || ''}
                                        className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors"
                                        required
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">This will be displayed publicly.</p>
                                </div>

                                {/* 游客显示邮箱输入框 */}
                                {!isLoggedIn && (
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Email (Private)</label>
                                        <input
                                            name="email"
                                            type="email"
                                            placeholder="john@example.com"
                                            className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors"
                                            required
                                        />
                                        <p className="text-[10px] text-gray-400 mt-1">For verification only. Hidden from public.</p>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                                    <select name="rating" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors">
                                        <option value="5">★★★★★ - Excellent</option>
                                        <option value="4">★★★★☆ - Good</option>
                                        <option value="3">★★★☆☆ - Average</option>
                                        <option value="2">★★☆☆☆ - Poor</option>
                                        <option value="1">★☆☆☆☆ - Terrible</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Review Title</label>
                                <input name="title" type="text" placeholder="Summarize your experience" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors" required />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Review</label>
                                <textarea name="content" rows={4} placeholder="How was the quality? Did it meet your expectations?" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors resize-none" required></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#E11D48] transition-colors disabled:opacity-70 flex items-center gap-2"
                            >
                                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Submit Review'}
                            </button>
                        </form>
                    </div>
                )}

                {/* 3. Review List */}
                <div className="space-y-8">
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0 animate-in fade-in">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="font-bold text-gray-900">{review.authorName}</span>
                                            {review.isVerified && (
                                                <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                                                    <CheckCircle2 size={10} /> Verified Buyer
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            {renderStars(review.rating)}
                                            <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <h4 className="font-bold text-lg text-gray-900 mb-2 font-['Playfair_Display']">{review.title}</h4>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 font-light">
                                    {review.content}
                                </p>

                                {/*<button className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors group">*/}
                                {/*    <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />*/}
                                {/*    Helpful ({review.helpfulCount})*/}
                                {/*</button>*/}
                            </div>
                        ))
                    ) : (
                        !isLoading && <div className="text-center py-10 text-gray-400 text-sm italic">No reviews yet.</div>
                    )}

                    {isLoading && (
                        <div className="py-10 flex justify-center text-gray-400">
                            <Loader2 className="animate-spin" />
                        </div>
                    )}
                </div>

                {/* 4. Load More */}
                {!isLoading && page < totalPages - 1 && (
                    <div className="mt-12 text-center">
                        <button
                            onClick={() => {
                                const nextPage = page + 1;
                                setPage(nextPage);
                                fetchReviews(nextPage);
                            }}
                            className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#E11D48] hover:border-[#E11D48] transition-colors"
                        >
                            Load More Reviews
                        </button>
                    </div>
                )}

            </div>
        </section>
    );
}