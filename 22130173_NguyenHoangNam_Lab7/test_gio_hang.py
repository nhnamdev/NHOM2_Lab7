import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager

# Cấu hình chung
URL_TRANG_CHU = "https://cellphones.com.vn/"
URL_DANG_NHAP = "https://smember.com.vn/login?action=login&client_id=cps&redirect_uri=https%3A%2F%2Fcellphones.com.vn%2Fcart&response_type=authorization_code&state=CvI0mCGjCNfcH4m8E8rlkII64OsVH0TqQ0XgnaxK"
URL_GIO_HANG = "https://cellphones.com.vn/cart"
# Lưu ý: Đây là tài khoản mẫu, bạn cần thay bằng tài khoản thật để chạy
TAI_KHOAN = "0858200725" 
MAT_KHAU = "Migi2004@"

def khoi_tao_trinh_duyet():
    """
    Hàm này dùng để mở trình duyệt Chrome lên
    """
    print("Đang khởi tạo trình duyệt...")
    # Tự động tải và cài đặt driver cho Chrome
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service)
    driver.maximize_window() # Phóng to màn hình
    driver.implicitly_wait(10) # Đợi ngầm định 10 giây cho các phần tử load
    return driver

def dang_nhap(driver):
    """
    Hàm thực hiện chức năng đăng nhập
    """
    print("--- Bắt đầu Đăng nhập ---")
    try:
        # Truy cập trực tiếp trang đăng nhập (theo yêu cầu mới)
        driver.get(URL_DANG_NHAP)
        time.sleep(3)

        # Nhập số điện thoại (dựa trên HTML thực tế)
        input_user = driver.find_element(By.XPATH, "//input[@placeholder='Nhập số điện thoại của bạn']")
        input_user.clear()
        input_user.send_keys(TAI_KHOAN)
        
        # Nhập mật khẩu (dựa trên HTML thực tế)
        input_pass = driver.find_element(By.XPATH, "//input[@placeholder='Nhập mật khẩu của bạn']")
        input_pass.clear()
        input_pass.send_keys(MAT_KHAU)

        # Click nút Đăng nhập (submit)
        btn_submit = driver.find_element(By.XPATH, "//button[@type='submit']")
        time.sleep(5)
        
        btn_submit.click()

        print("Đã click đăng nhập. Đợi 5s...")
        time.sleep(6) 
        # Quay về trang chủ
        driver.get(URL_TRANG_CHU)
        time.sleep(5) # Đợi đăng nhập xong
    except Exception as e:
        print(f"Lỗi khi đăng nhập: {e}")

def them_san_pham_vao_gio(driver, ten_san_pham="iPhone 13"):
    """
    Hàm tìm kiếm và thêm sản phẩm vào giỏ hàng
    Test case: CART-AddToCart-01
    """
    print(f"--- Bắt đầu thêm {ten_san_pham} vào giỏ ---")
    try:
        # 1. Tìm kiếm sản phẩm (dựa trên HTML thực tế)
        o_tim_kiem = driver.find_element(By.XPATH, "//input[@placeholder='Bạn muốn mua gì hôm nay?']")
        o_tim_kiem.click()
        o_tim_kiem.send_keys(ten_san_pham)
        print(f"Đã nhập từ khóa tìm kiếm: {ten_san_pham}")
        
        # Nhấn Enter để tìm kiếm
        o_tim_kiem.send_keys(Keys.RETURN)
        print("Đã nhấn Enter để tìm kiếm")
        time.sleep(3)  # Đợi trang kết quả tải
        
        # Click vào sản phẩm đầu tiên trong kết quả tìm kiếm (dựa trên HTML thực tế)
        ket_qua_dau_tien = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'product-item')]//a[@class='product__link button__link']"))
        )
        ket_qua_dau_tien.click()
        print("Đã click vào sản phẩm đầu tiên")
        print("Đã vào trang chi tiết sản phẩm")
        time.sleep(2)

        # 2. Click nút "Thêm vào giỏ hàng" (dựa trên HTML thực tế)
        nut_them_gio = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CLASS_NAME, "button-add-to-cart"))
        )
        nut_them_gio.click()
        print("Đã click nút Thêm vào giỏ hàng")
        time.sleep(5)
        
    except Exception as e:
        print(f"Lỗi khi thêm sản phẩm: {e}")

