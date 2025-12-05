/**
 * Test cases cho chức năng xóa địa chỉ
 * Chuyển đổi từ: script8
 * Chức năng: Quản lý hồ sơ - Xóa địa chỉ
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToProfile, deleteAddress } = require('../../helpers/profile');
const testData = require('../../data/test-data.json');

test.describe('Profile - Delete Address', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang hồ sơ
    await navigateToProfile(page);
  });

  test('PROFILE-Delete-01: Xóa địa chỉ bất kỳ', async ({ page }) => {
    // Xóa địa chỉ đầu tiên
    const deleted = await deleteAddress(page);
    expect(deleted).toBe(true);
    
    await page.waitForTimeout(2000);
    
    console.log('✅ Test PASSED: Xóa địa chỉ thành công');
  });

});
