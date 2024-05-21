const puppeteer = require('puppeteer');
const fs = require('fs/promises');

const CATEGORY_FILE = 'categories.json';
const JOBS_FILE = 'jobsData.json';

// Function to read the existing job data
async function readExistingJobs() {
  try {
    const data = await fs.readFile(JOBS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Function to write job data to the JSON file incrementally
async function appendJobData(job) {
  const existingJobs = await readExistingJobs();
  existingJobs.push(job);
  await fs.writeFile(JOBS_FILE, JSON.stringify(existingJobs, null, 2));
}

// Function to fetch job details from a specific job URL
async function fetchJobDetailsFromUrl(page, job, category) {
  try {
    console.log(`Navigating to job URL: ${job.url}`);
    await page.goto(job.url, { waitUntil: 'networkidle2' });

    // Extract job details after visiting job-specific URL
    const jobDetails = await page.evaluate(() => {
      const locationElements = document.querySelectorAll('.location_sm.row div:nth-child(2)');
      const descriptionElement = document.querySelector('.job_description');
      const websiteElement = document.querySelector('.links_sm a');
      const logoElement = document.querySelector('.job_company_logo ');
      const companyDescriptionElement = document.querySelector('.job_description');

      // Extract salary
      const salaryElement = document.querySelector('.salary_sm');
      const salary = salaryElement ? salaryElement.innerText.replace('Salary:', '').trim() : '';

      // Extract benefits
      const benefitsElement = document.querySelector('.benefits_sm');
      const benefits = benefitsElement ? benefitsElement.innerText.replace('Benefits:', '').trim() : '';

      const location = Array.from(locationElements).map(elem => elem.textContent.trim()).join(', ');
      const jobDescriptionText = descriptionElement ? descriptionElement.innerText.trim() : '';
      const companyDetails = {
        website: websiteElement ? websiteElement.href : '',
        logo: logoElement ? logoElement.src : '',
        description: companyDescriptionElement ? companyDescriptionElement.innerText.trim() : ''
      };

      return {
        location,
        jobDescription: {
          salary,
          benefits,
          description: jobDescriptionText
        },
        companyDetails
      };
    });

    // Merge job details into job object and add the category
    Object.assign(job, jobDetails);
    job.category = category;

    // Log job details
    console.log(JSON.stringify(job, null, 2));

    // Append job data to the JSON file incrementally
    await appendJobData(job);

  } catch (error) {
    console.error(`Error processing job: ${job.title}`, error);
  }
}

// Function to fetch jobs from a category URL
async function fetchJobsFromCategory(page, categoryUrl, category) {
  try {
    console.log(`Navigating to category URL: ${categoryUrl}`);
    await page.goto(categoryUrl, { waitUntil: 'networkidle2' });

    const jobs = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('a.card.m-0.border-left-0.border-right-0.border-top-0.border-bottom')).map(job => {
        const titleElement = job.querySelector('.card-body.px-3.py-0.pl-md-0 p span:nth-child(1)');
        const companyElement = job.querySelector('.m-0.text-secondary');
        const cleanCompanyText = companyElement ? companyElement.textContent.replace(/\n\s+/g, ' ').trim() : '';

        return {
          title: titleElement ? titleElement.textContent.trim().split('\n')[0] : '',
          url: job.href ? (job.href.startsWith('http') ? job.href : new URL(job.href, document.location.origin).href) : '',
          company: cleanCompanyText.split('|')[0].trim()
        };
      }).filter(job => job.url); // Filter out jobs with empty URLs
    });

    console.log(`Found ${jobs.length} jobs in category`);

    for (const job of jobs) {
      await fetchJobDetailsFromUrl(page, job, category);
    }
  } catch (error) {
    console.error(`Error processing category URL: ${categoryUrl}`, error);
  }
}

// Main function to fetch job details
async function fetchJobDetails() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const categoryUrls = JSON.parse(await fs.readFile(CATEGORY_FILE, 'utf-8'));
  console.log(`Loaded ${categoryUrls.length} categories from categories.json`);

  for (const categoryUrl of categoryUrls) {
    // Extract the category name from the URL
    const category = categoryUrl.split('/').slice(-2, -1)[0].replace('-', ' ');
    await fetchJobsFromCategory(page, categoryUrl, category);
  }

  await browser.close();
}

fetchJobDetails().catch(console.error);
