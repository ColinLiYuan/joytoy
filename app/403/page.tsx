'use client'

import { useRouter } from 'next/navigation'
import { ShieldOff, ArrowLeft } from 'lucide-react'

export default function ForbiddenPage() {
    const router = useRouter()

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center px-6">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                    <ShieldOff className="h-10 w-10 text-red-600" />
                </div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">403</h1>
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Access Denied</h2>
                <p className="text-gray-500 mb-8 max-w-md">
                    You don&apos;t have permission to access this page. Please contact your administrator if you believe this is a mistake.
                </p>
                <button
                    onClick={() => router.push('/')}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </button>
            </div>
        </div>
    )
}
