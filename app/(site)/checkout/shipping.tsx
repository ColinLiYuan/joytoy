'use client';

import { useState } from 'react';
import { AddressRequest } from '@/types/order';
import { COUNTRY_DATA, PROVINCE_DATA, POSTAL_CODE_REGEX } from '@/lib/constants/country-data';
import { Loader2, ArrowRight, Check } from 'lucide-react';

interface ShippingFormProps {
    shippingAddress: AddressRequest;
    updateShippingAddress: (field: keyof AddressRequest, value: string) => void;
    billingAddress: Partial<AddressRequest>;
    setBillingAddress: (addr: any) => void;
    isBillingSameAsShipping: boolean;
    setIsBillingSameAsShipping: (val: boolean) => void;
    onProceedToPayment: () => void;
    isCreatingOrder: boolean;
}

export default function ShippingForm({
                                         shippingAddress,
                                         updateShippingAddress,
                                         billingAddress,
                                         setBillingAddress,
                                         isBillingSameAsShipping,
                                         setIsBillingSameAsShipping,
                                         onProceedToPayment,
                                         isCreatingOrder
                                     }: ShippingFormProps) {

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateBillingField = (field: string, value: string) => {
        setBillingAddress((prev: any) => ({ ...prev, [field]: value }));
        if (errors[`billing_${field}`]) setErrors(prev => ({ ...prev, [`billing_${field}`]: '' }));
    };

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

        if (!isBillingSameAsShipping) {
            if (!billingAddress.firstName?.trim()) newErrors.billing_firstName = 'First Name is required';
            if (!billingAddress.addressLine1?.trim()) newErrors.billing_addressLine1 = 'Address is required';
            if (!billingAddress.city?.trim()) newErrors.billing_city = 'City is required';
            if (!billingAddress.country?.trim()) newErrors.billing_country = 'Country is required';
            if (!billingAddress.province?.trim()) newErrors.billing_province = 'State is required';
            if (!billingAddress.zipCode?.trim()) newErrors.billing_zipCode = 'Zip Code is required';
        }

        // --- 邮编格式校验逻辑 ---
        const validateZip = (zip: string, country: string, errorKey: string) => {
            if (!zip?.trim()) {
                newErrors[errorKey] = 'Zip Code is required';
                return;
            }

            const regex = POSTAL_CODE_REGEX[country];
            if (regex && !regex.test(zip.trim())) {
                // 根据国家给出具体的格式提示
                if (country === 'US') newErrors[errorKey] = 'Invalid US ZIP (12345)';
                else if (country === 'CA') newErrors[errorKey] = 'Invalid Postal Code (A1B 2C3)';
                else newErrors[errorKey] = 'Invalid format for this country';
            }
        };

        // 执行收货地址邮编校验
        validateZip(shippingAddress.zipCode, shippingAddress.country, 'zipCode');

        // 如果账单地址不同，执行账单邮编校验
        if (!isBillingSameAsShipping) {
            validateZip(billingAddress.zipCode || '', billingAddress.country || 'US', 'billing_zipCode');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) onProceedToPayment();
    };

    const inputClass = (error?: string) => `
        w-full p-4 rounded-xl border transition-all outline-none text-base md:text-sm 
        ${error ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 focus:bg-white focus:border-black'}
    `;

    // 动态渲染省份/州（支持所有在 PROVINCE_DATA 中的国家）
    const renderProvinceInput = (isBilling: boolean = false) => {
        const currentAddr = isBilling ? billingAddress : shippingAddress;
        const country = currentAddr.country || 'US';
        const provinces = PROVINCE_DATA[country];
        const updateFn = isBilling ? updateBillingField : updateShippingAddress;
        const errorKey = isBilling ? `billing_province` : `province`;

        if (provinces) {
            return (
                <select
                    value={currentAddr.province || ''}
                    onChange={(e) => updateFn('province', e.target.value)}
                    className={inputClass(errors[errorKey])}
                >
                    <option value="">State/Province</option>
                    {Object.entries(provinces).map(([code, name]) => (
                        <option key={code} value={code}>{name} ({code})</option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type="text"
                placeholder="State / Province"
                value={currentAddr.province || ''}
                onChange={(e) => updateFn('province', e.target.value)}
                className={inputClass(errors[errorKey])}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            {/* Contact Info */}
            <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Contact Info</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                        <input type="email" placeholder="Email Address" value={shippingAddress.email || ''} onChange={(e) => updateShippingAddress('email', e.target.value)} className={inputClass(errors.email)} />
                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <input type="tel" placeholder="Phone Number" value={shippingAddress.phone || ''} onChange={(e) => updateShippingAddress('phone', e.target.value)} className={inputClass(errors.phone)} />
                    </div>
                </div>
            </div>

            {/* Shipping Address */}
            <div className="space-y-5">
                <h3 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Shipping Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={shippingAddress.firstName || ''} onChange={(e) => updateShippingAddress('firstName', e.target.value)} className={inputClass(errors.firstName)} />
                    <input type="text" placeholder="Last Name" value={shippingAddress.lastName || ''} onChange={(e) => updateShippingAddress('lastName', e.target.value)} className={inputClass(errors.lastName)} />

                    <div className="md:col-span-2">
                        <select value={shippingAddress.country || ''} onChange={(e) => {
                            updateShippingAddress('country', e.target.value);
                            updateShippingAddress('province', '');
                        }} className={`${inputClass(errors.country)} appearance-none`}>
                            <option value="">Select Country</option>
                            {Object.entries(COUNTRY_DATA).map(([name, code]) => (
                                <option key={code} value={code}>{name} ({code})</option>
                            ))}
                        </select>
                    </div>

                    <div className="md:col-span-2">
                        <input type="text" placeholder="Address Line 1" value={shippingAddress.addressLine1 || ''} onChange={(e) => updateShippingAddress('addressLine1', e.target.value)} className={inputClass(errors.addressLine1)} />
                    </div>

                    <div className="md:col-span-2">
                        <input type="text" placeholder="Apartment, suite, etc. (optional)" value={shippingAddress.addressLine2 || ''} onChange={(e) => updateShippingAddress('addressLine2', e.target.value)} className={inputClass()} />
                    </div>

                    <input type="text" placeholder="City" value={shippingAddress.city || ''} onChange={(e) => updateShippingAddress('city', e.target.value)} className={inputClass(errors.city)} />

                    {renderProvinceInput(false)}

                    <input type="text" placeholder="ZIP Code" value={shippingAddress.zipCode || ''} onChange={(e) => updateShippingAddress('zipCode', e.target.value)} className={inputClass(errors.zipCode)} />
                </div>
            </div>

            {/* Billing Address Section */}
            <div className="pt-8 border-t border-gray-100 space-y-6">
                <h3 className="text-lg font-bold text-gray-900 font-['Playfair_Display']">Billing Address</h3>
                <div
                    onClick={() => setIsBillingSameAsShipping(!isBillingSameAsShipping)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:border-black transition-all group"
                >
                    <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${isBillingSameAsShipping ? 'bg-black border-black' : 'bg-white border-gray-300 group-hover:border-black'}`}>
                        {isBillingSameAsShipping && <Check size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-bold text-gray-700">Same as shipping address</span>
                </div>

                {!isBillingSameAsShipping && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="First Name" value={billingAddress.firstName || ''} onChange={(e) => updateBillingField('firstName', e.target.value)} className={inputClass(errors.billing_firstName)} />
                            <input type="text" placeholder="Last Name" value={billingAddress.lastName || ''} onChange={(e) => updateBillingField('lastName', e.target.value)} className={inputClass()} />
                        </div>

                        {/* 修正：账单地址国家下拉框加上 (code) 显示 */}
                        <select value={billingAddress.country || ''} onChange={(e) => {
                            updateBillingField('country', e.target.value);
                            updateBillingField('province', '');
                        }} className={inputClass(errors.billing_country)}>
                            <option value="">Select Country</option>
                            {Object.entries(COUNTRY_DATA).map(([name, code]) => (
                                <option key={code} value={code}>{name} ({code})</option>
                            ))}
                        </select>

                        <input type="text" placeholder="Address Line 1" value={billingAddress.addressLine1 || ''} onChange={(e) => updateBillingField('addressLine1', e.target.value)} className={inputClass(errors.billing_addressLine1)} />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="City" value={billingAddress.city || ''} onChange={(e) => updateBillingField('city', e.target.value)} className={inputClass(errors.billing_city)} />

                            {/* 修正：账单地址省份也支持动态渲染逻辑 */}
                            {renderProvinceInput(true)}

                            <input type="text" placeholder="ZIP Code" value={billingAddress.zipCode || ''} onChange={(e) => updateBillingField('zipCode', e.target.value)} className={inputClass(errors.billing_zipCode)} />
                        </div>
                    </div>
                )}
            </div>

            <button type="submit" disabled={isCreatingOrder} className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 mt-8 disabled:opacity-50">
                {isCreatingOrder ? <Loader2 className="animate-spin" /> : <>Continue to Payment <ArrowRight size={20} /></>}
            </button>
        </form>
    );
}