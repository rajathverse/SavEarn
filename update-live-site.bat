@echo off
echo 🔄 Creating CloudFront Invalidation for SavEarn
echo ============================================
echo.

echo 📤 Uploading latest files to S3...
aws s3 sync . s3://savearn-s3-web --exclude "backend/*" --exclude "*.md" --exclude ".git/*" --exclude "*.bat" --exclude "*.sh" --exclude "test-aws.html" --exclude "DEPLOYMENT*" --exclude "*.json"

echo.
echo 🔄 Creating CloudFront invalidation...
aws cloudfront create-invalidation --distribution-id E1H2OCZWIP53E3 --paths "/*" --query "Invalidation.[Id,Status]" --output table

echo.
echo ✅ Cache invalidation created successfully!
echo.
echo 🌐 Your updates will be live at:
echo    https://savearn.rajathverse.com
echo.
echo ⏰ Invalidation typically takes 1-3 minutes to complete.
echo.

pause
