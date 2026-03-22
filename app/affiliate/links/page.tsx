// app/affiliate/links/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/authContext'
import { Link as LinkIcon, Copy, Info, MousePointerClick, Calendar, BarChart3, AlertCircle } from 'lucide-react'

export default function AffiliateLinksPage() {
    // 从你的 authContext 拿到用户信息和客户端状态
    const { userInfo, isClient } = useAuth();
    const [copied, setCopied] = useState(false);

    const baseUrl = "https://mythtoy.com";

    // 1. 获取 affiliateId
    // 2. 如果没拿到显示 "PENDING"
    // 3. 按照要求强制转为大写 .toUpperCase()
    const affiliateId = (userInfo?.affiliateId || "PENDING").toUpperCase();

    const defaultLink = `${baseUrl}?aff=${affiliateId}`;

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
                            {/* 确保客户端加载后再显示 ID，防止 Hydration 报错 */}
                            {isClient ? defaultLink : "Loading..."}
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
                                    <td className="py-4 font-mono font-bold text-indigo-600">aff</td>
                                    <td className="py-4 font-bold text-red-500 text-xs">YES</td>
                                    <td className="py-4 text-gray-500">Your Unique Affiliate ID: <span className="text-black font-bold font-mono">{isClient ? affiliateId : "..."}</span></td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">source</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic">Traffic source (e.g., <code className="bg-gray-100 px-1">tiktok</code>, <code className="bg-gray-100 px-1">instagram</code>)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">campaign</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic">Marketing event (e.g., <code className="bg-gray-100 px-1">summer_sale</code>)</td>
                                </tr>
                                <tr>
                                    <td className="py-4 font-mono font-bold text-gray-700">content</td>
                                    <td className="py-4 text-gray-400 text-xs">Optional</td>
                                    <td className="py-4 text-gray-500 text-xs italic">Specific post identifier (e.g., <code className="bg-gray-100 px-1">video_01</code>)</td>
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
                                    Maximize conversions by linking to any product page. Simply add <code className="bg-white/50 px-1 font-bold">?aff={isClient ? affiliateId : "YOUR_ID"}</code> to the end of any URL.
                                </p>
                                <div className="space-y-3">
                                    <div className="text-xs bg-white p-3 rounded-lg border border-indigo-200">
                                        <span className="text-gray-400 uppercase font-bold text-[10px]">Product Page:</span><br/>
                                        <span className="text-indigo-600 font-mono">https://mythtoy.com/toys/female-sex-toys/clit-vibrators/the-arc<b className="text-red-500">?aff={isClient ? affiliateId : "YOUR_ID"}</b></span>
                                    </div>
                                    <div className="text-xs bg-white p-3 rounded-lg border border-indigo-200">
                                        <span className="text-gray-400 uppercase font-bold text-[10px]">Collection Page:</span><br/>
                                        <span className="text-indigo-600 font-mono">https://mythtoy.com/collections/best-sellers<b className="text-red-500">?aff={isClient ? affiliateId : "YOUR_ID"}</b></span>
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
                                <p className="text-xs mt-1">Customers clicking your link are tracked for 30 days. You get paid if they buy anytime during this window.</p>
                            </li>
                            <li>
                                <p className="font-bold text-gray-900">Tracking Tags</p>
                                <p className="text-xs mt-1">Add <code className="bg-gray-100 font-mono text-[10px]">&source=tiktok</code> to track specific channel performance.</p>
                            </li>
                            <li>
                                <p className="font-bold text-gray-900">Shorten Links</p>
                                <p className="text-xs mt-1">Use link shorteners for a cleaner look in Social Media bios.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}