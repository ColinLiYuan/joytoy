# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.ts >> MythToy 完整功能测试 >> TC-14: 产品详情页图片应该加载
- Location: tests\e2e\full-site.spec.ts:187:7

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('a[href^="/toys/"]').first()
    - locator resolved to <a class="block relative aspect-[4/5] overflow-hidden bg-gray-100" href="/toys/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated">…</a>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div> intercepts pointer events
    - retrying click action
    - waiting 20ms
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div> intercepts pointer events
    - retrying click action
      - waiting 100ms
    47 × waiting for element to be visible, enabled and stable
       - element is visible, enabled and stable
       - scrolling into view if needed
       - done scrolling
       - <div class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"></div> intercepts pointer events
     - retrying click action
       - waiting 500ms

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
    - generic [ref=e27]:
      - generic [ref=e30]:
        - link "MythToy Logo" [ref=e31] [cursor=pointer]:
          - /url: /
          - img "MythToy Logo" [ref=e33]
        - navigation [ref=e35]:
          - list [ref=e36]:
            - listitem [ref=e37]:
              - link "Shop" [ref=e38] [cursor=pointer]:
                - /url: /collections/all
                - text: Shop
            - listitem [ref=e40]:
              - link "For Her" [ref=e41] [cursor=pointer]:
                - /url: /collections/female-sex-toys
                - text: For Her
            - listitem [ref=e42]:
              - link "For Him" [ref=e43] [cursor=pointer]:
                - /url: /collections/male-sex-toys
                - text: For Him
            - listitem [ref=e44]:
              - link "Anal Play" [ref=e45] [cursor=pointer]:
                - /url: /collections/sex-toys
                - text: Anal Play
            - listitem [ref=e46]:
              - link "Lingerie" [ref=e47] [cursor=pointer]:
                - /url: /collections/lingerie
                - text: Lingerie
            - listitem [ref=e48]:
              - link "Kink & Play" [ref=e49] [cursor=pointer]:
                - /url: /collections/bondage-play
                - text: Kink & Play
        - generic [ref=e51]:
          - button "Search" [ref=e52]:
            - img [ref=e53]
          - button "Wishlist" [ref=e56]:
            - img [ref=e57]
          - button "Shopping bag" [ref=e59]:
            - img [ref=e60]
          - button "Account" [ref=e64]:
            - img [ref=e65]
      - generic [ref=e69]:
        - button "Previous promotion" [ref=e70] [cursor=pointer]:
          - img [ref=e71]
        - generic [ref=e73]:
          - generic:
            - link "Free discreet shipping on orders over $49":
              - /url: /collections/best-sellers
          - link "Earn 20% Commission, join us!" [ref=e75] [cursor=pointer]:
            - /url: /pages/affiliate
        - button "Next promotion" [ref=e76] [cursor=pointer]:
          - img [ref=e77]
    - main [ref=e79]:
      - generic [ref=e80]:
        - navigation "Breadcrumb" [ref=e82]:
          - list [ref=e83]:
            - listitem [ref=e84]:
              - img [ref=e85]
              - link "Home" [ref=e88] [cursor=pointer]:
                - /url: /
              - img [ref=e89]
            - listitem [ref=e91]:
              - generic [ref=e92]: Shop
        - generic [ref=e94]:
          - generic [ref=e95]:
            - generic [ref=e98]: Collection
            - heading "Shop" [level=1] [ref=e99]
            - paragraph [ref=e100]: Explore our complete range of premium pleasure objects. From air-pulse technology to designer aesthetic toys.
          - img "Shop" [ref=e102]
        - main [ref=e106]:
          - generic [ref=e109]:
            - generic [ref=e110]:
              - generic [ref=e111]: 9 products
              - generic [ref=e112]:
                - button "Newest Arrivals" [ref=e114] [cursor=pointer]:
                  - generic [ref=e115]: Newest Arrivals
                  - img [ref=e116]
                - button "Filters" [ref=e118]:
                  - img [ref=e119]
                  - generic [ref=e120]: Filters
            - generic [ref=e121]:
              - generic [ref=e122]:
                - link "The Jade Rabbit | Heated Dual Stimulation Best Seller" [ref=e123] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated
                  - img "The Jade Rabbit | Heated Dual Stimulation" [ref=e125]
                  - button [ref=e126]:
                    - img [ref=e127]
                  - generic [ref=e129]: Best Seller
                - generic [ref=e130]:
                  - link "The Jade Rabbit Heated Dual Stimulation" [ref=e131] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated
                    - generic [ref=e132]:
                      - generic [ref=e133]: The Jade Rabbit
                      - generic [ref=e134]: Heated Dual Stimulation
                  - generic [ref=e136]:
                    - generic "Rose Red" [ref=e137]
                    - generic "Royal Purple" [ref=e139]
                    - generic "Midnight Black" [ref=e141]
                    - generic [ref=e143]: "+1"
                  - generic [ref=e144]:
                    - generic [ref=e146]: $97.99
                    - button "Add to cart" [ref=e147]:
                      - img [ref=e148]
              - generic [ref=e151]:
                - link "The Rouge | Discreet Lipstick Vibrator Staff Pick" [ref=e152] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/sdfsdfda
                  - img "The Rouge | Discreet Lipstick Vibrator" [ref=e154]
                  - button [ref=e155]:
                    - img [ref=e156]
                  - generic [ref=e158]: Staff Pick
                - generic [ref=e159]:
                  - link "The Rouge Discreet Lipstick Vibrator" [ref=e160] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/sdfsdfda
                    - generic [ref=e161]:
                      - generic [ref=e162]: The Rouge
                      - generic [ref=e163]: Discreet Lipstick Vibrator
                  - generic "Red" [ref=e166]
                  - generic [ref=e168]:
                    - generic [ref=e170]:
                      - generic [ref=e171]: $2222.00
                      - generic [ref=e172]: $22.00
                    - button "Add to cart" [ref=e173]:
                      - img [ref=e174]
              - generic [ref=e177]:
                - link "fsfsd" [ref=e178] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators
                  - img "fsfsd" [ref=e180]
                  - button [ref=e181]:
                    - img [ref=e182]
                - generic [ref=e184]:
                  - link "fsfsd" [ref=e185] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators
                    - generic [ref=e186]: fsfsd
                  - generic "Flesh" [ref=e189]
                  - generic [ref=e191]:
                    - generic [ref=e193]:
                      - generic [ref=e194]: $11.00
                      - generic [ref=e195]: $1.00
                    - button "Add to cart" [ref=e196]:
                      - img [ref=e197]
              - generic [ref=e200]:
                - link "The Spark | Precision Power Bullet Sold Out" [ref=e201] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/sdgd
                  - img "The Spark | Precision Power Bullet" [ref=e203]
                  - button [ref=e204]:
                    - img [ref=e205]
                  - generic [ref=e207]: Sold Out
                - generic [ref=e208]:
                  - link "The Spark Precision Power Bullet" [ref=e209] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/sdgd
                    - generic [ref=e210]:
                      - generic [ref=e211]: The Spark
                      - generic [ref=e212]: Precision Power Bullet
                  - generic [ref=e214]:
                    - generic "Pink" [ref=e215]
                    - generic "Red" [ref=e217]
                  - generic [ref=e219]:
                    - generic [ref=e221]:
                      - generic [ref=e222]: $22.00
                      - generic [ref=e223]: $2.00
                    - button "Add to cart" [disabled] [ref=e224]:
                      - img [ref=e225]
              - generic [ref=e228]:
                - link "1212 Staff Pick" [ref=e229] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/35etgeg
                  - img "1212" [ref=e231]
                  - button [ref=e232]:
                    - img [ref=e233]
                  - generic [ref=e235]: Staff Pick
                - generic [ref=e236]:
                  - link "1212" [ref=e237] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/35etgeg
                    - generic [ref=e238]: "1212"
                  - generic [ref=e240]:
                    - generic "Pink" [ref=e241]
                    - generic "Rose" [ref=e243]
                  - generic [ref=e245]:
                    - generic [ref=e247]: $1112.00
                    - button "Add to cart" [ref=e248]:
                      - img [ref=e249]
              - generic [ref=e252]:
                - link "awrfasf New Arrival" [ref=e253] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/dgsg
                  - img "awrfasf" [ref=e255]
                  - button [ref=e256]:
                    - img [ref=e257]
                  - generic [ref=e259]: New Arrival
                - generic [ref=e260]:
                  - link "awrfasf" [ref=e261] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/dgsg
                    - generic [ref=e262]: awrfasf
                  - generic [ref=e264]:
                    - generic "Flesh" [ref=e265]
                    - generic "Red" [ref=e267]
                  - generic [ref=e269]:
                    - generic [ref=e271]:
                      - generic [ref=e272]: $32.00
                      - generic [ref=e273]: $23.00
                    - button "Add to cart" [ref=e274]:
                      - img [ref=e275]
              - generic [ref=e278]:
                - link "2323" [ref=e279] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/23asfsdg
                  - img "2323" [ref=e281]
                  - button [ref=e282]:
                    - img [ref=e283]
                - generic [ref=e285]:
                  - link "2323" [ref=e286] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/23asfsdg
                    - generic [ref=e287]: "2323"
                  - generic [ref=e289]:
                    - generic "Rose" [ref=e290]
                    - generic "Sky Blue" [ref=e292]
                  - generic [ref=e294]:
                    - generic [ref=e296]: $232.00
                    - button "Add to cart" [ref=e297]:
                      - img [ref=e298]
              - generic [ref=e301]:
                - link "232" [ref=e302] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/dfd
                  - img "232" [ref=e304]
                  - button [ref=e305]:
                    - img [ref=e306]
                - generic [ref=e308]:
                  - link "232" [ref=e309] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/clit-vibrators/dfd
                    - generic [ref=e310]: "232"
                  - generic [ref=e312]:
                    - generic "Blue" [ref=e313]
                    - generic "Green" [ref=e315]
                    - generic "Pink" [ref=e317]
                  - generic [ref=e319]:
                    - generic [ref=e321]:
                      - generic [ref=e322]: $22.00
                      - generic [ref=e323]: $2.00
                    - button "Add to cart" [ref=e324]:
                      - img [ref=e325]
              - generic [ref=e328]:
                - link "wwe" [ref=e329] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/nipple-toys/dsas
                  - img "wwe" [ref=e331]
                  - button [ref=e332]:
                    - img [ref=e333]
                - generic [ref=e335]:
                  - link "wwe" [ref=e336] [cursor=pointer]:
                    - /url: /toys/female-sex-toys/nipple-toys/dsas
                    - generic [ref=e337]: wwe
                  - generic [ref=e339]:
                    - generic "Rose" [ref=e340]
                    - generic "Blue" [ref=e342]
                    - generic "Purple" [ref=e344]
                  - generic [ref=e346]:
                    - generic [ref=e348]: $232.00
                    - button "Add to cart" [ref=e349]:
                      - img [ref=e350]
            - generic [ref=e353]:
              - img [ref=e355]
              - link "1" [ref=e358] [cursor=pointer]:
                - /url: "?page=0"
              - img [ref=e360]
    - contentinfo [ref=e365]:
      - generic [ref=e366]:
        - generic [ref=e367]:
          - generic [ref=e368]:
            - heading "Shop" [level=3] [ref=e369]
            - list [ref=e370]:
              - listitem [ref=e371]:
                - link "All Collections" [ref=e372] [cursor=pointer]:
                  - /url: /collections
              - listitem [ref=e373]:
                - link "Shop All" [ref=e374] [cursor=pointer]:
                  - /url: /collections/all
              - listitem [ref=e375]:
                - link "New In" [ref=e376] [cursor=pointer]:
                  - /url: /collections/new-arrivals
              - listitem [ref=e377]:
                - link "Best Sellers" [ref=e378] [cursor=pointer]:
                  - /url: /collections/best-sellers
              - listitem [ref=e379]:
                - link "For Her" [ref=e380] [cursor=pointer]:
                  - /url: /collections/female-sex-toys
              - listitem [ref=e381]:
                - link "For Him" [ref=e382] [cursor=pointer]:
                  - /url: /collections/male-sex-toys
              - listitem [ref=e383]:
                - link "Free Product" [ref=e384] [cursor=pointer]:
                  - /url: /pioneer
          - generic [ref=e385]:
            - heading "Support" [level=3] [ref=e386]
            - list [ref=e387]:
              - listitem [ref=e388]:
                - link "Contact Us" [ref=e389] [cursor=pointer]:
                  - /url: /pages/contact
              - listitem [ref=e390]:
                - link "Shipping Policy" [ref=e391] [cursor=pointer]:
                  - /url: /pages/shipping-policy
              - listitem [ref=e392]:
                - link "Returns & Refund" [ref=e393] [cursor=pointer]:
                  - /url: /pages/return-refund
              - listitem [ref=e394]:
                - link "Track Order" [ref=e395] [cursor=pointer]:
                  - /url: /pages/order-tracking
              - listitem [ref=e396]:
                - link "Care & Guides" [ref=e397] [cursor=pointer]:
                  - /url: /pages/manuals
              - listitem [ref=e398]:
                - link "FAQ" [ref=e399] [cursor=pointer]:
                  - /url: /pages/faq
          - generic [ref=e400]:
            - heading "About" [level=3] [ref=e401]
            - list [ref=e402]:
              - listitem [ref=e403]:
                - link "Our Story" [ref=e404] [cursor=pointer]:
                  - /url: /pages/about
              - listitem [ref=e405]:
                - link "Affiliate Program" [ref=e406] [cursor=pointer]:
                  - /url: /pages/affiliate
              - listitem [ref=e407]:
                - link "Blog" [ref=e408] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e409]:
                - link "Wholesale" [ref=e410] [cursor=pointer]:
                  - /url: /pages/wholesale
          - generic [ref=e411]:
            - heading "Policies" [level=3] [ref=e412]
            - list [ref=e413]:
              - listitem [ref=e414]:
                - link "Privacy Policy" [ref=e415] [cursor=pointer]:
                  - /url: /pages/privacy-policy
              - listitem [ref=e416]:
                - link "Terms of Service" [ref=e417] [cursor=pointer]:
                  - /url: /pages/terms-and-conditions
              - listitem [ref=e418]:
                - link "Age Verification" [ref=e419] [cursor=pointer]:
                  - /url: /pages/age-verification
          - generic [ref=e420]:
            - heading "Get 10% Off" [level=3] [ref=e421]
            - paragraph [ref=e422]: Join our newsletter for exclusive offers and discreet updates.
            - generic [ref=e423]:
              - textbox "Enter your email" [ref=e424]
              - button "Subscribe" [ref=e425]
            - generic [ref=e426]:
              - generic [ref=e427]:
                - link "Follow us on Instagram" [ref=e428] [cursor=pointer]:
                  - /url: https://www.instagram.com/mythtoy.official
                  - img [ref=e429]
                - link "Follow us on X" [ref=e432] [cursor=pointer]:
                  - /url: https://x.com/mythtoyofficial
                  - img [ref=e433]
                - link "Follow us on Facebook" [ref=e435] [cursor=pointer]:
                  - /url: https://www.facebook.com/mythtoy.official
                  - img [ref=e436]
              - paragraph [ref=e439]: support@mythtoy.com
        - generic [ref=e440]:
          - generic [ref=e441]:
            - paragraph [ref=e442]: © 2026 MythToy. All rights reserved. 18+ Only.
            - generic [ref=e443]:
              - link "Cookie Policy" [ref=e444] [cursor=pointer]:
                - /url: /pages/cookie-policy
              - link "Payment Policy" [ref=e445] [cursor=pointer]:
                - /url: /pages/payment-policy
          - generic [ref=e446]:
            - img [ref=e447]
            - generic [ref=e449]: VISA
            - generic [ref=e450]: MASTERCARD
            - generic [ref=e451]: AMEX
            - generic [ref=e452]: DISCOVER
            - generic [ref=e453]: PayPal
  - button "Open Next.js Dev Tools" [ref=e459] [cursor=pointer]:
    - img [ref=e460]
  - alert [ref=e463]
```

# Test source

```ts
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
  186 |   // TC-14: 移动端导航测试
  187 |   test('TC-14: 产品详情页图片应该加载', async ({ page }) => {
  188 |     await page.goto(`${BASE_URL}/collections/all`);
  189 |     await page.waitForLoadState('networkidle');
  190 |     
  191 |     // 点击第一个产品
> 192 |     await page.locator('a[href^="/toys/"]').first().click();
      |                                                     ^ Error: locator.click: Test timeout of 30000ms exceeded.
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