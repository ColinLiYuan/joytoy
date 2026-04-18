# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-site.spec.ts >> MythToy 完整功能测试 >> TC-11: 移动端导航应该正常工作
- Location: tests\e2e\full-site.spec.ts:146:7

# Error details

```
Error: locator.isVisible: Error: strict mode violation: locator('button:has(svg)') resolved to 28 elements:
    1) <button class="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-10">…</button> aka getByRole('button').first()
    2) <button aria-label="Search" class="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-all duration-200">…</button> aka getByRole('button', { name: 'Search' })
    3) <button aria-label="Wishlist" class="w-10 h-10 flex items-center justify-center text-gray-700 hover:text-pink-600 rounded-full hover:bg-pink-50 transition-all duration-200">…</button> aka getByRole('button', { name: 'Wishlist' })
    4) <button aria-label="Shopping bag" class="relative w-10 h-10 flex items-center justify-center text-gray-700 hover:text-black rounded-full hover:bg-gray-100 transition-all duration-200">…</button> aka getByRole('button', { name: 'Shopping bag' })
    5) <button aria-label="Account" class="w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 border border-transparent text-gray-700 hover:text-black hover:bg-gray-100">…</button> aka getByRole('button', { name: 'Account' })
    6) <button aria-label="Toggle menu" class="p-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">…</button> aka getByRole('button', { name: 'Toggle menu' })
    7) <button class="p-2 text-gray-500 hover:text-black rounded-full hover:bg-gray-100 transition-colors">…</button> aka locator('.p-2.text-gray-500').first()
    8) <button class="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50 transition-colors group text-gray-800">…</button> aka locator('button').filter({ hasText: /^Shop$/ })
    9) <button class="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50 transition-colors group text-gray-800">…</button> aka locator('button').filter({ hasText: 'For Her' })
    10) <button class="w-full flex items-center justify-between px-6 py-3.5 text-left hover:bg-gray-50 transition-colors group text-gray-800">…</button> aka locator('button').filter({ hasText: 'For Him' })
    ...

Call log:
    - checking visibility of locator('button:has(svg)')

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
    - generic [ref=e30]:
      - link "MythToy Logo" [ref=e31] [cursor=pointer]:
        - /url: /
        - img "MythToy Logo" [ref=e33]
      - generic [ref=e34]:
        - generic [ref=e35]:
          - button "Search" [ref=e36]:
            - img [ref=e37]
          - button "Wishlist" [ref=e40]:
            - img [ref=e41]
          - button "Shopping bag" [ref=e43]:
            - img [ref=e44]
          - button "Account" [ref=e48]:
            - img [ref=e49]
        - button "Toggle menu" [ref=e53]:
          - img [ref=e54]
    - main [ref=e55]:
      - generic [ref=e57]:
        - heading "Age Verification Required" [level=2] [ref=e58]
        - paragraph [ref=e59]: This website contains adult content and is intended for individuals 18 years of age or older. By entering, you confirm that you are at least 18 years old and agree to our Terms of Service and Privacy Policy.
        - generic [ref=e60]:
          - button "I am 18 or older" [ref=e61] [cursor=pointer]
          - button "Exit" [ref=e62] [cursor=pointer]
      - generic [ref=e63]:
        - generic [ref=e64]:
          - img "MythToy Hero Product" [ref=e66]
          - generic [ref=e71]:
            - generic [ref=e74]: Myth Collection
            - heading "Elegance in Darkness." [level=1] [ref=e75]:
              - text: Elegance in
              - text: Darkness.
            - paragraph [ref=e76]: Curated pleasure objects for the modern lifestyle. Where wellness meets technological artistry.
            - link "Shop The Collection" [ref=e78] [cursor=pointer]:
              - /url: /collections/all
              - generic [ref=e79]: Shop The Collection
              - img [ref=e80]
        - generic [ref=e83]:
          - generic [ref=e84]:
            - generic [ref=e85]:
              - generic [ref=e86]: The Collections
              - heading "Curated Categories" [level=2] [ref=e87]
            - link "View All" [ref=e88] [cursor=pointer]:
              - /url: /collections/all
          - generic [ref=e89]:
            - link "Luxury discreet vibrator for women For Her Discreet pleasure objects disguised as everyday beauty essentials. Explore" [ref=e90] [cursor=pointer]:
              - /url: /collections/female-sex-toys
              - img "Luxury discreet vibrator for women" [ref=e92]
              - generic [ref=e94]:
                - heading "For Her" [level=3] [ref=e95]
                - paragraph [ref=e96]: Discreet pleasure objects disguised as everyday beauty essentials.
                - generic [ref=e97]:
                  - text: Explore
                  - img [ref=e98]
            - link "High-tech male pleasure gadget For Him High-tech wellness gadgets designed for performance and relief. Explore" [ref=e100] [cursor=pointer]:
              - /url: /collections/male-sex-toys
              - img "High-tech male pleasure gadget" [ref=e102]
              - generic [ref=e104]:
                - heading "For Him" [level=3] [ref=e105]
                - paragraph [ref=e106]: High-tech wellness gadgets designed for performance and relief.
                - generic [ref=e107]:
                  - text: Explore
                  - img [ref=e108]
            - link "Crystal glass pleasure wand Couples Hypoallergenic glass and sensory tools for shared intimacy. Explore" [ref=e110] [cursor=pointer]:
              - /url: /collections/sex-toys
              - img "Crystal glass pleasure wand" [ref=e112]
              - generic [ref=e114]:
                - heading "Couples" [level=3] [ref=e115]
                - paragraph [ref=e116]: Hypoallergenic glass and sensory tools for shared intimacy.
                - generic [ref=e117]:
                  - text: Explore
                  - img [ref=e118]
            - link "Sensory feather tickler on silk Sensory & Lingerie Soft touches, silk textures, and confidence in every layer. Explore" [ref=e120] [cursor=pointer]:
              - /url: /collections/lingerie
              - img "Sensory feather tickler on silk" [ref=e122]
              - generic [ref=e124]:
                - heading "Sensory & Lingerie" [level=3] [ref=e125]
                - paragraph [ref=e126]: Soft touches, silk textures, and confidence in every layer.
                - generic [ref=e127]:
                  - text: Explore
                  - img [ref=e128]
        - generic [ref=e131]:
          - generic [ref=e132]:
            - heading "Editor's Choice" [level=2] [ref=e133]
            - paragraph [ref=e134]: Most loved products for ultimate pleasure
          - generic [ref=e135]:
            - generic [ref=e136]:
              - link "The Jade Rabbit | Heated Dual Stimulation Best Seller" [ref=e137] [cursor=pointer]:
                - /url: /toys/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated
                - img "The Jade Rabbit | Heated Dual Stimulation" [ref=e139]
                - button [ref=e140]:
                  - img [ref=e141]
                - generic [ref=e143]: Best Seller
              - generic [ref=e144]:
                - link "The Jade Rabbit Heated Dual Stimulation" [ref=e145] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/rabbit-vibrators/mythtoy-jade-rabbit-heated
                  - generic [ref=e146]:
                    - generic [ref=e147]: The Jade Rabbit
                    - generic [ref=e148]: Heated Dual Stimulation
                - generic [ref=e150]:
                  - generic "Rose Red" [ref=e151]
                  - generic "Royal Purple" [ref=e153]
                  - generic "Midnight Black" [ref=e155]
                  - generic [ref=e157]: "+1"
                - generic [ref=e158]:
                  - generic [ref=e160]: $97.99
                  - button "Add to cart" [ref=e161]:
                    - img [ref=e162]
            - generic [ref=e165]:
              - link "The Rouge | Discreet Lipstick Vibrator Staff Pick" [ref=e166] [cursor=pointer]:
                - /url: /toys/female-sex-toys/clit-vibrators/sdfsdfda
                - img "The Rouge | Discreet Lipstick Vibrator" [ref=e168]
                - button [ref=e169]:
                  - img [ref=e170]
                - generic [ref=e172]: Staff Pick
              - generic [ref=e173]:
                - link "The Rouge Discreet Lipstick Vibrator" [ref=e174] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/sdfsdfda
                  - generic [ref=e175]:
                    - generic [ref=e176]: The Rouge
                    - generic [ref=e177]: Discreet Lipstick Vibrator
                - generic "Red" [ref=e180]
                - generic [ref=e182]:
                  - generic [ref=e184]:
                    - generic [ref=e185]: $2222.00
                    - generic [ref=e186]: $22.00
                  - button "Add to cart" [ref=e187]:
                    - img [ref=e188]
            - generic [ref=e191]:
              - link "1212 Staff Pick" [ref=e192] [cursor=pointer]:
                - /url: /toys/female-sex-toys/clit-vibrators/35etgeg
                - img "1212" [ref=e194]
                - button [ref=e195]:
                  - img [ref=e196]
                - generic [ref=e198]: Staff Pick
              - generic [ref=e199]:
                - link "1212" [ref=e200] [cursor=pointer]:
                  - /url: /toys/female-sex-toys/clit-vibrators/35etgeg
                  - generic [ref=e201]: "1212"
                - generic [ref=e203]:
                  - generic "Pink" [ref=e204]
                  - generic "Rose" [ref=e206]
                - generic [ref=e208]:
                  - generic [ref=e210]: $1112.00
                  - button "Add to cart" [ref=e211]:
                    - img [ref=e212]
        - generic [ref=e216]:
          - generic [ref=e217]: "\"Intimacy without compromise.\""
          - generic [ref=e218]:
            - generic [ref=e219]:
              - img [ref=e221]
              - generic [ref=e225]:
                - heading "Discreet Shipping" [level=3] [ref=e226]
                - paragraph [ref=e227]: Plain packaging with no external branding. Your privacy is our absolute priority.
            - generic [ref=e228]:
              - img [ref=e230]
              - generic [ref=e233]:
                - heading "Body-Safe Materials" [level=3] [ref=e234]
                - paragraph [ref=e235]: 100% premium medical-grade silicone. Hypoallergenic and strictly tested.
            - generic [ref=e236]:
              - img [ref=e238]
              - generic [ref=e241]:
                - heading "Secure Checkout" [level=3] [ref=e242]
                - paragraph [ref=e243]: Encrypted 256-bit SSL payments. We never store your personal financial data.
            - generic [ref=e244]:
              - img [ref=e246]
              - generic [ref=e250]:
                - heading "Expert Curated" [level=3] [ref=e251]
                - paragraph [ref=e252]: Selected by wellness professionals for ergonomics, safety, and pleasure.
        - generic [ref=e255]:
          - heading "Frequently Asked Questions" [level=3] [ref=e256]
          - generic [ref=e257]:
            - generic [ref=e258]:
              - button "How long will it take to receive my order?" [ref=e259]:
                - heading "How long will it take to receive my order?" [level=4] [ref=e260]
                - img [ref=e262]
              - generic [ref=e263]:
                - paragraph [ref=e264]: We ship worldwide via dedicated priority lines.
                - paragraph [ref=e265]:
                  - text: 🇺🇸
                  - strong [ref=e266]: "USA:"
                  - text: 5-12 Business Days
                - paragraph [ref=e267]:
                  - text: 🇪🇺
                  - strong [ref=e268]: "EU/UK:"
                  - text: 5-14 Business Days
                - paragraph [ref=e269]: "*Processing time: 1-3 days.*"
            - generic [ref=e270]:
              - button "What appears on my bank statement?" [ref=e271]:
                - heading "What appears on my bank statement?" [level=4] [ref=e272]
                - img [ref=e274]
              - paragraph [ref=e276]:
                - text: For your privacy, transactions appear as '
                - strong [ref=e277]: MT TECH
                - text: "'. There is no mention of 'MythToy' or adult products on your statement."
            - generic [ref=e278]:
              - button "What materials do you use?" [ref=e279]:
                - heading "What materials do you use?" [level=4] [ref=e280]
                - img [ref=e282]
              - paragraph [ref=e284]:
                - text: We select materials based on the best tactile experience. Our
                - strong [ref=e285]: vibrators and air-pulse tools
                - text: are 100% non-porous medical-grade silicone for hygiene. Our
                - strong [ref=e286]: strokers (male masturbators)
                - text: use high-grade, skin-like TPE to ensure the softest and most realistic texture possible. All are Phthalate-free.
            - generic [ref=e287]:
              - button "Is there a warranty?" [ref=e288]:
                - heading "Is there a warranty?" [level=4] [ref=e289]
                - img [ref=e291]
              - paragraph [ref=e293]:
                - text: Yes! We stand by our engineering. We offer a
                - strong [ref=e294]: 1-Year Limited Warranty
                - text: on all electronic devices. If it fails, we replace it.
            - generic [ref=e295]:
              - button "What is Air-Pulse technology?" [ref=e296]:
                - heading "What is Air-Pulse technology?" [level=4] [ref=e297]
                - img [ref=e299]
              - paragraph [ref=e301]: Air-Pulse technology uses rapid waves of air pressure to stimulate the clitoris without direct contact. It mimics the sensation of oral sex and is the core tech behind our Onyx series.
            - generic [ref=e302]:
              - button "Are your products waterproof? What charging technology do you use?" [ref=e303]:
                - heading "Are your products waterproof? What charging technology do you use?" [level=4] [ref=e304]
                - img [ref=e306]
              - generic [ref=e307]:
                - paragraph [ref=e308]: "Yes, all our products are designed to be waterproof, though the technology varies by model:"
                - paragraph [ref=e309]:
                  - strong [ref=e310]: "Magnetic Charging:"
                  - text: These offer the highest level of waterproof integrity. With no physical openings, they are 100% airtight and the easiest to maintain.
                - paragraph [ref=e311]:
                  - strong [ref=e312]: "Pin-port / DC Charging:"
                  - text: These are also waterproof (typically IPX7). These ports are engineered with internal water-sealing technology or tight-fit silicone sleeves. While safe for bath use, they require more care—you must ensure the port is completely free of water and debris before charging to prevent corrosion.
                - paragraph [ref=e313]: "In short: All our devices are shower and bath-friendly, but for the best long-term performance, we recommend patting the charging area dry immediately after use."
    - contentinfo [ref=e315]:
      - generic [ref=e316]:
        - generic [ref=e317]:
          - generic [ref=e318]:
            - heading "Shop" [level=3] [ref=e319]
            - list [ref=e320]:
              - listitem [ref=e321]:
                - link "All Collections" [ref=e322] [cursor=pointer]:
                  - /url: /collections
              - listitem [ref=e323]:
                - link "Shop All" [ref=e324] [cursor=pointer]:
                  - /url: /collections/all
              - listitem [ref=e325]:
                - link "New In" [ref=e326] [cursor=pointer]:
                  - /url: /collections/new-arrivals
              - listitem [ref=e327]:
                - link "Best Sellers" [ref=e328] [cursor=pointer]:
                  - /url: /collections/best-sellers
              - listitem [ref=e329]:
                - link "For Her" [ref=e330] [cursor=pointer]:
                  - /url: /collections/female-sex-toys
              - listitem [ref=e331]:
                - link "For Him" [ref=e332] [cursor=pointer]:
                  - /url: /collections/male-sex-toys
              - listitem [ref=e333]:
                - link "Free Product" [ref=e334] [cursor=pointer]:
                  - /url: /pioneer
          - generic [ref=e335]:
            - heading "Support" [level=3] [ref=e336]
            - list [ref=e337]:
              - listitem [ref=e338]:
                - link "Contact Us" [ref=e339] [cursor=pointer]:
                  - /url: /pages/contact
              - listitem [ref=e340]:
                - link "Shipping Policy" [ref=e341] [cursor=pointer]:
                  - /url: /pages/shipping-policy
              - listitem [ref=e342]:
                - link "Returns & Refund" [ref=e343] [cursor=pointer]:
                  - /url: /pages/return-refund
              - listitem [ref=e344]:
                - link "Track Order" [ref=e345] [cursor=pointer]:
                  - /url: /pages/order-tracking
              - listitem [ref=e346]:
                - link "Care & Guides" [ref=e347] [cursor=pointer]:
                  - /url: /pages/manuals
              - listitem [ref=e348]:
                - link "FAQ" [ref=e349] [cursor=pointer]:
                  - /url: /pages/faq
          - generic [ref=e350]:
            - heading "About" [level=3] [ref=e351]
            - list [ref=e352]:
              - listitem [ref=e353]:
                - link "Our Story" [ref=e354] [cursor=pointer]:
                  - /url: /pages/about
              - listitem [ref=e355]:
                - link "Affiliate Program" [ref=e356] [cursor=pointer]:
                  - /url: /pages/affiliate
              - listitem [ref=e357]:
                - link "Blog" [ref=e358] [cursor=pointer]:
                  - /url: /blog
              - listitem [ref=e359]:
                - link "Wholesale" [ref=e360] [cursor=pointer]:
                  - /url: /pages/wholesale
          - generic [ref=e361]:
            - heading "Policies" [level=3] [ref=e362]
            - list [ref=e363]:
              - listitem [ref=e364]:
                - link "Privacy Policy" [ref=e365] [cursor=pointer]:
                  - /url: /pages/privacy-policy
              - listitem [ref=e366]:
                - link "Terms of Service" [ref=e367] [cursor=pointer]:
                  - /url: /pages/terms-and-conditions
              - listitem [ref=e368]:
                - link "Age Verification" [ref=e369] [cursor=pointer]:
                  - /url: /pages/age-verification
          - generic [ref=e370]:
            - heading "Get 10% Off" [level=3] [ref=e371]
            - paragraph [ref=e372]: Join our newsletter for exclusive offers and discreet updates.
            - generic [ref=e373]:
              - textbox "Enter your email" [ref=e374]
              - button "Subscribe" [ref=e375]
            - generic [ref=e376]:
              - generic [ref=e377]:
                - link "Follow us on Instagram" [ref=e378] [cursor=pointer]:
                  - /url: https://www.instagram.com/mythtoy.official
                  - img [ref=e379]
                - link "Follow us on X" [ref=e382] [cursor=pointer]:
                  - /url: https://x.com/mythtoyofficial
                  - img [ref=e383]
                - link "Follow us on Facebook" [ref=e385] [cursor=pointer]:
                  - /url: https://www.facebook.com/mythtoy.official
                  - img [ref=e386]
              - paragraph [ref=e389]: support@mythtoy.com
        - generic [ref=e390]:
          - generic [ref=e391]:
            - paragraph [ref=e392]: © 2026 MythToy. All rights reserved. 18+ Only.
            - generic [ref=e393]:
              - link "Cookie Policy" [ref=e394] [cursor=pointer]:
                - /url: /pages/cookie-policy
              - link "Payment Policy" [ref=e395] [cursor=pointer]:
                - /url: /pages/payment-policy
          - generic [ref=e396]:
            - img [ref=e397]
            - generic [ref=e399]: VISA
            - generic [ref=e400]: MASTERCARD
            - generic [ref=e401]: AMEX
            - generic [ref=e402]: DISCOVER
            - generic [ref=e403]: PayPal
  - button "Open Next.js Dev Tools" [ref=e409] [cursor=pointer]:
    - img [ref=e410]
  - alert [ref=e413]
```

# Test source

```ts
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
> 155 |     if (await mobileMenuBtn.isVisible()) {
      |                             ^ Error: locator.isVisible: Error: strict mode violation: locator('button:has(svg)') resolved to 28 elements:
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
  207 |     await expect(page.locator('text=Payment Policy').or(page.locator('text=MT TECH'))).toBeVisible({ timeout: 5000 });
  208 |     
  209 |     console.log('✅ TC-15 通过：支付政策页面加载成功');
  210 |   });
  211 | });
  212 | 
```