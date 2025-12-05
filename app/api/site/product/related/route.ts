// app/api/product/related/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { productServiceServer } from '@/services/servers/product-service-server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const currentSlug = searchParams.get('slug');

        if (!currentSlug) {
            return NextResponse.json({ data: [] });
        }

        // 1. 获取当前商品详情
        const currentProduct = await productServiceServer.getProductBySlug(currentSlug);

        if (!currentProduct) {
            return NextResponse.json({ data: [] });
        }

        // 2. 确定目标分类 Slug
        // 逻辑：取 categories 数组的最后一个。因为通常数组顺序是 [大类, 小类]
        // 例如: ["female-toys", "vibrators"] -> 我们取 "vibrators"
        let targetCategorySlug = 'best-sellers'; // 默认兜底

        if (currentProduct.categories && currentProduct.categories.length > 0) {
            // slice(-1)[0] 是获取数组最后一个元素的简便写法
            targetCategorySlug = currentProduct.categories.slice(-1)[0];
        }

        // 3. 获取同分类产品 (多取一点，比如 16 个，方便随机)
        const listResponse = await productServiceServer.getProductsByCategory(targetCategorySlug, 0, 16);
        // console.log('related route byCategory: ', listResponse.content)
        let products = listResponse.content || [];

        // 4. 过滤掉当前商品自己
        products = products.filter(p => p.id !== currentProduct.id);

        // 5. 如果数量不够 4 个，去补 Best Sellers (兜底策略)
        if (products.length < 4) {
            try {
                const heroProducts = await productServiceServer.getHeroProducts();
                // 过滤掉已经存在的产品和当前产品
                const existingIds = new Set(products.map(p => p.id));
                const fillerItems = heroProducts.filter(p => !existingIds.has(p.id) && p.id !== currentProduct.id);
                products = [...products, ...fillerItems];
            } catch (e) {
                console.error('Failed to fetch fallback products', e);
            }
        }

        // 6. 随机打乱 (Shuffle) - 让每次进来的推荐都不一样
        for (let i = products.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [products[i], products[j]] = [products[j], products[i]];
        }

        // 7. 只取前 4 个
        const finalRelated = products.slice(0, 4);
        // console.log('related route finalRelated: ', finalRelated)

        return NextResponse.json(finalRelated);

    } catch (error) {
        console.error('🔴 Product Related API Error:', error);
        // 出错时不报错，而是返回空数组，避免前端页面崩溃
        return NextResponse.json([]);
    }
}