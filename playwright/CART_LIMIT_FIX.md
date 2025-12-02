# Cập Nhật: Xử Lý Giới Hạn 3 Sản Phẩm Trong Giỏ Hàng

## Vấn Đề

Giỏ hàng trên Cellphones.com.vn chỉ cho phép tối đa **3 sản phẩm**. Khi chạy nhiều test cases liên tiếp, giỏ hàng có thể vượt quá giới hạn này và gây lỗi.

## Giải Pháp

### 1. Thêm Helper Function `clearCart()`

**File**: `helpers/cart.js`

Thêm function mới để xóa tất cả sản phẩm trong giỏ hàng:

```javascript
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
```

### 2. Thêm `afterEach` Hook Vào Tất Cả Cart Tests

Cập nhật các file test để tự động xóa giỏ hàng sau mỗi test:

#### `tests/cart/add-to-cart.spec.js`
```javascript
test.afterEach(async ({ page }) => {
  // Xóa sạch giỏ hàng sau mỗi test để tránh vượt quá 3 sản phẩm
  await clearCart(page);
});
```

#### `tests/cart/view-cart.spec.js`
```javascript
test.afterEach(async ({ page }) => {
  // Xóa sạch giỏ hàng sau mỗi test
  await clearCart(page);
});
```

#### `tests/cart/update-quantity.spec.js`
```javascript
test.afterEach(async ({ page }) => {
  // Xóa sạch giỏ hàng sau mỗi test
  await clearCart(page);
});
```

### 3. Sửa Lỗi `updateQuantity()` Trả Về `null`

**Vấn đề**: Sau khi click tăng/giảm số lượng, element bị re-render và `getAttribute('value')` trả về `null`.

**Giải pháp**: Sử dụng `page.evaluate()` để lấy giá trị trực tiếp từ DOM:

```javascript
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
```

### 4. Cập Nhật Test Cases Để Handle `null`

Cập nhật tất cả test cases trong `update-quantity.spec.js` để:
- Sử dụng `page.evaluate()` thay vì `$eval()`
- Kiểm tra `null` trước khi so sánh giá trị
- Thêm assertions để verify giá trị không null

**Ví dụ**:
```javascript
test('CART-UpdateQty-01: Tăng số lượng sản phẩm', async ({ page }) => {
  // Lấy số lượng ban đầu
  const initialQuantity = await page.evaluate(() => {
    const input = document.querySelector('.block__product-item .action input');
    return input ? parseInt(input.value) : null;
  });
  
  console.log(`  Số lượng ban đầu: ${initialQuantity}`);
  expect(initialQuantity).not.toBeNull();
  
  // Tăng số lượng
  const newQuantity = await updateQuantity(page, 'increase');
  
  // Verify số lượng tăng
  expect(newQuantity).not.toBeNull();
  expect(newQuantity).toBe(initialQuantity + 1);
  
  console.log(`✅ Test PASSED: Số lượng tăng từ ${initialQuantity} lên ${newQuantity}`);
});
```

## Files Đã Thay Đổi

1. ✅ `helpers/cart.js` - Thêm `clearCart()` function
2. ✅ `helpers/cart.js` - Sửa `updateQuantity()` để lấy giá trị đúng
3. ✅ `tests/cart/add-to-cart.spec.js` - Thêm `afterEach` hook
4. ✅ `tests/cart/view-cart.spec.js` - Thêm `afterEach` hook
5. ✅ `tests/cart/update-quantity.spec.js` - Thêm `afterEach` hook + sửa tests
6. ✅ `tests/cart/delete-item.spec.js` - Thêm note về giới hạn

## Kết Quả

- ✅ Giỏ hàng được xóa sạch sau mỗi test
- ✅ Không bao giờ vượt quá 3 sản phẩm
- ✅ Tests chạy ổn định hơn
- ✅ `updateQuantity()` trả về giá trị chính xác
- ✅ Không còn lỗi `null` khi lấy số lượng

## Cách Chạy Tests

```bash
# Chạy tất cả cart tests
npm run test:cart

# Chạy riêng update quantity tests
npm run test:cart -- tests/cart/update-quantity.spec.js

# Chạy với UI mode để debug
npm run test:ui
```

## Lưu Ý

- Mỗi test case đều tự động xóa giỏ hàng sau khi chạy xong
- Nếu test fail giữa chừng, `afterEach` vẫn chạy để cleanup
- Thời gian đợi đã được tăng lên (2000ms + 500ms) để đảm bảo DOM update hoàn toàn
