/**
 * Helper functions cho giỏ hàng
 */

const { closeAds, scrollToElement } = require('./common');

/**
 * Tìm kiếm và thêm sản phẩm vào giỏ hàng
 */
async function searchAndAddToCart(page, productName) {
  console.log(`🛒 Thêm sản phẩm "${productName}" vào giỏ hàng...`);
  
  try {
    // Tìm kiếm sản phẩm
    const searchInput = await page.$("[placeholder='Bạn muốn mua gì hôm nay?']");
    await searchInput.click();
    await page.waitForTimeout(500);
    
    await searchInput.fill(productName);
    console.log(`  ✓ Đã nhập từ khóa: ${productName}`);
    
    // Nhấn Enter để tìm kiếm
    await page.keyboard.press('Enter');
    await page.waitForTimeout(3000);
    
    // Click vào sản phẩm đầu tiên
    await page.click("//div[contains(@class, 'product-item')]//a[@class='product__link button__link']");
    console.log('  ✓ Đã click vào sản phẩm');
    await page.waitForTimeout(2000);
    
    // Đóng quảng cáo nếu có
    await closeAds(page);
    
    // Click nút "Thêm vào giỏ hàng"
    try {
      await page.click('.button-add-to-cart', { timeout: 5000 });
      console.log('  ✓ Đã thêm vào giỏ hàng');
      await page.waitForTimeout(3000);
      
      // Đóng modal nếu có
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      } catch (e) {}
      
      return true;
    } catch (error) {
      console.log('  ⚠ Không có nút "Thêm vào giỏ hàng" (có thể hết hàng hoặc giá liên hệ)');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Lỗi khi thêm sản phẩm:', error.message);
    throw error;
  }
}

/**
 * Lấy số lượng sản phẩm trong giỏ hàng
 */
async function getCartItemCount(page) {
  try {
    await page.goto('https://cellphones.com.vn/cart');
    await page.waitForTimeout(2000);
    
    const items = await page.$$('.block__product-item');
    return items.length;
  } catch (error) {
    return 0;
  }
}

/**
 * Tăng hoặc giảm số lượng sản phẩm
 */
async function updateQuantity(page, action = 'increase', itemIndex = 0) {
  try {
    const selector = action === 'increase' 
      ? '.block__product-item .action .plus'
      : '.block__product-item .action .minus';
    
    const buttons = await page.$$(selector);
    if (buttons[itemIndex]) {
      await buttons[itemIndex].click();
      console.log(`✓ Đã ${action === 'increase' ? 'tăng' : 'giảm'} số lượng`);
      
      // Đợi network request hoàn thành
      await page.waitForTimeout(2000);
      
      // Đợi thêm để đảm bảo DOM đã update
      await page.waitForTimeout(500);
      
      // Lấy số lượng mới - sử dụng evaluate để lấy giá trị chính xác
      const quantity = await page.evaluate((index) => {
        const inputs = document.querySelectorAll('.block__product-item .action input');
        if (inputs[index]) {
          return inputs[index].value;
        }
        return null;
      }, itemIndex);
      
      console.log(`  Số lượng hiện tại: ${quantity}`);
      return quantity ? parseInt(quantity) : null;
    }
    return null;
  } catch (error) {
    console.error('❌ Lỗi khi cập nhật số lượng:', error.message);
    throw error;
  }
}

/**
 * Xóa sản phẩm khỏi giỏ hàng
 */
async function removeItem(page, itemIndex = 0) {
  try {
    const removeButtons = await page.$$('.block__product-item .remove-item');
    if (removeButtons[itemIndex]) {
      await removeButtons[itemIndex].click();
      console.log('✓ Đã xóa sản phẩm khỏi giỏ hàng');
      await page.waitForTimeout(2000);
      return true;
    }
    return false;
  } catch (error) {
    console.error('❌ Lỗi khi xóa sản phẩm:', error.message);
    throw error;
  }
}

/**
 * Lấy thông tin sản phẩm trong giỏ hàng
 */
async function getCartItems(page) {
  try {
    await page.goto('https://cellphones.com.vn/cart');
    await page.waitForTimeout(2000);
    
    const items = await page.$$('.block__product-item');
    const cartItems = [];
    
    for (const item of items) {
      const name = await item.$eval('.product-name a', el => el.textContent.trim());
      const quantity = await item.$eval('.action input', el => el.value);
      
      cartItems.push({ name, quantity: parseInt(quantity) });
    }
    
    return cartItems;
  } catch (error) {
    console.error('❌ Lỗi khi lấy thông tin giỏ hàng:', error.message);
    return [];
  }
}

/**
 * Xóa tất cả sản phẩm trong giỏ hàng
 */
async function clearCart(page) {
  try {
    await page.goto('https://cellphones.com.vn/cart');
    await page.waitForTimeout(2000);
    
    let itemCount = await getCartItemCount(page);
    console.log(`🗑️ Đang xóa ${itemCount} sản phẩm trong giỏ hàng...`);
    
    while (itemCount > 0) {
      await removeItem(page, 0);
      await page.waitForTimeout(1500);
      itemCount = await getCartItemCount(page);
    }
    
    console.log('✓ Đã xóa sạch giỏ hàng');
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi xóa giỏ hàng:', error.message);
    return false;
  }
}

module.exports = {
  searchAndAddToCart,
  getCartItemCount,
  updateQuantity,
  removeItem,
  getCartItems,
  clearCart
};

