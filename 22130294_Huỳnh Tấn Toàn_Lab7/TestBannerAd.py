import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
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

def test_banner_ad():
    driver = setup_driver()
    wait = WebDriverWait(driver, 60)

    print("\n=== START: TEST CLICK BANNER QUẢNG CÁO ===")
    
    try:
        # 1. Vào trang chủ
        print("[1] Vào trang chủ Cellphones...")
        driver.get("https://cellphones.com.vn/")
        
        print("-> Đang chờ banner quảng cáo xuất hiện...")

        # 2. Chờ banner xuất hiện (Popup banner Black Friday)
        # Tìm link chứa href="/black-friday"
        banner_xpath = "//a[@href='/black-friday']"
        
        print("[2] Đang đợi banner quảng cáo...")
        banner_element = wait.until(EC.presence_of_element_located((By.XPATH, banner_xpath)))
        print("[2] Đã bắt được banner!")
        
        # Chờ banner có thể click được
        banner_element = wait.until(EC.element_to_be_clickable((By.XPATH, banner_xpath)))
        
        # Cuộn trang để đảm bảo banner hiển thị trên màn hình
        driver.execute_script("arguments[0].scrollIntoView(true);", banner_element)
        time.sleep(1)
        
        # 3. Click vào banner bằng JavaScript để tránh element intercept
        print("[3] Click vào banner quảng cáo...")
        driver.execute_script("arguments[0].click();", banner_element)
        
        print("[4] Đã click thành công vào banner.")
        
        # Chờ trang load
        time.sleep(3)
        
        # Kiểm tra URL đã chuyển sang trang Black Friday chưa
        current_url = driver.current_url
        print(f"-> URL hiện tại: {current_url}")
        print(f"-> Title trang: {driver.title}")
        
        if "black-friday" in current_url.lower():
            print("\n✅ SUCCESS: Đã điều hướng đến trang Black Friday!")
            
            # 5. Test click vào các navigation item
            print("\n[5] Bắt đầu test các nút navigation...")
            
            navigation_items = [
                "NHÓM HÀNG ƯU ĐÃI",
                "BALO - TÚI XÁCH",
                "ƯU ĐÃI THANH TOÁN"
            ]
            
            for nav_item in navigation_items:
                try:
                    print(f"\n-> Tìm kiếm nút: {nav_item}")
                    # XPath để tìm link chứa text
                    nav_xpath = f"//a[contains(@class, 'navigation-item') and contains(text(), '{nav_item}')]"
                    nav_element = wait.until(EC.presence_of_element_located((By.XPATH, nav_xpath)))
                    
                    # Scroll vào view
                    driver.execute_script("arguments[0].scrollIntoView(true);", nav_element)
                    time.sleep(1)
                    
                    # Click bằng JS
                    print(f"-> Clicking: {nav_item}")
                    driver.execute_script("arguments[0].click();", nav_element)
                    
                    print(f"✅ Đã click thành công: {nav_item}")
                    time.sleep(2)
                    
                except Exception as e:
                    print(f"⚠️ Lỗi khi click {nav_item}: {str(e)}")
        else:
            print("\n⚠️ WARNING: Chưa điều hướng sang trang Black Friday!")

    except Exception as e:
        print(f"\n[FAILED] Lỗi xảy ra: {str(e)}")
        driver.save_screenshot("error_banner_test.png")
        
    finally:
        print("\n--- ĐÃ CHẠY XONG ---")
        input(">>> Bấm phím ENTER để đóng trình duyệt...")
        driver.quit()

if __name__ == "__main__":
    test_banner_ad()
