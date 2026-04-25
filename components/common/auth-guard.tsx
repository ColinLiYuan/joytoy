'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/authContext'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: 'admin' | 'affiliate'
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
    const { isLoggedIn, userInfo, isClient, openAuthModal } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // 等待客户端初始化
        if (!isClient) return

        // 检查是否已登录
        if (!isLoggedIn) {
            console.log('[AuthGuard] User not logged in, opening login modal')
            // 保存当前路径用于登录后返回
            const currentPath = window.location.pathname + window.location.search
            openAuthModal('login', {
                onSuccess: () => {
                    // 登录成功后刷新页面以重新检查权限
                    window.location.reload()
                }
            })
            return
        }

        // 检查角色权限
        if (requiredRole === 'admin') {
            const hasAdminPermission = userInfo?.isAdmin === true || 
                                      userInfo?.role === 'ADMIN' || 
                                      userInfo?.role === 'SUPER_ADMIN'
            
            if (!hasAdminPermission) {
                console.log('[AuthGuard] User does not have admin permission')
                router.push('/403')
                return
            }
        }

        if (requiredRole === 'affiliate') {
            const hasAffiliatePermission = userInfo?.isAffiliate === true || userInfo?.affiliateId
            
            if (!hasAffiliatePermission) {
                console.log('[AuthGuard] User does not have affiliate permission')
                router.push('/403')
                return
            }
        }
    }, [isClient, isLoggedIn, userInfo, requiredRole, router, openAuthModal])

    // 如果还未初始化或未登录，显示加载状态
    if (!isClient || !isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-600">Checking authentication...</p>
                </div>
            </div>
        )
    }

    // 检查权限
    if (requiredRole === 'admin') {
        const hasAdminPermission = userInfo?.isAdmin === true || 
                                  userInfo?.role === 'ADMIN' || 
                                  userInfo?.role === 'SUPER_ADMIN'
        
        if (!hasAdminPermission) {
            return null // 会被重定向到 403
        }
    }

    if (requiredRole === 'affiliate') {
        const hasAffiliatePermission = userInfo?.isAffiliate === true || userInfo?.affiliateId
        
        if (!hasAffiliatePermission) {
            return null // 会被重定向到 403
        }
    }

    return <>{children}</>
}
