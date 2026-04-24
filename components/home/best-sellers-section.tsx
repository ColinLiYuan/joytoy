// components/home/best-sellers-section.tsx
import { ProductResponse } from '@/types/product';
import ProductCard from '@/components/product/product-card';

interface BestSellersSectionProps {
    bestSellers: ProductResponse[];
    error?: string | null;
    loading?: boolean;
}

export default function BestSellersSection({ bestSellers, error, loading }: BestSellersSectionProps) {
    return (
        <>
            <section id="bestsellers" className="bestsellers py-8 bg-white">
                <div className="container max-w-7xl mx-auto px-4">
                    {/* 标题区域 - 左对齐设计 */}
                    <div className="text-left mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 font-['Playfair_Display']">
                            Editor's Choice
                        </h2>
                        <p className="text-gray-600 font-['Inter']">
                            Most loved products for ultimate pleasure
                        </p>
                    </div>

                    {/* 产品网格 */}
                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {bestSellers.length > 0 ? (
                                bestSellers
                                    .filter(product => product?.id)
                                    .map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))
                            ) : (
                                <div className="col-span-4 text-center py-8">
                                    <div className="text-gray-500">No products available</div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* Error Display */}
            {error && (
                <div className="bg-yellow-50 border border-yellow-200 p-4 m-4 rounded-lg text-center">
                    {error}
                </div>
            )}
        </>
    );
}