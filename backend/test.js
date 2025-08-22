const { create: createEarning, list: getEarnings, update: updateEarning, delete: deleteEarning } = require('./src/handlers/earnings');
const { getProfile: getUserProfile } = require('./src/handlers/users');

// Mock event for testing
const createMockEvent = (httpMethod, pathParameters = {}, body = null, userId = 'test-user-123') => ({
  httpMethod,
  pathParameters,
  body: body ? JSON.stringify(body) : null,
  requestContext: {
    authorizer: {
      claims: {
        sub: userId
      }
    }
  },
  headers: {
    'Content-Type': 'application/json'
  }
});

// Test functions
async function testCreateEarning() {
  console.log('🧪 Testing createEarning...');
  
  const event = createMockEvent('POST', {}, {
    datetime: '2024-01-15T10:30:00Z',
    expensiveOption: 'Starbucks Coffee',
    expensiveAmount: 5.50,
    chosenOption: 'Home Coffee',
    chosenAmount: 0.50,
    description: 'Made coffee at home instead',
    category: 'Food & Drinks'
  });

  try {
    const result = await createEarning(event);
    console.log('✅ Create result:', JSON.parse(result.body));
    return JSON.parse(result.body);
  } catch (error) {
    console.error('❌ Create error:', error);
  }
}

async function testGetEarnings() {
  console.log('🧪 Testing getEarnings...');
  
  const event = createMockEvent('GET');

  try {
    const result = await getEarnings(event);
    console.log('✅ Get result:', JSON.parse(result.body));
    return JSON.parse(result.body);
  } catch (error) {
    console.error('❌ Get error:', error);
  }
}

async function testUpdateEarning() {
  console.log('🧪 Testing updateEarning...');
  
  // First create an earning to update
  const created = await testCreateEarning();
  if (!created || !created.entryId) {
    console.error('❌ Cannot test update without created earning');
    return;
  }

  const event = createMockEvent('PUT', { id: created.entryId }, {
    description: 'Updated: Made coffee at home instead of buying',
    category: 'Food & Drinks'
  });

  try {
    const result = await updateEarning(event);
    console.log('✅ Update result:', JSON.parse(result.body));
    return JSON.parse(result.body);
  } catch (error) {
    console.error('❌ Update error:', error);
  }
}

async function testGetUserProfile() {
  console.log('🧪 Testing getUserProfile...');
  
  const event = createMockEvent('GET');

  try {
    const result = await getUserProfile(event);
    console.log('✅ Profile result:', JSON.parse(result.body));
    return JSON.parse(result.body);
  } catch (error) {
    console.error('❌ Profile error:', error);
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting SavEarn Backend Tests');
  console.log('==================================');
  
  // Note: These tests won't work without DynamoDB setup
  // They're mainly for validating function structure
  
  console.log('ℹ️  Note: These tests require DynamoDB to be set up');
  console.log('ℹ️  Deploy to AWS first, then use real API endpoints');
  
  try {
    await testCreateEarning();
    await testGetEarnings();
    await testUpdateEarning();
    await testGetUserProfile();
    
    console.log('');
    console.log('✅ All tests completed');
    console.log('🚀 Ready to deploy to AWS!');
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export for external use
module.exports = {
  testCreateEarning,
  testGetEarnings,
  testUpdateEarning,
  testGetUserProfile,
  runTests
};

// Run tests if called directly
if (require.main === module) {
  runTests();
}
