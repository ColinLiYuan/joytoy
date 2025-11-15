// app/admin/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogService } from '@/services/blogService';
import { AdminBlogResponse, AdminBlogListResponse } from '@/types/admin/adminBlog'

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
            // 可以添加 toast 通知
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
            case 'PUBLISHED':
                return 'bg-green-100 text-green-800';
            case 'DRAFT':
                return 'bg-yellow-100 text-yellow-800';
            case 'ARCHIVED':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: AdminBlogResponse['status']) => {
        switch (status) {
            case 'PUBLISHED':
                return '已发布';
            case 'DRAFT':
                return '草稿';
            case 'ARCHIVED':
                return '已归档';
            default:
                return status;
        }
    };

    if (loading && blogs.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* 头部 */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">博客管理</h1>
                    <p className="text-gray-600 mt-2">管理您的博客文章</p>
                </div>

                {/* 操作栏 */}
                <div className="bg-white rounded-lg shadow mb-6 p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder="搜索博客标题、作者或标签..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                            />
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value as any);
                                    setPagination(prev => ({ ...prev, currentPage: 0 }));
                                }}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-32"
                            >
                                <option value="ALL">全部状态</option>
                                <option value="DRAFT">草稿</option>
                                <option value="PUBLISHED">已发布</option>
                                <option value="ARCHIVED">已归档</option>
                            </select>
                        </div>
                        <Link
                            href="/admin/blog/add"
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium w-full sm:w-auto text-center"
                        >
                            新建博客
                        </Link>
                    </div>
                </div>

                {/* 博客列表 */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    标题
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    作者
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状态
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    创建时间
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    浏览量
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    操作
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {filteredBlogs.map((blog) => (
                                <tr key={blog.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {blog.coverImage && (
                                                <img
                                                    className="h-10 w-10 rounded-lg object-cover mr-3"
                                                    src={blog.coverImage}
                                                    alt={blog.title}
                                                />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <div className="text-sm font-medium text-gray-900 truncate">
                                                    {blog.title}
                                                </div>
                                                <div className="text-sm text-gray-500 truncate">
                                                    {blog.summary}
                                                </div>
                                                {blog.tags && blog.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {blog.tags.slice(0, 3).map((tag, index) => (
                                                            <span
                                                                key={index}
                                                                className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded"
                                                            >
                                  {tag}
                                </span>
                                                        ))}
                                                        {blog.tags.length > 3 && (
                                                            <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                  +{blog.tags.length - 3}
                                </span>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {blog.author}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(blog.status)}`}>
                        {getStatusText(blog.status)}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(blog.createdAt).toLocaleDateString('zh-CN')}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {blog.viewCount}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <div className="flex space-x-2">
                                            <Link
                                                href={`/admin/blog/edit/${blog.id}`}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                编辑
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
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg">没有找到博客文章</div>
                            <Link
                                href="/admin/blog/add"
                                className="inline-block mt-4 text-blue-600 hover:text-blue-700"
                            >
                                创建第一篇博客
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}