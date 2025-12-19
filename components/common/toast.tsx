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
}

export default function Toast({ toasts, onRemoveToast }: ToastProps) {

    // 只需要极简图标，不需要大色块
    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-400" />; // 绿色荧光
            case 'error': return <AlertCircle className="w-5 h-5 text-rose-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    return (
        <div
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-2 items-center pointer-events-none"
            style={{ zIndex: Z_INDEX.TOAST }}
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    onClick={() => onRemoveToast(toast.id)}
                    className={`
                        pointer-events-auto cursor-pointer
                        flex items-center gap-3 px-6 py-3.5
                        bg-[#1A1A1A] text-white
                        rounded-full shadow-2xl shadow-black/20
                        border border-white/10
                        animate-in slide-in-from-bottom-5 fade-in duration-300
                        hover:scale-105 transition-transform
                    `}
                >
                    {/* Icon */}
                    <div className="flex-shrink-0">
                        {getIcon(toast.type)}
                    </div>

                    {/* Text - 单行显示，极简 */}
                    <div className="flex items-center gap-2 text-sm font-medium whitespace-nowrap">
                        <span className="font-bold tracking-wide">{toast.title}</span>
                        <span className="w-1 h-1 bg-gray-500 rounded-full"></span>
                        <span className="text-gray-300 font-normal">{toast.message}</span>
                    </div>

                    {/* Undo / Close (隐形按钮) */}
                    <div className="pl-4 border-l border-white/10 ml-1">
                         <span className="text-xs font-bold text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
                             Dismiss
                         </span>
                    </div>
                </div>
            ))}
        </div>
    );
}