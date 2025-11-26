// app/(site)/toys/[...slug]/ProductDetailClient.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProductResponse, ProductSku } from '@/types/product';
import { useToast } from '@/contexts/toastContext';
import { useCartStore } from '@/stores/useCartStore';
import ProductGallery from './productGallery';
import { getProductImageUrl } from '@/lib/image-utils';
import Breadcrumb from '@/components/common/breadcrumb';
import { Z_INDEX } from '@/lib/constants/z-index';
import { ShoppingBag, ShieldCheck, Package, Truck, ChevronDown, ChevronUp, Star } from 'lucide-react';

interface ProductDetailClientProps {
    product: ProductResponse;
    breadcrumbs: any[];
    galleryImages: any[];
    specifications: any[];
    features: string[];
    description: string;
    defaultColor: string | null;
    colorMap: { [key: string]: string };
}

export default function ProductDetailClient({
                                                product,
                                                breadcrumbs,
                                                galleryImages,
                                                specifications,
                                                features,
                                                description,
                                                defaultColor,
                                                colorMap
                                            }: ProductDetailClientProps) {
    const [addingToCart, setAddingToCart] = useState(false);
    const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);
    const [expandedSection, setExpandedSection] = useState<string | null>('description');
    const { showToast } = useToast();
    const addItemToCart = useCartStore(state => state.addItemToCart);

    useEffect(() => {
        if (product.productSkus && product.productSkus.length > 0) {
            if (defaultColor) {
                const matchingSku = product.productSkus.find(sku => sku.color?.toLowerCase() === defaultColor.toLowerCase());
                if (matchingSku) { setSelectedSku(matchingSku); return; }
            }
            setSelectedSku(product.productSkus[0]);
        }
    }, [product.productSkus, defaultColor]);

    const getAvailableStock = (sku: ProductSku | null | undefined) => {
        if (!sku) return 0;
        return (sku.stock || 0) - (sku.lockedStock || 0);
    };

    const getMappedColor = (color: string) => colorMap[color.toLowerCase().trim()] || color;
    const isOnSale = product.originalPrice > product.currentPrice;

    const handleAddToCart = async () => {
        if (!product || !selectedSku) return;
        if (getAvailableStock(selectedSku) <= 0) return;
        try {
            setAddingToCart(true);
            await addItemToCart({
                productId: product.id,
                productTitle: product.title,
                productSku: selectedSku.sku,
                productImage: getProductImageUrl('', product.image),
                unitPrice: product.currentPrice,
                quantity: 1,
                color: selectedSku.color,
                skuId: selectedSku.id
            });
        } catch (error) {
            console.error(error);
            showToast('error', 'Error', 'Failed to add product.');
        } finally {
            setAddingToCart(false);
        }
    };

    const toggleSection = (section: string) => setExpandedSection(expandedSection === section ? null : section);

    return (
        // ✅ 修复：移除内部 max-w-7xl，直接使用 w-full，依赖父级容器对齐
        <div className="w-full pb-24 lg:pb-10">
            <Breadcrumb items={breadcrumbs} showLastItem={false} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mt-6">
                {/* Left: Gallery */}
                <div>
                    <ProductGallery images={galleryImages} productTitle={product.title} />
                </div>

                {/* Right: Product Info */}
                <div className="flex flex-col">
                    <div className="border-b border-gray-100 pb-6 mb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 font-['Playfair_Display'] leading-tight">
                            {product.title}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-3">
                                {isOnSale ? (
                                    <>
                                        <span className="text-2xl font-bold text-[#b62337]">${product.currentPrice.toFixed(2)}</span>
                                        <span className="text-lg text-gray-400 line-through decoration-gray-300">${product.originalPrice.toFixed(2)}</span>
                                        <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">Sale</span>
                                    </>
                                ) : (
                                    <span className="text-2xl font-bold text-gray-900">${product.currentPrice.toFixed(2)}</span>
                                )}
                            </div>
                            <div className="flex items-center gap-1">
                                {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-yellow-400 text-yellow-400" />)}
                                <span className="text-xs text-gray-500 ml-1">(4.9)</span>
                            </div>
                        </div>
                    </div>

                    {product.productSkus && product.productSkus.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">
                                Color: <span className="text-gray-500 font-normal capitalize">{selectedSku?.color || 'Select'}</span>
                            </h3>
                            <div className="flex flex-wrap gap-3">
                                {product.productSkus.map((sku) => {
                                    const isSelected = selectedSku?.id === sku.id;
                                    const isOutOfStock = getAvailableStock(sku) <= 0;
                                    const colorHex = getMappedColor(sku.color || '');
                                    return (
                                        <button
                                            key={sku.id}
                                            onClick={() => !isOutOfStock && setSelectedSku(sku)}
                                            disabled={isOutOfStock}
                                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all relative ${isSelected ? 'ring-2 ring-offset-2 ring-black scale-110' : 'hover:scale-105'} ${isOutOfStock ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer shadow-sm'}`}
                                            style={{ backgroundColor: colorHex === '#FFFFFF' ? '#F3F4F6' : colorHex }}
                                            title={sku.color}
                                        >
                                            {isOutOfStock && <div className="absolute inset-0 flex items-center justify-center"><div className="w-full h-0.5 bg-gray-400 rotate-45"></div></div>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    <div className="hidden lg:block mb-8">
                        <button
                            className={`w-full py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-900'}`}
                            onClick={handleAddToCart}
                            disabled={addingToCart || !selectedSku || getAvailableStock(selectedSku) <= 0}
                        >
                            {addingToCart ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShoppingBag size={20} strokeWidth={2} />{getAvailableStock(selectedSku) <= 0 ? 'Out of Stock' : 'Add to Bag'}</>}
                        </button>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-8 py-6 border-t border-b border-gray-100">
                        <div className="flex flex-col items-center text-center gap-2"><div className="p-2 bg-pink-50 rounded-full text-pink-600"><Package size={20} /></div><span className="text-xs font-medium text-gray-600">Discreet<br/>Packaging</span></div>
                        <div className="flex flex-col items-center text-center gap-2"><div className="p-2 bg-purple-50 rounded-full text-purple-600"><ShieldCheck size={20} /></div><span className="text-xs font-medium text-gray-600">Body-Safe<br/>Materials</span></div>
                        <div className="flex flex-col items-center text-center gap-2"><div className="p-2 bg-blue-50 rounded-full text-blue-600"><Truck size={20} /></div><span className="text-xs font-medium text-gray-600">Free Shipping<br/>Over $40</span></div>
                    </div>

                    <div className="border-b border-gray-100">
                        <button onClick={() => toggleSection('description')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                            Description {expandedSection === 'description' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </button>
                        {expandedSection === 'description' && <div className="pb-6 text-gray-600 leading-relaxed whitespace-pre-line animate-fadeIn">{description}</div>}
                    </div>

                    {specifications.length > 0 && (
                        <div className="border-b border-gray-100">
                            <button onClick={() => toggleSection('specs')} className="w-full flex justify-between items-center py-4 text-left font-bold text-gray-900">
                                Specifications {expandedSection === 'specs' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {expandedSection === 'specs' && (
                                <div className="pb-6 grid grid-cols-1 gap-2 animate-fadeIn">
                                    {specifications.map((spec, idx) => (
                                        <div key={idx} className="flex justify-between py-2 border-b border-gray-50 last:border-0">
                                            <span className="text-gray-500 capitalize">{spec.specKey.replace(/_/g, ' ')}</span>
                                            <span className="font-medium text-gray-900">{spec.specValue}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center gap-4" style={{ zIndex: Z_INDEX.STICKY }}>
                <div className="flex-1">
                    <p className="text-xs text-gray-500 truncate">{product.title}</p>
                    {isOnSale ? <div className="flex items-center gap-2"><p className="font-bold text-[#b62337]">${product.currentPrice}</p><p className="text-xs text-gray-400 line-through">${product.originalPrice}</p></div> : <p className="font-bold text-gray-900">${product.currentPrice}</p>}
                </div>
                <button className={`px-8 py-3 rounded-full font-bold text-sm transition-all shadow-md ${!selectedSku || getAvailableStock(selectedSku) <= 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`} onClick={handleAddToCart} disabled={addingToCart || !selectedSku || getAvailableStock(selectedSku) <= 0}>
                    {addingToCart ? 'Adding...' : 'Add to Bag'}
                </button>
            </div>
        </div>
    );
}