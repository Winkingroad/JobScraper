const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const CATEGORY_FILE = 'categories.json';

async function fetchBasicJobDetails() {
  let categoryUrls;
  try {
    categoryUrls = JSON.parse(await fs.readFile(CATEGORY_FILE, 'utf-8'));
  } catch (error) {
    console.error(`Error reading ${CATEGORY_FILE} file:`, error);
    return;
  }

  if (!Array.isArray(categoryUrls) || categoryUrls.length === 0) {
    console.error(`Invalid data in ${CATEGORY_FILE} file`);
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  console.log(`Loaded ${categoryUrls.length} categories from ${CATEGORY_FILE}`);

  const allJobs = [];

  for (const categoryUrl of categoryUrls) {
    if (!categoryUrl || typeof categoryUrl !== 'string') {
      console.error('Invalid category URL:', categoryUrl);
      continue;
    }

    console.log(`Navigating to category URL: ${categoryUrl}`);
    try {
      await page.goto(categoryUrl, { waitUntil: 'networkidle2' });
    } catch (error) {
      console.error(`Error navigating to category URL: ${categoryUrl}`, error);
      continue;
    }

    const jobs = await page.evaluate(() => {
      const jobElements = Array.from(document.querySelectorAll('a.card.m-0.border-left-0.border-right-0.border-top-0.border-bottom'));
      return jobElements.map(job => {
        const titleElement = job.querySelector('.card-body.px-3.py-0.pl-md-0 p span:nth-child(1)');
        const companyElement = job.querySelector('.m-0.text-secondary');
        const cleanCompanyText = companyElement ? companyElement.textContent.replace(/\n\s+/g, ' ').trim() : 'Company not listed';
        const title = titleElement ? titleElement.textContent.trim().split('\n')[0] : 'Job title not found';
        const url = job.href ? (job.href.startsWith('http') ? job.href : new URL(job.href, document.location.origin).href) : '';
        const company = cleanCompanyText.split('|')[0].trim();
        const category = document.location.pathname.split('/').slice(-2, -1)[0].replace('-', ' ') || 'Category not found';

        return { title, url, company, category };
      }).filter(job => job.url); // Filter out jobs with empty URLs
    });

    console.log(`Found ${jobs.length} jobs in category`);
    allJobs.push(...jobs);
  }

  // Add a unique jobId to each job
  const jobsWithIds = allJobs.map(job => ({ ...job, jobId: uuidv4() }));
  await fs.writeFile('jobsDataBasic.json', JSON.stringify(jobsWithIds, null, 2));
  console.log(`Stored basic job information in jobsDataBasic.json`);
  console.log(jobsWithIds);

  await browser.close();
}

module.exports = fetchBasicJobDetails;