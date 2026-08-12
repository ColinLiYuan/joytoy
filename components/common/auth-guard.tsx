'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/authContext'
import { Loader2 } from 'lucide-react'

type AdminRole = 'super_admin' | 'admin' | 'operator';

interface AuthGuardProps {
    children: React.ReactNode
    requiredRole?: AdminRole | 'affiliate'
}

/** 检查用户是否有后台权限（含操作员） */
function hasAdminAccess(role?: string, isAdmin?: boolean): boolean {
    if (isAdmin === true) return true;
    if (role === 'ADMIN' || role === 'SUPER_ADMIN' || role === 'OPERATOR') return true;
    return false;
}

/** 检查用户是否为超级管理员 */
function isSuperAdmin(role?: string, isSuperAdmin?: boolean): boolean {
    if (isSuperAdmin === true) return true;
    if (role === 'SUPER_ADMIN') return true;
    return false;
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
            const currentPath = window.location.pathname + window.location.search
            openAuthModal('login', {
                onSuccess: () => {
                    window.location.reload()
                }
            })
            return
        }

        // 检查角色权限
        if (requiredRole === 'super_admin') {
            if (!isSuperAdmin(userInfo?.role, userInfo?.isSuperAdmin)) {
                console.log('[AuthGuard] User does not have super admin permission')
                router.push('/403')
                return
            }
        } else if (requiredRole === 'admin') {
            if (!hasAdminAccess(userInfo?.role, userInfo?.isAdmin)) {
                console.log('[AuthGuard] User does not have admin permission')
                router.push('/403')
                return
            }
        } else if (requiredRole === 'operator') {
            // 操作员需要 isAdmin=true（含 OPERATOR/ADMIN/SUPER_ADMIN）
            if (!hasAdminAccess(userInfo?.role, userInfo?.isAdmin)) {
                console.log('[AuthGuard] User does not have operator permission')
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

    // 渲染前检查权限
    if (requiredRole === 'super_admin') {
        if (!isSuperAdmin(userInfo?.role, userInfo?.isSuperAdmin)) {
            return null
        }
    } else if (requiredRole === 'admin' || requiredRole === 'operator') {
        if (!hasAdminAccess(userInfo?.role, userInfo?.isAdmin)) {
            return null
        }
    }

    if (requiredRole === 'affiliate') {
        const hasAffiliatePermission = userInfo?.isAffiliate === true || userInfo?.affiliateId
        if (!hasAffiliatePermission) {
            return null
        }
    }

    return <>{children}</>
}
