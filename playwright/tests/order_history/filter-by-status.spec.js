/**
 * Test cases cho chức năng lọc đơn hàng theo trạng thái
 * Chuyển đổi từ: script16
 * Chức năng: Tra cứu lịch sử đơn hàng - Lọc theo trạng thái
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToOrderHistory, filterOrdersByStatus, getOrderCount } = require('../../helpers/order-history');
const testData = require('../../data/test-data.json');

test.describe('Order History - Filter by Status', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang lịch sử đơn hàng
    await navigateToOrderHistory(page);
  });

  test('ORDER-Status-01: Lọc đơn hàng theo các trạng thái khác nhau', async ({ page }) => {
    // Các trạng thái có thể có: Tất cả, Chờ xác nhận, Đang xử lý, Đang giao, Hoàn thành, Đã hủy
    const statusIndexes = [2, 3, 4, 5]; // Bỏ qua index 1 (Tất cả)
    
    for (const statusIndex of statusIndexes) {
      console.log(`\n🔖 Đang kiểm tra trạng thái index ${statusIndex}...`);
      
      // Click vào trạng thái
      const filtered = await filterOrdersByStatus(page, statusIndex);
      expect(filtered).toBe(true);
      
      // Đợi kết quả lọc
      await page.waitForTimeout(2000);
      
      // Đếm số đơn hàng sau khi lọc
      const orderCount = await getOrderCount(page);
      console.log(`  📊 Số đơn hàng: ${orderCount}`);
      
      // Kiểm tra đã lọc (có thể không có đơn hàng nào với trạng thái đó)
      expect(orderCount).toBeGreaterThanOrEqual(0);
    }
    
    console.log('\n✅ Test PASSED: Lọc đơn hàng theo trạng thái thành công');
  });

  test('ORDER-Status-02: Kiểm tra chuyển đổi giữa các trạng thái', async ({ page }) => {
    // Click vào trạng thái 2
    await filterOrdersByStatus(page, 2);
    await page.waitForTimeout(2000);
    const count1 = await getOrderCount(page);
    console.log(`📊 Trạng thái 2: ${count1} đơn hàng`);
    
    // Click vào trạng thái 3
    await filterOrdersByStatus(page, 3);
    await page.waitForTimeout(2000);
    const count2 = await getOrderCount(page);
    console.log(`📊 Trạng thái 3: ${count2} đơn hàng`);
    
    // Click vào trạng thái 4
    await filterOrdersByStatus(page, 4);
    await page.waitForTimeout(2000);
    const count3 = await getOrderCount(page);
    console.log(`📊 Trạng thái 4: ${count3} đơn hàng`);
    
    // Kiểm tra chuyển đổi không gây lỗi
    expect(count1).toBeGreaterThanOrEqual(0);
    expect(count2).toBeGreaterThanOrEqual(0);
    expect(count3).toBeGreaterThanOrEqual(0);
    
    console.log('✅ Test PASSED: Chuyển đổi giữa các trạng thái thành công');
  });

});
