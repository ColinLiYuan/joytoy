'use client';

import { usePathname } from 'next/navigation'
import './products.css'

export default function ProductLayout({
                                          children,
                                      }: {
                                          children: React.ReactNode
                                      }
) {
    const pathname = usePathname()

    return (
        <section id="about">
            <div className="product-container">
                <CategorySidebar />
                <div className="main-content">
                    <SubCategoryNav />
                    {children}
                </div>
            </div>
        </section>
    );

    function CategorySidebar() {
        const categories = [
            { name: 'Molds', icon: 'fas fa-blender', slug: 'silicone-vagina-molds' },
            { name: 'Dildos', icon: 'fas fa-fan', slug: 'dildos' },
        ]

        return (
            <aside className="category-sidebar">
                <div className="category-header">
                    <i className="fas fa-list"></i>
                    <h2>Product Categories</h2>
                </div>
                <ul className="category-list">
                    {categories.map((category) => (
                        <li key={category.name} className="category-item">
                            <a
                                href={`/products/${category.slug}`}
                                className="category-link"
                            >
                                <i className={category.icon}></i>
                                {category.name}
                                {/*<span className="category-count">{category.count}</span>*/}
                            </a>
                        </li>
                    ))}
                </ul>
            </aside>
        );
    }

    function SubCategoryNav() {
        // 所有子分类定义
        const allSubCategories = {
            'molds': [
                { name: 'silicone-vagina', slug: 'silicone-vagina-molds' },
                { name: 'tpe-vagina', slug: 'tpe-vagina-molds' }
            ],
            'dildos': [
                { name: 'All Dildos', slug: 'dildos' },
                { name: 'Realistic', slug: 'dildos/realistic' },
                { name: 'Abstract', slug: 'dildos/abstract' },
                { name: 'Double-ended', slug: 'dildos/double-ended' },
                { name: 'Suction Cup', slug: 'dildos/suction-cup' }
            ]
        };

        // 高级模糊匹配获取当前分类
        const getCurrentCategory = () => {
            const pathSegments = pathname.split('/').filter(segment => segment);
            if (pathSegments.length < 2) return '';

            // 获取 products 后面的路径部分
            const productsIndex = pathSegments.indexOf('products');
            if (productsIndex === -1 || productsIndex === pathSegments.length - 1) {
                return '';
            }

            const categorySegment = pathSegments[productsIndex + 1];

            // 精确匹配
            if (allSubCategories.hasOwnProperty(categorySegment)) {
                return categorySegment;
            }

            // 模糊匹配 - 检查是否包含已知分类关键词
            const knownCategories = Object.keys(allSubCategories).filter(key => key !== 'default');
            for (const category of knownCategories) {
                // 检查当前路径段是否包含分类名，或者分类名是否包含当前路径段
                if (categorySegment.includes(category) || category.includes(categorySegment)) {
                    return category;
                }
            }

            return 'default';
        };

        const currentCategory = getCurrentCategory();
        if (currentCategory === '') return null;
        const currentSubCategories = allSubCategories[currentCategory as keyof typeof allSubCategories];

        return (
            <nav className="subcategory-nav">
                <ul className="subcategory-list">
                    {currentSubCategories.map((subCategory) => {
                        // 模糊匹配判断当前活动子分类
                        const isActive = pathname.includes(subCategory.slug) ||
                            subCategory.slug.includes(pathname.split('/').pop() || '');

                        return (
                            <li key={subCategory.slug} className="subcategory-item">
                                <a
                                    href={`/products/${subCategory.slug}`}
                                    className={`subcategory-link ${isActive ? 'active' : ''}`}
                                >
                                    {subCategory.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        );
    }
}