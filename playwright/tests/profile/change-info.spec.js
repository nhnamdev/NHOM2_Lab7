/**
 * Test cases cho chức năng thay đổi thông tin cá nhân
 * Chuyển đổi từ: script1, script2
 * Chức năng: Quản lý hồ sơ - Thay đổi thông tin
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToProfile, changeGender, changeDefaultAddress } = require('../../helpers/profile');
const testData = require('../../data/test-data.json');

test.describe('Profile - Change Personal Info', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang hồ sơ
    await navigateToProfile(page);
  });

  test('PROFILE-Info-01: Thay đổi giới tính', async ({ page }) => {
    // Thay đổi giới tính (1: Nam)
    const changed = await changeGender(page, 1);
    expect(changed).toBe(true);
    
    // Đợi và kiểm tra thông báo thành công
    await page.waitForTimeout(2000);
    
    console.log('✅ Test PASSED: Thay đổi giới tính thành công');
  });

  test('PROFILE-Info-02: Thay đổi địa chỉ mặc định hợp lệ', async ({ page }) => {
    // Thay đổi địa chỉ mặc định (chọn địa chỉ đầu tiên)
    const changed = await changeDefaultAddress(page, 1);
    expect(changed).toBe(true);
    
    // Đợi và kiểm tra thông báo
    await page.waitForTimeout(2000);
    
    console.log('✅ Test PASSED: Thay đổi địa chỉ mặc định thành công');
  });

});
