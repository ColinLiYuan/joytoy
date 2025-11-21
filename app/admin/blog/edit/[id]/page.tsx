// app/admin/blog/edit/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { blogService } from '@/services/blogService';
import BlogForm from '../../components/admin-blog-form';

export default function EditBlogPage() {
    const params = useParams();
    const router = useRouter();
    const blogId = parseInt(params.id as string);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [initialData, setInitialData] = useState<any>(null);

    useEffect(() => {
        fetchBlog();
    }, [blogId]);

    const fetchBlog = async () => {
        try {
            setLoading(true);
            const blogData = await blogService.getById(blogId);
            setInitialData({
                title: blogData.title || '',
                subTitle: blogData.subTitle || '',
                content: blogData.content || '',
                summary: blogData.summary || '',
                author: blogData.author || '',
                tags: blogData.tags || [],
                coverImage: blogData.coverImage || '',
                status: blogData.status || 'DRAFT'
            });
        } catch (error) {
            console.error('获取博客失败:', error);
            // 可以添加错误提示
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData: any) => {
        setSaving(true);
        try {
            await blogService.release({
                id: blogId,
                ...formData
            });
            router.push('/admin/blog');
            // 可以添加成功提示：更新博客成功！
        } catch (error) {
            console.error('更新博客失败:', error);
            // 可以添加错误提示
            throw error; // 重新抛出错误让 BlogForm 处理
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/blog');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 头部 */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">编辑博客</h1>
                            <p className="text-gray-600 mt-2">修改博客文章内容</p>
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
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={saving}
                        submitText="更新博客"
                        submitLoadingText="更新中..."
                    />
                </div>
            </div>
        </div>
    );
}