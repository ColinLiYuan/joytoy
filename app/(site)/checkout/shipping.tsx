// shipping.tsx - 已更新为使用 Tailwind CSS 类名
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { useShipping } from '@/hooks/useShipping';
import { useState } from 'react';

interface ShippingFormProps {
    userEmail: string;
    userName?: string;
    onProceedToPayment: () => void;
    isCreatingOrder: boolean;
}

export default function ShippingForm({
                                         userEmail,
                                         userName,
                                         onProceedToPayment,
                                         isCreatingOrder
                                     }: ShippingFormProps) {
    const {
        shippingAddress,
        updateShippingAddress,
        validateShippingForm
    } = useShipping({
        userEmail,
        userName
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    type ShippingAddressField = keyof typeof shippingAddress;

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!shippingAddress.country.trim()) {
            newErrors.country = 'Country is required';
        }
        if (!shippingAddress.phone.trim()) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Please enter a valid phone number';
        }
        if (!shippingAddress.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
            newErrors.email = 'Please enter a valid email address';
        }
        if (!shippingAddress.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        if (!shippingAddress.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        if (!shippingAddress.addressLine1.trim()) {
            newErrors.addressLine1 = 'Address is required';
        }
        if (!shippingAddress.city.trim()) {
            newErrors.city = 'City is required';
        }
        if (!shippingAddress.province.trim()) {
            newErrors.province = 'State is required';
        }
        if (!shippingAddress.zipCode.trim()) {
            newErrors.zipCode = 'Zip Code is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const scrollToFirstError = () => {
        setTimeout(() => {
            const firstErrorField = document.querySelector('.border-red-500');
            if (firstErrorField) {
                firstErrorField.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const isFormValid = validateForm();
        const isShippingValid = validateShippingForm();

        if (isFormValid && isShippingValid) {
            onProceedToPayment();
        } else {
            console.log('Form validation failed');
            scrollToFirstError();
        }
    };

    const handleInputChange = (field: ShippingAddressField, value: string) => {
        updateShippingAddress(field, value);
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const countries = [
        // 北美市场
        "United States",     // 美国
        "Canada",            // 加拿大
        "Mexico",            // 墨西哥

        // 西欧核心市场
        "United Kingdom",    // 英国
        "Germany",           // 德国
        "France",            // 法国

        // 其他西欧/欧元区重要国家
        "Italy",             // 意大利
        "Spain",             // 西班牙
        "Netherlands",       // 荷兰
        "Belgium",           // 比利时
        "Sweden",            // 瑞典
        "Ireland",           // 爱尔兰

        // 北欧国家
        "Denmark",           // 丹麦
        "Norway",            // 挪威
        "Finland",           // 芬兰

        // 大洋洲（通常被归入欧美市场体系）
        "Australia"          // 澳大利亚
    ].sort();

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col">
                    <select
                        id="country"
                        value={shippingAddress.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.country ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                            <option key={country} value={country}>{country}</option>
                        ))}
                    </select>
                    {errors.country && <span className="text-red-500 text-sm mt-1">{errors.country}</span>}
                </div>

                <div className="flex flex-col col-span-2">
                    <input
                        type="tel"
                        id="phone"
                        value={shippingAddress.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Phone *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.phone ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.phone && <span className="text-red-500 text-sm mt-1">{errors.phone}</span>}
                </div>

                <div className="flex flex-col col-span-2">
                    <input
                        type="email"
                        id="email"
                        value={shippingAddress.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Email *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.email ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        id="firstName"
                        value={shippingAddress.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="First Name *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.firstName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.firstName && <span className="text-red-500 text-sm mt-1">{errors.firstName}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        id="lastName"
                        value={shippingAddress.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Last Name *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.lastName ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.lastName && <span className="text-red-500 text-sm mt-1">{errors.lastName}</span>}
                </div>

                <div className="flex flex-col col-span-2">
                    <input
                        type="text"
                        id="address"
                        value={shippingAddress.addressLine1}
                        onChange={(e) => handleInputChange('addressLine1', e.target.value)}
                        placeholder="Address *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.addressLine1 ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.addressLine1 && <span className="text-red-500 text-sm mt-1">{errors.addressLine1}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        id="city"
                        value={shippingAddress.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.city && <span className="text-red-500 text-sm mt-1">{errors.city}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        id="state"
                        value={shippingAddress.province}
                        onChange={(e) => handleInputChange('province', e.target.value)}
                        placeholder="State *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.province ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.province && <span className="text-red-500 text-sm mt-1">{errors.province}</span>}
                </div>

                <div className="flex flex-col">
                    <input
                        type="text"
                        id="zipCode"
                        value={shippingAddress.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="Zip Code *"
                        className={`p-3 border rounded-lg text-base transition-colors ${
                            errors.zipCode ? 'border-red-500' : 'border-gray-300'
                        } focus:outline-none focus:border-purple-500 focus:ring-3 focus:ring-purple-200`}
                        required
                    />
                    {errors.zipCode && <span className="text-red-500 text-sm mt-1">{errors.zipCode}</span>}
                </div>
            </div>

            <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-200">
                <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    disabled={isCreatingOrder}
                >
                    {isCreatingOrder ? (
                        <>
                            <FontAwesomeIcon icon={faSpinner} spin />
                            Processing...
                        </>
                    ) : (
                        'Continue to Payment'
                    )}
                </button>
            </div>
        </form>
    );
}