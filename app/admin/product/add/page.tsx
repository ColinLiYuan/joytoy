// admin/product/add
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

import AdminProductForm from '../components/admin-product-form';

export default function ProductAddPage() {
    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
                    <span className="text-gray-600">正在加载...</span>
                </div>
            </div>
        }>
            <AdminProductForm />
        </Suspense>
    );
}