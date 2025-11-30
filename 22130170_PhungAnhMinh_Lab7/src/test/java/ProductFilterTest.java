import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import org.testng.Assert;
import org.testng.annotations.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.chrome.ChromeOptions;
import java.util.HashMap;
import java.util.Map;
import java.time.Duration;
import java.util.List;

public class ProductFilterTest {
    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;

    @BeforeClass(alwaysRun = true)
    public void setUp() {
        ChromeOptions options = new ChromeOptions();
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("profile.default_content_setting_values.notifications", 2);
        prefs.put("profile.default_content_setting_values.geolocation", 2);
        prefs.put("profile.default_content_setting_values.media_stream", 2);
        options.setExperimentalOption("prefs", prefs);
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-gpu");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        js   = (JavascriptExecutor) driver;
    }

    @Test
    public void PRODUCT_FILTER_01_filterByBrandIphone() throws InterruptedException {
        driver.get("https://cellphones.com.vn/");
        WebElement appleBrandLink = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.linkText("Apple"))
        );
        js.executeScript("arguments[0].scrollIntoView({block: 'center'});", appleBrandLink);
        Thread.sleep(500);

        try {
            wait.until(ExpectedConditions.elementToBeClickable(appleBrandLink)).click();
        } catch (org.openqa.selenium.ElementClickInterceptedException e) {
            js.executeScript("arguments[0].click();", appleBrandLink);
        }

        wait.until(ExpectedConditions.urlContains("/mobile/apple"));
        Thread.sleep(1500);

        java.util.List<WebElement> iphoneProducts = driver.findElements(
                By.xpath("//a[contains(@href,'iphone') and contains(@href,'dien-thoai')]")
        );

        Assert.assertTrue(
                iphoneProducts.size() > 0,
                "Không tìm thấy sản phẩm iPhone nào sau khi lọc thương hiệu Apple!"
        );

        int checkCount = Math.min(iphoneProducts.size(), 5);
        for (int i = 0; i < checkCount; i++) {
            WebElement a = iphoneProducts.get(i);
            String href = a.getAttribute("href");
            Assert.assertNotNull(href, "Href của sản phẩm bị null!");

            href = href.toLowerCase();
            Assert.assertTrue(
                    href.contains("iphone") && href.contains("dien-thoai"),
                    "Link sản phẩm không phải iPhone: " + href
            );
        }
    }

    @Test(dependsOnMethods = "PRODUCT_FILTER_01_filterByBrandIphone")
    public void PRODUCT_FILTER_02_filterByRam() throws InterruptedException {
        driver.get("https://cellphones.com.vn/mobile/apple.html");

        By ramGroupToggle = By.xpath("//div[@id='filterModule']/div/div[4]/button");
        WebElement ramBtn = wait.until(ExpectedConditions.elementToBeClickable(ramGroupToggle));
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", ramBtn);
        Thread.sleep(500);
        ramBtn.click();

        By ramOption8Gb = By.xpath("//div[@id='filterModule']/div/div[4]/div/ul/li[5]/button");
        WebElement ram8GbBtn = wait.until(ExpectedConditions.elementToBeClickable(ramOption8Gb));
        ram8GbBtn.click();

        By applyRamFilterBtn = By.xpath("//div[@id='filterModule']/div/div[4]/div/div/button[2]");
        WebElement applyBtn = wait.until(ExpectedConditions.elementToBeClickable(applyRamFilterBtn));
        applyBtn.click();

        WebElement firstProduct = wait.until(
                ExpectedConditions.presenceOfElementLocated(
                        By.cssSelector("div.product-card, div.product-item")
                )
        );

        js.executeScript("arguments[0].scrollIntoView({block:'center'});", firstProduct);
        Thread.sleep(3000);

        List<WebElement> ramTexts = driver.findElements(
                By.xpath("//*[contains(normalize-space(.),'8 GB') or contains(normalize-space(.),'8GB')]")
        );

        Assert.assertTrue(
                ramTexts.size() > 0,
                "Không tìm thấy thông tin 8GB nào trên trang sau khi lọc RAM!"
        );

        int debugCount = Math.min(ramTexts.size(), 3);
        for (int i = 0; i < debugCount; i++) {
            System.out.println("Match RAM text #" + (i + 1) + ": " + ramTexts.get(i).getText());
        }
    }

    @Test(dependsOnMethods = "PRODUCT_FILTER_02_filterByRam")
    public void PRODUCT_FILTER_03_filterByPriceRange() throws InterruptedException {
        driver.get("https://cellphones.com.vn/mobile/apple.html");

        By priceFilterBtnBy = By.xpath("//div[@id='filterModule']/div/div[2]/button");
        WebElement priceFilterBtn = wait.until(
                ExpectedConditions.elementToBeClickable(priceFilterBtnBy)
        );
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", priceFilterBtn);
        priceFilterBtn.click();
        Thread.sleep(1000);

        WebElement minHandle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[@id='filterModule']/div/div[2]/div/div[1]/div[2]/div/div[2]/div[1]")
                )
        );

        WebElement maxHandle = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[@id='filterModule']/div/div[2]/div/div[1]/div[2]/div/div[3]/div[1]")
                )
        );

        js.executeScript("arguments[0].scrollIntoView({block:'center'});", minHandle);
        Thread.sleep(500);

        Actions actions = new Actions(driver);
        actions.dragAndDropBy(minHandle, 80, 0).perform();
        Thread.sleep(800);

        actions.dragAndDropBy(maxHandle, -60, 0).perform();
        Thread.sleep(800);

        By applyBtnBy = By.xpath(
                "//div[@id='filterModule']/div/div[2]//button[contains(normalize-space(),'Xem kết quả')]"
        );
        WebElement applyBtn = wait.until(ExpectedConditions.elementToBeClickable(applyBtnBy));

        js.executeScript("arguments[0].scrollIntoView({block:'center'});", applyBtn);
        Thread.sleep(500);
        js.executeScript("arguments[0].click();", applyBtn);

        try {
            WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(3));
            WebElement closeAd = shortWait.until(
                    ExpectedConditions.elementToBeClickable(
                            By.xpath("//button[contains(@class,'close') or contains(@class,'btn-close') or @aria-label='Close' or text()='×' or text()='✕']")
                    )
            );
            closeAd.click();
            Thread.sleep(500);
        } catch (Exception ignored) {}

        WebElement priceTag = wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[contains(normalize-space(),'Giá từ') and contains(.,'đ - ')]")
                )
        );
        String tagText = priceTag.getText();

        Pattern p = Pattern.compile("(\\d{1,3}(?:\\.\\d{3})+)");
        Matcher m = p.matcher(tagText);

        int minPrice = 0;
        int maxPrice = Integer.MAX_VALUE;

        if (m.find()) {
            minPrice = Integer.parseInt(m.group(1).replace(".", ""));
        }
        if (m.find()) {
            maxPrice = Integer.parseInt(m.group(1).replace(".", ""));
        }

        List<WebElement> priceElements = driver.findElements(
                By.xpath("//div[contains(@class,'product')]//*[contains(text(),'đ') or contains(text(),'₫')]")
        );

        Assert.assertTrue(priceElements.size() > 0,
                "Không tìm thấy giá sản phẩm nào sau khi lọc theo khoảng giá!");

        int maxToScan = Math.min(priceElements.size(), 12);
        Pattern pricePattern = Pattern.compile("(\\d{1,3}(?:\\.\\d{3})+)");
        int checked = 0;

        for (int i = 0; i < maxToScan; i++) {
            String priceText = priceElements.get(i).getText().trim();
            String lower = priceText.toLowerCase();

            if (lower.contains("smember") ||
                    lower.contains("giảm đến") ||
                    lower.contains("voucher") ||
                    (lower.contains("giảm") && lower.contains("%"))) {
                continue;
            }

            Matcher pm = pricePattern.matcher(priceText);

            if (!pm.find()) {
                continue;
            }

            int price = Integer.parseInt(pm.group(1).replace(".", ""));

            if (price < minPrice) {
                continue;
            }

            Assert.assertTrue(
                    price >= minPrice && price <= maxPrice,
                    "Giá nằm ngoài khoảng UI hiển thị: (" + minPrice + " - " + maxPrice + "): " + priceText
            );

            checked++;
        }

        Assert.assertTrue(checked > 0,
                "Không validate được giá sản phẩm thực tế nào sau khi lọc!");
    }

    @Test (dependsOnMethods = "PRODUCT_FILTER_03_filterByPriceRange")
    public void PRODUCT_FILTER_04_resetFilters() throws InterruptedException {
        driver.get("https://cellphones.com.vn/mobile/apple.html");

        By filterGroupBtnBy = By.xpath("//div[@id='filterModule']/div/div[12]/button");
        WebElement filterGroupBtn = wait.until(
                ExpectedConditions.elementToBeClickable(filterGroupBtnBy)
        );
        js.executeScript("arguments[0].scrollIntoView({block:'center'});", filterGroupBtn);
        Thread.sleep(400);
        filterGroupBtn.click();

        By option2By = By.xpath("//div[@id='filterModule']/div/div[12]/div/ul/li[2]/button");
        WebElement option2Btn = wait.until(
                ExpectedConditions.elementToBeClickable(option2By)
        );
        option2Btn.click();

        By applyFilterBtnBy = By.xpath("//div[@id='filterModule']/div/div[12]/div/div/button[2]");
        WebElement applyFilterBtn = wait.until(
                ExpectedConditions.elementToBeClickable(applyFilterBtnBy)
        );
        applyFilterBtn.click();

        wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(normalize-space(),'Đang lọc theo')]")
        ));

        List<WebElement> activeFilterTagsBefore = driver.findElements(
                By.xpath(
                        "//*[contains(normalize-space(),'Đang lọc theo')]" +
                                "//button[not(contains(normalize-space(),'Bỏ chọn tất cả'))]"
                )
        );

        Assert.assertTrue(
                activeFilterTagsBefore.size() > 0,
                "Trước khi reset KHÔNG có tag lọc nào — testcase reset mất ý nghĩa!"
        );

        By resetAllBtnBy = By.cssSelector("#filterModule button.btn-filter.reset");
        WebElement resetAllBtn = wait.until(
                ExpectedConditions.elementToBeClickable(resetAllBtnBy)
        );
        resetAllBtn.click();

        WebDriverWait shortWait = new WebDriverWait(driver, Duration.ofSeconds(5));
        shortWait.until(d -> {
            List<WebElement> tags = d.findElements(
                    By.xpath(
                            "//*[contains(normalize-space(),'Đang lọc theo')]" +
                                    "//button[not(contains(normalize-space(),'Bỏ chọn tất cả'))]"
                    )
            );
            return tags.isEmpty();
        });

        List<WebElement> activeFilterTagsAfter = driver.findElements(
                By.xpath(
                        "//*[contains(normalize-space(),'Đang lọc theo')]" +
                                "//button[not(contains(normalize-space(),'Bỏ chọn tất cả'))]"
                )
        );

        Assert.assertEquals(
                activeFilterTagsAfter.size(),
                0,
                "Sau khi reset vẫn còn tag lọc!"
        );
    }

    @Test (dependsOnMethods = "PRODUCT_FILTER_04_resetFilters")
    public void PRODUCT_FILTER_05_sortByPriceAscDesc() throws InterruptedException {
        driver.get("https://cellphones.com.vn/mobile/apple.html");

        wait.until(
                ExpectedConditions.visibilityOfElementLocated(
                        By.xpath("//*[contains(normalize-space(),'Sắp xếp theo')]")
                )
        );

        java.util.function.Supplier<java.util.List<Integer>> getPrices = () -> {
            java.util.List<Integer> prices = new java.util.ArrayList<>();
            java.util.List<WebElement> priceElements = driver.findElements(
                    By.xpath("//div[contains(@class,'product')]//*[contains(text(),'đ') or contains(text(),'₫')]")
            );

            Pattern pricePattern = Pattern.compile("(\\d{1,3}(?:\\.\\d{3})+)");
            for (WebElement el : priceElements) {
                String txt = el.getText().trim();
                String lower = txt.toLowerCase();

                if (lower.contains("smember") ||
                        lower.contains("giảm") ||
                        lower.contains("trả góp") ||
                        lower.contains("voucher") ||
                        lower.contains("%")) {
                    continue;
                }

                Matcher m = pricePattern.matcher(txt);
                if (!m.find()) continue;

                int p;
                try {
                    p = Integer.parseInt(m.group(1).replace(".", ""));
                } catch (NumberFormatException ignore) {
                    continue;
                }

                if (p < 1_000_000) continue;

                prices.add(p);
            }
            return prices;
        };

        WebElement lowToHighBtn = wait.until(
                ExpectedConditions.elementToBeClickable(By.linkText("Giá Thấp - Cao"))
        );
        lowToHighBtn.click();

        wait.until(ExpectedConditions.urlContains("order=filter_price&dir=asc"));
        Thread.sleep(1500);

        java.util.List<Integer> ascPrices = getPrices.get();
        Assert.assertTrue(ascPrices.size() >= 3,
                "Không đủ giá sản phẩm để kiểm tra sắp xếp (asc)!");

        int min = java.util.Collections.min(ascPrices);
        int max = java.util.Collections.max(ascPrices);

        Assert.assertEquals(
                ascPrices.get(0),
                Integer.valueOf(min),
                "Giá đầu tiên không phải giá nhỏ nhất khi chọn 'Giá Thấp - Cao'!"
        );

        Assert.assertEquals(
                ascPrices.get(ascPrices.size() - 1),
                Integer.valueOf(max),
                "Giá cuối cùng không phải giá lớn nhất khi chọn 'Giá Thấp - Cao'!"
        );
    }

    @AfterClass(alwaysRun = true)
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
