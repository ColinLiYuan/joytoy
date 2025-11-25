'use client';

import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function ErrorSection() {
    return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">Unable to load products</h3>
            <p className="text-gray-500 mb-8 max-w-md">We encountered an error while fetching the product catalog. Please check your connection and try again.</p>
            <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all"
            >
                <RefreshCcw size={18} />
                Try Again
            </button>
        </div>
    );
}