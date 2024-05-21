# Remote Job Scraper

This project is designed to scrape remote job listings from the homepage of remote.co, extract comprehensive job and company details, and store them either locally or in an AWS DynamoDB table.

## Functionality

1. **Scraping Job Listings**: The script fetches category URLs from remote.co and scrapes job listings from each category.

2. **Extracting Job Details**: It extracts various details about each job, including the job title, company name, job location, description URL, and detailed description from the individual job's page.

3. **Extracting Company Details**: Additionally, the script extracts comprehensive company information where available, such as the company website, logo URL, description, funding information, and any other available details.

## How to Run Locally

1. **Setup**: Ensure you have Node.js installed on your machine.

2. **Installation**: Run `npm install` to install the necessary dependencies.

3. **Scrape Category URLs**: Execute the `fetchCategoryUrls.js` script to fetch category URLs and save them to `categories.json`.

4. **Run Main Script**: Execute the `main.js` script to scrape job listings, fetch detailed job and company details, and save them locally.

## How to Run on DynamoDB

1. **Setup AWS Credentials**: Ensure you have AWS credentials configured on your machine with access to DynamoDB.

2. **Setup DynamoDB Tables**: Create two DynamoDB tables named `RemoteCoJobs` and `RemoteCoCompanies` with appropriate attributes for job and company details.

3. **Update AWS Credentials**: Update the AWS credentials in the `saveDetailsToDynamoDB.js` script with your AWS access key ID and secret access key.

4. **Run Main Script**: Execute the `main.js` script, which orchestrates the entire process. This will scrape job listings, fetch detailed job and company details, and save them to DynamoDB tables.

## Performance Considerations

1. **Efficiency**: The scripts are designed to be efficient and structured to run smoothly in a local environment.

2. **Lightweight**: The code is lightweight and less resource-intensive to ensure smooth operation in an AWS Lambda deployment.

3. **Minimal Dependencies**: The project uses minimal dependencies to avoid unnecessary overhead.

## Data Storage

1. **Local Storage**: Job and company details can be saved locally in JSON format for easy viewing.

2. **DynamoDB Storage**: Optionally, job and company details can be stored in DynamoDB tables. The scripts ensure deduplication to avoid storing duplicate data.

### mainScrapper.js

**mainScrapper.js** is the main script that orchestrates the entire process of scraping job listings, fetching detailed job and company details, and saving them locally.

### fetchCategoryUrls.js

**fetchCategoryUrls.js** is a script that fetches category URLs from remote.co and saves them to `categories.json`.

### fetchBasicJobDetails.js

**fetchBasicJobDetails.js** is a script that scrapes job listings from category URLs and saves basic job details to `jobsDataBasic.json`.

### fetchDetailedJobDetails.js

**fetchDetailedJobDetails.js** is a script that fetches detailed job details from individual job pages and saves them to dynamoDB and console them for easy viewing.

### fetchCompanyDetails.js

**fetchCompanyDetails.js** is a script that fetches comprehensive company details from individual job pages and saves them to dynamoDB and console them for easy viewing.

### saveDetailsToDynamoDB.js

**saveDetailsToDynamoDB.js** is a script that saves job and company details to DynamoDB tables.

