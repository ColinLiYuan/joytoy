'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X, Loader2, ChevronRight, Sparkles } from 'lucide-react';
import { Z_INDEX } from '@/lib/constants/z-index';
import { getProductImageUrl } from '@/lib/image-utils';
import { ProductResponse } from '@/types/product';

// 热门搜索词
const TRENDING = ["Rabbit", "Wand", "Couples", "Lingerie", "G-Spot", "Men"];

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<ProductResponse[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    // 自动聚焦 & 锁定滚动
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    // 搜索防抖逻辑
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (query.trim().length >= 2) {
                setIsLoading(true);
                try {
                    // ✅ 这里调用你的后端搜索 API
                    // const data = await searchService.searchProducts(query);

                    // 👇 临时 Mock 数据
                    const data: ProductResponse[] = [];
                    setResults(data);
                } catch (e) {
                    console.error(e);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

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
                {/* Search Header */}
                <div className="flex items-center p-4 border-b border-gray-100 gap-3">
                    <Search className="text-gray-400 w-5 h-5" />
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search for pleasure..."
                        className="flex-1 text-lg outline-none placeholder:text-gray-300 text-gray-900 h-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {isLoading ? (
                        <Loader2 className="animate-spin text-gray-400 w-5 h-5" />
                    ) : (
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    )}
                </div>

                {/* Results Area */}
                <div className="max-h-[60vh] overflow-y-auto p-6 bg-gray-50/50">

                    {/* 1. 默认状态：热门搜索 */}
                    {query.length < 2 && (
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Sparkles size={12} /> Trending Now
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {TRENDING.map(term => (
                                    <button
                                        key={term}
                                        onClick={() => setQuery(term)}
                                        className="px-4 py-2 bg-white border border-gray-200 hover:border-black hover:text-black text-gray-600 rounded-full text-sm transition-all shadow-sm"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 2. 有结果 */}
                    {query.length >= 2 && results.length > 0 && (
                        <div className="grid gap-3">
                            {results.map(product => (
                                <Link
                                    key={product.id}
                                    href={`/toys${product.slug}`}
                                    onClick={onClose}
                                    className="flex items-center gap-4 p-3 bg-white rounded-xl border border-gray-100 hover:border-black/20 hover:shadow-md transition-all group"
                                >
                                    <div className="w-14 h-14 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                        <Image
                                            src={getProductImageUrl('', product.image)}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 group-hover:text-pink-600 transition-colors line-clamp-1">
                                            {product.title}
                                        </h4>
                                        <p className="text-sm font-bold text-gray-900 mt-0.5">
                                            ${product.currentPrice}
                                        </p>
                                    </div>
                                    <ChevronRight className="text-gray-300 group-hover:text-black" size={16} />
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* 3. 无结果 */}
                    {query.length >= 2 && !isLoading && results.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <p>No results for "{query}"</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}