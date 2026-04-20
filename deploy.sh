#!/bin/bash

# Elevate Interiors - Production Deployment Script
# Target: forahia.com/inventory

echo "🚀 Starting Deployment for Elevate Interiors..."

# 1. Update CodeBase
echo "📥 Pulling latest changes from GitHub..."
git pull origin main

# 2. Backend Dependencies
echo "📦 Installing PHP dependencies..."
composer install --optimize-autoloader --no-dev

# 3. Frontend Assets
echo "🎨 Building assets for subdirectory (/inventory)..."
npm install
npm run build

# 4. Database Optimization
echo "🗄️ Running migrations..."
php artisan migrate --force

# 5. Optimization
echo "⚡ Optimizing caches..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Storage
echo "🔗 Ensuring storage link exists..."
php artisan storage:link

echo "✅ Deployment Successful! Visit https://forahia.com/inventory"
