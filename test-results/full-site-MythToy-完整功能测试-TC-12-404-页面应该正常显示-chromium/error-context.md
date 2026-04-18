# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.ts >> MythToy 完整功能测试 >> TC-12: 404 页面应该正常显示
- Location: tests\e2e\full-site.spec.ts:164:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=404').or(locator('text=Not Found'))
Expected: visible
Error: strict mode violation: locator('text=404').or(locator('text=Not Found')) resolved to 2 elements:
    1) <h1 class="text-9xl font-bold text-gray-200">404</h1> aka getByRole('heading', { name: '404' })
    2) <h2 class="text-2xl font-bold text-gray-900 mt-4 mb-2 font-['Playfair_Display']">Page Not Found</h2> aka getByRole('heading', { name: 'Page Not Found' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=404').or(locator('text=Not Found'))

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - heading "404" [level=1] [ref=e3]
    - heading "Page Not Found" [level=2] [ref=e4]
    - paragraph [ref=e5]: The page you are looking for might have been removed or is temporarily unavailable.
    - link "Browse Collections" [ref=e6] [cursor=pointer]:
      - /url: /collections
  - button "Open Next.js Dev Tools" [ref=e12] [cursor=pointer]:
    - generic [ref=e15]:
      - text: Compiling
      - generic [ref=e16]:
        - generic [ref=e17]: .
        - generic [ref=e18]: .
        - generic [ref=e19]: .
  - alert [ref=e20]
```

# Test source

```ts
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
  85  |     await expect(page.locator('h1')).toBeVisible();
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
> 169 |     await expect(page.locator('text=404').or(page.locator('text=Not Found'))).toBeVisible({ timeout: 5000 });
      |                                                                               ^ Error: expect(locator).toBeVisible() failed
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
  186 |   // TC-14: 移动端导航测试
  187 |   test('TC-14: 产品详情页图片应该加载', async ({ page }) => {
  188 |     await page.goto(`${BASE_URL}/collections/all`);
  189 |     await page.waitForLoadState('networkidle');
  190 |     
  191 |     // 点击第一个产品
  192 |     await page.locator('a[href^="/toys/"]').first().click();
  193 |     await page.waitForLoadState('networkidle');
  194 |     
  195 |     // 验证图片加载
  196 |     await expect(page.locator('img')).toBeVisible({ timeout: 5000 });
  197 |     
  198 |     console.log('✅ TC-14 通过：产品图片加载成功');
  199 |   });
  200 | 
  201 |   // TC-15: 页面 404 测试
  202 |   test('TC-15: 支付政策页面应该显示', async ({ page }) => {
  203 |     await page.goto(`${BASE_URL}/pages/payment-policy`);
  204 |     await page.waitForLoadState('networkidle');
  205 |     
  206 |     // 验证页面加载
  207 |     await expect(page.locator('text=Payment Policy').or(page.locator('text=MT TECH'))).toBeVisible({ timeout: 5000 });
  208 |     
  209 |     console.log('✅ TC-15 通过：支付政策页面加载成功');
  210 |   });
  211 | });
  212 | 
```