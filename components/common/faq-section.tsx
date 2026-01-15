'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/constants/faq-data';

interface FAQSectionProps {
    context?: 'all' | 'product' | 'contact';
    className?: string;
}

// 一个简单的辅助组件，用于渲染支持 **加粗** 和 \n 换行的文本
const RichText = ({ text }: { text: string }) => {
    // 1. 处理换行
    const lines = text.split('\n');

    return (
        <div className="text-gray-600 font-light leading-relaxed text-sm md:text-base space-y-2">
            {lines.map((line, index) => {
                if (!line) return <div key={index} className="h-2" />; // 空行处理

                // 2. 简单的正则处理 **Bold**
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
                {/* 使用 RichText 组件来渲染你的 Markdown 格式答案 */}
                <RichText text={answer} />
            </div>
        </div>
    );
};

export default function FAQSection({ context = 'all', className = '' }: FAQSectionProps) {

    // 过滤逻辑
    const filteredData = FAQ_DATA.map(category => ({
        ...category,
        items: category.items.filter(item => {
            const tags = item.tags || [];

            if (context === 'all') return true;

            // 产品页逻辑
            if (context === 'product') {
                return tags.includes('product');
            }

            // 客服页逻辑 (匹配你数据里的 "contact" 标签)
            if (context === 'contact') {
                return tags.includes('contact');
            }

            return false;
        })
    })).filter(category => category.items.length > 0);

    // 渲染逻辑
    if (context === 'product' || context === 'contact') {
        const flatItems = filteredData.flatMap(c => c.items); // 取消 .slice(0,5) 限制，显示所有匹配项

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

    // FAQ 主页逻辑
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