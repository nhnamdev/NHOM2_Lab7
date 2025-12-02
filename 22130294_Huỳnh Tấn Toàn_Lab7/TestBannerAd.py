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

def scroll_from_top_to_bottom(driver):
    print("-> Bắt đầu cuộn từ đầu trang xuống cuối trang...")
    # Cuộn về đầu trang trước
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(1)
    
    last_height = driver.execute_script("return document.body.scrollHeight")
    current_position = 0
    scroll_step = 500 # Pixel mỗi lần cuộn
    
    while current_position < last_height:
        current_position += scroll_step
        driver.execute_script(f"window.scrollTo(0, {current_position});")
        time.sleep(0.5) # Chờ load nội dung
        
        # Cập nhật chiều cao trang nếu có lazy load
        new_height = driver.execute_script("return document.body.scrollHeight")
        if new_height > last_height:
            last_height = new_height

    print("-> Đã cuộn đến cuối trang.")

def print_promotion_info(driver):
    print("-> Đang lấy thông tin khuyến mãi...")
    try:
        # Tìm các thẻ chứa thông tin sản phẩm
        # Thử nhiều selector khác nhau để bắt được sản phẩm
        xpaths = [
            "//div[contains(@class, 'product-item')]",
            "//div[contains(@class, 'item-product')]",
            "//div[contains(@class, 'product-info')]/ancestor::div[contains(@class, 'item')]",
            "//div[contains(@class, 'cps-product-item')]"
        ]
        
        product_items = []
        for xpath in xpaths:
            product_items = driver.find_elements(By.XPATH, xpath)
            if len(product_items) > 0:
                break
        
        if not product_items:
            print("⚠️ Không tìm thấy sản phẩm nào với các selector thông thường.")
            return

        print(f"-> Tìm thấy {len(product_items)} sản phẩm hiển thị.")
        
        count = 0
        for item in product_items:
            try:
                # Lấy tên (thường là thẻ h3 hoặc div có class name/title)
                name = ""
                try:
                    name_el = item.find_element(By.XPATH, ".//div[contains(@class, 'name') or contains(@class, 'title')] | .//h3")
                    name = name_el.text.strip()
                except:
                    pass
                
                # Lấy giá
                price = ""
                try:
                    price_el = item.find_element(By.XPATH, ".//div[contains(@class, 'price') or contains(@class, 'show')] | .//p[contains(@class, 'price')]")
                    price = price_el.text.strip()
                except:
                    pass
                
                if name:
                    count += 1
                    print(f"   {count}. {name} - {price}")
            except:
                continue
                
    except Exception as e:
        print(f"⚠️ Lỗi khi lấy thông tin sản phẩm: {str(e)}")

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
                    
                    # --- YÊU CẦU MỚI: Cuộn trang và in thông tin ---
                    scroll_from_top_to_bottom(driver)
                    print_promotion_info(driver)
                    # -----------------------------------------------
                    
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
