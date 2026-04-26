'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/contexts/authContext'
import { globalToast } from '@/contexts/toastContext'

/**
 * 联盟重定向处理器
 * 当普通用户被中间件重定向到首页并带有 redirect=/affiliate 参数时，
 * 提示用户尚未开通联盟账号，并清理 URL 参数。
 */
export default function AffiliateRedirectHandler() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { userInfo, isClient } = useAuth()

    useEffect(() => {
        if (!isClient) return

        const redirect = searchParams.get('redirect')
        
        // 如果 URL 带有 redirect=/affiliate，但当前用户没有联盟身份
        if (redirect === '/affiliate' && !userInfo?.isAffiliate) {
            // 延迟一点显示 Toast，确保页面加载完成
            const timer = setTimeout(() => {
                globalToast.error('Access Denied', 'You have not applied for an affiliate account yet.')
                
                // 清除 URL 中的 redirect 参数，避免重复提示
                const newUrl = new URL(window.location.href)
                newUrl.searchParams.delete('redirect')
                router.replace(newUrl.toString())
            }, 800)

            return () => clearTimeout(timer)
        }
    }, [isClient, userInfo, searchParams, router])

    return null
}