def kiem_tra_gio_hang(driver):
    """
    Hàm mở giỏ hàng và kiểm tra thông tin
    Test case: CART-ViewCart-01
    """
    print("--- Kiểm tra Giỏ hàng ---")
    try:
        # Mở trang giỏ hàng
        driver.get("https://cellphones.com.vn/cart")
        time.sleep(3)
        
        # Kiểm tra xem có sản phẩm nào không (dựa trên HTML thực tế)
        cac_san_pham = driver.find_elements(By.CLASS_NAME, "block__product-item")
        if len(cac_san_pham) > 0:
            print(f"Thành công: Có {len(cac_san_pham)} sản phẩm trong giỏ.")
            # In ra tên sản phẩm đầu tiên để kiểm tra
            ten_sp = cac_san_pham[0].find_element(By.CSS_SELECTOR, ".product-name a").text
            print(f"Sản phẩm đầu tiên: {ten_sp}")
        else:
            print("Cảnh báo: Giỏ hàng đang trống!")
            
    except Exception as e:
        print(f"Lỗi khi kiểm tra giỏ hàng: {e}")

def tang_so_luong_san_pham(driver):
    """
    Test case: CART-UpdateQty-01 (Tăng số lượng)
    Test case: CART-AddToCart-02 (Thêm cùng sản phẩm 2 lần)
    """
    print("--- Tăng số lượng sản phẩm ---")
    try:
        time.sleep(2)
        # Tìm nút cộng (+) của sản phẩm đầu tiên (dựa trên HTML thực tế)
        nut_cong = driver.find_element(By.CSS_SELECTOR, ".block__product-item .action .plus")
        nut_cong.click()
        print("Đã click tăng số lượng")
        time.sleep(2)
        
        # Kiểm tra số lượng mới
        o_so_luong = driver.find_element(By.CSS_SELECTOR, ".block__product-item .action input")
        so_luong = o_so_luong.get_attribute("value")
        print(f"Số lượng hiện tại: {so_luong}")
        
    except Exception as e:
        print(f"Lỗi khi tăng số lượng: {e}")

def xoa_san_pham_khoi_gio(driver):
    """
    Test case: CART-DeleteItem-01
    """
    print("--- Xóa sản phẩm khỏi giỏ ---")
    try:
        time.sleep(2)
        # Tìm nút xóa của sản phẩm đầu tiên (dựa trên HTML thực tế)
        nut_xoa = driver.find_element(By.CSS_SELECTOR, ".block__product-item .remove-item")
        nut_xoa.click()
        
        # Xác nhận xóa nếu có popup
        try:
            nut_xac_nhan = WebDriverWait(driver, 3).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(text(), 'Đồng ý') or contains(text(), 'Xác nhận')]"))
            )
            nut_xac_nhan.click()
            print("Đã xác nhận xóa")
        except:
            print("Không có popup xác nhận")
            
        print("Đã thực hiện xóa sản phẩm")
        time.sleep(2)
        
    except Exception as e:
        print(f"Lỗi khi xóa sản phẩm: {e}")

# --- CHƯƠNG TRÌNH CHÍNH (MAIN) ---
if __name__ == "__main__":
    # 1. Khởi tạo
    driver = khoi_tao_trinh_duyet()
    
    try:
        # 2. Chạy kịch bản test
        # Bước 1: Đăng nhập 
        dang_nhap(driver) 
        
        # Bước 2: Thêm san pham vào giỏ
        them_san_pham_vao_gio(driver, "iPhone 13")
        
        # Bước 3: Kiểm tra giỏ hàng
        kiem_tra_gio_hang(driver)
        
        # Bước 4: Tăng số lượng
        tang_so_luong_san_pham(driver)
        
        # Bước 5: Xóa sản phẩm (để dọn dẹp sau khi test)
        xoa_san_pham_khoi_gio(driver)
        
        print("\n=== ĐÃ HOÀN THÀNH BÀI TEST ===")
        
    except Exception as e:
        print(f"Có lỗi xảy ra trong quá trình chạy: {e}")
        
    finally:
        # Đợi 5s cho người dùng kịp nhìn rồi đóng
        time.sleep(5)
        print("Đang đóng trình duyệt...")
        driver.quit()
