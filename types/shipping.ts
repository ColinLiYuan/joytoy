// types/shipping.ts
import { AddressRequest } from './order';

export interface ShippingAddress extends AddressRequest {}

export interface ShippingFormData {
    shippingAddress: ShippingAddress;
    orderNotes: string;
}

// 默认测试配送地址数据
export const DEFAULT_TEST_ADDRESSES: ShippingAddress[] = [
    {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        addressLine1: '123 Main Street',
        addressLine2: 'Apt 4B',
        city: 'New York',
        province: 'NY',
        country: 'United States',
        zipCode: '10001'
    },
    {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+0987654321',
        addressLine1: '456 Oak Avenue',
        addressLine2: 'Suite 200',
        city: 'Los Angeles',
        province: 'CA',
        country: 'United States',
        zipCode: '90210'
    },
    {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '+1111111111',
        addressLine1: '789 Test Lane',
        addressLine2: '',
        city: 'Chicago',
        province: 'IL',
        country: 'United States',
        zipCode: '60601'
    }
];