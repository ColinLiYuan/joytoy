// components/common/pagination.tsx

'use client';

import { usePathname } from 'next/navigation';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pathname = usePathname();
    const displayPage = currentPage + 1;

    // 服务端分页处理
    const handlePageChange = (page: number) => {
        // 这里应该构建新的URL并重定向
        // 例如：redirect(`?page=${page}`);
    };

    // 对于总页数较少的情况，显示所有页码
    const getPageNumbers = () => {
        if (totalPages <= 1) return [1];

        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="flex justify-center items-center gap-0 mt-12">
            {/* 上一页按钮 - 使用链接而不是事件处理器 */}
            {currentPage > 0 ? (
                <a
                    href={currentPage === 1 ? pathname : `?page=${currentPage - 1}`}
                    className="flex items-center justify-center w-10 h-10 border border-gray-300 bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    aria-label="Previous page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </a>
            ) : (
                <span className="flex items-center justify-center w-10 h-10 border border-gray-300 bg-white text-gray-400 opacity-50 cursor-not-allowed" aria-disabled="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M15 18l-6-6 6-6"/>
                    </svg>
                </span>
            )}

            <div className="flex gap-0">
                {pageNumbers.map((page) => {
                    const pageIndex = page - 1;
                    // 第一页不携带 page 参数，避免生成 ?page=0
                    const href = pageIndex === 0 ? pathname : `?page=${pageIndex}`;
                    
                    return (
                        <a
                            key={page}
                            href={href}
                            className={`
                                flex items-center justify-center min-w-[2.5rem] h-10 px-3 
                                border border-l-0 border-gray-300 
                                bg-white text-gray-700 
                                cursor-pointer transition-all duration-200 
                                text-sm font-medium
                                hover:bg-gray-50
                                ${displayPage === page ? 'text-[var(--primary-color)] font-semibold' : ''}
                                ${page === 1 ? 'border-l border-gray-300' : ''}
                                ${page === pageNumbers.length ? 'border-r border-gray-300' : ''}
                            `}
                        >
                            {page}
                        </a>
                    );
                })}
            </div>

            {/* 下一页按钮 - 使用链接而不是事件处理器 */}
            {currentPage < totalPages - 1 && totalPages > 0 ? (
                <a
                    href={`?page=${currentPage + 1}`}
                    className="flex items-center justify-center w-10 h-10 border border-gray-300 border-l-0 bg-white text-gray-700 cursor-pointer transition-all duration-200 hover:bg-gray-50"
                    aria-label="Next page"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </a>
            ) : (
                <span className="flex items-center justify-center w-10 h-10 border border-gray-300 border-l-0 bg-white text-gray-400 opacity-50 cursor-not-allowed" aria-disabled="true">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </span>
            )}
        </div>
    );
}