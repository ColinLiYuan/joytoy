// app/(site)/page.tsx - 客户端组件
'use client';

import { useState, useEffect } from 'react';
import { ProductResponse } from '@/types/product';
import { productService } from '@/services/productService';
import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';
import TrustSignals from '@/components/home/trust-signals';
import FAQSection from '@/components/common/faq-section';

export default function HomePage() {
    const [bestSellers, setBestSellers] = useState<ProductResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // 🔍 浏览器控制台输出环境变量（仅开发环境）
    useEffect(() => {
        console.log('\n ========== 环境变量检查 ==========');
        console.log('📌 NEXT_PUBLIC_BACKEND_BASE_URL:', process.env.NEXT_PUBLIC_BACKEND_BASE_URL);
        console.log('📌 NEXT_PUBLIC_IMAGE_BASE_URL:', process.env.NEXT_PUBLIC_IMAGE_BASE_URL);
        console.log('📌 NEXT_PUBLIC_IMAGE_UPLOAD_PATH:', process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH);
        console.log('📌 NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
        console.log('📌 NODE_ENV:', process.env.NODE_ENV);
        console.log('=====================================\n');
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const products = await productService.getHeroProducts();
                if (Array.isArray(products)) {
                    setBestSellers(products);
                } else {
                    throw new Error('Invalid products data format');
                }
                setError(null);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products');
                setBestSellers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <>
            <ClientAgeVerification />

            <div className="w-full max-w-full overflow-x-hidden">
                <HeroSection />
                <CategoriesSection />
                <BestSellersSection bestSellers={bestSellers} error={error} loading={loading} />
                <TrustSignals />
                <section className="w-full bg-white py-24">
                    <div className="container max-w-4xl mx-auto px-6">
                        <FAQSection context="home" />
                    </div>
                </section>
            </div>
        </>
    );
}
