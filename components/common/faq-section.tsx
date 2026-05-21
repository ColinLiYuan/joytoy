'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/constants/faq-data';
import Image from 'next/image';
import Link from 'next/link';
import { getProductImageUrl } from '@/lib/image-utils'; // 引入图片工具函数

interface FAQSectionProps {
    context?: 'all' | 'product' | 'contact' | 'general' | 'home';
    tag?: string;
    className?: string;
}

// 辅助组件：渲染支持 **加粗**、\n 换行和 [IMAGE] 标记的文本
const RichText = ({ text, images = [] }: { text: string; images?: { url: string; alt: string }[] }) => {
    // 解析文本，将 [IMAGE:xxx] 转换为图片组件
    const parts = text.split(/(\[IMAGE:[^\]]+\])/g);
    let imageIndex = 0;

    return (
        <div className="text-gray-600 font-light leading-relaxed text-sm md:text-base space-y-4">
            {parts.map((part, index) => {
                if (part.startsWith('[IMAGE:')) {
                    const image = images[imageIndex];
                    imageIndex++;

                    if (!image) return null;

                    // 使用 getProductImageUrl 处理图片URL
                    const imageUrl = getProductImageUrl('', image.url);

                    return (
                        <div key={index} className="my-4 rounded-lg overflow-hidden bg-gray-50">
                            <div className="relative w-full h-48 md:h-64">
                                <Image
                                    src={imageUrl}
                                    alt={image.alt}
                                    fill
                                    className="object-contain"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                                />
                            </div>
                            <p className="text-center text-xs text-gray-500 mt-2 p-2">
                                {image.alt}
                            </p>
                        </div>
                    );
                }

                // 处理普通文本（包含换行、加粗和产品链接）
                const lines = part.split('\n').filter(line => line.trim() !== '');
                return lines.map((line, lineIndex) => {
                    if (line === '---') {
                        return <hr key={`${index}-${lineIndex}`} className="my-4 border-gray-200" />;
                    }

                    // 解析 *[文本](链接)* 语法
                    const linkRegex = /\*\[([^\]]+)\]\(([^)]+)\)\*/g;
                    const linkParts: Array<{ type: 'text' | 'link'; content: string; href?: string }> = [];
                    let lastIndex = 0;
                    let match;
                    
                    while ((match = linkRegex.exec(line)) !== null) {
                        // 添加匹配前的普通文本
                        if (match.index > lastIndex) {
                            linkParts.push({ type: 'text', content: line.slice(lastIndex, match.index) });
                        }
                        // 添加链接
                        linkParts.push({ type: 'link', content: match[1], href: match[2] });
                        lastIndex = match.index + match[0].length;
                    }
                    // 添加剩余的文本
                    if (lastIndex < line.length) {
                        linkParts.push({ type: 'text', content: line.slice(lastIndex) });
                    }

                    // 如果没有链接，使用原来的加粗解析逻辑
                    if (linkParts.length === 0) {
                        const textParts = line.split(/(\*\*.*?\*\*)/g);
                        return (
                            <p key={`${index}-${lineIndex}`} className="leading-relaxed">
                                {textParts.map((textPart, textIndex) => {
                                    if (textPart.startsWith('**') && textPart.endsWith('**')) {
                                        return (
                                            <strong key={textIndex} className="font-semibold text-gray-900">
                                                {textPart.slice(2, -2)}
                                            </strong>
                                        );
                                    }
                                    return textPart;
                                })}
                            </p>
                        );
                    }

                    // 有链接时使用链接解析逻辑
                    return (
                        <p key={`${index}-${lineIndex}`} className="leading-relaxed">
                            {linkParts.map((linkPart, partIndex) => {
                                if (linkPart.type === 'link' && linkPart.href) {
                                    return (
                                        <Link 
                                            key={partIndex} 
                                            href={linkPart.href}
                                            className="text-[#C5A059] hover:text-[#B8944F] underline underline-offset-2 font-medium transition-colors"
                                        >
                                            {linkPart.content}
                                        </Link>
                                    );
                                }
                                
                                // 普通文本，继续处理加粗
                                const textParts = linkPart.content.split(/(\*\*.*?\*\*)/g);
                                return textParts.map((textPart, textIndex) => {
                                    if (textPart.startsWith('**') && textPart.endsWith('**')) {
                                        return (
                                            <strong key={`${partIndex}-${textIndex}`} className="font-semibold text-gray-900">
                                                {textPart.slice(2, -2)}
                                            </strong>
                                        );
                                    }
                                    return textPart;
                                });
                            })}
                        </p>
                    );
                });
            })}
        </div>
    );
};

