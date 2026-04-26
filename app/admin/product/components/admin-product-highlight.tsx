// /app/admin/product/components/admin-product-highlight.tsx
'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const MDEditor = dynamic(
    () => import('@uiw/react-md-editor').then((mod) => mod.default),
    { ssr: false }
);

interface HighlightSection {
    title: string;
    body: string;
    image: string;
    imageBox: string;
    imageTail: string;
}

interface Product {
    highlightData?: string;
    boxContents?: string;
}

interface HighlightProps {
    product: Product;
    updateProduct: (updates: Partial<Product>) => void;
}

export default function AdminProductHighlight({ product, updateProduct }: HighlightProps) {
    const [highlights, setHighlights] = useState<HighlightSection[]>([]);
    const [boxContent, setBoxContent] = useState('');

    // 初始化数据
    useEffect(() => {
        if (product.highlightData) {
            try {
                const parsed = JSON.parse(product.highlightData);
                setHighlights(Array.isArray(parsed) ? parsed : []);
            } catch (e) {
                console.error('解析 highlightData 失败:', e);
                setHighlights([]);
            }
        } else {
            setHighlights([]);
        }

        if (product.boxContents) {
            setBoxContent(product.boxContents);
        } else {
            setBoxContent('');
        }
    }, [product.highlightData, product.boxContents]);

    // 添加新的亮点区块
    const addHighlight = () => {
        const newHighlight: HighlightSection = {
            title: '',
            body: '',
            image: '',
            imageBox: '',
            imageTail: ''
        };
        const updated = [...highlights, newHighlight];
        setHighlights(updated);
        updateProduct({ highlightData: JSON.stringify(updated) });
    };

    // 删除亮点区块
    const removeHighlight = (index: number) => {
        const updated = highlights.filter((_, i) => i !== index);
        setHighlights(updated);
        updateProduct({ highlightData: JSON.stringify(updated) });
    };

    // 更新亮点字段
    const updateHighlight = (index: number, field: keyof HighlightSection, value: string) => {
        const updated = [...highlights];
        updated[index] = { ...updated[index], [field]: value };
        setHighlights(updated);
        updateProduct({ highlightData: JSON.stringify(updated) });
    };

    // 更新包装内容
    const updateBoxContent = (value: string | undefined) => {
        setBoxContent(value || '');
        updateProduct({ boxContents: value || '' });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            <div className="px-6 py-4 border-b">
                <h3 className="text-lg font-semibold">产品亮点与包装</h3>
            </div>
            <div className="p-6 space-y-8">
                {/* 产品亮点 */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                            产品亮点 (Highlight Data)
                        </label>
                        <button
                            type="button"
                            onClick={addHighlight}
                            className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                        >
                            + 添加亮点
                        </button>
                    </div>

                    {highlights.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <p className="text-gray-500 text-sm">暂无亮点信息，点击上方按钮添加</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {highlights.map((highlight, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="text-sm font-medium text-gray-900">亮点 #{index + 1}</h4>
                                        <button
                                            type="button"
                                            onClick={() => removeHighlight(index)}
                                            className="text-red-600 hover:text-red-800 text-sm"
                                        >
                                            删除
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">标题</label>
                                            <input
                                                type="text"
                                                value={highlight.title}
                                                onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="亮点标题"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">主图 URL</label>
                                            <input
                                                type="text"
                                                value={highlight.image}
                                                onChange={(e) => updateHighlight(index, 'image', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="图片链接"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Box 图 URL</label>
                                            <input
                                                type="text"
                                                value={highlight.imageBox}
                                                onChange={(e) => updateHighlight(index, 'imageBox', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="Box 图片链接"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Tail 图 URL</label>
                                            <input
                                                type="text"
                                                value={highlight.imageTail}
                                                onChange={(e) => updateHighlight(index, 'imageTail', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                                placeholder="Tail 图片链接"
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">描述内容</label>
                                        <div data-color-mode="light">
                                            <MDEditor
                                                value={highlight.body}
                                                onChange={(value) => updateHighlight(index, 'body', value || '')}
                                                height={200}
                                                preview="edit"
                                                textareaProps={{
                                                    placeholder: '输入亮点详细描述...'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* 包装内容 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        包装清单 (Box Contents)
                    </label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                        <div data-color-mode="light">
                            <MDEditor
                                value={boxContent}
                                onChange={updateBoxContent}
                                height={300}
                                preview="edit"
                                textareaProps={{
                                    placeholder: '输入包装清单内容，例如：\n- 1x 主机\n- 1x USB充电线\n- 1x 说明书'
                                }}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">展示在产品详情页的"包装清单"部分</p>
                </div>
            </div>
        </div>
    );
}
