import productsData from '@/data/tpe_vagina_molds.json';

export default function TpeVaginaMolds() {
    const products = productsData.products;


    return (
        <>
            <div className="page-header">
                <h1 className="page-title">to get list by collection</h1>
            </div>
            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product}  />
                ))}
            </div>
        </>
    );
}

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