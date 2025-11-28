// File tổng hợp các script
"use strict";
const { chromium } = require("playwright");


async function login() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("https://cellphones.com.vn/");
  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".rounded-\\[8px\\]");
  await page.click("[placeholder='Nhập số điện thoại của bạn']");
  await page.type("[placeholder='Nhập số điện thoại của bạn']", "0973038104");
  await page.click("[type='password']");
  await page.type("[type='password']", "@Pvp1292004");
  await page.click(
    "[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']"
  );
  await page.waitForTimeout(2000);
  await context.storageState({ path: "auth.json" });
  console.log("Đã đăng nhập & lưu session vào auth.json");
  // await browser.close();
}

// Chức năng 1: Quản lí thông tin cá nhân

//Cập nhật giới tính hợp lệ
async function script1() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(".mb-1x-small [stroke='currentColor']");
  await page.click("[placeholder='Chọn giới tính']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(1)");
  await page.click("[type='submit']");
  // await browser.close();
}

//Thay đổi địa chỉ mặc định hợp lệ
async function script2() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(".mb-1x-small span");
  await page.click("[placeholder='Chọn địa chỉ mặc định']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(1)");
  await page.click("[type='submit']");
  // await browser.close();
}

//Thêm địa chỉ mới thành công với dữ liệu hợp lệ.
async function script3() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(
    "[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) > :nth-child(1) span"
  );
  await page.click("[aria-controls^='radix-'] [stroke='currentColor']");
  await page.click("text=Thêm địa chỉ");
  await page.click("[placeholder='Chọn Tỉnh/Thành phố']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(3)");
  await page.click("[placeholder='Chọn Quận/Huyện']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(7)");
  await page.click("[placeholder='Chọn Phường/Xã']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(5)");
  await page.click("[placeholder='Nhập địa chỉ nhà']");
  await page.fill("[placeholder='Nhập địa chỉ nhà']", "112");
  await page.click("[placeholder='Đặt tên gợi nhớ']");
  await page.fill("[placeholder='Đặt tên gợi nhớ']", "Nhà");
  await page.click(".px-3x-small > :nth-child(1)");
  await page.click(".tablet\\:px-medium");

  // await browser.close();
}

//Kiểm tra lỗi khi Thêm địa chỉ nhưng bỏ trống các trường bắt buộc. ( Ví dụ tỉnh ...)
async function script4() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click("text=Thêm địa chỉ");
  await page.click("[placeholder='Chọn Tỉnh/Thành phố']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(2)");
  await page.click("[placeholder='Chọn Quận/Huyện']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(1)");
  await page.click("[placeholder='Nhập địa chỉ nhà']");
  await page.click(".px-3x-small > :nth-child(1)");
  await page.click(".tablet\\:px-medium");
}

//Cập nhật địa chỉ hợp lệ
async function script5() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");

  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(
    "[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) .grid > :nth-child(1) .cpsui\\:border-pure-white"
  );
  await page.click("[placeholder='Chọn Quận/Huyện']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(1)");
  await page.click("[placeholder='Chọn Phường/Xã']");
  await page.click(".cpsui\\:p-2x-small > :nth-child(3)");
  await page.click("[placeholder='Nhập địa chỉ nhà']");
  await page.type("[placeholder='Nhập địa chỉ nhà']", "112");
  await page.click("[placeholder='Đặt tên gợi nhớ']");
  await page.type("[placeholder='Đặt tên gợi nhớ']", "Nhà ông C (Gần Chợ)");
  await page.click(
    ".px-3x-small [class^='border-neutral'], [class*=' border-neutral']"
  );
  await page.click("[type='submit']");

  // await browser.close();
}

//Cập nhật và đặt làm địa chỉ mặc định
async function script6() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");

  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(
    "[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) .grid > :nth-child(2) .cpsui\\:border-pure-white"
  );
  await page.click(
    ".px-3x-small [class^='border-neutral'], [class*=' border-neutral']"
  );
  await page.click("[placeholder='Đặt tên gợi nhớ']");
  await page.type("[placeholder='Đặt tên gợi nhớ']", "Văn Phòng 01");
  await page.click("[role='switch']");
  await page.click("[type='submit']");

  // await browser.close();
}

//Cập nhật bỏ trống trường bắt buộc
async function script7() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(
    "[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) .grid > :nth-child(4) .cpsui\\:border-pure-white"
  );
  await page.type("[placeholder='Nhập địa chỉ nhà']", "");
  await page.click("[placeholder='Chọn Phường/Xã']");
  await page.click("[data-slot='sheet-overlay']");
  await page.click(
    "[aria-controls^='radix-'] [d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z']"
  );
  await page.click("[data-slot='sheet-overlay']");
  await page.click("[type='submit']");
  // await browser.close();
}

//Xóa địa chỉ bất kì
async function script8() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .w-full"
  );

  await page.locator("text=Xóa").first().click();
  await page.click("text=Xóa địa chỉ");

  // await browser.close();
}

//Đổi mật khẩu hợp lệ
async function script9() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(".mt-small > :nth-child(1) span");
  await page.click("[placeholder='Nhập mật khẩu cũ của bạn']");
  await page.type("[placeholder='Nhập mật khẩu cũ của bạn']", "@Pvp1292004");
  await page.click("[placeholder='Nhập mật khẩu mới của bạn']");
  await page.type("[placeholder='Nhập mật khẩu mới của bạn']", "@Pvp1292005");
  await page.click(".overflow-auto .flex > :nth-child(3) .cpsui\\:p-1x-small");
  await page.click("[placeholder='Nhập lại mật khẩu mới của bạn']");
  await page.type(
    "[placeholder='Nhập lại mật khẩu mới của bạn']",
    "@Pvp1292005"
  );
  await page.click(".tablet\\:px-medium");
  // await browser.close();
}

