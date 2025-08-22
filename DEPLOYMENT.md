# SavEarn AWS Deployment Guide

## Prerequisites Setup

### 1. Install AWS CLI

**Windows:**
1. Download AWS CLI from: https://aws.amazon.com/cli/
2. Run the installer and follow the setup wizard
3. Restart your PowerShell/Command Prompt

**Alternative: Use AWS CloudShell**
- Go to: https://console.aws.amazon.com/cloudshell/
- This provides a pre-configured AWS environment in your browser

### 2. Configure AWS Credentials

Run the following command and provide your AWS credentials:

```bash
aws configure
```

You'll need:
- **AWS Access Key ID**: From your AWS IAM user
- **AWS Secret Access Key**: From your AWS IAM user  
- **Default region**: `ap-south-1` (Mumbai)
- **Default output format**: `json`

### 3. Create IAM User (if needed)

If you don't have AWS credentials:

1. Go to AWS Console → IAM → Users
2. Click "Create User"
3. Username: `sav-earn-deploy`
4. Attach policies:
   - `PowerUserAccess` (or create custom policy with these permissions)
   - CloudFormation, Lambda, API Gateway, DynamoDB, Cognito, S3, IAM
5. Create access keys in Security Credentials tab

## Deployment Steps

### 1. Navigate to Backend Directory
```bash
cd "c:\Users\Chowd\OneDrive\Desktop\github\SavEarn\backend"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Deploy to AWS
```bash
serverless deploy
```

**Expected Output:**
```
Service Information
service: sav-earn-backend
stage: dev
region: us-east-1
stack: sav-earn-backend-dev
resources: 15
api keys:
  None
endpoints:
  POST - https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/earnings
  GET - https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/earnings
  PUT - https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/earnings/{id}
  DELETE - https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/earnings/{id}
  GET - https://xxxxxxxx.execute-api.ap-south-1.amazonaws.com/dev/user/profile
functions:
  createEarning: sav-earn-backend-dev-createEarning
  getEarnings: sav-earn-backend-dev-getEarnings
  updateEarning: sav-earn-backend-dev-updateEarning
  deleteEarning: sav-earn-backend-dev-deleteEarning
  getUserProfile: sav-earn-backend-dev-getUserProfile
layers:
  None
```

### 4. Note Important Values

From the deployment output, copy these values:

1. **API Gateway URL**: `https://xxxxxxxx.execute-api.us-east-1.amazonaws.com/dev`
2. **Cognito User Pool ID**: Check CloudFormation outputs
3. **Cognito Client ID**: Check CloudFormation outputs

### 5. Get Cognito Information

Run this command to get Cognito details:
```bash
aws cloudformation describe-stacks --stack-name sav-earn-backend-dev --query 'Stacks[0].Outputs'
```

Look for:
- `CognitoUserPoolId`
- `CognitoClientId`

## Frontend Configuration

Update the file `aws-config.js` with your deployment values:

```javascript
const AWS_CONFIG = {
  API_BASE_URL: 'https://YOUR-API-ID.execute-api.us-east-1.amazonaws.com/dev',
  COGNITO: {
    userPoolId: 'us-east-1_XXXXXXXXX',
    clientId: 'your-cognito-client-id',
    region: 'us-east-1'
  },
  REGION: 'us-east-1'
};
```

## Deploy Frontend to S3

### 1. Create S3 Bucket
```bash
aws s3 mb s3://sav-earn-app-yourname --region us-east-1
```

### 2. Enable Static Website Hosting
```bash
aws s3 website s3://sav-earn-app-yourname --index-document index.html
```

### 3. Upload Files
```bash
aws s3 sync . s3://sav-earn-app-yourname --exclude "backend/*" --exclude "*.md" --exclude ".git/*"
```

### 4. Make Bucket Public
Create bucket policy (replace bucket name):
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sav-earn-app-yourname/*"
    }
  ]
}
```

Apply policy:
```bash
aws s3api put-bucket-policy --bucket sav-earn-app-yourname --policy file://bucket-policy.json
```

## Testing the Deployment

### 1. Test API Endpoints
```bash
# Test health (should return user profile endpoint working)
curl https://your-api-id.execute-api.us-east-1.amazonaws.com/dev/user/profile
```

### 2. Access Your App
Visit: `http://sav-earn-app-yourname.s3-website-us-east-1.amazonaws.com`

## Troubleshooting

### Common Issues:

1. **Access Denied**
   - Check IAM permissions
   - Ensure AWS credentials are configured

2. **Resource Already Exists**
   - Change service name in `serverless.yml`
   - Or use: `serverless remove` then redeploy

3. **CORS Issues**
   - Check API Gateway CORS configuration
   - Ensure frontend domain is allowed

4. **Authentication Fails**
   - Verify Cognito User Pool and Client IDs
   - Check region consistency

### Useful Commands:

```bash
# View logs
serverless logs -f createEarning

# Remove deployment
serverless remove

# Deploy single function
serverless deploy function -f createEarning

# View CloudFormation resources
aws cloudformation describe-stack-resources --stack-name sav-earn-backend-dev
```

## Cost Estimation

Expected monthly costs for moderate usage:
- Lambda: $1
- API Gateway: $3.50  
- DynamoDB: $2
- S3: $0.50
- **Total: ~$7/month**

Free tier covers most usage for the first year.

## Next Steps

1. ✅ Backend deployed
2. ✅ Frontend configured  
3. ✅ S3 hosting setup
4. 🔄 Test full integration
5. 🔄 Add custom domain (optional)
6. 🔄 Setup CloudFront CDN (optional)
7. 🔄 Add monitoring and alerts
