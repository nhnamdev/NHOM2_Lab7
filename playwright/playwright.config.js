const { defineConfig, devices } = require('@playwright/test');

/**
 * Cấu hình Playwright cho dự án test Cellphones.com.vn
 * Gộp tất cả test cases từ Selenium và Playwright
 */
module.exports = defineConfig({
  // Thư mục chứa test files
  testDir: './tests',
  
  // Timeout cho mỗi test
  timeout: 60 * 1000, // 60 giây
  
  // Timeout cho mỗi assertion
  expect: {
    timeout: 10000
  },
  
  // Chạy tests song song
  fullyParallel: false,
  
  // Số lần retry khi test fail
  retries: 1,
  
  // Số workers (browsers) chạy đồng thời
  workers: 1,
  
  // Reporter configuration - HTML và JSON
  reporter: [
    ['html', { 
      outputFolder: 'reports/html',
      open: 'never' 
    }],
    ['json', { 
      outputFile: 'reports/json/results.json' 
    }],
    ['list']
  ],
  
  // Cấu hình chung cho tất cả tests
  use: {
    // Base URL
    baseURL: 'https://cellphones.com.vn',
    
    // Screenshot khi test fail
    screenshot: 'only-on-failure',
    
    // Video khi test fail
    video: 'retain-on-failure',
    
    // Trace khi test fail
    trace: 'retain-on-failure',
    
    // Viewport mặc định
    viewport: { width: 1920, height: 1080 },
    
    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,
    
    // Action timeout
    actionTimeout: 15000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Cấu hình cho từng browser
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        headless: false, // Hiển thị browser khi chạy
        launchOptions: {
          slowMo: 100 // Chạy chậm 100ms mỗi action để dễ quan sát
        }
      },
    },
    
    // Uncomment để test trên Firefox
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    
    // Uncomment để test trên WebKit (Safari)
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
  ],
});
