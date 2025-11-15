// hooks/useShipping.ts
import { useState } from 'react';
import { ShippingAddress, ShippingFormData, DEFAULT_TEST_ADDRESSES } from '../types/shipping';
import { AddressRequest } from '../types/order';

interface UseShippingProps {
    userEmail?: string;
    userName?: string;
}

export const useShipping = ({ userEmail = '', userName = '' }: UseShippingProps) => {
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        firstName: '',
        lastName: '',
        email: userEmail,
        phone: '',
        addressLine1: '',
        city: '',
        province: '',
        country: 'United States',
        zipCode: ''
    });

    const [orderNotes, setOrderNotes] = useState('');
    const [useTestAddress, setUseTestAddress] = useState(false);
    const [selectedTestAddress, setSelectedTestAddress] = useState(0);

    // 更新配送地址字段
    const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
        setShippingAddress(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // 应用测试地址
    const applyTestAddress = (index: number) => {
        setShippingAddress(DEFAULT_TEST_ADDRESSES[index]);
        setSelectedTestAddress(index);
    };

    // 切换测试地址模式
    const toggleTestAddressMode = () => {
        if (!useTestAddress) {
            // 开启测试模式，应用第一个测试地址
            applyTestAddress(0);
        } else {
            // 关闭测试模式，清空表单
            setShippingAddress({
                firstName: '',
                lastName: '',
                email: userEmail,
                phone: '',
                addressLine1: '',
                addressLine2: '',
                city: '',
                province: '',
                country: 'United States',
                zipCode: ''
            });
        }
        setUseTestAddress(!useTestAddress);
    };

    // 验证配送信息表单
    const validateShippingForm = (): boolean => {
        // 如果使用测试地址，跳过验证
        if (useTestAddress) {
            return true;
        }

        const requiredFields: (keyof ShippingAddress)[] = [
            'firstName', 'lastName', 'email', 'phone', 'addressLine1', 'city', 'province', 'zipCode'
        ];

        // for (const field of requiredFields) {
        //     if (!shippingAddress[field].trim()) {
        //         const fieldName = field === 'addressLine1' ? 'address' :
        //             field === 'province' ? 'state' : field;
        //         alert(`Please fill in ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}`);
        //         return false;
        //     }
        // }

        if (!/\S+@\S+\.\S+/.test(shippingAddress.email)) {
            alert('Please enter a valid email address');
            return false;
        }

        return true;
    };

    // 获取完整的配送表单数据
    const getShippingFormData = (): ShippingFormData => ({
        shippingAddress,
        orderNotes
    });

    // 获取订单接口需要的地址格式
    const getOrderAddress = (): AddressRequest => ({
        firstName: shippingAddress.firstName,
        lastName: shippingAddress.lastName,
        phone: shippingAddress.phone,
        email: shippingAddress.email,
        country: shippingAddress.country,
        province: shippingAddress.province,
        city: shippingAddress.city,
        addressLine1: shippingAddress.addressLine1,
        addressLine2: shippingAddress.addressLine2,
        zipCode: shippingAddress.zipCode
    });

    // 重置表单
    const resetForm = () => {
        setShippingAddress({
            firstName: '',
            lastName: '',
            email: userEmail,
            phone: '',
            addressLine1: '',
            addressLine2: '',
            city: '',
            province: '',
            country: 'United States',
            zipCode: ''
        });
        setOrderNotes('');
        setUseTestAddress(false);
        setSelectedTestAddress(0);
    };

    return {
        // 状态
        shippingAddress,
        orderNotes,
        useTestAddress,
        selectedTestAddress,
        DEFAULT_TEST_ADDRESSES,

        // 操作方法
        updateShippingAddress,
        setOrderNotes,
        applyTestAddress,
        toggleTestAddressMode,
        validateShippingForm,
        getShippingFormData,
        getOrderAddress,
        resetForm
    };
};