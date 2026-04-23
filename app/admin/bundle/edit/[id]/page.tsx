// app/admin/bundle/edit/[id]/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { bundleService } from '@/services/bundleService'
import AdminBundleForm from '../../components/admin-bundle-form'
import { ProductBundle } from '@/types/bundle'
import { Loader2 } from 'lucide-react'

export default function EditBundlePage() {
    const params = useParams()
    const router = useRouter()
    const [bundle, setBundle] = useState<ProductBundle | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchBundle = async () => {
            try {
                const data = await bundleService.adminGetById(Number(params.id))
                setBundle(data)
            } catch (error) {
                console.error('Failed to fetch bundle:', error)
                alert('加载套装信息失败')
                router.push('/admin/bundle')
            } finally {
                setLoading(false)
            }
        }

        if (params.id) {
            fetchBundle()
        }
    }, [params.id, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">编辑商品套装</h1>
                <p className="text-sm text-gray-500 mt-1">修改套装信息、价格及包含的商品</p>
            </div>
            {bundle && <AdminBundleForm initialData={bundle} />}
        </div>
    )
}
