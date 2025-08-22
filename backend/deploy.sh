#!/bin/bash

# SavEarn Backend Deployment Script
# This script will help you deploy the SavEarn backend to AWS

echo "🚀 SavEarn Backend Deployment Script"
echo "======================================"

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "📥 Please install AWS CLI from: https://aws.amazon.com/cli/"
    echo "💡 Alternative: Use AWS CloudShell (https://console.aws.amazon.com/cloudshell/)"
    exit 1
fi

# Check if AWS is configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ AWS CLI is not configured."
    echo "🔧 Please run: aws configure"
    echo "📋 You'll need:"
    echo "   - AWS Access Key ID"
    echo "   - AWS Secret Access Key"
    echo "   - Default region (e.g., us-east-1)"
    echo "   - Default output format (json)"
    exit 1
fi

# Check if serverless is installed
if ! command -v serverless &> /dev/null; then
    echo "❌ Serverless Framework is not installed."
    echo "📥 Installing serverless globally..."
    npm install -g serverless
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy to AWS
echo "☁️  Deploying to AWS..."
echo "⏳ This may take 5-10 minutes..."

serverless deploy

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Note the API Gateway URL from the output above"
    echo "2. Note the Cognito User Pool ID and Client ID"
    echo "3. Update your frontend to use these endpoints"
    echo ""
    echo "🔍 To view logs: serverless logs -f createEarning"
    echo "🗑️  To remove: serverless remove"
else
    echo "❌ Deployment failed!"
    echo "📋 Common issues:"
    echo "1. Check AWS credentials and permissions"
    echo "2. Ensure region supports all required services"
    echo "3. Check for naming conflicts"
fi
