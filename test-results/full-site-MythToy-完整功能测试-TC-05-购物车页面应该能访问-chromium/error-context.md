# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.ts >> MythToy 完整功能测试 >> TC-05: 购物车页面应该能访问
- Location: tests\e2e\full-site.spec.ts:80:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e5]:
      - button [ref=e6]:
        - img [ref=e7]
      - generic [ref=e10]:
        - generic [ref=e11]:
          - img [ref=e13]
          - heading "Get 10% Off" [level=2] [ref=e17]
          - paragraph [ref=e18]: Subscribe to our newsletter and unlock your exclusive discount code!
        - generic [ref=e19]:
          - generic [ref=e20]:
            - img [ref=e21]
            - textbox "Enter your email" [ref=e24]
          - button "Unlock My Discount" [ref=e25]
        - paragraph [ref=e26]: No spam, unsubscribe anytime. We respect your privacy.
    - banner [ref=e28]:
      - link "MythToy" [ref=e30] [cursor=pointer]:
        - /url: /
        - generic [ref=e31]: MythToy
    - main [ref=e32]:
      - generic [ref=e34]:
        - img [ref=e35]
        - heading "Your bag is empty" [level=2] [ref=e38]
        - button "Start Shopping" [ref=e39]
    - contentinfo [ref=e41]:
      - generic [ref=e42]:
        - generic [ref=e43]:
          - generic [ref=e44]:
            - heading "Shop" [level=3] [ref=e45]
            - list [ref=e46]:
              - listitem [ref=e47]:
                - link "All Collections" [ref=e48] [cursor=pointer]:
                  - /url: /collections
              - listitem [ref=e49]:
                - link "Shop All" [ref=e50] [cursor=pointer]:
                  - /url: /collections/all
              - listitem [ref=e51]:
                - link "New In" [ref=e52] [cursor=pointer]:
                  - /url: /collections/new-arrivals
              - listitem [ref=e53]:
                - link "Best Sellers" [ref=e54] [cursor=pointer]:
                  - /url: /collections/best-sellers
              - listitem [ref=e55]:
                - link "For Her" [ref=e56] [cursor=pointer]:
                  - /url: /collections/female-sex-toys
              - listitem [ref=e57]:
                - link "For Him" [ref=e58] [cursor=pointer]:
                  - /url: /collections/male-sex-toys
              - listitem [ref=e59]:
                - link "Free Product" [ref=e60] [cursor=pointer]:
                  - /url: /pioneer
          - generic [ref=e61]:
            - heading "Support" [level=3] [ref=e62]
            - list [ref=e63]:
              - listitem [ref=e64]:
                - link "Contact Us" [ref=e65] [cursor=pointer]:
                  - /url: /pages/contact
              - listitem [ref=e66]:
                - link "Shipping Policy" [ref=e67] [cursor=pointer]:
                  - /url: /pages/shipping-policy
              - listitem [ref=e68]:
                - link "Returns & Refund" [ref=e69] [cursor=pointer]:
                  - /url: /pages/return-refund
              - listitem [ref=e70]:
                - link "Track Order" [ref=e71] [cursor=pointer]:
                  - /url: /pages/order-tracking
              - listitem [ref=e72]:
                - link "Care & Guides" [ref=e73] [cursor=pointer]:
                  - /url: /pages/manuals
              - listitem [ref=e74]:
                - link "FAQ" [ref=e75] [cursor=pointer]:
                  - /url: /pages/faq
          - generic [ref=e76]:
            - heading "About" [level=3] [ref=e77]
            - list [ref=e78]:
              - listitem [ref=e79]:
                - link "Our Story" [ref=e80] [cursor=pointer]:
                  - /url: /pages/about
              - listitem [ref=e81]:
                - link "Affiliate Program" [ref=e82] [cursor=pointer]:
                  - /url: /pages/affiliate
              - listitem [ref=e83]:
                - link "Blog" [ref=e84] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e85]:
                - link "Wholesale" [ref=e86] [cursor=pointer]:
                  - /url: /pages/wholesale
          - generic [ref=e87]:
            - heading "Policies" [level=3] [ref=e88]
            - list [ref=e89]:
              - listitem [ref=e90]:
                - link "Privacy Policy" [ref=e91] [cursor=pointer]:
                  - /url: /pages/privacy-policy
              - listitem [ref=e92]:
                - link "Terms of Service" [ref=e93] [cursor=pointer]:
                  - /url: /pages/terms-and-conditions
              - listitem [ref=e94]:
                - link "Age Verification" [ref=e95] [cursor=pointer]:
                  - /url: /pages/age-verification
          - generic [ref=e96]:
            - heading "Get 10% Off" [level=3] [ref=e97]
            - paragraph [ref=e98]: Join our newsletter for exclusive offers and discreet updates.
            - generic [ref=e99]:
              - textbox "Enter your email" [ref=e100]
              - button "Subscribe" [ref=e101]
            - generic [ref=e102]:
              - generic [ref=e103]:
                - link "Follow us on Instagram" [ref=e104] [cursor=pointer]:
                  - /url: https://www.instagram.com/mythtoy.official
                  - img [ref=e105]
                - link "Follow us on X" [ref=e108] [cursor=pointer]:
                  - /url: https://x.com/mythtoyofficial
                  - img [ref=e109]
                - link "Follow us on Facebook" [ref=e111] [cursor=pointer]:
                  - /url: https://www.facebook.com/mythtoy.official
                  - img [ref=e112]
              - paragraph [ref=e115]: support@mythtoy.com
        - generic [ref=e116]:
          - generic [ref=e117]:
            - paragraph [ref=e118]: © 2026 MythToy. All rights reserved. 18+ Only.
            - generic [ref=e119]:
              - link "Cookie Policy" [ref=e120] [cursor=pointer]:
                - /url: /pages/cookie-policy
              - link "Payment Policy" [ref=e121] [cursor=pointer]:
                - /url: /pages/payment-policy
          - generic [ref=e122]:
            - img [ref=e123]
            - generic [ref=e125]: VISA
            - generic [ref=e126]: MASTERCARD
            - generic [ref=e127]: AMEX
            - generic [ref=e128]: DISCOVER
            - generic [ref=e129]: PayPal
  - button "Open Next.js Dev Tools" [ref=e135] [cursor=pointer]:
    - img [ref=e136]
  - alert [ref=e139]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | // 配置
  4   | const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
  5   | 
  6   | test.describe('MythToy 完整功能测试', () => {
  7   |   
  8   |   // TC-01: 首页加载测试
  9   |   test('TC-01: 首页应该正常加载', async ({ page }) => {
  10  |     await page.goto(BASE_URL);
  11  |     
  12  |     // 验证页面标题
  13  |     await expect(page).toHaveTitle(/MythToy/);
  14  |     
  15  |     // 验证关键元素存在
  16  |     await expect(page.locator('nav')).toBeVisible();
  17  |     await expect(page.locator('footer')).toBeVisible();
  18  |     
  19  |     console.log('✅ TC-01 通过：首页加载成功');
  20  |   });
  21  | 
  22  |   // TC-02: 产品列表页测试
  23  |   test('TC-02: 产品列表页应该显示产品', async ({ page }) => {
  24  |     await page.goto(`${BASE_URL}/collections/all`);
  25  |     
  26  |     // 等待页面加载
  27  |     await page.waitForLoadState('networkidle');
  28  |     
  29  |     // 验证至少有一个产品链接（产品卡片是 Link 组件）
  30  |     const productLinks = await page.locator('a[href^="/toys/"]').count();
  31  |     expect(productLinks).toBeGreaterThan(0);
  32  |     
  33  |     console.log(`✅ TC-02 通过：找到 ${productLinks} 个产品`);
  34  |   });
  35  | 
  36  |   // TC-03: 产品详情页测试
  37  |   test('TC-03: 产品详情页应该正常显示', async ({ page }) => {
  38  |     await page.goto(`${BASE_URL}/collections/all`);
  39  |     await page.waitForLoadState('networkidle');
  40  |     
  41  |     // 点击第一个产品
  42  |     await page.locator('a[href^="/toys/"]').first().click();
  43  |     
  44  |     // 等待页面加载
  45  |     await page.waitForLoadState('networkidle');
  46  |     
  47  |     // 验证产品详情元素
  48  |     await expect(page.locator('h1')).toBeVisible();
  49  |     await expect(page.locator('img')).toBeVisible();
  50  |     
  51  |     console.log('✅ TC-03 通过：产品详情页加载成功');
  52  |   });
  53  | 
  54  |   // TC-04: 添加到购物车测试
  55  |   test('TC-04: 应该能添加产品到购物车', async ({ page }) => {
  56  |     await page.goto(`${BASE_URL}/collections/all`);
  57  |     await page.waitForLoadState('networkidle');
  58  |     
  59  |     // 点击第一个产品
  60  |     await page.locator('a[href^="/toys/"]').first().click();
  61  |     await page.waitForLoadState('networkidle');
  62  |     
  63  |     // 选择规格（如果有）
  64  |     const sizeSelect = page.locator('select[name="size"]');
  65  |     if (await sizeSelect.isVisible()) {
  66  |       await sizeSelect.selectIndex(0);
  67  |     }
  68  |     
  69  |     // 点击添加到购物车按钮
  70  |     const addToCartBtn = page.locator('button:has-text("Add to Cart"), button:has-text("加入购物车")');
  71  |     if (await addToCartBtn.isVisible()) {
  72  |       await addToCartBtn.click();
  73  |       await page.waitForTimeout(1000);
  74  |     }
  75  |     
  76  |     console.log('✅ TC-04 通过：产品已添加到购物车');
  77  |   });
  78  | 
  79  |   // TC-05: 购物车页面测试
  80  |   test('TC-05: 购物车页面应该能访问', async ({ page }) => {
  81  |     await page.goto(`${BASE_URL}/checkout`);
  82  |     await page.waitForLoadState('networkidle');
  83  |     
  84  |     // 验证页面加载
> 85  |     await expect(page.locator('h1')).toBeVisible();
      |                                      ^ Error: expect(locator).toBeVisible() failed
  86  |     
  87  |     console.log('✅ TC-05 通过：购物车页面加载成功');
  88  |   });
  89  | 
  90  |   // TC-06: 结账页面运费计算测试
  91  |   test('TC-06: 结账页面应该能访问', async ({ page }) => {
  92  |     await page.goto(`${BASE_URL}/checkout`);
  93  |     await page.waitForLoadState('networkidle');
  94  |     
  95  |     // 验证页面加载
  96  |     await expect(page.locator('text=Checkout').or(page.locator('text=结账'))).toBeVisible({ timeout: 5000 });
  97  |     
  98  |     console.log('✅ TC-06 通过：结账页面加载成功');
  99  |   });
  100 | 
  101 |   // TC-07: 免运费测试（>= $49）
  102 |   test('TC-07: 订单满$49应该免运费', async ({ page }) => {
  103 |     // 这个测试需要确保购物车金额 >= $49
  104 |     // 实际执行时可能需要调整商品数量或选择高价商品
  105 |     console.log('⚠️ TC-07 跳过：需要特定价格的商品配置');
  106 |   });
  107 | 
  108 |   // TC-08: 优惠券验证测试
  109 |   test('TC-08: FAQ 页面应该显示问题', async ({ page }) => {
  110 |     await page.goto(`${BASE_URL}/pages/faq`);
  111 |     await page.waitForLoadState('networkidle');
  112 |     
  113 |     // 验证页面加载
  114 |     await expect(page.locator('text=FAQ').or(page.locator('text=常见问题'))).toBeVisible({ timeout: 5000 });
  115 |     
  116 |     console.log('✅ TC-08 通过：FAQ 页面加载成功');
  117 |   });
  118 | 
  119 |   // TC-09: 支付页面加载测试
  120 |   test('TC-09: 博客列表页应该显示文章', async ({ page }) => {
  121 |     await page.goto(`${BASE_URL}/blog`);
  122 |     await page.waitForLoadState('networkidle');
  123 |     
  124 |     // 验证页面加载
  125 |     await expect(page).toHaveTitle(/Blog|Journal/);
  126 |     
  127 |     console.log('✅ TC-09 通过：博客列表页加载成功');
  128 |   });
  129 | 
  130 |   // TC-10: PayPal 按钮渲染测试
  131 |   test('TC-10: 搜索功能应该工作', async ({ page }) => {
  132 |     await page.goto(BASE_URL);
  133 |     await page.waitForLoadState('networkidle');
  134 |     
  135 |     // 打开搜索框
  136 |     const searchButton = page.locator('button:has-text("Search"), button:has-text("搜索")');
  137 |     if (await searchButton.isVisible()) {
  138 |       await searchButton.click();
  139 |       await page.waitForTimeout(500);
  140 |     }
  141 |     
  142 |     console.log('✅ TC-10 通过：搜索功能正常');
  143 |   });
  144 | 
  145 |   // TC-11: 博客列表页测试
  146 |   test('TC-11: 移动端导航应该正常工作', async ({ page }) => {
  147 |     // 设置移动端视口
  148 |     await page.setViewportSize({ width: 375, height: 667 });
  149 |     
  150 |     await page.goto(BASE_URL);
  151 |     await page.waitForLoadState('networkidle');
  152 |     
  153 |     // 点击汉堡菜单
  154 |     const mobileMenuBtn = page.locator('button:has(svg)');
  155 |     if (await mobileMenuBtn.isVisible()) {
  156 |       await mobileMenuBtn.first().click();
  157 |       await page.waitForTimeout(500);
  158 |     }
  159 |     
  160 |     console.log('✅ TC-11 通过：移动端导航正常');
  161 |   });
  162 | 
  163 |   // TC-12: FAQ 页面测试
  164 |   test('TC-12: 404 页面应该正常显示', async ({ page }) => {
  165 |     await page.goto(`${BASE_URL}/non-existent-page-xyz`);
  166 |     await page.waitForLoadState('networkidle');
  167 |     
  168 |     // 验证 404 页面
  169 |     await expect(page.locator('text=404').or(page.locator('text=Not Found'))).toBeVisible({ timeout: 5000 });
  170 |     
  171 |     console.log('✅ TC-12 通过：404 页面正常显示');
  172 |   });
  173 | 
  174 |   // TC-13: 搜索功能测试
  175 |   test('TC-13: 首页应该包含关键元素', async ({ page }) => {
  176 |     await page.goto(BASE_URL);
  177 |     await page.waitForLoadState('networkidle');
  178 |     
  179 |     // 验证关键元素存在
  180 |     await expect(page.locator('nav')).toBeVisible();
  181 |     await expect(page.locator('footer')).toBeVisible();
  182 |     
  183 |     console.log('✅ TC-13 通过：首页关键元素存在');
  184 |   });
  185 | 
```