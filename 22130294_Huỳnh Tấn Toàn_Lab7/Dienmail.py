import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

# --- SETUP ---
def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-notifications")
    # chrome_options.add_argument("--incognito") # Tắt ẩn danh để test bình thường nếu cần
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

def test_newsletter_final():
    driver = setup_driver()
    # Chờ tối đa 60s cho popup
    wait = WebDriverWait(driver, 60)

    # Email và SĐT để test
    my_email = "22130294@st.hcmuaf.edu.vn"
    my_phone = "0909123456"

    print("\n=== START: TEST CASE ĐĂNG KÝ NHẬN TIN (CÓ SCROLL) ===")
    
    try:
        # 1. Vào trang chủ
        print("[1] Vào trang chủ Cellphones...")
        driver.get("https://cellphones.com.vn/")
        
        print("-> Đang cuộn trang để kích hoạt popup...")

        # 2. Chờ Popup xuất hiện (kết hợp cuộn trang)
        popup_header_xpath = "//*[contains(text(), 'ĐĂNG KÝ NHẬN TIN')]"
        
        # Logic cuộn trang để kích hoạt popup
        for i in range(10): # Thử cuộn 10 lần
            try:
                # Kiểm tra xem popup đã hiện chưa (wait ngắn 2s thôi)
                WebDriverWait(driver, 2).until(EC.visibility_of_element_located((By.XPATH, popup_header_xpath)))
                print(f"[2] Đã bắt được Popup sau {i+1} lần cuộn!")
                break
            except:
                # Nếu chưa thấy thì cuộn xuống rồi cuộn lên
                driver.execute_script("window.scrollBy(0, 500);")
                time.sleep(1)
                driver.execute_script("window.scrollBy(0, -200);")
                time.sleep(1)
                print(f"   ...đang tìm popup (lần {i+1})...")
        else:
            # Nếu hết vòng lặp mà vẫn chưa thấy -> Chờ thêm 1 lần chốt hạ
            print("-> Vẫn chưa thấy, chờ thêm 10s...")
            wait.until(EC.visibility_of_element_located((By.XPATH, popup_header_xpath)))
            print("[2] Đã bắt được Popup!")

        # Chờ 1 xíu cho animation popup hiện hết hẳn
        time.sleep(2)

        # 3. Điền Email
        print(f"-> Nhập Email: {my_email}")
        email_xpath = "//input[@placeholder='Email *']"
        email_input = wait.until(EC.presence_of_element_located((By.XPATH, email_xpath)))
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, email_xpath)))
        email_input.click()
        email_input.clear()
        email_input.send_keys(my_email)
        
        # 4. Điền Số điện thoại
        print(f"-> Nhập SĐT: {my_phone}")
        phone_xpath = "//input[contains(@placeholder, 'Số điện thoại') or @type='tel']"
        phone_input = driver.find_element(By.XPATH, phone_xpath)
        phone_input.click()
        phone_input.clear()
        phone_input.send_keys(my_phone)
        
        # 5. Check 'Tôi đồng ý'
        print("-> Click checkbox 'Tôi đồng ý'...")
        # Tìm input checkbox nằm gần chữ 'Tôi đồng ý' hoặc checkbox cuối cùng trong popup
        checkbox_xpath = "//input[@type='checkbox']"
        checkboxes = driver.find_elements(By.XPATH, checkbox_xpath)
        if len(checkboxes) > 0:
            # Dùng JS Click để chắc chắn ăn
            driver.execute_script("arguments[0].click();", checkboxes[-1])
        else:
            print("WARNING: Không tìm thấy checkbox!")

        # 6. Click nút ĐĂNG KÝ NGAY
        print("-> Click nút 'ĐĂNG KÝ NGAY'...")
        btn_submit_xpath = "//button[contains(text(), 'ĐĂNG KÝ NGAY')]"
        btn_submit = driver.find_element(By.XPATH, btn_submit_xpath)
        driver.execute_script("arguments[0].click();", btn_submit)
        
        print("[3] Đã Submit form thành công.")
        
        # Chờ một chút để request gửi đi
        time.sleep(3)
        
        # 7. Mở Gmail verify
        print("[4] Đang chuyển hướng sang Gmail...")
        driver.get("https://gmail.com")
        
        print(f"-> Đã chuyển sang trang: {driver.title}")
        print("-> Hãy kiểm tra email thủ công.")

    except Exception as e:
        print(f"\n[FAILED] Lỗi xảy ra: {str(e)}")
        driver.save_screenshot("error_newsletter_retry.png")
        
    finally:
        print("\n--- ĐÃ CHẠY XONG TEST CASE 1 ---")
        # Giữ trình duyệt mở để user xem kết quả
        input(">>> Bấm phím ENTER để tiếp tục sang test case 2...")
        driver.quit()

