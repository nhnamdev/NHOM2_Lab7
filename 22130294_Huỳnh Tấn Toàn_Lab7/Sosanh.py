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
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    return driver

# --- DIỆT QUẢNG CÁO 1 (CHỈ XỬ LÝ BUTTON) ---
def kill_ad_type_button(driver):
    """
    Hàm này chỉ tìm và diệt quảng cáo loại Button (Quảng cáo 1).
    """
    try:
        # XPath: Tìm thẻ BUTTON chứa icon X (SVG Path M19 6.41)
        xpath_button = "//button[descendant::*[name()='path' and starts-with(@d, 'M19 6.41')]]"
        
        buttons = driver.find_elements(By.XPATH, xpath_button)
        for btn in buttons:
            if btn.is_displayed():
                print(">>> [KILL] Phát hiện Ads BUTTON (Ad 1)! Đang xóa...")
                # Tô đỏ để dễ nhìn
                driver.execute_script("arguments[0].style.border='3px solid red'", btn) 
                time.sleep(0.5)
                driver.execute_script("arguments[0].click();", btn)
                return True
    except:
        pass
    return False

# --- QUÉT TỔNG HỢP ---
def scan_ads_only_button(driver):
    # 1. Ưu tiên diệt Ad Button
    if kill_ad_type_button(driver):
        return True
    
    # 2. Backup: Diệt mấy cái quảng cáo class cũ (phòng hờ)
    try:
        old_ads = driver.find_elements(By.CSS_SELECTOR, ".cps-popup-close, .cancel-button")
        for ad in old_ads:
            if ad.is_displayed():
                driver.execute_script("arguments[0].click();", ad)
                return True
    except:
        pass
        
    return False

# --- HÀM CHỜ 30 GIÂY ---
def wait_and_scan_ads(driver, duration=15):
    print(f"--- ĐANG TREO MÁY {duration} GIÂY ĐỂ SĂN QUẢNG CÁO ---")
    
    end_time = time.time() + duration
    
    while time.time() < end_time:
        remaining = int(end_time - time.time())
        
        # Log mỗi 5s
        if remaining % 5 == 0:
            print(f"... Còn {remaining}s")
        
        # Gọi hàm quét
        if scan_ads_only_button(driver):
            print("-> Đã tiêu diệt mục tiêu! Nghỉ 1s rồi quét tiếp...")
            time.sleep(1)
        
        # Nghỉ 1s để quét liên tục
        time.sleep(1)
        
    print("--- HẾT 30S. BẮT ĐẦU VÀO TEST CASE ---")

# --- LUỒNG TEST CHÍNH ---
def run_test_case_final(driver, test_case_name, search_keyword, products_to_add=2):
    wait = WebDriverWait(driver, 20)
    print(f"\n=== START: {test_case_name} ===")
    
    try:
        # 1. HOME & WAIT 30s
        driver.get("https://cellphones.com.vn/")
        
        # Gọi hàm chờ 30s
        wait_and_scan_ads(driver, duration=15) 

        # 2. SEARCH
        print(f"[1] Search: {search_keyword}")
        search_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Bạn muốn mua gì hôm nay?']")))
        search_input.clear()
        search_input.send_keys(search_keyword)
        search_input.send_keys(Keys.ENTER)

        # 3. DETAIL PAGE
        print(f"[2] Vào trang chi tiết.")
        first_product_xpath = "(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a"
        driver.execute_script("window.scrollTo(0, 400);")
        first_product = wait.until(EC.element_to_be_clickable((By.XPATH, first_product_xpath)))
        driver.execute_script("arguments[0].click();", first_product)

        # 4. COMPARE POPUP
        print("[3] Mở popup so sánh.")
        wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "h1")))
        
        # Check lại Ads Button lần nữa
        scan_ads_only_button(driver)
        
        compare_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pdp-compare-button-box")))
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", compare_box)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", compare_box)

        # 5. SELECT ADDITIONAL PRODUCTS
        for i in range(products_to_add):
            target_index = i + 2 
            print(f"--- Chọn SP phụ {i+1} (Vị trí {target_index})...")
            
            item_xpath = f"(//*[@id='select-product-to-compare']//*[contains(@class, 'product-item')])[{target_index}]"
            item_element = wait.until(EC.presence_of_element_located((By.XPATH, item_xpath)))
            
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", item_element)
            time.sleep(1)
            
            btn_select = item_element.find_element(By.XPATH, ".//*[contains(@class, 'select-to-compare')]")
            driver.execute_script("arguments[0].click();", btn_select)
            print(f"[4.{i+1}] Click 'Chọn'.")
            time.sleep(1.5)

        # 6. CLICK GO COMPARE
        print("[5] Click 'So sánh ngay'.")
        btn_go_compare = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn-go-compare")))
        btn_go_compare.click()

        # 7. VERIFY
        wait.until(EC.url_contains("so-sanh"))
        wait.until(EC.visibility_of_element_located((By.CSS_SELECTOR, ".compare-content")))
        
        print(f"==> PASSED: {test_case_name}. URL: {driver.current_url}")

    except Exception as e:
        print(f"==> FAILED: {str(e)}")

