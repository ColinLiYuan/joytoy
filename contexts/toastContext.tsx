// contexts/toastContext.tsx（优化版）
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import Toast from '@/components/common/toast';
import { ToastMessage } from '@/components/common/toast';

interface ToastContextType {
    showToast: (type: 'success' | 'error' | 'warning', title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 独立的状态管理，不污染 Context
let toasts: ToastMessage[] = [];
let listeners: ((toasts: ToastMessage[]) => void)[] = [];

export function ToastProvider({ children }: { children: ReactNode }) {
    const [_, setVersion] = useState(0); // 用于强制重新渲染

    const showToast = useCallback((type: 'success' | 'error' | 'warning', title: string, message: string) => {
        const id = Date.now();
        const newToast: ToastMessage = { id, type, title, message };

        toasts = [...toasts, newToast];

        // 通知所有监听器
        listeners.forEach(listener => listener([...toasts]));

        // 强制 Toast 组件重新渲染
        setVersion(v => v + 1);

        setTimeout(() => {
            toasts = toasts.filter(toast => toast.id !== id);
            listeners.forEach(listener => listener([...toasts]));
            setVersion(v => v + 1);
        }, 3000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

// 独立的 Toast 容器组件
function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>([]);

    React.useEffect(() => {
        const listener = (newToasts: ToastMessage[]) => {
            setCurrentToasts(newToasts);
        };

        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const removeToast = (id: number) => {
        toasts = toasts.filter(toast => toast.id !== id);
        listeners.forEach(listener => listener([...toasts]));
    };

    return <Toast toasts={currentToasts} onRemoveToast={removeToast} />;
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}