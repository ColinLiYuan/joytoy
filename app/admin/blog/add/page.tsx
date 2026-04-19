// app/admin/blog/add/route.ts
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { updateBlog } from '@/app/actions/admin/blog-detail';
import BlogForm from '../components/admin-blog-form';

export default function AddBlogPage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (formData: any) => {
        setSaving(true);
        try {
            await updateBlog(0, formData); // 对于新建，id 为 0 或 undefined，后端会创建新记录
            router.push('/admin/blog');
            // 可以添加成功提示：创建博客成功！
        } catch (error) {
            console.error('创建博客失败:', error);
            // 可以添加错误提示
            throw error; // 重新抛出错误让 BlogForm 处理
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/blog');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 头部 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">新建博客</h1>
                            <p className="text-gray-600 mt-2">创建新的博客文章</p>
                        </div>
                        <Link
                            href="/admin/blog"
                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
                        >
                            返回列表
                        </Link>
                    </div>
                </div>

                {/* 表单 */}
                <div className="bg-white rounded-lg shadow">
                    <BlogForm
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={saving}
                        submitText="创建博客"
                        submitLoadingText="创建中..."
                    />
                </div>
            </div>
        </div>
    );
}