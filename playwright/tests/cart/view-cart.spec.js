/**
 * Test cases cho chức năng xem giỏ hàng
 * Chuyển đổi từ: test_gio_hang.py
 * 
 * LƯU Ý: Giỏ hàng chỉ cho phép tối đa 3 sản phẩm
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { searchAndAddToCart, getCartItems, clearCart } = require('../../helpers/cart');
const testData = require('../../data/test-data.json');

test.describe('Cart - View Cart Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
  });

  test.afterEach(async ({ page }) => {
    // Xóa sạch giỏ hàng sau mỗi test
    await clearCart(page);
  });

  test('CART-ViewCart-01: Xem giỏ hàng khi đã có sản phẩm', async ({ page }) => {
    // Thêm sản phẩm vào giỏ
    await searchAndAddToCart(page, testData.products.available);
    
    // Vào trang giỏ hàng
    await page.goto('/cart');
    await page.waitForTimeout(3000);
    
    // Kiểm tra có sản phẩm
    const items = await page.$$('.block__product-item');
    expect(items.length).toBeGreaterThan(0);
    
    // Lấy thông tin sản phẩm đầu tiên
    const productName = await page.$eval('.block__product-item .product-name a', el => el.textContent.trim());
    console.log(`  Sản phẩm đầu tiên: ${productName}`);
    
    expect(productName).toBeTruthy();
    
    console.log(`✅ Test PASSED: Có ${items.length} sản phẩm trong giỏ`);
  });

  test('CART-ViewCart-02: Hiển thị đầy đủ thông tin sản phẩm', async ({ page }) => {
    // Thêm sản phẩm
    await searchAndAddToCart(page, testData.products.available);
    
    // Vào giỏ hàng
    await page.goto('/cart');
    await page.waitForTimeout(2000);
    
    // Kiểm tra các thông tin hiển thị
    const productItem = await page.$('.block__product-item');
    expect(productItem).toBeTruthy();
    
    // Kiểm tra có tên sản phẩm
    const hasName = await productItem.$('.product-name');
    expect(hasName).toBeTruthy();
    
    // Kiểm tra có số lượng
    const hasQuantity = await productItem.$('.action input');
    expect(hasQuantity).toBeTruthy();
    
    // Kiểm tra có nút xóa
    const hasRemoveBtn = await productItem.$('.remove-item');
    expect(hasRemoveBtn).toBeTruthy();
    
    console.log('✅ Test PASSED: Hiển thị đầy đủ thông tin sản phẩm');
  });

});
