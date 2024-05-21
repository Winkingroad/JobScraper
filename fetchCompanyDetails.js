const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { v4: uuidv4 } = require('uuid');
const { saveCompanyDetailsToDynamoDB } = require('./saveDetailsToDynamoDB');

async function fetchCompanyDetails() {
  let basicJobs;
  try {
    basicJobs = JSON.parse(await fs.readFile('jobsDataBasic.json', 'utf-8'));
  } catch (error) {
    console.error('Error reading jobsDataBasic.json file:', error);
    return;
  }

  if (!Array.isArray(basicJobs) || basicJobs.length === 0) {
    console.error('Invalid data in jobsDataBasic.json file');
    return;
  }

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const companies = new Set();

  for (const job of basicJobs) {
    try {
      if (!job.url || typeof job.url !== 'string') {
        console.error('Invalid job URL:', job.url);
        continue;
      }

      console.log(`Navigating to job URL: ${job.url}`);
      await page.goto(job.url, { waitUntil: 'networkidle2' });

      const companyDetails = await page.evaluate(() => {
        const websiteElement = document.querySelector('.links_sm a');
        const logoElement = document.querySelector('.job_company_logo');
        const companyDescriptionElement = document.querySelector('.job_description');

        const website = websiteElement ? websiteElement.href : 'Website was not listed';
        const logo = logoElement ? logoElement.src : 'Company logo was not listed';
        const description = companyDescriptionElement ? companyDescriptionElement.innerText.trim() : 'Company description was not listed';
        const company = companyDescriptionElement ? companyDescriptionElement.textContent.trim().split('\n')[0] : '';

        return { company, companyDetails: { website, logo, description } };
      });

      if (!companyDetails.company) {
        console.error('Company name not found on the page');
        continue;
      }

      if (!companies.has(companyDetails.company)) {
        companyDetails.companyId = uuidv4();
        companies.add(companyDetails.company);
        await saveCompanyDetailsToDynamoDB(companyDetails);
        console.log('Company details saved:', companyDetails);
      }
    } catch (error) {
      console.error(`Error processing job: ${job.title}`, error);
    }
  }

  await browser.close();
}

module.exports = fetchCompanyDetails;