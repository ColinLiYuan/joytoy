// app/blog/page.tsx
import { Metadata } from 'next';
import Link from 'next/link';
import Pagination from '@/components/common/pagination';
import Breadcrumb from '@/components/common/breadcrumb';
import { blogServiceServer } from '@/services/servers/blog-service-server';
import { BlogListResponse } from '@/types/site/blog';
import { ArrowUpRight } from 'lucide-react'; // 更换了一个更“艺术”的箭头

// --- 1. 精选的高端艺术图 (替换原有图片) ---
// 这些图片都是 Unsplash 上经过筛选的：抽象、纹理、丝绸、自然光
const AESTHETIC_IMAGES = [
    "https://images.unsplash.com/photo-1507919909716-c8262e491cde?auto=format&fit=crop&q=80&w=800", // 丝绸/波纹
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80&w=800", // 极简光影
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?auto=format&fit=crop&q=80&w=800", // 柔和织物
    "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?auto=format&fit=crop&q=80&w=800", // 抽象曲线
    "https://images.unsplash.com/photo-1499244571941-37a279d0ccb9?auto=format&fit=crop&q=80&w=800", // 极简风景
    "https://images.unsplash.com/photo-1605218427306-635ba2439715?auto=format&fit=crop&q=80&w=800", // 艺术雕塑感
];

// ... Metadata 和 GenerateStructuredData 代码保持不变 ...

export default async function BlogList({ searchParams }: PageProps) {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '0', 10);
    const currentPage = isNaN(page) ? 0 : page;

    const breadcrumbs = [
        { name: 'Home', path: '/' },
        { name: 'Journal', path: null } // 改名为 "Journal" 更高级
    ];

    try {
        const response: BlogListResponse = await blogServiceServer.list(currentPage, 12);
        const posts = response.content || [];

        return (
            <div className="min-h-screen bg-white w-full">

                {/* Header Section - 更加留白 */}
                <div className="pt-24 pb-16 md:pt-32 md:pb-24 px-6 text-center border-b border-gray-50">
                    <span className="text-[#C5A059] text-xs font-bold tracking-[0.25em] uppercase mb-4 block">
                        The Editorial
                    </span>
                    <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-8 tracking-tight">
                        Pleasure & <i className="font-light text-gray-400">Wellness</i>
                    </h1>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed font-light font-sans">
                        Explorations in intimacy, education, and the art of living well.
                    </p>
                </div>

                <div className="container mx-auto px-6 max-w-7xl py-16">

                    {/* Breadcrumb - 极简 */}
                    <div className="mb-12 flex justify-center md:justify-start">
                        <Breadcrumb items={breadcrumbs} showLastItem={true} />
                    </div>

                    {/* Blog Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16 mb-24">
                        {posts.length > 0 ? (
                            posts.map((post, index) => {
                                // 强制使用精选图，实现“全部换掉”的效果
                                const artImage = AESTHETIC_IMAGES[index % AESTHETIC_IMAGES.length];

                                return (
                                    <article key={post.id} className="group flex flex-col cursor-pointer">

                                        {/* Image: 16:9 -> 4:5 (更像杂志) */}
                                        <Link href={`/blog/${post.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-[#F5F5F7] mb-6">
                                            <img
                                                src={artImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
                                                loading="lazy"
                                            />
                                        </Link>

                                        {/* Content */}
                                        <div className="flex flex-col flex-grow">
                                            {/* Meta */}
                                            <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-3 font-sans">
                                                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}</span>
                                                <span className="w-8 h-[1px] bg-gray-200"></span>
                                            </div>

                                            {/* Title: Serif & Larger */}
                                            <Link href={`/blog/${post.slug}`} className="block mb-3">
                                                <h2 className="text-3xl font-serif text-[#1A1A1A] group-hover:text-[#C5A059] transition-colors leading-[1.1]">
                                                    {post.title}
                                                </h2>
                                            </Link>

                                            {/* Summary */}
                                            <p className="text-gray-500 text-sm font-light leading-relaxed mb-6 line-clamp-3">
                                                {post.summary || post.content.substring(0, 120)}...
                                            </p>

                                            {/* Read More Link */}
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                className="mt-auto inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest text-[#1A1A1A] border-b border-transparent group-hover:border-[#C5A059] group-hover:text-[#C5A059] transition-all pb-0.5 w-max"
                                            >
                                                Read Story <ArrowUpRight size={14} />
                                            </Link>
                                        </div>
                                    </article>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-serif text-xl italic">No stories found.</p>
                            </div>
                        )}
                    </div>

                    {/* Pagination */}
                    {response.totalPages > 1 && (
                        <div className="flex justify-center border-t border-gray-100 pt-12">
                            <Pagination
                                currentPage={response.currentPage || currentPage}
                                totalPages={response.totalPages || 0}
                            />
                        </div>
                    )}
                </div>
            </div>
        );
    } catch (error) {
        // Error handling...
        return null;
    }
}