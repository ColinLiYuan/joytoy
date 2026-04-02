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
        country: '',
        zipCode: ''
    });

    const [orderNotes, setOrderNotes] = useState('');
    const [selectedTestAddress, setSelectedTestAddress] = useState(0);

    // 更新配送地址字段
    const updateShippingAddress = (field: keyof ShippingAddress, value: string) => {
        setShippingAddress(prev => ({
            ...prev,
            [field]: value
        }));
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
        setSelectedTestAddress(0);
    };

    return {
        // 状态
        shippingAddress,
        orderNotes,
        selectedTestAddress,
        DEFAULT_TEST_ADDRESSES,

        // 操作方法
        updateShippingAddress,
        setOrderNotes,
        getShippingFormData,
        getOrderAddress,
        resetForm
    };
};