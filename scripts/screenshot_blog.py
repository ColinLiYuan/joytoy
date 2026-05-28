"""Take a full-page screenshot of the blog post at desktop viewport."""
import sys
from playwright.sync_api import sync_playwright

URL = "http://localhost:3000/blog/how-to-use-g-spot-vibrator-beginners-guide"
OUTPUT = "d:/work/Git/Gitee/colin/myth-web/public/screenshots/blog-product-cards.png"

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1920, "height": 1080})
    page.goto(URL, wait_until="networkidle")
    page.wait_for_timeout(2000)  # extra settle time for any lazy-loaded content
    page.screenshot(path=OUTPUT, full_page=True)
    browser.close()
    print(f"Screenshot saved to {OUTPUT}")