//Sai mật khẩu cũ
async function script10() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(".mt-small > :nth-child(1) span");
  await page.click("[placeholder='Nhập mật khẩu cũ của bạn']");
  await page.type("[placeholder='Nhập mật khẩu cũ của bạn']", "pvp1292004");
  await page.click("[placeholder='Nhập mật khẩu mới của bạn']");
  await page.type("[placeholder='Nhập mật khẩu mới của bạn']", "@Pvp1292004");
  await page.click("[placeholder='Nhập lại mật khẩu mới của bạn']");
  await page.type(
    "[placeholder='Nhập lại mật khẩu mới của bạn']",
    "@Pvp1292004"
  );
  await page.click(".tablet\\:px-medium");
  // await browser.close();
}

//Nhập lại mật khẩu mới không khớp
async function script11() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click('button[data-slot="popover-trigger"]');
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium"
  );
  await page.click(".mt-small > :nth-child(1) span");
  await page.click("[placeholder='Nhập mật khẩu cũ của bạn']");
  await page.type("[placeholder='Nhập mật khẩu cũ của bạn']", "@Pvp1292004");
  await page.click("[placeholder='Nhập mật khẩu mới của bạn']");
  await page.type("[placeholder='Nhập mật khẩu mới của bạn']", "@12345pvp");
  await page.click(".overflow-auto .flex > :nth-child(3) .cpsui\\:p-1x-small");
  await page.click("[placeholder='Nhập lại mật khẩu mới của bạn']");
  await page.type(
    "[placeholder='Nhập lại mật khẩu mới của bạn']",
    "vsdsvsdmvdksmvksds"
  );
  await page.click(".tablet\\:px-medium");
  // await browser.close();
}

// =============================================================================
//Chức năng 2: Tra cứu lịch sử đơn hàng

//Mở xem chi tiết của một đơn hàng bất kỳ.
async function script12() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  await page.goto("https://cellphones.com.vn/");

  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );
  await page.click(".tablet\\:gap-small > :nth-child(1) .text-ellipsis");

  // await browser.close();
}

//Kiểm tra lọc đơn hàng theo ngày bắt đầu và ngày kết thúc.
async function script13() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();

  await page.goto("https://cellphones.com.vn/");

  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );

  await page.click("[placeholder='Từ ngày']");

  await page.evaluate(() => {
    const input = document.querySelector("[placeholder='Từ ngày']");
    input.value = "05/12/2023y"; // ép chữ + số
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  await page.click("[placeholder='Đến ngày']");

  await page.evaluate(() => {
    const input = document.querySelector("[placeholder='Đến ngày']");
    input.value = "05/12/2024y"; // ép chữ + số
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // await browser.close();
}

//Kiểm tra khi người dùng nhập ngày nằm ngoài phạm vi hệ thống cho phép.
async function script14() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );
  await page.click("[placeholder='Từ ngày']");
  await page.type("[placeholder='Từ ngày']", "01/10/2010");
  // await browser.close();
}

//Kiểm tra khi người dùng nhập ngày sai định dạng.
async function script15() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });
  const page = await context.newPage();

  await page.goto("https://cellphones.com.vn/");

  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );
  await page.click("[placeholder='Từ ngày']");
  await page.evaluate(() => {
    const input = document.querySelector("[placeholder='Từ ngày']");
    input.value = "01/1m/2yyy"; // <-- chữ và số
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.dispatchEvent(new Event("change", { bubbles: true }));
  });

  // await browser.close();
}

//Kiểm tra lọc đơn hàng theo trạng thái.
async function script16() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );
  await page.click("[dir='ltr'] .w-full > :nth-child(2)");
  await page.click("[dir='ltr'] .w-full > :nth-child(3)");
  await page.click("[dir='ltr'] .w-full > :nth-child(4)");
  await page.click("[dir='ltr'] .w-full > :nth-child(5)");
  // await browser.close();
}

//Kiểm tra chức năng mở hóa đơn VAT của đơn hàng.
async function script17() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click("[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']");

  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium"
  );
  await page.click(
    ".tablet\\:gap-small > :nth-child(1) .tablet\\:flex-row > :nth-child(1) .text-neutral-800"
  );
  await page.click("[type='button']");
  await page.getByText("Xem hóa đơn VAT", { exact: true }).click();
  // await browser.close();
}

//Kiểm tra chức năng “Mua lại” sản phẩm đã mua trong đơn hàng.
async function script18() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext({
    storageState: "auth.json",
  });

  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");
  await page.click(
    "[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']"
  );
  await page.click(".m-2\\.5");
  await page.click(
    ".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .w-full"
  );
  await page.click(".tablet\\:gap-small > :nth-child(1) .text-ellipsis");
  await page.click(".cpsui\\:bg-pure-white");
  await scrollTo(page, 0, 0);
  // await browser.close();
}

async function scrollTo(page, x, y) {
  await page.evaluate(
    ([x, y]) => {
      window.scroll(x, y);
    },
    [x, y]
  );
}
async function main() {
  await login();
  //Các script Test chức năng quản lí thông tin cá nhân
  await script1();
  await script2();
  await script3();
  await script4();
  await script5();
  await script6();
  await script7();
  await script8();
  await script10();
  await script11();
  await script9();

  //Các script Test chức năng Tra cứu lịch sử đơn hàng
  await script12();
  await script13();
  await script14();
  await script15();
  await script16();
  await script17();
  await script18();
}

main();
