import productsData from '@/data/molds.json';

export default function SiliconeVaginaMolds() {
    const products = productsData.products;

    // // 产品数据数组
    // const products = [
    //     {
    //         id: 1,
    //         badge: "Best Seller",
    //         image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    //         alt: "Premium Silicone Vagina Mold",
    //         category: "Silicone Molds",
    //         title: "Premium Silicone Vagina Mold - Professional Grade",
    //         description: "High-quality medical grade silicone mold for professional use. Durable and detailed reproduction.",
    //         material: "Medical Grade Silicone",
    //         size: "Standard Size",
    //         currentPrice: "$189.99",
    //         minOrder: "10 units"
    //     },
    //     {
    //         id: 2,
    //         badge: "New",
    //         image: "https://images.unsplash.com/photo-1597239450995-ec0d5a867cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    //         alt: "TPE Vagina Mold",
    //         category: "TPE Molds",
    //         title: "TPE Vagina Mold - Economic Series",
    //         description: "Cost-effective TPE material mold with good flexibility and durability.",
    //         material: "Thermoplastic Elastomer",
    //         size: "Standard Size",
    //         currentPrice: "$149.99",
    //         minOrder: "15 units"
    //     },
    //     {
    //         id: 3,
    //         badge: "Customizable",
    //         image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    //         alt: "Custom Silicone Mold",
    //         category: "Custom Molds",
    //         title: "Custom Design Silicone Vagina Mold",
    //         description: "Fully customizable mold design with your specifications. OEM/ODM available.",
    //         material: "Medical Grade Silicone",
    //         size: "Customizable",
    //         currentPrice: "Contact for Quote",
    //         minOrder: "50 units"
    //     },
    //     {
    //         id: 4,
    //         badge: "Bulk Discount",
    //         image: "https://images.unsplash.com/photo-1619642332787-437c5312e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    //         alt: "Large Size Mold",
    //         category: "Silicone Molds",
    //         title: "Large Size Vagina Mold - Premium Series",
    //         description: "Extra large size mold with enhanced details and superior material quality.",
    //         material: "Medical Grade Silicone",
    //         size: "Large Size",
    //         currentPrice: "$249.99",
    //         minOrder: "8 units"
    //     }
    // ];

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">silicone-vagina-molds</h1>
                {/*<div className="sort-filter">*/}
                {/*    <select>*/}
                {/*        <option>Sort by: Popularity</option>*/}
                {/*        <option>Sort by: Price Low to High</option>*/}
                {/*        <option>Sort by: Price High to Low</option>*/}
                {/*        <option>Sort by: Highest Rated</option>*/}
                {/*    </select>*/}
                {/*    <select>*/}
                {/*        <option>Filter by: All</option>*/}
                {/*        <option>Filter by: On Sale</option>*/}
                {/*        <option>Filter by: New Arrivals</option>*/}
                {/*        <option>Filter by: In Stock</option>*/}
                {/*    </select>*/}
                {/*</div>*/}
            </div>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}  />
                ))}
            </div>
        </>
    );
}

// 产品卡片组件
function ProductCard({ product }: {
    product: any;
}) {
    return (
        <div className="product-card">
            <div className="product-image">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <img src={product.image} alt={product.alt} />
            </div>
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h2 className="product-title">{product.title}</h2>
                <p className="product-description">{product.description}</p>
                <div className="product-specs">
                    <div className="spec-item">
                        <strong>Material:</strong> {product.material}
                    </div>
                    <div className="spec-item">
                        <strong>Size:</strong> {product.size}
                    </div>
                    <div className="spec-item">
                        <strong>Min. Order:</strong> {product.minOrder}
                    </div>
                </div>
                <div className="product-price">
                    <span className="current-price">{product.currentPrice}</span>
                </div>
            </div>
        </div>
    );
}