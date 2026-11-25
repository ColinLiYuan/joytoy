// scripts/generate-category-data.mjs
// 从后端分类树接口（GET /api/V1/categories，公开）生成 lib/constants/category-data.ts。
// 后端 category 表是唯一权威；每次构建（npm run build → prebuild）自动同步，
// 保证前台分类数据与后端一致（admin 改完分类 → 触发一次构建即生效）。
// 失败即构建失败（一致性保证）；确需跳过时设环境变量 SKIP_CATEGORY_SYNC=1。
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// 拉取地址优先级：NEXT_PUBLIC_BACKEND_BASE_URL > BACKEND_BASE_URL > 生产站（经 Next 代理）
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_BASE_URL
  || process.env.BACKEND_BASE_URL
  || 'https://www.mythtoy.com';

const OUTPUT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '../lib/constants/category-data.ts'
);

// 隐藏分类：与 lib/constants/hidden-categories.ts 保持一致，生成时从树中剔除，
// 避免进入导航 / 集合总览 / 分类 sitemap（商品页与分类页的 noindex 由 isHiddenCategory 处理）。
const HIDDEN_CATEGORIES = ['realistic', 'torso'];
const isHidden = (slug) =>
  HIDDEN_CATEGORIES.some((h) => slug === h || slug.startsWith(`${h}/`) || slug.endsWith(`/${h}`));

if (process.env.SKIP_CATEGORY_SYNC === '1') {
  console.log('[category-sync] SKIP_CATEGORY_SYNC=1，跳过分类数据同步');
  process.exit(0);
}

console.log(`[category-sync] 拉取分类树: ${BACKEND}/api/V1/categories`);

let body;
try {
  const res = await fetch(`${BACKEND}/api/V1/categories`, {
    signal: AbortSignal.timeout(30_000),
    headers: { Accept: 'application/json' },
  });
  body = await res.json();
  if (!res.ok || !body?.success) {
    throw new Error(`HTTP ${res.status}: ${body?.message || '分类接口返回失败'}`);
  }
} catch (e) {
  console.error(`[category-sync] 失败（构建中止以保证一致性）: ${e.message}`);
  process.exit(1);
}

const roots = Array.isArray(body.data) ? body.data : [];
if (roots.length === 0) {
  console.error('[category-sync] 失败：后端返回空分类树');
  process.exit(1);
}

/** 树节点 → CategoryItem（根节点不带 root 字段；子节点保留 root；隐藏分类整枝剔除） */
function toItem(node, isRoot) {
  const item = {
    slug: node.slug ?? '',
    name: node.name ?? '',
    title: node.title ?? '',
  };
  if (node.image) item.image = node.image;
  if (node.icon) item.icon = node.icon;
  item.description = node.description ?? '';
  item.priority = node.priority ?? 0.7;
  item.changefreq = node.changefreq ?? 'weekly';
  if (!isRoot && node.root) item.root = node.root;
  if (Array.isArray(node.categories) && node.categories.length > 0) {
    const children = node.categories
      .filter((c) => !isHidden(c.slug))
      .map((c) => toItem(c, false));
    if (children.length > 0) item.categories = children;
  }
  return item;
}

const data = {
  category: {
    roots: roots.filter((r) => !isHidden(r.slug)).map((r) => toItem(r, true)),
  },
};

const ts = `// lib/constants/category-data.ts
// ⚠️ 本文件由 scripts/generate-category-data.mjs 自动生成（构建时从后端 /api/V1/categories 拉取），
//    请勿手改；要改分类请到 admin「分类管理」，改完触发一次构建发布。
import { CategoriesData } from '@/types/category';

export const CATEGORIES_DATA: CategoriesData = ${JSON.stringify(data, null, 4)};
`;

writeFileSync(OUTPUT, ts, 'utf-8');
const visible = data.category.roots.reduce((n, r) => n + 1 + (r.categories?.length || 0), 0);
console.log(`[category-sync] 已生成 ${OUTPUT}（roots=${data.category.roots.length}，可见分类=${visible}）`);
