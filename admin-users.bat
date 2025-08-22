@echo off
echo 👥 SavEarn User Management - Admin Commands
echo =========================================
echo.

set USER_POOL_ID=ap-south-1_zybIVZnp4

echo 📋 1. List All Users
echo Command: aws cognito-idp list-users --user-pool-id %USER_POOL_ID% --region ap-south-1
echo.

echo 👤 2. Get User Details (replace EMAIL with actual email)
echo Command: aws cognito-idp admin-get-user --user-pool-id %USER_POOL_ID% --username EMAIL --region ap-south-1
echo.

echo ✅ 3. Confirm User Email (if unverified)
echo Command: aws cognito-idp admin-confirm-sign-up --user-pool-id %USER_POOL_ID% --username EMAIL --region ap-south-1
echo.

echo 🔒 4. Disable User
echo Command: aws cognito-idp admin-disable-user --user-pool-id %USER_POOL_ID% --username EMAIL --region ap-south-1
echo.

echo 🔓 5. Enable User
echo Command: aws cognito-idp admin-enable-user --user-pool-id %USER_POOL_ID% --username EMAIL --region ap-south-1
echo.

echo 🔄 6. Reset User Password
echo Command: aws cognito-idp admin-set-user-password --user-pool-id %USER_POOL_ID% --username EMAIL --password "NewPassword123" --permanent --region ap-south-1
echo.

echo 🗑️ 7. Delete User
echo Command: aws cognito-idp admin-delete-user --user-pool-id %USER_POOL_ID% --username EMAIL --region ap-south-1
echo.

echo 📊 8. Get User Pool Statistics
echo Command: aws cognito-idp describe-user-pool --user-pool-id %USER_POOL_ID% --region ap-south-1
echo.

:menu
echo Choose an action:
echo 1. List all users
echo 2. Get user details
echo 3. Confirm user email
echo 4. Disable user
echo 5. Enable user
echo 6. Reset password
echo 7. Delete user
echo 8. Get pool stats
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" (
    echo.
    echo 📋 Listing all users...
    aws cognito-idp list-users --user-pool-id %USER_POOL_ID% --region ap-south-1
    echo.
    goto menu
)

if "%choice%"=="2" (
    set /p email="Enter user email: "
    echo.
    echo 👤 Getting user details for %email%...
    aws cognito-idp admin-get-user --user-pool-id %USER_POOL_ID% --username %email% --region ap-south-1
    echo.
    goto menu
)

if "%choice%"=="3" (
    set /p email="Enter user email to confirm: "
    echo.
    echo ✅ Confirming user %email%...
    aws cognito-idp admin-confirm-sign-up --user-pool-id %USER_POOL_ID% --username %email% --region ap-south-1
    echo User confirmed successfully!
    echo.
    goto menu
)

if "%choice%"=="4" (
    set /p email="Enter user email to disable: "
    echo.
    echo 🔒 Disabling user %email%...
    aws cognito-idp admin-disable-user --user-pool-id %USER_POOL_ID% --username %email% --region ap-south-1
    echo User disabled successfully!
    echo.
    goto menu
)

if "%choice%"=="5" (
    set /p email="Enter user email to enable: "
    echo.
    echo 🔓 Enabling user %email%...
    aws cognito-idp admin-enable-user --user-pool-id %USER_POOL_ID% --username %email% --region ap-south-1
    echo User enabled successfully!
    echo.
    goto menu
)

if "%choice%"=="6" (
    set /p email="Enter user email: "
    set /p password="Enter new password: "
    echo.
    echo 🔄 Resetting password for %email%...
    aws cognito-idp admin-set-user-password --user-pool-id %USER_POOL_ID% --username %email% --password "%password%" --permanent --region ap-south-1
    echo Password reset successfully!
    echo.
    goto menu
)

if "%choice%"=="7" (
    set /p email="Enter user email to delete: "
    set /p confirm="Are you sure? Type 'DELETE' to confirm: "
    if "%confirm%"=="DELETE" (
        echo.
        echo 🗑️ Deleting user %email%...
        aws cognito-idp admin-delete-user --user-pool-id %USER_POOL_ID% --username %email% --region ap-south-1
        echo User deleted successfully!
    ) else (
        echo Deletion cancelled.
    )
    echo.
    goto menu
)

if "%choice%"=="8" (
    echo.
    echo 📊 Getting user pool statistics...
    aws cognito-idp describe-user-pool --user-pool-id %USER_POOL_ID% --region ap-south-1 --query "UserPool.EstimatedNumberOfUsers"
    echo.
    goto menu
)

if "%choice%"=="9" (
    echo Goodbye!
    exit /b 0
)

echo Invalid choice. Please try again.
goto menu
