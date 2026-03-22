// app/affiliate/links/page.tsx
'use client'

import { useState } from 'react'
import { Link as LinkIcon, Copy, Info, MousePointerClick, Calendar, BarChart3, HelpCircle, ChevronRight, AlertCircle } from 'lucide-react'

export default function AffiliateLinksPage() {
    // Replace with actual logic to get the logged-in affiliate's ID
    const affiliateId = "MYTH888";
    const baseUrl = "https://mythtoy.com";
    const [copied, setCopied] = useState(false);

    const defaultLink = `${baseUrl}?ref=${affiliateId}`;

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black tracking-tight text-gray-900 uppercase">Affiliate Links</h1>
                <p className="text-gray-500 mt-2">Generate and manage your unique tracking links to earn commissions.</p>
            </div>

            {/* Main Link Card */}
            <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-indigo-500 p-2 rounded-lg">
                            <LinkIcon className="h-5 w-5 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-white">Your Default Shop Link</h2>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 bg-white/5 p-2 rounded-2xl border border-white/10">
                        <code className="flex-1 font-mono text-indigo-300 px-4 py-2 break-all text-sm">
                            {defaultLink}
                        </code>
                        <button
                            onClick={() => copyToClipboard(defaultLink)}
                            className="w-full md:w-auto bg-indigo-500 hover:bg-indigo-400 text-white px-8 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            {copied ? 'COPIED!' : <><Copy className="h-4 w-4" /> COPY LINK</>}
                        </button>
                    </div>

                    <div className="mt-6 flex items-center gap-6 text-sm text-slate-400">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-emerald-400" />
                            <span>30-Day Cookie Period</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-emerald-400" />
                            <span>Real-time Tracking</span>
                        </div>
                    </div>
                </div>
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
            </div>

            {/* Parameters Guide */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gray-900">
                            <Info className="h-5 w-5 text-indigo-600" />
                            Link Parameters Guide
                        </h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-gray-400 border-b border-gray-100 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="pb-4 font-bold">Parameter</th>
                                    <th className="pb-4 font-bold">Required?</th>
                                    <th className="pb-4 font-bold">Description / Usage</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                <tr>
                                    <td className="py-4 font-mono font-bold text-indigo-600">ref</td>
                                    <td className="py-4 font-bold text-red-500 text-xs">YES</td>
                                    <td className="py-4 text-gray-500">Your Unique Affiliate ID. <b>Mandatory</b> to track commissions.</td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">source</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic text-xs italic uppercase italic">Where the traffic comes from (e.g., <code className="bg-gray-100 px-1">tiktok</code>, <code className="bg-gray-100 px-1">instagram</code>, <code className="bg-gray-100 px-1">blog</code>)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">campaign</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic text-xs italic uppercase italic">Specific ad or event name (e.g., <code className="bg-gray-100 px-1">summer_sale</code>)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">content</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic text-xs italic uppercase italic">Identify specific post or banner (e.g., <code className="bg-gray-100 px-1">video_01</code>, <code className="bg-gray-100 px-1">sidebar_banner</code>)</td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* How to use for any page */}
                    <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                        <div className="flex items-start gap-4">
                            <div className="bg-indigo-600 p-2 rounded-lg shrink-0">
                                <MousePointerClick className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-indigo-900 mb-2">Promote ANY Page (Deep Linking)</h3>
                                <p className="text-sm text-indigo-700 leading-relaxed mb-4">
                                    You don't have to just link to the homepage! You can promote specific products or collections by simply adding <code className="bg-white/50 px-1 font-bold">?ref={affiliateId}</code> to the end of any URL on our site.
                                </p>
                                <div className="space-y-3">
                                    <div className="text-xs bg-white p-3 rounded-lg border border-indigo-200">
                                        <span className="text-gray-400">Product Page Example:</span><br/>
                                        <span className="text-indigo-600 font-mono">https://mythtoy.com/collections/all<b className="text-red-500">?ref={affiliateId}</b></span>
                                    </div>
                                    <div className="text-xs bg-white p-3 rounded-lg border border-indigo-200">
                                        <span className="text-gray-400">Collection Page Example:</span><br/>
                                        <span className="text-indigo-600 font-mono">https://mythtoy.com/collections/best-sellers<b className="text-red-500">?ref={affiliateId}</b></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Advice */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-200">
                        <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2 uppercase text-xs tracking-wider">
                            <AlertCircle className="h-4 w-4 text-amber-500" />
                            Pro Tips
                        </h4>
                        <ul className="space-y-4 text-sm text-gray-600">
                            <li>
                                <p className="font-bold text-gray-900">30-Day Cookie</p>
                                <p className="text-xs mt-1">If a customer clicks your link and buys within 30 days, you get the commission. Even if they don't buy immediately!</p>
                            </li>
                            <li>
                                <p className="font-bold text-gray-900">Use Tracking Tags</p>
                                <p className="text-xs mt-1">Add <code className="bg-gray-100 font-mono text-[10px]">&source=tiktok</code> to see which social platform is making you the most money.</p>
                            </li>
                            <li>
                                <p className="font-bold text-gray-900">Shorten Links</p>
                                <p className="text-xs mt-1">Use Bitly or TinyURL to make your long affiliate links look clean in Instagram bios or TikTok descriptions.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}