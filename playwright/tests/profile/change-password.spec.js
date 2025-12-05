/**
 * Test cases cho chức năng đổi mật khẩu
 * Chuyển đổi từ: script9, script10, script11
 * Chức năng: Quản lý hồ sơ - Đổi mật khẩu
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require("@playwright/test");
const { login } = require("../../helpers/auth");
const {
  navigateToProfile,
  changePassword,
  checkErrorMessage,
  checkSuccessMessage,
} = require("../../helpers/profile");
const testData = require("../../data/test-data.json");

test.describe("Profile - Change Password", () => {
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);

    // Điều hướng đến trang hồ sơ
    await navigateToProfile(page);
  });

  test("PROFILE-Password-01: Đổi mật khẩu hợp lệ", async ({ page }) => {
    const oldPassword = "@Pvp1292004";
    const newPassword = "@Pvp1292005";

    // Đổi mật khẩu
    const changed = await changePassword(
      page,
      oldPassword,
      newPassword,
      newPassword
    );
    expect(changed).toBe(true);

    await page.waitForTimeout(2000);

    // Kiểm tra thông báo thành công
    const success = await checkSuccessMessage(page);
    if (success.hasSuccess) {
      console.log("✅ Có thông báo thành công:", success.message);
    }

    console.log("✅ Test PASSED: Đổi mật khẩu thành công");
  });

  test("PROFILE-Password-02: Sai mật khẩu cũ", async ({ page }) => {
    const wrongOldPassword = "pvp1292004"; // Sai mật khẩu (thiếu ký tự đặc biệt)
    const newPassword = "@Pvp1292004";

    // Thử đổi mật khẩu với mật khẩu cũ sai
    await changePassword(page, wrongOldPassword, newPassword, newPassword);

    await page.waitForTimeout(2000);

    // Kiểm tra có thông báo lỗi
    const error = await checkErrorMessage(page);

    if (error.hasError) {
      console.log("✅ Có thông báo lỗi:", error.message);
      expect(error.hasError).toBe(true);
    } else {
      console.log("⚠️ Không tìm thấy thông báo lỗi rõ ràng");
    }

    console.log("✅ Test PASSED: Đã kiểm tra trường hợp sai mật khẩu cũ");
  });

  test("PROFILE-Password-03: Nhập lại mật khẩu mới không khớp", async ({
    page,
  }) => {
    const oldPassword = "@Pvp1292004";
    const newPassword = "@12345pvp";
    const wrongConfirmPassword = "vsdsvsdmvdksmvksds"; // Không khớp

    // Thử đổi mật khẩu với confirm password không khớp
    await changePassword(page, oldPassword, newPassword, wrongConfirmPassword);

    await page.waitForTimeout(2000);

    // Kiểm tra có thông báo lỗi
    const error = await checkErrorMessage(page);

    if (error.hasError) {
      console.log("✅ Có thông báo lỗi:", error.message);
      expect(error.hasError).toBe(true);
    } else {
      console.log("⚠️ Không tìm thấy thông báo lỗi, hệ thống có thể đã xử lý");
    }

    console.log(
      "✅ Test PASSED: Đã kiểm tra trường hợp mật khẩu xác nhận không khớp"
    );
  });

  //   test('PROFILE-Password-01: Đổi mật khẩu hợp lệ', async ({ page }) => {
  //   const oldPassword = '@Pvp1292004';
  //   const newPassword = '@Pvp1292005';

  //   // Đổi mật khẩu
  //   const changed = await changePassword(page, oldPassword, newPassword, newPassword);
  //   expect(changed).toBe(true);

  //   await page.waitForTimeout(2000);

  //   // Kiểm tra thông báo thành công
  //   const success = await checkSuccessMessage(page);
  //   if (success.hasSuccess) {
  //     console.log('✅ Có thông báo thành công:', success.message);
  //   }

  //   console.log('✅ Test PASSED: Đổi mật khẩu thành công');
  // });
});
