# Stage 1: Build Frontend
FROM node:20-alpine AS node-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Build Backend Dependencies
FROM composer:2 AS composer-builder
WORKDIR /app
COPY composer*.json ./
RUN composer install --no-dev --optimize-autoloader --no-scripts --ignore-platform-reqs
COPY . .
RUN composer dump-autoload --optimize --no-dev

# Stage 3: Final Production Image
FROM dunglas/frankenphp:latest-php8.3-alpine AS final

# Install required PHP extensions
RUN install-php-extensions \
    pcntl \
    bcmath \
    gd \
    intl \
    pdo_mysql \
    redis \
    zip

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY --from=composer-builder /app /var/www/html
COPY --from=node-builder /app/public/build /var/www/html/public/build

# Setup environment
ENV APP_ENV=production
ENV APP_DEBUG=false
ENV FRANKENPHP_CONFIG="worker ./public/index.php"

# Fix permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port
EXPOSE 80 443

# Entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint
RUN chmod +x /usr/local/bin/docker-entrypoint
ENTRYPOINT ["docker-entrypoint"]

# Run FrankenPHP
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
