// components/common/toast.tsx
'use client';

import { Z_INDEX } from '@/lib/constants/z-index';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
    id: number;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
}

interface ToastProps {
    toasts: ToastMessage[];
    onRemoveToast: (id: number) => void;
    maxTitleLength?: number;
    maxMessageLength?: number;
}

export default function Toast({
                                  toasts,
                                  onRemoveToast,
                                  maxTitleLength = 20,
                                  maxMessageLength = 40
                              }: ToastProps) {

    // 截断文本函数
    const truncateText = (text: string, maxLength: number): string => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-rose-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 flex flex-col gap-3 items-center pointer-events-none w-full px-4"
            style={{ zIndex: Z_INDEX.TOAST }}
        >
            {toasts.map((toast) => {
                const isError = toast.type === 'error';
                // 错误类型完全不截断，其他类型按设定的长度截断
                const displayTitle = isError ? toast.title : truncateText(toast.title, maxTitleLength);
                const displayMessage = isError ? toast.message : truncateText(toast.message, maxMessageLength);

                return (
                    <div
                        key={toast.id}
                        onClick={() => onRemoveToast(toast.id)}
                        className={`
                            pointer-events-auto cursor-pointer
                            flex items-start md:items-center gap-3 p-4 md:px-6 md:py-3.5
                            bg-[#1A1A1A] text-white
                            /* 关键：取消 rounded-full 改为 rounded-2xl 以适应换行 */
                            rounded-2xl shadow-2xl shadow-black/40
                            border border-white/10
                            animate-in slide-in-from-bottom-5 fade-in duration-300
                            hover:scale-[1.02] transition-transform
                            /* 宽度优化：移动端占满，桌面端自适应 */
                            w-full md:w-fit max-w-md
                        `}
                    >
                        {/* Icon - 保持在顶部或居中 */}
                        <div className="flex-shrink-0 mt-0.5 md:mt-0">
                            {getIcon(toast.type)}
                        </div>

                        {/* Text Content - 移动端堆叠，桌面端并排 */}
                        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-0.5 md:gap-2 text-sm font-medium leading-relaxed md:leading-none">
                            <span className="font-bold tracking-wide text-white">
                                {displayTitle}
                            </span>
                            {/* 桌面端显示小圆点 */}
                            <span className="hidden md:block w-1 h-1 bg-gray-500 rounded-full flex-shrink-0"></span>
                            <span className="text-gray-400 font-normal break-words">
                                {displayMessage}
                            </span>
                        </div>

                        {/* Dismiss Button - 移动端精简处理 */}
                        <div className="pl-3 border-l border-white/10 flex-shrink-0 self-stretch flex items-center">
                            <span className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                                <X className="w-4 h-4 md:hidden" />
                                <span className="hidden md:inline">Dismiss</span>
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}