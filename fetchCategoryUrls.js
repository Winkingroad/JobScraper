const puppeteer = require('puppeteer');
const fs = require('fs/promises');

const BASE_URL = 'https://remote.co/remote-jobs/';
const CATEGORY_FILE = 'categories.json';

async function fetchCategoryUrls() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto(BASE_URL, { waitUntil: 'networkidle2' });

  // Get all category URLs
  const categoryUrls = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.card-body h2 a')).map(category => {
      const url = category.href;
      return url ? (url.startsWith('http') ? url : new URL(url, document.location.origin).href) : '';
    }).filter(url => url); // Filter out empty URLs
  });

  console.log(`Found ${categoryUrls.length} categories`);

  await fs.writeFile(CATEGORY_FILE, JSON.stringify(categoryUrls, null, 2));
  console.log('Category URLs saved to categories.json');

  await browser.close();
}

fetchCategoryUrls().catch(console.error);
