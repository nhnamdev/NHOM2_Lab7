/**
 * Test cases cho chức năng cập nhật số lượng sản phẩm
 * Chuyển đổi từ: test_gio_hang.py
 * 
 * LƯU Ý: Giỏ hàng chỉ cho phép tối đa 3 sản phẩm
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { searchAndAddToCart, updateQuantity, clearCart } = require('../../helpers/cart');
const testData = require('../../data/test-data.json');

test.describe('Cart - Update Quantity Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập và thêm sản phẩm vào giỏ
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    await searchAndAddToCart(page, testData.products.available);
    
    // Vào trang giỏ hàng
    await page.goto('/cart');
    await page.waitForTimeout(2000);
  });

  test.afterEach(async ({ page }) => {
    // Xóa sạch giỏ hàng sau mỗi test
    await clearCart(page);
  });

  test('CART-UpdateQty-01: Tăng số lượng sản phẩm', async ({ page }) => {
    // Lấy số lượng ban đầu
    const initialQuantity = await page.evaluate(() => {
      const input = document.querySelector('.block__product-item .action input');
      return input ? parseInt(input.value) : null;
    });
    
    console.log(`  Số lượng ban đầu: ${initialQuantity}`);
    expect(initialQuantity).not.toBeNull();
    
    // Tăng số lượng
    const newQuantity = await updateQuantity(page, 'increase');
    
    // Verify số lượng tăng
    expect(newQuantity).not.toBeNull();
    expect(newQuantity).toBe(initialQuantity + 1);
    
    console.log(`✅ Test PASSED: Số lượng tăng từ ${initialQuantity} lên ${newQuantity}`);
  });

  test('CART-UpdateQty-02: Giảm số lượng sản phẩm', async ({ page }) => {
    // Tăng số lượng lên 2 trước
    await updateQuantity(page, 'increase');
    await page.waitForTimeout(1000);
    
    // Lấy số lượng hiện tại
    const currentQuantity = await page.evaluate(() => {
      const input = document.querySelector('.block__product-item .action input');
      return input ? parseInt(input.value) : null;
    });
    
    console.log(`  Số lượng hiện tại: ${currentQuantity}`);
    expect(currentQuantity).not.toBeNull();
    expect(currentQuantity).toBeGreaterThan(1);
    
    // Giảm số lượng
    const newQuantity = await updateQuantity(page, 'decrease');
    
    // Verify số lượng giảm
    expect(newQuantity).not.toBeNull();
    expect(newQuantity).toBe(currentQuantity - 1);
    
    console.log(`✅ Test PASSED: Số lượng giảm từ ${currentQuantity} xuống ${newQuantity}`);
  });

  test('CART-UpdateQty-03: Không cho giảm số lượng xuống dưới 1', async ({ page }) => {
    // Đảm bảo số lượng là 1
    let currentQuantity = await page.evaluate(() => {
      const input = document.querySelector('.block__product-item .action input');
      return input ? parseInt(input.value) : null;
    });
    
    while (currentQuantity && currentQuantity > 1) {
      await updateQuantity(page, 'decrease');
      await page.waitForTimeout(500);
      currentQuantity = await page.evaluate(() => {
        const input = document.querySelector('.block__product-item .action input');
        return input ? parseInt(input.value) : null;
      });
    }
    
    console.log(`  Số lượng hiện tại: ${currentQuantity}`);
    expect(currentQuantity).toBe(1);
    
    // Thử giảm thêm
    await page.click('.block__product-item .action .minus');
    await page.waitForTimeout(1500);
    
    // Verify số lượng vẫn là 1
    const finalQuantity = await page.evaluate(() => {
      const input = document.querySelector('.block__product-item .action input');
      return input ? parseInt(input.value) : null;
    });
    
    expect(finalQuantity).toBe(1);
    
    console.log('✅ Test PASSED: Không cho giảm số lượng xuống dưới 1');
  });

});
