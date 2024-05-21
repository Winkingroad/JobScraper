const fetchBasicJobDetails = require('./fetchBasicJobDetails');
const fetchDetailedJobDetails = require('./fetchDetailedJobDetails');
const fetchCompanyDetails = require('./fetchCompanyDetails');

async function main() {
  try {
    // Step 1: Fetch and save basic job details
    await fetchBasicJobDetails();

    // Step 2: Fetch and save detailed job details
    await fetchDetailedJobDetails();

    // Step 3: Fetch and save company details
    await fetchCompanyDetails();

    console.log('All details fetched and saved successfully.');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main().catch(console.error);
