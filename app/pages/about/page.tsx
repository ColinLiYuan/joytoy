import './about.css'

export default function About() {
    return (
        <section id="about">
            <div className="container">
                {/* 已经去掉About标题，直接开始内容 */}
                <section id="our-story">
                    <h2>Beyond the Myth</h2>
                    <p>Every myth contains a kernel of truth. At <strong>MythToy</strong>, our truth is simple: everyone deserves
                        access to safe, innovative, and high-quality intimate products without the mystery. We're here to replace
                        myth with <span className="promise">clarity, quality, and trust</span>.</p>
                    <p>Founded in the heart of the world's largest adult products manufacturing hub, we have a unique advantage.
                        We're not just distributors; we're insiders. This direct access allows us to cut through the noise, offering
                        you products that are the result of genuine expertise and cutting-edge manufacturing, not just marketing
                        hype.</p>
                </section>

                <section id="our-approach">
                    <h2>The MythToy Difference</h2>
                    <div className="values-grid">
                        <div className="value-card">
                            <h3>Source Intelligence</h3>
                            <p>We're at the source. This means better prices, authentic materials, and direct quality control for
                                you, whether you're a retailer or an individual.</p>
                        </div>
                        <div className="value-card">
                            <h3>Uncompromising Quality</h3>
                            <p>We believe quality is non-negotiable. Our products are designed with safety, sensation, and
                                durability as the top priorities.</p>
                        </div>
                        <div className="value-card">
                            <h3>Discretion Assured</h3>
                            <p>Your privacy is paramount. Every order is handled with the utmost discretion and respect, from secure
                                payment to plain packaging.</p>
                        </div>
                    </div>
                </section>

                <section id="our-commitment">
                    <h2>Our Promise to You</h2>
                    <p>We are committed to being a transparent and reliable partner in your exploration. We provide clear
                        information, honest product descriptions, and responsive customer support. With MythToy, what you see is
                        what you get: exceptional products, no myths attached.</p>
                </section>

                <section className="cta">
                    <h2>Experience the Truth</h2>
                    <p>Ready to see beyond the myth? Explore our collection of thoughtfully designed products or speak
                        directly with our team.</p>
                    <a href="/collections">Explore Products</a>
                    <a href="/pages/contact" className="contact-btn">Contact Us</a>
                </section>
            </div>
        </section>
    )
}