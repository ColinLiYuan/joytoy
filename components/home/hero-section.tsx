// components/home/hero-section.tsx
import Link from 'next/link';

export default function HeroSection() {
    return (
        // 1. 最外层：负责全屏背景色 (红色)，确保 w-full
        <section className="relative w-full bg-[#b62337] overflow-hidden">

            {/* 背景装饰层 (绝对定位) */}
            <div className="absolute inset-0 pointer-events-none">
                {/* 渐变叠加 */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#b62337] via-[#a51e32] to-[#941a2d]"></div>
                {/* 光晕 */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#d12a42]/30 via-transparent to-transparent"></div>
                {/* 顶部高光 */}
                <div className="absolute top-0 left-0 right-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent"></div>
                {/* 纹理 */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                        backgroundSize: '60px 60px'
                    }}
                ></div>
            </div>

            {/* 2. 内容容器：负责居中和宽度限制 */}
            <div className="container relative mx-auto px-4 max-w-7xl z-10">
                <div className="hero-content w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center text-center py-12 md:py-20">
                    <div className="max-w-3xl mx-auto space-y-6">

                        {/* 优惠码标签 */}
                        <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-2">
                            <span className="text-white text-xs md:text-sm font-bold tracking-widest uppercase">
                                Code: MYTH20
                            </span>
                        </div>

                        {/* 主标题 */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-2 font-['Playfair_Display'] drop-shadow-lg leading-tight">
                            20% OFF
                        </h1>

                        {/* 副标题 */}
                        <p className="text-xl md:text-2xl text-white/90 font-medium font-['Playfair_Display']">
                            Your First Order + Free Shipping
                        </p>

                        {/* 按钮区域 */}
                        <div className="pt-6">
                            <Link
                                href="/collections/all"
                                className="inline-block bg-black text-white font-bold py-4 px-12 rounded-full transition-all duration-300 hover:bg-gray-900 hover:scale-105 hover:shadow-2xl text-sm md:text-base tracking-widest uppercase"
                            >
                                Shop Now
                            </Link>
                        </div>

                        <p className="text-white/60 text-xs mt-4">
                            *Discrete packaging guaranteed on all orders
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}