const AWS = require('aws-sdk');

// Initialize DynamoDB client with credentials from environment variables
const dynamodb = new AWS.DynamoDB({
  region: 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

async function saveJobDetailsToDynamoDB(jobDetails) {
  // Validate input data
  if (!jobDetails || typeof jobDetails !== 'object') {
    console.error('Invalid input data for job details');
    return;
  }

  const { jobId, title, url, company, location, jobDescription, category } = jobDetails;

  // Check if required fields are present
  if (!jobId || !title || !url || !company || !location || !jobDescription || !category) {
    console.error('Missing required fields in job details');
    return;
  }

  const params = {
    TableName: 'RemoteCoJobs',
    Item: {
      'jobId': { S: jobId },
      'title': { S: title },
      'url': { S: url },
      'company': { S: company },
      'location': { S: location },
      'jobDescription': { S: JSON.stringify(jobDescription) },
      'category': { S: category },
    },
    ConditionExpression: 'attribute_not_exists(jobId)' // Avoid duplication
  };

  try {
    await dynamodb.putItem(params).promise();
    console.log('Job details saved to DynamoDB.');
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.log('Job details already exist in DynamoDB, skipping.');
    } else {
      console.error('Error saving job details to DynamoDB:', error);
    }
  }
}

async function saveCompanyDetailsToDynamoDB(companyDetails) {
  // Validate input data
  if (!companyDetails || typeof companyDetails !== 'object') {
    console.error('Invalid input data for company details');
    return;
  }

  const { companyId, company, companyDetails } = companyDetails;

  // Check if required fields are present
  if (!companyId || !company || !companyDetails) {
    console.error('Missing required fields in company details');
    return;
  }

  const params = {
    TableName: 'RemoteCoCompanies',
    Item: {
      'companyId': { S: companyId },
      'company': { S: company },
      'companyDetails': { S: JSON.stringify(companyDetails) },
    },
    ConditionExpression: 'attribute_not_exists(companyId)' // Avoid duplication
  };

  try {
    await dynamodb.putItem(params).promise();
    console.log('Company details saved to DynamoDB.');
  } catch (error) {
    if (error.code === 'ConditionalCheckFailedException') {
      console.log('Company details already exist in DynamoDB, skipping.');
    } else {
      console.error('Error saving company details to DynamoDB:', error);
    }
  }
}

module.exports = {
  saveJobDetailsToDynamoDB,
  saveCompanyDetailsToDynamoDB
};