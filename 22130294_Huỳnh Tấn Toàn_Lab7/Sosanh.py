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

# --- DIET QUANG CAO (Button) ---
def kill_ad_type_button(driver):
    try:
        xpath_button = "//button[descendant::*[name()='path' and starts-with(@d, 'M19 6.41')]]"
        buttons = driver.find_elements(By.XPATH, xpath_button)
        for btn in buttons:
            if btn.is_displayed():
                driver.execute_script("arguments[0].style.border='3px solid red'", btn) 
                time.sleep(0.5)
                driver.execute_script("arguments[0].click();", btn)
                return True
    except:
        pass
    return False

# --- QUET ADS TONG HOP ---
def scan_ads_only_button(driver):
    if kill_ad_type_button(driver):
        return True
    try:
        old_ads = driver.find_elements(By.CSS_SELECTOR, ".cps-popup-close, .cancel-button")
        for ad in old_ads:
            if ad.is_displayed():
                driver.execute_script("arguments[0].click();", ad)
                return True
    except:
        pass
    return False

# --- HAM CHO 30S DAU GAME ---
def wait_and_scan_ads(driver, duration=15):
    print(f"--- DANG TREO MAY {duration}s DE DIET ADS ---")
    end_time = time.time() + duration
    while time.time() < end_time:
        scan_ads_only_button(driver)
        time.sleep(1)
    print("--- HET GIO CHO. VAO VIEC ---")

# --- TEST CASE 1: SO SANH THANH CONG ---
def run_test_case_final(driver, test_case_name, search_keyword, products_to_add=2):
    wait = WebDriverWait(driver, 20)
    print(f"\n=== START: {test_case_name} ===")
    
    try:
        # 1. HOME
        driver.get("https://cellphones.com.vn/")
        wait_and_scan_ads(driver, duration=15)

        # 2. SEARCH
        print(f"[1] Search: {search_keyword}")
        search_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Bạn muốn mua gì hôm nay?']")))
        search_input.clear()
        search_input.send_keys(search_keyword)
        search_input.send_keys(Keys.ENTER)

        # 3. VAO CHI TIET
        print(f"[2] Vao trang chi tiet.")
        first_product_xpath = "(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a"
        driver.execute_script("window.scrollTo(0, 400);")
        first_product = wait.until(EC.element_to_be_clickable((By.XPATH, first_product_xpath)))
        driver.execute_script("arguments[0].click();", first_product)

        # 4. MO POPUP SO SANH
        print("[3] Mo popup so sanh.")
        wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
        scan_ads_only_button(driver)
        
        compare_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pdp-compare-button-box")))
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", compare_box)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", compare_box)

        # 5. CHON THEM SAN PHAM
        for i in range(products_to_add):
            target_index = i + 2 
            print(f"--- Them SP {i+1} vao so sanh...")
            item_xpath = f"(//*[@id='select-product-to-compare']//div[contains(@class, 'product-item')])[{target_index}]"
            item_element = wait.until(EC.presence_of_element_located((By.XPATH, item_xpath)))
            driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", item_element)
            time.sleep(1)
            btn_select = item_element.find_element(By.XPATH, ".//*[contains(@class, 'select-to-compare')]")
            driver.execute_script("arguments[0].click();", btn_select)
            time.sleep(1)

        # 6. CLICK SO SANH & VERIFY NHANH
        print("[4] Click 'So sanh ngay'.")
        btn_go_compare = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, ".btn-go-compare")))
        btn_go_compare.click()

        print("[5] Dang cho chuyen huong trang...")
        # Chi can doi URL chua chu 'so-sanh' la PASS
        wait.until(EC.url_contains("so-sanh"))
        
        # Cho them 3s de chac chan page load giao dien (nhung khong check element cu the)
        time.sleep(3) 
        
        print(f"==> KET QUA: TRANG SO SANH DA LOAD THANH CONG.")
        print(f"==> URL: {driver.current_url}")
        print(f"==> PASSED: {test_case_name}")

    except Exception as e:
        print(f"==> FAILED: {str(e)}")

