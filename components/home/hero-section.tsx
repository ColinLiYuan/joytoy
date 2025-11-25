// components/home/hero-section.tsx
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="hero w-full relative overflow-hidden">
            {/* 背景色容器 - 只在容器内显示红色 */}
            <div className="w-full container mx-auto px-4 max-w-7xl relative overflow-hidden">
                {/* 红色背景只限制在容器内 */}
                <div className="bg-[#b62337] w-full relative overflow-hidden">
                    {/* 深度渐变背景 - 增加层次感 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#b62337] via-[#a51e32] to-[#941a2d]"></div>

                    {/* 中心柔和光晕 */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d12a42]/30 via-transparent to-transparent"></div>

                    {/* 顶部柔和光源 */}
                    <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/8 to-transparent"></div>

                    {/* 微妙的丝绸纹理 */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                            backgroundSize: '300px 300px'
                        }}
                    ></div>

                    {/* 内容区域 */}
                    <div className="hero-content w-full aspect-square sm:aspect-auto sm:min-h-[40vh] mx-auto flex items-center justify-center text-center py-8 sm:py-16 relative z-10">
                        <div className="max-w-2xl mx-auto space-y-4 md:space-y-6">
                            {/* 优惠码 - 突出但不刺眼 */}
                            <span className="text-white/90 text-sm font-medium tracking-wide">
                USE CODE: <span className="font-bold text-white ml-1">MYTH20</span>
              </span>

                            {/* 副标题 - 优雅吸引人 */}
                            <p className="text-base md:text-lg lg:text-xl text-white font-medium tracking-wider uppercase mb-1 md:mb-2 font-['Playfair_Display']">
                                Your First Order?
                            </p>

                            {/* 主标题 - 强烈吸引眼球 */}
                            <h1 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white mb-3 md:mb-4 leading-tight font-['Playfair_Display'] drop-shadow-lg">
                                20% OFF
                            </h1>

                            {/* 促销信息 - 清晰易读 */}
                            <p className="text-lg md:text-xl lg:text-2xl text-white font-medium mb-6 md:mb-8 font-['Playfair_Display']">
                                Free Shipping on $40+
                            </p>

                            {/* CTA 按钮 - 使用 Link 组件 */}
                            <Link
                                href="/collections/all"
                                className="inline-block bg-black hover:bg-gray-900 text-white font-bold py-3 md:py-4 px-10 md:px-12 rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl shadow-lg relative overflow-hidden group text-base md:text-lg min-w-[160px] md:min-w-[180px] font-['Playfair_Display']"
                            >
                                <span className="relative z-10">SHOP NOW</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}