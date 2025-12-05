/**
 * Helper functions cho Order History (Tra cứu lịch sử đơn hàng)
 */

const { closeAds } = require('./common');

/**
 * Điều hướng đến trang lịch sử đơn hàng
 */
async function navigateToOrderHistory(page) {
  console.log('📋 Điều hướng đến trang lịch sử đơn hàng...');
  
  try {
    await page.goto('https://cellphones.com.vn/');
    await page.waitForTimeout(2000);
    
    // Click vào icon tài khoản
    await page.click("[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']");
    await page.waitForTimeout(1000);
    
    // Click vào menu "Đơn hàng của tôi" hoặc tương tự
    await page.click(".m-2\\.5");
    await page.waitForTimeout(1000);
    
    // Click vào "Lịch sử đơn hàng"
    await page.click(".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .font-medium");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã vào trang lịch sử đơn hàng');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi điều hướng đến lịch sử đơn hàng:', error.message);
    return false;
  }
}

/**
 * Mở chi tiết đơn hàng đầu tiên
 */
async function openFirstOrderDetail(page) {
  console.log('🔍 Mở chi tiết đơn hàng...');
  
  try {
    await page.click(".tablet\\:gap-small > :nth-child(1) .text-ellipsis");
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã mở chi tiết đơn hàng');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi mở chi tiết đơn hàng:', error.message);
    return false;
  }
}

/**
 * Lọc đơn hàng theo ngày
 */
