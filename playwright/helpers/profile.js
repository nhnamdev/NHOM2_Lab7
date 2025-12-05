/**
 * Helper functions cho Profile Management (Quản lý hồ sơ người dùng)
 */

const { closeAds } = require('./common');

/**
 * Điều hướng đến trang hồ sơ người dùng
 */
async function navigateToProfile(page) {
  console.log('👤 Điều hướng đến trang hồ sơ...');
  
  try {
    await page.goto('https://cellphones.com.vn/');
    await page.waitForTimeout(2000);
    
    // Click vào icon tài khoản
    await page.click('button[data-slot="popover-trigger"]');
    await page.waitForTimeout(1000);
    
    // Click vào menu dropdown
    await page.click(".m-2\\.5");
    await page.waitForTimeout(1000);
    
    // Click vào "Thông tin cá nhân"
    await page.click(".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(10) .font-medium");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã vào trang hồ sơ cá nhân');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi điều hướng đến hồ sơ:', error.message);
    return false;
  }
}

/**
 * Thay đổi giới tính
 */
async function changeGender(page, genderIndex = 1) {
  console.log('🔄 Thay đổi giới tính...');
  
  try {
    // Click vào icon edit giới tính
    await page.click(".mb-1x-small [stroke='currentColor']");
    await page.waitForTimeout(500);
    
    // Click vào dropdown giới tính
    await page.click("[placeholder='Chọn giới tính']");
    await page.waitForTimeout(500);
    
    // Chọn giới tính (1: Nam, 2: Nữ, 3: Khác)
    await page.click(`.cpsui\\:p-2x-small > :nth-child(${genderIndex})`);
    await page.waitForTimeout(500);
    
    // Click nút submit
    await page.click("[type='submit']");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã thay đổi giới tính');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thay đổi giới tính:', error.message);
    return false;
  }
}

/**
 * Thay đổi địa chỉ mặc định
 */
