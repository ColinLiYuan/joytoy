// app/age-verification/route.ts
export default function AgeVerification() {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-2xl w-full">
                <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Age Verification</h1>

                    <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
                        <section className="text-center">
                            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <p className="text-lg text-gray-700 mb-4">
                                To access MythToy, you must be at least <strong>18 years old</strong> or the legal age in your country.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Why We Verify Age</h2>
                            <p>MythToy sells collectible products that may contain mature themes or be subject to age restrictions in certain jurisdictions. We are committed to responsible selling and compliance with international regulations.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Verify Your Age</h2>
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold">I am 18 years or older</p>
                                                <p className="text-sm text-gray-600">Enter the site</p>
                                            </div>
                                        </div>
                                        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold">
                                            Enter
                                        </button>
                                    </div>

                                    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                                                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-semibold">I am under 18 years</p>
                                                <p className="text-sm text-gray-600">Exit the site</p>
                                            </div>
                                        </div>
                                        <button className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition duration-200 font-semibold">
                                            Exit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Age Requirements by Region</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border border-gray-300">
                                    <thead>
                                    <tr className="bg-gray-100">
                                        <th className="border border-gray-300 px-4 py-2 text-left">Region</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Minimum Age</th>
                                        <th className="border border-gray-300 px-4 py-2 text-left">Legal Basis</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">United States</td>
                                        <td className="border border-gray-300 px-4 py-2">18+</td>
                                        <td className="border border-gray-300 px-4 py-2">State regulations</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">European Union</td>
                                        <td className="border border-gray-300 px-4 py-2">18+</td>
                                        <td className="border border-gray-300 px-4 py-2">GDPR compliance</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">United Kingdom</td>
                                        <td className="border border-gray-300 px-4 py-2">18+</td>
                                        <td className="border border-gray-300 px-4 py-2">UK GDPR</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Canada</td>
                                        <td className="border border-gray-300 px-4 py-2">18+/19+</td>
                                        <td className="border border-gray-300 px-4 py-2">Provincial laws</td>
                                    </tr>
                                    <tr>
                                        <td className="border border-gray-300 px-4 py-2 font-medium">Australia</td>
                                        <td className="border border-gray-300 px-4 py-2">18+</td>
                                        <td className="border border-gray-300 px-4 py-2">National standards</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Our Compliance</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Legal Requirements</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        <li>Digital Age Verification Compliance</li>
                                        <li>Children's Online Privacy Protection</li>
                                        <li>International trade regulations</li>
                                        <li>Consumer protection laws</li>
                                    </ul>
                                </div>
                                <div className="border border-gray-200 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold mb-3">Verification Methods</h3>
                                    <ul className="list-disc pl-5 space-y-2 text-sm">
                                        <li>Self-declaration age gate</li>
                                        <li>Credit card verification (optional)</li>
                                        <li>Document verification for high-value orders</li>
                                        <li>Persistent session cookies</li>
                                    </ul>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Notice</h2>
                            <p>Your age verification data is handled in accordance with our Privacy Policy. We do not store sensitive personal information from age verification unless required by law.</p>
                        </section>

                        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                            <p className="text-sm text-gray-600 text-center">
                                By entering this site, you confirm you are of legal age and agree to our Terms of Service and Privacy Policy.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 
