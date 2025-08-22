const { v4: uuidv4 } = require('uuid');
const { dynamodb, response, getUserId } = require('../utils/common');

const TABLE_NAME = process.env.DYNAMODB_TABLE_EARNINGS;

// Create a new earning entry
module.exports.create = async (event) => {
  console.log('🚀 Create earning function started');
  console.log('📥 Event:', JSON.stringify(event, null, 2));
  
  try {
    console.log('🔐 Extracting user ID from event...');
    const userId = getUserId(event);
    console.log('👤 User ID:', userId);
    
    console.log('📋 Parsing request body...');
    const data = JSON.parse(event.body);
    console.log('📦 Request data:', JSON.stringify(data, null, 2));
    
    // Validate required fields
    const { datetime, expensiveOption, expensiveAmount, chosenOption, chosenAmount, description, category } = data;
    
    console.log('✅ Validating required fields...');
    if (!datetime || !expensiveOption || !expensiveAmount || !chosenOption || chosenAmount === undefined) {
      console.log('❌ Missing required fields');
      return response(400, { 
        error: 'Missing required fields: datetime, expensiveOption, expensiveAmount, chosenOption, chosenAmount' 
      });
    }

    if (chosenAmount >= expensiveAmount) {
      console.log('❌ Chosen amount >= expensive amount');
      return response(400, { 
        error: 'Chosen amount must be less than expensive amount' 
      });
    }

    const entryId = uuidv4();
    const earned = expensiveAmount - chosenAmount;
    const date = datetime.split('T')[0]; // Extract date for indexing
    
    console.log('📝 Creating entry object:', { entryId, earned, date });
    
    const item = {
      userId,
      entryId,
      datetime,
      date,
      expensiveOption,
      expensiveAmount: Number(expensiveAmount),
      chosenOption,
      chosenAmount: Number(chosenAmount),
      earned: Number(earned),
      description: description || '',
      category: category || 'general', // Use provided category or default to general
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('💾 Saving to DynamoDB:', JSON.stringify(item, null, 2));
    await dynamodb.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();

    console.log('✅ Entry saved successfully');
    return response(201, { 
      message: 'Earning created successfully',
      data: item
    });

  } catch (error) {
    console.error('❌ Error in create function:', error);
    console.error('Error stack:', error.stack);
    console.error('Error creating earning:', error);
    return response(500, { 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Get all earnings for a user
module.exports.list = async (event) => {
  console.log('🚀 List earnings function started');
  console.log('📥 Event:', JSON.stringify(event, null, 2));
  
  try {
    console.log('🔐 Extracting user ID from event...');
    const userId = getUserId(event);
    console.log('👤 User ID:', userId);
    
    const { limit = 50, lastKey } = event.queryStringParameters || {};
    console.log('📊 Query parameters:', { limit, lastKey });

    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false, // Sort by entryId in descending order (newest first)
      Limit: parseInt(limit)
    };

    if (lastKey) {
      params.ExclusiveStartKey = JSON.parse(decodeURIComponent(lastKey));
    }

    console.log('🔍 DynamoDB query params:', JSON.stringify(params, null, 2));

    const result = await dynamodb.query(params).promise();
    console.log('📊 DynamoDB query result:', { itemCount: result.Items.length, hasMore: !!result.LastEvaluatedKey });

    return response(200, {
      data: result.Items,
      lastKey: result.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(result.LastEvaluatedKey)) : null,
      count: result.Items.length
    });

  } catch (error) {
    console.error('❌ Error in list function:', error);
    console.error('Error stack:', error.stack);
    return response(500, { 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Update an existing earning entry
module.exports.update = async (event) => {
  try {
    const userId = getUserId(event);
    const { id: entryId } = event.pathParameters;
    const data = JSON.parse(event.body);

    // First, check if the item exists and belongs to the user
    const existingItem = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { userId, entryId }
    }).promise();

    if (!existingItem.Item) {
      return response(404, { error: 'Earning entry not found' });
    }

    const { datetime, expensiveOption, expensiveAmount, chosenOption, chosenAmount, description } = data;
    
    if (chosenAmount >= expensiveAmount) {
      return response(400, { 
        error: 'Chosen amount must be less than expensive amount' 
      });
    }

    const earned = expensiveAmount - chosenAmount;
    const date = datetime.split('T')[0];

    const updateParams = {
      TableName: TABLE_NAME,
      Key: { userId, entryId },
      UpdateExpression: 'SET #datetime = :datetime, #date = :date, expensiveOption = :expensiveOption, expensiveAmount = :expensiveAmount, chosenOption = :chosenOption, chosenAmount = :chosenAmount, earned = :earned, description = :description, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#datetime': 'datetime',
        '#date': 'date'
      },
      ExpressionAttributeValues: {
        ':datetime': datetime,
        ':date': date,
        ':expensiveOption': expensiveOption,
        ':expensiveAmount': Number(expensiveAmount),
        ':chosenOption': chosenOption,
        ':chosenAmount': Number(chosenAmount),
        ':earned': Number(earned),
        ':description': description || '',
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.update(updateParams).promise();

    return response(200, {
      message: 'Earning updated successfully',
      data: result.Attributes
    });

  } catch (error) {
    console.error('Error updating earning:', error);
    return response(500, { 
      error: 'Internal server error',
      details: error.message 
    });
  }
};

// Delete an earning entry
module.exports.delete = async (event) => {
  try {
    const userId = getUserId(event);
    const { id: entryId } = event.pathParameters;

    // First, check if the item exists and belongs to the user
    const existingItem = await dynamodb.get({
      TableName: TABLE_NAME,
      Key: { userId, entryId }
    }).promise();

    if (!existingItem.Item) {
      return response(404, { error: 'Earning entry not found' });
    }

    await dynamodb.delete({
      TableName: TABLE_NAME,
      Key: { userId, entryId }
    }).promise();

    return response(200, {
      message: 'Earning deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting earning:', error);
    return response(500, { 
      error: 'Internal server error',
      details: error.message 
    });
  }
};
