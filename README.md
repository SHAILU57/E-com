# 🛍️ E-Commerce Full-Stack Application

A modern, feature-rich e-commerce platform built with Node.js, Express, MongoDB, and React. This application provides a complete shopping experience with user authentication, product management, cart functionality, and admin panel.

## 🚀 Features

### 🛍️ Customer Features
- **User Authentication**: Secure registration and login system with JWT tokens
- **Product Catalog**: Browse products with advanced search and filtering
- **Product Categories**: Organized shopping by categories
- **Product Details**: Detailed product pages with specifications and reviews
- **Shopping Cart**: Add, update, and remove items from cart
- **Order Management**: View order history and track orders
- **User Profile**: Manage personal information and addresses
- **Responsive Design**: Mobile-first design with Material-UI

### 🛠️ Admin Features
- **Product Management**: Create, read, update, delete products
- **Image Upload**: Support for product images via Multer
- **Order Management**: View and manage customer orders
- **Admin Dashboard**: Comprehensive admin interface
- **User Management**: View and manage customer accounts

### 🔧 Technical Features
- **RESTful API**: Well-structured API endpoints
- **Authentication & Authorization**: JWT-based auth with role-based access
- **Input Validation**: Comprehensive form validation
- **Error Handling**: Robust error handling throughout
- **Rate Limiting**: API protection against abuse
- **Security**: Helmet.js for security headers
- **Database**: MongoDB with Mongoose ODM
- **File Uploads**: Multer for image handling

## 📋 Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB** (v4.0 or higher)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/SHAILU57/E-com.git
cd E-com
```

### 2. Install Dependencies

#### Backend Dependencies
```bash
npm install
```

#### Frontend Dependencies
```bash
cd client
npm install
cd ..
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Configuration
PORT=5000
NODE_ENV=development

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Stripe Configuration (Optional for payments)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 4. Database Setup

#### Option A: Local MongoDB
```bash
# Start MongoDB service
net start MongoDB

# Or run MongoDB manually
mongod --dbpath "C:\data\db"
```

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in your `.env` file

### 5. Seed the Database (Optional)
```bash
npm run seed
```

### 6. Start the Application

#### Start Backend Server
```bash
npm start
```

#### Start Frontend Development Server
```bash
cd client
npm start
```

Or for production:
```bash
cd client
npm run build
```

## 🌐 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health
- **API Documentation**: http://localhost:5000/api-docs (if enabled)

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with pagination, search, filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item quantity
- `DELETE /api/cart/remove/:id` - Remove item from cart
- `DELETE /api/cart/clear` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order details

## 🏗️ Project Structure

```
E-com/
├── client/                 # React Frontend
│   ├── public/             # Static files
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── App.tsx         # Main App component
│   │   └── index.tsx       # Entry point
│   └── package.json        # Frontend dependencies
├── models/                 # Mongoose models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── utils/                 # Utility functions
├── uploads/                # Uploaded images
├── server.js               # Server entry point
├── seed.js                 # Database seeder
├── package.json            # Backend dependencies
└── .env                   # Environment variables
```

## 🎨 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File uploads
- **Stripe** - Payment processing
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **Rate Limiting** - API protection

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - UI component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Context** - State management

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Input Validation**: Comprehensive validation with express-validator
- **Rate Limiting**: Protection against brute force attacks
- **Security Headers**: Helmet.js for HTTP security
- **CORS Configuration**: Proper Cross-Origin Resource Sharing
- **Environment Variables**: Secure configuration management

## 🧪 Testing

### Run Backend Tests
```bash
npm test
```

### Run Frontend Tests
```bash
cd client
npm test
```

## 📦 Available Scripts

### Backend Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run backend tests
- `npm run seed` - Seed database with sample data

### Frontend Scripts
- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run frontend tests
- `npm eject` - Eject from Create React App

## 🚀 Deployment

### Backend Deployment (e.g., Heroku, Vercel)
1. Set environment variables in your hosting platform
2. Build and deploy the Node.js application
3. Configure MongoDB connection string

### Frontend Deployment (e.g., Netlify, Vercel)
1. Build the React application:
   ```bash
   cd client
   npm run build
   ```
2. Deploy the `build` folder to your hosting platform
3. Configure API base URL if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Author

**SHAILU57** - [GitHub Profile](https://github.com/SHAILU57)

## 🤝 Acknowledgments

- [Material-UI](https://mui.com/) for the excellent UI components
- [Express.js](https://expressjs.com/) for the robust web framework
- [MongoDB](https://www.mongodb.com/) for the scalable database solution
- [React](https://reactjs.org/) for the powerful UI library

## 📞 Support

If you encounter any issues or have questions, please:
1. Check the existing [Issues](https://github.com/SHAILU57/E-com/issues)
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

---

## 🔥 Quick Start Guide

1. **Clone & Install**
   ```bash
   git clone https://github.com/SHAILU57/E-com.git
   cd E-com
   npm install
   cd client && npm install && cd ..
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start MongoDB**
   ```bash
   mongod
   ```

4. **Run Application**
   ```bash
   # Terminal 1 - Backend
   npm start
   
   # Terminal 2 - Frontend
   cd client && npm start
   ```

5. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

**Happy Shopping! 🛍️**