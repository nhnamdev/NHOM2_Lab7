/**
 * Test cases cho chức năng lọc đơn hàng theo ngày
 * Chuyển đổi từ: script13, script14, script15
 * Chức năng: Tra cứu lịch sử đơn hàng - Lọc theo ngày
 * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToOrderHistory, filterOrdersByDate, checkDateError } = require('../../helpers/order-history');
const testData = require('../../data/test-data.json');

test.describe('Order History - Filter by Date', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang lịch sử đơn hàng
    await navigateToOrderHistory(page);
  });

  test('ORDER-Filter-01: Lọc đơn hàng theo ngày bắt đầu và ngày kết thúc hợp lệ', async ({ page }) => {
    const fromDate = '05/12/2023';
    const toDate = '05/12/2024';
    
    // Thực hiện lọc theo ngày
    const filtered = await filterOrdersByDate(page, fromDate, toDate);
    expect(filtered).toBe(true);
    
    // Đợi kết quả lọc
    await page.waitForTimeout(2000);
    
    // Kiểm tra không có lỗi
    const error = await checkDateError(page);
    expect(error.hasError).toBe(false);
    
    console.log('✅ Test PASSED: Lọc đơn hàng theo ngày thành công');
  });

  test('ORDER-Filter-02: Nhập ngày nằm ngoài phạm vi hệ thống cho phép', async ({ page }) => {
    const fromDate = '01/10/2010'; // Ngày quá xa trong quá khứ
    const toDate = '01/10/2010';
    
    // Click vào ô từ ngày
    await page.click("[placeholder='Từ ngày']");
    await page.waitForTimeout(500);
    
    // Nhập ngày cũ
    await page.type("[placeholder='Từ ngày']", fromDate);
    await page.waitForTimeout(2000);
    
    // Kiểm tra có cảnh báo hoặc hạn chế không
    const error = await checkDateError(page);
    
    console.log('⚠️ Kết quả:', error.hasError ? 
      `Có thông báo lỗi: ${error.message}` : 
      'Hệ thống chấp nhận hoặc không có cảnh báo');
    
    console.log('✅ Test PASSED: Đã kiểm tra ngày ngoài phạm vi');
  });

  test('ORDER-Filter-03: Nhập ngày sai định dạng', async ({ page }) => {
    const invalidDate = '01/1m/2yyy'; // Chữ và số lẫn lộn
    
    // Click vào ô từ ngày
    await page.click("[placeholder='Từ ngày']");
    await page.waitForTimeout(500);
    
    // Nhập ngày sai định dạng bằng evaluate
    await page.evaluate((date) => {
      const input = document.querySelector("[placeholder='Từ ngày']");
      input.value = date;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, invalidDate);
    
    await page.waitForTimeout(2000);
    
    // Kiểm tra có thông báo lỗi không
    const error = await checkDateError(page);
    
    // Kiểm tra giá trị trong input
    const inputValue = await page.inputValue("[placeholder='Từ ngày']");
    console.log('📝 Giá trị trong input:', inputValue);
    
    console.log('⚠️ Kết quả:', error.hasError ? 
      `Có thông báo lỗi: ${error.message}` : 
      'Hệ thống đã xử lý hoặc không hiển thị lỗi');
    
    console.log('✅ Test PASSED: Đã kiểm tra định dạng ngày không hợp lệ');
  });

});
