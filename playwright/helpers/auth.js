/**
 * Helper functions cho authentication (đăng nhập/đăng xuất)
 */

const { closeAds, waitForPageLoad } = require('./common');

/**
 * Đăng nhập vào hệ thống
 */
async function login(page, phone, password) {
  console.log('🔐 Bắt đầu đăng nhập...');
  
  try {
    // Vào trang đăng nhập
    await page.goto('https://smember.com.vn/login?action=login&client_id=cps&redirect_uri=https%3A%2F%2Fcellphones.com.vn%2Fcart&response_type=authorization_code');
    await page.waitForTimeout(2000);
    
    // Đóng quảng cáo nếu có
    await closeAds(page);
    
    // Nhập số điện thoại
    await page.fill("[placeholder='Nhập số điện thoại của bạn']", phone);
    console.log(`  ✓ Đã nhập số điện thoại: ${phone}`);
    
    // Nhập mật khẩu
    await page.fill("[type='password']", password);
    console.log('  ✓ Đã nhập mật khẩu');
    
    // Click nút đăng nhập
    await page.click("[type='submit']");
    console.log('  ✓ Đã click nút đăng nhập');
    
    // Đợi chuyển trang
    await page.waitForTimeout(5000);
    
    // Quay về trang chủ
    await page.goto('https://cellphones.com.vn/');
    await page.waitForTimeout(3000);
    
    console.log('✅ Đăng nhập thành công!');
    return true;
    
  } catch (error) {
    console.error('❌ Lỗi khi đăng nhập:', error.message);
    throw error;
  }
}

/**
 * Kiểm tra đã đăng nhập chưa
 */
async function isLoggedIn(page) {
  try {
    // Kiểm tra có icon user/account không
    const accountIcon = await page.$('.account-icon, .user-icon, [data-testid="account"]');
    return accountIcon !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Đăng xuất
 */
async function logout(page) {
  try {
    console.log('🚪 Đang đăng xuất...');
    
    // Click vào icon account
    await page.click('.account-icon, .user-icon');
    await page.waitForTimeout(1000);
    
    // Click nút đăng xuất
    await page.click('text=Đăng xuất');
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã đăng xuất');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi đăng xuất:', error.message);
    return false;
  }
}

module.exports = {
  login,
  isLoggedIn,
  logout
};
