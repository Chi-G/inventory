# Elevate Interiors - Inventory Management System

A premium, high-end inventory management solution designed for **Elevate Interiors**. Built with a focus on visual excellence, operational accuracy, and a seamless user experience.

## Key Features

- **Intelligent Dashboard**: Real-time KPIs for total stock value, item counts, and low-stock alerts.
- **Advanced Catalog Management**: 
  - Hierarchical category structure (Furniture, Lighting, Decor, etc.).
  - Custom product attributes and JSON-based specifications.
  - Image gallery support for all catalog items.
- **Stock Logistics & Audit**: 
  - Traceable stock movements (Inflow/Outflow) linked to users and suppliers.
  - Automated adjustment logs for full transparency.
- **Analytics & Reporting**: 
  - **Inventory Velocity**: Interactive 30-day trend charts using Recharts.
  - **Data Portability**: CSV Exports for catalog audits and movement logs.
  - **Professional Product Sheets**: Generate elegant A4 datasheets with branding, full specs, and barcodes for physical inventory.
- **Handheld Scanner Integration**: 
  - Mobile-optimized barcode scanning (HTML5-QRCode).
  - Haptic/Audio feedback (Beeps) for successful logistics operations.
- **Real-time Notifications**:
  - **Live Inventory Sync**: Powered by Pusher. Notifications appear instantly across all logged-in devices when stock movements occur.
  - **Activity Feed**: Listen to "Stock Added", "Stock Removed", or "Adjusted" events in real-time.
- **Secure RBAC**: Granular roles for Super Admin, Admin, Manager, and Staff.
- **Automated CI/CD**: 
  - **GitHub Actions**: Integrated pipeline for zero-downtime deployments to Hostinger.

## Technology Stack

- **Framework**: [Laravel 13.x](https://laravel.com)
- **Frontend**: [React 18](https://reactjs.org) with [Inertia.js](https://inertiajs.com)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) (Premium curated palettes)
- **Analytics**: [Recharts](https://recharts.org)
- **Database**: MySQL 8.x

## Local Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Chi-G/inventory.git
   cd inventory
   ```

2. **Install Dependencies**:
   ```bash
   composer install
   npm install
   ```

3. **Environment Setup**:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Database Configuration**:
   Create a database named `elevate` and update your `.env` file credentials.

5. **Run Migrations & Seeders**:
   ```bash
   php artisan migrate --seed
   ```

6. **Start Development**:
   ```bash
   npm run dev
   # In a separate terminal
   php artisan serve
   ```

## Production Deployment

The application is pre-configured for deployment in subdirectories (specifically `forahia.com/inventory/`).

### Hostinger Deployment Logic

1. **Update Code**:
   ```bash
   git pull origin main
   ```

2. **Run Deployment Script**:
   ```bash
   sh deploy.sh
   ```

*Live Demo:* [https://elevate-interiors-main-u9gujh.laravel.cloud](https://elevate-interiors-main-u9gujh.laravel.cloud)

## Environment Configuration
The application is environment-aware and supports both root-domain (Laravel Cloud) and subdirectory (Hostinger) deployments. Use the `APP_URL` and `ASSET_URL` environment variables to configure your specific instance.

## Ownership

Proprietary software developed for **Elevate Interiors**.

---
© 2026 Elevate Interiors Inc. All Rights Reserved.
