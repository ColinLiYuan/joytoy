// components/toast.tsx
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheckCircle,
    faExclamationCircle,
    faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import { Z_INDEX } from '@/lib/constants/z-index';

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
    const getToastIcon = (type: string) => {
        switch (type) {
            case 'success': return faCheckCircle;
            case 'error': return faExclamationCircle;
            case 'warning': return faInfoCircle;
            default: return faInfoCircle;
        }
    };

    const getToastStyles = (type: string) => {
        const baseStyles = "flex items-start p-3 rounded-lg shadow-lg cursor-pointer transition-all duration-300 min-w-[300px] max-w-[400px] hover:-translate-x-1 animate-in slide-in-from-right";

        switch (type) {
            case 'success':
                return `${baseStyles} bg-green-50 border border-green-300 text-green-600`;
            case 'error':
                return `${baseStyles} bg-red-50 border border-red-300 text-red-600`;
            case 'warning':
                return `${baseStyles} bg-yellow-50 border border-yellow-300 text-yellow-600`;
            default:
                return `${baseStyles} bg-blue-50 border border-blue-300 text-blue-600`;
        }
    };

    const getIconStyles = (type: string) => {
        switch (type) {
            case 'success': return "text-green-600";
            case 'error': return "text-red-600";
            case 'warning': return "text-yellow-600";
            default: return "text-blue-600";
        }
    };

    return (
        <div
            className="fixed top-5 right-5 flex flex-col gap-2 max-w-[400px]"
            style={{ zIndex: Z_INDEX.TOAST }}
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className={getToastStyles(toast.type)}
                    onClick={() => onRemoveToast(toast.id)}
                >
                    <FontAwesomeIcon
                        icon={getToastIcon(toast.type)}
                        className={`mr-3 text-lg shrink-0 mt-0.5 ${getIconStyles(toast.type)}`}
                    />
                    <div className="flex-1">
                        <div className="font-semibold text-sm mb-1">{toast.title}</div>
                        <div className="text-sm opacity-90 leading-relaxed">{toast.message}</div>
                    </div>
                    <button
                        className="bg-transparent border-none text-lg cursor-pointer opacity-70 ml-2 p-0 w-5 h-5 flex items-center justify-center rounded-full transition-colors hover:opacity-100 hover:bg-black hover:bg-opacity-10"
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveToast(toast.id);
                        }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}