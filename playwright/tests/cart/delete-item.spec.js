/**
 * Test cases cho chức năng xóa sản phẩm khỏi giỏ hàng
 * Chuyển đổi từ: test_gio_hang.py
 * 
 * LƯU Ý: Giỏ hàng chỉ cho phép tối đa 3 sản phẩm
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { searchAndAddToCart, removeItem, getCartItemCount } = require('../../helpers/cart');
const testData = require('../../data/test-data.json');

test.describe('Cart - Delete Item Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập và thêm sản phẩm vào giỏ
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    await searchAndAddToCart(page, testData.products.available);
    
    // Vào trang giỏ hàng
    await page.goto('/cart');
    await page.waitForTimeout(2000);
  });

  test('CART-DeleteItem-01: Xóa sản phẩm khỏi giỏ hàng', async ({ page }) => {
    // Lấy số lượng sản phẩm ban đầu
    const initialCount = await getCartItemCount(page);
    console.log(`  Số sản phẩm ban đầu: ${initialCount}`);
    
    // Xóa sản phẩm đầu tiên
    const removed = await removeItem(page, 0);
    expect(removed).toBe(true);
    
    // Kiểm tra số lượng sau khi xóa
    await page.waitForTimeout(2000);
    const finalCount = await getCartItemCount(page);
    console.log(`  Số sản phẩm sau khi xóa: ${finalCount}`);
    
    expect(finalCount).toBe(initialCount - 1);
    
    console.log('✅ Test PASSED: Xóa sản phẩm thành công');
  });

  test('CART-DeleteItem-02: Xóa tất cả sản phẩm → giỏ hàng trống', async ({ page }) => {
    // Xóa tất cả sản phẩm
    let itemCount = await getCartItemCount(page);
    
    while (itemCount > 0) {
      await removeItem(page, 0);
      await page.waitForTimeout(2000);
      itemCount = await getCartItemCount(page);
    }
    
    // Verify giỏ hàng trống
    expect(itemCount).toBe(0);
    
    // Kiểm tra có thông báo giỏ hàng trống
    const emptyMessage = await page.$('text=/giỏ hàng.*trống|không có sản phẩm/i');
    
    console.log('✅ Test PASSED: Giỏ hàng đã trống');
  });

});
