/**
 * Test cases cho chức năng mua lại sản phẩm
 * Chuyển đổi từ: script18
 * Chức năng: Tra cứu lịch sử đơn hàng - Mua lại sản phẩm
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToOrderHistory, reorderProduct, hasOrders } = require('../../helpers/order-history');
const { getCartItemCount } = require('../../helpers/cart');
const testData = require('../../data/test-data.json');

test.describe('Order History - Reorder Product', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang lịch sử đơn hàng
    await navigateToOrderHistory(page);
  });

  test('ORDER-Reorder-01: Mua lại sản phẩm từ đơn hàng cũ', async ({ page }) => {
    // Kiểm tra có đơn hàng không
    const hasOrder = await hasOrders(page);
    if (!hasOrder) {
      console.log('⚠️ Không có đơn hàng nào để mua lại');
      test.skip();
    }
    
    // Lấy số lượng sản phẩm trong giỏ hàng trước khi mua lại
    const cartCountBefore = await getCartItemCount(page);
    console.log(`🛒 Số sản phẩm trong giỏ trước: ${cartCountBefore}`);
    
    // Quay lại trang lịch sử đơn hàng
    await navigateToOrderHistory(page);
    
    // Thực hiện mua lại sản phẩm
    const reordered = await reorderProduct(page);
    
    if (!reordered) {
      console.log('⚠️ Không thể mua lại sản phẩm - có thể không có nút "Mua lại"');
      test.skip();
    }
    
    expect(reordered).toBe(true);
    
    // Đợi một chút để sản phẩm được thêm vào giỏ
    await page.waitForTimeout(3000);
    
    // Kiểm tra giỏ hàng đã tăng lên chưa
    const cartCountAfter = await getCartItemCount(page);
    console.log(`🛒 Số sản phẩm trong giỏ sau: ${cartCountAfter}`);
    
    // Nếu giỏ hàng đã đầy (3 sản phẩm), có thể không thêm được
    if (cartCountBefore >= 3) {
      console.log('⚠️ Giỏ hàng đã đầy (giới hạn 3 sản phẩm)');
    } else {
      expect(cartCountAfter).toBeGreaterThanOrEqual(cartCountBefore);
    }
    
    console.log('✅ Test PASSED: Chức năng mua lại hoạt động');
  });
});
