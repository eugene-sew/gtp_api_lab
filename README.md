# Lab 1 Analytics API

A specialized API designed to meet the analytical needs of **Lab 1**, offering detailed insights into customer behavior, sales trends, and product performance.

🌐 **Live API Documentation** Application is no longer live  : [http://63.34.163.46/api-docs/#/](http://63.34.163.46/api-docs/#/)

## Features

- 📊 **Top Customer Analysis**: Identify the lab's highest-spending customers.
- 📈 **Monthly Sales Reports**: Gain insights into the lab's monthly revenue trends.
- 🏷️ **Product Performance Tracking**: Evaluate which lab products perform best.
- 🌍 **Country-wise Order Statistics**: Analyze lab orders by region for strategic planning.
- 👥 **Frequent Customer Identification**: Find customers who regularly purchase from the lab.

## Cloud Architecture

The application is deployed in AWS (eu-west-1a) using a secure VPC architecture with the following components:

![VPC Architecture: Public/Private Subnets with Express.js and RDS](./screenshots/architecture.png)

### VPC Configuration

- **Public Subnet**:

    - Houses the Express.js application in Docker
    - Connected to Internet Gateway for public access
    - Security group controls inbound/outbound traffic (port/IP based)

- **Private Subnet**:
    - Contains RDS database instance
    - No direct internet access
    - Security group allows inbound connections only from Public Subnet
    - Includes automated backup/snapshot functionality

### Security Features

- Segregated network architecture with public/private subnets
- Restricted database access (only accessible from application tier)
- Security groups implementing principle of least privilege
- Automated database backups for disaster recovery

## Prerequisites

- Node.js 20.x
- Docker (optional)
- MySQL database

## Quick Start with Docker

```bash
# Clone the repository
git clone https://github.com/eugene-sew/gtp_api_lab.git
cd gtp_api_lab

# Navigate to the API directory
cd api

# Create .env file (see Environment Variables section)
cp .env.example .env

# Build and run with Docker
docker build -t lab-1-api .
docker run -p 80:80 --env-file .env lab-1-api
```

## Manual Setup

```bash
# Clone the repository
git clone https://github.com/eugene-sew/gtp_api_lab.git
cd lab_api

# Navigate to the API directory
cd api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the development server
npm run start:dev
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DATABASE_URL="mysql://user:password@localhost:5432/lab_1_db"

# Server Configuration
PORT=80
HOST=localhost  # or your server IP address

# Optional Configuration
NODE_ENV=development
```

## API Documentation

Once the server is running, access the Swagger documentation at:

```
http://localhost:8080/api-docs
```

### Key Endpoints

#### Analytics Endpoints

1. **Top Spenders**

    - `GET /api/lab/top-spenders?limit=10`
    - Get top customers by total spending

    ![Top Spenders Analysis](./screenshots/spending.png)

2. **Monthly Sales Report**

    - `GET /api/lab/monthly-sales?year=2024&month=3`
    - Get detailed sales report for a specific month

    ![Monthly Sales Analytics](./screenshots/analytics.png)

3. **Non-selling Products**

    - `GET /api/lab/non-selling-products`
    - List products that have never been ordered

    ![Non-selling Products Analysis](./screenshots/null_prod.png)

4. **Country Statistics**

    - `GET /api/lab/country-stats`
    - Get average order value by country

    ![Country-wise Order Statistics](./screenshots/country_avg.png)

5. **Frequent Customers**

    - `GET /api/lab/frequent-customers?minOrders=2`
    - Identify customers with frequent purchases

    ![Frequent Customer Analysis](./screenshots/frequent.png)

## Project Structure

```
lab_api/
├── api/                         # Backend API implementation
│   ├── src/
│   │   ├── controllers/
│   │   │   └── lab.controllers.ts    # Request handlers
│   │   ├── services/
│   │   │   └── lab.service.ts        # Business logic
│   │   ├── routes/
│   │   │   └── lab.routes.ts         # API routes
│   │   └── config/
│   │       └── swagger.ts            # API documentation
│   ├── prisma/
│   │   └── schema.prisma             # Database schema
│   └── Dockerfile                    # Docker configuration
├── scripts/                     # SQL Query Scripts
│   ├── frequent_buyers.sql      # Frequent customer analysis
│   ├── country_order_avg.sql    # Country-wise order statistics
│   ├── never_ordered.sql        # Non-selling products
│   ├── monthly_sales.sql        # Monthly sales analysis
│   └── top_spending_query.sql   # Top spenders analysis
```

## Development

```bash
# Run in development mode
npm run start:dev


## Database Schema

The application uses Prisma as the ORM with MySQL. Key models include:

* Customers
* Orders
* Products
* OrderItems
```
