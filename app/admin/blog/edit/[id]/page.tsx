// app/admin/blog/edit/[id]/route.ts
'use client';
import { Suspense, useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { blogService } from '@/services/blogService';
import { releaseBlog } from '@/app/actions/blog';
import BlogForm from '../../components/admin-blog-form';
import { ChevronLeft } from 'lucide-react'; // 图标优化

function EditBlogContent() {
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
                slug: blogData.slug || '', // 获取 slug
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
            alert('获取博客数据失败，请检查网络');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (formData: any) => {
        setSaving(true);
        try {
            // 使用 Server Action releaseBlog 更新博客
            await releaseBlog({
                id: blogId,
                ...formData
            });
            // 不立即跳转，而是提示成功，可以给用户继续编辑的机会，或者跳转
            // 这里选择跳转回列表
            router.push('/admin/blog');
        } catch (error) {
            console.error('更新博客失败:', error);
            alert('更新失败，请重试');
            throw error;
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
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 头部优化 */}
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <Link href="/admin/blog" className="text-sm text-gray-500 hover:text-gray-900 flex items-center mb-2 transition-colors">
                            <ChevronLeft size={16} className="mr-1"/> 返回博客列表
                        </Link>
                        <h1 className="text-2xl font-bold text-gray-900">编辑博客</h1>
                    </div>
                </div>

                {/* 表单容器 */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <BlogForm
                        initialData={initialData}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                        loading={saving}
                        submitText="保存更改"
                        submitLoadingText="正在保存..."
                    />
                </div>
            </div>
        </div>
    );
}

export default function EditBlogPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        }>
            <EditBlogContent />
        </Suspense>
    );
}