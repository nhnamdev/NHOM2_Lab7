/**
 * Helper functions cho xử lý quảng cáo và các hành động chung
 */

/**
 * Đóng popup quảng cáo nếu có
 */
async function closeAds(page) {
  try {
    // Thử đóng quảng cáo kiểu button với SVG path
    const adButtonXPath = "//button[descendant::*[name()='path' and starts-with(@d, 'M19 6.41')]]";
    const adButtons = await page.$$(adButtonXPath);
    
    for (const btn of adButtons) {
      if (await btn.isVisible()) {
        await btn.click();
        console.log('✓ Đã đóng quảng cáo popup');
        await page.waitForTimeout(500);
        return true;
      }
    }
    
    // Thử đóng quảng cáo kiểu cũ
    const oldAdSelectors = ['.cps-popup-close', '.cancel-button', '.modal-close', '[aria-label="close"]'];
    for (const selector of oldAdSelectors) {
      const elements = await page.$$(selector);
      for (const el of elements) {
        if (await el.isVisible()) {
          await el.click();
          console.log('✓ Đã đóng quảng cáo');
          await page.waitForTimeout(500);
          return true;
        }
      }
    }
  } catch (error) {
    // Không có quảng cáo, bỏ qua
  }
  return false;
}

/**
 * Đợi và quét quảng cáo trong khoảng thời gian
 */
async function waitAndScanAds(page, duration = 10000) {
  console.log(`⏳ Đang quét quảng cáo trong ${duration/1000}s...`);
  const endTime = Date.now() + duration;
  
  while (Date.now() < endTime) {
    const closed = await closeAds(page);
    if (closed) {
      console.log('✓ Đã xử lý xong quảng cáo');
      return;
    }
    await page.waitForTimeout(500);
  }
  
  console.log('✓ Không phát hiện quảng cáo');
}

/**
 * Cuộn xuống cuối trang
 */
async function scrollToBottom(page) {
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);
}

/**
 * Cuộn đến element
 */
async function scrollToElement(page, selector) {
  const element = await page.$(selector);
  if (element) {
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  }
}

/**
 * Đợi trang load xong
 */
async function waitForPageLoad(page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1000);
}

/**
 * Nhập text như người thật (từng ký tự)
 */
async function humanTypeText(page, selector, text) {
  const element = await page.$(selector);
  if (element) {
    await element.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    await element.click();
    
    // Xóa text cũ
    await page.keyboard.press('Control+A');
    await page.keyboard.press('Backspace');
    
    // Nhập từng ký tự
    for (const char of text) {
      await page.keyboard.type(char);
      await page.waitForTimeout(Math.random() * 100 + 50); // Random 50-150ms
    }
    
    await page.keyboard.press('Tab');
  }
}

/**
 * Click element với retry
 */
async function clickWithRetry(page, selector, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await page.click(selector, { timeout: 5000 });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await page.waitForTimeout(1000);
    }
  }
  return false;
}

module.exports = {
  closeAds,
  waitAndScanAds,
  scrollToBottom,
  scrollToElement,
  waitForPageLoad,
  humanTypeText,
  clickWithRetry
};
