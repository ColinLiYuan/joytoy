'use client';

import { useState } from 'react';
import { Ruler, Coffee, Book, Package, Key, Footprints, Info } from 'lucide-react';

export default function FinalDesignV4() {
    const [showDims, setShowDims] = useState(true);

    // 颜色常量
    const warmWhite = "bg-[#F7F5F0]";
    const woodColor = "bg-[#E6CDB2]";

    // 标签样式
    const centerLabel = "absolute inset-0 flex flex-col items-center justify-center text-[10px] text-stone-400 font-bold z-10 pointer-events-none";
    const heightLabel = "absolute right-1 bottom-1 text-[9px] text-blue-600 font-bold bg-white/90 px-1 rounded z-20";

    return (
        <div className="min-h-screen bg-stone-50 p-2 md:p-6 font-sans text-stone-800">
            <div className="max-w-[1400px] mx-auto">
                <header className="mb-4 border-b pb-2 flex justify-between items-end">
                    <div>
                        <h1 className="text-xl font-bold text-stone-800">8米全屋定制 · 施工定稿图</h1>
                        <p className="text-xs text-stone-500 mt-1">
                            玄关地柜已改：左纯门板 | 右上抽屉+下双层开放格
                        </p>
                    </div>
                    <button
                        onClick={() => setShowDims(!showDims)}
                        className="flex items-center gap-2 bg-white border px-3 py-1 rounded shadow-sm text-xs hover:bg-stone-200 transition"
                    >
                        <Ruler size={14}/> {showDims ? '隐藏数据' : '显示数据'}
                    </button>
                </header>

                <div className="bg-white p-4 md:p-8 rounded-xl shadow-xl border border-stone-200 overflow-x-auto">

                    {/* 顶部区域标注 */}
                    <div className="min-w-[1200px] flex justify-between mb-1 px-1 text-xs text-stone-400 font-mono text-center font-bold">
                        <span className="flex-1 border-b border-stone-200 pb-1">左高柜 1000</span>
                        <span className="flex-[2] border-b border-amber-200 pb-1 text-amber-700">书架区 2000</span>
                        <span className="flex-1 border-b border-stone-200 pb-1">右高柜 1000</span>
                        <span className="flex-[2] border-b border-blue-200 pb-1 text-blue-700">水吧区 2000</span>
                        <span className="flex-[2] border-b border-stone-200 pb-1">玄关区 2000</span>
                    </div>

                    <div className="flex min-w-[1200px] h-[320px] border-b-4 border-stone-300 relative mt-2">

                        {/* 左侧标尺 */}
                        <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-right pr-2 border-r border-stone-300 py-1 text-[9px] text-stone-400 font-mono">
                            <span>2600</span>
                            <span>2100</span>
                            <span>1500</span>
                            <span>900</span>
                            <span>500</span>
                            <span>0</span>
                        </div>

                        {/* 1. 左高柜 (1m) */}
                        <div className="flex-1 h-full border-r border-stone-100 p-[1px] flex flex-col">
                            <div className="flex h-full gap-[1px] relative">
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={centerLabel}>
                                    <span>杂物柜</span>
                                    <span className="text-[9px] font-normal opacity-50">对开门</span>
                                </div>
                                {showDims && <span className={heightLabel}>H:2600</span>}
                            </div>
                        </div>

                        {/* 2. 书架区 (2m) */}
                        <div className="flex-[2] h-full border-r border-stone-100 p-[1px] flex flex-col bg-stone-50/50">
                            {/* 上：开放格 */}
                            <div className={`h-[80.7%] flex gap-[1px] mb-[1px]`}>
                                {[1, 2, 3].map((col) => (
                                    <div key={col} className={`flex-1 ${woodColor} flex flex-col gap-[1px] shadow-inner`}>
                                        <div className="flex-1 border-b border-black/5"></div>
                                        <div className="flex-1 border-b border-black/5"></div>
                                        <div className="flex-1 border-b border-black/5 flex items-center justify-center">
                                            {col === 2 && <Book className="opacity-20 w-8 h-8"/>}
                                        </div>
                                        <div className="flex-1"></div>
                                    </div>
                                ))}
                            </div>
                            {/* 下：书架地柜 */}
                            <div className="flex-1 flex gap-[1px] relative">
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={centerLabel}>3扇按弹门</div>
                                {showDims && <span className={heightLabel}>H:500</span>}
                            </div>
                        </div>

                        {/* 3. 右高柜 (1m) */}
                        <div className="flex-1 h-full border-r border-stone-100 p-[1px] flex flex-col">
                            <div className="flex h-full gap-[1px] relative">
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={centerLabel}>
                                    <span>杂物柜</span>
                                    <span className="text-[9px] font-normal opacity-50">对开门</span>
                                </div>
                                {showDims && <span className={heightLabel}>H:2600</span>}
                            </div>
                        </div>

                        {/* 4. 水吧区 (2m) */}
                        <div className="flex-[2] h-full border-r border-stone-100 p-[1px] flex flex-col relative">
                            {/* 上：吊柜 */}
                            <div className="h-[42.3%] w-full flex gap-[1px] relative mb-[1px]">
                                <div className="absolute -left-[3px] h-full w-[3px] bg-stone-300 z-30" title="侧封板"></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                <div className={centerLabel}>内退吊柜 (4扇)</div>
                                {showDims && <span className={heightLabel}>H:1100</span>}
                            </div>
                            {/* 中：镂空 */}
                            <div className={`h-[23%] ${woodColor} relative shadow-inner flex flex-col justify-end p-2 mb-[1px]`}>
                                <div className="flex justify-center items-center h-full gap-2 opacity-50"><Coffee size={18}/></div>
                                {showDims && <span className={heightLabel}>H:600</span>}
                            </div>
                            {/* 下：地柜 */}
                            <div className="h-[34.6%] flex gap-[1px] relative">
                                {/* 左：3层大抽屉 */}
                                <div className="w-1/2 flex flex-col gap-[1px] relative">
                                    <div className={`flex-1 ${warmWhite} border border-stone-200 flex items-center justify-center text-[9px] text-stone-400`}>抽屉</div>
                                    <div className={`flex-1 ${warmWhite} border border-stone-200 flex items-center justify-center text-[9px] text-stone-400`}>抽屉</div>
                                    <div className={`flex-1 ${warmWhite} border border-stone-200 flex items-center justify-center text-[9px] text-stone-400`}>抽屉</div>
                                </div>
                                {/* 右：双开门 */}
                                <div className="w-1/2 flex gap-[1px] relative">
                                    <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                    <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[9px] text-stone-400 pointer-events-none">囤货门</div>
                                </div>
                                {showDims && <span className={heightLabel}>H:900</span>}
                            </div>
                        </div>

                        {/* 5. 玄关区 (2m) - 重点修改 */}
                        <div className="flex-[2] h-full p-[1px] flex flex-col bg-blue-50/10">
                            <div className="flex h-full gap-[1px]">
                                {/* 左侧：1米 玄关柜 */}
                                <div className="w-1/2 flex flex-col gap-[1px] h-full relative">
                                    {/* 上：吊柜 */}
                                    <div className={`h-[42.3%] flex gap-[1px] relative`}>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={centerLabel}>吊柜</div>
                                    </div>
                                    {/* 中：镂空 */}
                                    <div className={`h-[23%] ${woodColor} relative shadow-inner flex flex-col items-center justify-center`}>
                                        <div className="flex gap-2 opacity-50"><Key size={14}/> <Package size={14}/></div>
                                        {showDims && <span className={heightLabel}>H:600</span>}
                                    </div>
                                    {/* 下：鞋柜 (去掉了小抽屉，只有门) */}
                                    <div className={`h-[34.6%] flex gap-[1px] relative`}>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={`flex-1 ${warmWhite} border border-stone-200`}></div>
                                        <div className={centerLabel}>纯门板 (鞋柜)</div>
                                        {showDims && <span className={heightLabel}>H:900</span>}
                                    </div>
                                </div>

                                {/* 右侧：1米 换鞋区 - 重点修改 */}
                                <div className="w-1/2 flex flex-col h-full relative">
                                    {/* 挂衣背板 (H:2000+) */}
                                    <div className={`flex-1 ${warmWhite} border border-stone-200 relative`}>
                                        <div className="absolute top-10 left-0 w-full flex justify-center gap-4">
                                            <div className="w-1 h-3 bg-stone-400 rounded-full"></div>
                                            <div className="w-1 h-3 bg-stone-400 rounded-full"></div>
                                        </div>
                                        <div className={centerLabel}>挂衣区 / 镜子</div>
                                    </div>

                                    {/* 底部功能区 (总H:450左右) */}
                                    <div className="h-[17%] flex flex-col gap-[1px] relative">
                                        {/* 上层：抽屉 (H:150) */}
                                        <div className={`h-1/3 ${woodColor} border border-stone-300 flex items-center justify-center text-[9px] relative`}>
                                            <span>杂物抽屉</span>
                                        </div>

                                        {/* 下层：双层开放格 (无门板) */}
                                        <div className={`h-2/3 bg-white border border-stone-200 flex flex-col`}>
                                            <div className="flex-1 border-b border-stone-100 flex items-center justify-center">
                                                <span className="text-[8px] text-stone-400">开放格1 (常用鞋)</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center">
                                                <span className="text-[8px] text-stone-400">开放格2 (常用鞋)</span>
                                                <Footprints size={12} className="text-stone-300 ml-1"/>
                                            </div>
                                        </div>
                                        {showDims && <span className={heightLabel}>座高H:450</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    {/* 地面 */}
                    <div className="w-full h-2 bg-stone-200 mt-[1px]"></div>
                </div>

                {/* ================= 免拉手工艺说明 (Footer) ================= */}
                <div className="mt-4 bg-stone-800 text-stone-200 p-4 rounded-lg shadow-md">
                    <h3 className="text-sm font-bold flex items-center gap-2 mb-3 border-b border-stone-600 pb-2">
                        <Info size={16} className="text-yellow-400"/>
                        全屋免拉手工艺说明 (Reminders for Factory)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                        <div className="space-y-1">
                            <span className="text-yellow-400 font-bold block">1. 所有吊柜 (Upper Cabinets)</span>
                            <p>工艺：<b>门板下挂 10mm</b> (Bottom Overhang)</p>
                            <p>位置：水吧吊柜、玄关吊柜</p>
                            <p>说明：底板平齐，门板盖住底板并向下延伸，手指扣开。</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-yellow-400 font-bold block">2. 所有地柜/抽屉 (Base/Drawers)</span>
                            <p>工艺：<b>顶板内退 30mm</b> (Top Recess)</p>
                            <p>位置：水吧下柜、书架下柜、玄关鞋柜</p>
                            <p>说明：第一层抽屉/门板上方留空腔，手指直接伸入拉开。禁止使用反弹器。</p>
                        </div>
                        <div className="space-y-1">
                            <span className="text-yellow-400 font-bold block">3. 高柜 (Tall Cabinets)</span>
                            <p>工艺：<b>侧边内嵌L型槽 / 侧封板留缝</b></p>
                            <p>位置：左右两侧高柜</p>
                            <p>说明：在门板侧边预留手指位，或安装隐形拉手条。</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}