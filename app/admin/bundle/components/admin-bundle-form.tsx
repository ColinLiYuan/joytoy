// app/admin/bundle/components/admin-bundle-form.tsx
'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { bundleService } from '@/services/bundleService'
import { productService } from '@/services/productService'
import { uploadBundleImage } from '@/app/actions/bundle'
import { ProductBundle, ProductBundleItem } from '@/types/bundle'
import { ProductResponse } from '@/types/product'
import { getProductImageUrl } from '@/lib/image-utils'
import { Save, Plus, Trash2, Loader2, Package, Search, Check, Upload, Image as ImageIcon } from 'lucide-react'

interface AdminBundleFormProps {
    initialData?: ProductBundle
}

export default function AdminBundleForm({ initialData }: AdminBundleFormProps) {
    const router = useRouter()
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [loading, setLoading] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [products, setProducts] = useState<ProductResponse[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showProductSelector, setShowProductSelector] = useState(false)
    const [selectingProduct, setSelectingProduct] = useState<ProductResponse | null>(null)

    const [formData, setFormData] = useState({
        bundleName: '',
        slug: '',
        subtitle: '',
        description: '',
        coverImage: '',
        bundlePrice: 0,
        stock: 999,
        items: [] as ProductBundleItem[]
    })

    // 加载商品列表
    useEffect(() => {
        loadProducts()
    }, [])

    // 处理初始数据回显（依赖 products 加载完成）
    useEffect(() => {
        if (initialData && products.length > 0) {
            // 编辑时，需要从商品列表中补充图片信息
            const enrichedItems = (initialData.items || []).map(item => {
                const product = products.find(p => p.id === item.productId)
                return {
                    ...item,
                    // 统一使用 getProductImageUrl 处理，确保即使是后端返回的相对路径也能正确拼接 R2 地址
                    productImage: item.productImage 
                        ? getProductImageUrl(undefined, item.productImage) 
                        : getProductImageUrl(undefined, product?.image),
                    unitPrice: item.unitPrice || product?.currentPrice || 0
                }
            })
            
            setFormData({
                bundleName: initialData.bundleName,
                slug: initialData.slug,
                subtitle: initialData.subtitle || '',
                description: initialData.description || '',
                coverImage: initialData.coverImage,
                bundlePrice: initialData.bundlePrice,
                stock: initialData.stock || 999,
                items: enrichedItems
            })
        }
    }, [initialData, products])

    const loadProducts = async () => {
        try {
            const data = await productService.adminList('', 0, 100)
            setProducts(data.content || [])
        } catch (error) {
            console.error('Failed to load products:', error)
        }
    }

    // 计算原价（所有选中商品的单价总和）
    const originalPrice = useMemo(() => {
        return formData.items.reduce((sum, item) => sum + ((item.unitPrice || 0) * item.quantity), 0)
    }, [formData.items])

    // 计算折扣率
    const discountRate = useMemo(() => {
        if (originalPrice === 0) return 0
        return ((originalPrice - formData.bundlePrice) / originalPrice)
    }, [originalPrice, formData.bundlePrice])

    // 所有商品都可选（允许重复选择）
    const availableProducts = useMemo(() => {
        return products
    }, [products])

    // 搜索过滤
    const filteredProducts = useMemo(() => {
        if (!searchTerm) return availableProducts
        return availableProducts.filter(p => 
            p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [availableProducts, searchTerm])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }))
    }

    // 添加商品到套装（支持SKU选择）
    const addProduct = (product: ProductResponse, selectedSkuId?: number) => {
        const selectedSku = selectedSkuId 
            ? product.productSkus?.find(s => s.id === selectedSkuId)
            : product.productSkus?.find(s => s.stock > 0) || product.productSkus?.[0]
        
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, {
                productId: product.id,
                productTitle: product.title,
                productSlug: product.slug,
                productImage: getProductImageUrl(undefined, product.image),
                quantity: 1,
                unitPrice: product.currentPrice,
                skuId: selectedSku?.id,
                productName: product.name,
                isOptional: false,
                sortOrder: prev.items.length + 1
            }]
        }))
        setShowProductSelector(false)
        setSearchTerm('')
    }

    // 移除商品
    const removeItem = (index: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }))
    }

    // 更新商品SKU
    const updateItemSku = (index: number, skuId: number | undefined) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => {
                if (i === index) {
                    // SKU价格与商品当前价格一致
                    return {
                        ...item,
                        skuId
                    }
                }
                return item
            })
        }))
    }

    // 更新商品数量
    const updateItemQuantity = (index: number, quantity: number) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map((item, i) => 
                i === index ? { ...item, quantity } : item
            )
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (formData.items.length === 0) {
            alert('请至少选择一个商品')
            return
        }

        setLoading(true)
        try {
            const submitData = {
                ...formData,
                originalPrice,
                discountRate,
                isActive: true,
                isFeatured: false,
                sortOrder: 0,
                giftWrapAvailable: true,
                privacyPackaging: true
            }

            if (initialData?.id) {
                await bundleService.update(initialData.id, submitData)
                alert('套装更新成功！')
            } else {
                await bundleService.create(submitData)
                alert('套装创建成功！')
            }
            router.push('/admin/bundle')
            router.refresh()
        } catch (error: any) {
            console.error('Save failed:', error)
            alert('保存失败: ' + (error.message || '未知错误'))
        } finally {
            setLoading(false)
        }
    }

    // 触发文件选择
    const triggerFileInput = () => {
        fileInputRef.current?.click()
    }

    // 处理文件上传
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // 验证文件类型
        const validTypes = ['image/png', 'image/jpeg', 'image/webp']
        if (!validTypes.includes(file.type)) {
            alert(`文件格式错误。\n\n请上传 PNG, JPG 或 WebP 格式的图片。`)
            e.target.value = ''
            return
        }

        // 验证文件大小（5MB）
        if (file.size > 5 * 1024 * 1024) {
            alert('图片大小不能超过 5MB')
            e.target.value = ''
            return
        }

        try {
            setUploadingImage(true)
            
            // 使用 Server Action 上传
            const formData = new FormData()
            formData.append('file', file)
            
            const result = await uploadBundleImage(formData)
            
            // 填入后端返回的原始路径
            setFormData(prev => ({
                ...prev,
                coverImage: result.url
            }))
        } catch (error) {
            console.error('图片上传失败:', error)
            alert('图片上传失败，请重试')
        } finally {
            setUploadingImage(false)
            e.target.value = ''
        }
    }

    // 预览图片URL
    const coverImageUrl = formData.coverImage ? getProductImageUrl('', formData.coverImage) : ''

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* 基本信息 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-gray-900">套装信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">套装名称 *</label>
                        <input 
                            required 
                            name="bundleName" 
                            value={formData.bundleName} 
                            onChange={handleChange} 
                            placeholder="例如：情人节浪漫礼盒"
                            className="w-full px-3 py-2 border rounded-lg" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL标识) *</label>
                        <input 
                            required 
                            name="slug" 
                            value={formData.slug} 
                            onChange={handleChange} 
                            placeholder="valentine-gift-box"
                            className="w-full px-3 py-2 border rounded-lg" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">库存数量 *</label>
                        <input 
                            type="number"
                            min="0"
                            name="stock" 
                            value={formData.stock} 
                            onChange={handleChange} 
                            placeholder="999"
                            className="w-full px-3 py-2 border rounded-lg" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">副标题</label>
                        <input 
                            name="subtitle" 
                            value={formData.subtitle} 
                            onChange={handleChange} 
                            placeholder="一句话卖点"
                            className="w-full px-3 py-2 border rounded-lg" 
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                        <div className="space-y-3">
                            {/* 隐藏的文件输入 */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            
                            {/* 图片预览和上传按钮 */}
                            <div className="flex items-start gap-4">
                                {/* 图片预览 */}
                                <div className="relative w-32 h-32 bg-gray-100 rounded-lg overflow-hidden border border-gray-300 flex-shrink-0">
                                    {coverImageUrl ? (
                                        <img 
                                            src={coverImageUrl} 
                                            alt="封面预览" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <ImageIcon size={32} />
                                        </div>
                                    )}
                                </div>
                                
                                {/* 上传按钮和信息 */}
                                <div className="flex-1 space-y-2">
                                    <button
                                        type="button"
                                        onClick={triggerFileInput}
                                        disabled={uploadingImage}
                                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 flex items-center gap-2 text-sm font-medium"
                                    >
                                        {uploadingImage ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                上传中...
                                            </>
                                        ) : (
                                            <>
                                                <Upload size={16} />
                                                选择图片
                                            </>
                                        )}
                                    </button>
                                    
                                    <p className="text-xs text-gray-500">
                                        支持 JPG、PNG 格式，建议尺寸 800x800px，最大 5MB
                                    </p>
                                    
                                    {/* URL输入（可选） */}
                                    {formData.coverImage && (
                                        <div className="text-xs text-gray-600 break-all bg-gray-50 p-2 rounded">
                                            <span className="font-medium">已上传:</span> {formData.coverImage}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 选择商品 */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900">选择商品 ({formData.items.length})</h3>
                    <button 
                        type="button" 
                        onClick={() => setShowProductSelector(!showProductSelector)}
                        className="px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                    >
                        <Plus size={16} /> 添加商品
                    </button>
                </div>

                {/* 商品选择器弹窗 */}
                {showProductSelector && (
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="relative mb-4">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="搜索商品..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border rounded-lg"
                            />
                        </div>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                            {filteredProducts.length === 0 ? (
                                <p className="text-sm text-gray-500 text-center py-4">暂无可选商品</p>
                            ) : (
                                filteredProducts.map(product => (
                                    <div key={product.id}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                // 显示SKU选择器（即使只有一个SKU）
                                                setSelectingProduct(product)
                                            }}
                                            className="w-full flex items-center gap-3 p-3 bg-white border rounded-lg hover:border-indigo-500 transition-colors text-left"
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                {product.image && (
                                                    <img src={getProductImageUrl(undefined, product.image)} alt={product.title} className="w-full h-full object-cover" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="font-medium text-gray-900 truncate">{product.title}</div>
                                                <div className="text-sm text-gray-500">${product.currentPrice.toFixed(2)}</div>
                                                {product.productSkus && product.productSkus.length > 0 && (
                                                    <div className="text-xs text-indigo-600 mt-1">
                                                        {product.productSkus.length} 个规格可选
                                                    </div>
                                                )}
                                            </div>
                                            <Plus size={16} className="text-indigo-600" />
                                        </button>
                                        
                                        {/* SKU选择器 */}
                                        {selectingProduct?.id === product.id && (
                                            <div className="mt-2 ml-2 p-3 bg-white border-2 border-indigo-200 rounded-lg">
                                                <div className="text-sm font-medium text-gray-700 mb-2">选择规格:</div>
                                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                                    {product.productSkus?.map(sku => (
                                                        <button
                                                            key={sku.id}
                                                            type="button"
                                                            onClick={() => {
                                                                addProduct(product, sku.id)
                                                                setSelectingProduct(null)
                                                            }}
                                                            disabled={sku.stock <= 0}
                                                            className="w-full flex items-center justify-between p-2 border rounded hover:bg-indigo-50 disabled:opacity-50 disabled:cursor-not-allowed text-left"
                                                        >
                                                            <div>
                                                                <div className="text-sm font-medium">
                                                                    {sku.color || '默认'}
                                                                </div>
                                                                <div className="text-xs text-gray-500">SKU: {sku.sku}</div>
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-xs text-gray-500">库存: {sku.stock}</div>
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectingProduct(null)}
                                                    className="mt-2 w-full py-1 text-sm text-gray-600 hover:text-gray-900 border rounded"
                                                >
                                                    取消
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* 已选商品列表 */}
                <div className="space-y-2">
                    {formData.items.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 border-2 border-dashed rounded-lg">
                            <Package size={48} className="mx-auto mb-2 opacity-50" />
                            <p>点击上方"添加商品"按钮选择商品</p>
                        </div>
                    ) : (
                        formData.items.map((item, index) => {
                            const product = products.find(p => p.id === item.productId)
                            const currentSku = item.skuId ? product?.productSkus?.find(s => s.id === item.skuId) : null
                            
                            return (
                                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border">
                                    <div className="w-16 h-16 bg-white rounded overflow-hidden flex-shrink-0 border">
                                        {item.productImage && (
                                            <img src={getProductImageUrl(undefined, item.productImage)} alt={item.productTitle} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-gray-900 truncate">{item.productTitle}</div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            {currentSku ? (
                                                <span>
                                                    规格: {currentSku.color || '默认'}
                                                    <span className="ml-2 text-xs text-gray-400">(SKU: {currentSku.sku})</span>
                                                </span>
                                            ) : (
                                                '无规格'
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500">单价: ${(item.unitPrice || 0).toFixed(2)}</div>
                                        
                                        {/* SKU选择器 - 始终显示（如果有SKU） */}
                                        {product?.productSkus && product.productSkus.length > 0 && (
                                            <div className="mt-2">
                                                <select
                                                    value={item.skuId || ''}
                                                    onChange={(e) => updateItemSku(index, e.target.value ? parseInt(e.target.value) : undefined)}
                                                    className="text-xs px-2 py-1 border rounded bg-white"
                                                >
                                                    <option value="">选择规格...</option>
                                                    {product.productSkus.map(sku => (
                                                        <option key={sku.id} value={sku.id} disabled={sku.stock <= 0}>
                                                            {sku.color || '默认'} - SKU: {sku.sku} (库存:{sku.stock})
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <label className="text-sm text-gray-600">数量:</label>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => updateItemQuantity(index, parseInt(e.target.value) || 1)}
                                            className="w-16 px-2 py-1 border rounded text-center"
                                        />
                                    </div>
                                    <div className="text-right min-w-[80px]">
                                        <div className="text-sm text-gray-500">小计</div>
                                        <div className="font-bold text-gray-900">${((item.unitPrice || 0) * item.quantity).toFixed(2)}</div>
                                    </div>
                                    <button 
                                        type="button"
                                        onClick={() => removeItem(index)}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* 价格汇总 */}
                {formData.items.length > 0 && (
                    <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">商品原价总和:</span>
                            <span className="font-medium">${originalPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-medium text-gray-700">套装售价 ($):</label>
                            <input
                                type="number"
                                step="0.01"
                                name="bundlePrice"
                                value={formData.bundlePrice}
                                onChange={handleChange}
                                className="w-32 px-3 py-2 border rounded-lg text-right font-bold"
                            />
                        </div>
                        {discountRate > 0 && (
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600">折扣力度:</span>
                                <span className="font-bold text-green-600">{(discountRate * 100).toFixed(0)}% OFF</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* 提交按钮 */}
            <div className="flex items-center justify-end gap-4 pt-4">
                <button 
                    type="button" 
                    onClick={() => router.back()} 
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                    取消
                </button>
                <button 
                    disabled={loading || formData.items.length === 0} 
                    type="submit" 
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 disabled:opacity-50"
                >
                    {loading && <Loader2 className="animate-spin h-4 w-4" />}
                    <Save size={16} /> 
                    {initialData ? '更新套装' : '创建套装'}
                </button>
            </div>
        </form>
    )
}
