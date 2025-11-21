// app/admin/blog/components/BlogForm.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { blogService } from '@/services/blogService';

// 动态导入 MD 编辑器，避免 SSR 问题
const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface BlogFormProps {
    initialData?: {
        title: string;
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
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (initialData) {
            // 确保副标题数据正确设置，处理可能的 null/undefined
            setFormData({
                title: initialData.title || '',
                subTitle: initialData.subTitle || '', // 确保副标题正确设置
                content: initialData.content || '',
                author: initialData.author || '',
                tags: initialData.tags || [],
                coverImage: initialData.coverImage || '',
                status: initialData.status || 'DRAFT'
            });
        }
    }, [initialData]);

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
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

    // 触发文件选择
    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    // 处理文件选择
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            await handleImageUpload(file);
            // 清空 input，允许选择相同文件
            e.target.value = '';
        }
    };

    // 插入视频
    const insertVideo = () => {
        const videoUrl = prompt('请输入视频 URL:');
        if (videoUrl) {
            const videoMarkdown = `[视频链接](${videoUrl})`;
            const newContent = formData.content + `\n${videoMarkdown}\n`;
            handleChange('content', newContent);
        }
    };

    // 插入超链接
    const insertLink = () => {
        const linkText = prompt('请输入链接文本:') || '链接';
        const linkUrl = prompt('请输入链接 URL:');
        if (linkUrl) {
            const linkMarkdown = `[${linkText}](${linkUrl})`;
            const newContent = formData.content + `\n${linkMarkdown}\n`;
            handleChange('content', newContent);
        }
    };

    // 工具栏组件
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
            <span className="text-sm text-gray-500 ml-2 flex items-center">
                支持 Markdown 语法
            </span>
        </div>
    );

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.title.trim()) {
            newErrors.title = '标题不能为空';
        }

        if (!formData.subTitle.trim()) {
            newErrors.subTitle = '副标题不能为空';
        }

        if (!formData.content.trim()) {
            newErrors.content = '内容不能为空';
        }

        if (!formData.author.trim()) {
            newErrors.author = '作者不能为空';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            // 确保副标题中的换行符正确传递
            const submitData = {
                ...formData,
                subTitle: formData.subTitle // 保持原样，包含换行符
            };
            await onSubmit(submitData);
        } catch (error) {
            // 错误已经在父组件处理
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* 标题 */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    标题 *
                </label>
                <input
                    type="text"
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* 副标题 */}
            <div>
                <label htmlFor="subTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    副标题 *
                </label>
                <textarea
                    id="subTitle"
                    value={formData.subTitle}
                    onChange={(e) => handleChange('subTitle', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.subTitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                {errors.subTitle && <p className="mt-1 text-sm text-red-600">{errors.subTitle}</p>}
            </div>

            {/* 作者 */}
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
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                        type="button"
                        onClick={triggerFileInput}
                        className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                    >
                        上传图片
                    </button>
                </div>
                {formData.coverImage && (
                    <div className="mt-2">
                        <img
                            src={formData.coverImage}
                            alt="封面预览"
                            className="h-32 object-cover rounded-lg border"
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
                <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                            {tag}
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* 状态 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    状态
                </label>
                <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="DRAFT"
                            checked={formData.status === 'DRAFT'}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">草稿</span>
                    </label>
                    <label className="inline-flex items-center">
                        <input
                            type="radio"
                            value="PUBLISHED"
                            checked={formData.status === 'PUBLISHED'}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2">发布</span>
                    </label>
                </div>
            </div>

            {/* 内容编辑器 */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    内容 *
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                    <EditorToolbar />
                    <div className="min-h-[400px]">
                        <MDEditor
                            value={formData.content}
                            onChange={(value) => handleChange('content', value || '')}
                            preview="edit"
                            height={400}
                            data-color-mode="light"
                        />
                    </div>
                </div>
                {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content}</p>}

                {/* Markdown 语法说明 */}
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Markdown 语法提示：</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                        <div>**粗体**</div>
                        <div>*斜体*</div>
                        <div>[链接](url)</div>
                        <div>![图片](url)</div>
                        <div>- 列表项</div>
                        <div>1. 有序列表</div>
                        <div>&gt; 引用</div>
                        <div>```代码块```</div>
                    </div>
                </div>
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
            <div className="flex justify-end space-x-4 pt-6 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
                    disabled={loading}
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50"
                >
                    {loading ? submitLoadingText : submitText}
                </button>
            </div>
        </form>
    );
}