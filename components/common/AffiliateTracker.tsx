'use client'; // 必须是客户端组件

import { useEffect } from 'react';
import { affiliateService } from '@/services/affiliateService';

export default function AffiliateTracker() {
    useEffect(() => {
        // 只要用户进入网站任何面，这个组件都会触发一次
        // 内部会自动检查 URL 是否有 ?ref=xxx 并存入 Cookie
        affiliateService.initFromUrl();
    }, []);

    return null; // 这个组件不需要渲染任何东西
}