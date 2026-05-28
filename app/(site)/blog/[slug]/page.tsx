// app/blog/[slug]/page.tsx
import { Metadata } from 'next';
import BlogDetailClient from './BlogDetailClient';
import { BACKEND_CONFIG } from '@/lib/api-config';
import { getAuthor } from '@/lib/constants/authors';
import type { ProductResponse } from '@/types/product';

export interface TocItem {
  id: string;
  text: string;
  level: 2 | 3;
}

function extractToc(content: string): TocItem[] {
  if (!content) return [];
  const items: TocItem[] = [];
  // Markdown headings: ## text / ### text
  for (const m of content.matchAll(/^(#{2,3})\s+(.+)$/gm)) {
    const level = (m[1].length === 2 ? 2 : 3) as 2 | 3;
    const text = m[2].trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    items.push({ id, text, level });
  }
  // HTML headings: <h2>text</h2> / <h3>text</h3> (may contain <strong>/<em>)
  for (const m of content.matchAll(/<h([23])[^>]*>(.+?)<\/h[23]>/gi)) {
    const level = parseInt(m[1]) as 2 | 3;
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    const id = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
    items.push({ id, text, level });
  }
  return items;
}

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

// ✅ 服务端获取博客数据
async function getBlogData(slug: string) {
    try {
        const url = `${BACKEND_CONFIG.baseURL}/api/V1/blog?slug=${encodeURIComponent(slug)}`;
        const response = await fetch(url, {
            next: { revalidate: 3600 }, // 缓存1小时
        });

        if (!response.ok) {
            console.error('[BlogDetail] Failed to fetch blog:', response.status);
            return null;
        }

        const result = await response.json();

        if (!result?.success) {
            console.error('[BlogDetail] Blog not found:', slug);
            return null;
        }

        return result.data;
    } catch (error) {
        console.error('[BlogDetail] Error fetching blog:', error);
        return null;
    }
}

// ✅ 从博客 Markdown 内容中提取产品链接，查 API 获取产品数据
async function getProductsFromContent(content: string): Promise<ProductResponse[]> {
    if (!content) return [];

    // 匹配博客中的产品链接: https://www.mythtoy.com/toys/xxx 或 /toys/xxx
    const linkRegex = /https?:\/\/www\.mythtoy\.com(\/toys\/[\w\/-]+)|(\/toys\/[\w\/-]+)/gi;
    const slugs = new Set<string>();

    for (const match of content.matchAll(linkRegex)) {
        const fullPath = (match[1] || match[2]).toLowerCase();
        // /toys/female-sex-toys/g-spot-vibrators/the-swan → /female-sex-toys/g-spot-vibrators/the-swan
        const slug = fullPath.replace(/^\/toys/, '');
        if (slug && slug.length > 1) {
            slugs.add(slug);
        }
    }

    if (slugs.size === 0) return [];

    const results = await Promise.all(
        [...slugs].map(async (slug) => {
            try {
                const url = `${BACKEND_CONFIG.baseURL}/api/V1/product?slug=${encodeURIComponent(slug)}`;
                const resp = await fetch(url, { next: { revalidate: 3600 } });
                if (!resp.ok) return null;
                const json = await resp.json();
                return json?.data ?? null;
            } catch {
                return null;
            }
        })
    );

    return results.filter(Boolean) as ProductResponse[];
}

// ✅ SEO: Dynamic Metadata (必须保持服务端)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const blog = await getBlogData(resolvedParams.slug);

    if (!blog) {
        return {
            title: 'Article Not Found',
            description: 'The requested article could not be found.',
        };
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mythtoy.com';

    return {
        title: {
            absolute: `${blog.title} | MythToy Blog`,
        },
        description: blog.summary || blog.content.substring(0, 155),
        openGraph: {
            title: blog.title,
            description: blog.summary || blog.content.substring(0, 155),
            images: blog.coverImage ? [blog.coverImage] : [],
            type: 'article',
            publishedTime: blog.createdAt,
            modifiedTime: blog.updatedAt,
            authors: [getAuthor(blog.author).name],
        },
        alternates: {
            canonical: `${baseUrl}/blog/${blog.slug}`,
        },
    };
}

// ✅ 服务端组件：在服务端获取数据并传递给客户端
export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const blog = await getBlogData(resolvedParams.slug);

    const recommendedProducts = blog?.content
        ? await getProductsFromContent(blog.content)
        : [];
    const toc = blog?.content ? extractToc(blog.content) : [];

    return <BlogDetailClient initialBlog={blog} recommendedProducts={recommendedProducts} toc={toc} />;
}