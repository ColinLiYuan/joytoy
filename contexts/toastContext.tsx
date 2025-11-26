// contexts/toastContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Toast, { ToastMessage } from '@/components/common/toast';

interface ToastContextType {
    showToast: (type: 'success' | 'error' | 'warning', title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 1. 全局状态管理 (Store 也可以访问)
let toasts: ToastMessage[] = [];
let listeners: ((toasts: ToastMessage[]) => void)[] = [];

// 2. ✅ 核心修改：导出一个全局函数，供非 React 组件 (如 Zustand) 调用
export const globalToast = {
    success: (title: string, message: string) => addToast('success', title, message),
    error: (title: string, message: string) => addToast('error', title, message),
    warning: (title: string, message: string) => addToast('warning', title, message),
};

// 内部辅助函数
const addToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    const id = Date.now();
    const newToast: ToastMessage = { id, type, title, message };

    toasts = [...toasts, newToast];
    emitChange();

    setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id);
        emitChange();
    }, 3000);
};

const emitChange = () => {
    listeners.forEach(listener => listener([...toasts]));
};

export function ToastProvider({ children }: { children: ReactNode }) {
    // 这里只需要暴露给 Hook 使用即可
    const showToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
        addToast(type, title, message);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <ToastContainer />
        </ToastContext.Provider>
    );
}

function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const listener = (newToasts: ToastMessage[]) => setCurrentToasts(newToasts);
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    const removeToast = (id: number) => {
        toasts = toasts.filter(t => t.id !== id);
        emitChange();
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