/**
 * Test cases cho chức năng xem hóa đơn VAT
 * Chuyển đổi từ: script17
 * Chức năng: Tra cứu lịch sử đơn hàng - Xem hóa đơn VAT
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require("@playwright/test");
const { login } = require("../../helpers/auth");
const {
  navigateToOrderHistory,
  viewVATInvoice,
  hasOrders,
} = require("../../helpers/order-history");
const testData = require("../../data/test-data.json");

test.describe("Order History - VAT Invoice", () => {
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);

    // Điều hướng đến trang lịch sử đơn hàng
    await navigateToOrderHistory(page);
  });

  test("ORDER-VAT-01: Mở và xem hóa đơn VAT của đơn hàng", async ({ page }) => {
    // Kiểm tra có đơn hàng không
    const hasOrder = await hasOrders(page);
    if (!hasOrder) {
      console.log("⚠️ Không có đơn hàng nào để xem hóa đơn VAT");
      test.skip();
    }

    // Thực hiện xem hóa đơn VAT
    await viewVATInvoice(page);

    console.log("✅ Test PASSED: Xem hóa đơn VAT thành công");
  });
});
