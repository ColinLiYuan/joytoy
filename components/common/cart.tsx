// /components/cart.tsx (修复版本)
'use client';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faTimes,
    faShoppingCart,
    faTrash,
    faPlus,
    faMinus,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useToast } from '@/contexts/toastContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/authContext';
import { useCartStore } from '@/stores/useCartStore';
import { Z_INDEX } from '@/lib/constants/z-index';
import { colorMap } from '@/lib/constants/color-map';
import Image from 'next/image';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

interface CartItem {
    itemId: number;
    productId: number;
    productTitle: string;
    productImage?: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    color?: string;
    length?: string;
    width?: string;
    weight?: string;
}

export default function Cart({ isOpen, onClose }: CartProps) {
    const {
        cart,
        loading,
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
    const [localCart, setLocalCart] = useState<CartItem[]>([]);
    const [localTotal, setLocalTotal] = useState(0);

    // 同步本地状态和 store 状态
    useEffect(() => {
        if (cart?.items) {
            setLocalCart(cart.items);
            setLocalTotal(cart.items.reduce((total, item) => total + item.totalPrice, 0));
        }
    }, [cart]);

    // Get cart data
    useEffect(() => {
        if (isOpen) {
            getCart();
        }
    }, [isOpen, getCart]);

    // Handle quantity increase - 使用乐观更新
    const handleIncreaseQuantity = async (itemId: number, currentQuantity: number, productTitle: string) => {
        setIsUpdating(itemId);

        // 乐观更新：立即更新本地状态
        setLocalCart(prev => prev.map(item =>
            item.itemId === itemId
                ? {
                    ...item,
                    quantity: currentQuantity + 1,
                    totalPrice: item.unitPrice * (currentQuantity + 1)
                }
                : item
        ));

        try {
            await updateItemQuantity(itemId, currentQuantity + 1);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showToast('error', 'Update Failed', 'Failed to update item quantity');
            // 回滚本地状态
            getCart();
        } finally {
            setIsUpdating(null);
        }
    };

    // Handle quantity decrease - 使用乐观更新
    const handleDecreaseQuantity = async (itemId: number, currentQuantity: number, productTitle: string) => {
        if (currentQuantity <= 1) return;

        setIsUpdating(itemId);

        // 乐观更新：立即更新本地状态
        setLocalCart(prev => prev.map(item =>
            item.itemId === itemId
                ? {
                    ...item,
                    quantity: currentQuantity - 1,
                    totalPrice: item.unitPrice * (currentQuantity - 1)
                }
                : item
        ));

        try {
            await updateItemQuantity(itemId, currentQuantity - 1);
        } catch (error) {
            console.error('Failed to update quantity:', error);
            showToast('error', 'Update Failed', 'Failed to update item quantity');
            // 回滚本地状态
            getCart();
        } finally {
            setIsUpdating(null);
        }
    };

    // Handle item removal - 使用乐观更新
    const handleRemoveItem = async (itemId: number, productTitle: string) => {
        setIsUpdating(itemId);

        // 保存要删除的项目用于回滚
        const itemToRemove = localCart.find(item => item.itemId === itemId);

        // 乐观更新：立即从本地状态移除
        setLocalCart(prev => prev.filter(item => item.itemId !== itemId));

        try {
            await removeItemFromCart(itemId);
        } catch (error) {
            console.error('Failed to remove item:', error);
            showToast('error', 'Removal Failed', 'Failed to remove item from cart');
            // 回滚本地状态
            if (itemToRemove) {
                setLocalCart(prev => [...prev, itemToRemove]);
            } else {
                getCart();
            }
        } finally {
            setIsUpdating(null);
        }
    };

    // Handle checkout
    const handleCheckout = () => {
        if (!hasCartItems) {
            showToast('warning', 'Empty Cart', 'Please add items to cart first');
            return;
        }

        onClose();
        router.push('/checkout');
    };

    // Calculate total amount from local state
    const calculateTotal = () => {
        return localCart.reduce((total, item) => total + item.totalPrice, 0);
    };

    // 使用统一的颜色映射函数
    const getColorValue = (colorName: string): string => {
        const normalizedColor = colorName.toLowerCase().trim();
        return colorMap[normalizedColor] || '#CCCCCC';
    };

    // Format color display
    const formatColorDisplay = (color: string | undefined) => {
        if (!color) return null;

        // Check if color is a hex code
        if (color.startsWith('#')) {
            return (
                <div className="flex items-center gap-2 text-sm">
                    <span
                        className="w-4 h-4 rounded-full inline-block border border-gray-300 shadow-sm"
                        style={{ backgroundColor: color }}
                        title={color}
                    />
                    <span className="text-gray-600 text-xs capitalize">{color.toUpperCase()}</span>
                </div>
            );
        }

        // For named colors - 使用统一的颜色映射
        return (
            <div className="flex items-center gap-2 text-sm">
                <span
                    className="w-4 h-4 rounded-full inline-block border border-gray-300"
                    style={{
                        backgroundColor: getColorValue(color),
                        border: getColorValue(color) === '#FFFFFF' ? '1px solid #ddd' : 'none'
                    }}
                    title={color}
                />
                <span className="text-gray-600 text-xs capitalize">{color}</span>
            </div>
        );
    };

    // 修复状态计算问题 - 使用本地状态
    const hasCartItems = localCart.length > 0;
    const isEmptyCart = !hasCartItems;

    if (!isOpen) return null;

    return (
        <>
            <div
                className={`lg:hidden fixed inset-0 bg-black transition-opacity duration-300 ${
                    isOpen ? 'opacity-40' : 'opacity-0 invisible'
                }`}
                style={{ zIndex: Z_INDEX.OVERLAY }}
                onClick={onClose}
            />

            <div
                className={`fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-lg flex flex-col transition-transform duration-300 ${
                    isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}
                style={{ zIndex: Z_INDEX.MODAL }}
            >
                {/* Cart Header */}
                <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h3 className="text-gray-800 font-semibold text-lg m-0">
                        Shopping Cart ({localCart.reduce((total, item) => total + item.quantity, 0)})
                        {loading && <FontAwesomeIcon icon={faSpinner} spin className="ml-2" />}
                    </h3>
                    <button
                        className="bg-transparent border-none text-gray-800 text-xl cursor-pointer p-1 transition-all hover:text-gray-600 hover:scale-110"
                        onClick={onClose}
                    >
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {/* Cart Content */}
                <div className="flex-1 overflow-y-auto p-5">
                    {error && (
                        <div className="bg-red-50 border border-red-300 rounded-lg p-4 text-center mb-4">
                            <p className="text-red-700 m-0 mb-2">Failed to load cart: {error}</p>
                            <button
                                className="inline-block px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold transition-all hover:bg-gray-200 hover:shadow-md border-none cursor-pointer"
                                onClick={() => {
                                    getCart();
                                }}
                            >
                                Retry
                            </button>
                        </div>
                    )}

                    {loading && !cart && (
                        <div className="text-center p-10 text-gray-600">
                            <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                            <p className="mt-4">Loading cart...</p>
                        </div>
                    )}

                    {!loading && !isLoggedIn && (
                        <div className="text-center p-10 text-gray-600">
                            <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                            <p className="my-5 text-lg">Please login to view your cart</p>
                            <button
                                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg border-none cursor-pointer"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}

                    {!loading && isLoggedIn && isEmptyCart && (
                        <div className="text-center p-10 text-gray-600">
                            <FontAwesomeIcon icon={faShoppingCart} size="2x" />
                            <p className="my-5 text-lg">Your cart is empty</p>
                            <button
                                className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg border-none cursor-pointer"
                                onClick={onClose}
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}

                    {!loading && isLoggedIn && hasCartItems && (
                        <>
                            <div className="flex flex-col gap-4">
                                {localCart.map(item => (
                                    <div key={item.itemId} className="flex gap-4 py-4 border-b border-gray-100 last:border-b-0">
                                        <div className="relative">
                                            {item.productImage ? (
                                                <Image
                                                    src={item.productImage}
                                                    alt={item.productTitle}
                                                    width={80}
                                                    height={80}
                                                    className="w-20 h-20 object-cover rounded-lg bg-gray-100"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                                                    {item.productTitle.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-sm m-0 mb-1 text-gray-800">{item.productTitle}</h4>
                                            <p className="font-bold text-sm my-1" style={{ color: 'var(--price-color)' }}>
                                                ${item.unitPrice.toFixed(2)}
                                            </p>

                                            {/* Color Display */}
                                            {item.color && (
                                                <div className="my-2">
                                                    {formatColorDisplay(item.color)}
                                                </div>
                                            )}

                                            {/* Other product attributes */}
                                            {(item.length || item.width || item.weight) && (
                                                <div className="flex flex-col gap-1 my-1">
                                                    {item.length && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mr-1">Length: {item.length}</span>}
                                                    {item.width && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mr-1">Width: {item.width}</span>}
                                                    {item.weight && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block mr-1">Weight: {item.weight}</span>}
                                                </div>
                                            )}

                                            <div className="flex items-center gap-2 mt-2">
                                                <button
                                                    onClick={() => handleDecreaseQuantity(item.itemId, item.quantity, item.productTitle)}
                                                    disabled={item.quantity <= 1 || isUpdating === item.itemId}
                                                    className="w-6 h-6 border border-gray-300 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdating === item.itemId ? (
                                                        <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faMinus} className="text-xs" />
                                                    )}
                                                </button>
                                                <span className="min-w-5 text-center font-semibold">{item.quantity}</span>
                                                <button
                                                    onClick={() => handleIncreaseQuantity(item.itemId, item.quantity, item.productTitle)}
                                                    disabled={isUpdating === item.itemId}
                                                    className="w-6 h-6 border border-gray-300 bg-white rounded-lg flex items-center justify-center cursor-pointer transition-all hover:bg-purple-600 hover:text-white hover:border-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {isUpdating === item.itemId ? (
                                                        <FontAwesomeIcon icon={faSpinner} spin className="text-xs" />
                                                    ) : (
                                                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-1">
                                            <button
                                                className="bg-transparent border-none text-gray-800 cursor-pointer p-1 transition-all hover:text-red-500 hover:scale-110 disabled:opacity-50"
                                                onClick={() => handleRemoveItem(item.itemId, item.productTitle)}
                                                disabled={isUpdating === item.itemId}
                                            >
                                                {isUpdating === item.itemId ? (
                                                    <FontAwesomeIcon icon={faSpinner} spin />
                                                ) : (
                                                    <FontAwesomeIcon icon={faTimes} />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Cart Footer */}
                            <div className="mt-auto pt-5 border-t border-gray-200">
                                <div className="flex justify-between text-lg font-bold mb-5 text-gray-800">
                                    <span>Total:</span>
                                    <span style={{ color: 'var(--price-color)' }}>${calculateTotal().toFixed(2)}</span>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="inline-block px-6 py-3 bg-gray-100 text-gray-800 rounded-lg font-semibold transition-all hover:bg-gray-200 hover:shadow-md border-none cursor-pointer"
                                        onClick={onClose}
                                    >
                                        Continue Shopping
                                    </button>
                                    <button
                                        className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 text-white rounded-lg font-semibold transition-all hover:-translate-y-1 hover:shadow-lg border-none cursor-pointer"
                                        onClick={handleCheckout}
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}