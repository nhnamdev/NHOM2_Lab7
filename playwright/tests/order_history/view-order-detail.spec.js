/**
 * Test cases cho chức năng xem chi tiết đơn hàng
 * Chuyển đổi từ: script12
 * Chức năng: Tra cứu lịch sử đơn hàng
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToOrderHistory, openFirstOrderDetail, hasOrders } = require('../../helpers/order-history');
const testData = require('../../data/test-data.json');

test.describe('Order History - View Order Detail', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
  });

  test('ORDER-Detail-01: Mở xem chi tiết của một đơn hàng', async ({ page }) => {
    // Điều hướng đến trang lịch sử đơn hàng
    const navigated = await navigateToOrderHistory(page);
    expect(navigated).toBe(true);
    
    // Kiểm tra có đơn hàng không
    const hasOrder = await hasOrders(page);
    if (!hasOrder) {
      console.log('⚠️ Không có đơn hàng nào để xem chi tiết');
      test.skip();
    }
    
    // Mở chi tiết đơn hàng đầu tiên
    const opened = await openFirstOrderDetail(page);
    expect(opened).toBe(true);
    
    // Kiểm tra đã vào trang chi tiết (URL hoặc element)
    await page.waitForTimeout(2000);
    
    // Kiểm tra có hiển thị thông tin chi tiết đơn hàng
    const detailVisible = await page.$('.tablet\\:gap-small, .order-detail, [class*="detail"]');
    expect(detailVisible).toBeTruthy();
    
    console.log('✅ Test PASSED: Xem chi tiết đơn hàng thành công');
  });

});
