import './home.css'

export default function Contact() {
    return (
        <section id="about">
            <div className="container">
                <div className="hero">
                    <div className="hero-content">
                        <h1>Upgrade Your Home with Smart Appliances</h1>
                        <p>Discover our premium collection of innovative home appliances designed to make your life
                            easier, smarter, and more efficient.</p>
                        <a href="#" className="btn">Shop Now</a>
                    </div>
                </div>

                <h2 className="section-title">Shop by <span>Category</span></h2>
                <div className="categories">
                    <div className="category-card">
                        <i className="fas fa-blender"></i>
                        <h3>Kitchen Appliances</h3>
                        <p>Smart devices for modern kitchens</p>
                    </div>

                    <div className="category-card">
                        <i className="fas fa-fan"></i>
                        <h3>Climate Control</h3>
                        <p>Heaters, fans, and air purifiers</p>
                    </div>

                    <div className="category-card">
                        <i className="fas fa-tshirt"></i>
                        <h3>Laundry</h3>
                        <p>Washers, dryers, and irons</p>
                    </div>

                    <div className="category-card">
                        <i className="fas fa-utensils"></i>
                        <h3>Food Preparation</h3>
                        <p>Mixers, blenders, and processors</p>
                    </div>
                </div>
            </div>
        </section>
    )
}