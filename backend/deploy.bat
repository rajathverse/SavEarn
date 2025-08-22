@echo off
REM SavEarn Backend Deployment Script for Windows
REM This script will help you deploy the SavEarn backend to AWS

echo 🚀 SavEarn Backend Deployment Script
echo ======================================

REM Check if AWS CLI is installed
aws --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not installed.
    echo 📥 Please install AWS CLI from: https://aws.amazon.com/cli/
    echo 💡 Alternative: Use AWS CloudShell (https://console.aws.amazon.com/cloudshell/^)
    pause
    exit /b 1
)

REM Check if AWS is configured
aws sts get-caller-identity >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ AWS CLI is not configured.
    echo 🔧 Please run: aws configure
    echo 📋 You'll need:
    echo    - AWS Access Key ID
    echo    - AWS Secret Access Key
    echo    - Default region (e.g., us-east-1^)
    echo    - Default output format (json^)
    pause
    exit /b 1
)

REM Check if serverless is installed
serverless --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Serverless Framework is not installed.
    echo 📥 Installing serverless globally...
    npm install -g serverless
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install

REM Deploy to AWS
echo ☁️  Deploying to AWS...
echo ⏳ This may take 5-10 minutes...

serverless deploy

if %errorlevel% equ 0 (
    echo.
    echo ✅ Deployment successful!
    echo.
    echo 📋 Next steps:
    echo 1. Note the API Gateway URL from the output above
    echo 2. Note the Cognito User Pool ID and Client ID
    echo 3. Update your frontend to use these endpoints
    echo.
    echo 🔍 To view logs: serverless logs -f createEarning
    echo 🗑️  To remove: serverless remove
) else (
    echo ❌ Deployment failed!
    echo 📋 Common issues:
    echo 1. Check AWS credentials and permissions
    echo 2. Ensure region supports all required services
    echo 3. Check for naming conflicts
)

pause