# --- TEST CASE: SO SÁNH SẢN PHẨM KHÁC LOẠI ---
def test_compare_different_categories(driver):
    """
    Test case kiểm tra so sánh sản phẩm khác loại (iPhone vs Tai nghe).
    Kỳ vọng: Chỉ hiển thị các sản phẩm cùng loại để chọn, không hiển thị loại khác.
    """
    wait = WebDriverWait(driver, 20)
    print(f"\n=== START: TEST COMPARE DIFFERENT CATEGORIES ===")
    print(">>> Mục đích: Kiểm tra xem hệ thống có cho phép so sánh sản phẩm khác loại không")
    print(">>> Kỳ vọng: Chỉ hiển thị iPhone (cùng loại điện thoại), KHÔNG hiển thị tai nghe")
    
    try:
        # 1. HOME & WAIT
        driver.get("https://cellphones.com.vn/")
        wait_and_scan_ads(driver, duration=10)

        # 2. SEARCH IPHONE 15 (Điện thoại)
        print("\n[1] Search: iPhone 15")
        search_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Bạn muốn mua gì hôm nay?']")))
        search_input.clear()
        search_input.send_keys("iPhone 15")
        search_input.send_keys(Keys.ENTER)
        time.sleep(2)

        # 3. OPEN DETAIL PAGE
        print("[2] Vào trang chi tiết iPhone 15")
        first_product_xpath = "(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a"
        driver.execute_script("window.scrollTo(0, 400);")
        first_product = wait.until(EC.element_to_be_clickable((By.XPATH, first_product_xpath)))
        driver.execute_script("arguments[0].click();", first_product)
        time.sleep(2)

        # 4. OPEN COMPARE POPUP
        print("[3] Mở popup so sánh")
        scan_ads_only_button(driver)
        
        compare_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pdp-compare-button-box")))
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", compare_box)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", compare_box)
        time.sleep(2)

        # 5. CHECK DISPLAYED PRODUCTS CATEGORY
        print("\n[4] Kiểm tra danh sách sản phẩm hiển thị trong popup so sánh")
        
        # Tìm tất cả sản phẩm được hiển thị
        products_in_popup = driver.find_elements(By.XPATH, "//*[@id='select-product-to-compare']//*[contains(@class, 'product-item')]")
        
        if len(products_in_popup) == 0:
            print("⚠️ Không tìm thấy sản phẩm nào trong popup!")
        else:
            print(f"-> Tìm thấy {len(products_in_popup)} sản phẩm trong popup")
            
            # Lấy tên các sản phẩm
            product_names = []
            for i, product in enumerate(products_in_popup[:5]):  # Kiểm tra 5 sản phẩm đầu
                try:
                    name_element = product.find_element(By.CSS_SELECTOR, ".product-name, .product-title, a[title]")
                    product_name = name_element.get_attribute("title") or name_element.text
                    product_names.append(product_name)
                    print(f"   {i+1}. {product_name}")
                except:
                    product_names.append("N/A")
            
            # 6. KIỂM TRA KẾT QUẢ
            print("\n[5] Phân tích kết quả:")
            
            # Kiểm tra xem có loại sản phẩm khác (tai nghe) không
            keywords_phone = ["iphone", "galaxy", "xiaomi", "oppo", "vivo", "realme", "nokia", "điện thoại"]
            keywords_headphone = ["tai nghe", "headphone", "earbuds", "airpods", "speaker"]
            
            has_phone = any(any(kw in name.lower() for kw in keywords_phone) for name in product_names)
            has_headphone = any(any(kw in name.lower() for kw in keywords_headphone) for name in product_names)
            
            print(f"   - Có sản phẩm điện thoại: {has_phone}")
            print(f"   - Có sản phẩm tai nghe: {has_headphone}")
            
            if has_phone and not has_headphone:
                print("\n✅ PASS: Hệ thống chỉ hiển thị sản phẩm cùng loại (điện thoại)")
                print("   Đúng theo kỳ vọng - Không cho phép so sánh sản phẩm khác loại")
            elif has_phone and has_headphone:
                print("\n❌ FAIL: Hệ thống hiển thị cả sản phẩm khác loại (tai nghe)")
                print("   Không đúng kỳ vọng - Cho phép so sánh sản phẩm khác loại")
            else:
                print("\n⚠️ UNKNOWN: Không thể xác định rõ loại sản phẩm")

    except Exception as e:
        print(f"==> FAILED: {str(e)}")
        import traceback
        traceback.print_exc()

# --- MAIN ---
if __name__ == "__main__":
    driver = setup_driver()
    try:
        # Test case 1: So sánh cùng loại (Samsung Galaxy S24)
        run_test_case_final(
            driver, 
            test_case_name="TC01: So sánh điện thoại cùng loại", 
            search_keyword="Samsung Galaxy S24 Ultra", 
            products_to_add=2 
        )
        
        # Đóng driver để test case 2
        driver.quit()
        
        # Test case 2: Kiểm tra so sánh sản phẩm khác loại
        driver = setup_driver()
        test_compare_different_categories(driver)
        
    finally:
        print("\n--- DONE ---")
        time.sleep(3)
        driver.quit()