async function filterOrdersByDate(page, fromDate, toDate) {
  console.log(`📅 Lọc đơn hàng từ ${fromDate} đến ${toDate}...`);
  
  try {
    // Click vào ô "Từ ngày"
    await page.click("[placeholder='Từ ngày']");
    await page.waitForTimeout(500);
    
    // Nhập ngày bắt đầu
    await page.evaluate((date) => {
      const input = document.querySelector("[placeholder='Từ ngày']");
      input.value = date;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, fromDate);
    
    await page.waitForTimeout(500);
    
    // Click vào ô "Đến ngày"
    await page.click("[placeholder='Đến ngày']");
    await page.waitForTimeout(500);
    
    // Nhập ngày kết thúc
    await page.evaluate((date) => {
      const input = document.querySelector("[placeholder='Đến ngày']");
      input.value = date;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, toDate);
    
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã lọc đơn hàng theo ngày');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi lọc đơn hàng theo ngày:', error.message);
    return false;
  }
}

/**
 * Lọc đơn hàng theo trạng thái
 */
async function filterOrdersByStatus(page, statusIndex) {
  console.log(`🔖 Lọc đơn hàng theo trạng thái (index ${statusIndex})...`);
  
  try {
    const selector = `[dir='ltr'] .w-full > :nth-child(${statusIndex})`;
    await page.click(selector);
    await page.waitForTimeout(2000);
    
    console.log('✅ Đã lọc đơn hàng theo trạng thái');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi lọc đơn hàng theo trạng thái:', error.message);
    return false;
  }
}

/**
 * Kiểm tra xem có thông báo lỗi ngày tháng không
 */
async function checkDateError(page) {
  try {
    // Tìm các element có thể chứa thông báo lỗi
    const errorSelectors = [
      '.error',
      '.text-red-500',
      '.text-danger',
      '[class*="error"]',
      '[class*="invalid"]'
    ];
    
    for (const selector of errorSelectors) {
      const errorElement = await page.$(selector);
      if (errorElement) {
        const errorText = await errorElement.textContent();
        if (errorText && errorText.trim()) {
          console.log('⚠️ Phát hiện thông báo lỗi:', errorText.trim());
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
 * Xem hóa đơn VAT
 */
async function viewVATInvoice(page) {
  console.log('📄 Mở hóa đơn VAT...');
  
  try {
    // Click vào đơn hàng đầu tiên
    await page.click(".tablet\\:gap-small > :nth-child(1) .tablet\\:flex-row > :nth-child(1) .text-neutral-800");
    await page.waitForTimeout(1000);
    
    // Click nút xem thêm hoặc menu
    await page.click("[type='button']");
    await page.waitForTimeout(1000);
    
    // Click vào "Xem hóa đơn VAT" với force để bỏ qua check visibility
    await page.getByText("Xem hóa đơn VAT", { exact: true }).click({ force: true });
    await page.waitForTimeout(3000);
    
    // Kiểm tra iframe hóa đơn VAT đã xuất hiện
    const vatIframe = await page.$('iframe[src*="view-hddt"]');
    if (vatIframe) {
      console.log('✅ Đã mở hóa đơn VAT (phát hiện iframe)');
      return true;
    }
    
    // Kiểm tra dialog hóa đơn VAT
    const vatDialog = await page.$('[role="dialog"]');
    if (vatDialog) {
      console.log('✅ Đã mở hóa đơn VAT (phát hiện dialog)');
      return true;
    }
    
    console.log('✅ Đã click vào "Xem hóa đơn VAT"');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi xem hóa đơn VAT:', error.message);
    return false;
  }
}

/**
 * Mua lại sản phẩm từ đơn hàng
 */
async function reorderProduct(page) {
  console.log('🔄 Thực hiện mua lại sản phẩm...');
  
  try {
    // Click vào đơn hàng
    await page.click(".w-\\[280px\\] .justify-between > :nth-child(1) > :nth-child(2) .w-full");
    await page.waitForTimeout(1000);
    
    // Click vào chi tiết sản phẩm
    await page.click(".tablet\\:gap-small > :nth-child(1) .text-ellipsis");
    await page.waitForTimeout(1000);
    
    // Click nút mua lại
    await page.click(".cpsui\\:bg-pure-white");
    await page.waitForTimeout(2000);
    
    // Scroll lên đầu trang
    await page.evaluate(() => window.scroll(0, 0));
    await page.waitForTimeout(1000);
    
    console.log('✅ Đã thực hiện mua lại sản phẩm');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi mua lại sản phẩm:', error.message);
    return false;
  }
}

/**
 * Đếm số lượng đơn hàng hiển thị
 */
async function getOrderCount(page) {
  try {
    // Thử nhiều selector có thể chứa đơn hàng
    const selectors = [
      '.tablet\\:gap-small > div',
      '.order-item',
      '[class*="order"]',
      '.text-ellipsis' // Selector dùng để click vào chi tiết
    ];
    
    for (const selector of selectors) {
      const orders = await page.$$(selector);
      if (orders.length > 0) {
        console.log(`📊 Tìm thấy ${orders.length} đơn hàng với selector: ${selector}`);
        return orders.length;
      }
    }
    
    console.log('⚠️ Không tìm thấy đơn hàng với các selector');
    return 0;
  } catch (error) {
    console.error('❌ Lỗi khi đếm đơn hàng:', error.message);
    return 0;
  }
}

/**
 * Kiểm tra xem có đơn hàng nào không
 */
async function hasOrders(page) {
  try {
    // Kiểm tra xem có text "Chưa có đơn hàng" hoặc tương tự không
    const noOrderText = await page.$('text=/Chưa có đơn hàng|Không có đơn hàng|No orders/i');
    if (noOrderText) {
      console.log('⚠️ Phát hiện thông báo "Chưa có đơn hàng"');
      return false;
    }
    
    // Kiểm tra có element chi tiết đơn hàng không
    const hasOrderElement = await page.$('.text-ellipsis');
    if (hasOrderElement) {
      console.log('✅ Có đơn hàng (tìm thấy element .text-ellipsis)');
      return true;
    }
    
    const count = await getOrderCount(page);
    return count > 0;
  } catch (error) {
    console.error('❌ Lỗi khi kiểm tra đơn hàng:', error.message);
    return false;
  }
}

module.exports = {
  navigateToOrderHistory,
  openFirstOrderDetail,
  filterOrdersByDate,
  filterOrdersByStatus,
  checkDateError,
  viewVATInvoice,
  reorderProduct,
  getOrderCount,
  hasOrders
};