// 手风琴组件
const AccordionItem = ({
                           question,
                           answer,
                           images
                       }: {
    question: string;
    answer: string;
    images?: { url: string; alt: string }[]
}) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border-b border-gray-100 last:border-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center py-5 text-left group"
            >
                <h4 className="text-base md:text-lg font-medium text-gray-900 group-hover:text-gray-600 transition-colors pr-8 font-['Playfair_Display']">
                    {question}
                </h4>
                <span className="flex-shrink-0 text-gray-400 group-hover:text-gray-900 transition-colors">
                    {isOpen ? <Minus size={18} strokeWidth={1.5} /> : <Plus size={18} strokeWidth={1.5} />}
                </span>
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? 'max-h-[1000px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
            >
                <RichText text={answer} images={images} />
            </div>
        </div>
    );
};

export default function FAQSection({ context = 'all', tag, className = '' }: FAQSectionProps) {
    // 1. 修改过滤逻辑
    let filteredData = FAQ_DATA.map(category => ({
        ...category,
        items: category.items.filter(item => {
            const itemTags = item.tags || [];

            // 如果指定了 tag，则只返回包含该 tag 的问题
            if (tag) {
                return itemTags.includes(tag);
            }

            // 如果没有 tag，则根据 context 过滤
            if (context === 'all') return true;
            if (context === 'product') return itemTags.includes('product');
            if (context === 'contact') return itemTags.includes('contact');

            return itemTags.includes(context);
        })
    })).filter(category => category.items.length > 0);

    // Fallback: if tag was specified but no items matched, fall back to general FAQs
    if (tag && filteredData.length === 0) {
        filteredData = FAQ_DATA.map(category => ({
            ...category,
            items: category.items.filter(item => (item.tags || []).includes('general'))
        })).filter(category => category.items.length > 0);
    }

    // 2. 判断是否是"特定场景"模式
    const isSpecificMode = tag || (context !== 'all');

    // 3. 渲染逻辑：特定场景
    if (isSpecificMode) {
        const flatItems = filteredData.flatMap(c => c.items);

        // 如果没有匹配到任何问题，直接不渲染，而不是展示通用问题
        if (flatItems.length === 0) return null;

        return (
            <section className={`w-full ${className}`}>
                <h3 className="text-2xl font-bold mb-8 font-['Playfair_Display'] text-center md:text-left">
                    Frequently Asked Questions
                </h3>
                <div className="w-full">
                    {flatItems.map((item) => (
                        <AccordionItem
                            key={item.id}
                            question={item.question}
                            answer={item.answer}
                            images={item.images}
                        />
                    ))}
                </div>
            </section>
        );
    }

    // 4. 渲染逻辑：FAQ 主页
    return (
        <section className={`w-full max-w-3xl mx-auto ${className}`}>
            <h1 className="text-4xl md:text-5xl font-bold text-center mb-16 font-['Playfair_Display']">
                Help & Support
            </h1>

            <div className="space-y-12">
                {filteredData.map((category) => (
                    <div key={category.title}>
                        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-6 mt-2">
                            {category.title}
                        </h2>
                        <div>
                            {category.items.map((item) => (
                                <AccordionItem
                                    key={item.id}
                                    question={item.question}
                                    answer={item.answer}
                                    images={item.images}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}