@echo off
echo 🚀 SavEarn S3 Deployment Script
echo ==============================
echo.

REM Get the bucket name from user
set /p BUCKET_NAME="Enter your S3 bucket name (e.g., sav-earn-app-yourname): "

if "%BUCKET_NAME%"=="" (
    echo ❌ Bucket name is required!
    pause
    exit /b 1
)

echo.
echo 📦 Step 1: Creating S3 bucket...
aws s3 mb s3://%BUCKET_NAME% --region ap-south-1

if %errorlevel% neq 0 (
    echo ⚠️  Bucket creation failed. It might already exist or name might be taken.
    echo 🔄 Continuing with deployment...
)

echo.
echo 🌐 Step 2: Enabling static website hosting...
aws s3 website s3://%BUCKET_NAME% --index-document index.html --error-document index.html

echo.
echo 📤 Step 3: Uploading files...
aws s3 sync . s3://%BUCKET_NAME% --exclude "backend/*" --exclude "*.md" --exclude ".git/*" --exclude "*.bat" --exclude "*.sh" --exclude "test-aws.html" --exclude "DEPLOYMENT*"

echo.
echo 🔓 Step 4: Making bucket public...

REM Create bucket policy file
echo {> bucket-policy.json
echo   "Version": "2012-10-17",>> bucket-policy.json
echo   "Statement": [>> bucket-policy.json
echo     {>> bucket-policy.json
echo       "Sid": "PublicReadGetObject",>> bucket-policy.json
echo       "Effect": "Allow",>> bucket-policy.json
echo       "Principal": "*",>> bucket-policy.json
echo       "Action": "s3:GetObject",>> bucket-policy.json
echo       "Resource": "arn:aws:s3:::%BUCKET_NAME%/*">> bucket-policy.json
echo     }>> bucket-policy.json
echo   ]>> bucket-policy.json
echo }>> bucket-policy.json

REM Apply bucket policy
aws s3api put-bucket-policy --bucket %BUCKET_NAME% --policy file://bucket-policy.json

REM Clean up policy file
del bucket-policy.json

echo.
echo ✅ Deployment completed!
echo.
echo 🌐 Your SavEarn app is now available at:
echo    http://%BUCKET_NAME%.s3-website.ap-south-1.amazonaws.com
echo.
echo 🔗 You can also access it via:
echo    https://%BUCKET_NAME%.s3.ap-south-1.amazonaws.com/index.html
echo.
echo 📋 Next steps:
echo 1. Test your live application
echo 2. Create AWS Cognito users and test login
echo 3. Add earnings and verify data persistence
echo 4. (Optional) Set up CloudFront CDN for better performance
echo 5. (Optional) Configure custom domain
echo.

pause
