const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': false,
  'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept,Accept-Language,Accept-Encoding',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Max-Age': '86400'
};

const response = (statusCode, body) => {
  console.log(`📤 Sending response: ${statusCode}`, JSON.stringify(body, null, 2));
  return {
    statusCode,
    headers,
    body: JSON.stringify(body)
  };
};

const getUserId = (event) => {
  console.log('🔍 Extracting user ID from authorizer claims...');
  console.log('Event requestContext:', JSON.stringify(event.requestContext, null, 2));
  
  // Temporary: return a default user ID when no authorization context
  if (!event.requestContext || !event.requestContext.authorizer) {
    console.log('⚠️ No authorizer context found - using default user ID');
    return 'temp-user-id';
  }
  
  if (!event.requestContext.authorizer.claims) {
    console.error('❌ No claims found in authorizer');
    throw new Error('No authorization claims');
  }
  
  const userId = event.requestContext.authorizer.claims.sub;
  console.log('✅ Extracted user ID:', userId);
  return userId;
};

module.exports = {
  dynamodb,
  headers,
  response,
  getUserId
};
