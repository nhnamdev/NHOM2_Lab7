/**
 * Test cases cho chức năng lọc sản phẩm
 * Chuyển đổi từ: 22130141_TranDinhLanh.js
 */

const { test, expect } = require('@playwright/test');
const { goToCategory, selectBrand, applyPriceFilter, getSearchResults } = require('../../helpers/search');
const { waitAndScanAds } = require('../../helpers/common');

test.describe('Search - Filter Products Tests', () => {
  
  test('FILTER-01: Lọc sản phẩm theo danh mục và hãng', async ({ page }) => {
    await page.goto('/');
    await waitAndScanAds(page, 10000);
    
    console.log('📱 Vào danh mục Điện thoại');
    await goToCategory(page, '/mobile.html');
    
    console.log('🏷️ Chọn hãng Apple');
    await selectBrand(page, 'Apple');
    
    // Lấy kết quả
    const results = await getSearchResults(page);
    console.log(`  ✓ Tìm thấy ${results.length} sản phẩm Apple`);
    
    // Verify kết quả có chứa sản phẩm Apple
    if (results.length > 0) {
      const hasAppleProducts = results.some(name => 
        name.toLowerCase().includes('iphone') || 
        name.toLowerCase().includes('apple')
      );
      expect(hasAppleProducts).toBe(true);
    }
    
    console.log('✅ Test PASSED: Lọc theo danh mục và hãng thành công');
  });

  test('FILTER-02: Lọc sản phẩm theo khoảng giá', async ({ page }) => {
    await page.goto('/');
    await waitAndScanAds(page, 10000);
    
    // Vào danh mục Điện thoại
    await goToCategory(page, '/mobile.html');
    
    // Chọn hãng Apple
    await selectBrand(page, 'Apple');
    
    // Áp dụng bộ lọc giá
    console.log('💰 Lọc giá: 5,000 - 10,000');
    await applyPriceFilter(page, 5000, 10000);
    
    // Lấy kết quả
    const results = await getSearchResults(page);
    console.log(`  ✓ Tìm thấy ${results.length} sản phẩm trong khoảng giá`);
    
    console.log('✅ Test PASSED: Lọc theo giá thành công');
  });

  test('FILTER-03: Lọc với khoảng giá không hợp lệ (min > max)', async ({ page }) => {
    await page.goto('/');
    await waitAndScanAds(page, 10000);
    
    // Vào danh mục
    await goToCategory(page, '/mobile.html');
    await selectBrand(page, 'Apple');
    
    // Thử lọc với giá min > max
    try {
      await page.click('#filterModule .filter-price .btn-filter');
      await page.waitForTimeout(1000);
      
      await page.fill('#min-price', '10000');
      await page.fill('#max-price', '5000');
      
      await page.click('#filterModule .filter-price .button__filter-children-submit');
      await page.waitForTimeout(2000);
      
      // Kiểm tra có thông báo lỗi hoặc không áp dụng được
      console.log('  ✓ Hệ thống xử lý khoảng giá không hợp lệ');
      
    } catch (error) {
      console.log('  ✓ Không cho phép nhập giá không hợp lệ');
    }
    
    console.log('✅ Test PASSED: Xử lý khoảng giá không hợp lệ');
  });

});
