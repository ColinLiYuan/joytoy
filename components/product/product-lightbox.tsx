'use client';

import { useEffect, useRef } from 'react';
import PhotoSwipe from 'photoswipe';
import type { DataSource, PreparedPhotoSwipeOptions } from 'photoswipe';
import 'photoswipe/style.css';

interface ProductLightboxProps {
    open: boolean;
    index: number;
    slides: Array<{
        src?: string;
        width?: number;
        height?: number;
        alt?: string;
        title?: string;
        type?: string;
        poster?: string;
        sources?: Array<{ src: string; type: string }>;
        data?: { png?: boolean };
    }>;
    onClose: () => void;
}

export default function ProductLightbox({ open, index, slides, onClose }: ProductLightboxProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open || !containerRef.current) return;

        const dataSource: DataSource = slides.map((slide) => {
            if (slide.type === 'video') {
                const posterSrc = slide.poster || slide.src || '';
                const videoSrc = slide.sources?.[0]?.src || slide.src || '';
                return {
                    width: 1920,
                    height: 1080,
                    type: 'video',
                    html: `<div class="pswp__video-container"><video src="${videoSrc}" poster="${posterSrc}" controls playsinline loop class="pswp__video"></video></div>`,
                    alt: slide.alt || '',
                };
            }
            return {
                src: slide.src || '',
                width: slide.width || 1200,
                height: slide.height || 1200,
                alt: slide.alt || '',
                msrc: undefined,
            };
        });

        const pswp = new PhotoSwipe({
            dataSource,
            index,
            bgOpacity: 0.9,
            spacing: 0.12,
            allowPanToNext: true,
            loop: false,
            pinchToClose: true,
            closeOnVerticalDrag: true,
            hideAnimationDuration: 333,
            showAnimationDuration: 333,
            zoomAnimationDuration: 333,
            easing: 'cubic-bezier(0.4, 0, 0.22, 1)',
            escKey: true,
            arrowKeys: true,
            trapFocus: true,
            returnFocus: true,
            clickToCloseNonZoomable: true,
            imageClickAction: 'zoom-or-close',
            bgClickAction: 'close',
            tapAction: 'zoom-or-close',
            closeTitle: 'Close',
            zoomTitle: 'Zoom',
            arrowPrevTitle: 'Previous',
            arrowNextTitle: 'Next',
            errorMsg: 'The image cannot be loaded',
            preload: [1, 2],
            mainClass: 'pswp--product-gallery',
            padding: { top: 20, bottom: 20, left: 20, right: 20 },
        } as PreparedPhotoSwipeOptions);

        pswp.on('close', () => {
            onClose();
        });

        pswp.init();

        return () => {
            pswp.destroy();
        };
    }, [open, index, slides, onClose]);

    if (!open) return null;

    return <div ref={containerRef} className="pswp-wrapper" />;
}
