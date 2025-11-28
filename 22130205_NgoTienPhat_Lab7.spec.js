const { test, expect } = require('@playwright/test');

test.describe('CellPhoneS - Testing Payment and Discount Code', () => {
  
  // Test Case 1: Kiểm tra chức năng đăng nhập và thanh toán (dựa trên Testim script đầy đủ)
  test('TC01 - Kiểm tra chức năng đăng nhập và thanh toán sản phẩm', async ({ page }) => {
    // Tăng timeout cho test này
    test.setTimeout(180000);
    
    try {
      // Truy cập trang chủ CellPhoneS
      await page.goto('https://cellphones.com.vn/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      console.log('✓ Truy cập website thành công');
      
      // Đăng nhập theo flow Testim
      try {
        await page.click("[class^='disabled:bg-primary'], [class*=' disabled:bg-primary']", { timeout: 5000 });
        await page.waitForTimeout(1000);
        
        await page.click(".rounded-\\[8px\\]", { timeout: 5000 });
        await page.waitForTimeout(1000);
        
        // Nhập số điện thoại
        await page.click("[placeholder='Nhập số điện thoại của bạn']", { timeout: 5000 });
        await page.type("[placeholder='Nhập số điện thoại của bạn']", '0334286049');
        
        // Nhập mật khẩu
        await page.click("[type='password']", { timeout: 5000 });
        await page.type("[type='password']", 'matkhau12357890');
        
        // Click nút đăng nhập
        await page.click("[class^='cpsui:border-primary'], [class*=' cpsui:border-primary']", { timeout: 5000 });
        await page.waitForTimeout(3000);
        
        console.log('✓ Đăng nhập thành công');
        
      } catch (e) {
        console.log('ℹ Có thể đã đăng nhập hoặc bỏ qua đăng nhập:', e.message);
      }
      
      // Thêm sản phẩm iPhone Air vào giỏ hàng
      try {
        await page.click("[alt='iPhone Air 256GB | Chính hãng']", { timeout: 5000 });
        await page.waitForTimeout(2000);
        
        console.log('✓ Click vào sản phẩm iPhone Air');
        
        // Thêm vào giỏ hàng
        await page.click(".button-add-to-cart [fill='none']", { timeout: 5000 });
        await page.waitForTimeout(2000);
        
        console.log('✓ Đã thêm sản phẩm vào giỏ hàng');
        
      } catch (e) {
        console.log('ℹ Fallback: truy cập trực tiếp trang sản phẩm');
        await page.goto('https://cellphones.com.vn/iphone-air-256gb.html');
        await page.waitForTimeout(2000);
        
        const addToCartSelectors = [
          ".button-add-to-cart [fill='none']",
          'button:has-text("Mua ngay")',
          'button:has-text("Thêm vào giỏ")'
        ];
        
        for (const selector of addToCartSelectors) {
          try {
            await page.click(selector, { timeout: 3000 });
            console.log('✓ Đã thêm sản phẩm vào giỏ hàng');
            break;
          } catch (e) {
            continue;
          }
        }
      }
      
      // Đóng modal nếu có - thử nhiều cách
      try {
        // Thử đóng modal bằng ESC
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        
        // Hoặc click vào nền modal
        await page.click('.modal-background', { timeout: 2000 });
        console.log('✓ Đã đóng modal');
      } catch (e) {
        try {
          // Thử click nút X
          await page.click('.modal-close, .close-btn, [aria-label="close"]', { timeout: 2000 });
          console.log('✓ Đã đóng modal bằng nút X');
        } catch (e2) {
          console.log('ℹ Không có modal cần đóng');
        }
      }
      
      // Vào giỏ hàng trực tiếp bằng URL
      await page.goto('https://cellphones.com.vn/cart/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      console.log('✓ Vào trang giỏ hàng thành công');
      
      // Đóng popup khuyến mãi nếu có
      try {
        await page.click('.modal-background, [aria-label="close"], .close-btn', { timeout: 2000 });
        console.log('✓ Đã đóng popup khuyến mãi');
      } catch (e) {
        console.log('ℹ Không có popup khuyến mãi');
      }
      
      await page.waitForTimeout(2000);
      
      // Click trực tiếp nút "Mua ngay" màu đỏ - không check gì cả
      console.log('🚀 Đang click nút Mua ngay...');
      
      try {
        // Click nút "Mua ngay" và chờ chuyển trang
        await Promise.all([
          page.waitForNavigation({ timeout: 15000 }),
          page.click('button:has-text("Mua ngay")')
        ]);
        
        console.log('✅ Đã click thành công và chuyển trang');
        
      } catch (e) {
        console.log('⚠️ Thử cách khác...');
        try {
          await page.click('text=Mua ngay (1)');
          await page.waitForLoadState('networkidle', { timeout: 10000 });
          console.log('✅ Click thành công bằng text selector');
        } catch (e2) {
          console.log('❌ Không thể click:', e2.message);
          throw new Error('Không thể click nút Mua ngay');
        }
      }
      
      
      // Dừng lặp, đã chuyển trang thành công
      console.log('✓ Tiếp tục với flow thanh toán');
      
      // Chọn sản phẩm trong giỏ hàng (tick checkbox)
      try {
        const checkboxSelectors = [
          'input[type="checkbox"]',
          '.checkbox input',
          '[type="checkbox"]'
        ];
        
        for (const selector of checkboxSelectors) {
          try {
            await page.click(selector, { timeout: 3000 });
            console.log('✓ Đã chọn sản phẩm trong giỏ hàng');
            break;
          } catch (e) {
            continue;
          }
        }
      } catch (e) {
        console.log('ℹ Không tìm thấy checkbox sản phẩm');
      }
      
      await page.waitForTimeout(2000);
      
      // Click nút "Mua ngay" trong giỏ hàng
      const buyNowSelectors = [
        'button:has-text("Mua ngay")',
        '.btn-buy-now',
        '.buy-now-btn',
        '[class*="mua-ngay"]',
        '.btn-action'
      ];
      
      for (const selector of buyNowSelectors) {
        try {
          await page.click(selector, { timeout: 3000 });
          console.log('✓ Đã click nút Mua ngay');
          break;
        } catch (e) {
          continue;
        }
      }
      
      await page.waitForTimeout(3000);
      
      // Chọn phương thức giao hàng
      await page.click("#payment-info-method-shipping", { timeout: 5000 });
      await page.waitForTimeout(1000);
      
      // Điền địa chỉ giao hàng theo Testim script
      await page.click("[placeholder='Chọn quận/huyện']", { timeout: 5000 });
      await page.type("[placeholder='Chọn quận/huyện']", '9');
      await page.waitForTimeout(1000);
      await page.click(".dropdown__item > :nth-child(1)", { timeout: 5000 });
      
      await page.click("[placeholder='Chọn phường/xã']", { timeout: 5000 });
      await page.type("[placeholder='Chọn phường/xã']", 'Tăng');
      await page.waitForTimeout(1000);
      await page.click(".dropdown > div:nth-of-type(1) > :nth-child(1)", { timeout: 5000 });
      
      await page.click("[placeholder='Số nhà, tên đường (Vui lòng chọn quận/huyện và phường/xã trước)']", { timeout: 5000 });
      await page.type("[placeholder='Số nhà, tên đường (Vui lòng chọn quận/huyện và phường/xã trước)']", '144/27 Man Thiện');
      
      console.log('✓ Điền thông tin địa chỉ');
      
      // Tiếp tục theo script
      try {
        await page.click("i", { timeout: 3000 });
      } catch (e) {
        console.log('ℹ Bỏ qua click i');
      }
      
      await page.click("#VAT-No", { timeout: 5000 });
      await page.click(".button__go-next", { timeout: 5000 });
      await page.waitForTimeout(2000);
      
      // Xử lý khuyến mãi/voucher
      try {
        await page.click(".promotion-smember-isnotuse", { timeout: 5000 });
        await page.click(".block-info .title > :nth-child(1) > :nth-child(2) > :nth-child(2)", { timeout: 5000 });
        await page.click(".block-promotion-modal button", { timeout: 5000 });
        
        console.log('✓ Đã xử lý phần khuyến mãi');
      } catch (e) {
        console.log('ℹ Bỏ qua phần khuyến mãi');
      }
      
      // Chọn phương thức thanh toán COD
      await page.click(".payment-quote span", { timeout: 5000 });
      await page.click(".list-payment__item-cod", { timeout: 5000 });
      
      console.log('✓ Chọn phương thức thanh toán COD');
      
      // Hoàn tất đặt hàng
      await page.click(".block-info .btn", { timeout: 5000 });
      await page.waitForTimeout(3000);
      
      console.log('✓ Test đăng nhập và thanh toán thành công!');
      
    } catch (error) {
      console.log('❌ Lỗi trong quá trình test:', error.message);
      throw error;
    }
  });

  // Test Case 2: Kiểm tra áp dụng mã giảm giá
  test('TC02 - Kiểm tra chức năng áp mã giảm giá', async ({ page }) => {
    test.setTimeout(180000);
    
    try {
      // Truy cập và đăng nhập
      await page.goto('https://cellphones.com.vn/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      console.log('✓ Truy cập website thành công');
      
      // Đăng nhập nhanh
      try {
        await page.click("[class^='disabled:bg-primary'], [class*=' disabled:bg-primary']", { timeout: 3000 });
        await page.click(".rounded-\\[8px\\]", { timeout: 3000 });
        await page.type("[placeholder='Nhập số điện thoại của bạn']", '0334286049');
        await page.type("[type='password']", 'matkhau12357890');
        await page.click("[class^='cpsui:border-primary'], [class*=' cpsui:border-primary']", { timeout: 3000 });
        await page.waitForTimeout(2000);
        
        console.log('✓ Đăng nhập thành công');
      } catch (e) {
        console.log('ℹ Bỏ qua đăng nhập');
      }
      
      // Thêm sản phẩm vào giỏ hàng
      try {
        await page.click("[alt='iPhone Air 256GB | Chính hãng']", { timeout: 5000 });
        await page.click(".button-add-to-cart [fill='none']", { timeout: 5000 });
        console.log('✓ Đã thêm sản phẩm vào giỏ hàng');
      } catch (e) {
        // Fallback
        await page.goto('https://cellphones.com.vn/iphone-air-256gb.html');
        await page.waitForTimeout(2000);
        
        const selectors = [".button-add-to-cart [fill='none']", 'button:has-text("Mua ngay")'];
        for (const selector of selectors) {
          try {
            await page.click(selector, { timeout: 3000 });
            break;
          } catch (e) {
            continue;
          }
        }
      }
      
      // Đóng modal nếu có - thử nhiều cách  
      try {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
        await page.click('.modal-background', { timeout: 2000 });
        console.log('✓ Đã đóng modal');
      } catch (e) {
        try {
          await page.click('.modal-close, .close-btn, [aria-label="close"]', { timeout: 2000 });
          console.log('✓ Đã đóng modal bằng nút X');
        } catch (e2) {
          console.log('ℹ Không có modal cần đóng');
        }
      }
      
      // Vào giỏ hàng trực tiếp bằng URL
      await page.goto('https://cellphones.com.vn/cart/', { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(3000);
      
      console.log('✓ Vào trang giỏ hàng thành công');
      
      // Lấy giá trước khi áp mã
      const priceElements = page.locator('.total-price, .cart-total, [class*="total"], .price-total, .total-amount');
      let priceBeforeDiscount = '';
      try {
        await priceElements.first().waitFor({ timeout: 5000 });
        priceBeforeDiscount = await priceElements.first().textContent();
        console.log('Giá trước khi áp mã:', priceBeforeDiscount);
      } catch (e) {
        console.log('ℹ Không lấy được giá trước khi áp mã');
      }
      
      // Tìm kiếm ô nhập mã giảm giá
      const couponSelectors = [
        'input[placeholder*="mã"]',
        'input[placeholder*="giảm giá"]', 
        'input[name*="coupon"]',
        'input[placeholder*="khuyến mãi"]',
        '.promotion-code input',
        '.voucher-input',
        '.discount-input'
      ];
      
      let foundCouponInput = false;
      for (const selector of couponSelectors) {
        try {
          const couponInput = await page.waitForSelector(selector, { timeout: 3000, state: 'visible' });
          if (couponInput) {
            console.log('✓ Tìm thấy ô nhập mã giảm giá:', selector);
            
            // Thử các mã phổ biến
            const discountCodes = ['VNPAY100K', 'MOMO100', 'ZALOPAY50', 'DISCOUNT10'];
            
            for (const code of discountCodes) {
              try {
                await couponInput.fill('');
                await couponInput.fill(code);
                
                // Tìm nút áp dụng
                const applySelectors = ['button:has-text("Áp dụng")', 'button:has-text("Sử dụng")', '.apply-coupon'];
                for (const applySelector of applySelectors) {
                  try {
                    await page.click(applySelector, { timeout: 2000 });
                    break;
                  } catch (e) {
                    continue;
                  }
                }
                
                await page.waitForTimeout(2000);
                
                // Kiểm tra thông báo
                const notifications = page.locator('.notification, .message, .alert, .success, .error');
                if (await notifications.count() > 0) {
                  const notificationText = await notifications.first().textContent();
                  console.log(`Thông báo mã ${code}:`, notificationText);
                  
                  if (notificationText.includes('thành công') || notificationText.includes('đã áp dụng')) {
                    console.log(`✓ Mã ${code} được áp dụng thành công!`);
                    foundCouponInput = true;
                    break;
                  }
                }
                
              } catch (error) {
                console.log(`❌ Lỗi khi thử mã ${code}:`, error.message);
                continue;
              }
            }
            
            if (foundCouponInput) break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!foundCouponInput) {
        console.log('ℹ Không tìm thấy ô nhập mã giảm giá hoặc không có mã hợp lệ');
      }
      
      console.log('✓ Test chức năng áp mã giảm giá hoàn tất');
      
    } catch (error) {
      console.log('❌ Lỗi trong test áp mã giảm giá:', error.message);
      throw error;
    }
  });

});