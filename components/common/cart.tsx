// components/common/cart.tsx
'use client';

import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/toastContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { Z_INDEX } from '@/lib/constants/z-index';
import { colorMap } from '@/lib/constants/color-map';
import Image from 'next/image';
import { getProductImageUrl } from '@/lib/image-utils';
import { X, ShoppingBag, Plus, Minus, Loader2, Trash2 } from 'lucide-react';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Cart({ isOpen, onClose }: CartProps) {
    const {
        cart,
        error,
        totalItems,
        getCart,
        updateItemQuantity,
        removeItemFromCart
    } = useCartStore();
    const { showToast } = useToast();
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [isUpdating, setIsUpdating] = useState<number | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(false);

    useEffect(() => {
        if (isOpen && isLoggedIn) {
            setIsInitialLoading(true);
            getCart().finally(() => {
                setIsInitialLoading(false);
            });
        }
    }, [isOpen, isLoggedIn, getCart]);

    const handleIncreaseQuantity = async (itemId: number, currentQuantity: number) => {
        setIsUpdating(itemId);
        try {
            await updateItemQuantity(itemId, currentQuantity + 1);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showToast('error', 'Update Failed', 'Failed to update item quantity');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleDecreaseQuantity = async (itemId: number, currentQuantity: number) => {
        if (currentQuantity <= 1) return;
        setIsUpdating(itemId);
        try {
            await updateItemQuantity(itemId, currentQuantity - 1);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showToast('error', 'Update Failed', 'Failed to update item quantity');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        setIsUpdating(itemId);
        try {
            await removeItemFromCart(itemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
            showToast('error', 'Removal Failed', 'Failed to remove item from cart');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleCheckout = () => {
        if (!hasCartItems) {
            showToast('warning', 'Empty Cart', 'Please add items to cart first');
            return;
        }
        onClose();
        router.push('/checkout');
    };

    const calculateTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((total, item) => total + item.totalPrice, 0);
    };

    const getColorValue = (colorName: string): string => {
        const normalizedColor = colorName.toLowerCase().trim();
        return colorMap[normalizedColor] || '#CCCCCC';
    };

    const formatColorDisplay = (color: string | undefined) => {
        if (!color) return null;
        const bgStyle = color.startsWith('#') ? color : getColorValue(color);
        const borderStyle = bgStyle.toLowerCase() === '#ffffff' ? '1px solid #e5e7eb' : 'none';

        return (
            <div className="flex items-center gap-2 text-sm">
                <span
                    className="w-4 h-4 rounded-full inline-block shadow-sm"
                    style={{ backgroundColor: bgStyle, border: borderStyle }}
                    title={color}
                />
                <span className="text-gray-500 text-xs capitalize">{color}</span>
            </div>
        );
    };

    const hasCartItems = cart?.items && cart.items.length > 0;
    const isEmptyCart = !hasCartItems;

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 right-0 h-full bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${ // ✅ 统一动画曲线
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                } w-full sm:w-[450px]`}
                style={{ zIndex: Z_INDEX.DRAWER }}
            >
                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-100">
                    <h3 className="text-gray-900 font-bold text-xl font-['Playfair_Display'] m-0 flex items-center gap-2">
                        Your Bag
                        <span className="text-sm font-sans font-normal text-gray-500">({totalItems})</span>
                        {isInitialLoading && <Loader2 className="animate-spin text-gray-400 w-4 h-4" />}
                    </h3>
                    <button
                        className="text-gray-500 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-all"
                        onClick={onClose}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                    {error && (
                        <div className="bg-red-50 border border-red-100 rounded-lg p-4 text-center mb-4 text-sm text-red-600">
                            <p>Failed to load cart: {error}</p>
                            <button
                                className="mt-2 text-xs underline font-semibold"
                                onClick={() => {
                                    setIsInitialLoading(true);
                                    getCart().finally(() => setIsInitialLoading(false));
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {isInitialLoading && !cart && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Loader2 className="animate-spin w-8 h-8 mb-3" />
                            <p>Loading...</p>
                        </div>
                    )}

                    {!isInitialLoading && !isLoggedIn && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Your bag is empty</h4>
                            <p className="text-gray-500 mb-6">Login to see your saved items</p>
                            <button
                                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}

                    {!isInitialLoading && isLoggedIn && isEmptyCart && (
                        <div className="flex flex-col items-center justify-center h-full text-center p-6">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <ShoppingBag className="w-8 h-8 text-gray-300" />
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-2">Your bag is empty</h4>
                            <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
                            <button
                                className="w-full bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition-colors"
                                onClick={onClose}
                            >
                                Start Shopping
                            </button>
                        </div>
                    )}

                    {!isInitialLoading && isLoggedIn && hasCartItems && (
                        <div className="flex flex-col gap-6">
                            {cart.items.map(item => (
                                <div key={item.itemId} className="flex gap-4">
                                    <div className="relative w-24 h-24 flex-shrink-0 border border-gray-100 rounded-lg overflow-hidden bg-gray-50">
                                        {item.productImage ? (
                                            <Image
                                                src={getProductImageUrl('', item.productImage)}
                                                alt={item.productTitle}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-xl font-bold">
                                                {item.productTitle.charAt(0)}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h4 className="font-medium text-sm text-gray-900 line-clamp-2 leading-snug">
                                                    {item.productTitle}
                                                </h4>
                                                <button
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1 -mr-1"
                                                    onClick={() => handleRemoveItem(item.itemId)}
                                                    disabled={isUpdating === item.itemId}
                                                >
                                                    {isUpdating === item.itemId ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </div>

                                            {item.color && <div className="mt-1.5">{formatColorDisplay(item.color)}</div>}
                                        </div>

                                        <div className="flex justify-between items-end mt-2">
                                            <div className="flex items-center border border-gray-200 rounded-md">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item.itemId, item.quantity)}
                                                    disabled={item.quantity <= 1 || isUpdating === item.itemId}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                                >
                                                    <Minus className="w-3 h-3" />
                                                </button>
                                                <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item.itemId, item.quantity)}
                                                    disabled={isUpdating === item.itemId}
                                                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                                >
                                                    <Plus className="w-3 h-3" />
                                                </button>
                                            </div>
                                            <p className="font-bold text-gray-900">
                                                ${item.unitPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {isLoggedIn && hasCartItems && (
                    <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                        <div className="flex justify-between text-base font-bold mb-4 text-gray-900">
                            <span>Subtotal</span>
                            <span>${calculateTotal().toFixed(2)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-4 text-center">Shipping & taxes calculated at checkout</p>
                        <div className="flex flex-col gap-3">
                            <button
                                className="w-full bg-black text-white py-4 rounded-lg font-bold hover:bg-gray-800 transition-colors shadow-md"
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                            <button
                                className="w-full bg-white border border-gray-200 text-gray-900 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}