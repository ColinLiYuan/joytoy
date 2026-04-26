// app/(site)/bundles/page.tsx
import Link from 'next/link'
import { bundleService } from '@/services/bundleService'
import { Package, ArrowRight } from 'lucide-react'
import { getProductImageUrl } from '@/lib/image-utils'

export default async function BundlesPage() {
    // 初始加载第一页数据
    const data = await bundleService.getBundles(0, 12).catch(() => ({ content: [], totalPages: 0 }))
    
    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">精选礼盒套装</h1>
                <p className="text-gray-500 max-w-2xl mx-auto">
                    为您精心搭配的组合套装，享受更多优惠与惊喜。无论是自用还是送礼，都是最佳选择。
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {data.content.map((bundle) => (
                    <Link key={bundle.id} href={`/bundles/${bundle.slug}`} className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
                        <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                            {bundle.coverImage ? (
                                <img 
                                    src={getProductImageUrl('', bundle.coverImage)} 
                                    alt={bundle.bundleName}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Package size={48} />
                                </div>
                            )}
                            {bundle.discountRate > 0 && (
                                <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {(bundle.discountRate * 100).toFixed(0)}% OFF
                                </div>
                            )}
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                                {bundle.bundleName}
                            </h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mb-4">{bundle.subtitle}</p>
                            <div className="flex items-center justify-between">
                                <div>
                                    <span className="text-xl font-bold text-gray-900">${bundle.bundlePrice.toFixed(2)}</span>
                                    {bundle.originalPrice > bundle.bundlePrice && (
                                        <span className="text-sm text-gray-400 line-through ml-2">${bundle.originalPrice.toFixed(2)}</span>
                                    )}
                                </div>
                                <div className="flex items-center text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform">
                                    查看详情 <ArrowRight size={16} className="ml-1" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {data.content.length === 0 && (
                <div className="text-center py-20 text-gray-500">
                    暂无上架的套装商品
                </div>
            )}
        </div>
    )
}
