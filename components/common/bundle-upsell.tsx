// components/common/bundle-upsell.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { bundleService } from '@/services/bundleService'
import { useCartStore } from '@/stores/useCartStore'
import { ProductBundle } from '@/types/bundle'
import { Package, Check, Loader2 } from 'lucide-react'
import { getProductImageUrl } from '@/lib/image-utils'
import { useToast } from '@/contexts/toastContext'

interface BundleUpsellProps {
    bundles: ProductBundle[]
}

export default function BundleUpsell({ bundles }: BundleUpsellProps) {
    const { cart, getCart } = useCartStore()
    const { showToast } = useToast()
    const [addingBundleId, setAddingBundleId] = useState<number | null>(null)

    if (bundles.length === 0) return null

    const handleAddBundleToCart = async (bundle: ProductBundle) => {
        console.log('[BundleUpsell] handleAddBundleToCart called', { bundleId: bundle.id, hasCart: !!cart?.id });
        
        setAddingBundleId(bundle.id)
        try {
            // 确保购物车已初始化
            let currentCart = cart || null
            if (!currentCart?.id) {
                console.log('[BundleUpsell] Cart not initialized, calling getCart()...');
                currentCart = await getCart() || null
                console.log('[BundleUpsell] getCart() returned:', currentCart);
            }
            
            if (!currentCart?.id) {
                console.error('[BundleUpsell] Cart still not initialized after getCart()');
                showToast('error', 'Unable to Add', 'Your shopping bag is not ready. Please refresh the page and try again.')
                return
            }

            console.log('[BundleUpsell] Adding bundle to cart', { bundleId: bundle.id, cartId: currentCart.id });
            await bundleService.addToCart(bundle.id, 1, currentCart.id)
            await getCart()
            showToast('success', 'Added', `${bundle.bundleName} added to your bag`)
        } catch (error: any) {
            console.error('[BundleUpsell] Failed to add bundle:', error);
            showToast('error', 'Error', error.message || 'Failed to add bundle')
        } finally {
            setAddingBundleId(null)
        }
    }

    return (
        <div className="mt-6 bg-white rounded-lg border border-gray-200">
            <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Complete the Look</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {bundles.map(bundle => {
                    const isAdding = addingBundleId === bundle.id
                    // 使用套装内第一个商品的主图
                    const firstItem = bundle.items?.[0]
                    const mainItemImage = firstItem?.productImage || bundle.coverImage

                    return (
                        <div key={bundle.id} className="p-4">
                            {/* 上方：标题 + 商品横向列表 */}
                            <div className="mb-3">
                                <h4 className="font-semibold text-gray-900 text-sm mb-2">{bundle.bundleName}</h4>
                                {bundle.subtitle && (
                                    <p className="text-xs text-gray-500 mb-2">{bundle.subtitle}</p>
                                )}
                                
                                {/* 商品横向滚动列表 */}
                                {bundle.items && bundle.items.length > 0 && (
                                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {bundle.items.map((item) => (
                                            <div key={item.productId} className="flex-shrink-0 flex flex-col items-center gap-2">
                                                <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                                    {item.productImage ? (
                                                        <Image 
                                                            src={getProductImageUrl(undefined, item.productImage)} 
                                                            alt={item.productName || 'Bundle item'} 
                                                            width={96}
                                                            height={96}
                                                            className="w-full h-full object-cover" 
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">
                                                            <Package size={32} />
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="text-xs text-gray-700 font-medium text-center max-w-[100px] truncate">{item.productName}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 下方：价格 + 按钮 */}
                            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-lg font-bold text-red-600">${Number(bundle.bundlePrice).toFixed(2)}</span>
                                        {Number(bundle.originalPrice) > Number(bundle.bundlePrice) && (
                                            <span className="text-sm text-gray-400 line-through">${Number(bundle.originalPrice).toFixed(2)}</span>
                                        )}
                                    </div>
                                    {Number(bundle.originalPrice) > Number(bundle.bundlePrice) && (
                                        <div className="flex items-center gap-1">
                                            <Check size={12} className="text-green-600" />
                                            <span className="text-xs font-bold text-green-600">
                                                Save ${(Number(bundle.originalPrice) - Number(bundle.bundlePrice)).toFixed(2)} Today
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => handleAddBundleToCart(bundle)}
                                    disabled={isAdding}
                                    className="px-5 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 flex-shrink-0"
                                >
                                    {isAdding ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={16} />
                                            Add Bundle
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
