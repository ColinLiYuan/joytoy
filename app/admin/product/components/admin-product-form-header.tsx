// /app/admin/products/components/admin-product-form-header.tsx

import Link from 'next/link';

interface ProductFormHeaderProps {
    id?: string;
}

export default function AdminProductFormHeader({ id }: ProductFormHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
                <i className={`fas ${id ? 'fa-edit' : 'fa-plus'} mr-2`}></i>
                {id ? '编辑产品' : '新增产品'}
            </h2>
            <Link
                href="/product"
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
                <i className="fas fa-arrow-left mr-2"></i>
                返回列表
            </Link>
        </div>
    );
}