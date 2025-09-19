import './about.css'

export default function About() {
    return (
        <section id="about">
            <div className="container">
                <div className="hero">
                    <div className="hero-content">
                        <h1>About PowerCell</h1>
                        <p>Your trusted partner for premium battery solutions</p>
                    </div>
                </div>

                <div className="about-content">
                    <div className="about-text">
                        <h2>Powering Your World</h2>
                        <p>At PowerCell, we believe that reliable energy is the foundation of modern life. Since 2010,
                            we've been dedicated to providing high-performance, sustainable battery solutions for
                            customers across the globe.</p>
                        <p>Based in Hamburg, Germany, we leverage our expertise in battery technology and international
                            trade to deliver products that meet the highest standards of quality, safety, and
                            environmental responsibility.</p>

                        <div className="about-stats">
                            <div className="stat">
                                <div className="stat-number">14+</div>
                                <div className="stat-text">Years Experience</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">10K+</div>
                                <div className="stat-text">Clients Worldwide</div>
                            </div>
                            <div className="stat">
                                <div className="stat-number">65+</div>
                                <div className="stat-text">Countries Served</div>
                            </div>
                        </div>
                    </div>

                    <div className="about-image">
                        <img
                            src="https://images.unsplash.com/photo-1581094288338-231b058b38b8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80"
                            alt="PowerCell battery technology" />
                    </div>
                </div>

                <div className="values-grid">
                    <div className="value-item">
                        <h3>Quality & Performance</h3>
                        <p>Every battery undergoes rigorous testing to ensure optimal performance, long life, and
                            reliability in diverse conditions.</p>
                    </div>
                    <div className="value-item">
                        <h3>Safety First</h3>
                        <p>Our products meet international safety standards with built-in protection against
                            overcharging and short-circuiting.</p>
                    </div>
                    <div className="value-item">
                        <h3>Sustainability</h3>
                        <p>We're committed to reducing environmental impact through recyclable materials and
                            energy-efficient technologies.</p>
                    </div>
                    <div className="value-item">
                        <h3>Global Support</h3>
                        <p>With distribution centers on three continents, we provide fast shipping and local customer
                            support.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}