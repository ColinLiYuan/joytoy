'use client';

import { usePathname } from 'next/navigation'
import './products.css'
import { useEffect, useState } from 'react'

export default function ProductLayout({
                                          children,
                                      }: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isClient, setIsClient] = useState(false)
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

    useEffect(() => {
        setIsClient(true)
    }, [])

    return (
        <section id="about">
            <div className="product-container">
                <CategorySidebar />
                <div className="main-content">
                    {children}
                </div>
            </div>
        </section>
    );

    function CategorySidebar() {
        const categories = [
            { name: 'Vagina Molds', icon: 'fas fa-blender' },
            { name: 'Full Doll', icon: 'fas fa-blender' },
            { name: 'Dildos', icon: 'fas fa-fan' },
        ]

        const allSubCategories = {
            'vagina-molds': [
                { name: 'Silicone Vagina', slug: 'silicone-vagina-molds' },
                { name: 'TPE Vagina', slug: 'tpe-vagina-molds' }
            ],
            'full-doll': [
                { name: 'All TPE Vagina', slug: 'tpe-vagina-molds' },
                { name: 'Standard', slug: 'tpe-vagina-molds/standard' },
                { name: 'Premium', slug: 'tpe-vagina-molds/premium' }
            ],
            'dildos': [
                { name: 'All Dildos', slug: 'dildos' },
                { name: 'Realistic', slug: 'dildos/realistic' },
                { name: 'Abstract', slug: 'dildos/abstract' },
                { name: 'Double-ended', slug: 'dildos/double-ended' },
                { name: 'Suction Cup', slug: 'dildos/suction-cup' }
            ]
        };

        // 根据当前路径判断哪个一级分类应该激活
        const getActiveCategory = () => {
            if (!isClient) return '';

            if (pathname.includes('silicone-vagina-molds') || pathname.includes('tpe-vagina-molds')) {
                return 'vagina-molds';
            } else if (pathname.includes('full-doll')) {
                return 'full-doll';
            } else if (pathname.includes('dildos')) {
                return 'dildos';
            }

            return '';
        };

        const activeCategory = getActiveCategory();

        // 处理分类点击事件（移动设备）
        const handleCategoryClick = (categorySlug: string) => {
            if (expandedCategory === categorySlug) {
                setExpandedCategory(null);
            } else {
                setExpandedCategory(categorySlug);
            }
        };

        return (
            <aside className="category-sidebar">
                <div className="category-header">
                    <i className="fas fa-list"></i>
                    <h2>Product Categories</h2>
                </div>
                <ul className="category-list">
                    {categories.map((category) => {
                        const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
                        const isActive = isClient && activeCategory === categorySlug;
                        const isExpanded = expandedCategory === categorySlug;
                        const subCategories = allSubCategories[categorySlug as keyof typeof allSubCategories] || [];

                        return (
                            <li
                                key={category.name}
                                className={`category-item ${isActive ? 'active' : ''}`}
                                onMouseEnter={() => setExpandedCategory(categorySlug)}
                                onMouseLeave={() => setExpandedCategory(null)}
                            >
                                <div
                                    className="category-link"
                                    onClick={() => handleCategoryClick(categorySlug)}
                                >
                                    <i className={category.icon}></i>
                                    {category.name}
                                    {/* 只在移动设备显示切换按钮 */}
                                    {subCategories.length > 0 && (
                                        <span className="mobile-toggle">
                      {isExpanded ? '−' : '+'}
                    </span>
                                    )}
                                </div>

                                {subCategories.length > 0 && (
                                    <div className={`subcategory-dropdown ${isExpanded ? 'expanded' : ''}`}>
                                        <ul className="subcategory-list">
                                            {subCategories.map((subCategory) => {
                                                const isSubActive = isClient && pathname.includes(subCategory.slug);

                                                return (
                                                    <li key={subCategory.slug} className="subcategory-item">
                                                        <a
                                                            href={`/products/${subCategory.slug}`}
                                                            className={`subcategory-link ${isSubActive ? 'active' : ''}`}
                                                        >
                                                            {subCategory.name}
                                                        </a>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </aside>
        );
    }
}