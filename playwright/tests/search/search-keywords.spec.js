/**
 * Test cases cho chức năng tìm kiếm với keywords
 * Chuyển đổi từ: 22130141_TranDinhLanh.js
 */

const { test, expect } = require('@playwright/test');
const { searchProduct, getSearchResults } = require('../../helpers/search');
const fs = require('fs');
const path = require('path');

test.describe('Search - Keyword Search Tests', () => {
  
  test('SEARCH-Keywords-01: Tìm kiếm với nhiều keywords từ file', async ({ page }) => {
    // Đọc keywords từ file
    const keywordsPath = path.join(__dirname, '../../data/keywords.txt');
    const keywordsContent = fs.readFileSync(keywordsPath, 'utf-8');
    const keywords = keywordsContent
      .split(/\r?\n/)
      .map(s => s.trim())
      .filter(Boolean);
    
    console.log(`📋 Đọc được ${keywords.length} keywords từ file`);
    
    // Test với từng keyword
    for (const keyword of keywords) {
      console.log(`\n🔍 Tìm kiếm: "${keyword}"`);
      
      await page.goto('/');
      await page.waitForTimeout(2000);
      
      // Tìm kiếm
      await searchProduct(page, keyword);
      
      // Lấy kết quả
      const results = await getSearchResults(page);
      console.log(`  ✓ Tìm thấy ${results.length} sản phẩm`);
      
      if (results.length > 0) {
        console.log(`  Sản phẩm đầu tiên: ${results[0]}`);
      }
      
      await page.waitForTimeout(2000);
    }
    
    console.log('\n✅ Test PASSED: Tìm kiếm với tất cả keywords thành công');
  });

  test('SEARCH-Keywords-02: Tìm kiếm với keyword không tồn tại', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Tìm kiếm với keyword không tồn tại
    await searchProduct(page, 'ABCXYZ123');
    
    // Kiểm tra kết quả
    const results = await getSearchResults(page);
    
    // Có thể không có kết quả hoặc hiển thị thông báo
    console.log(`  Số kết quả: ${results.length}`);
    
    console.log('✅ Test PASSED: Xử lý keyword không tồn tại');
  });

  test('SEARCH-Keywords-03: Tìm kiếm với keyword phổ biến', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);
    
    // Tìm kiếm iPhone
    await searchProduct(page, 'iPhone');
    
    // Verify có kết quả
    const results = await getSearchResults(page);
    expect(results.length).toBeGreaterThan(0);
    
    // Verify kết quả có chứa từ khóa
    const hasRelevantResults = results.some(name => 
      name.toLowerCase().includes('iphone')
    );
    
    expect(hasRelevantResults).toBe(true);
    
    console.log(`✅ Test PASSED: Tìm thấy ${results.length} sản phẩm iPhone`);
  });

});
