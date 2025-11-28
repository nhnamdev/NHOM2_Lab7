import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;
import org.openqa.selenium.JavascriptExecutor;
import java.time.Duration;

public class ProductDetailTest {

    private WebDriver driver;
    private WebDriverWait wait;
    private JavascriptExecutor js;

    @BeforeClass
    public void setUp() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        js = (JavascriptExecutor) driver;
    }

    @Test
    public void PRODUCT_PD_01_checkProductDetailInformation() {
        driver.get("https://cellphones.com.vn/mobile.html");

        WebElement firstProduct = wait.until(
                ExpectedConditions.elementToBeClickable(
                        By.xpath("//a[contains(.,'Samsung Galaxy Z Flip7')]")
                )
        );
        firstProduct.click();

        WebElement productName = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.tagName("h1"))
        );

        Assert.assertTrue(productName.isDisplayed(), "Tên sản phẩm không hiển thị!");

        WebElement price = wait.until(ExpectedConditions.visibilityOfElementLocated(
                By.xpath("//*[contains(@class,'price') and contains(.,'đ')]")
        ));
        Assert.assertTrue(price.isDisplayed(), "Giá sản phẩm không hiển thị!");

        java.util.List<WebElement> images = driver.findElements(By.tagName("img"));
        Assert.assertTrue(!images.isEmpty(), "Không thấy hình ảnh sản phẩm!");

        WebElement spec = driver.findElement(
                By.xpath("//*[contains(text(),'Thông số kỹ thuật') or contains(text(),'Cấu hình')]")
        );
        Assert.assertTrue(spec.isDisplayed(), "Không thấy khu vực thông số kỹ thuật!");
    }

    @Test(dependsOnMethods = "PRODUCT_PD_01_checkProductDetailInformation")
    public void PRODUCT_PD_02_checkChangeImage() throws InterruptedException {

        driver.get("https://cellphones.com.vn/dien-thoai-samsung-galaxy-z-flip-7.html");

        WebElement detailBlock = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("productDetailV2"))
        );
        js.executeScript("arguments[0].scrollIntoView(true);", detailBlock);
        Thread.sleep(800);

        By thumb1 = By.xpath("//div[@id='productDetailV2']/section/div/div/div[2]/div/div[2]/div/div[3]/img");
        By thumb2 = By.xpath("//div[@id='productDetailV2']/section/div/div/div[2]/div/div[2]/div/div[4]/img");
        By thumb3 = By.xpath("//div[@id='productDetailV2']/section/div/div/div[2]/div/div[2]/div/div[5]/img");

        safeClick(thumb1, "Thumbnail 1 không hiển thị hoặc không click được!");
        Thread.sleep(800);
        safeClick(thumb2, "Thumbnail 2 không hiển thị hoặc không click được!");
        Thread.sleep(800);
        safeClick(thumb3, "Thumbnail 3 không hiển thị hoặc không click được!");
        Thread.sleep(800);
    }

    private void safeClick(By locator, String errorMessage) {
        WebElement el = wait.until(ExpectedConditions.elementToBeClickable(locator));
        Assert.assertTrue(el.isDisplayed(), errorMessage);

        try {
            el.click();
        } catch (Exception e) {
            js.executeScript("arguments[0].click();", el);
        }
    }

    @Test(dependsOnMethods = "PRODUCT_PD_02_checkChangeImage")
    public void PRODUCT_PD_03_checkChangeVariant() throws InterruptedException {

        driver.get("https://cellphones.com.vn/dien-thoai-samsung-galaxy-z-flip-7.html");

        WebElement detailBlock = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("productDetailV2"))
        );
        js.executeScript("arguments[0].scrollIntoView(true);", detailBlock);
        Thread.sleep(800);

        By link512 = By.xpath("//div[@id='productDetailV2']/section/div/div[2]/div[2]/div[2]/a/strong");
        WebElement option512 = wait.until(ExpectedConditions.elementToBeClickable(link512));
        Assert.assertTrue(option512.isDisplayed(), "Option đổi sang bản 512GB không hiển thị!");
        option512.click();

        wait.until(ExpectedConditions.urlContains("samsung-galaxy-z-flip-7-12gb-512gb"));
        WebElement title512 = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.tagName("h1"))
        );
        Assert.assertTrue(title512.isDisplayed(), "Trang 512GB không load đúng!");

        WebElement detailBlock512 = wait.until(
                ExpectedConditions.visibilityOfElementLocated(By.id("productDetailV2"))
        );
        js.executeScript("arguments[0].scrollIntoView(true);", detailBlock512);
        Thread.sleep(800);

        By opt2 = By.xpath("//div[@id='productDetailV2']/section/div/div[2]/div[3]/div[2]/ul/li[2]/a/div/strong");
        safeClick(opt2, "Option thứ 2 không hiển thị!");
        Thread.sleep(500);

        By opt3 = By.xpath("//div[@id='productDetailV2']/section/div/div[2]/div[3]/div[2]/ul/li[3]/a");
        js.executeScript("window.scrollBy(0, -200);");
        Thread.sleep(300);

        safeClick(opt3, "Option thứ 3 không hiển thị!");
        Thread.sleep(500);
    }

    @AfterClass
    public void tearDown() {
        if (driver != null) driver.quit();
    }
}
