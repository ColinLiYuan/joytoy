// app/(site)/bundles/[slug]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { bundleService } from '@/services/bundleService'
import { useCartStore } from '@/stores/useCartStore'
import { Package, Check, ShoppingCart, Loader2 } from 'lucide-react'
import { ProductBundle } from '@/types/bundle'
import { getProductImageUrl } from '@/lib/image-utils'
import Image from 'next/image'

export default function BundleDetailPage() {
    const params = useParams()
    const { cart, getCart } = useCartStore()
    const [bundle, setBundle] = useState<ProductBundle | null>(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        const fetchBundle = async () => {
            if (!params.slug) return
            try {
                const data = await bundleService.getBySlug(params.slug as string)
                setBundle(data)
            } catch (error) {
                console.error('Failed to fetch bundle:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchBundle()
    }, [params.slug])

    // 确保购物车已加载
    useEffect(() => {
        if (!cart) {
            getCart()
        }
    }, [cart, getCart])

    const handleAddToCart = async () => {
        if (!bundle || !cart?.id) {
            alert('购物车未初始化，请稍后重试')
            return
        }
        
        setAdding(true)
        try {
            await bundleService.addToCart(bundle.id, 1, cart.id)
            // 刷新购物车
            await getCart()
            alert('套装已成功加入购物袋！')
        } catch (error: any) {
            alert(error.message || '加入购物袋失败')
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
        )
    }

    if (!bundle) {
        notFound()
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* 左侧：图片展示 */}
                <div className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-200">
                        {bundle.coverImage ? (
                            <img src={getProductImageUrl('', bundle.coverImage)} alt={bundle.bundleName} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package size={80} />
                            </div>
                        )}
                    </div>
                </div>

                {/* 右侧：信息详情 */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{bundle.bundleName}</h1>
                        <p className="text-lg text-gray-500">{bundle.subtitle}</p>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <span className="text-3xl font-bold text-indigo-600">${bundle.bundlePrice.toFixed(2)}</span>
                        {bundle.originalPrice > bundle.bundlePrice && (
                            <>
                                <span className="text-xl text-gray-400 line-through">${bundle.originalPrice.toFixed(2)}</span>
                                <span className="px-2 py-1 bg-red-100 text-red-700 text-sm font-bold rounded">
                                    省 ${(bundle.originalPrice - bundle.bundlePrice).toFixed(2)}
                                </span>
                            </>
                        )}
                    </div>

                    <div className="prose prose-sm text-gray-600">
                        <p>{bundle.description}</p>
                    </div>

                    {/* 包含商品清单 */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <Package size={20} /> What's Included ({bundle.items?.length || 0} items)
                        </h3>
                        <ul className="space-y-3">
                            {bundle.items?.map((item, idx) => (
                                <li key={idx} className="flex items-center gap-3">
                                    {/* 商品图片 */}
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0">
                                        {item.productImage ? (
                                            <Image
                                                src={getProductImageUrl(undefined, item.productImage)}
                                                alt={item.productName || ''}
                                                width={64}
                                                height={64}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    {/* 商品信息 */}
                                    <div className="flex-1 min-w-0">
                                        <span className="font-medium text-gray-900 block truncate">{item.productName || item.productTitle}</span>
                                        <span className="text-sm text-gray-500">Qty: x{item.quantity}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 特性标签 */}
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {bundle.giftWrapAvailable && (
                            <div className="flex items-center gap-1">
                                <Check size={16} className="text-indigo-600" /> Gift Wrapping Available
                            </div>
                        )}
                        {bundle.privacyPackaging && (
                            <div className="flex items-center gap-1">
                                <Check size={16} className="text-indigo-600" /> Privacy Packaging
                            </div>
                        )}
                    </div>

                    <button 
                        disabled={adding}
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {adding ? <Loader2 className="animate-spin h-5 w-5" /> : <ShoppingCart size={20} />} 
                        {adding ? 'Adding to Bag...' : 'Add to Bag'}
                    </button>
                </div>
            </div>
        </div>
    )
}
