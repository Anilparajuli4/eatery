'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 5000);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 left-6 z-[10000] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`pointer-events-auto p-4 rounded-2xl shadow-2xl border-2 flex items-center gap-4 min-w-[300px] max-w-md ${toast.type === 'success' ? 'bg-green-50 border-green-100 text-green-800' :
                                    toast.type === 'error' ? 'bg-red-50 border-red-100 text-red-800' :
                                        'bg-blue-50 border-blue-100 text-blue-800'
                                }`}
                        >
                            <div className={`p-2 rounded-xl flex-shrink-0 ${toast.type === 'success' ? 'bg-green-100 text-green-600' :
                                    toast.type === 'error' ? 'bg-red-100 text-red-600' :
                                        'bg-blue-100 text-blue-600'
                                }`}>
                                {toast.type === 'success' && <CheckCircle size={20} />}
                                {toast.type === 'error' && <AlertCircle size={20} />}
                                {toast.type === 'info' && <Info size={20} />}
                            </div>
                            <p className="flex-1 font-bold text-sm leading-tight">{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                            >
                                <X size={18} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
