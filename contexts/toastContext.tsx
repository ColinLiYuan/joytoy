// contexts/toastContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Toast, { ToastMessage } from '@/components/common/toast';

interface ToastContextType {
    showToast: (type: 'success' | 'error' | 'warning', title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// 全局状态 (Module Level)
let toasts: ToastMessage[] = [];
let listeners: ((toasts: ToastMessage[]) => void)[] = [];

// ✅ 1. 修复：ID 生成器 (时间戳 + 随机数)，确保绝对唯一
const generateId = () => {
    return Date.now() + Math.random();
};

const emitChange = () => {
    listeners.forEach(listener => listener([...toasts]));
};

// 内部添加函数
const addToast = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
    const id = generateId(); // ✅ 使用新生成器
    const newToast: ToastMessage = { id, type, title, message };

    toasts = [...toasts, newToast];
    emitChange();

    // 3秒后自动移除
    setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id);
        emitChange();
    }, 3000);
};

// 2. 导出全局方法 (给 Store/Service 用)
export const globalToast = {
    success: (title: string, message: string) => addToast('success', title, message),
    error: (title: string, message: string) => addToast('error', title, message),
    warning: (title: string, message: string) => addToast('warning', title, message),
};

export function ToastProvider({ children }: { children: ReactNode }) {
    // 暴露给 Hook 使用
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

// 独立的容器组件，监听全局 toasts 变化
function ToastContainer() {
    const [currentToasts, setCurrentToasts] = useState<ToastMessage[]>([]);

    useEffect(() => {
        const listener = (newToasts: ToastMessage[]) => setCurrentToasts(newToasts);
        listeners.push(listener);

        // 初始化同步一次
        setCurrentToasts([...toasts]);

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