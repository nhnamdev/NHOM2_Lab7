/**
 * Test cases cho chức năng thêm sản phẩm vào giỏ hàng
 * Chuyển đổi từ: test_gio_hang.py (22130173_NguyenHoangNam)
 * 
 * LƯU Ý: Giỏ hàng chỉ cho phép tối đa 3 sản phẩm
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { searchAndAddToCart, getCartItemCount, clearCart } = require('../../helpers/cart');
const testData = require('../../data/test-data.json');

test.describe('Cart - Add to Cart Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
  });

  test.afterEach(async ({ page }) => {
    // Xóa sạch giỏ hàng sau mỗi test để tránh vượt quá 3 sản phẩm
    await clearCart(page);
  });

  test('CART-AddToCart-01: Thêm sản phẩm vào giỏ từ trang chi tiết', async ({ page }) => {
    const productName = testData.products.available;
    
    // Thêm sản phẩm vào giỏ
    const added = await searchAndAddToCart(page, productName);
    expect(added).toBe(true);
    
    // Kiểm tra giỏ hàng có sản phẩm
    const itemCount = await getCartItemCount(page);
    expect(itemCount).toBeGreaterThan(0);
    
    console.log('✅ Test PASSED: Thêm sản phẩm vào giỏ thành công');
  });

  test('CART-AddToCart-02: Thêm cùng sản phẩm 2 lần → số lượng tăng', async ({ page }) => {
    const productName = testData.products.available;
    
    // Thêm sản phẩm lần 1
    await searchAndAddToCart(page, productName);
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Thêm sản phẩm lần 2 (cùng sản phẩm)
    await searchAndAddToCart(page, productName);
    
    // Kiểm tra giỏ hàng
    await page.goto('/cart');
    await page.waitForTimeout(2000);
    
    // Lấy số lượng của sản phẩm đầu tiên - sử dụng evaluate
    const quantity = await page.evaluate(() => {
      const input = document.querySelector('.block__product-item .action input');
      return input ? input.value : null;
    });
    
    console.log(`Số lượng sản phẩm = ${quantity}`);
    expect(quantity).not.toBeNull();
    expect(parseInt(quantity)).toBeGreaterThanOrEqual(2);
    
    console.log(`✅ Test PASSED: Số lượng sản phẩm = ${quantity}`);
  });

  test('CART-AddToCart-03: Không hiển thị nút với sản phẩm hết hàng', async ({ page }) => {
    const productName = testData.products.outOfStock;
    
    // Thêm sản phẩm hết hàng
    const added = await searchAndAddToCart(page, productName);
    
    // Verify không thêm được (nút không hiển thị)
    expect(added).toBe(false);
    
    console.log('✅ Test PASSED: Không hiển thị nút thêm vào giỏ với sản phẩm hết hàng');
  });

  test('CART-AddToCart-04: Không hiển thị nút với sản phẩm "Giá Liên Hệ"', async ({ page }) => {
    const productName = testData.products.contactForPrice;
    
    // Thêm sản phẩm giá liên hệ
    const added = await searchAndAddToCart(page, productName);
    
    // Verify không thêm được
    expect(added).toBe(false);
    
    console.log('✅ Test PASSED: Không hiển thị nút thêm vào giỏ với sản phẩm "Giá Liên Hệ"');
  });

});

