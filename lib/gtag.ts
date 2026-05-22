// lib/gtag.ts

// 开发环境使用空字符串，生产环境使用真实ID
export const GA_TRACKING_ID: string =
    process.env.NODE_ENV === 'production'
        ? 'G-X0CTZ0DD1Q'  // 生产环境
        : ''              // 开发环境不跟踪

// 页面浏览事件
export const pageview = (url: string): void => {
    if (typeof window.gtag !== 'undefined' && GA_TRACKING_ID) {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        })
    } else {
        // 开发环境不发送给GA
    }
}

// 自定义事件参数接口
interface GtagEventParams {
    event_category?: string
    event_label?: string
    value?: number
    [key: string]: any
}

interface GtagEvent {
    action: string
    category: string
    label?: string
    value?: number
    [key: string]: any
}

// 自定义事件
export const event = ({ action, category, label, value, ...rest }: GtagEvent): void => {
    if (typeof window.gtag !== 'undefined' && GA_TRACKING_ID) {
        const params: GtagEventParams = {
            event_category: category,
            ...(label && { event_label: label }),
            ...(value && { value: value }),
            ...rest,
        }

        window.gtag('event', action, params)
    } else {
        // 开发环境不发送给GA
    }
}

// 增强的 TypeScript 类型声明
declare global {
    interface Window {
        gtag: (
            command: 'config' | 'event' | 'js',
            targetId: string,
            config?: Record<string, any>
        ) => void
        dataLayer: any[]
    }
}