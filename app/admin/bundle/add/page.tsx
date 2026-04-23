// app/admin/bundle/add/page.tsx
import AdminBundleForm from '../components/admin-bundle-form'

export default function AddBundlePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">新建商品套装</h1>
                <p className="text-sm text-gray-500 mt-1">创建一个包含多个商品的优惠礼盒或套餐</p>
            </div>
            <AdminBundleForm />
        </div>
    )
}
