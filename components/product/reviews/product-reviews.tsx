'use client';

import { useState } from 'react';
import { Star, CheckCircle2, ThumbsUp, PenLine, ChevronDown } from 'lucide-react';
import { Review, ReviewStats } from '@/types/review';

// --- MOCK DATA (模拟数据，对接后端前先看效果) ---
const MOCK_STATS: ReviewStats = {
    averageRating: 4.9,
    totalReviews: 128,
    distribution: { 5: 110, 4: 12, 3: 4, 2: 1, 1: 1 }
};

const MOCK_REVIEWS: Review[] = [
    {
        id: '1',
        productId: '10',
        authorName: 'Sarah M.',
        rating: 5,
        title: 'Absolutely stunning design',
        content: 'I was hesitant at first because of the price, but the quality is unmatched. The silicone is so soft and the motor is surprisingly quiet. Highly recommend.',
        createdAt: '2023-10-15',
        isVerified: true,
        helpfulCount: 24
    },
    {
        id: '2',
        productId: '10',
        authorName: 'Anonymous User',
        rating: 5,
        title: 'Discreet and powerful',
        content: 'Love how discreet the shipping was. The product itself is a work of art. It looks beautiful on my nightstand.',
        createdAt: '2023-11-02',
        isVerified: true,
        helpfulCount: 12
    },
    {
        id: '3',
        productId: '10',
        authorName: 'Jessica L.',
        rating: 4,
        title: 'Great, but battery life could be longer',
        content: 'The sensations are amazing, but I wish the battery lasted a bit longer on the highest setting. Still a 5-star experience overall.',
        createdAt: '2023-12-10',
        isVerified: true,
        helpfulCount: 8
    }
];

export default function ProductReviews() {
    const [isWriting, setIsWriting] = useState(false);
    const [reviews, setReviews] = useState(MOCK_REVIEWS);

    // 渲染星星辅助函数
    const renderStars = (rating: number, size = 16) => {
        return (
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
    };

    return (
        <section className="bg-white py-20 border-t border-gray-100" id="reviews">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* 1. Header & Summary Grid */}
                <div className="grid md:grid-cols-12 gap-12 mb-16">

                    {/* Left: Title & Average */}
                    <div className="md:col-span-4 text-center md:text-left">
                        <h2 className="text-3xl font-bold font-['Playfair_Display'] text-gray-900 mb-4">Reviews</h2>
                        <div className="flex flex-col items-center md:items-start">
                            <div className="text-6xl font-bold text-gray-900 font-['Playfair_Display'] mb-2">
                                {MOCK_STATS.averageRating}
                            </div>
                            <div className="mb-2">{renderStars(5, 20)}</div>
                            <p className="text-gray-500 text-sm">Based on {MOCK_STATS.totalReviews} reviews</p>
                        </div>

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
                            const count = MOCK_STATS.distribution[star as keyof typeof MOCK_STATS.distribution];
                            const percentage = (count / MOCK_STATS.totalReviews) * 100;
                            return (
                                <div key={star} className="flex items-center gap-4 text-sm">
                                    <div className="w-8 font-bold text-gray-900">{star} ★</div>
                                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded-full"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <div className="w-8 text-right text-gray-400 text-xs">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 2. Write Review Form (Collapsible) */}
                {isWriting && (
                    <div className="mb-16 p-8 bg-gray-50 rounded-2xl animate-in fade-in slide-in-from-top-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold font-['Playfair_Display']">Write your review</h3>
                            <button onClick={() => setIsWriting(false)} className="text-gray-400 hover:text-black">Cancel</button>
                        </div>
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
                                    <input type="text" placeholder="e.g. Secret Admirer" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors" />
                                    <p className="text-[10px] text-gray-400 mt-1">Your privacy is important. Feel free to use an alias.</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Rating</label>
                                    <select className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors">
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
                                <input type="text" placeholder="Summarize your experience" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Review</label>
                                <textarea rows={4} placeholder="What did you like or dislike? How was the quality?" className="w-full bg-white border border-gray-200 px-4 py-3 rounded-lg focus:outline-none focus:border-black transition-colors resize-none"></textarea>
                            </div>
                            <button type="button" className="px-8 py-3 bg-black text-white rounded-full font-bold text-sm hover:bg-[#E11D48] transition-colors">Submit Review</button>
                        </form>
                    </div>
                )}

                {/* 3. Review List */}
                <div className="space-y-8">
                    {reviews.map((review) => (
                        <div key={review.id} className="border-b border-gray-100 pb-8 last:border-0">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-gray-900">{review.authorName}</span>
                                        {review.isVerified && (
                                            <span className="flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                <CheckCircle2 size={10} /> Verified Buyer
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {renderStars(review.rating)}
                                        <span className="text-xs text-gray-400">{review.createdAt}</span>
                                    </div>
                                </div>
                            </div>

                            <h4 className="font-bold text-lg text-gray-900 mb-2 font-['Playfair_Display']">{review.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed mb-4 font-light">
                                {review.content}
                            </p>

                            <button className="flex items-center gap-2 text-xs text-gray-400 hover:text-black transition-colors group">
                                <ThumbsUp size={14} className="group-hover:scale-110 transition-transform" />
                                Helpful ({review.helpfulCount})
                            </button>
                        </div>
                    ))}
                </div>

                {/* 4. Load More */}
                <div className="mt-12 text-center">
                    <button className="text-xs font-bold uppercase tracking-widest border-b border-black pb-1 hover:text-[#E11D48] hover:border-[#E11D48] transition-colors">
                        Load More Reviews
                    </button>
                </div>

            </div>
        </section>
    );
}