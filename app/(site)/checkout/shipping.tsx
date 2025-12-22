// app/checkout/shipping.tsx
'use client'; // 确保是客户端组件

import { useState } from 'react';
import { AddressRequest } from '@/types/order';
import { COUNTRIES_FOR_SELECT, COUNTRY_DATA } from '@/lib/constants/country-data';
import { Loader2, ArrowRight } from 'lucide-react';

interface ShippingFormProps {
    shippingAddress: AddressRequest;
    updateShippingAddress: (field: keyof AddressRequest, value: string) => void;
    onProceedToPayment: () => void;
    isCreatingOrder: boolean;
}

export default function ShippingForm({
                                         shippingAddress,
                                         updateShippingAddress,
                                         onProceedToPayment,
                                         isCreatingOrder
                                     }: ShippingFormProps) {

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        if (!shippingAddress.email?.trim()) newErrors.email = 'Email is required';
        if (!shippingAddress.firstName?.trim()) newErrors.firstName = 'First Name is required';
        if (!shippingAddress.lastName?.trim()) newErrors.lastName = 'Last Name is required';
        if (!shippingAddress.addressLine1?.trim()) newErrors.addressLine1 = 'Address is required';
        if (!shippingAddress.city?.trim()) newErrors.city = 'City is required';
        if (!shippingAddress.province?.trim()) newErrors.province = 'State/Province is required';
        if (!shippingAddress.zipCode?.trim()) newErrors.zipCode = 'Zip Code is required';
        if (!shippingAddress.country?.trim()) newErrors.country = 'Country is required';
        if (!shippingAddress.phone?.trim()) newErrors.phone = 'Phone is required';

        if (shippingAddress.country && !COUNTRY_DATA[shippingAddress.country]) {
            newErrors.country = 'Please select a valid country from the list';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onProceedToPayment();
        } else {
            const firstError = document.querySelector('.border-red-500');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleChange = (field: keyof AddressRequest, value: string) => {
        updateShippingAddress(field, value);
        if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
    };

    // ✅ 关键：text-base (16px) 防止 iOS 自动放大
    const inputClass = (error?: string) => `
        w-full p-4 rounded-xl border transition-all outline-none
        text-base md:text-sm 
        ${error
        ? 'border-red-500 bg-red-50 focus:border-red-500 placeholder:text-red-400'
        : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-black focus:ring-1 focus:ring-black'
    }
    `;

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-5 font-['Playfair_Display']">Contact Info</h3>
                <div className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email Address"
                            value={shippingAddress.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className={inputClass(errors.email)}
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1 ml-1">{errors.email}</p>}
                    </div>
                    <div>
                        <input
                            type="tel"
                            placeholder="Phone Number"
                            value={shippingAddress.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className={inputClass(errors.phone)}
                        />
                        {errors.phone && <p className="text-red-500 text-xs mt-1 ml-1">{errors.phone}</p>}
                    </div>
                </div>
            </div>

            {/* Address */}
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-5 font-['Playfair_Display']">Shipping Address</h3>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="First Name"
                                value={shippingAddress.firstName || ''}
                                onChange={(e) => handleChange('firstName', e.target.value)}
                                className={inputClass(errors.firstName)}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.firstName}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={shippingAddress.lastName || ''}
                                onChange={(e) => handleChange('lastName', e.target.value)}
                                className={inputClass(errors.lastName)}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1 ml-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    <div>
                        <select
                            value={shippingAddress.country || ''}
                            onChange={(e) => handleChange('country', e.target.value)}
                            className={`${inputClass(errors.country)} appearance-none cursor-pointer`}
                        >
                            <option value="">Select Country</option>
                            {COUNTRIES_FOR_SELECT.map(country => (
                                <option key={country} value={country}>
                                    {country}
                                </option>
                            ))}
                        </select>
                        {errors.country && <p className="text-red-500 text-xs mt-1 ml-1">{errors.country}</p>}
                    </div>

                    <div>
                        <input
                            type="text"
                            placeholder="Address Line 1"
                            value={shippingAddress.addressLine1 || ''}
                            onChange={(e) => handleChange('addressLine1', e.target.value)}
                            className={inputClass(errors.addressLine1)}
                        />
                        {errors.addressLine1 && <p className="text-red-500 text-xs mt-1 ml-1">{errors.addressLine1}</p>}
                    </div>

                    <input
                        type="text"
                        placeholder="Apartment, suite, etc. (optional)"
                        value={shippingAddress.addressLine2 || ''}
                        onChange={(e) => handleChange('addressLine2', e.target.value)}
                        className={inputClass()}
                    />

                    {/* ✅ 修复布局：手机端单列 (grid-cols-1)，防止挤压溢出 */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="City"
                                value={shippingAddress.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
                                className={inputClass(errors.city)}
                            />
                            {errors.city && <p className="text-red-500 text-xs mt-1 ml-1">{errors.city}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="State / Province"
                                value={shippingAddress.province || ''}
                                onChange={(e) => handleChange('province', e.target.value)}
                                className={inputClass(errors.province)}
                            />
                            {errors.province && <p className="text-red-500 text-xs mt-1 ml-1">{errors.province}</p>}
                        </div>
                        <div>
                            <input
                                type="text"
                                placeholder="ZIP / Postal Code"
                                value={shippingAddress.zipCode || ''}
                                onChange={(e) => handleChange('zipCode', e.target.value)}
                                className={inputClass(errors.zipCode)}
                            />
                            {errors.zipCode && <p className="text-red-500 text-xs mt-1 ml-1">{errors.zipCode}</p>}
                        </div>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isCreatingOrder}
                className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
            >
                {isCreatingOrder ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Processing...
                    </>
                ) : (
                    <>
                        Continue to Payment
                        <ArrowRight size={20} />
                    </>
                )}
            </button>
        </form>
    );
}