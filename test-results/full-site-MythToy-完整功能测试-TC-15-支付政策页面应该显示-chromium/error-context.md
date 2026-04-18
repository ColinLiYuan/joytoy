# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.ts >> MythToy 完整功能测试 >> TC-15: 支付政策页面应该显示
- Location: tests\e2e\full-site.spec.ts:202:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=Payment Policy').or(locator('text=MT TECH'))
Expected: visible
Error: strict mode violation: locator('text=Payment Policy').or(locator('text=MT TECH')) resolved to 3 elements:
    1) <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center font-['Playfair_Display']">Payment Policy</h1> aka getByRole('heading', { name: 'Payment Policy' })
    2) <strong>"MT TECH"</strong> aka getByText('"MT TECH"')
    3) <a href="/pages/payment-policy" class="hover:text-white transition-colors border-b border-transparent hover:border-white/40">Payment Policy</a> aka getByRole('link', { name: 'Payment Policy' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=Payment Policy').or(locator('text=MT TECH'))

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e6]:
        - link "MythToy Logo" [ref=e7] [cursor=pointer]:
          - /url: /
          - img "MythToy Logo" [ref=e9]
        - navigation [ref=e11]:
          - list [ref=e12]:
            - listitem [ref=e13]:
              - link "Shop" [ref=e14] [cursor=pointer]:
                - /url: /collections/all
                - text: Shop
            - listitem [ref=e15]:
              - link "For Her" [ref=e16] [cursor=pointer]:
                - /url: /collections/female-sex-toys
                - text: For Her
            - listitem [ref=e17]:
              - link "For Him" [ref=e18] [cursor=pointer]:
                - /url: /collections/male-sex-toys
                - text: For Him
            - listitem [ref=e19]:
              - link "Anal Play" [ref=e20] [cursor=pointer]:
                - /url: /collections/sex-toys
                - text: Anal Play
            - listitem [ref=e21]:
              - link "Lingerie" [ref=e22] [cursor=pointer]:
                - /url: /collections/lingerie
                - text: Lingerie
            - listitem [ref=e23]:
              - link "Kink & Play" [ref=e24] [cursor=pointer]:
                - /url: /collections/bondage-play
                - text: Kink & Play
        - generic [ref=e26]:
          - button "Search" [ref=e27]:
            - img [ref=e28]
          - button "Wishlist" [ref=e31]:
            - img [ref=e32]
          - button "Shopping bag" [ref=e34]:
            - img [ref=e35]
          - button "Account" [ref=e39]:
            - img [ref=e40]
      - generic [ref=e44]:
        - button "Previous promotion" [ref=e45] [cursor=pointer]:
          - img [ref=e46]
        - generic [ref=e48]:
          - link "Free discreet shipping on orders over $49" [ref=e50] [cursor=pointer]:
            - /url: /collections/best-sellers
          - generic:
            - link "Earn 20% Commission, join us!":
              - /url: /pages/affiliate
        - button "Next promotion" [ref=e51] [cursor=pointer]:
          - img [ref=e52]
    - main [ref=e54]:
      - generic [ref=e56]:
        - navigation [ref=e57]:
          - generic [ref=e58]:
            - link "Privacy Policy" [ref=e59] [cursor=pointer]:
              - /url: /pages/privacy-policy
            - link "Terms of Service" [ref=e60] [cursor=pointer]:
              - /url: /pages/terms-and-conditions
            - link "Shipping" [ref=e61] [cursor=pointer]:
              - /url: /pages/shipping-policy
            - link "Returns" [ref=e62] [cursor=pointer]:
              - /url: /pages/return-refund
            - link "Cookies" [ref=e63] [cursor=pointer]:
              - /url: /pages/cookie-policy
            - link "Payments" [ref=e64] [cursor=pointer]:
              - /url: /pages/payment-policy
            - link "Affiliate" [ref=e65] [cursor=pointer]:
              - /url: /pages/affiliate
        - generic [ref=e66]:
          - heading "Payment Policy" [level=1] [ref=e67]
          - generic [ref=e68]:
            - paragraph [ref=e69]: "Last updated: April 2025"
            - generic [ref=e70]:
              - heading "1. Accepted Payment Methods" [level=2] [ref=e71]
              - paragraph [ref=e72]: "MythToy offers secure payment options for your convenience. We accept:"
              - generic [ref=e73]:
                - generic [ref=e74]:
                  - heading "Cards & Digital Wallets" [level=3] [ref=e75]
                  - list [ref=e76]:
                    - listitem [ref=e77]: Visa, Mastercard, American Express
                    - listitem [ref=e78]: PayPal
                    - listitem [ref=e79]: Apple Pay / Google Pay
                - generic [ref=e80]:
                  - heading "Wholesale / B2B" [level=3] [ref=e81]
                  - list [ref=e82]:
                    - listitem [ref=e83]: Bank Wire Transfer (TT)
                    - listitem [ref=e84]: Large volume PayPal transactions
            - generic [ref=e85]:
              - heading "2. Billing Discretion" [level=2] [ref=e86]
              - generic [ref=e87]:
                - paragraph [ref=e88]: Your privacy matters. Your bank statement will NOT show "MythToy" or any adult-related terms.
                - paragraph [ref=e89]:
                  - text: The charge will appear as
                  - strong [ref=e90]: "\"MT TECH\""
                  - text: on your statement.
            - generic [ref=e91]:
              - heading "3. Security & SSL" [level=2] [ref=e92]
              - paragraph [ref=e93]: We use industry-standard 256-bit SSL encryption to protect your data. We are PCI DSS compliant and do not store your full credit card numbers on our servers.
            - generic [ref=e94]:
              - heading "4. Sales Tax" [level=2] [ref=e95]
              - paragraph [ref=e96]: Taxes are calculated at checkout based on the shipping destination and applicable local laws.
            - generic [ref=e97]:
              - heading "5. Contact Payment Support" [level=2] [ref=e98]
              - paragraph [ref=e99]: "If you encounter payment issues or declines, please contact your bank first, then reach out to us at:"
              - list [ref=e100]:
                - listitem [ref=e101]:
                  - strong [ref=e102]: "Email:"
                  - text: payments@mythtoy.com
    - contentinfo [ref=e104]:
      - generic [ref=e105]:
        - generic [ref=e106]:
          - generic [ref=e107]:
            - heading "Shop" [level=3] [ref=e108]
            - list [ref=e109]:
              - listitem [ref=e110]:
                - link "All Collections" [ref=e111] [cursor=pointer]:
                  - /url: /collections
              - listitem [ref=e112]:
                - link "Shop All" [ref=e113] [cursor=pointer]:
                  - /url: /collections/all
              - listitem [ref=e114]:
                - link "New In" [ref=e115] [cursor=pointer]:
                  - /url: /collections/new-arrivals
              - listitem [ref=e116]:
                - link "Best Sellers" [ref=e117] [cursor=pointer]:
                  - /url: /collections/best-sellers
              - listitem [ref=e118]:
                - link "For Her" [ref=e119] [cursor=pointer]:
                  - /url: /collections/female-sex-toys
              - listitem [ref=e120]:
                - link "For Him" [ref=e121] [cursor=pointer]:
                  - /url: /collections/male-sex-toys
              - listitem [ref=e122]:
                - link "Free Product" [ref=e123] [cursor=pointer]:
                  - /url: /pioneer
          - generic [ref=e124]:
            - heading "Support" [level=3] [ref=e125]
            - list [ref=e126]:
              - listitem [ref=e127]:
                - link "Contact Us" [ref=e128] [cursor=pointer]:
                  - /url: /pages/contact
              - listitem [ref=e129]:
                - link "Shipping Policy" [ref=e130] [cursor=pointer]:
                  - /url: /pages/shipping-policy
              - listitem [ref=e131]:
                - link "Returns & Refund" [ref=e132] [cursor=pointer]:
                  - /url: /pages/return-refund
              - listitem [ref=e133]:
                - link "Track Order" [ref=e134] [cursor=pointer]:
                  - /url: /pages/order-tracking
              - listitem [ref=e135]:
                - link "Care & Guides" [ref=e136] [cursor=pointer]:
                  - /url: /pages/manuals
              - listitem [ref=e137]:
                - link "FAQ" [ref=e138] [cursor=pointer]:
                  - /url: /pages/faq
          - generic [ref=e139]:
            - heading "About" [level=3] [ref=e140]
            - list [ref=e141]:
              - listitem [ref=e142]:
                - link "Our Story" [ref=e143] [cursor=pointer]:
                  - /url: /pages/about
              - listitem [ref=e144]:
                - link "Affiliate Program" [ref=e145] [cursor=pointer]:
                  - /url: /pages/affiliate
              - listitem [ref=e146]:
                - link "Blog" [ref=e147] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e148]:
                - link "Wholesale" [ref=e149] [cursor=pointer]:
                  - /url: /pages/wholesale
          - generic [ref=e150]:
            - heading "Policies" [level=3] [ref=e151]
            - list [ref=e152]:
              - listitem [ref=e153]:
                - link "Privacy Policy" [ref=e154] [cursor=pointer]:
                  - /url: /pages/privacy-policy
              - listitem [ref=e155]:
                - link "Terms of Service" [ref=e156] [cursor=pointer]:
                  - /url: /pages/terms-and-conditions
              - listitem [ref=e157]:
                - link "Age Verification" [ref=e158] [cursor=pointer]:
                  - /url: /pages/age-verification
          - generic [ref=e159]:
            - heading "Get 10% Off" [level=3] [ref=e160]
            - paragraph [ref=e161]: Join our newsletter for exclusive offers and discreet updates.
            - generic [ref=e162]:
              - textbox "Enter your email" [ref=e163]
              - button "Subscribe" [ref=e164]
            - generic [ref=e165]:
              - generic [ref=e166]:
                - link "Follow us on Instagram" [ref=e167] [cursor=pointer]:
                  - /url: https://www.instagram.com/mythtoy.official
                  - img [ref=e168]
                - link "Follow us on X" [ref=e171] [cursor=pointer]:
                  - /url: https://x.com/mythtoyofficial
                  - img [ref=e172]
                - link "Follow us on Facebook" [ref=e174] [cursor=pointer]:
                  - /url: https://www.facebook.com/mythtoy.official
                  - img [ref=e175]
              - paragraph [ref=e178]: support@mythtoy.com
        - generic [ref=e179]:
          - generic [ref=e180]:
            - paragraph [ref=e181]: © 2026 MythToy. All rights reserved. 18+ Only.
            - generic [ref=e182]:
              - link "Cookie Policy" [ref=e183] [cursor=pointer]:
                - /url: /pages/cookie-policy
              - link "Payment Policy" [ref=e184] [cursor=pointer]:
                - /url: /pages/payment-policy
          - generic [ref=e185]:
            - img [ref=e186]
            - generic [ref=e188]: VISA
            - generic [ref=e189]: MASTERCARD
            - generic [ref=e190]: AMEX
            - generic [ref=e191]: DISCOVER
            - generic [ref=e192]: PayPal
  - button "Open Next.js Dev Tools" [ref=e198] [cursor=pointer]:
    - img [ref=e199]
  - alert [ref=e202]
```

# Test source

```ts
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
> 207 |     await expect(page.locator('text=Payment Policy').or(page.locator('text=MT TECH'))).toBeVisible({ timeout: 5000 });
      |                                                                                        ^ Error: expect(locator).toBeVisible() failed
  208 |     
  209 |     console.log('✅ TC-15 通过：支付政策页面加载成功');
  210 |   });
  211 | });
  212 | 
```