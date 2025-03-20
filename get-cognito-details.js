/**
 * This script retrieves Cognito User Pool details from AWS
 * 
 * Prerequisites:
 * 1. AWS CLI installed and configured with appropriate credentials
 * 2. Node.js installed
 * 
 * To run: node get-cognito-details.js
 */

const { exec } = require('child_process');
const fs = require('fs');

// Get a list of all user pools
exec('aws cognito-idp list-user-pools --max-results 60', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error listing user pools: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Error: ${stderr}`);
    return;
  }
  
  try {
    const userPools = JSON.parse(stdout).UserPools;
    console.log('Found User Pools:');
    
    userPools.forEach((pool, index) => {
      console.log(`${index + 1}. ${pool.Name} (${pool.Id})`);
    });
    
    console.log('\nTo get full details for a specific User Pool:');
    console.log('aws cognito-idp describe-user-pool --user-pool-id YOUR_USER_POOL_ID');
    
    console.log('\nTo get the App Client details for a User Pool:');
    console.log('aws cognito-idp list-user-pool-clients --user-pool-id YOUR_USER_POOL_ID');
    
    console.log('\n===== INSTRUCTIONS =====');
    console.log('1. Choose your User Pool from the list above.');
    console.log('2. Copy its ID.');
    console.log('3. Run the commands above with your User Pool ID to get more details.');
    console.log('4. Update your aws-exports.js file with the User Pool ID and App Client ID.');
    console.log('5. Or set the values in your .env.local file.');

  } catch (err) {
    console.error('Error parsing AWS CLI output:', err);
  }
}); 