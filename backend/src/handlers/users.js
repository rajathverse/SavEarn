const AWS = require('aws-sdk');
const { response, getUserId } = require('../utils/common');

const cognito = new AWS.CognitoIdentityServiceProvider();

// Get user profile information
module.exports.getProfile = async (event) => {
  try {
    const userId = getUserId(event);
    const userPoolId = process.env.COGNITO_USER_POOL_ID;

    // Get user details from Cognito
    const params = {
      UserPoolId: userPoolId,
      Username: userId
    };

    const user = await cognito.adminGetUser(params).promise();
    
    // Extract user attributes
    const attributes = {};
    user.UserAttributes.forEach(attr => {
      attributes[attr.Name] = attr.Value;
    });

    const userProfile = {
      userId: user.Username,
      email: attributes.email,
      name: attributes.name,
      emailVerified: attributes.email_verified === 'true',
      createdAt: user.UserCreateDate,
      lastModified: user.UserLastModifiedDate,
      status: user.UserStatus
    };

    return response(200, {
      data: userProfile
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    return response(500, { 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
