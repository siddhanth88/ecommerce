# E-commerce Backend API

Production-ready MERN backend for e-commerce application.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Setup
Create `.env` file in backend folder:
```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=30d
FRONTEND_URL=http://localhost:5173
```

### 3. Seed Database
```bash
npm run seed
```

This will create:
- 1 Admin user: `admin@ecommerce.com` / `admin123`
- 1 Regular user: `user@ecommerce.com` / `user123`
- 24 Products (matching frontend data)
- 6 Categories

### 4. Run Server
```bash
# Development
npm run dev

# Production
npm start
```

Server will run on `http://localhost:5000`

## 📋 API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - Login user/admin
- `GET /me` - Get current user [Protected]

### Products (`/api/products`)
- `GET /` - Get all products
- `GET /:id` - Get single product
- `POST /` - Create product [Admin]
- `PUT /:id` - Update product [Admin]
- `DELETE /:id` - Delete product [Admin]

### Orders (`/api/orders`)
- `POST /create` - Create order [Protected]
- `GET /myorders` - Get user orders [Protected]
- `GET /admin` - Get all orders [Admin]

### Admin (`/api/admin`)
- `GET /stats` - Dashboard statistics [Admin]
- `GET /users` - Get all users [Admin]

## 🔐 Default Credentials

After running seeder:
- **Admin**: admin@ecommerce.com / admin123
- **User**: user@ecommerce.com / user123

## 📦 Tech Stack

- Node.js & Express
- MongoDB & Mongoose
- JWT Authentication
- bcryptjs for password hashing
- Security: Helmet, CORS, Rate Limiting

## 🚢 Deployment

Configured for Vercel deployment. See `vercel.json`.

## 📝 License

ISC
