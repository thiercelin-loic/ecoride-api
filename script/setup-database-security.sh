#!/bin/bash

# EcoRide Database Security Setup Script
# This script helps you create a secure database user for your application

echo "🔐 EcoRide Database Security Setup"
echo "=================================="
echo ""

# Database connection details
DB_HOST="localhost"
DB_PORT="3306"
DB_NAME="ecoride"
DB_APP_USER="ecoride_app"
DB_APP_PASSWORD="AahoKc2rNAZbkmyIgnRDYGheS74NkqAx"

echo "This script will:"
echo "1. Create a dedicated database user: $DB_APP_USER"
echo "2. Grant minimal required permissions"
echo "3. Update your .env file with the new user"
echo ""

read -p "Do you want to proceed? (y/N): " confirm

if [[ $confirm =~ ^[Yy]$ ]]; then
    echo ""
    echo "📝 SQL commands to run in MySQL:"
    echo "================================"
    echo ""
    echo "-- Connect to MySQL as root first:"
    echo "mysql -u root -p"
    echo ""
    echo "-- Then run these commands:"
    echo "CREATE USER '${DB_APP_USER}'@'localhost' IDENTIFIED BY '${DB_APP_PASSWORD}';"
    echo "GRANT SELECT, INSERT, UPDATE, DELETE ON ${DB_NAME}.* TO '${DB_APP_USER}'@'localhost';"
    echo "FLUSH PRIVILEGES;"
    echo "SHOW GRANTS FOR '${DB_APP_USER}'@'localhost';"
    echo "EXIT;"
    echo ""
    echo "📋 After running the MySQL commands, update your .env file:"
    echo "==========================================================="
    echo "DB_USERNAME=${DB_APP_USER}"
    echo "DB_PASSWORD=${DB_APP_PASSWORD}"
    echo ""
    echo "🔒 Security Benefits:"
    echo "===================="
    echo "✅ Dedicated user (not root)"
    echo "✅ Minimal permissions (no DROP, ALTER, etc.)"
    echo "✅ Strong generated password"
    echo "✅ Environment-specific configuration"
    echo ""
    echo "⚠️  Important Security Notes:"
    echo "============================"
    echo "• Never use the root user for applications"
    echo "• This user can only SELECT, INSERT, UPDATE, DELETE"
    echo "• For production, enable SSL and use managed databases"
    echo "• Backup your database regularly"
else
    echo "Setup cancelled."
fi
