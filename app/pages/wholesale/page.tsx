// app/pages/wholesale/page.tsx
export default function Wholesale() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-7xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Wholesale Adult Products - Bulk Sex Toys Distribution</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
                        {/* 介绍部分 */}
                        <section className="bg-blue-50 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Premium Wholesale Supplier for Adult Stores & Retailers</h2>
                            <p className="text-lg">
                                MythToy is a leading wholesale distributor of high-quality adult products, sex toys, and intimate accessories.
                                We supply retailers, adult stores, online shops, and distributors worldwide with competitive pricing and reliable supply chain.
                            </p>
                        </section>

                        {/* 批发优势 */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Why Choose MythToy Wholesale?</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3">Competitive Bulk Pricing</h3>
                                    <p>Volume-based discounts with tiered pricing for large orders. Best wholesale rates in the industry.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3">Private Label Options</h3>
                                    <p>Custom branding and packaging services available for retailers looking to build their own brand.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3">Fast Global Shipping</h3>
                                    <p>Reliable international shipping with discreet packaging. DDP and FOB terms available.</p>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
                                    <p>All products meet international safety standards. CE, RoHS, and FDA-compliant materials.</p>
                                </div>
                            </div>
                        </section>

                        {/* 产品类别 */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Wholesale Product Categories</h2>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* 女性玩具 */}
                                <div className="border-l-4 border-pink-500 pl-4">
                                    <h3 className="text-xl font-semibold mb-3">Female Sex Toys</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Clit Vibrators & Stimulators</li>
                                        <li>Rabbit Vibrators (Dual Stimulation)</li>
                                        <li>G-Spot Vibrators</li>
                                        <li>Bullet & Pocket Vibrators</li>
                                        <li>Wand Massagers</li>
                                        <li>Dildos & Realistic Toys</li>
                                        <li>Nipple Stimulators</li>
                                    </ul>
                                </div>

                                {/* 男性玩具 */}
                                <div className="border-l-4 border-blue-500 pl-4">
                                    <h3 className="text-xl font-semibold mb-3">Male Sex Toys</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Male Masturbators & Strokers</li>
                                        <li>Pussy & Anal Masturbators</li>
                                        <li>Prostate Massagers (P-Spot)</li>
                                        <li>Sex Dolls & Torsos</li>
                                        <li>Penis Rings & Extensions</li>
                                    </ul>
                                </div>

                                {/* 通用玩具 */}
                                <div className="border-l-4 border-purple-500 pl-4">
                                    <h3 className="text-xl font-semibold mb-3">Anal & Speciality Toys</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Anal Beads & Plugs</li>
                                        <li>Butt Plugs (Various Sizes)</li>
                                        <li>Tail Plugs & Fantasy Toys</li>
                                        <li>BDSM Gear & Accessories</li>
                                        <li>Lubricants & Care Products</li>
                                    </ul>
                                </div>

                                {/* 情趣内衣 */}
                                <div className="border-l-4 border-red-500 pl-4">
                                    <h3 className="text-xl font-semibold mb-3">Lingerie & Apparel</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Schoolgirl Lingerie Sets</li>
                                        <li>Roleplay Costumes</li>
                                        <li>Babydolls & Chemises</li>
                                        <li>Corsets & Bustiers</li>
                                        <li>Stockings & Accessories</li>
                                    </ul>
                                </div>

                                {/* 畅销产品 */}
                                <div className="border-l-4 border-green-500 pl-4">
                                    <h3 className="text-xl font-semibold mb-3">Best Sellers</h3>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Top Rated Vibrators</li>
                                        <li>Premium Masturbators</li>
                                        <li>Advanced Massagers</li>
                                        <li>Discreet Toys</li>
                                        <li>Couples Products</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        {/* 批发流程 */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Wholesale Ordering Process</h2>
                            <div className="grid md:grid-cols-4 gap-4">
                                <div className="text-center p-4 bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">1</div>
                                    <h3 className="font-semibold mb-2">Apply for Account</h3>
                                    <p className="text-sm">Complete wholesale application with business details</p>
                                </div>
                                <div className="text-center p-4 bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">2</div>
                                    <h3 className="font-semibold mb-2">Get Price List</h3>
                                    <p className="text-sm">Receive wholesale catalog with volume pricing</p>
                                </div>
                                <div className="text-center p-4 bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">3</div>
                                    <h3 className="font-semibold mb-2">Place Order</h3>
                                    <p className="text-sm">Minimum order: $500 for new wholesale partners</p>
                                </div>
                                <div className="text-center p-4 bg-gray-100 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2">4</div>
                                    <h3 className="font-semibold mb-2">Shipping & Support</h3>
                                    <p className="text-sm">Dedicated account manager for ongoing support</p>
                                </div>
                            </div>
                        </section>

                        {/* 合作优势 */}
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Partnership Benefits</h2>
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                                <ul className="grid md:grid-cols-2 gap-4">
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Exclusive territory protection for distributors</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Marketing materials and product images</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Drop shipping services available</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Regular new product introductions</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Competitive MOQ and flexible terms</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span>Quality warranty and after-sales support</span>
                                    </li>
                                </ul>
                            </div>
                        </section>

                        {/* 联系表单 */}
                        <section className="bg-gray-100 p-8 rounded-lg">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">Request Wholesale Information</h2>
                            <form className="max-w-2xl mx-auto space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name *</label>
                                        <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                        <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                        <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Type *</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md" required>
                                        <option value="">Select Business Type</option>
                                        <option value="retail">Retail Store</option>
                                        <option value="online">Online Store</option>
                                        <option value="distributor">Distributor</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Products of Interest</label>
                                    <textarea className="w-full px-3 py-2 border border-gray-300 rounded-md" rows={3}
                                              placeholder="Please specify which product categories you're interested in..."></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Estimated Monthly Order Volume</label>
                                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                                        <option value="">Select Volume</option>
                                        <option value="500-1000">$500 - $1,000</option>
                                        <option value="1000-5000">$1,000 - $5,000</option>
                                        <option value="5000-10000">$5,000 - $10,000</option>
                                        <option value="10000+">$10,000+</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition duration-200">
                                    Request Wholesale Pricing
                                </button>
                            </form>
                        </section>

                        {/* 联系信息 */}
                        <section className="text-center border-t pt-8">
                            <h3 className="text-xl font-semibold mb-4">Wholesale Department Contact</h3>
                            <div className="grid md:grid-cols-3 gap-6 text-sm">
                                <div>
                                    <h4 className="font-semibold mb-1">Email</h4>
                                    <p>wholesale@mythtoy.com</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Phone</h4>
                                    <p>+1 (555) 123-WHOLESALE</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold mb-1">Business Hours</h4>
                                    <p>Mon-Fri: 9AM-6PM EST</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}