// app/admin/blog/page.tsx
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogService } from '@/services/blogService';
import { AdminBlogResponse, AdminBlogListResponse } from '@/types/blog'
import { Eye, Edit, Plus, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

// 获取图片前缀环境变量
const CDN_URL = process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH || '';

/**
 * 图片路径处理辅助函数
 */
const getImageUrl = (path: string | undefined | null) => {
    if (!path) return '';
    if (path.startsWith('http') || path.startsWith('https')) {
        return path;
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    const cleanCdn = CDN_URL.endsWith('/') ? CDN_URL.slice(0, -1) : CDN_URL;
    return `${cleanCdn}/${cleanPath}`;
};

export default function BlogManagementPage() {
    const [blogs, setBlogs] = useState<AdminBlogResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | AdminBlogResponse['status']>('ALL');
    const [pagination, setPagination] = useState({
        currentPage: 0,
        pageSize: 12,
        totalElements: 0,
        totalPages: 0,
        hasNext: false,
        hasPrevious: false
    });

    useEffect(() => {
        fetchBlogs();
    }, [statusFilter, pagination.currentPage]);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response: AdminBlogListResponse = await blogService.adminList(
                pagination.currentPage,
                pagination.pageSize,
                statusFilter !== 'ALL' ? statusFilter : undefined
            );

            setBlogs(response.content);
            setPagination({
                currentPage: response.currentPage,
                pageSize: response.pageSize,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                hasNext: response.hasNext,
                hasPrevious: response.hasPrevious
            });
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const filteredBlogs = blogs.filter(blog => {
        const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
            blog.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesSearch;
    });

    const getStatusColor = (status: AdminBlogResponse['status']) => {
        switch (status) {
            case 'PUBLISHED': return 'bg-green-100 text-green-800 border-green-200';
            case 'DRAFT': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'ARCHIVED': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: AdminBlogResponse['status']) => {
        switch (status) {
            case 'PUBLISHED': return '已发布';
            case 'DRAFT': return '草稿';
            case 'ARCHIVED': return '已归档';
            default: return status;
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-500">加载数据中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 头部 */}
                <div className="mb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">博客管理</h1>
                        <p className="text-gray-600 mt-2">创建、编辑和管理您的博客文章内容</p>
                    </div>
                    <div className="hidden sm:block">
                    <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                        共 {pagination.totalElements} 篇文章
                    </span>
                    </div>
                </div>

                {/* 操作栏 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto flex-1">
                            <div className="relative flex-1 max-w-md">
                                <input
                                    type="text"
                                    placeholder="搜索标题、作者或标签..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
                                />
                                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as any);
                                    setPagination(prev => ({ ...prev, currentPage: 0 }));
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-32 bg-white"
                            >
                                <option value="ALL">全部状态</option>
                                <option value="DRAFT">草稿</option>
                                <option value="PUBLISHED">已发布</option>
                                <option value="ARCHIVED">已归档</option>
                            </select>
                        </div>
                        <Link
                            href="/admin/blog/add"
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium flex items-center justify-center w-full sm:w-auto shadow-sm"
                        >
                            <Plus size={18} className="mr-2" />
                            新建博客
                        </Link>
                    </div>
                </div>

                {/* 博客列表 */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">文章信息</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">作者</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start">
                                            <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden">
                                                {/* 列表页图片路径处理 */}
                                                {blog.coverImage ? (
                                                    <img
                                                        className="h-full w-full object-cover"
                                                        src={getImageUrl(blog.coverImage)}
                                                        alt=""
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                        <span className="text-xs">无图</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4 flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-xs" title={blog.title}>
                                                    {blog.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                                    {blog.summary}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                        {blog.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full border ${getStatusColor(blog.status)}`}>
                                        {getStatusText(blog.status)}
                                    </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                                        {blog.slug || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="text-xs" title="创建时间">📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                                            <span className="text-xs mt-1" title="浏览量">👁️ {blog.viewCount || 0}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-3">
                                            {blog.status === 'PUBLISHED' && blog.slug && (
                                                <a
                                                    href={`/blog/${blog.slug}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="前台预览"
                                                >
                                                    <ExternalLink size={18} />
                                                </a>
                                            )}
                                            <Link
                                                href={`/admin/blog/edit/${blog.id}`}
                                                className="text-blue-600 hover:text-blue-900 flex items-center transition-colors"
                                            >
                                                <Edit size={18} className="mr-1"/> 编辑
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 分页 */}
                    {pagination.totalPages > 1 && (
                        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                            <div className="flex-1 flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-gray-700">
                                        显示第 <span className="font-medium">{(pagination.currentPage * pagination.pageSize) + 1}</span> 到{' '}
                                        <span className="font-medium">
                  {Math.min((pagination.currentPage + 1) * pagination.pageSize, pagination.totalElements)}
                </span> 条，共{' '}
                                        <span className="font-medium">{pagination.totalElements}</span> 条结果
                                    </p>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPrevious}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            pagination.hasPrevious
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        上一页
                                    </button>
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNext}
                                        className={`px-3 py-2 rounded-md text-sm font-medium ${
                                            pagination.hasNext
                                                ? 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        下一页
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {filteredBlogs.length === 0 && (
                        <div className="text-center py-16">
                            <div className="bg-gray-50 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
                                <Plus className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">暂无博客文章</h3>
                            <p className="mt-1 text-sm text-gray-500">开始撰写您的第一篇精彩内容吧。</p>
                            <Link
                                href="/admin/blog/add"
                                className="inline-flex items-center px-4 py-2 mt-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus size={16} className="mr-2" />
                                创建第一篇博客
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}