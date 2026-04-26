'use client'

import { useState } from 'react'
import AdminSidebar from './admin-sidebar'
import { Menu } from 'lucide-react'
import AuthGuard from '@/components/common/auth-guard'

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <AuthGuard requiredRole="admin">
            <div className="min-h-screen bg-gray-100 flex overflow-hidden">
                <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

                <div className="md:pl-64 flex flex-col flex-1 w-0">
                    <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-100/80 backdrop-blur-md">
                        <button
                            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </button>
                    </div>

                    <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
                        <div className="py-6 px-4 sm:px-6 md:px-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    )
}
