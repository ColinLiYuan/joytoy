// app/admin/blog/components/BlogForm.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { blogService } from '@/services/blogService';
import { RefreshCw } from 'lucide-react'; // 引入图标
// 动态导入 MD 编辑器，避免 SSR 问题
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);
interface BlogFormProps {
    initialData?: {
        title: string;
        slug?: string; // 新增 slug
        subTitle: string;
        content: string;
        author: string;
        tags: string[];
        coverImage: string;
        status: 'DRAFT' | 'PUBLISHED';
    };
    onSubmit: (data: any) => Promise<void>;
    onCancel: () => void;
    loading: boolean;
    submitText: string;
    submitLoadingText: string;
}
export default function BlogForm({
                                     initialData,
                                     onSubmit,
                                     onCancel,
                                     loading,
                                     submitText,
                                     submitLoadingText
                                 }: BlogFormProps) {
    const [formData, setFormData] = useState({
        title: '',
        slug: '', // 新增 slug 状态
        subTitle: '',
        content: '',
        author: '',
        tags: [] as string[],
        coverImage: '',
        status: 'DRAFT' as 'DRAFT' | 'PUBLISHED'
    });
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [uploadingImage, setUploadingImage] = useState(false);
// 用于判断是否需要自动生成 Slug (只有当用户未手动修改过 slug 时才自动同步)
    const [isSlugTouched, setIsSlugTouched] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                slug: initialData.slug || '',
                subTitle: initialData.subTitle || '',
                content: initialData.content || '',
                author: initialData.author || '',
                tags: initialData.tags || [],
                coverImage: initialData.coverImage || '',
                status: initialData.status || 'DRAFT'
            });
            // 如果是编辑模式且已有 slug，标记为已修改，防止自动覆盖
            if (initialData.slug) setIsSlugTouched(true);
        }
    }, [initialData]);

// 自动生成 Slug 的简单的工具函数
    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .trim()
            .replace(/[\s\W-]+/g, '-') // 将空格和非单词字符替换为 -
            .replace(/^-+|-+$/g, ''); // 去除首尾的 -
    };

    const handleChange = (field: string, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // 如果修改的是标题，且 Slug 未被用户手动锁定，则自动生成 Slug
            if (field === 'title' && !isSlugTouched && !initialData) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });

        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

// 手动修改 Slug
    const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsSlugTouched(true);
        setFormData(prev => ({ ...prev, slug: e.target.value }));
        if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
    };

// 强制重新生成 Slug
    const handleRegenerateSlug = () => {
        const newSlug = generateSlug(formData.title);
        setFormData(prev => ({ ...prev, slug: newSlug }));
        setIsSlugTouched(false); // 重置触摸状态
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleTagKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
        }
    };

