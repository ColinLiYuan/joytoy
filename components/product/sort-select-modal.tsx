// /components/product/sort-select-modal.tsx
'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SortSelectModalProps {
    className?: string;
}

export default function SortSelectModal({ className = '' }: SortSelectModalProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [sortBy, setSortBy] = useState('newest'); // 默认改为 newest
    const [isOpen, setIsOpen] = useState(false);

    const sortOptions = [
        { value: 'newest', label: 'Newest Arrivals' },
        { value: 'price-low', label: 'Price: Low to High' },
        { value: 'price-high', label: 'Price: High to Low' }
    ];

    useEffect(() => {
        const sortParam = searchParams.get('sort');
        if (sortParam) {
            setSortBy(sortParam);
        } else {
            setSortBy('newest'); // 没有参数时默认 newest
        }
    }, [searchParams]);

    const handleSortChange = (value: string) => {
        setSortBy(value);
        setIsOpen(false);

        const params = new URLSearchParams(searchParams);

        if (value === 'newest') {
            // 默认排序，删除sort参数
            params.delete('sort');
        } else {
            params.set('sort', value);
        }

        // 排序时回到第一页
        params.delete('page');

        const newUrl = `${pathname}?${params.toString()}`;
        router.push(newUrl, { scroll: false });
    };

    const getDisplayText = () => {
        const currentOption = sortOptions.find(option => option.value === sortBy);
        return currentOption ? currentOption.label : 'Newest Arrivals'; // 默认显示文字也改一下
    };

    return (
        <div className={`relative ${className}`}>
            {/* 触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all duration-300 hover:shadow-sm cursor-pointer"
            >
                <span>{getDisplayText()}</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* 弹框 */}
            {isOpen && (
                <>
                    {/* 遮罩层 */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* 选项列表 */}
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2">
                        {sortOptions.map(option => {
                            const isSelected = sortBy === option.value;
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSortChange(option.value)}
                                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm transition-colors duration-200 hover:bg-gray-50 ${
                                        isSelected
                                            ? 'text-[var(--primary-color)] font-medium bg-[var(--primary-color)]/10'
                                            : 'text-gray-700'
                                    }`}
                                >
                                    {/* 勾选图标 */}
                                    {isSelected ? (
                                        <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        <div className="w-4 h-4 flex-shrink-0" /> // 占位，保持对齐
                                    )}
                                    <span className="flex-1 text-left">{option.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
}