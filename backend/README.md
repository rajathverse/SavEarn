# SavEarn Backend

AWS Serverless backend for the SavEarn application using Lambda, API Gateway, DynamoDB, and Cognito.

## Architecture

```
Frontend (S3) → API Gateway → Lambda Functions → DynamoDB
                     ↓
               Cognito User Pool (Authentication)
```

## Features

- ✅ **User Authentication** with AWS Cognito
- ✅ **Earnings CRUD** operations  
- ✅ **User Profile** management
- ✅ **Serverless** architecture
- ✅ **Auto-scaling** with pay-per-use pricing
- ✅ **JWT Token** based security

## API Endpoints

### Authentication (Handled by Cognito)
- User signup/signin through AWS Cognito
- Password reset and email verification
- JWT token generation

### Earnings Management
- `POST /earnings` - Create new earning entry
- `GET /earnings` - Get all user earnings (with pagination)
- `PUT /earnings/{id}` - Update earning entry
- `DELETE /earnings/{id}` - Delete earning entry

### User Management  
- `GET /user/profile` - Get user profile information

## Prerequisites

1. **AWS CLI** configured with appropriate permissions
2. **Node.js** 18.x or later
3. **Serverless Framework** installed globally

```bash
npm install -g serverless
```

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Deploy to AWS
```bash
# Deploy to development environment
serverless deploy

# Deploy to production
serverless deploy --stage prod
```

### 3. Get Deployment Information
After deployment, note the outputs:
- **API Gateway URL** - for frontend configuration
- **Cognito User Pool ID** - for authentication
- **Cognito Client ID** - for authentication

## Environment Variables

The following environment variables are automatically set:
- `DYNAMODB_TABLE_EARNINGS` - DynamoDB table name for earnings
- `COGNITO_USER_POOL_ID` - Cognito User Pool ID
- `COGNITO_CLIENT_ID` - Cognito Client ID

## Database Schema

### Earnings Table (DynamoDB)
```
Primary Key: userId (HASH) + entryId (RANGE)
Global Secondary Index: userId (HASH) + date (RANGE)

Attributes:
- userId: string (Cognito user ID)
- entryId: string (UUID)
- datetime: string (ISO 8601)
- date: string (YYYY-MM-DD for indexing)
- expensiveOption: string
- expensiveAmount: number
- chosenOption: string  
- chosenAmount: number
- earned: number (calculated)
- description: string
- category: string
- createdAt: string (ISO 8601)
- updatedAt: string (ISO 8601)
```

## Local Development

Run the API locally using Serverless Offline:

```bash
npm run dev
```

This starts the API at `http://localhost:3000`

## Testing

```bash
npm test
```

## Deployment Commands

```bash
# Deploy all functions
serverless deploy

# Deploy a single function
serverless deploy function -f createEarning

# View logs
serverless logs -f createEarning

# Remove all resources
serverless remove
```

## Cost Estimation

For moderate usage (1000 users, 10k requests/month):
- **Lambda**: ~$1
- **API Gateway**: ~$3.50  
- **DynamoDB**: ~$2
- **Cognito**: Free (under 50k users)

**Total: ~$6.50/month**

## Security Features

- ✅ **JWT Authentication** via Cognito
- ✅ **User isolation** - users can only access their own data
- ✅ **CORS** configured for frontend domain
- ✅ **Input validation** and sanitization
- ✅ **Error handling** without sensitive data exposure

## Monitoring

AWS CloudWatch automatically monitors:
- Lambda function execution
- API Gateway requests
- DynamoDB operations
- Error rates and latency

## Next Steps

1. Deploy the backend to AWS
2. Update frontend to use AWS APIs
3. Configure Cognito for authentication
4. Test the full integration
5. Add monitoring and alerts
