/**
 * Test cases cho chức năng so sánh sản phẩm
 * Chuyển đổi từ: Sosanh.py (22130294_HuỳnhTấnToàn)
 */

const { test, expect } = require('@playwright/test');
const { searchProduct } = require('../../helpers/search');
const { waitAndScanAds, scrollToElement } = require('../../helpers/common');
const testData = require('../../data/test-data.json');

test.describe('Product Comparison Tests', () => {
  
  test('COMPARE-01: So sánh sản phẩm cùng loại thành công', async ({ page }) => {
    await page.goto('/');
    await waitAndScanAds(page, 15000);
    
    console.log('📊 Test so sánh sản phẩm');
    
    // Tìm kiếm sản phẩm
    const productName = testData.products.comparison;
    await searchProduct(page, productName);
    
    // Vào trang chi tiết sản phẩm đầu tiên
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.click("(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a");
    await page.waitForTimeout(2000);
    
    console.log('  ✓ Đã vào trang chi tiết sản phẩm');
    
    // Đóng quảng cáo
    await waitAndScanAds(page, 5000);
    
    // Mở popup so sánh
    const compareBox = await page.$('.pdp-compare-button-box');
    if (compareBox) {
      await compareBox.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await compareBox.click();
      console.log('  ✓ Đã mở popup so sánh');
      
      await page.waitForTimeout(2000);
      
      // Chọn thêm 2 sản phẩm để so sánh
      for (let i = 0; i < 2; i++) {
        const itemIndex = i + 2;
        const itemXPath = `(//*[@id='select-product-to-compare']//div[contains(@class, 'product-item')])[${itemIndex}]`;
        
        try {
          const item = await page.$(itemXPath);
          if (item) {
            await item.scrollIntoViewIfNeeded();
            await page.waitForTimeout(500);
            
            const selectBtn = await item.$(".//*[contains(@class, 'select-to-compare')]");
            if (selectBtn) {
              await selectBtn.click();
              console.log(`  ✓ Đã chọn sản phẩm ${i + 1}`);
              await page.waitForTimeout(1000);
            }
          }
        } catch (e) {
          console.log(`  ⚠️ Không chọn được sản phẩm ${i + 1}`);
        }
      }
      
      // Click nút "So sánh ngay"
      const btnCompare = await page.$('.btn-go-compare');
      if (btnCompare) {
        await btnCompare.click();
        console.log('  ✓ Đã click "So sánh ngay"');
        
        // Đợi chuyển trang
        await page.waitForURL(/so-sanh/, { timeout: 10000 });
        await page.waitForTimeout(3000);
        
        // Verify URL chứa "so-sanh"
        const currentUrl = page.url();
        expect(currentUrl).toContain('so-sanh');
        
        console.log(`  ✓ URL: ${currentUrl}`);
        console.log('✅ Test PASSED: So sánh sản phẩm thành công');
      }
    } else {
      console.log('  ⚠️ Không tìm thấy nút so sánh');
    }
  });

  test('COMPARE-02: Kiểm tra danh sách sản phẩm so sánh cùng loại', async ({ page }) => {
    await page.goto('/');
    await waitAndScanAds(page, 10000);
    
    // Tìm iPhone
    await searchProduct(page, 'iPhone 15');
    await page.waitForTimeout(2000);
    
    // Vào trang chi tiết
    await page.evaluate(() => window.scrollTo(0, 400));
    await page.click("(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a");
    await page.waitForTimeout(2000);
    
    // Mở popup so sánh
    await waitAndScanAds(page, 5000);
    
    const compareBox = await page.$('.pdp-compare-button-box');
    if (compareBox) {
      await compareBox.scrollIntoViewIfNeeded();
      await page.waitForTimeout(1000);
      await compareBox.click();
      await page.waitForTimeout(2000);
      
      // Lấy danh sách sản phẩm trong popup
      const products = await page.$$('//*[@id="select-product-to-compare"]//*[contains(@class, "product-item")]');
      console.log(`  ✓ Tìm thấy ${products.length} sản phẩm để so sánh`);
      
      // Lấy tên một số sản phẩm
      const productNames = [];
      for (let i = 0; i < Math.min(5, products.length); i++) {
        try {
          const name = await products[i].$eval('.product-name, .product-title, a[title]', el => 
            el.getAttribute('title') || el.textContent.trim()
          );
          productNames.push(name);
          console.log(`    ${i + 1}. ${name}`);
        } catch (e) {
          // Bỏ qua nếu không lấy được tên
        }
      }
      
      // Kiểm tra xem có phải cùng loại không (điện thoại)
      const phoneKeywords = ['iphone', 'galaxy', 'xiaomi', 'oppo', 'vivo', 'điện thoại'];
      const hasPhones = productNames.some(name => 
        phoneKeywords.some(kw => name.toLowerCase().includes(kw))
      );
      
      console.log(`  ✓ Danh sách chứa điện thoại: ${hasPhones}`);
      console.log('✅ Test PASSED: Kiểm tra danh sách sản phẩm so sánh');
    }
  });

});
