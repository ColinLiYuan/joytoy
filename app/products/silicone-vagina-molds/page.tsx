export default function SiliconeVaginaMolds() {
    // 产品数据数组
    const products = [
        {
            id: 1,
            badge: "Sale",
            image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Smart Blender",
            category: "Blenders",
            title: "SmartPower Blender Pro",
            rating: 4.5,
            reviews: 128,
            currentPrice: "$189.99",
            originalPrice: "$219.99",
            discount: "14% off",
            onSale: true
        },
        {
            id: 2,
            badge: null,
            image: "https://images.unsplash.com/photo-1597239450995-ec0d5a867cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Coffee Maker",
            category: "Coffee Makers",
            title: "BrewMaster Deluxe",
            rating: 5,
            reviews: 96,
            currentPrice: "$149.99",
            originalPrice: null,
            discount: null,
            onSale: false
        },
        {
            id: 3,
            badge: "New",
            image: "https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Air Fryer",
            category: "Air Fryers",
            title: "CrispAir Digital Fryer",
            rating: 4,
            reviews: 74,
            currentPrice: "$129.99",
            originalPrice: "$149.99",
            discount: "13% off",
            onSale: true
        },
        {
            id: 4,
            badge: null,
            image: "https://images.unsplash.com/photo-1619642332787-437c5312e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Mixer",
            category: "Mixers",
            title: "PowerMix Stand Mixer",
            rating: 4.5,
            reviews: 52,
            currentPrice: "$249.99",
            originalPrice: null,
            discount: null,
            onSale: false
        },
        {
            id: 5,
            badge: "Bestseller",
            image: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Toaster",
            category: "Toasters",
            title: "ToastMaster 4-Slice",
            rating: 5,
            reviews: 201,
            currentPrice: "$79.99",
            originalPrice: "$99.99",
            discount: "20% off",
            onSale: true
        },
        {
            id: 6,
            badge: null,
            image: "https://images.unsplash.com/photo-1619642332787-437c5312e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
            alt: "Microwave",
            category: "Microwaves",
            title: "QuickHeat Microwave",
            rating: 4,
            reviews: 63,
            currentPrice: "$159.99",
            originalPrice: null,
            discount: null,
            onSale: false
        }
    ];

    // 渲染星级评分
    const renderRatingStars = (rating: number) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(<i key={`full-${i}`} className="fas fa-star"></i>);
        }

        if (hasHalfStar) {
            stars.push(<i key="half" className="fas fa-star-half-alt"></i>);
        }

        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<i key={`empty-${i}`} className="far fa-star"></i>);
        }

        return stars;
    };

    return (
        <>
            <div className="page-header">
                <h1 className="page-title">silicone-vagina-molds</h1>
                <div className="sort-filter">
                    <select>
                        <option>Sort by: Popularity</option>
                        <option>Sort by: Price Low to High</option>
                        <option>Sort by: Price High to Low</option>
                        <option>Sort by: Highest Rated</option>
                    </select>
                    <select>
                        <option>Filter by: All</option>
                        <option>Filter by: On Sale</option>
                        <option>Filter by: New Arrivals</option>
                        <option>Filter by: In Stock</option>
                    </select>
                </div>
            </div>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} renderRatingStars={renderRatingStars} />
                ))}
            </div>
        </>
    );
}

// 产品卡片组件
function ProductCard({ product, renderRatingStars }: {
    product: any;
    renderRatingStars: (rating: number) => JSX.Element[];
}) {
    return (
        <div className="product-card">
            <div className="product-image">
                {product.badge && <span className="product-badge">{product.badge}</span>}
                <img src={product.image} alt={product.alt} />
            </div>
            <div className="product-info">
                <div className="product-category">{product.category}</div>
                <h3 className="product-title">{product.title}</h3>
                {/*<div className="product-rating">*/}
                {/*    {renderRatingStars(product.rating)}*/}
                {/*</div>*/}
                <div className="product-price">
                    <span className="current-price">{product.currentPrice}</span>
                    {/*{product.originalPrice && (*/}
                    {/*    <span className="original-price">{product.originalPrice}</span>*/}
                    {/*)}*/}
                    {/*{product.discount && (*/}
                    {/*    <span className="discount">{product.discount}</span>*/}
                    {/*)}*/}
                </div>
                <div className="product-actions">
                    <button className="add-to-cart">
                        <i className="fas fa-shopping-cart"></i>
                        Add to Cart
                    </button>
                    <button className="wishlist-btn">
                        <i className="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    );
}