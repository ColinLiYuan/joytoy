// components/common/pagination.tsx

'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number; // 0-based index
    totalPages: number;
    totalElements?: number;
    onPageChange: (page: number) => void; // 0-based page index
}

export default function Pagination({ currentPage, totalPages, totalElements, onPageChange }: PaginationProps) {
    const displayPage = currentPage + 1;

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="text-sm text-gray-700">
                共 <span className="font-semibold">{totalElements || 0}</span> 条记录，
                第 <span className="font-semibold">{displayPage}</span> / {totalPages} 页
            </div>
            <div className="flex items-center gap-1">
                {/* 上一页 */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded transition-colors ${
                        currentPage === 0
                            ? 'text-gray-300 cursor-not-allowed bg-white'
                            : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* 页码 */}
                {Array.from({ length: totalPages }, (_, i) => i).map((page) => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`flex items-center justify-center min-w-[2rem] h-8 px-2 border border-gray-300 rounded text-sm font-medium transition-colors ${
                            page === currentPage
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        {page + 1}
                    </button>
                ))}

                {/* 下一页 */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage + 1 >= totalPages}
                    className={`flex items-center justify-center w-8 h-8 border border-gray-300 rounded transition-colors ${
                        currentPage + 1 >= totalPages
                            ? 'text-gray-300 cursor-not-allowed bg-white'
                            : 'text-gray-700 bg-white hover:bg-gray-50'
                    }`}
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}