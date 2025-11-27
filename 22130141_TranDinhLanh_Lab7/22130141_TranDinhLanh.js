"use strict";

const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

// Đọc keyword từ file keyword.txt (mỗi dòng 1 keyword)
function loadKeywords() {
    const filePath = path.join(__dirname, "keyword.txt");
    const raw = fs.readFileSync(filePath, "utf-8");
    return raw
        .split(/\r?\n/)      // tách theo dòng
        .map((s) => s.trim())
        .filter(Boolean);    // bỏ dòng rỗng
}

// Hàm Testim export sẵn – giữ lại để bấm Enter
async function sendSpecialCharacter(page, selector, key) {
    const elementHandle = await page.$(selector);
    await elementHandle.press(key);
}

(async () => {
    try {
        const keywords = loadKeywords();
        console.log("✅ Keywords đọc được từ file:", keywords);

        const browser = await chromium.launch({
            headless: false,   // mở trình duyệt thật
            slowMo: 400        // chạy chậm để dễ quay video
        });

        const context = await browser.newContext();
        const page = await context.newPage();

        // =========================
        // TEST 1: TÌM KIẾM THEO KEYWORD
        // =========================
        for (const keyword of keywords) {
            console.log(`\n=== TEST 1 - SEARCH VỚI KEYWORD: "${keyword}" ===`);

            console.log("Mở trang CellphoneS...");
            await page.goto("https://cellphones.com.vn/", { waitUntil: "load" });

            console.log("Nhập từ khóa tìm kiếm...");
            const searchSelector = "[placeholder='Bạn muốn mua gì hôm nay?']";
            await page.click(searchSelector);
            await page.fill(searchSelector, keyword);

            await sendSpecialCharacter(page, searchSelector, "Enter");

            console.log("Đợi kết quả tìm kiếm...");
            await page.waitForTimeout(4000);
        }

        // =========================
        // TEST 2: VÀO ĐIỆN THOẠI → APPLE → LỌC GIÁ
        // =========================
        console.log("\n=== TEST 2 - VÀO ĐIỆN THOẠI / APPLE / LỌC GIÁ ===");

        // MỞ TRANG
        await page.goto("https://cellphones.com.vn/", { waitUntil: "load" });

        // CLICK ĐIỆN THOẠI
        console.log("Click menu Điện thoại...");
        await page.click("a[href='/mobile.html']");
        await page.waitForTimeout(2000);

        // CLICK APPLE
        console.log("Chọn hãng Apple...");
        await page.click(".brands__content [alt='Điện thoại Apple']");
        await page.waitForTimeout(2000);

        // MỞ BỘ LỌC GIÁ
        console.log("Mở bộ lọc giá...");
        await page.click("#filterModule .filter-price .btn-filter");

        // NHẬP GIÁ TỐI ĐA
        console.log("Nhập max price...");
        await page.fill("#max-price", "10000");

        // NHẬP GIÁ TỐI THIỂU
        console.log("Nhập min price...");
        await page.fill("#min-price", "5000");

        // APPLY PRICE FILTER
        console.log("Áp dụng bộ lọc...");
        await page.click("#filterModule .filter-price .button__filter-children-submit");

        await page.waitForTimeout(5000);

        await browser.close();
        console.log("\n=== HOÀN THÀNH CẢ HAI TEST ===");
    } catch (err) {
        console.error("❌ LỖI:", err);
    }
})();
