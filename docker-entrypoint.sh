#!/bin/sh
set -e

# Link storage if not already linked
if [ ! -L /var/www/html/public/storage ]; then
    php artisan storage:link --force
fi

# Run migrations in production
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running migrations..."
    php artisan migrate --force
fi

# Cache clearing and optimization
echo "Optimizing Laravel..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Execute the main command (FrankenPHP)
exec "$@"
