'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X, Loader2, ChevronRight, Sparkles, AlertCircle } from 'lucide-react';
import { Z_INDEX } from '@/lib/constants/z-index';
import { getProductImageUrl } from '@/lib/image-utils';
import { ProductResponse } from '@/types/product';
// ✅ 直接引入你提供的客户端 Service
import { productService } from '@/services/productService';

// 热门搜索词
const TRENDING = ["Rabbit", "Wand", "Onyx", "Swan", "G-Spot", "Muse"];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 1. 自动聚焦 & 锁定背景滚动
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // 2. 搜索逻辑 (防抖 + 调用 Service)
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    // ✅ 这里直接调用你的 productService.searchProducts
                    // 第2个参数是page(0), 第3个参数是size(5)
                    const data = await productService.searchProducts(query, 0, 5);

                    // Service 返回的是分页对象，我们要取 content
                    setResults(data.content || []);
                } catch (e) {
                    console.error("Search error:", e);
                    setResults([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 400); // 400ms 防抖

        return () => clearTimeout(timer);
    }, [query]);

    // 3. 跳转逻辑
    const goToSearchPage = (keyword: string) => {
        if (!keyword.trim()) return;
        onClose();
        // 跳转到独立的搜索结果页
        router.push(`/search?q=${encodeURIComponent(keyword)}`);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            goToSearchPage(query);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-fadeIn"
            style={{ zIndex: Z_INDEX.MODAL }}
            onClick={onClose}
        >
            <div
                className="w-full max-w-2xl mx-auto mt-20 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                {/* --- Search Header --- */}
                <div className="flex items-center p-4 border-b border-gray-100 gap-3">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for pleasure..."
                        className="flex-1 text-lg outline-none placeholder:text-gray-300 text-gray-900 h-10 bg-transparent"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    {isLoading ? (
                        <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
                    ) : (
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* --- Results Area --- */}
                <div className="max-h-[60vh] overflow-y-auto p-6 bg-gray-50/50">

                    {/* Case A: 默认状态 (热门搜索) */}
                    {query.length < 2 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={12} /> Trending Now
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {TRENDING.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => goToSearchPage(term)}
                                        className="px-4 py-2 bg-white border border-gray-200 hover:border-black hover:text-black text-gray-600 rounded-full text-sm transition-all shadow-sm"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Case B: 有搜索结果 */}
                    {query.length >= 2 && results.length > 0 && !isLoading && (
                        <div className="grid gap-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                                Top Suggestions
                            </h3>
                            {results.map(product => (
                                <Link
                                    key={product.id}
                                    // 假设你的产品详情页路由是 /toys/[slug]
                                    href={`/toys/${product.slug}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-pink-200 hover:shadow-md transition-all group"
                                >
                                    <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={getProductImageUrl(undefined, product.image)}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                            sizes="56px"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                                            {product.title}
                                        </h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-sm font-bold text-gray-900">
                                                ${product.currentPrice}
                                            </span>
                                            {product.originalPrice && product.originalPrice > product.currentPrice && (
                                                <span className="text-xs text-gray-400 line-through">
                                                    ${product.originalPrice}
                                                 </span>
                                            )}
                                        </div>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-pink-500" size={16} />
                                </Link>
                            ))}

                            {/* View All Button */}
                            <button
                                onClick={() => goToSearchPage(query)}
                                className="w-full py-3 mt-2 text-center text-sm font-bold text-pink-600 hover:bg-pink-50 rounded-lg transition-colors flex items-center justify-center gap-1"
                            >
                                View all results for "{query}" <ChevronRight size={14} />
                            </button>
                        </div>
                    )}

                    {/* Case C: 无结果 */}
                    {query.length >= 2 && !isLoading && results.length === 0 && (
                        <div className="text-center py-10 text-gray-400 flex flex-col items-center">
                            <AlertCircle className="w-8 h-8 mb-3 text-gray-300" />
                            <p>No matches found for "{query}"</p>
                            <p className="text-sm mt-1 text-gray-400">Try checking your spelling or use more general terms.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}