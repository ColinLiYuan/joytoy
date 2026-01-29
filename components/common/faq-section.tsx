'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/constants/faq-data';

interface FAQSectionProps {
    context?: 'all' | 'product' | 'contact' | 'general';
    tag?: string;
    className?: string;
}

// 辅助组件：渲染支持 **加粗** 和 \n 换行的文本 (保持不变)
const RichText = ({ text }: { text: string }) => {
    const lines = text.split('\n');
    return (
        <div className="text-gray-600 font-light leading-relaxed text-sm md:text-base space-y-2">
            {lines.map((line, index) => {
                if (!line) return <div key={index} className="h-2" />;
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={index}>
                        {parts.map((part, i) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

// 手风琴组件 (保持不变)
const AccordionItem = ({ question, answer }: { question: string; answer: string }) => {
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
                    isOpen ? 'max-h-[500px] opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
            >
                <RichText text={answer} />
            </div>
        </div>
    );
};

export default function FAQSection({ context = 'all', tag, className = '' }: FAQSectionProps) {

    // 1. 修改过滤逻辑
    const filteredData = FAQ_DATA.map(category => ({
        ...category,
        items: category.items.filter(item => {
            const itemTags = item.tags || [];

            // 优先匹配传入的特定 tag (用于 Collection 页面)
            if (tag) {
                return itemTags.includes(tag);
            }

            // 原有的 context 逻辑
            if (context === 'all') return true;
            if (context === 'product') return itemTags.includes('product');
            if (context === 'contact') return itemTags.includes('contact');

            return itemTags.includes(context);
        })
    })).filter(category => category.items.length > 0); // 移除没有匹配项的分类

    // 2. 判断是否是“特定场景”模式 (非帮助中心主页)
    // 如果有 tag，或者 context 不是 'all'，都属于特定场景，需要渲染扁平列表
    const isSpecificMode = tag || (context !== 'all');

    // 3. 渲染逻辑：特定场景 (Product, Contact, Collection)
    if (isSpecificMode) {
        // 展平所有分类下的 items
        const flatItems = filteredData.flatMap(c => c.items);

        // 如果没有找到相关问题，直接不渲染 (避免显示空标题)
        if (flatItems.length === 0) return null;

        return (
            <section className={`w-full ${className}`}>
                <h3 className="text-2xl font-bold mb-8 font-['Playfair_Display'] text-center md:text-left">
                    {context === 'contact' ? 'Common Questions' : 'Frequently Asked Questions'}
                </h3>
                <div className="w-full">
                    {flatItems.map((item) => (
                        <AccordionItem key={item.id} question={item.question} answer={item.answer} />
                    ))}
                </div>
            </section>
        );
    }

    // 4. 渲染逻辑：FAQ 主页 (Help Center) - 保持原有结构
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
                                <AccordionItem key={item.id} question={item.question} answer={item.answer} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}