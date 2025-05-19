# The Men - Backend API

Backend API service for The Men e-commerce application.

## Technologies Used

- Node.js
- Express.js
- MongoDB/Mongoose
- JWT Authentication
- AWS S3 for file storage
- Passport.js for social auth

## Getting Started

### Prerequisites

- Node.js 16+ installed
- MongoDB instance (local or remote)
- AWS S3 account (for file uploads)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd The_men
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017/themen
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=90d
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_BUCKET_NAME=your_s3_bucket_name
AWS_REGION=your_aws_region
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
NODE_ENV=development
```

4. Start the development server
```bash
npm run dev
```

## Project Structure

```
src/
├── config/             # Application configuration
├── helpers/            # Helper functions and utilities
├── middleware/         # Middleware functions
├── models/             # Mongoose models
├── modules/            # API modules (controllers, routes)
│   └── Api/            # API v1.0 endpoints
├── util/               # Utility functions
└── server.js           # Entry point
```

## API Endpoints

The API is organized around RESTful resources:

- `/api/auth` - Authentication endpoints
- `/api/user` - User management
- `/api/product` - Product management
- `/api/category` - Category management
- `/api/order` - Order management
- `/api/cart` - Shopping cart functionality
- `/api/file` - File upload/management
- `/api/address` - User addresses
- `/api/variant` - Product variants
- `/api/collection` - Product collections
- `/api/supplier` - Supplier management
- `/api/slider` - Slider management
- `/api/voucher` - Vouchers/coupons

## Database Seeding

To seed the database with sample data:

```bash
npm run db:seed
```

## License

ISC 