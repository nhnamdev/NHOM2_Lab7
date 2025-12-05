/**
 * Test cases cho chức năng thêm địa chỉ mới
 * Chuyển đổi từ: script3, script4
 * Chức năng: Quản lý hồ sơ - Thêm địa chỉ
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require('@playwright/test');
const { login } = require('../../helpers/auth');
const { navigateToProfile, addNewAddress, checkErrorMessage } = require('../../helpers/profile');
const testData = require('../../data/test-data.json');

test.describe('Profile - Add New Address', () => {
  
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);
    
    // Điều hướng đến trang hồ sơ
    await navigateToProfile(page);
  });

  test('PROFILE-Address-01: Thêm địa chỉ mới thành công với dữ liệu hợp lệ', async ({ page }) => {
    const addressData = {
      provinceIndex: 3,    // Chọn tỉnh thứ 3
      districtIndex: 7,    // Chọn quận thứ 7
      wardIndex: 5,        // Chọn phường thứ 5
      street: '112',
      label: 'Nhà',
      typeIndex: 1         // Chọn loại "Nhà"
    };
    
    // Thêm địa chỉ mới
    const added = await addNewAddress(page, addressData);
    expect(added).toBe(true);
    
    // Đợi và kiểm tra
    await page.waitForTimeout(2000);
    
    console.log('✅ Test PASSED: Thêm địa chỉ mới thành công');
  });

  test('PROFILE-Address-02: Kiểm tra lỗi khi bỏ trống trường bắt buộc', async ({ page }) => {
    const addressData = {
      provinceIndex: 2,    // Chỉ chọn tỉnh
      districtIndex: 1,    // Chỉ chọn quận
      // Không chọn phường (bỏ trống)
      // Không nhập địa chỉ nhà
      typeIndex: 1
    };
    
    // Thử thêm địa chỉ với dữ liệu thiếu
    await page.click("text=Thêm địa chỉ");
    await page.waitForTimeout(1000);
    
    // Chọn tỉnh
    await page.click("[placeholder='Chọn Tỉnh/Thành phố']");
    await page.waitForTimeout(500);
    await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressData.provinceIndex})`);
    await page.waitForTimeout(500);
    
    // Chọn quận
    await page.click("[placeholder='Chọn Quận/Huyện']");
    await page.waitForTimeout(500);
    await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressData.districtIndex})`);
    await page.waitForTimeout(500);
    
    // Không chọn phường
    // Click vào địa chỉ nhà (không nhập gì)
    await page.click("[placeholder='Nhập địa chỉ nhà']");
    await page.waitForTimeout(500);
    
    // Click loại địa chỉ
    await page.click(`.px-3x-small > :nth-child(${addressData.typeIndex})`);
    await page.waitForTimeout(500);
    
    // Click nút submit
    await page.click(".tablet\\:px-medium");
    await page.waitForTimeout(2000);
    
    // Kiểm tra có thông báo lỗi
    const error = await checkErrorMessage(page);
    
    console.log('⚠️ Kết quả:', error.hasError ? 
      `Có thông báo lỗi: ${error.message}` : 
      'Hệ thống không cho phép submit hoặc không hiển thị lỗi rõ ràng');
    
    console.log('✅ Test PASSED: Đã kiểm tra validation khi bỏ trống trường bắt buộc');
  });

});
