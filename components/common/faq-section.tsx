// components/common/faq-section.tsx
'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/constants/faq-data';

interface FAQSectionProps {
    context?: 'all' | 'product' | 'contact';
    className?: string;
}

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
                    isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-gray-600 font-light leading-relaxed text-sm md:text-base">
                    {answer}
                </p>
            </div>
        </div>
    );
};

export default function FAQSection({ context = 'all', className = '' }: FAQSectionProps) {
    // Filter logic
    const filteredData = FAQ_DATA.map(category => ({
        ...category,
        items: category.items.filter(item => {
            if (context === 'all') return true;
            // For product page, we typically want Shipping, Privacy, and Returns info
            return item.tags.includes('product') ||
                item.tags.includes('shipping') ||
                item.tags.includes('packaging');
        })
    })).filter(category => category.items.length > 0);

    // For Product Page: Flatten the list to avoid big category headers, just show top Q&As
    // For FAQ Page: Keep the category structure

    if (context === 'product') {
        // Flatten and take top 4 most relevant for PDP
        const flatItems = filteredData.flatMap(c => c.items).slice(0, 4);

        if (flatItems.length === 0) return null;

        return (
            <section className={`w-full ${className}`}>
                <h3 className="text-2xl font-bold mb-8 font-['Playfair_Display'] text-center md:text-left">
                    Frequently Asked Questions
                </h3>
                <div className="w-full">
                    {flatItems.map((item) => (
                        <AccordionItem key={item.id} question={item.question} answer={item.answer} />
                    ))}
                </div>
            </section>
        );
    }

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