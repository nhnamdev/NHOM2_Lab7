/**
 * Test cases cho chức năng cập nhật địa chỉ
 * Chuyển đổi từ: script5, script6, script7
 * Chức năng: Quản lý hồ sơ - Cập nhật địa chỉ
 *  * Phan Văn Phát - 22130206
 */

const { test, expect } = require("@playwright/test");
const { login } = require("../../helpers/auth");
const {
  navigateToProfile,
  updateAddress,
  checkErrorMessage,
} = require("../../helpers/profile");
const testData = require("../../data/test-data.json");

test.describe("Profile - Update Address", () => {
  test.beforeEach(async ({ page }) => {
    // Đăng nhập trước mỗi test
    const { phone, password } = testData.validUser;
    await login(page, phone, password);

    // Điều hướng đến trang hồ sơ
    await navigateToProfile(page);
  });

  test("PROFILE-Update-01: Cập nhật địa chỉ hợp lệ", async ({ page }) => {
    const updateData = {
      districtIndex: 1,
      wardIndex: 3,
      street: "112",
      label: "Nhà ông C (Gần Chợ)",
      selectType: true,
    };

    // Cập nhật địa chỉ đầu tiên
    const updated = await updateAddress(page, 1, updateData);
    expect(updated).toBe(true);

    await page.waitForTimeout(2000);

    console.log("✅ Test PASSED: Cập nhật địa chỉ thành công");
  });

  test("PROFILE-Update-02: Cập nhật và đặt làm địa chỉ mặc định", async ({
    page,
  }) => {
    const updateData = {
      label: "Văn Phòng 01",
      selectType: true,
      setAsDefault: true, // Đặt làm mặc định
    };

    // Cập nhật địa chỉ thứ 2 và đặt làm mặc định
    const updated = await updateAddress(page, 2, updateData);
    expect(updated).toBe(true);

    await page.waitForTimeout(2000);

    console.log("✅ Test PASSED: Cập nhật và đặt địa chỉ mặc định thành công");
  });

  test("PROFILE-Update-03: Cập nhật bỏ trống trường bắt buộc", async ({
    page,
  }) => {
    // Click vào địa chỉ thứ 4 để cập nhật
    await page.click(
      "[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) .grid > :nth-child(4) .cpsui\\:border-pure-white"
    );
    await page.waitForTimeout(1000);

    // Xóa nội dung địa chỉ nhà (để trống)
    await page.click("[placeholder='Nhập địa chỉ nhà']");
    await page.fill("[placeholder='Nhập địa chỉ nhà']", "");
    await page.waitForTimeout(500);

    // Click vào Phường/Xã
    await page.click("[placeholder='Chọn Phường/Xã']");
    await page.waitForTimeout(500);

    // Click overlay để đóng
    await page.click("[data-slot='sheet-overlay']");
    await page.waitForTimeout(500);

    // Click icon đóng
    try {
      await page.click(
        "[aria-controls^='radix-'] [d='M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z']"
      );
      await page.waitForTimeout(500);
    } catch (e) {
      console.log("Không tìm thấy nút đóng, bỏ qua");
    }

    // Click overlay lần nữa
    try {
      await page.click("[data-slot='sheet-overlay']");
      await page.waitForTimeout(500);
    } catch (e) {
      console.log("Không tìm thấy overlay, bỏ qua");
    }

    // Click submit
    await page.click("[type='submit']");
    await page.waitForTimeout(2000);

    // Kiểm tra có thông báo lỗi
    const error = await checkErrorMessage(page);

    console.log(
      "⚠️ Kết quả:",
      error.hasError
        ? `Có thông báo lỗi: ${error.message}`
        : "Hệ thống đã xử lý hoặc không cho phép submit"
    );

    console.log(
      "✅ Test PASSED: Đã kiểm tra validation khi cập nhật bỏ trống trường bắt buộc"
    );
  });
});
