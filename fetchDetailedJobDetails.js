const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const { saveJobDetailsToDynamoDB } = require('./saveDetailsToDynamoDB');

async function fetchDetailedJobDetails() {
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

  for (const job of basicJobs) {
    try {
      if (!job.url || typeof job.url !== 'string') {
        console.error('Invalid job URL:', job.url);
        continue;
      }

      console.log(`Navigating to job URL: ${job.url}`);
      await page.goto(job.url, { waitUntil: 'networkidle2' });

      const jobDetails = await page.evaluate(() => {
        const locationElements = document.querySelectorAll('.location_sm.row div:nth-child(2)');
        const descriptionElement = document.querySelector('.job_description');
        const salaryElement = document.querySelector('.salary_sm');
        const benefitsElement = document.querySelector('.benefits_sm');

        const salary = salaryElement ? salaryElement.innerText.replace('Salary:', '').trim() : 'Salary not listed';
        const benefits = benefitsElement ? benefitsElement.innerText.replace('Benefits:', '').trim() : 'Benefits not listed';
        const location = Array.from(locationElements).map(elem => elem.textContent.trim()).join(', ') || 'Location not listed';
        const jobDescriptionText = descriptionElement ? descriptionElement.innerText.trim() : 'Job description not listed';

        return {
          location,
          jobDescription: {
            salary,
            benefits,
            description: jobDescriptionText
          }
        };
      });

      const detailedJob = { ...job, ...jobDetails };
      console.log('Saving job details:', detailedJob);
      await saveJobDetailsToDynamoDB(detailedJob);
    } catch (error) {
      console.error(`Error processing job: ${job.title}`, error);
    }
  }

  await browser.close();
}

module.exports = fetchDetailedJobDetails;