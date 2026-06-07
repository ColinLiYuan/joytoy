'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

function getSessionId(): string {
    if (typeof document === 'undefined') return ''
    try {
        const match = document.cookie.match(/(?:^|;\s*)CART_SESSION_ID=([^;]*)/)
        return match ? match[1] : ''
    } catch (e) {
        return ''
    }
}

export default function PageViewTracker() {
    const pathname = usePathname()
    const lastPath = useRef<string>('')

    useEffect(() => {
        if (!pathname || lastPath.current === pathname) return
        lastPath.current = pathname

        // 延迟发送，不阻塞页面渲染
        const timer = setTimeout(() => {
            try {
                const data = {
                    page: pathname,
                    referrer: document.referrer || '',
                    title: document.title || '',
                }

                fetch('/api/V1/analytics/pageview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-Session-Id': getSessionId(),
                    },
                    body: JSON.stringify(data),
                }).catch((e) => {
                    // 静默失败，不影响用户体验
                })
            } catch (e) {
                // 静默失败
            }
        }, 100)

        return () => clearTimeout(timer)
    }, [pathname])

    return null
}
