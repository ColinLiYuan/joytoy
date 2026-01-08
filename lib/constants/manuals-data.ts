// lib/constants/manuals-data.ts

export interface ProductManual {
    id: string;
    title: string;
    image: string; // 产品图片路径
    pdfUrl: string; // PDF文件路径
}

// 数据来源于数据库 product 表
// 筛选: status = 'ACTIVE'
// 排序: created_at DESC (最新的在前面)
export const MANUALS_DATA: ProductManual[] = [
    // 1. The Muse (2025-05-01 12:00:00)
    {
        id: '41',
        title: 'The Muse',
        image: 'the-muse.png',
        pdfUrl: '/manuals/the-muse-guide.pdf',
    },
    // 2. The Emerald (2025-05-01 11:00:00)
    {
        id: '57',
        title: 'The Emerald',
        image: 'the-emerald.webp?v=1',
        pdfUrl: '/manuals/the-emerald-guide.pdf',
    },
    // 3. The Pen (2025-05-01 10:00:00)
    {
        id: '50',
        title: 'The Pen',
        image: 'the-pen.webp',
        pdfUrl: '/manuals/the-pen-guide.pdf',
    },
    // 4. The Swan (2025-05-01 09:00:00)
    {
        id: '58',
        title: 'The Swan',
        image: 'the-swan.webp',
        pdfUrl: '/manuals/the-swan-guide.pdf',
    },
    // 5. The Eclipse (2025-04-01 12:00:00)
    {
        id: '46',
        title: 'The Eclipse',
        image: 'the-eclipse.png',
        pdfUrl: '/manuals/the-eclipse-guide.pdf',
    },
    // 6. The Piston (2025-04-01 11:00:00)
    {
        id: '62',
        title: 'The Piston',
        image: 'the-piston.png',
        pdfUrl: '/manuals/the-piston-guide.pdf',
    },
    // 7. The Crystal (2025-04-01 10:00:00)
    {
        id: '40',
        title: 'The Crystal',
        image: 'the-crystal.png',
        pdfUrl: '/manuals/the-crystal-guide.pdf',
    },
    // 8. The Slate (2025-04-01 09:00:00)
    {
        id: '56',
        title: 'The Slate',
        image: 'the-slate.webp',
        pdfUrl: '/manuals/the-slate-guide.pdf',
    },
    // 9. The A10 (2025-03-01 12:00:00)
    {
        id: '68',
        title: 'The A10',
        image: 'the-a10-thruster.png',
        pdfUrl: '/manuals/the-a10-guide.pdf',
    },
    // 10. The Loop (2025-03-01 11:00:00)
    {
        id: '64',
        title: 'The Loop',
        image: 'the-loop.png',
        pdfUrl: '/manuals/the-loop-guide.pdf',
    },
    // 11. The Viper (2025-03-01 10:00:00)
    {
        id: '61',
        title: 'The Viper',
        image: 'the-viper.png',
        pdfUrl: '/manuals/the-viper-guide.pdf',
    },
    // 12. The Brush (2025-03-01 09:00:00)
    {
        id: '42',
        title: 'The Brush',
        image: 'the-brush.png?v=1',
        pdfUrl: '/manuals/the-brush-guide.pdf',
    },
    // 13. The Venus (2024-02-01) -> 注意：虽然ID靠前，但创建时间较早
    {
        id: '22',
        title: 'The Venus',
        image: 'the-venus.jpg',
        pdfUrl: '/manuals/the-venus-guide.pdf',
    },
    // --- 以下全是 2025-01-01 创建的，按ID降序排列 (模拟最新入库) ---
    {
        id: '69',
        title: 'The Black Rose',
        image: 'the-black-rose.png',
        pdfUrl: '/manuals/the-black-rose-guide.pdf',
    },
    {
        id: '67',
        title: 'The Paddle',
        image: 'the-paddle.png',
        pdfUrl: '/manuals/the-paddle-guide.pdf',
    },
    {
        id: '66',
        title: 'The Ridge',
        image: 'the-ridge.png',
        pdfUrl: '/manuals/the-ridge-guide.pdf',
    },
    {
        id: '65',
        title: 'The Mesh',
        image: 'the-mesh.jpg',
        pdfUrl: '/manuals/the-mesh-guide.pdf',
    },
    {
        id: '63',
        title: 'The Stone',
        image: 'the-stone.png',
        pdfUrl: '/manuals/the-stone-guide.pdf',
    },
    {
        id: '60',
        title: 'The Dove',
        image: 'the-dove.png',
        pdfUrl: '/manuals/the-dove-guide.pdf',
    },
    {
        id: '59',
        title: 'The Seraph',
        image: 'the-seraph.webp',
        pdfUrl: '/manuals/the-seraph-guide.pdf',
    },
    {
        id: '55',
        title: 'The Pawn',
        image: 'the-pawn.webp',
        pdfUrl: '/manuals/the-pawn-guide.pdf',
    },
    {
        id: '54',
        title: 'The Pearls',
        image: 'the-pearls.webp',
        pdfUrl: '/manuals/the-pearls-guide.pdf',
    },
    {
        id: '53',
        title: 'The Scepter Mini',
        image: 'the-scepter-mini.webp',
        pdfUrl: '/manuals/the-scepter-mini-guide.pdf',
    },
    {
        id: '52',
        title: 'The Feather',
        image: 'the-feather.webp',
        pdfUrl: '/manuals/the-feather-guide.pdf',
    },
    {
        id: '51',
        title: 'The Core',
        image: 'the-core.webp',
        pdfUrl: '/manuals/the-core-guide.pdf',
    },
    {
        id: '49',
        title: 'The Cuff',
        image: 'the-cuff.png',
        pdfUrl: '/manuals/the-cuff-guide.pdf',
    },
    {
        id: '47',
        title: 'The Trainer',
        image: 'the-trainer.png?v=1',
        pdfUrl: '/manuals/the-trainer-guide.pdf',
    },
    {
        id: '45',
        title: 'The Shadow',
        image: 'the-shadow.png',
        pdfUrl: '/manuals/the-shadow-guide.pdf',
    },
    {
        id: '44',
        title: 'The Capsule',
        image: 'the-capsule.png',
        pdfUrl: '/manuals/the-capsule-guide.pdf',
    },
    {
        id: '43',
        title: 'The Link',
        image: 'the-link.png',
        pdfUrl: '/manuals/the-link-guide.pdf',
    },
    {
        id: '40',
        title: 'The Crystal',
        image: 'the-crystal.png',
        pdfUrl: '/manuals/the-crystal-guide.pdf',
    },
    {
        id: '38',
        title: 'The Gem',
        image: 'gem-remote-metal-plug.png?v=1',
        pdfUrl: '/manuals/the-gem-guide.pdf',
    },
    {
        id: '34',
        title: 'The Scepter',
        image: 'scepter-smart-wand.png',
        pdfUrl: '/manuals/the-scepter-guide.pdf',
    },
    {
        id: '33',
        title: 'The Halo',
        image: 'halo-finger-vibe.png',
        pdfUrl: '/manuals/the-halo-guide.pdf',
    },
    {
        id: '30',
        title: 'The Titan',
        image: 'the-titan.png',
        pdfUrl: '/manuals/the-titan-guide.pdf',
    },
    {
        id: '27',
        title: 'The Rouge',
        image: 'rouge-lipstick-bullet.png',
        pdfUrl: '/manuals/the-rouge-guide.pdf',
    },
];