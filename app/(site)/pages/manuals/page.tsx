'use client';

import { useState, useEffect } from 'react';
import { Search, FileText, Download, ArrowRight, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { MANUALS_DATA } from '@/lib/constants/manuals-data';
import { getProductImageUrl } from '@/lib/image-utils';
import { useToast } from '@/contexts/toastContext'; // ✅ 1. 引入 Toast

const ITEMS_PER_PAGE = 12;

export default function ManualsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

    // ✅ 2. 新增：记录当前正在检查哪个 ID 的文件 (用于显示转圈圈)
    const [checkingId, setCheckingId] = useState<string | null>(null);
    const { showToast } = useToast();

    // 搜索过滤逻辑
    const filteredManuals = MANUALS_DATA.filter((item) => {
        const normalizedTitle = item.title.toLowerCase().replace(/\s+/g, '');
        const normalizedQuery = searchQuery.toLowerCase().replace(/\s+/g, '');
        return normalizedTitle.includes(normalizedQuery);
    });

    const visibleManuals = filteredManuals.slice(0, visibleCount);

    useEffect(() => {
        setVisibleCount(ITEMS_PER_PAGE);
    }, [searchQuery]);

    // ✅ 3. 核心修改：安全的打开方式
    const handleOpenPdf = async (id: string, url: string) => {
        if (checkingId) return; // 防止重复点击
        setCheckingId(id); // 开始转圈

        try {
            // 发起一个轻量级的 HEAD 请求，只检查文件在不在，不下载内容
            const res = await fetch(url, { method: 'HEAD' });

            if (res.ok) {
                // 如果文件存在 (状态码 200)，则打开
                window.open(url, '_blank');
            } else {
                // 如果文件不存在 (404)，提示错误，阻止跳转
                showToast('error', 'Unavailable', 'Manual coming soon. Please contact support.');
            }
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to access the file.');
        } finally {
            setCheckingId(null); // 停止转圈
        }
    };

    const handleLoadMore = () => {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-24">
            {/* Header Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto px-4 py-16 md:py-24 max-w-5xl text-center">
                    <div className="inline-flex items-center gap-2 bg-gray-50 text-gray-500 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-6 border border-gray-100">
                        <BookOpen size={12} /> Support Center
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 font-['Playfair_Display']">
                        Product Manuals
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-light mb-10">
                        Find detailed user guides, safety instructions, and care tips for your Myth devices.
                    </p>
                    <div className="max-w-xl mx-auto relative group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-black transition-colors">
                            <Search size={20} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by product name..."
                            className="w-full pl-12 pr-6 py-4 rounded-full bg-white border border-gray-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all text-base placeholder:text-gray-400"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Grid Section */}
            <div className="container mx-auto px-4 max-w-6xl mt-16">

                {filteredManuals.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <AlertCircle size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No manuals found</h3>
                        <p className="text-gray-500">We couldn't find any products matching "{searchQuery}".</p>
                        <button onClick={() => setSearchQuery('')} className="mt-6 text-sm font-bold underline underline-offset-4 hover:text-gray-600">
                            Clear search
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {visibleManuals.map((item) => {
                        const imageUrl = item.image ? getProductImageUrl('', item.image) : null;
                        // ✅ 判断当前项是否正在检查中
                        const isCheckingThis = checkingId === item.id;

                        return (
                            <div
                                key={item.id}
                                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-[4/3] bg-[#F9FAFB] relative overflow-hidden flex items-center justify-center p-8">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={item.title}
                                            className="object-contain h-full w-full mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
                                            loading="lazy"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement?.classList.add('bg-gray-100');
                                            }}
                                        />
                                    ) : (
                                        <div className="text-gray-300 font-serif italic">No Image</div>
                                    )}
                                </div>

                                <div className="p-6 flex flex-col flex-1">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold font-['Playfair_Display'] text-gray-900 text-center">
                                            {item.title}
                                        </h3>
                                    </div>

                                    <div className="mt-auto pt-6 border-t border-gray-50">
                                        <button
                                            // ✅ 修改：点击时先检查，不是直接 window.open
                                            onClick={() => handleOpenPdf(item.id, item.pdfUrl)}
                                            disabled={isCheckingThis}
                                            className="w-full flex items-center justify-between group/btn disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            <span className="flex items-center gap-2 text-sm font-bold text-gray-600 group-hover/btn:text-black transition-colors">
                                                <FileText size={16} />
                                                {isCheckingThis ? 'Checking...' : 'View User Guide'}
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover/btn:bg-black group-hover/btn:text-white transition-all">
                                                {/* ✅ 状态切换：转圈圈图标 */}
                                                {isCheckingThis ? (
                                                    <Loader2 size={14} className="animate-spin text-gray-600 group-hover/btn:text-white" />
                                                ) : (
                                                    <Download size={14} />
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {visibleCount < filteredManuals.length && (
                    <div className="mt-16 text-center">
                        <button
                            onClick={handleLoadMore}
                            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full text-sm font-bold uppercase tracking-widest hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                        >
                            Load More
                        </button>
                        <p className="text-xs text-gray-400 mt-4">
                            Showing {visibleManuals.length} of {filteredManuals.length} manuals
                        </p>
                    </div>
                )}
            </div>

            {/* Footer Section (保持不变) */}
            <div className="container mx-auto px-4 max-w-4xl mt-24">
                <div className="bg-[#1A1A1A] rounded-3xl p-10 md:p-12 text-center text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-2xl md:text-3xl font-serif mb-4">Can't find what you need?</h2>
                        <p className="text-gray-400 mb-8 max-w-lg mx-auto font-light">
                            Our discreet support team is here to help with setup, care, or general questions about your device.
                        </p>
                        <a href="mailto:support@mythstore.com" className="inline-flex items-center gap-2 bg-white text-black px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-white transition-all">
                            Contact Support <ArrowRight size={14} />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}