// 处理图片上传
    const handleImageUpload = async (file: File) => {
        try {
            setUploadingImage(true);
            const result = await blogService.uploadImage(file);

            // 插入图片 Markdown 语法到当前位置
            const imageMarkdown = `![${file.name}](${result.url})`;
            const newContent = formData.content + `\n${imageMarkdown}\n`;
            handleChange('content', newContent);

            return result.url;
        } catch (error) {
            console.error('图片上传失败:', error);
            alert('图片上传失败，请重试');
            throw error;
        } finally {
            setUploadingImage(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageUpload(file);
            e.target.value = '';
        }
    };

// 插入视频/链接的辅助函数保持不变...
    const insertVideo = () => {
        const videoUrl = prompt('请输入视频 URL:');
        if (videoUrl) {
            const videoMarkdown = `[视频链接](${videoUrl})`;
            const newContent = formData.content + `\n${videoMarkdown}\n`;
            handleChange('content', newContent);
        }
    };

    const insertLink = () => {
        const linkText = prompt('请输入链接文本:') || '链接';
        const linkUrl = prompt('请输入链接 URL:');
        if (linkUrl) {
            const linkMarkdown = `[${linkText}](${linkUrl})`;
            const newContent = formData.content + `\n${linkMarkdown}\n`;
            handleChange('content', newContent);
        }
    };

    const EditorToolbar = () => (
        <div className="flex flex-wrap gap-2 p-3 bg-gray-50 border-b border-gray-200">
            <button
                type="button"
                onClick={triggerFileInput}
                disabled={uploadingImage}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50 flex items-center gap-1"
            >
                {uploadingImage ? '上传中...' : '📷 插入图片'}
            </button>
            <button
                type="button"
                onClick={insertVideo}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1"
            >
                🎬 插入视频
            </button>
            <button
                type="button"
                onClick={insertLink}
                className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 flex items-center gap-1"
            >
                🔗 插入链接
            </button>
        </div>
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) newErrors.title = '标题不能为空';
        if (!formData.slug.trim()) newErrors.slug = 'Slug 不能为空';
        // Slug 格式校验：只允许字母、数字、连字符
        if (!/^[a-z0-9-]+$/i.test(formData.slug)) {
            newErrors.slug = 'Slug 只能包含字母、数字和连字符(-)';
        }
        if (!formData.subTitle.trim()) newErrors.subTitle = '副标题不能为空';
        if (!formData.content.trim()) newErrors.content = '内容不能为空';
        if (!formData.author.trim()) newErrors.author = '作者不能为空';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            await onSubmit(formData);
        } catch (error) {
            // Error handled in parent
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 第一行：标题和Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                        标题 *
                    </label>
                    <input
                        type="text"
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        placeholder="输入博客标题"
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.title ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
                </div>

                <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-2">
                        Slug (URL 别名) *
                    </label>
                    <div className="flex">
                        <input
                            type="text"
                            id="slug"
                            value={formData.slug}
                            onChange={handleSlugChange}
                            placeholder="例如: my-new-blog-post"
                            className={`flex-1 px-3 py-2 border rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.slug ? 'border-red-500' : 'border-gray-300'
                            }`}
                        />
                        <button
                            type="button"
                            onClick={handleRegenerateSlug}
                            className="px-3 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200 text-gray-600"
                            title="根据标题重新生成"
                        >
                            <RefreshCw size={18} />
                        </button>
                    </div>
                    {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
                    <p className="mt-1 text-xs text-gray-500">将显示在 URL 中，如: domain.com/blog/<strong>{formData.slug || '...'}</strong></p>
                </div>
            </div>

            {/* 副标题 */}
            <div>
                <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    副标题/摘要 *
                </label>
                <textarea
                    id="subTitle"
                    value={formData.subTitle}
                    onChange={(e) => handleChange('subTitle', e.target.value)}
                    rows={3}
                    placeholder="简短描述文章内容，用于列表展示"
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.subTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.subTitle && <p className="mt-1 text-sm text-red-600">{errors.subTitle}</p>}
            </div>

            {/* 第二行：作者、状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                        作者 *
                    </label>
                    <input
                        type="text"
                        id="author"
                        value={formData.author}
                        onChange={(e) => handleChange('author', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                            errors.author ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.author && <p className="mt-1 text-sm text-red-600">{errors.author}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        状态
                    </label>
                    <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="DRAFT"
                                checked={formData.status === 'DRAFT'}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                            />
                            <span className="ml-2">草稿</span>
                        </label>
                        <label className="inline-flex items-center cursor-pointer">
                            <input
                                type="radio"
                                value="PUBLISHED"
                                checked={formData.status === 'PUBLISHED'}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                            />
                            <span className="ml-2">发布</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* 封面图片 */}
            <div>
                <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-2">
                    封面图片 URL
                </label>
                <div className="flex space-x-2">
                    <input
                        type="url"
                        id="coverImage"
                        value={formData.coverImage}
                        onChange={(e) => handleChange('coverImage', e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 flex items-center"
                    >
                        上传图片
                    </button>
                </div>
                {formData.coverImage && (
                    <div className="mt-3 relative w-full md:w-1/2 h-48 rounded-lg overflow-hidden border bg-gray-50">
                        <img
                            src={formData.coverImage}
                            alt="封面预览"
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}
            </div>

            {/* 标签 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    标签
                </label>
                <div className="flex space-x-2 mb-2">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleTagKeyPress}
                        placeholder="输入标签后按回车"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={addTag}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        添加
                    </button>
                </div>
                <div className="flex flex-wrap gap-2 min-h-[32px]">
                    {formData.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                        {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                            >
                            ×
                        </button>
                    </span>
                    ))}
                    {formData.tags.length === 0 && <span className="text-gray-400 text-sm italic">暂无标签</span>}
                </div>
            </div>

            {/* 内容编辑器 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    文章内容 *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                    <EditorToolbar />
                    <div className="min-h-[500px]">
                        <MDEditor
                            value={formData.content}
                            onChange={(value) => handleChange('content', value || '')}
                            preview="edit"
                            height={500}
                            data-color-mode="light"
                        />
                    </div>
                </div>
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}
            </div>

            {/* 隐藏的文件输入 */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*"
                className="hidden"
            />

            {/* 操作按钮 */}
            <div className="flex justify-end space-x-4 pt-6 border-t bg-gray-50 -mx-6 -mb-6 p-6 rounded-b-lg">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white hover:shadow-sm transition duration-200"
                    disabled={loading}
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow transition duration-200 disabled:opacity-50 flex items-center"
                >
                    {loading && <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>}
                    {loading ? submitLoadingText : submitText}
                </button>
            </div>
        </form>
    );
}