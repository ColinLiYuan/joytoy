// app/blog/[slug]/BlogContent.tsx
'use client';

import dynamic from 'next/dynamic';
import { BlogResponse } from '@/types/site/blog';

// 动态导入 MD 渲染器（在客户端渲染）
const MDViewer = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default.Markdown),
    { ssr: false }
);

interface BlogContentProps {
    blog: BlogResponse;
}

export default function BlogContent({ blog }: BlogContentProps) {
    return (
        <div className="min-h-screen bg-white">
            {/* 博客头部 */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">{blog.title}</h1>

                    {/* 副标题 */}
                    {blog.subTitle && (
                        <h2 className="text-xl text-gray-600 mb-6 font-light italic">
                            {blog.subTitle}
                        </h2>
                    )}

                    <div className="flex items-center text-gray-600 space-x-4 flex-wrap">
                        <span>By {blog.author}</span>
                        <span>•</span>
                        <span>{new Date(blog.createdAt).toLocaleDateString('en-US')}</span>
                        <span>•</span>
                        <span>Views: {blog.viewCount}</span>
                        <span>•</span>
                        <span>Likes: {blog.likeCount}</span>
                    </div>

                    {/* 标签 */}
                    {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {blog.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium"
                                >
                  {tag}
                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 博客内容 */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* 摘要 */}
                {blog.summary && (
                    <div className="bg-purple-50 border-l-4 border-purple-500 p-6 mb-8 rounded-r-lg">
                        <p className="text-gray-700 text-lg leading-relaxed">{blog.summary}</p>
                    </div>
                )}

                {/* 使用 MDViewer 渲染 Markdown 内容 */}
                <div className="prose prose-lg max-w-none">
                    <MDViewer source={blog.content} />
                </div>

                {/* 文章底部信息 */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <div className="flex justify-between items-center text-sm text-gray-500 flex-wrap gap-4">
                        <div>
                            <span>Published: {new Date(blog.createdAt).toLocaleDateString('en-US')}</span>
                            {blog.updatedAt !== blog.createdAt && (
                                <span className="ml-4">
                  Updated: {new Date(blog.updatedAt).toLocaleDateString('en-US')}
                </span>
                            )}
                        </div>
                        <div className="flex items-center space-x-4">
                            <span>👁️ {blog.viewCount} views</span>
                            <span>❤️ {blog.likeCount} likes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 自定义 CSS 确保样式正确 */}
            <style jsx global>{`
        .wmde-markdown {
          background: transparent !important;
          font-size: 16px !important;
          line-height: 1.7 !important;
        }
        .wmde-markdown img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 8px !important;
          margin: 1rem 0 !important;
        }
        .wmde-markdown pre {
          background: #f8f9fa !important;
          border-radius: 8px !important;
          padding: 1rem !important;
          overflow-x: auto !important;
        }
        .wmde-markdown code {
          background: #f8f9fa !important;
          padding: 0.2em 0.4em !important;
          border-radius: 4px !important;
          font-size: 0.9em !important;
        }
        .wmde-markdown a {
          color: #7c3aed !important;
          text-decoration: none !important;
          font-weight: 500 !important;
        }
        .wmde-markdown a:hover {
          text-decoration: underline !important;
          color: #6d28d9 !important;
        }
        .wmde-markdown blockquote {
          border-left: 4px solid #e5e7eb !important;
          padding-left: 1rem !important;
          margin-left: 0 !important;
          color: #6b7280 !important;
          background: #f9fafb !important;
          padding: 1rem !important;
          border-radius: 0 8px 8px 0 !important;
        }
        .wmde-markdown table {
          width: 100% !important;
          border-collapse: collapse !important;
          margin: 1rem 0 !important;
        }
        .wmde-markdown th,
        .wmde-markdown td {
          border: 1px solid #e5e7eb !important;
          padding: 0.75rem !important;
          text-align: left !important;
        }
        .wmde-markdown th {
          background: #f9fafb !important;
          font-weight: 600 !important;
        }
        .wmde-markdown h1, .wmde-markdown h2, .wmde-markdown h3 {
          color: #1f2937 !important;
          margin-top: 2rem !important;
          margin-bottom: 1rem !important;
        }
        .wmde-markdown ul, .wmde-markdown ol {
          padding-left: 1.5rem !important;
        }
      `}</style>
        </div>
    );
}