// AWS Configuration for SavEarn Frontend
// Updated with actual deployment values

const AWS_CONFIG = {
  // API Gateway endpoint
  API_BASE_URL: 'https://0zu0t6r210.execute-api.ap-south-1.amazonaws.com/dev',
  
  // AWS Cognito configuration
  COGNITO: {
    userPoolId: 'ap-south-1_zybIVZnp4',
    clientId: '50eekrtr5d8olj5vj3qqokt1jl',
    region: 'ap-south-1'
  },
  
  // AWS region
  REGION: 'ap-south-1'
};

// Export for use in frontend
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AWS_CONFIG;
}
