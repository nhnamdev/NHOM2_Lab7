/**
 * Helper functions cho tìm kiếm và lọc sản phẩm
 */

const { closeAds } = require('./common');

/**
 * Tìm kiếm sản phẩm
 */
async function searchProduct(page, keyword) {
  console.log(`🔍 Tìm kiếm: "${keyword}"`);
  
  try {
    const searchInput = await page.$("[placeholder='Bạn muốn mua gì hôm nay?']");
    await searchInput.click();
    await searchInput.fill(keyword);
    await page.keyboard.press('Enter');
    
    console.log('  ✓ Đã thực hiện tìm kiếm');
    await page.waitForTimeout(3000);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm:', error.message);
    throw error;
  }
}

/**
 * Lọc sản phẩm theo giá
 */
async function applyPriceFilter(page, minPrice, maxPrice) {
  console.log(`💰 Lọc giá: ${minPrice} - ${maxPrice}`);
  
  try {
    // Mở bộ lọc giá
    await page.click('#filterModule .filter-price .btn-filter');
    await page.waitForTimeout(1000);
    
    // Nhập giá tối thiểu
    if (minPrice) {
      await page.fill('#min-price', minPrice.toString());
      console.log(`  ✓ Đã nhập giá tối thiểu: ${minPrice}`);
    }
    
    // Nhập giá tối đa
    if (maxPrice) {
      await page.fill('#max-price', maxPrice.toString());
      console.log(`  ✓ Đã nhập giá tối đa: ${maxPrice}`);
    }
    
    // Áp dụng bộ lọc
    await page.click('#filterModule .filter-price .button__filter-children-submit');
    console.log('  ✓ Đã áp dụng bộ lọc giá');
    await page.waitForTimeout(3000);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi lọc giá:', error.message);
    throw error;
  }
}

/**
 * Chọn hãng sản phẩm
 */
async function selectBrand(page, brandName) {
  console.log(`🏷️ Chọn hãng: ${brandName}`);
  
  try {
    await page.click(`.brands__content [alt='Điện thoại ${brandName}']`);
    console.log(`  ✓ Đã chọn hãng ${brandName}`);
    await page.waitForTimeout(2000);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi chọn hãng:', error.message);
    throw error;
  }
}

/**
 * Vào danh mục sản phẩm
 */
async function goToCategory(page, categoryUrl) {
  console.log(`📱 Vào danh mục: ${categoryUrl}`);
  
  try {
    await page.click(`a[href='${categoryUrl}']`);
    console.log('  ✓ Đã vào danh mục');
    await page.waitForTimeout(2000);
    
    return true;
  } catch (error) {
    console.error('❌ Lỗi khi vào danh mục:', error.message);
    throw error;
  }
}

/**
 * Lấy danh sách sản phẩm từ kết quả tìm kiếm
 */
async function getSearchResults(page) {
  try {
    // Đợi một trong các selector xuất hiện
    await page.waitForTimeout(2000);
    
    // Thử nhiều selector khác nhau
    const selectors = [
      '.product-item',
      'div[class*="product"]',
      '.product-list .product',
      '[data-product]'
    ];
    
    let products = [];
    for (const selector of selectors) {
      products = await page.$$(selector);
      if (products.length > 0) {
        console.log(`  ✓ Tìm thấy ${products.length} sản phẩm với selector: ${selector}`);
        break;
      }
    }
    
    if (products.length === 0) {
      console.log('  ⚠️ Không tìm thấy sản phẩm nào');
      return [];
    }
    
    const productList = [];
    
    // Lấy tên sản phẩm
    for (const product of products.slice(0, 5)) { // Lấy 5 sản phẩm đầu
      try {
        // Thử nhiều selector cho tên sản phẩm
        let name = null;
        const nameSelectors = [
          '.product-name',
          '.product-title', 
          'h3',
          'a[title]',
          '.title'
        ];
        
        for (const nameSelector of nameSelectors) {
          try {
            const element = await product.$(nameSelector);
            if (element) {
              name = await element.evaluate(el => {
                return el.getAttribute('title') || el.textContent.trim();
              });
              if (name) break;
            }
          } catch (e) {
            continue;
          }
        }
        
        if (name) {
          productList.push(name);
        }
      } catch (e) {
        // Bỏ qua nếu không lấy được tên
      }
    }
    
    console.log(`  ✓ Lấy được ${productList.length} tên sản phẩm`);
    return productList;
  } catch (error) {
    console.error('❌ Lỗi khi lấy kết quả tìm kiếm:', error.message);
    return [];
  }
}

module.exports = {
  searchProduct,
  applyPriceFilter,
  selectBrand,
  goToCategory,
  getSearchResults
};