async function changeDefaultAddress(page, addressIndex = 1) {
  console.log('📍 Thay đổi địa chỉ mặc định...');
  
  try {
    // Click vào span để mở dropdown địa chỉ
    await page.click(".mb-1x-small span");
    await page.waitForTimeout(500);
    
    // Click vào dropdown chọn địa chỉ mặc định
    await page.click("[placeholder='Chọn địa chỉ mặc định']");
    await page.waitForTimeout(500);
    
    // Chọn địa chỉ
    await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressIndex})`);
    await page.waitForTimeout(500);
    
    // Click nút submit
    await page.click("[type='submit']");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã thay đổi địa chỉ mặc định');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thay đổi địa chỉ mặc định:', error.message);
    return false;
  }
}

/**
 * Thêm địa chỉ mới
 */
async function addNewAddress(page, addressData) {
  console.log('➕ Thêm địa chỉ mới...');
  
  try {
    // Click vào nút thêm địa chỉ
    await page.click("text=Thêm địa chỉ");
    await page.waitForTimeout(1000);
    
    // Chọn Tỉnh/Thành phố
    if (addressData.provinceIndex) {
      await page.click("[placeholder='Chọn Tỉnh/Thành phố']");
      await page.waitForTimeout(500);
      await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressData.provinceIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Chọn Quận/Huyện
    if (addressData.districtIndex) {
      await page.click("[placeholder='Chọn Quận/Huyện']");
      await page.waitForTimeout(500);
      await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressData.districtIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Chọn Phường/Xã
    if (addressData.wardIndex) {
      await page.click("[placeholder='Chọn Phường/Xã']");
      await page.waitForTimeout(500);
      await page.click(`.cpsui\\:p-2x-small > :nth-child(${addressData.wardIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Nhập địa chỉ nhà
    if (addressData.street) {
      await page.click("[placeholder='Nhập địa chỉ nhà']");
      await page.fill("[placeholder='Nhập địa chỉ nhà']", addressData.street);
      await page.waitForTimeout(500);
    }
    
    // Đặt tên gợi nhớ
    if (addressData.label) {
      await page.click("[placeholder='Đặt tên gợi nhớ']");
      await page.fill("[placeholder='Đặt tên gợi nhớ']", addressData.label);
      await page.waitForTimeout(500);
    }
    
    // Chọn loại địa chỉ (Nhà/Văn phòng)
    if (addressData.typeIndex) {
      await page.click(`.px-3x-small > :nth-child(${addressData.typeIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Click nút submit
    await page.click(".tablet\\:px-medium");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã thêm địa chỉ mới');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi thêm địa chỉ mới:', error.message);
    return false;
  }
}

/**
 * Cập nhật địa chỉ
 */
async function updateAddress(page, addressIndex, updateData) {
  console.log(`✏️ Cập nhật địa chỉ thứ ${addressIndex}...`);
  
  try {
    // Click vào địa chỉ cần cập nhật
    await page.click(`[class^='tablet\\:p'], [class*=' tablet\\:p'] > :nth-child(2) .grid > :nth-child(${addressIndex}) .cpsui\\:border-pure-white`);
    await page.waitForTimeout(1000);
    
    // Cập nhật Quận/Huyện
    if (updateData.districtIndex) {
      await page.click("[placeholder='Chọn Quận/Huyện']");
      await page.waitForTimeout(500);
      await page.click(`.cpsui\\:p-2x-small > :nth-child(${updateData.districtIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Cập nhật Phường/Xã
    if (updateData.wardIndex) {
      await page.click("[placeholder='Chọn Phường/Xã']");
      await page.waitForTimeout(500);
      await page.click(`.cpsui\\:p-2x-small > :nth-child(${updateData.wardIndex})`);
      await page.waitForTimeout(500);
    }
    
    // Cập nhật địa chỉ nhà
    if (updateData.street) {
      await page.click("[placeholder='Nhập địa chỉ nhà']");
      await page.type("[placeholder='Nhập địa chỉ nhà']", updateData.street);
      await page.waitForTimeout(500);
    }
    
    // Cập nhật tên gợi nhớ
    if (updateData.label) {
      await page.click("[placeholder='Đặt tên gợi nhớ']");
      await page.type("[placeholder='Đặt tên gợi nhớ']", updateData.label);
      await page.waitForTimeout(500);
    }
    
    // Click loại địa chỉ nếu có
    if (updateData.selectType) {
      await page.click(".px-3x-small [class^='border-neutral'], [class*=' border-neutral']");
      await page.waitForTimeout(500);
    }
    
    // Đặt làm mặc định nếu cần
    if (updateData.setAsDefault) {
      await page.click("[role='switch']");
      await page.waitForTimeout(500);
    }
    
    // Click nút submit
    await page.click("[type='submit']");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã cập nhật địa chỉ');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật địa chỉ:', error.message);
    return false;
  }
}

/**
 * Xóa địa chỉ
 */
async function deleteAddress(page) {
  console.log('🗑️ Xóa địa chỉ...');
  
  try {
    // Click vào nút Xóa đầu tiên
    await page.locator("text=Xóa").first().click();
    await page.waitForTimeout(1000);
    
    // Xác nhận xóa
    await page.click("text=Xóa địa chỉ");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã xóa địa chỉ');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi xóa địa chỉ:', error.message);
    return false;
  }
}

/**
 * Đổi mật khẩu
 */
async function changePassword(page, oldPassword, newPassword, confirmPassword) {
  console.log('🔐 Đổi mật khẩu...');
  
  try {
    // Click vào phần đổi mật khẩu
    await page.click(".mt-small > :nth-child(1) span");
    await page.waitForTimeout(1000);
    
    // Nhập mật khẩu cũ
    await page.click("[placeholder='Nhập mật khẩu cũ của bạn']");
    await page.type("[placeholder='Nhập mật khẩu cũ của bạn']", oldPassword);
    await page.waitForTimeout(500);
    
    // Nhập mật khẩu mới
    await page.click("[placeholder='Nhập mật khẩu mới của bạn']");
    await page.type("[placeholder='Nhập mật khẩu mới của bạn']", newPassword);
    await page.waitForTimeout(500);
    
    // Click icon hiển thị mật khẩu (nếu có)
    try {
      await page.click(".overflow-auto .flex > :nth-child(3) .cpsui\\:p-1x-small");
      await page.waitForTimeout(300);
    } catch (e) {
      // Không bắt buộc
    }
    
    // Nhập lại mật khẩu mới
    await page.click("[placeholder='Nhập lại mật khẩu mới của bạn']");
    await page.type("[placeholder='Nhập lại mật khẩu mới của bạn']", confirmPassword || newPassword);
    await page.waitForTimeout(500);
    
    // Click nút submit
    await page.click(".tablet\\:px-medium");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã thực hiện đổi mật khẩu');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi đổi mật khẩu:', error.message);
    return false;
  }
}

/**
 * Kiểm tra thông báo lỗi
 */
async function checkErrorMessage(page) {
  try {
    const errorSelectors = [
      '.error',
      '.text-red-500',
      '.text-danger',
      '[class*="error"]',
      '.text-error',
      '[role="alert"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = await page.$(selector);
      if (errorElement) {
        const errorText = await errorElement.textContent();
        if (errorText && errorText.trim()) {
          console.log('⚠️ Phát hiện lỗi:', errorText.trim());
          return { hasError: true, message: errorText.trim() };
        }
      }
    }
    
    return { hasError: false, message: null };
  } catch (error) {
    return { hasError: false, message: null };
  }
}

/**
 * Kiểm tra thông báo thành công
 */
async function checkSuccessMessage(page) {
  try {
    const successSelectors = [
      '.success',
      '.text-green-500',
      '.text-success',
      '[class*="success"]',
      '.notification',
      '.toast'
    ];
    
    for (const selector of successSelectors) {
      const successElement = await page.$(selector);
      if (successElement) {
        const successText = await successElement.textContent();
        if (successText && successText.trim()) {
          console.log('✅ Phát hiện thông báo thành công:', successText.trim());
          return { hasSuccess: true, message: successText.trim() };
        }
      }
    }
    
    return { hasSuccess: false, message: null };
  } catch (error) {
    return { hasSuccess: false, message: null };
  }
}

module.exports = {
  navigateToProfile,
  changeGender,
  changeDefaultAddress,
  addNewAddress,
  updateAddress,
  deleteAddress,
  changePassword,
  checkErrorMessage,
  checkSuccessMessage
};