def test_newsletter_case_2():
    """Test case 2: Đăng ký nhận tin với thông tin khác"""
    driver = setup_driver()
    wait = WebDriverWait(driver, 60)

    # Email và SĐT khác
    my_email = "dsdwsgwsge@gmail.com"
    my_phone = "0982167357"

    print("\n=== START: TEST CASE 2 - ĐĂNG KÝ NHẬN TIN (THÔNG TIN KHÁC) ===")
    
    try:
        # 1. Vào trang chủ
        print("[1] Vào trang chủ Cellphones...")
        driver.get("https://cellphones.com.vn/")
        
        print("-> Đang cuộn trang để kích hoạt popup...")

        # 2. Chờ Popup xuất hiện (kết hợp cuộn trang)
        popup_header_xpath = "//*[contains(text(), 'ĐĂNG KÝ NHẬN TIN')]"
        
        # Logic cuộn trang để kích hoạt popup
        for i in range(10):
            try:
                WebDriverWait(driver, 2).until(EC.visibility_of_element_located((By.XPATH, popup_header_xpath)))
                print(f"[2] Đã bắt được Popup sau {i+1} lần cuộn!")
                break
            except:
                driver.execute_script("window.scrollBy(0, 500);")
                time.sleep(1)
                driver.execute_script("window.scrollBy(0, -200);")
                time.sleep(1)
                print(f"   ...đang tìm popup (lần {i+1})...")
        else:
            print("-> Vẫn chưa thấy, chờ thêm 10s...")
            wait.until(EC.visibility_of_element_located((By.XPATH, popup_header_xpath)))
            print("[2] Đã bắt được Popup!")

        time.sleep(2)

        # 3. Điền Email
        print(f"-> Nhập Email: {my_email}")
        email_xpath = "//input[@placeholder='Email *']"
        email_input = wait.until(EC.presence_of_element_located((By.XPATH, email_xpath)))
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, email_xpath)))
        email_input.click()
        email_input.clear()
        email_input.send_keys(my_email)
        
        # 4. Điền Số điện thoại
        print(f"-> Nhập SĐT: {my_phone}")
        phone_xpath = "//input[contains(@placeholder, 'Số điện thoại') or @type='tel']"
        phone_input = driver.find_element(By.XPATH, phone_xpath)
        phone_input.click()
        phone_input.clear()
        phone_input.send_keys(my_phone)
        
        # 5. Check 'Tôi đồng ý'
        print("-> Click checkbox 'Tôi đồng ý'...")
        checkbox_xpath = "//input[@type='checkbox']"
        checkboxes = driver.find_elements(By.XPATH, checkbox_xpath)
        if len(checkboxes) > 0:
            driver.execute_script("arguments[0].click();", checkboxes[-1])
        else:
            print("WARNING: Không tìm thấy checkbox!")

        # 6. Click nút ĐĂNG KÝ NGAY
        print("-> Click nút 'ĐĂNG KÝ NGAY'...")
        btn_submit_xpath = "//button[contains(text(), 'ĐĂNG KÝ NGAY')]"
        btn_submit = driver.find_element(By.XPATH, btn_submit_xpath)
        driver.execute_script("arguments[0].click();", btn_submit)
        
        print("[3] Đã Submit form thành công.")
        
        time.sleep(3)
        
        # 7. Mở Gmail verify
        print("[4] Đang chuyển hướng sang Gmail...")
        driver.get("https://gmail.com")
        
        print(f"-> Đã chuyển sang trang: {driver.title}")
        print("-> Hãy kiểm tra email thủ công.")

    except Exception as e:
        print(f"\n[FAILED] Lỗi xảy ra: {str(e)}")
        driver.save_screenshot("error_newsletter_case2.png")
        
    finally:
        print("\n--- ĐÃ CHẠY XONG TEST CASE 2 ---")
        input(">>> Bấm phím ENTER để kết thúc và đóng trình duyệt...")
        driver.quit()

if __name__ == "__main__":
    # Chạy test case 1
    # test_newsletter_final()
    
    # Chạy test case 2
    test_newsletter_case_2()