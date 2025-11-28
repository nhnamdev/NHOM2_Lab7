"use strict";

const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto("https://cellphones.com.vn/");

  await page.click("[class^='disabled\\:bg-primary'], [class*=' disabled\\:bg-primary']");
  await page.waitForTimeout(2000);

  await page.click(".rounded-\\[8px\\]");
  await page.waitForTimeout(2000);

  // Click Google login (triggers redirect)
  await page.click(".tablet\\:gap-large > :nth-child(1)");
  await page.waitForLoadState('domcontentloaded');// Wait for Google page to load
  await page.waitForTimeout(2000); // Wait to see UI

  // Go back to login page
  await page.goto('https://smember.com.vn/login');
  await page.waitForTimeout(2000);

  // Click Zalo login (triggers redirect)
  await page.click(".tablet\\:gap-large > :nth-child(2) .hidden");
  await page.waitForLoadState('domcontentloaded'); // Wait for Zalo page to load
  await page.waitForTimeout(1000); // Wait to see UI

  // Go back to login page
  await page.goto('https://smember.com.vn/login');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:text-info'], [class*=' cpsui\\:text-info']");
  await page.waitForTimeout(2000);

  await page.dblclick("[data-slot='input']");
  await page.waitForTimeout(2000);

  await page.click("[data-slot='input']");
  await page.waitForTimeout(2000);

  await page.type("[data-slot='input']", '0793450521');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  await page.dblclick("[data-slot='input']");
  await page.waitForTimeout(2000);

  await page.fill("[data-slot='input']", '0793450529');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  await page.goto('https://smember.com.vn/login');
  await page.waitForTimeout(2000);

  await page.click("[placeholder='Nhập số điện thoại của bạn']");
  await page.waitForTimeout(2000);

  await page.fill("[placeholder='Nhập số điện thoại của bạn']", '0793450529');
  await page.waitForTimeout(2000);

  await page.click("[type='password']");
  await page.waitForTimeout(2000);

  await page.fill("[type='password']", 'Haipro');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  await page.dblclick("[type='password']");
  await page.waitForTimeout(2000);

  await page.fill("[type='password']", '');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  // Converting a 'drag' step has to be done manually at this time
  await page.fill("[placeholder='Nhập số điện thoại của bạn']", '1');
  await page.waitForTimeout(2000);

  await page.click("[type='password']");
  await page.waitForTimeout(2000);

  await page.fill("[type='password']", 'Haipro123');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  await page.click("[placeholder='Nhập số điện thoại của bạn']");
  await page.waitForTimeout(2000);

  await page.fill("[placeholder='Nhập số điện thoại của bạn']", '0793450529');
  await page.waitForTimeout(2000);

  await page.click("[class^='cpsui\\:border-primary'], [class*=' cpsui\\:border-primary']");
  await page.waitForTimeout(2000);

  await browser.close();
})();
