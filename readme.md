# Remote Job Scraper

A Node.js web scraper that fetches remote job listings from various categories and extracts detailed job and company information. The scraper can save the data locally or store it in AWS DynamoDB tables.

## Features

- Fetch Category URLs: Fetch URLs for various job categories like software development, design, marketing, etc.
- Scrape Job Listings: Scrape job listings from remote job boards like We Work Remotely, Remote.co, and others.
- Fetch Detailed Job Details: Extract detailed job information like job description, company name, location, and more.
- Fetch Company Details: Fetch comprehensive company details like company size, industry, website, and more.
- Save Data Locally: Save job and company details to local JSON files for further processing.
- Save Data to DynamoDB: Save job and company details to AWS DynamoDB tables for scalable storage.

## Prerequisites

- Node.js installed on your machine.
- An AWS account with access to DynamoDB (for saving data to DynamoDB).

## Installation

Clone the repository:

```bash
git clone https://github.com/Winkingroad/JobScraper.git
```

Install dependencies:

```bash
cd remote-job-scraper
npm install
```

## Usage

### Running Locally

Fetch category URLs:

```bash
node fetchCategoryUrls.js
```

Run the main script:

```bash
node main.js
```

This will scrape job listings, fetch detailed job and company details, and save them locally.

### Running on DynamoDB

1. Set up AWS credentials with access to DynamoDB.
2. Create two DynamoDB tables named `RemoteCoJobs` and `RemoteCoCompanies` with appropriate attributes.
3. Update AWS credentials in `saveDetailsToDynamoDB.js` with your access key ID and secret access key.
4. Run the main script:

```bash
node main.js
```

This will scrape job listings, fetch detailed job and company details, and save them to DynamoDB tables.

### Deploying to AWS Lambda

To deploy the scraper to AWS Lambda, follow these steps:

1. Create a new Lambda function in the AWS Management Console.
2. Set the runtime to Node.js 14.x.
3. Create a new deployment package by running:

```bash
npm run build
```

This will create a `dist` folder with the necessary files for deployment.

4. Zip the contents of the `dist` folder and upload the zip file to the Lambda function.
5. Set the handler to main.handler (assuming you're using the main.js file as the entry point).
6. Adjust the memory and timeout settings as needed.
7. Add any necessary environment variables (e.g., AWS credentials).
8. Deploy the function.

#### Note: 

***The scraper may take longer to run on AWS Lambda due to the cold start time and other limitations. Make sure to adjust the timeout settings accordingly.***


## Performance Considerations

- **Efficiency**: The scripts are designed to be efficient and structured to run smoothly in a local environment.
- **Lightweight**: The code is lightweight and less resource-intensive to ensure smooth operation in an AWS Lambda deployment.
- **Minimal Dependencies**: The project uses minimal dependencies to avoid unnecessary overhead.

## Project Structure

- `mainScrapper.js`: The main script that orchestrates the entire process.
- `fetchCategoryUrls.js`: Fetches category URLs and saves them to `categories.json`.
- `fetchBasicJobDetails.js`: Scrapes job listings and saves basic job details to `jobsDataBasic.json`.
- `fetchDetailedJobDetails.js`: Fetches detailed job details and saves them to DynamoDB.
- `fetchCompanyDetails.js`: Fetches comprehensive company details and saves them to DynamoDB.
- `saveDetailsToDynamoDB.js`: Saves job and company details to DynamoDB tables.
