@echo off
echo 🚀 SavEarn AWS Setup Helper
echo ==========================
echo.

echo 📋 This script will guide you through the AWS setup process.
echo.

echo ✅ Step 1: Install AWS CLI
echo    Download from: https://aws.amazon.com/cli/
echo    Or use AWS CloudShell: https://console.aws.amazon.com/cloudshell/
echo.
pause

echo ✅ Step 2: Configure AWS Credentials
echo    Run: aws configure
echo.
echo    You'll need:
echo    - AWS Access Key ID
echo    - AWS Secret Access Key  
echo    - Default region: us-east-1
echo    - Default output format: json
echo.
pause

echo ✅ Step 3: Test AWS Connection
aws sts get-caller-identity
if %errorlevel% equ 0 (
    echo.
    echo ✅ AWS CLI is configured correctly!
    echo.
) else (
    echo.
    echo ❌ AWS CLI is not configured. Please run: aws configure
    echo.
    pause
    exit /b 1
)

echo ✅ Step 4: Deploy Backend
echo    Navigate to backend directory and run:
echo    npm install
echo    serverless deploy
echo.
pause

echo ✅ Step 5: Update Frontend Configuration
echo    After deployment, update aws-config.js with:
echo    - API Gateway URL
echo    - Cognito User Pool ID  
echo    - Cognito Client ID
echo.
pause

echo ✅ Step 6: Deploy Frontend to S3
echo    1. Create S3 bucket
echo    2. Enable static website hosting
echo    3. Upload files
echo    4. Configure bucket policy
echo.

echo 📚 For detailed instructions, see DEPLOYMENT.md
echo.
echo 🎉 Ready to deploy SavEarn to AWS!

pause
