// app/(site)/page.tsx - 客户端组件
'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductResponse } from '@/types/product';
import { productService } from '@/services/productService';
import ClientAgeVerification from '@/components/common/client-age-verification';
import HeroSection from '@/components/home/hero-section';
import BestSellersSection from '@/components/home/best-sellers-section';
import CategoriesSection from '@/components/home/categories-section';
import TrustSignals from '@/components/home/trust-signals';
import FAQSection from '@/components/common/faq-section';
import AutoLoginModal from '@/components/common/auto-login-modal';

export default function HomePage() {
    const searchParams = useSearchParams();
    const redirectPath = searchParams.get('redirect') || null;
    
    const [bestSellers, setBestSellers] = useState<ProductResponse[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

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
            
            {/* 如果 URL 有 redirect 参数，自动弹出登录框 */}
            <AutoLoginModal redirectPath={redirectPath} />

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
