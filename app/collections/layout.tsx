'use client';

import { usePathname } from 'next/navigation'
import './collection.css'
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
            { name: 'Women', icon: 'fas fa-blender' },
            { name: 'Men', icon: 'fas fa-blender' }
        ]

        const allSubCategories = {
            'women': [
                { name: 'Realistic Dildos', slug: 'realistic-dildos' },
                { name: 'Fairy Dildos', slug: 'fairy-dildos' }
            ],
            'men': [
                { name: 'Pocket Pussy', slug: 'pocket-pussy' },
                { name: 'Sex Doll', slug: 'sex-doll' }
            ]
        };

        // 根据当前路径判断哪个一级分类应该激活1
        const getActiveCategory = () => {
            if (!isClient) return '';

            if (pathname.includes('realistic-dildos') || pathname.includes('fairy-dildos')) {
                return 'women';
            } else if (pathname.includes('pocket-pussy' || pathname.includes('sex-doll'))) {
                return 'men';
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
                                                            href={`/collections/${subCategory.slug}`}
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
