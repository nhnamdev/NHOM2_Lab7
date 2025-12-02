import time
import random
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options

# --- SETUP & HELPER FUNCTIONS (Giữ nguyên) ---
def setup_driver():
    chrome_options = Options()
    chrome_options.add_argument("--start-maximized")
    chrome_options.add_argument("--disable-notifications")
    chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
    chrome_options.add_experimental_option('useAutomationExtension', False)
    chrome_options.add_argument("--disable-blink-features=AutomationControlled")
    service = Service(ChromeDriverManager().install())
    return webdriver.Chrome(service=service, options=chrome_options)

def kill_ad_type_button(driver):
    try:
        xpath_button = "//button[descendant::*[name()='path' and starts-with(@d, 'M19 6.41')]]"
        buttons = driver.find_elements(By.XPATH, xpath_button)
        for btn in buttons:
            if btn.is_displayed():
                print(">>> [KILL] Bùm! Đã tắt quảng cáo.")
                driver.execute_script("arguments[0].style.border='3px solid red'", btn) 
                time.sleep(0.3)
                driver.execute_script("arguments[0].click();", btn)
                return True
    except:
        pass
    try:
        old_ads = driver.find_elements(By.CSS_SELECTOR, ".cps-popup-close, .cancel-button")
        for ad in old_ads:
            if ad.is_displayed():
                driver.execute_script("arguments[0].click();", ad)
                return True
    except:
        pass
    return False

def smart_wait_ads(driver, timeout=15):
    print(f"--- Đang canh quảng cáo (Max {timeout}s)... ---")
    end_time = time.time() + timeout
    while time.time() < end_time:
        if kill_ad_type_button(driver):
            print("-> Đã diệt xong! Đi tiếp.")
            time.sleep(0.5)
            return
        time.sleep(0.5)
    print("-> Không thấy quảng cáo, đi tiếp...")

def real_human_typing(driver, element, text):
    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.5)
    element.click()
    actions = ActionChains(driver)
    actions.key_down(Keys.CONTROL).send_keys('a').key_up(Keys.CONTROL).perform()
    time.sleep(0.1)
    actions.send_keys(Keys.BACKSPACE).perform()
    for char in text:
        actions.send_keys(char)
        actions.perform()
        time.sleep(random.uniform(0.05, 0.1))
    actions.send_keys(Keys.TAB).perform()

# ==========================================
# === TEST CASE 1: NHẬP ĐÚNG (HAPPY CASE) ===
# ==========================================
def test_subscribe_success():
    driver = setup_driver()
    wait = WebDriverWait(driver, 30)
    my_email = "22130294@st.hcmuaf.edu.vn"
    my_phone = "0849632852"

    print("\n=== [CASE 1] NHẬP ĐÚNG ===")
    try:
        driver.get("https://cellphones.com.vn/")
        smart_wait_ads(driver, timeout=10)

        print("-> Cuộn xuống Footer & Nhập liệu...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1) 
        
        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Nhập email của bạn']")))
        real_human_typing(driver, email_input, my_email)
        
        phone_input = driver.find_element(By.XPATH, "//input[@placeholder='Nhập số điện thoại của bạn']")
        real_human_typing(driver, phone_input, my_phone)

        # Click ra ngoài
        try:
            driver.find_element(By.XPATH, "//*[contains(text(), 'Tổng đài hỗ trợ')]").click()
        except:
            driver.find_element(By.TAG_NAME, "body").click()
        time.sleep(1)

        # Submit
        print("-> Bấm Đăng ký...")
        btn_submit = driver.find_element(By.XPATH, "//button[contains(text(), 'ĐĂNG KÝ NGAY')]")
        ActionChains(driver).move_to_element(btn_submit).click().perform()

        # Verify
        time.sleep(2)
        try:
            msg = driver.find_element(By.XPATH, "//*[contains(text(), 'thành công') or contains(text(), 'Cảm ơn') or contains(text(), 'tồn tại')]")
            print(f"==> PASSED: {msg.text}")
        except:
            print("==> DONE (Check màn hình).")

    except Exception as e:
        print(f"[ERROR]: {e}")
    finally:
        # QUAN TRỌNG: Dòng này giúp ông dừng lại trước khi qua bài 2
        input("\n>>> [CASE 1 XONG] Ấn Enter để đóng browser và chạy Test Case 2...")
        driver.quit()

# ==========================================
# === TEST CASE 2: NHẬP SAI (NEGATIVE CASE) ===
# ==========================================
def test_subscribe_fail():
    driver = setup_driver()
    wait = WebDriverWait(driver, 30)
    # Email sai định dạng (thiếu @...)
    invalid_email = "22130294" 
    my_phone = "0849632852"

    print("\n=== [CASE 2] NHẬP EMAIL SAI ===")
    try:
        driver.get("https://cellphones.com.vn/")
        smart_wait_ads(driver, timeout=10)

        print("-> Cuộn xuống Footer & Nhập liệu...")
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        time.sleep(1) 

        email_input = wait.until(EC.element_to_be_clickable((By.XPATH, "//input[@placeholder='Nhập email của bạn']")))
        # Nhập email sai
        real_human_typing(driver, email_input, invalid_email)

        phone_input = driver.find_element(By.XPATH, "//input[@placeholder='Nhập số điện thoại của bạn']")
        real_human_typing(driver, phone_input, my_phone)

        # Click ra ngoài
        try:
            driver.find_element(By.XPATH, "//*[contains(text(), 'Tổng đài hỗ trợ')]").click()
        except:
            driver.find_element(By.TAG_NAME, "body").click()
        time.sleep(1)

        # Verify: Kiểm tra nút có bị KHÓA không (Logic đúng của test case này)
        print("-> Kiểm tra validation...")
        btn_submit = driver.find_element(By.XPATH, "//button[contains(text(), 'ĐĂNG KÝ NGAY')]")
        
        # Check class xem có disabled không
        if not btn_submit.is_enabled():
            print("==> PASSED: Nút Đăng ký vẫn KHÓA (Do email sai). Đúng kỳ vọng!")
        else:
            print("==> FAILED: Nút Đăng ký SÁNG (Bug: Web cho phép email sai).")
            # Nếu nút sáng thì thử click
            ActionChains(driver).move_to_element(btn_submit).click().perform()

    except Exception as e:
        print(f"[ERROR]: {e}")
    finally:
        input("\n>>> [CASE 2 XONG] Ấn Enter để kết thúc toàn bộ...")
        driver.quit()

# --- MAIN ---
if __name__ == "__main__":
    # Chạy case 1 -> Chờ Enter -> Tắt -> Chạy case 2
    test_subscribe_success()
    
    # Ở đây phải có dấu ngoặc () thì hàm mới chạy nha
    test_subscribe_fail()