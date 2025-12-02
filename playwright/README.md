# Dự Án Playwright Thống Nhất - Cellphones.com.vn

Dự án test automation gộp tất cả test cases từ các thành viên trong nhóm, sử dụng Playwright với báo cáo HTML và JSON.

## 📋 Tổng Quan

Dự án này consolidate tất cả test cases từ:
- **Selenium Python** (3 thành viên): Test giỏ hàng, đăng ký email, so sánh sản phẩm
- **Playwright JavaScript** (4 thành viên): Test đăng nhập, tìm kiếm, thanh toán

## 🚀 Cài Đặt

```bash
# Di chuyển vào thư mục dự án
cd playwright

# Cài đặt dependencies
npm install

# Cài đặt browsers
npx playwright install chromium
```

## 📁 Cấu Trúc Dự Án

```
playwright/
├── tests/                      # Test files
│   ├── auth/                  # Authentication tests
│   ├── cart/                  # Cart management tests
│   ├── search/                # Search & filter tests
│   ├── newsletter/            # Newsletter subscription tests
│   ├── comparison/            # Product comparison tests
│   └── payment/               # Payment & checkout tests
├── helpers/                   # Helper functions
│   ├── auth.js               # Login/logout helpers
│   ├── cart.js               # Cart operations
│   ├── search.js             # Search & filter
│   └── common.js             # Common utilities
├── data/                      # Test data
│   ├── test-data.json        # Test credentials & data
│   └── keywords.txt          # Search keywords
├── reports/                   # Test reports (auto-generated)
│   ├── html/                 # HTML reports
│   └── json/                 # JSON reports
├── playwright.config.js       # Playwright configuration
└── package.json              # NPM dependencies
```

## 🧪 Chạy Tests

### Chạy tất cả tests
```bash
npx playwright test
```

### Chạy tests theo nhóm
```bash
# Chỉ chạy cart tests
npx playwright test tests/cart

# Chỉ chạy auth tests
npx playwright test tests/auth

# Chỉ chạy search tests
npx playwright test tests/search
```

### Chạy một test file cụ thể
```bash
npx playwright test tests/cart/add-to-cart.spec.js
```

### Chạy với UI mode (debug)
```bash
npx playwright test --ui
```

### Chạy với headed mode (xem browser)
```bash
npx playwright test --headed
```

## 📊 Xem Reports

### HTML Report
```bash
npx playwright show-report
```

HTML report sẽ mở trong browser với:
- Tổng quan kết quả tests
- Chi tiết từng test case
- Screenshots khi test fail
- Video recordings (nếu có)

### JSON Report

File JSON report được tạo tại: `reports/json/results.json`

Bạn có thể đọc file này để integrate với CI/CD hoặc các công cụ khác.

## 📝 Test Cases

### Authentication (6 tests)
- ✅ Đăng nhập thành công
- ✅ Đăng nhập thất bại (SĐT sai)
- ✅ Đăng nhập thất bại (mật khẩu sai)
- ✅ Validation form đăng nhập
- ✅ Đăng nhập Google (redirect)
- ✅ Đăng nhập Zalo (redirect)

### Cart Management (10 tests)
- ✅ Thêm sản phẩm vào giỏ
- ✅ Thêm cùng sản phẩm 2 lần
- ✅ Sản phẩm hết hàng
- ✅ Sản phẩm giá liên hệ
- ✅ Xem giỏ hàng
- ✅ Hiển thị thông tin sản phẩm
- ✅ Tăng số lượng
- ✅ Giảm số lượng
- ✅ Validation số lượng tối thiểu
- ✅ Xóa sản phẩm

### Search & Filter (6 tests)
- ✅ Tìm kiếm với keywords từ file
- ✅ Tìm kiếm keyword không tồn tại
- ✅ Tìm kiếm keyword phổ biến
- ✅ Lọc theo danh mục và hãng
- ✅ Lọc theo khoảng giá
- ✅ Validation khoảng giá

### Newsletter (3 tests)
- ✅ Đăng ký thành công
- ✅ Đăng ký với email sai
- ✅ Validation email trống

### Product Comparison (2 tests)
- ✅ So sánh sản phẩm cùng loại
- ✅ Kiểm tra danh sách sản phẩm

### Payment (2 tests)
- ✅ Flow thanh toán
- ✅ Áp dụng mã giảm giá

**Tổng cộng: 29 test cases**

## 🔧 Cấu Hình

File `playwright.config.js` đã được cấu hình với:
- Base URL: `https://cellphones.com.vn`
- Timeout: 60 giây/test
- Retry: 1 lần khi fail
- Screenshot: Chỉ khi fail
- Video: Chỉ khi fail
- Reporters: HTML + JSON + List

## 📚 Helpers

### auth.js
- `login(page, phone, password)` - Đăng nhập
- `logout(page)` - Đăng xuất
- `isLoggedIn(page)` - Kiểm tra trạng thái đăng nhập

### cart.js
- `searchAndAddToCart(page, productName)` - Tìm và thêm vào giỏ
- `getCartItemCount(page)` - Lấy số lượng sản phẩm
- `updateQuantity(page, action)` - Tăng/giảm số lượng
- `removeItem(page, index)` - Xóa sản phẩm

### search.js
- `searchProduct(page, keyword)` - Tìm kiếm
- `applyPriceFilter(page, min, max)` - Lọc theo giá
- `selectBrand(page, brandName)` - Chọn hãng
- `getSearchResults(page)` - Lấy kết quả tìm kiếm

### common.js
- `closeAds(page)` - Đóng quảng cáo
- `waitAndScanAds(page, duration)` - Quét quảng cáo
- `scrollToBottom(page)` - Cuộn xuống cuối
- `humanTypeText(page, selector, text)` - Nhập text như người thật

## 👥 Nguồn Test Cases

Test cases được chuyển đổi từ:
- 22130173_NguyenHoangNam - Cart tests (Python Selenium)
- 22130294_HuỳnhTấnToàn - Newsletter & Comparison (Python Selenium)
- 22130067_HoMinhHai - Login validation (Playwright JS)
- 22130141_TranDinhLanh - Search & Filter (Playwright JS)
- 22130205_NgoTienPhat - Payment & Discount (Playwright JS)
- 22130206_PhanVanPhat - Additional tests (Playwright JS)

## 📞 Hỗ Trợ

Nếu có vấn đề khi chạy tests, vui lòng kiểm tra:
1. Đã cài đặt đúng Node.js và npm
2. Đã chạy `npm install` và `npx playwright install`
3. Kết nối internet ổn định
4. Website cellphones.com.vn đang hoạt động

## 📄 License

ISC
