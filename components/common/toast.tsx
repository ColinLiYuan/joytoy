// components/common/toast.tsx
'use client';

import { Z_INDEX } from '@/lib/constants/z-index';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'; // ✅ 替换为 Lucide

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

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            case 'error': return <AlertCircle className="w-5 h-5 text-red-500" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    return (
        <div
            className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none"
            style={{ zIndex: Z_INDEX.TOAST }}
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    onClick={() => onRemoveToast(toast.id)}
                    // ✅ 核心设计升级：
                    // 1. bg-white: 纯白背景，去大色块
                    // 2. shadow-xl: 深邃阴影，增加悬浮感
                    // 3. border-gray-100: 极细边框，增加精致度
                    // 4. pointer-events-auto: 恢复点击
                    className={`
                        pointer-events-auto
                        flex items-start gap-3 p-4
                        bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100
                        transform transition-all duration-300 ease-out
                        animate-in slide-in-from-right-10 fade-in
                        cursor-pointer hover:translate-x-[-4px]
                    `}
                >
                    {/* 图标区域 */}
                    <div className="flex-shrink-0 mt-0.5">
                        {getIcon(toast.type)}
                    </div>

                    {/* 文字区域 */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight mb-1">
                            {toast.title}
                        </h4>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            {toast.message}
                        </p>
                    </div>

                    {/* 关闭按钮 */}
                    <button
                        className="flex-shrink-0 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-md hover:bg-gray-50"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveToast(toast.id);
                        }}
                    >
                        <X size={16} />
                    </button>
                </div>
            ))}
        </div>
    );
}