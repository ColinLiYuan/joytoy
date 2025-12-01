// /app/admin/product/components/components/admin-publish-actions

import Link from 'next/link';

interface PublishActionsProps {
    productId?: string;
}

export default function AdminPublishActions({ productId }: PublishActionsProps) {
    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 space-y-3">
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    <i className="fas fa-save mr-2"></i>
                    {productId ? '更新产品' : '发布产品'}
                </button>

                <Link
                    href="/product"
                    className="w-full inline-flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                >
                    取消
                </Link>
            </div>
        </div>
    );
}