# --- TEST CASE 2: CHECK KHAC LOAI ---
def test_compare_different_categories(driver):
    wait = WebDriverWait(driver, 20)
    print(f"\n=== START: TEST COMPARE DIFFERENT CATEGORIES ===")
    print(">>> Muc dich: Kiem tra so sanh san pham khac loai")
    
    try:
        driver.get("https://cellphones.com.vn/")
        wait_and_scan_ads(driver, duration=10)

        print("\n[1] Search: iPhone 15")
        search_input = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "input[placeholder='Bạn muốn mua gì hôm nay?']")))
        search_input.clear()
        search_input.send_keys("iPhone 15")
        search_input.send_keys(Keys.ENTER)
        time.sleep(2)

        print("[2] Vao trang chi tiet iPhone 15")
        first_product_xpath = "(//div[contains(@class, 'product-list')]//div[contains(@class, 'product-item')])[1]//a"
        driver.execute_script("window.scrollTo(0, 400);")
        first_product = wait.until(EC.element_to_be_clickable((By.XPATH, first_product_xpath)))
        driver.execute_script("arguments[0].click();", first_product)
        time.sleep(2)

        print("[3] Mo popup so sanh")
        scan_ads_only_button(driver)
        
        compare_box = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, ".pdp-compare-button-box")))
        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", compare_box)
        time.sleep(1)
        driver.execute_script("arguments[0].click();", compare_box)
        time.sleep(2)

        print("\n[4] Kiem tra danh sach san pham")
        products_in_popup = driver.find_elements(By.XPATH, "//*[@id='select-product-to-compare']//*[contains(@class, 'product-item')]")
        
        if len(products_in_popup) == 0:
            print("[WARN] Khong tim thay san pham nao!")
        else:
            print(f"-> Tim thay {len(products_in_popup)} san pham")
            
            product_names = []
            for i, product in enumerate(products_in_popup[:5]):
                try:
                    name_element = product.find_element(By.CSS_SELECTOR, ".product-name, .product-title, a[title]")
                    product_name = name_element.get_attribute("title") or name_element.text
                    product_names.append(product_name)
                    print(f"   {i+1}. {product_name}")
                except:
                    product_names.append("N/A")
            
            print("\n[5] Phan tich ket qua:")
            keywords_phone = ["iphone", "galaxy", "xiaomi", "oppo", "vivo", "realme", "nokia", "điện thoại"]
            keywords_headphone = ["tai nghe", "headphone", "earbuds", "airpods", "speaker"]
            
            has_phone = any(any(kw in name.lower() for kw in keywords_phone) for name in product_names)
            has_headphone = any(any(kw in name.lower() for kw in keywords_headphone) for name in product_names)
            
            print(f"   - Co dien thoai: {has_phone}")
            print(f"   - Co tai nghe: {has_headphone}")
            
            if has_phone and not has_headphone:
                print("\n[PASS] Chi hien thi dien thoai (OK)")
            elif has_phone and has_headphone:
                print("\n[FAIL] Hien thi ca tai nghe (NOT OK)")
            else:
                print("\n[UNKNOWN] Khong xac dinh")

    except Exception as e:
        print(f"==> FAILED: {str(e)}")

# --- MAIN RUN ---
if __name__ == "__main__":
    # --- RUN TEST CASE 1 ---
    driver1 = setup_driver()
    try:
        run_test_case_final(
            driver1, 
            test_case_name="TC01: So sanh dien thoai", 
            search_keyword="Samsung Galaxy S24 Ultra"
        )
    finally:
        print("\n>>> DONG CHROME TC1. CHUYEN QUA TC2...")
        driver1.quit()
        time.sleep(2)

    # --- RUN TEST CASE 2 ---
    driver2 = setup_driver()
    try:
        test_compare_different_categories(driver2)
    finally:
        print("\n>>> DONE ALL. DONG CHROME TC2.")
        driver2.quit()