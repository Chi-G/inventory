#!/bin/bash

# Elevate Interiors - Production Deployment Script
# Target: forahia.com/inventory

echo "🚀 Starting Post-Deployment Tasks..."

# 1. Backend Dependencies
echo "📦 Optimizing PHP dependencies..."
composer install --optimize-autoloader --no-dev

# 2. Database Tasks
echo "🗄️ Running migrations..."
php artisan migrate --force

echo "🌱 Seeding initial data..."
php artisan db:seed --force

# 3. Optimization
echo "⚡ Optimizing caches..."
# 2. Fix environment variables for subdirectory
sed -i 's|APP_URL=.*|APP_URL=https://forahia.com/inventory|g' .env
sed -i 's|ASSET_URL=.*|ASSET_URL=https://forahia.com/inventory|g' .env

# --- NUCLEAR CACHE CLEAR ---
echo "🧨 Nuclear Cache Clear..."
rm -f bootstrap/cache/config.php
rm -f bootstrap/cache/routes.php
rm -f bootstrap/cache/services.php
rm -f bootstrap/cache/packages.php

# 3. Clear and cache config
# Clear caches first to ensure fresh state
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
# Rebuild caches
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 4. Storage
echo "🔗 Ensuring storage link exists..."
if [ ! -L public/storage ]; then
    php artisan storage:link
fi

echo "✅ Post-Deployment Tasks Successful!"
