'use client';

import { useState } from 'react';
import { Ruler, Book, Sun, Moon, Shirt, LayoutTemplate, Info } from 'lucide-react';

export default function EldestRoomDesign() {
    const [view, setView] = useState<'plan' | 'elevation'>('plan');
    const [showDims, setShowDims] = useState(true);

    // 颜色配置
    const warmWhite = "bg-[#F7F5F0]";
    const woodColor = "bg-[#E6CDB2]";
    const bedColor = "bg-blue-50";

    return (
        <div className="min-h-screen bg-stone-50 p-2 md:p-6 font-sans text-stone-800">
            <div className="max-w-[1000px] mx-auto">
                <header className="mb-6 border-b pb-4">
                    <h1 className="text-xl font-bold text-stone-800">7岁大宝房 · 布局与定制方案</h1>
                    <p className="text-xs text-stone-500 mt-1">
                        核心需求：床靠窗 | 书桌衣柜一体 | 修正照片中的不合理设计
                    </p>
                </header>

                {/* 视图切换 */}
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        onClick={() => setView('plan')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${view === 'plan' ? 'bg-stone-800 text-white' : 'bg-white border'}`}
                    >
                        <LayoutTemplate size={16}/> 俯视布局图
                    </button>
                    <button
                        onClick={() => setView('elevation')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm transition ${view === 'elevation' ? 'bg-stone-800 text-white' : 'bg-white border'}`}
                    >
                        <Ruler size={16}/> 定制立面图
                    </button>
                </div>

                {/* ==================== 1. 俯视图 (Layout) ==================== */}
                {view === 'plan' && (
                    <div className="bg-white p-8 rounded-xl shadow-lg border border-stone-200 flex flex-col items-center">
                        <div className="text-sm font-bold text-stone-400 mb-4 self-start">假设房间尺寸：2.6m × 3.0m</div>

                        {/* 房间容器 */}
                        <div className="w-[300px] h-[350px] border-4 border-stone-800 relative bg-stone-100 shadow-inner">

                            {/* 窗户 (Top) */}
                            <div className="absolute -top-1 left-1/4 right-1/4 h-2 bg-blue-200 border-x border-stone-300 z-10 flex justify-center">
                                <span className="text-[8px] text-blue-500 -mt-3">窗户 (Window)</span>
                            </div>

                            {/* 门 (Bottom Right) */}
                            <div className="absolute bottom-0 right-0 w-8 h-12 bg-stone-200 border-l border-t border-dashed border-stone-400 rounded-tl-full origin-bottom-right"></div>
                            <div className="absolute bottom-0 right-8 w-2 h-[2px] bg-stone-800"></div>

                            {/* --- 1. 床 (靠窗) --- */}
                            <div className={`absolute top-2 right-2 w-[130px] h-[220px] ${bedColor} border border-blue-200 rounded-sm flex flex-col items-center justify-center shadow-sm`}>
                                <div className="w-[80%] h-[15%] bg-white/50 rounded-sm mb-2"></div> {/* 枕头 */}
                                <span className="text-[10px] text-blue-400 font-bold">1.2m 成品床</span>
                                <span className="text-[8px] text-stone-400">(靠窗放置)</span>
                            </div>

                            {/* --- 2. 书桌 (紧挨床头，靠墙) --- */}
                            <div className={`absolute top-[100px] left-0 w-[100px] h-[50px] ${woodColor} border border-stone-300 flex items-center justify-center`}>
                                <span className="text-[9px] font-bold text-amber-800">书桌</span>
                            </div>
                            <div className="absolute top-[115px] left-[105px] text-[8px] text-stone-400">椅子</div>

                            {/* --- 3. 衣柜 (接书桌，靠门) --- */}
                            <div className={`absolute top-[150px] left-0 w-[120px] h-[60px] ${warmWhite} border border-stone-300 flex items-center justify-center`}>
                                <span className="text-[9px] text-stone-500">衣柜</span>
                            </div>

                            {/* 动线箭头 */}
                            <div className="absolute bottom-10 right-10 top-1/2 left-1/2 border-t-2 border-l-2 border-stone-300/50 rounded-tl-lg pointer-events-none"></div>
                        </div>

                        <div className="mt-6 bg-blue-50 p-4 rounded text-xs text-stone-600 w-full max-w-[400px]">
                            <strong>布局逻辑：</strong>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>床靠窗放（采光好，避开门冲）。</li>
                                <li>书桌安排在床和衣柜之间，或者衣柜侧面延伸出来。</li>
                                <li><strong>重点：</strong> 7岁孩子书桌深度至少要 <strong>55-60cm</strong>，衣柜也是 55-60cm，所以做成<strong>“一字型排开”</strong>最顺。</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* ==================== 2. 立面图 (Elevation) ==================== */}
                {view === 'elevation' && (
                    <div className="bg-white p-6 rounded-xl shadow-lg border border-stone-200 overflow-x-auto">
                        <div className="min-w-[800px]">
                            {/* 顶部标尺 */}
                            <div className="flex justify-between mb-2 px-1 text-xs text-stone-400 font-mono text-center">
                                <span className="w-[60%] border-b border-stone-200 pb-1">衣柜区 (约1.4m)</span>
                                <span className="w-[40%] border-b border-amber-200 pb-1 text-amber-700">书桌区 (约1.2m)</span>
                            </div>

                            {/* 柜体主体 */}
                            <div className="flex w-full h-[300px] border-b-4 border-stone-300 relative mt-2">
                                {/* 左侧高度 */}
                                <div className="absolute -left-8 top-0 h-full flex flex-col justify-between text-[9px] text-stone-400 text-right pr-2">
                                    <span>2.6m</span><span>0.75m</span><span>0</span>
                                </div>

                                {/* === 左：衣柜区 === */}
                                <div className="w-[60%] h-full flex flex-col p-[1px] relative border-r border-stone-100">
                                    {/* 顶柜 */}
                                    <div className="h-[20%] flex gap-[1px]">
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        {showDims && <div className={centerLabel}>被褥囤货</div>}
                                    </div>
                                    {/* 主衣柜 */}
                                    <div className="flex-1 flex gap-[1px] mt-[1px]">
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        {/* 最右侧一扇门做开放格 (面向书桌) */}
                                        <div className={`flex-1 ${woodColor} border border-stone-200 flex flex-col shadow-inner`}>
                                            <div className="flex-1 border-b border-black/5"></div>
                                            <div className="flex-1 border-b border-black/5 flex items-center justify-center">
                                                <Book size={16} className="opacity-30"/>
                                            </div>
                                            <div className="flex-1 border-b border-black/5"></div>
                                            <div className="flex-1 border-b border-black/5"></div>
                                            <div className="h-[30%] bg-white border-t border-stone-200 flex items-end justify-center pb-1">
                                                <span className="text-[8px] text-stone-400">书桌延伸面</span>
                                            </div>
                                        </div>
                                    </div>
                                    {/* 标注 */}
                                    <div className="absolute bottom-4 left-10 bg-white/80 px-2 py-1 text-[10px] text-stone-600 rounded border">
                                        封闭衣柜 (放校服/常穿)
                                    </div>
                                    {/* 侧面开放格说明 */}
                                    <div className="absolute top-1/2 right-2 w-20 text-[9px] text-amber-800 bg-white/90 p-1 border border-amber-200 rounded text-center">
                                        侧向拿取书柜<br/>(坐在椅子上拿)
                                    </div>
                                </div>

                                {/* === 右：书桌区 (靠窗) === */}
                                <div className="w-[40%] h-full flex flex-col p-[1px] relative bg-blue-50/10">
                                    {/* 上部：吊柜书架 */}
                                    <div className={`h-[40%] ${warmWhite} border border-stone-200 relative mb-[1px]`}>
                                        <div className="absolute bottom-0 w-full h-[2px] bg-yellow-400 opacity-50"></div> {/* 灯带 */}
                                        <div className={centerLabel}>
                                            <span>吊柜书架</span>
                                            <span className="text-[8px] font-normal">放不常用的书</span>
                                        </div>
                                    </div>

                                    {/* 中部：洞洞板区域 */}
                                    <div className="h-[30%] flex items-center justify-center bg-stone-100 border border-stone-200 border-dashed m-1 rounded">
                                        <span className="text-[9px] text-stone-400">洞洞板/磁性板 (日程表)</span>
                                    </div>

                                    {/* 下部：书桌台面 */}
                                    <div className={`flex-1 ${woodColor} border-t-4 border-stone-300 relative flex items-end justify-center pb-2`}>
                                        <span className="text-[10px] text-stone-600 font-bold">大书桌 (1.2m)</span>
                                        <div className="absolute -right-4 bottom-10 flex flex-col items-center">
                                            <Sun size={20} className="text-orange-400"/>
                                            <span className="text-[8px] text-orange-400">窗户光线</span>
                                        </div>
                                    </div>

                                    {/* 抽屉 */}
                                    <div className="absolute bottom-0 left-0 right-0 h-[50px] flex gap-1 px-4">
                                        <div className="flex-1 bg-white border border-stone-300 rounded-b text-[8px] flex items-center justify-center">文具抽</div>
                                        <div className="flex-1 bg-white border border-stone-300 rounded-b text-[8px] flex items-center justify-center">文具抽</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 避坑指南 */}
                        <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-stone-600">
                            <div className="bg-red-50 p-3 rounded border border-red-100">
                                <strong className="text-red-700 block mb-1">❌ 你的照片里有什么问题？</strong>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>书桌太浅：</strong> 照片里的桌子看起来只有40cm深，写作业根本铺不开卷子。</li>
                                    <li><strong>侧柜太深：</strong> 照片里侧面格子太深了，拿东西像掏洞。我的设计里，侧面是专门给书桌服务的<b>薄书架</b>。</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 p-3 rounded border border-green-100">
                                <strong className="text-green-700 block mb-1">✅ 改进后的亮点</strong>
                                <ul className="list-disc list-inside space-y-1">
                                    <li><strong>黄金取书区：</strong> 衣柜最右侧改成开放格，孩子写作业时，左手直接拿书，不用起身。</li>
                                    <li><strong>台面加深：</strong> 书桌台面至少做 <b>60cm深</b>，电脑、书本都能放。</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}